import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const sessionId = searchParams.get("session_id");

  if (!sessionId) {
    return NextResponse.json({ error: "Missing session_id" }, { status: 400 });
  }

  const booking = await prisma.booking.findUnique({
    where: { stripeSessionId: sessionId },
  });

  if (!booking) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  // Reconstruct metadata shape the success page expects
  const metadata: Record<string, string> = {
    itinerarySlug: booking.itinerarySlug,
    itineraryTitle: booking.itineraryTitle ?? "",
    startDate: booking.startDate,
    tier: booking.tier,
    adults: String(booking.adults),
    children: String(booking.children),
    infants: String(booking.infants),
    days: String(booking.days),
  };

  return NextResponse.json({
    booking: {
      reference: booking.reference,
      stripeSessionId: booking.stripeSessionId,
      amount: booking.amount,
      currency: booking.currency,
      email: booking.email,
      metadata,
      createdAt: booking.createdAt,
    },
  });
}
