import { NextResponse } from "next/server";
import Stripe from "stripe";
import { stripe } from "@/lib/stripe";
import { saveBookingOnce } from "@/lib/bookings";



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

  const result = saveBookingOnce({
    stripeSessionId: session.id,
    amount: session.amount_total ?? 0,
    currency: session.currency ?? "usd",
    email: session.customer_details?.email ?? undefined,
    metadata: session.metadata ?? {},
  });

  console.log("✅ BOOKING SAVED");
  console.log({
    reference: result.reference,
    sessionId: session.id,
  });
}


  return NextResponse.json({ received: true });
}
