"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useState } from "react";

export default function ReviewPage() {
  const sp = useSearchParams();

  const title = sp.get("title") ?? "";
  const slug = sp.get("slug") ?? "";
  const days = sp.get("days") ?? "";
  const startDate = sp.get("startDate") ?? "";
  const tier = sp.get("tier") ?? "";
  const adults = sp.get("adults") ?? "0";
  const children = sp.get("children") ?? "0";
  const infants = sp.get("infants") ?? "0";
  const totalUsdCents = Number(sp.get("totalUsdCents") ?? "0");
  const [isPaying, setIsPaying] = useState(false);
  const [payError, setPayError] = useState("");
 

  const totalUsd = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(totalUsdCents / 100);

  return (
    <main className="max-w-3xl mx-auto px-6 py-16">
      <h1 className="text-3xl font-bold">Review your booking</h1>

      <div className="mt-8 border rounded-2xl p-6 bg-white">
        <p className="text-sm text-gray-500">Itinerary</p>
        <p className="text-xl font-semibold">{title || "—"}</p>
        <p className="text-gray-600 mt-1">
          {days || "—"} days • {tier || "—"}
        </p>

        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-gray-500">Start date</p>
            <p className="font-medium">{startDate || "—"}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Travellers</p>
            <p className="font-medium">
              Adults: {adults} • Children: {children} • Infants: {infants}
            </p>
          </div>
        </div>

        <div className="mt-8 flex items-center justify-between border-t pt-6">
          <div>
            <p className="text-sm text-gray-500">Total (USD)</p>
            <p className="text-2xl font-bold">{totalUsd}</p>
          </div>
{payError && (
  <div className="mt-4 border rounded-xl bg-red-50 p-4 text-red-800 text-sm">
    {payError}
  </div>
)}


          <button
  className="bg-black text-white px-5 py-3 rounded-lg font-medium hover:bg-gray-800 disabled:opacity-50"
  disabled={isPaying || totalUsdCents <= 0}
  onClick={async () => {
    setPayError("");
    setIsPaying(true);
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          slug,
          startDate,
          tier,
          adults: Number(adults),
          children: Number(children),
          infants: Number(infants),
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        const msg = Array.isArray(data?.errors)
          ? data.errors.join(" ")
          : "Checkout failed.";
        setPayError(msg);
        return;
      }

      window.location.href = data.url;
    } catch {
      setPayError("Network error starting checkout.");
    } finally {
      setIsPaying(false);
    }
  }}
>
  {isPaying ? "Redirecting…" : "Pay by card"}
</button>

        </div>
      </div>

      <div className="mt-6">
        <Link className="underline" href={slug ? `/itineraries/${slug}` : "/itineraries"}>
          ← Back to itinerary
        </Link>
      </div>
    </main>
  );
}
