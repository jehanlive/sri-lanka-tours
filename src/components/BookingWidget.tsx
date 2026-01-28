"use client";

import { useRouter } from "next/navigation";
import { useMemo, useState, useEffect } from "react";
import type { Tier } from "@/lib/pricing";
import { formatUsd, quoteUsdCents } from "@/lib/pricing";
import { validateGroup } from "@/lib/validation";


const tierLabels: Record<Tier, string> = {
  VALUE: "Value",
  STAR3: "3 Star",
  STAR4: "4 Star",
  STAR5: "5 Star",
};

function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n));
}

export default function BookingWidget({
  slug,
  title,
  days,
}: {
  slug: string;
  title: string;
  days: number;
}) {

  const [startDate, setStartDate] = useState<string>("");
  const [tier, setTier] = useState<Tier>("STAR3");
  const [adults, setAdults] = useState<number>(1);
  const [children, setChildren] = useState<number>(0);
  const [infants, setInfants] = useState<number>(0);
  const [debugPayload, setDebugPayload] = useState<string>("");
  const [serverPriceUsdCents, setServerPriceUsdCents] = useState<number | null>(null);
  const [quoteError, setQuoteError] = useState<string>("");
  const [isQuoting, setIsQuoting] = useState(false);
  const router = useRouter();



useEffect(() => {
  if (infants > adults) setInfants(adults);
  if (infants > 4) setInfants(4);
}, [adults, infants]);
  const validation = useMemo(
    () => validateGroup({ adults, children, infants }),
    [adults, children, infants]
  );

  const totalUsdCents = useMemo(() => {
    if (!validation.ok) return 0;
    if (!startDate) return 0;
    return quoteUsdCents({ days, tier, adults, children, infants });
  }, [days, tier, adults, children, infants, startDate, validation.ok]);

  const payingPax = adults + children;

  useEffect(() => {
  let cancelled = false;

  async function runQuote() {
    setQuoteError("");
    setServerPriceUsdCents(null);

    if (!validation.ok) return;
    if (!startDate) return;

    setIsQuoting(true);
    try {
      const res = await fetch("/api/quote", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          days,
          startDate,
          tier,
          adults,
          children,
          infants,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        const msg = Array.isArray(data?.errors) ? data.errors.join(" ") : "Quote failed.";
        if (!cancelled) setQuoteError(msg);
        return;
      }

      if (!cancelled) setServerPriceUsdCents(data.totalUsdCents);
    } catch {
      if (!cancelled) setQuoteError("Network error while getting quote.");
    } finally {
      if (!cancelled) setIsQuoting(false);
    }
  }

  runQuote();
  return () => {
    cancelled = true;
  };
}, [days, startDate, tier, adults, children, infants, validation.ok]);


  return (
    <div className="border rounded-2xl p-6 bg-white shadow-sm">
      <h3 className="text-lg font-semibold">Book this itinerary</h3>
      <p className="text-sm text-gray-600 mt-1">
        Infants (under 2) are free. Price is based on paying travellers (adults + children).
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Start date
          </label>
          <input
            type="date"
            className="w-full border rounded-lg px-3 py-2"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Package level
          </label>
          <select
            className="w-full border rounded-lg px-3 py-2"
            value={tier}
            onChange={(e) => setTier(e.target.value as Tier)}
          >
            {Object.keys(tierLabels).map((t) => (
              <option key={t} value={t}>
                {tierLabels[t as Tier]}
              </option>
            ))}
          </select>
        </div>

        <Counter
          label="Adults (12+)"
          value={adults}
          onChange={(v) => setAdults(v)}
          min={0}
          max={8}
        />
        <Counter
          label="Children (2–12)"
          value={children}
          onChange={(v) => setChildren(v)}
          min={0}
          max={8}
        />
        <Counter
  label="Infants (under 2)"
  value={infants}
  onChange={(v) => {
    // infants max 4 AND cannot exceed adults
    const capped = Math.min(v, 4, adults);
    setInfants(capped);
  }}
  min={0}
  max={4}
/>

      </div>

      <div className="mt-4 text-sm text-gray-700">
        Paying travellers: <span className="font-semibold">{payingPax}</span>{" "}
        • Total travellers: <span className="font-semibold">{validation.total}</span>
      </div>

      {!validation.ok && (
        <div className="mt-4 border rounded-xl bg-red-50 p-4">
          <p className="font-medium text-red-800 mb-2">Fix these:</p>
          <ul className="list-disc pl-5 text-red-800 space-y-1">
            {validation.errors.map((e) => (
              <li key={e}>{e}</li>
            ))}
          </ul>
        </div>
      )}
{quoteError && (
  <div className="mt-4 border rounded-xl bg-red-50 p-4 text-red-800 text-sm">
    {quoteError}
  </div>
)}

      {validation.ok && startDate && (
        <div className="mt-6 border rounded-xl bg-gray-50 p-4 flex items-center justify-between">
          <div>
            <div className="text-sm text-gray-600">Total price</div>
            <div className="text-2xl font-bold">
  {isQuoting ? "Calculating…" : serverPriceUsdCents === null ? "—" : formatUsd(serverPriceUsdCents)}
</div>

            <div className="text-xs text-gray-500 mt-1">
              USD • {tierLabels[tier]} • {days} days
            </div>
          </div>

          <button
            className="bg-black text-white px-5 py-3 rounded-lg font-medium hover:bg-gray-800 disabled:opacity-50"
            disabled={
  !validation.ok ||
  !startDate ||
  isQuoting ||
  serverPriceUsdCents === null
}

           onClick={() => {
  if (serverPriceUsdCents === null) return;

  const qp = new URLSearchParams({
    slug,
    title,
    days: String(days),
    startDate,
    tier,
    adults: String(adults),
    children: String(children),
    infants: String(infants),
    totalUsdCents: String(serverPriceUsdCents),
  });

  router.push(`/review?${qp.toString()}`);
}}


          >
            Continue
          </button>



        </div>
      )}

      {debugPayload && (
  <div className="mt-6">
    <div className="flex items-center justify-between mb-2">
      <p className="text-sm font-medium text-gray-700">Booking payload</p>
      <button
        type="button"
        className="text-sm underline"
        onClick={async () => {
          await navigator.clipboard.writeText(debugPayload);
          alert("Copied!");
        }}
      >
        Copy
      </button>
    </div>
    <pre className="text-xs bg-gray-100 p-4 rounded-lg overflow-auto">
      {debugPayload}
    </pre>
  </div>
)}

      {validation.ok && !startDate && (
        <div className="mt-6 text-sm text-gray-600">
          Select a start date to see the final price.
        </div>
      )}
    </div>
  );
}

function Counter({
  label,
  value,
  onChange,
  min,
  max,
}: {
  label: string;
  value: number;
  onChange: (v: number) => void;
  min: number;
  max: number;
}) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        {label}
      </label>
      <div className="flex items-center gap-2">
        <button
          className="border rounded-lg px-3 py-2 hover:bg-gray-100"
          onClick={() => onChange(clamp(value - 1, min, max))}
          type="button"
        >
          −
        </button>
        <input
          className="w-16 text-center border rounded-lg px-2 py-2"
          value={value}
          onChange={(e) => {
            const n = Number(e.target.value);
            if (Number.isNaN(n)) return;
            onChange(clamp(n, min, max));
          }}
          inputMode="numeric"
        />
        <button
          className="border rounded-lg px-3 py-2 hover:bg-gray-100"
          onClick={() => onChange(clamp(value + 1, min, max))}
          type="button"
        >
          +
        </button>
      </div>
    </div>
  );
}
