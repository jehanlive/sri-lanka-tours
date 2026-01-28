"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { itineraries } from "@/lib/itineraries";

export default function ItinerariesPage() {
  const [days, setDays] = useState<number | "ALL">("ALL");

  const filtered = useMemo(() => {
    if (days === "ALL") return itineraries;
    return itineraries.filter((i) => i.days === days);
  }, [days]);

  const dayOptions = ["ALL", ...Array.from(new Set(itineraries.map((i) => i.days))).sort((a, b) => a - b)] as const;

  return (
    <main className="max-w-6xl mx-auto px-6 py-16">
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-10">
        <div>
          <h1 className="text-3xl font-bold">Available Itineraries</h1>
          <p className="text-gray-600 mt-2">
            Filter by duration (3–25 days) and explore your perfect Sri Lanka trip.
          </p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Number of days
          </label>
          <select
            className="border rounded-lg px-4 py-2"
            value={days}
            onChange={(e) => {
              const v = e.target.value;
              setDays(v === "ALL" ? "ALL" : Number(v));
            }}
          >
            {dayOptions.map((opt) => (
              <option key={String(opt)} value={opt}>
                {opt === "ALL" ? "All durations" : `${opt} days`}
              </option>
            ))}
          </select>
        </div>
      </div>

      {filtered.length === 0 ? (
        <p className="text-gray-700">No itineraries found for that duration.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filtered.map((itinerary) => (
            <Link
              key={itinerary.slug}
              href={`/itineraries/${itinerary.slug}`}
              className="border rounded-xl p-6 hover:shadow-md transition block"
            >
              <div className="flex items-center justify-between mb-2">
                <h2 className="text-xl font-semibold">{itinerary.title}</h2>
                <span className="text-sm text-gray-500">{itinerary.days} days</span>
              </div>

              <p className="text-gray-600 mb-4">{itinerary.summary}</p>

              <div className="flex flex-wrap gap-2">
                {itinerary.highlights.slice(0, 3).map((h) => (
                  <span
                    key={h}
                    className="text-xs bg-gray-100 border rounded-full px-3 py-1"
                  >
                    {h}
                  </span>
                ))}
              </div>

              <div className="mt-4 text-sm font-medium underline">
                View details →
              </div>
            </Link>
          ))}
        </div>
      )}
    </main>
  );
}
