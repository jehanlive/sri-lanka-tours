import Link from "next/link";
import { itineraries } from "@/lib/itineraries";
import {
  quoteItinerary,
  formatUsd,
  type HotelLevel,
} from "@/lib/pricing";
import rateTables from "@/data/rateTables2026.json";
import AdminLogout from "../bookings/AdminLogout";

type SeasonRow = { name: string; startDate: string; endDate: string };
const seasons = rateTables.seasons as SeasonRow[];

const LEVELS: HotelLevel[] = ["STANDARD", "SUPERIOR", "LUXURY"];
const LEVEL_LABELS: Record<HotelLevel, string> = {
  STANDARD: "Std (3★)",
  SUPERIOR: "Sup (4★)",
  LUXURY: "Lux (5★)",
};

function getPricePerPerson(slug: string, level: HotelLevel, seasonStartDate: string): number | null {
  try {
    const total = quoteItinerary({
      slug,
      startDate: seasonStartDate,
      startFrom: "AIRPORT",
      endLocation: "AIRPORT",
      hotelLevel: level,
      mealPlan: "BREAKFAST_INCLUDED",
      rooms: [{ adults: 2, childAges: [] }],
    }).totalUsdCents;
    return Math.round(total / 2);
  } catch {
    return null;
  }
}

export default function AdminItinerariesPage() {
  // Build pricing matrix per itinerary: season → level → price per person
  const rows = itineraries.map((it) => {
    const pricing: Record<string, Record<HotelLevel, number | null>> = {};
    for (const season of seasons) {
      pricing[season.name] = {} as Record<HotelLevel, number | null>;
      for (const level of LEVELS) {
        pricing[season.name][level] = getPricePerPerson(it.slug, level, season.startDate);
      }
    }
    const isPriceable = Object.values(pricing).some((s) =>
      Object.values(s).some((v) => v !== null)
    );
    return { it, pricing, isPriceable };
  });

  const priceable = rows.filter((r) => r.isPriceable);
  const notPriceable = rows.filter((r) => !r.isPriceable);

  return (
    <main className="max-w-7xl mx-auto px-6 py-12">
      {/* Header */}
      <div className="flex items-center justify-between mb-2">
        <h1 className="text-2xl font-bold">Admin • Itineraries</h1>
        <div className="flex gap-4 text-sm items-center">
          <Link className="underline" href="/admin/bookings">Bookings</Link>
          <Link className="underline" href="/itineraries">Live site</Link>
          <Link className="underline" href="/">Home</Link>
          <AdminLogout />
        </div>
      </div>
      <p className="text-sm text-gray-500 mb-8">
        {priceable.length} of {rows.length} itineraries are priced. Prices shown per person (2 adults, 1 room, airport–airport).
      </p>

      {/* Priceable itineraries */}
      {priceable.map(({ it, pricing }) => (
        <section key={it.slug} className="mb-10">
          {/* Itinerary header */}
          <div className="flex flex-wrap items-baseline gap-3 mb-1">
            <h2 className="text-lg font-bold">{it.title}</h2>
            <span className="text-sm text-gray-500">{it.days} days</span>
            <span className="font-mono text-xs bg-gray-100 px-2 py-0.5 rounded">{it.slug}</span>
            {it.categories.map((c) => (
              <span key={c} className="text-xs bg-blue-50 text-blue-700 px-2 py-0.5 rounded-full">{c}</span>
            ))}
          </div>

          {/* Pricing factors */}
          <div className="flex flex-wrap gap-4 text-xs text-gray-600 mb-3">
            {it.overnightCities?.length ? (
              <span>
                <span className="font-medium text-gray-800">Overnight cities:</span>{" "}
                {it.overnightCities.join(" → ")}
              </span>
            ) : (
              <span className="text-red-500">No overnight cities set</span>
            )}
            {it.totalKm != null && (
              <span><span className="font-medium text-gray-800">km:</span> {it.totalKm}</span>
            )}
            {it.vehicleDays != null && (
              <span><span className="font-medium text-gray-800">vehicle days:</span> {it.vehicleDays}</span>
            )}
          </div>

          {/* Season × level pricing table */}
          <div className="overflow-x-auto border rounded-xl bg-white">
            <table className="text-sm min-w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="p-3 text-left font-medium text-gray-700 w-48">Season</th>
                  <th className="p-3 text-left text-xs text-gray-500">Dates</th>
                  {LEVELS.map((l) => (
                    <th key={l} className="p-3 text-right font-medium text-gray-700">{LEVEL_LABELS[l]}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {seasons.map((season) => {
                  const row = pricing[season.name];
                  return (
                    <tr key={season.name} className="border-t">
                      <td className="p-3 font-medium">{season.name}</td>
                      <td className="p-3 text-xs text-gray-500">
                        {season.startDate} – {season.endDate}
                      </td>
                      {LEVELS.map((l) => {
                        const price = row[l];
                        return (
                          <td key={l} className="p-3 text-right tabular-nums">
                            {price != null ? (
                              <span className="font-medium">{formatUsd(price)}</span>
                            ) : (
                              <span className="text-gray-300">—</span>
                            )}
                          </td>
                        );
                      })}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </section>
      ))}

      {/* Not-priceable itineraries */}
      {notPriceable.length > 0 && (
        <section className="mt-8">
          <h2 className="text-base font-bold text-gray-500 mb-3">
            Not yet configured for live pricing ({notPriceable.length})
          </h2>
          <div className="border rounded-xl bg-white overflow-x-auto">
            <table className="text-sm min-w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="p-3 text-left">Title</th>
                  <th className="p-3 text-left">Slug</th>
                  <th className="p-3 text-left">Days</th>
                  <th className="p-3 text-left">Overnight Cities</th>
                  <th className="p-3 text-left">km</th>
                </tr>
              </thead>
              <tbody>
                {notPriceable.map(({ it }) => (
                  <tr key={it.slug} className="border-t">
                    <td className="p-3">{it.title}</td>
                    <td className="p-3 font-mono text-xs">{it.slug}</td>
                    <td className="p-3">{it.days}</td>
                    <td className="p-3 text-gray-500">
                      {it.overnightCities?.join(" → ") ?? <span className="text-red-400">missing</span>}
                    </td>
                    <td className="p-3 text-gray-500">{it.totalKm ?? "—"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}
    </main>
  );
}
