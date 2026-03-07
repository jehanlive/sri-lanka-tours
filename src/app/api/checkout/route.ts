import { NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { validateBookingInput } from "@/lib/bookingRules";
import type { QuoteInput } from "@/lib/pricing";
import { endpointLabels, formatUsd, hotelLevelLabels, quoteItinerary } from "@/lib/pricing";
import { itineraries } from "@/lib/itineraries";
import { isUnMemberState } from "@/lib/unMemberStates";

type Body = QuoteInput & {
  customerName: string;
  customerEmail: string;
  nationality: string;
};

function legacyTierFromHotelLevel(level: Body["hotelLevel"]): string {
  if (level === "STANDARD") return "STAR3";
  if (level === "SUPERIOR") return "STAR4";
  return "STAR5";
}

export async function POST(req: Request) {
  const body = (await req.json()) as Body;
  const customerName = String(body.customerName ?? "").trim();
  const customerEmail = String(body.customerEmail ?? "").trim();
  const nationality = String(body.nationality ?? "").trim();

  const itinerary = itineraries.find((i) => i.slug === body.slug);
  if (!itinerary) {
    return NextResponse.json({ ok: false, errors: ["Invalid itinerary."] }, { status: 400 });
  }

  const validation = validateBookingInput({ ...body, days: itinerary.days });
  if (!validation.ok) {
    return NextResponse.json({ ok: false, errors: validation.errors }, { status: 400 });
  }

  const checkoutErrors: string[] = [];
  if (!customerName) checkoutErrors.push("Full name is required.");
  if (!customerEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(customerEmail)) {
    checkoutErrors.push("Valid email is required.");
  }
  if (!nationality || !isUnMemberState(nationality)) {
    checkoutErrors.push("Please select a valid nationality.");
  }
  if (checkoutErrors.length > 0) {
    return NextResponse.json({ ok: false, errors: checkoutErrors }, { status: 400 });
  }

  let quote;
  try {
    quote = quoteItinerary(body);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Checkout quote failed.";
    return NextResponse.json({ ok: false, errors: [message] }, { status: 400 });
  }

  const appUrl = process.env.APP_URL || "http://localhost:3000";
  const roomsCompact = JSON.stringify(body.rooms);
  const cancelQs = new URLSearchParams({
    slug: itinerary.slug,
    title: itinerary.title,
    days: String(itinerary.days),
    startDate: body.startDate,
    startFrom: body.startFrom,
    endLocation: body.endLocation,
    hotelLevel: body.hotelLevel,
    mealPlan: body.mealPlan,
    customerName,
    customerEmail,
    nationality,
    rooms: roomsCompact,
    totalUsdCents: String(quote.totalUsdCents),
  });

  const session = await stripe.checkout.sessions.create({
    mode: "payment",
    success_url: `${appUrl}/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${appUrl}/review?${cancelQs.toString()}`,
    customer_email: customerEmail,
    line_items: [
      {
        quantity: 1,
        price_data: {
          currency: "usd",
          product_data: {
            name: `${itinerary.title} (${itinerary.days} days)`,
            description: `${hotelLevelLabels[body.hotelLevel]} • ${endpointLabels[body.startFrom]} to ${endpointLabels[body.endLocation]} • ${formatUsd(quote.totalUsdCents)} • ${nationality}`,
          },
          unit_amount: quote.totalUsdCents,
        },
      },
    ],
    metadata: {
      itinerarySlug: itinerary.slug,
      itineraryTitle: itinerary.title,
      startDate: body.startDate,
      startFrom: body.startFrom,
      endLocation: body.endLocation,
      hotelLevel: body.hotelLevel,
      mealPlan: body.mealPlan,
      customerName,
      customerEmail,
      nationality,
      rooms: roomsCompact.slice(0, 500),
      tier: legacyTierFromHotelLevel(body.hotelLevel),
      adults: String(validation.totalAdults),
      children: String(validation.totalChildren),
      infants: "0",
      days: String(itinerary.days),
    },
  });

  return NextResponse.json({ ok: true, url: session.url });
}
