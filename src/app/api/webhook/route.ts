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
    const bookingDetails = `Booking reference: ${booking.reference}\nTour: ${tourName}\nStart date: ${md.startDate ?? "—"}\nTravellers: Adults ${md.adults ?? "0"}, Children ${md.children ?? "0"}, Infants ${md.infants ?? "0"}`;

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
      await sendBookingEmail({
        to: adminEmail,
        subject: `New booking: ${tourName} (${booking.reference})`,
        text: `New booking received from ${email ?? "unknown customer"}.\n\n---\n${bookingDetails}\n\n---\nCopy of customer email:\n\n${customerEmailText}`,
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