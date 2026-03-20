import Link from "next/link";
import rateTables from "@/data/rateTables2026.json";
import AdminLogout from "../bookings/AdminLogout";

type SeasonRow = { name: string; startDate: string; endDate: string };
type HotelRateRow = {
  hotelNumber: number | null;
  hotel: string;
  city: string;
  star: number;
  season: string;
  sglUsd: number;
  dblUsd: number;
  tplUsd: number;
  child5to11EbUsd: number;
  childUnder5NbUsd: number;
};
type TransportRateRow = {
  paxFrom: number;
  paxTo: number;
  dayRateLkr: number;
  includedKmPerDay: number;
  extraKmRateLkr: number;
};

const seasons = rateTables.seasons as SeasonRow[];
const hotelRates = rateTables.hotelRates as HotelRateRow[];
const transportRates = rateTables.transportRates as TransportRateRow[];

const LKR_PER_USD = Number(process.env.NEXT_PUBLIC_LKR_PER_USD ?? process.env.LKR_PER_USD ?? 300);

function usd(val: number) {
  return `$${val.toFixed(2)}`;
}
function lkr(val: number) {
  return `LKR ${val.toLocaleString()}`;
}

// Group hotel rates: city → hotel name → season → row
function groupHotelRates() {
  const byCityHotel: Record<string, Record<string, HotelRateRow[]>> = {};
  for (const row of hotelRates) {
    if (!byCityHotel[row.city]) byCityHotel[row.city] = {};
    if (!byCityHotel[row.city][row.hotel]) byCityHotel[row.city][row.hotel] = [];
    byCityHotel[row.city][row.hotel].push(row);
  }
  return byCityHotel;
}

const starLabel: Record<number, string> = { 3: "3★ Standard", 4: "4★ Superior", 5: "5★ Luxury" };

