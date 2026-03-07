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
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Unknown webhook error";
    console.error("Webhook signature verification failed:", message);
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
    const customerName = md.customerName ?? session.customer_details?.name ?? "—";
    const nationality = md.nationality ?? "—";

    if (email) {
      await sendBookingEmail({
        to: email,
        subject: `Sri Lanka Tours booking confirmed (${booking.reference})`,
        text: `Thanks! Your booking is confirmed.\n\nReference: ${booking.reference}\nItinerary: ${
          md.itineraryTitle ?? md.itinerarySlug ?? "—"
        }\nName: ${customerName}\nNationality: ${nationality}\nStart date: ${md.startDate ?? "—"}\nTier: ${
          md.tier ?? "—"
        }\nTravellers: Adults ${md.adults ?? "0"}, Children ${
          md.children ?? "0"
        }, Infants ${md.infants ?? "0"}\n\nWe’ll be in touch shortly.`,
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
