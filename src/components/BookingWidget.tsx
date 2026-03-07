"use client";

import { useEffect, useState, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { getMaxStartDateISO, getMinStartDateISO, validateBookingInput } from "@/lib/bookingRules";
import {
  endpointLabels,
  hotelLevelLabels,
  mealPlanLabels,
  type HotelLevel,
  type MealPlan,
  type RoomSelection,
  type TripEndpoint,
} from "@/lib/pricing";
import { formatPrice, useCurrency } from "@/lib/currency";

const HOTEL_LEVEL_OPTIONS: HotelLevel[] = ["STANDARD", "SUPERIOR", "LUXURY"];
const ENDPOINT_OPTIONS: TripEndpoint[] = ["AIRPORT", "COLOMBO_CITY"];
const MEAL_PLAN: MealPlan = "BREAKFAST_INCLUDED";

function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n));
}

function withRoomConstraints(room: RoomSelection): RoomSelection {
  let adults = clamp(Math.trunc(room.adults || 0), 1, 3);
  let childAges = Array.isArray(room.childAges) ? room.childAges.map((a) => clamp(Math.trunc(a), 0, 11)) : [];
  childAges = childAges.slice(0, 2);

  if (childAges.length > 0 && adults > 2) adults = 2;
  while (adults + childAges.length > 4 && childAges.length > 0) {
    childAges = childAges.slice(0, -1);
  }
  if (adults + childAges.length > 4) {
    adults = 4 - childAges.length;
    adults = clamp(adults, 1, childAges.length > 0 ? 2 : 3);
  }

  return { adults, childAges };
}

function firstOfMonth(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), 1);
}

function addMonths(date: Date, delta: number): Date {
  return new Date(date.getFullYear(), date.getMonth() + delta, 1);
}

function toIsoDate(date: Date): string {
  return date.toISOString().slice(0, 10);
}

function buildMonthGrid(monthStart: Date): Array<Date | null> {
  const firstWeekday = monthStart.getDay();
  const daysInMonth = new Date(monthStart.getFullYear(), monthStart.getMonth() + 1, 0).getDate();
  const cells: Array<Date | null> = [];
  for (let i = 0; i < firstWeekday; i += 1) cells.push(null);
  for (let day = 1; day <= daysInMonth; day += 1) {
    cells.push(new Date(monthStart.getFullYear(), monthStart.getMonth(), day));
  }
  return cells;
}

