"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function SuccessPage() {
  const sp = useSearchParams();
  const sessionId = sp.get("session_id");

  const [reference, setReference] = useState<string>("");

  useEffect(() => {
  if (!sessionId) return;

  (async () => {
    try {
      const res = await fetch(`/api/booking?session_id=${sessionId}`);
      if (!res.ok) return; // still "Finalizing..." if not ready yet
      const d = await res.json();
      setReference(d.booking?.reference ?? "");
    } catch {
      // ignore for MVP
    }
  })();
}, [sessionId]);


  return (
    <main className="max-w-3xl mx-auto px-6 py-16">
      <h1 className="text-3xl font-bold">Payment successful ✅</h1>

      {reference ? (
        <div className="mt-6 border rounded-xl p-4 bg-green-50">
          <p className="text-sm text-gray-600">Booking reference</p>
          <p className="text-2xl font-mono font-bold">{reference}</p>
        </div>
      ) : (
        <p className="mt-6 text-gray-600">Finalizing booking…</p>
      )}

      <div className="mt-8 flex gap-4">
        <Link className="underline" href="/itineraries">
          Back to itineraries
        </Link>
      </div>
    </main>
  );
}


