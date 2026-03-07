"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useMemo, useState } from "react";
import { endpointLabels, hotelLevelLabels, mealPlanLabels, type RoomSelection } from "@/lib/pricing";
import { UN_MEMBER_STATES } from "@/lib/unMemberStates";
import { formatPrice, useCurrency } from "@/lib/currency";

function parseRooms(value: string | null): RoomSelection[] {
  if (!value) return [];
  try {
    const parsed = JSON.parse(value);
    if (!Array.isArray(parsed)) return [];
    return parsed.map((r) => ({
      adults: Number(r?.adults ?? 0),
      childAges: Array.isArray(r?.childAges) ? r.childAges.map(Number) : [],
    }));
  } catch {
    return [];
  }
}

export default function ReviewPageClient() {
  const sp = useSearchParams();

  const title = sp.get("title") ?? "";
  const slug = sp.get("slug") ?? "";
  const days = sp.get("days") ?? "";
  const startDate = sp.get("startDate") ?? "";
  const startFrom = sp.get("startFrom") ?? "AIRPORT";
  const endLocation = sp.get("endLocation") ?? "AIRPORT";
  const hotelLevel = sp.get("hotelLevel") ?? "STANDARD";
  const mealPlan = sp.get("mealPlan") ?? "BREAKFAST_INCLUDED";
  const totalUsdCents = Number(sp.get("totalUsdCents") ?? "0");
  const roomsRaw = sp.get("rooms");
  const rooms = useMemo(() => parseRooms(roomsRaw), [roomsRaw]);
  const savedName = sp.get("customerName") ?? "";
  const savedNameParts = savedName.split(" ");
  const [firstName, setFirstName] = useState(savedNameParts.slice(0, -1).join(" ") || savedName);
  const [lastName, setLastName] = useState(savedNameParts.length > 1 ? savedNameParts[savedNameParts.length - 1] : "");
  const customerName = `${firstName.trim()} ${lastName.trim()}`.trim();
  const [customerEmail, setCustomerEmail] = useState(sp.get("customerEmail") ?? "");
  const [nationality, setNationality] = useState(sp.get("nationality") ?? "");

  const [agreedToTerms, setAgreedToTerms] = useState(true);
  const [isPaying, setIsPaying] = useState(false);
  const [payError, setPayError] = useState("");

  const currency = useCurrency();
  const displayTotal = formatPrice(totalUsdCents, currency);
  const totalUsd = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(totalUsdCents / 100);

  const totals = rooms.reduce(
    (acc, room) => {
      acc.adults += room.adults;
      acc.children += room.childAges.length;
      return acc;
    },
    { adults: 0, children: 0 }
  );

  return (
    <main className="max-w-3xl mx-auto px-6 py-16">
      <h1 className="text-3xl font-bold">Review your booking</h1>

      <div className="mt-8 border rounded-2xl p-6 bg-white">
        <p className="text-sm text-gray-500">Itinerary</p>
        <p className="text-xl font-semibold">{title || "—"}</p>
        <p className="text-gray-600 mt-1">{days || "—"} days</p>

        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-gray-500">Start date</p>
            <p className="font-medium">{startDate || "—"}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Hotel level</p>
            <p className="font-medium">{hotelLevelLabels[hotelLevel as keyof typeof hotelLevelLabels] ?? hotelLevel}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Start From</p>
            <p className="font-medium">{endpointLabels[startFrom as keyof typeof endpointLabels] ?? startFrom}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">End Location</p>
            <p className="font-medium">{endpointLabels[endLocation as keyof typeof endpointLabels] ?? endLocation}</p>
          </div>
          <div className="md:col-span-2">
            <p className="text-sm text-gray-500">Meal Plan</p>
            <p className="font-medium">{mealPlanLabels[mealPlan as keyof typeof mealPlanLabels] ?? mealPlan}</p>
          </div>
        </div>

        <div className="mt-6">
          <p className="text-sm text-gray-500">Room Arrangement</p>
          <div className="mt-2 space-y-2">
            {rooms.map((room, idx) => (
              <div key={idx} className="rounded-lg border px-3 py-2 text-sm">
                <span className="font-medium">Room {idx + 1}</span>: {room.adults} adult(s)
                {room.childAges.length > 0 ? `, ${room.childAges.length} child(ren) [ages ${room.childAges.join(", ")}]` : ""}
              </div>
            ))}
            {rooms.length === 0 && <p className="font-medium">—</p>}
          </div>
          <p className="mt-2 text-sm text-gray-600">
            Adults: {totals.adults} • Children: {totals.children} • Total travellers: {totals.adults + totals.children}
          </p>
        </div>

        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-gray-500 mb-1">First name</p>
            <input
              className="w-full border rounded-lg px-3 py-2"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              placeholder="First name"
            />
          </div>
          <div>
            <p className="text-sm text-gray-500 mb-1">Last name</p>
            <input
              className="w-full border rounded-lg px-3 py-2"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              placeholder="Last name"
            />
          </div>
          <div className="md:col-span-2">
            <p className="text-sm text-gray-500 mb-1">Email</p>
            <input
              type="email"
              className="w-full border rounded-lg px-3 py-2"
              value={customerEmail}
              onChange={(e) => setCustomerEmail(e.target.value)}
              placeholder="you@example.com"
            />
          </div>
          <div className="md:col-span-2">
            <p className="text-sm text-gray-500 mb-1">Nationality</p>
            <select
              className="w-full border rounded-lg px-3 py-2"
              value={nationality}
              onChange={(e) => setNationality(e.target.value)}
            >
              <option value="">Select nationality</option>
              {UN_MEMBER_STATES.map((state) => (
                <option key={state} value={state}>
                  {state}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="mt-6 flex items-start gap-3">
          <input
            id="terms-agree"
            type="checkbox"
            checked={agreedToTerms}
            onChange={(e) => setAgreedToTerms(e.target.checked)}
            className="mt-0.5 h-4 w-4 cursor-pointer accent-black shrink-0"
          />
          <label htmlFor="terms-agree" className="text-sm text-gray-600 cursor-pointer">
            I have read and agree to the{" "}
            <Link href="/terms" className="underline text-black hover:text-gray-700" target="_blank">Terms &amp; Conditions</Link>
            {" "}and{" "}
            <Link href="/cancellation" className="underline text-black hover:text-gray-700" target="_blank">Cancellation Policy</Link>.
          </label>
        </div>

        <div className="mt-6 flex items-center justify-between border-t pt-6 gap-4">
          <div>
            <p className="text-sm text-gray-500">Total</p>
            <p className="text-2xl font-bold">{displayTotal}</p>
            {currency === "INR" && (
              <p className="text-xs text-gray-500 mt-1">Payment processed in USD ({totalUsd})</p>
            )}
          </div>

          <button
            className="bg-black text-white px-5 py-3 rounded-lg font-medium hover:bg-gray-800 disabled:opacity-50"
            disabled={
              isPaying ||
              totalUsdCents <= 0 ||
              !slug ||
              !startDate ||
              rooms.length === 0 ||
              !firstName.trim() ||
              !lastName.trim() ||
              !customerEmail.trim() ||
              !nationality ||
              !agreedToTerms
            }
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
                    startFrom,
                    endLocation,
                    hotelLevel,
                    mealPlan,
                    rooms,
                    customerName,
                    customerEmail,
                    nationality,
                  }),
                });
                const data = await res.json();
                if (!res.ok) {
                  const msg = Array.isArray(data?.errors) ? data.errors.join(" ") : "Checkout failed.";
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

        {payError && <div className="mt-4 border rounded-xl bg-red-50 p-4 text-red-800 text-sm">{payError}</div>}
      </div>

      <div className="mt-6">
        <Link className="underline" href={slug ? `/itineraries/${slug}` : "/itineraries"}>
          ← Back to itinerary
        </Link>
      </div>
    </main>
  );
}