export default function BookingWidget({
  slug,
  title,
  days,
  fromPriceUsdCents,
}: {
  slug: string;
  title: string;
  days: number;
  fromPriceUsdCents?: number | null;
}) {
  const router = useRouter();
  const currency = useCurrency();

  const [startDate, setStartDate] = useState("");
  const minStartDate = getMinStartDateISO();
  const maxStartDate = getMaxStartDateISO();
  const minMonth = firstOfMonth(new Date());
  const maxMonth = firstOfMonth(new Date(maxStartDate));
  const [calendarMonth, setCalendarMonth] = useState<Date>(minMonth);
  const [startFrom, setStartFrom] = useState<TripEndpoint>("AIRPORT");
  const [endLocation, setEndLocation] = useState<TripEndpoint>("AIRPORT");
  const [hotelLevel, setHotelLevel] = useState<HotelLevel>("STANDARD");
  const [rooms, setRooms] = useState<RoomSelection[]>([{ adults: 2, childAges: [] }]);

  const [quoteTotalUsdCents, setQuoteTotalUsdCents] = useState<number | null>(null);
  const [quoteError, setQuoteError] = useState("");
  const [isQuoting, setIsQuoting] = useState(false);

  const validation = validateBookingInput({
    slug,
    startDate,
    startFrom,
    endLocation,
    hotelLevel,
    mealPlan: MEAL_PLAN,
    rooms,
    days,
  });
  const visibleValidationErrors = startDate
    ? validation.errors
    : validation.errors.filter((e) => e !== "Start date is required.");

  useEffect(() => {
    let cancelled = false;

    async function runQuote() {
      setQuoteTotalUsdCents(null);
      setQuoteError("");

      if (!startDate || !validation.ok) return;

      setIsQuoting(true);
      try {
        const res = await fetch("/api/quote", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            slug,
            startDate,
            startFrom,
            endLocation,
            hotelLevel,
            mealPlan: MEAL_PLAN,
            rooms,
          }),
        });
        const data = await res.json();
        if (!res.ok) {
          const msg = Array.isArray(data?.errors) ? data.errors.join(" ") : "Quote failed.";
          if (!cancelled) setQuoteError(msg);
          return;
        }
        if (!cancelled) setQuoteTotalUsdCents(Number(data.totalUsdCents ?? 0));
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
  }, [slug, startDate, startFrom, endLocation, hotelLevel, rooms, validation.ok]);

  const totalTravellers = validation.totalPax;

  return (
    <div className="theme-card p-6 shadow-sm">
      <h3 className="text-lg font-semibold">Book this itinerary</h3>
      {fromPriceUsdCents ? (
        <p className="text-sm text-gray-600 mt-1">From {formatPrice(fromPriceUsdCents, currency)} per person</p>
      ) : (
        <p className="text-sm text-gray-600 mt-1">Select dates and room arrangement to get a live quote.</p>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
        <div className="md:col-span-2">
          <div className="text-sm font-medium text-gray-700 mb-2">Availability</div>
          <div className="theme-outline rounded-xl p-4 bg-[var(--surface)]">
            <div className="flex items-center justify-between mb-4">
              <button
                type="button"
                className="border rounded-full px-3 py-1 text-sm disabled:opacity-40"
                disabled={calendarMonth <= minMonth}
                onClick={() => setCalendarMonth((prev) => addMonths(prev, -1))}
              >
                ←
              </button>
              <div className="text-sm text-gray-600">
                Earliest start date: <span className="font-semibold">{minStartDate}</span>
              </div>
              <button
                type="button"
                className="border rounded-full px-3 py-1 text-sm"
                disabled={addMonths(calendarMonth, 1) >= maxMonth}
                onClick={() => setCalendarMonth((prev) => addMonths(prev, 1))}
              >
                →
              </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {[calendarMonth, addMonths(calendarMonth, 1)].map((monthStart) => (
                <MonthCalendar
                  key={`${monthStart.getFullYear()}-${monthStart.getMonth()}`}
                  monthStart={monthStart}
                  selectedDate={startDate}
                  minStartDate={minStartDate}
                  maxStartDate={maxStartDate}
                  onSelect={setStartDate}
                />
              ))}
            </div>
          </div>
        </div>

        <Field label="Hotel level">
          <select
            className="w-full theme-outline rounded-lg px-3 py-2 bg-[var(--surface)]"
            value={hotelLevel}
            onChange={(e) => setHotelLevel(e.target.value as HotelLevel)}
          >
            {HOTEL_LEVEL_OPTIONS.map((level) => (
              <option key={level} value={level}>
                {hotelLevelLabels[level]}
              </option>
            ))}
          </select>
        </Field>

        <Field label="Start From">
          <select
            className="w-full theme-outline rounded-lg px-3 py-2 bg-[var(--surface)]"
            value={startFrom}
            onChange={(e) => setStartFrom(e.target.value as TripEndpoint)}
          >
            {ENDPOINT_OPTIONS.map((opt) => (
              <option key={opt} value={opt}>
                {endpointLabels[opt]}
              </option>
            ))}
          </select>
        </Field>

        <Field label="End Location">
          <select
            className="w-full theme-outline rounded-lg px-3 py-2 bg-[var(--surface)]"
            value={endLocation}
            onChange={(e) => setEndLocation(e.target.value as TripEndpoint)}
          >
            {ENDPOINT_OPTIONS.map((opt) => (
              <option key={opt} value={opt}>
                {endpointLabels[opt]}
              </option>
            ))}
          </select>
        </Field>

        <div className="md:col-span-2">
          <Field label="Meal Plan">
            <select className="w-full theme-outline rounded-lg px-3 py-2 bg-[var(--surface-strong)]" value={MEAL_PLAN} disabled>
              <option value={MEAL_PLAN}>{mealPlanLabels[MEAL_PLAN]}</option>
            </select>
          </Field>
        </div>
      </div>

      <div className="mt-6">
        <div className="flex items-center justify-between gap-4">
          <h4 className="text-base font-semibold">Room Arrangement</h4>
          <button
            type="button"
            className="theme-pill px-4 py-2 text-sm font-medium hover:bg-[var(--surface-strong)] disabled:opacity-50"
            disabled={rooms.length >= 6}
            onClick={() => setRooms((prev) => [...prev, { adults: 1, childAges: [] }])}
          >
            + Add a room
          </button>
        </div>

        <div className="mt-4 space-y-4">
          {rooms.map((room, index) => {
            const children = room.childAges.length;
            return (
              <div key={index} className="rounded-xl theme-outline p-4 bg-[var(--surface)]">
                <div className="flex items-center justify-between gap-4">
                  <div className="font-semibold">Room {index + 1}</div>
                  {rooms.length > 1 && (
                    <button
                      type="button"
                      className="text-sm underline"
                      onClick={() => setRooms((prev) => prev.filter((_, i) => i !== index))}
                    >
                      Remove
                    </button>
                  )}
                </div>

                <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Counter
                    label="Adults"
                    value={room.adults}
                    min={1}
                    max={children > 0 ? 2 : 3}
                    onChange={(nextAdults) => {
                      setRooms((prev) =>
                        prev.map((r, i) =>
                          i === index ? withRoomConstraints({ ...r, adults: nextAdults }) : r
                        )
                      );
                    }}
                  />

                  <Counter
                    label="Children (under 12)"
                    value={children}
                    min={0}
                    max={Math.min(2, 4 - room.adults)}
                    onChange={(nextChildren) => {
                      setRooms((prev) =>
                        prev.map((r, i) => {
                          if (i !== index) return r;
                          const current = [...r.childAges];
                          if (nextChildren > current.length) {
                            while (current.length < nextChildren) current.push(5);
                          } else {
                            current.length = nextChildren;
                          }
                          return withRoomConstraints({ ...r, childAges: current });
                        })
                      );
                    }}
                  />
                </div>

                {children > 0 && (
                  <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-3">
                    {room.childAges.map((age, childIndex) => (
                      <Field key={childIndex} label={`${ordinal(childIndex + 1)} child age`}>
                        <select
                          className="w-full theme-outline rounded-lg px-3 py-2 bg-[var(--surface)]"
                          value={age}
                          onChange={(e) => {
                            const nextAge = Number(e.target.value);
                            setRooms((prev) =>
                              prev.map((r, i) => {
                                if (i !== index) return r;
                                const ages = [...r.childAges];
                                ages[childIndex] = nextAge;
                                return withRoomConstraints({ ...r, childAges: ages });
                              })
                            );
                          }}
                        >
                          {Array.from({ length: 12 }, (_, n) => (
                            <option key={n} value={n}>
                              {n === 0 ? "Under 1" : `${n}`}
                            </option>
                          ))}
                        </select>
                      </Field>
                    ))}
                  </div>
                )}

                <p className="mt-4 text-sm text-sky-700">
                  Many hotels in Sri Lanka don&apos;t accommodate 3+ people per room. We&apos;ll try to propose hotels which do, however, splitting people between rooms could give more choice and lower prices.
                </p>
              </div>
            );
          })}
        </div>
      </div>

      <div className="mt-4 text-sm text-gray-700">
        Total travellers: <span className="font-semibold">{totalTravellers}</span> • Rooms: <span className="font-semibold">{rooms.length}</span>
      </div>

      {visibleValidationErrors.length > 0 && (
        <div className="mt-4 rounded-xl border-2 border-red-700 bg-red-50 p-4">
          <p className="font-medium text-red-800 mb-2">Fix these:</p>
          <ul className="list-disc pl-5 text-red-800 space-y-1">
            {visibleValidationErrors.map((e) => (
              <li key={e}>{e}</li>
            ))}
          </ul>
        </div>
      )}

      {quoteError && (
        <div className="mt-4 rounded-xl border-2 border-red-700 bg-red-50 p-4 text-red-800 text-sm">{quoteError}</div>
      )}

      {startDate && validation.ok && (
        <div className="mt-6 rounded-xl theme-outline bg-[var(--surface)] p-4">
          <div className="flex items-center justify-between gap-4">
            <div>
              <div className="text-sm text-gray-600">Total package cost</div>
              <div className="text-2xl font-bold">
                {isQuoting ? "Calculating…" : quoteTotalUsdCents ? formatPrice(quoteTotalUsdCents, currency) : "—"}
              </div>
            </div>

            <button
              className="theme-btn-primary px-5 py-3 rounded-lg font-medium disabled:opacity-50"
              disabled={!quoteTotalUsdCents || isQuoting}
              onClick={() => {
                if (!quoteTotalUsdCents) return;
                const qp = new URLSearchParams({
                  slug,
                  title,
                  days: String(days),
                  startDate,
                  startFrom,
                  endLocation,
                  hotelLevel,
                  mealPlan: MEAL_PLAN,
                  rooms: JSON.stringify(rooms),
                  totalUsdCents: String(quoteTotalUsdCents),
                });
                router.push(`/review?${qp.toString()}`);
              }}
            >
              Continue
            </button>
          </div>
        </div>
      )}

      {!startDate && <div className="mt-6 text-sm text-gray-600">Select dates to see the final price.</div>}
    </div>
  );
}

function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">{label}</label>
      {children}
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
      <label className="block text-sm font-medium text-gray-700 mb-2">{label}</label>
      <div className="flex items-center gap-2">
        <button type="button" className="border rounded-lg px-3 py-2 hover:bg-gray-100" onClick={() => onChange(clamp(value - 1, min, max))}>
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
        <button type="button" className="border rounded-lg px-3 py-2 hover:bg-gray-100" onClick={() => onChange(clamp(value + 1, min, max))}>
          +
        </button>
      </div>
    </div>
  );
}

