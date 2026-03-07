import { NextResponse } from "next/server";
import { validateBookingInput } from "@/lib/bookingRules";
import type { QuoteInput } from "@/lib/pricing";
import { quoteItinerary } from "@/lib/pricing";
import { itineraries } from "@/lib/itineraries";

export async function POST(req: Request) {
  const body = (await req.json()) as QuoteInput;

  const itinerary = itineraries.find((i) => i.slug === body.slug);
  if (!itinerary) {
    return NextResponse.json({ ok: false, errors: ["Invalid itinerary."] }, { status: 400 });
  }

  const validation = validateBookingInput({ ...body, days: itinerary.days });
  if (!validation.ok) {
    return NextResponse.json({ ok: false, errors: validation.errors }, { status: 400 });
  }

  try {
    const quote = quoteItinerary(body);
    return NextResponse.json({
      ok: true,
      currency: quote.currency,
      totalUsdCents: quote.totalUsdCents,
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Quote failed.";
    return NextResponse.json({ ok: false, errors: [message] }, { status: 400 });
  }
}
