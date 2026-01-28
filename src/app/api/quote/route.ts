import { NextResponse } from "next/server";
import { validateBookingInput } from "@/lib/bookingRules";
import type { Tier } from "@/lib/pricing";
import { quoteUsdCents } from "@/lib/pricing";

type Body = {
  days: number;
  startDate: string;
  tier: Tier;
  adults: number;
  children: number;
  infants: number;
};

export async function POST(req: Request) {
  const body = (await req.json()) as Body;

  const validation = validateBookingInput({
    days: body.days,
    startDate: body.startDate,
    tier: body.tier,
    adults: body.adults,
    children: body.children,
    infants: body.infants,
  });

  if (!validation.ok) {
    return NextResponse.json(
      { ok: false, errors: validation.errors },
      { status: 400 }
    );
  }

  const totalUsdCents = quoteUsdCents({
    days: body.days,
    tier: body.tier,
    adults: body.adults,
    children: body.children,
    infants: body.infants,
  });

  return NextResponse.json({
    ok: true,
    currency: "USD",
    payingPax: validation.payingPax,
    totalUsdCents,
  });
}
