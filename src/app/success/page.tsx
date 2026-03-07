"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useState, Suspense } from "react";

type Booking = {
  reference: string;
  stripeSessionId: string;
  amount: number; // cents
  currency: string;
  email?: string;
  metadata: Record<string, string>;
  createdAt: string;
};

function formatUsd(cents: number) {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(
    (cents ?? 0) / 100
  );
}

function SuccessPageInner() {
  const sp = useSearchParams();
  const sessionId = sp.get("session_id");

  const [booking, setBooking] = useState<Booking | null>(null);

  useEffect(() => {
    if (!sessionId) return;

    (async () => {
      try {
        const res = await fetch(`/api/booking?session_id=${sessionId}`);
        if (!res.ok) return;
        const d = await res.json();
        setBooking(d.booking ?? null);
      } catch {
        // ignore for MVP
      }
    })();
  }, [sessionId]);

  const m = booking?.metadata ?? {};

  return (
    <main className="max-w-3xl mx-auto px-6 py-16">
      <h1 className="text-3xl font-bold">Payment Successful</h1>
      <p className="mt-3 text-gray-600">
        We have received your payment and will reach out to you shortly with confirmation details.
      </p>

      {booking ? (
        <div className="mt-6 border rounded-2xl p-6 bg-green-50">
          <p className="text-sm text-gray-600">Booking reference</p>
          <p className="text-2xl font-mono font-bold">{booking.reference}</p>

          <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
            <div>
              <div className="text-gray-600">Itinerary</div>
              <div className="font-medium">{m.itineraryTitle ?? m.itinerarySlug ?? "—"}</div>
              <div className="text-gray-600 mt-2">Days</div>
              <div className="font-medium">{m.days ?? "—"}</div>
            </div>

            <div>
              <div className="text-gray-600">Start date</div>
              <div className="font-medium">{m.startDate ?? "—"}</div>
              <div className="text-gray-600 mt-2">Package tier</div>
              <div className="font-medium">{m.tier ?? "—"}</div>
            </div>

            <div>
              <div className="text-gray-600">Travellers</div>
              <div className="font-medium">
                Adults: {m.adults ?? "0"} • Children: {m.children ?? "0"} • Infants:{" "}
                {m.infants ?? "0"}
              </div>
            </div>

            <div>
              <div className="text-gray-600">Total paid</div>
              <div className="font-medium">{formatUsd(booking.amount)}</div>
              <div className="text-gray-600 mt-2">Email</div>
              <div className="font-medium">{booking.email ?? "—"}</div>
            </div>
          </div>
        </div>
      ) : null}

      <div className="mt-8 flex gap-4">
        <Link className="underline" href="/itineraries">
          Back to itineraries
        </Link>
        <Link className="underline" href="/guide">
          Travel guide
        </Link>
      </div>
    </main>
  );
}

export default function SuccessPage() {
  return (
    <Suspense fallback={<div className="max-w-3xl mx-auto px-6 py-16">Loading…</div>}>
      <SuccessPageInner />
    </Suspense>
  );
}
