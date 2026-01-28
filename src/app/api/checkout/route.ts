import { NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { validateBookingInput } from "@/lib/bookingRules";
import type { Tier } from "@/lib/pricing";
import { quoteUsdCents } from "@/lib/pricing";
import { itineraries } from "@/lib/itineraries";

type Body = {
  slug: string;
  startDate: string;
  tier: Tier;
  adults: number;
  children: number;
  infants: number;
};

export async function POST(req: Request) {
  const body = (await req.json()) as Body;

  const itinerary = itineraries.find((i) => i.slug === body.slug);
  if (!itinerary) {
    return NextResponse.json({ ok: false, errors: ["Invalid itinerary."] }, { status: 400 });
  }

  const validation = validateBookingInput({
    days: itinerary.days,
    startDate: body.startDate,
    tier: body.tier,
    adults: body.adults,
    children: body.children,
    infants: body.infants,
  });

  if (!validation.ok) {
    return NextResponse.json({ ok: false, errors: validation.errors }, { status: 400 });
  }

  const totalUsdCents = quoteUsdCents({
    days: itinerary.days,
    tier: body.tier,
    adults: body.adults,
    children: body.children,
    infants: body.infants,
  });

  const appUrl = process.env.APP_URL || "http://localhost:3000";

  const session = await stripe.checkout.sessions.create({
    mode: "payment",
    success_url: `${appUrl}/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${appUrl}/review?slug=${encodeURIComponent(itinerary.slug)}&title=${encodeURIComponent(
      itinerary.title
    )}&days=${itinerary.days}&startDate=${encodeURIComponent(body.startDate)}&tier=${encodeURIComponent(
      body.tier
    )}&adults=${body.adults}&children=${body.children}&infants=${body.infants}&totalUsdCents=${totalUsdCents}`,
    line_items: [
      {
        quantity: 1,
        price_data: {
          currency: "usd",
          product_data: {
            name: `${itinerary.title} (${itinerary.days} days)`,
            description: `Start date: ${body.startDate} • Tier: ${body.tier} • Adults: ${body.adults} • Children: ${body.children} • Infants: ${body.infants}`,
          },
          unit_amount: totalUsdCents,
        },
      },
    ],
    metadata: {
      itinerarySlug: itinerary.slug,
      startDate: body.startDate,
      tier: body.tier,
      adults: String(body.adults),
      children: String(body.children),
      infants: String(body.infants),
      days: String(itinerary.days),
    },
  });

  return NextResponse.json({ ok: true, url: session.url });
}

