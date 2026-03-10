import Link from "next/link";
import { prisma } from "@/lib/prisma";
import AdminLogout from "./AdminLogout";

function formatRooms(roomsJson: string | null): string {
  if (!roomsJson) return "—";
  try {
    const rooms: Array<{ adults: number; childAges: number[] }> = JSON.parse(roomsJson);
    return rooms
      .map((r, i) => {
        const children = r.childAges.length;
        const childPart = children > 0 ? ` + ${children}C (${r.childAges.join(",")})` : "";
        return `R${i + 1}: ${r.adults}A${childPart}`;
      })
      .join(" | ");
  } catch {
    return roomsJson;
  }
}

function formatMoney(cents: number, currency: string) {
  const cur = (currency || "usd").toUpperCase();
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: cur === "USD" ? "USD" : cur,
  }).format((cents ?? 0) / 100);
}

export default async function AdminBookingsPage() {
  const bookings = await prisma.booking.findMany({
    orderBy: { createdAt: "desc" },
    take: 200, // safety limit for MVP
  });

  return (
    <main className="max-w-6xl mx-auto px-6 py-12">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Admin • Bookings</h1>
        <div className="flex gap-4 text-sm items-center">
          <Link className="underline" href="/itineraries">
            Back to itineraries
          </Link>
          <Link className="underline" href="/">
            Home
          </Link>
          <AdminLogout />
        </div>
      </div>

      <p className="text-sm text-gray-600 mt-2">
        Showing latest <span className="font-medium">{bookings.length}</span>{" "}
        bookings from Postgres.
      </p>

      <div className="mt-6 overflow-x-auto border rounded-xl bg-white">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-50 text-left">
            <tr>
              <th className="p-3">Reference</th>
              <th className="p-3">Itinerary</th>
              <th className="p-3">Start</th>
              <th className="p-3">Tier</th>
              <th className="p-3">Travellers</th>
              <th className="p-3">Rooms</th>
              <th className="p-3">Total</th>
              <th className="p-3">Name</th>
              <th className="p-3">Nationality</th>
              <th className="p-3">Email</th>
              <th className="p-3">Created</th>
              <th className="p-3">Stripe Session</th>
            </tr>
          </thead>

          <tbody>
            {bookings.map((b) => (
              <tr key={b.stripeSessionId} className="border-t align-top">
                <td className="p-3 font-mono">{b.reference}</td>

                <td className="p-3">
                  <div className="font-medium">
                    {b.itineraryTitle ?? b.itinerarySlug}
                  </div>
                  <div className="text-gray-500 text-xs">{b.itinerarySlug}</div>
                </td>

                <td className="p-3">{b.startDate}</td>
                <td className="p-3">{b.tier}</td>

                <td className="p-3">
                  A:{b.adults} • C:{b.children} • I:{b.infants}
                </td>

                <td className="p-3 text-xs text-gray-600">{formatRooms(b.rooms ?? null)}</td>
                <td className="p-3">{formatMoney(b.amount, b.currency)}</td>
                <td className="p-3">{b.customerName ?? "—"}</td>
                <td className="p-3">{b.nationality ?? "—"}</td>
                <td className="p-3">{b.email ?? "—"}</td>

                <td className="p-3">
                  {new Date(b.createdAt).toLocaleString()}
                </td>

                <td className="p-3 font-mono text-xs">{b.stripeSessionId}</td>
              </tr>
            ))}

            {bookings.length === 0 && (
              <tr>
                <td className="p-6 text-gray-600" colSpan={9}>
                  No bookings yet. Make a test booking and it will appear here.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </main>
  );
}