export default function AdminRatesPage() {
  const grouped = groupHotelRates();
  const cities = Object.keys(grouped).sort();
  const seasonNames = seasons.map((s) => s.name);

  return (
    <main className="max-w-7xl mx-auto px-6 py-12">
      {/* Header */}
      <div className="flex items-center justify-between mb-2">
        <h1 className="text-2xl font-bold">Admin • Rate Tables</h1>
        <div className="flex gap-4 text-sm items-center">
          <Link className="underline" href="/admin/bookings">Bookings</Link>
          <Link className="underline" href="/admin/itineraries">Itineraries</Link>
          <Link className="underline" href="/">Home</Link>
          <AdminLogout />
        </div>
      </div>
      <p className="text-sm text-gray-500 mb-10">
        Source: <span className="font-mono">{(rateTables as { source?: string }).source}</span>
        {" · "}Generated: {new Date((rateTables as { generatedAt?: string }).generatedAt ?? "").toLocaleDateString()}
        {" · "}LKR rate used: {LKR_PER_USD} LKR/USD
      </p>

      {/* ── 1. SEASONS ── */}
      <section className="mb-12">
        <h2 className="text-lg font-bold mb-3">Seasons ({seasons.length})</h2>
        <div className="border rounded-xl bg-white overflow-x-auto">
          <table className="text-sm min-w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="p-3 text-left">Season</th>
                <th className="p-3 text-left">Start</th>
                <th className="p-3 text-left">End</th>
              </tr>
            </thead>
            <tbody>
              {seasons.map((s) => (
                <tr key={s.name} className="border-t">
                  <td className="p-3 font-medium">{s.name}</td>
                  <td className="p-3 tabular-nums">{s.startDate}</td>
                  <td className="p-3 tabular-nums">{s.endDate}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* ── 2. TRANSPORT RATES ── */}
      <section className="mb-12">
        <h2 className="text-lg font-bold mb-1">Transport Rates</h2>
        <p className="text-xs text-gray-500 mb-3">
          Rates are in LKR and converted to USD at {LKR_PER_USD} LKR/USD. Extra km charged beyond included allowance.
        </p>
        <div className="border rounded-xl bg-white overflow-x-auto">
          <table className="text-sm min-w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="p-3 text-left">Passengers</th>
                <th className="p-3 text-right">Day rate (LKR)</th>
                <th className="p-3 text-right">Day rate (USD equiv.)</th>
                <th className="p-3 text-right">Included km/day</th>
                <th className="p-3 text-right">Extra km rate (LKR)</th>
                <th className="p-3 text-right">Extra km rate (USD equiv.)</th>
              </tr>
            </thead>
            <tbody>
              {transportRates.map((r) => (
                <tr key={`${r.paxFrom}-${r.paxTo}`} className="border-t">
                  <td className="p-3 font-medium">{r.paxFrom}–{r.paxTo} pax</td>
                  <td className="p-3 text-right tabular-nums">{lkr(r.dayRateLkr)}</td>
                  <td className="p-3 text-right tabular-nums text-gray-600">{usd(r.dayRateLkr / LKR_PER_USD)}</td>
                  <td className="p-3 text-right tabular-nums">{r.includedKmPerDay} km</td>
                  <td className="p-3 text-right tabular-nums">{lkr(r.extraKmRateLkr)}/km</td>
                  <td className="p-3 text-right tabular-nums text-gray-600">{usd(r.extraKmRateLkr / LKR_PER_USD)}/km</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* ── 3. HOTEL RATES by city ── */}
      <section>
        <h2 className="text-lg font-bold mb-1">Hotel Rates by City ({cities.length} cities)</h2>
        <p className="text-xs text-gray-500 mb-6">
          Rates per room per night in USD. Sgl = 1 adult, Dbl = 2 adults, Tpl = 3 adults.
        </p>

        {cities.map((city) => {
          const hotels = grouped[city];
          const hotelNames = Object.keys(hotels).sort();
          return (
            <div key={city} className="mb-8">
              <h3 className="text-base font-bold mb-2">{city}</h3>
              <div className="border rounded-xl bg-white overflow-x-auto">
                <table className="text-sm min-w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="p-3 text-left w-48">Hotel</th>
                      <th className="p-3 text-left w-28">Tier</th>
                      <th className="p-3 text-left">Season</th>
                      <th className="p-3 text-right">Sgl</th>
                      <th className="p-3 text-right">Dbl</th>
                      <th className="p-3 text-right">Tpl</th>
                      <th className="p-3 text-right">Child 5–11</th>
                      <th className="p-3 text-right">Child &lt;5</th>
                    </tr>
                  </thead>
                  <tbody>
                    {hotelNames.map((hotelName) => {
                      const rows = hotels[hotelName];
                      // Sort by star then season order
                      const sorted = [...rows].sort((a, b) => {
                        if (a.star !== b.star) return a.star - b.star;
                        return seasonNames.indexOf(a.season) - seasonNames.indexOf(b.season);
                      });
                      return sorted.map((row, idx) => (
                        <tr key={`${row.hotel}-${row.star}-${row.season}`} className="border-t">
                          {/* Show hotel name only on first row */}
                          <td className="p-3 font-medium align-top">
                            {idx === 0 ? hotelName : ""}
                          </td>
                          <td className="p-3 text-xs text-gray-600">
                            {starLabel[row.star] ?? `${row.star}★`}
                          </td>
                          <td className="p-3 text-gray-700">{row.season}</td>
                          <td className="p-3 text-right tabular-nums">{usd(row.sglUsd)}</td>
                          <td className="p-3 text-right tabular-nums">{usd(row.dblUsd)}</td>
                          <td className="p-3 text-right tabular-nums">{usd(row.tplUsd)}</td>
                          <td className="p-3 text-right tabular-nums">{usd(row.child5to11EbUsd)}</td>
                          <td className="p-3 text-right tabular-nums">{usd(row.childUnder5NbUsd)}</td>
                        </tr>
                      ));
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          );
        })}
      </section>
    </main>
  );
}
