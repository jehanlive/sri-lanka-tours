import { NextResponse } from "next/server";
import Stripe from "stripe";
import { stripe } from "@/lib/stripe";
import { sendBookingEmail } from "@/lib/email";
import { prisma } from "@/lib/prisma";
import { nextBookingReference } from "@/lib/bookingRef";

export async function POST(req: Request) {
  const sig = req.headers.get("stripe-signature");
  if (!sig) {
    return NextResponse.json({ error: "Missing signature" }, { status: 400 });
  }

  const rawBody = await req.arrayBuffer();
  const body = Buffer.from(rawBody);

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err: any) {
    console.error("Webhook signature verification failed:", err.message);
    return NextResponse.json({ error: "Webhook Error" }, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    const sessionId = session.id;

    // Stripe retries webhooks. Prevent duplicate saves.
    const existing = await prisma.booking.findUnique({
      where: { stripeSessionId: sessionId },
    });

    if (existing) {
      console.log("ℹ️ Webhook already processed for session:", sessionId);
      return NextResponse.json({ received: true });
    }

    const md = session.metadata ?? {};
    const reference = await nextBookingReference();

    const booking = await prisma.booking.create({
      data: {
        reference,
        stripeSessionId: sessionId,
        amount: session.amount_total ?? 0,
        currency: session.currency ?? "usd",
        email: session.customer_details?.email ?? undefined,
        customerName: md.customerName ?? undefined,
        nationality: md.nationality ?? undefined,
        rooms: md.rooms ?? undefined,

        itinerarySlug: md.itinerarySlug ?? "unknown",
        itineraryTitle: md.itineraryTitle ?? undefined,
        startDate: md.startDate ?? "",
        tier: md.tier ?? "",
        adults: Number(md.adults ?? "0"),
        children: Number(md.children ?? "0"),
        infants: Number(md.infants ?? "0"),
        days: Number(md.days ?? "0"),
      },
    });

    const email = session.customer_details?.email;
    const tourName = md.itineraryTitle ?? md.itinerarySlug ?? "your tour";

    // Parse rooms JSON for a readable breakdown
    let roomsText = "—";
    try {
      const roomsArr: Array<{ adults: number; childAges: number[] }> = JSON.parse(md.rooms ?? "[]");
      if (roomsArr.length > 0) {
        roomsText = roomsArr
          .map((r, i) => {
            const children = r.childAges.length;
            const childDetail = children > 0 ? ` + ${children} child${children > 1 ? "ren" : ""} (ages: ${r.childAges.join(", ")})` : "";
            return `  Room ${i + 1}: ${r.adults} adult${r.adults !== 1 ? "s" : ""}${childDetail}`;
          })
          .join("\n");
      }
    } catch { /* ignore parse errors */ }

    const amountFormatted = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format((session.amount_total ?? 0) / 100);

    const bookingDetails = `Booking reference: ${booking.reference}
Tour: ${tourName}
Start date: ${md.startDate ?? "—"}
Travellers: Adults ${md.adults ?? "0"}, Children ${md.children ?? "0"}, Infants ${md.infants ?? "0"}`;

    const customerEmailText = `Thank you for choosing us for your Sri Lanka tour.

We are currently working with our hotel partners to finalise your room availability. You will receive your booking confirmation email within 24 hours.

If, for any reason, we are unable to confirm your reservation, our team will contact you within 48 hours to assist you with the available options.

We appreciate your patience and look forward to making your Sri Lanka experience unforgettable.

---
${bookingDetails}`;

    if (email) {
      await sendBookingEmail({
        to: email,
        subject: `Your Sri Lanka tour booking – ${tourName} (${booking.reference})`,
        text: customerEmailText,
      });
    }

    const adminEmail = process.env.ADMIN_EMAIL;
    if (adminEmail) {
      const adminDetails = `BOOKING REFERENCE: ${booking.reference}
Stripe Session: ${sessionId}

--- CUSTOMER ---
Name:        ${md.customerName ?? "—"}
Email:       ${email ?? "—"}
Nationality: ${md.nationality ?? "—"}

--- TOUR ---
Itinerary:   ${tourName} (${md.itinerarySlug ?? "—"})
Start date:  ${md.startDate ?? "—"}
Duration:    ${md.days ?? "—"} days
Hotel level: ${md.tier ?? "—"}
Start from:  ${md.startFrom ?? "—"}
End at:      ${md.endLocation ?? "—"}
Meal plan:   ${md.mealPlan ?? "—"}

--- ROOM ARRANGEMENTS ---
${roomsText}

--- TOTALS ---
Adults:   ${md.adults ?? "0"}
Children: ${md.children ?? "0"}
Infants:  ${md.infants ?? "0"}
Amount paid: ${amountFormatted}`;

      await sendBookingEmail({
        to: adminEmail,
        subject: `New booking: ${tourName} (${booking.reference})`,
        text: `New booking received.\n\n${adminDetails}`,
      });
    }

    console.log("✅ BOOKING SAVED (DB)");
    console.log({
      reference: booking.reference,
      sessionId: booking.stripeSessionId,
    });
  }

  return NextResponse.json({ received: true });
}