function ordinal(n: number) {
  if (n % 10 === 1 && n % 100 !== 11) return `${n}st`;
  if (n % 10 === 2 && n % 100 !== 12) return `${n}nd`;
  if (n % 10 === 3 && n % 100 !== 13) return `${n}rd`;
  return `${n}th`;
}

function MonthCalendar({
  monthStart,
  selectedDate,
  minStartDate,
  maxStartDate,
  onSelect,
}: {
  monthStart: Date;
  selectedDate: string;
  minStartDate: string;
  maxStartDate: string;
  onSelect: (isoDate: string) => void;
}) {
  const cells = buildMonthGrid(monthStart);
  const monthLabel = new Intl.DateTimeFormat("en-US", { month: "long", year: "numeric" }).format(monthStart);
  const weekdays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  return (
    <div className="rounded-xl border p-3">
      <div className="text-center font-semibold text-sm mb-2">{monthLabel.toUpperCase()}</div>
      <div className="grid grid-cols-7 gap-1 text-xs text-gray-500 mb-1">
        {weekdays.map((w) => (
          <div key={w} className="text-center py-1">
            {w}
          </div>
        ))}
      </div>
      <div className="grid grid-cols-7 gap-1">
        {cells.map((date, idx) => {
          if (!date) return <div key={`empty-${idx}`} className="h-10" />;
          const iso = toIsoDate(date);
          const isDisabled = iso < minStartDate || iso > maxStartDate;
          const isSelected = iso === selectedDate;
          return (
            <button
              key={iso}
              type="button"
              onClick={() => onSelect(iso)}
              disabled={isDisabled}
              className={[
                "h-10 rounded text-sm",
                isSelected ? "bg-[var(--brand)] text-white" : isDisabled ? "bg-gray-100 text-gray-400" : "bg-[var(--surface-strong)] hover:bg-[#ead7a1]",
              ].join(" ")}
              aria-label={iso}
            >
              {date.getDate()}
            </button>
          );
        })}
      </div>
    </div>
  );
}
