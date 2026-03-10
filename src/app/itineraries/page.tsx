"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { itineraries, type BudgetBand } from "@/lib/itineraries";
import { getFromPricePerPersonUsdCents } from "@/lib/pricing";
import { formatPrice, useCurrency } from "@/lib/currency";

const BUDGET_LABEL: Record<BudgetBand, string> = {
  UNDER_100: "Under $100 pp",
  UNDER_300: "Under $300 pp",
  UNDER_500: "Under $500 pp",
  PREMIUM: "Premium",
};

const SORT_OPTIONS = [
  { value: "PRICE_ASC", label: "Total Price: Lowest First" },
  { value: "PRICE_DESC", label: "Total Price: Highest First" },
  { value: "DURATION_ASC", label: "Duration: Shortest First" },
  { value: "DURATION_DESC", label: "Duration: Longest First" },
] as const;

type SortValue = (typeof SORT_OPTIONS)[number]["value"];

const REGION_OPTIONS = ["Bentota", "Colombo", "Ella", "Gal Oya", "Galle", "Kandy", "Nuwara Eliya", "Sigiriya", "Yala"] as const;
const CATEGORY_OPTIONS = [
  "Adventure",
  "Ayurveda",
  "Beach",
  "Birding",
  "Culinary",
  "Culture",
  "Honeymoon",
  "Ramayana",
  "Wildlife",
] as const;

function budgetLabel(usdAmount: number, currency: "USD" | "INR"): string {
  if (typeof usdAmount !== "number") return "—";
  return formatPrice(usdAmount * 100, currency);
}

function clamp(n: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, n));
}

function DualRange({
  min,
  max,
  valueMin,
  valueMax,
  onMinChange,
  onMaxChange,
}: {
  min: number;
  max: number;
  valueMin: number;
  valueMax: number;
  onMinChange: (value: number) => void;
  onMaxChange: (value: number) => void;
}) {
  const span = max - min || 1;
  const left = ((valueMin - min) / span) * 100;
  const right = ((valueMax - min) / span) * 100;

  return (
    <div className="relative pt-3">
      <div className="h-1 rounded bg-gray-300" />
      <div className="h-1 rounded bg-black absolute left-0 right-0 top-3" style={{ left: `${left}%`, right: `${100 - right}%` }} />

      <input
        type="range"
        min={min}
        max={max}
        value={valueMin}
        onChange={(e) => onMinChange(Number(e.target.value))}
        className="absolute top-0 left-0 w-full appearance-none bg-transparent pointer-events-none"
        style={{ zIndex: 3 }}
      />
      <input
        type="range"
        min={min}
        max={max}
        value={valueMax}
        onChange={(e) => onMaxChange(Number(e.target.value))}
        className="absolute top-0 left-0 w-full appearance-none bg-transparent pointer-events-none"
        style={{ zIndex: 4 }}
      />

      <style jsx>{`
        input[type="range"]::-webkit-slider-thumb {
          -webkit-appearance: none;
          appearance: none;
          width: 20px;
          height: 20px;
          border-radius: 9999px;
          border: 2px solid #e5e7eb;
          background: #fff;
          pointer-events: auto;
          cursor: pointer;
          box-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);
        }
        input[type="range"]::-moz-range-thumb {
          width: 20px;
          height: 20px;
          border-radius: 9999px;
          border: 2px solid #e5e7eb;
          background: #fff;
          pointer-events: auto;
          cursor: pointer;
          box-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);
        }
        input[type="range"]::-webkit-slider-runnable-track {
          background: transparent;
        }
        input[type="range"]::-moz-range-track {
          background: transparent;
        }
      `}</style>
    </div>
  );
}

function ItinerariesPageInner() {
  const currency = useCurrency();
  const searchParams = useSearchParams();

  const enriched = useMemo(() => {
    return itineraries.map((it) => {
      const fromCents = getFromPricePerPersonUsdCents(it.slug);
      const fromUsd = fromCents ? Math.round(fromCents / 100) : it.priceUsd;
      return {
        ...it,
        fromUsd,
        overnightSet: new Set(it.overnightCities ?? []),
      };
    });
  }, []);

  const minDaysAll = useMemo(() => Math.min(...enriched.map((i) => i.days)), [enriched]);
  const maxDaysAll = useMemo(() => Math.max(...enriched.map((i) => i.days)), [enriched]);
  const minBudgetAll = useMemo(() => Math.min(...enriched.map((i) => i.fromUsd)), [enriched]);
  const maxBudgetAll = useMemo(() => Math.max(...enriched.map((i) => i.fromUsd)), [enriched]);

  const [sortBy, setSortBy] = useState<SortValue>("PRICE_ASC");
  const [lengthMin, setLengthMin] = useState(minDaysAll);
  const [lengthMax, setLengthMax] = useState(maxDaysAll);
  const [budgetMin, setBudgetMin] = useState(minBudgetAll);
  const [budgetMax, setBudgetMax] = useState(() => {
    const priceParam = Number(searchParams.get("price") ?? "");
    return Number.isFinite(priceParam) && priceParam > 0
      ? Math.min(maxBudgetAll, priceParam)
      : maxBudgetAll;
  });
  const [regions, setRegions] = useState<string[]>([]);
  const [categories, setCategories] = useState<string[]>([]);

  const filtered = useMemo(() => {
    const list = enriched.filter((it) => {
      if (it.days < lengthMin || it.days > lengthMax) return false;
      if (it.fromUsd < budgetMin || it.fromUsd > budgetMax) return false;

      if (regions.length > 0) {
        const hit = regions.some((r) => it.overnightSet.has(r));
        if (!hit) return false;
      }

      if (categories.length > 0) {
        const hit = categories.some((c) => it.categories.includes(c));
        if (!hit) return false;
      }

      return true;
    });

    list.sort((a, b) => {
      if (sortBy === "PRICE_ASC") return a.fromUsd - b.fromUsd;
      if (sortBy === "PRICE_DESC") return b.fromUsd - a.fromUsd;
      if (sortBy === "DURATION_ASC") return a.days - b.days;
      return b.days - a.days;
    });

    return list;
  }, [enriched, lengthMin, lengthMax, budgetMin, budgetMax, regions, categories, sortBy]);

  function clearAll() {
    setSortBy("PRICE_ASC");
    setLengthMin(minDaysAll);
    setLengthMax(maxDaysAll);
    setBudgetMin(minBudgetAll);
    setBudgetMax(maxBudgetAll);
    setRegions([]);
    setCategories([]);
  }

  function toggleInList(value: string, state: string[], setState: (v: string[]) => void) {
    if (state.includes(value)) setState(state.filter((x) => x !== value));
    else setState([...state, value]);
  }

  return (
    <main className="max-w-7xl mx-auto px-6 py-10">
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
        <div>
          <h1 className="text-3xl font-bold">Available Itineraries</h1>
          <p className="text-black/60 mt-2">Use filters on the left to narrow down itineraries.</p>
        </div>

        <div className="text-sm text-black/60">
          Showing <span className="font-semibold text-black">{filtered.length}</span> itineraries
        </div>
      </div>

      <div className="mt-8 grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-8">
        <aside className="h-fit theme-card p-5">
          <div className="flex items-center justify-between">
            <div className="font-semibold">Filters</div>
            <button type="button" onClick={clearAll} className="text-sm underline underline-offset-4 hover:opacity-70">
              Clear all
            </button>
          </div>

          <div className="mt-5 space-y-6">
            <div>
              <div className="text-sm font-semibold mb-2">Sort By</div>
              <select
                className="w-full rounded-lg theme-outline px-3 py-2 text-sm bg-[var(--surface)]"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as SortValue)}
              >
                {SORT_OPTIONS.map((o) => (
                  <option key={o.value} value={o.value}>
                    {o.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <div className="text-sm font-semibold mb-2">Length</div>
              <div className="flex items-center justify-between text-xs text-black/70 mb-2">
                <span>min. {lengthMin} day</span>
                <span>max. {lengthMax} days</span>
              </div>
              <DualRange
                min={minDaysAll}
                max={maxDaysAll}
                valueMin={lengthMin}
                valueMax={lengthMax}
                onMinChange={(value) => setLengthMin(clamp(value, minDaysAll, lengthMax))}
                onMaxChange={(value) => setLengthMax(clamp(value, lengthMin, maxDaysAll))}
              />
            </div>

            <div>
              <div className="text-sm font-semibold mb-2">Regions</div>
              <div className="space-y-2">
                {REGION_OPTIONS.map((r) => (
                  <label key={r} className="flex items-center gap-2 text-sm">
                    <input type="checkbox" checked={regions.includes(r)} onChange={() => toggleInList(r, regions, setRegions)} />
                    {r}
                  </label>
                ))}
              </div>
            </div>

            <div>
              <div className="text-sm font-semibold mb-2">Budget</div>
              <div className="flex items-center justify-between text-xs text-black/70 mb-2">
                <span>min. {budgetLabel(budgetMin, currency)}</span>
                <span>max. {budgetLabel(budgetMax, currency)}</span>
              </div>
              <DualRange
                min={minBudgetAll}
                max={maxBudgetAll}
                valueMin={budgetMin}
                valueMax={budgetMax}
                onMinChange={(value) => setBudgetMin(clamp(value, minBudgetAll, budgetMax))}
                onMaxChange={(value) => setBudgetMax(clamp(value, budgetMin, maxBudgetAll))}
              />
            </div>

            <div>
              <div className="text-sm font-semibold mb-2">Categories</div>
              <div className="space-y-2">
                {CATEGORY_OPTIONS.map((c) => (
                  <label key={c} className="flex items-center gap-2 text-sm">
                    <input type="checkbox" checked={categories.includes(c)} onChange={() => toggleInList(c, categories, setCategories)} />
                    {c}
                  </label>
                ))}
              </div>
            </div>
          </div>
        </aside>

        <section className="space-y-6">
          {filtered.length === 0 ? (
            <div className="theme-card p-6 text-black/70">No itineraries match your filters.</div>
          ) : (
            filtered.map((it) => (
              <div key={it.slug} className="rounded-2xl theme-outline overflow-hidden bg-[var(--surface)] shadow-sm">
                <div className="grid grid-cols-1 lg:grid-cols-[420px_1fr_220px]">
                  <Link href={`/itineraries/${it.slug}`} className="relative h-64 lg:h-full bg-black/5 block overflow-hidden group">
                    <Image
                      src={it.image}
                      alt={it.title}
                      fill
                      className="object-cover transition-transform duration-300 group-hover:scale-105"
                      sizes="(max-width: 1024px) 100vw, 420px"
                    />
                  </Link>

                  <div className="p-6">
                    <Link href={`/itineraries/${it.slug}`} className="hover:underline">
                      <h2 className="text-2xl font-semibold leading-snug">{it.title}</h2>
                    </Link>

                    <div className="mt-3 flex flex-wrap gap-2">
                      <span className="text-xs theme-pill px-3 py-1">{it.days} days</span>
                      <span className="text-xs theme-pill px-3 py-1">{BUDGET_LABEL[it.budget]}</span>
                      {it.categories.slice(0, 2).map((c) => (
                        <span key={c} className="text-xs theme-pill px-3 py-1">
                          {c}
                        </span>
                      ))}
                    </div>

                    <p className="mt-4 text-sm text-black/60 cursor-default">{it.summary}</p>

                    <div className="mt-5 flex flex-wrap gap-2">
                      {Array.from(new Set(it.overnightCities ?? [])).map((city) => (
                        <span key={city} className="text-xs theme-pill px-3 py-1">
                          {city}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="p-6 border-t lg:border-t-0 lg:border-l border-black/10 flex flex-col justify-between">
                    <div className="text-right">
                      <div className="text-3xl font-semibold tabular-nums">{budgetLabel(it.fromUsd, currency)}</div>
                      <div className="mt-1 text-xs text-black/50">per person (from)</div>
                    </div>

                    <Link href={`/itineraries/${it.slug}`} className="mt-6 inline-flex items-center justify-center theme-btn-primary px-6 py-3 text-sm">
                      View Trip
                    </Link>
                  </div>
                </div>
              </div>
            ))
          )}
        </section>
      </div>
    </main>
  );
}

export default function ItinerariesPage() {
  return (
    <Suspense fallback={<div className="max-w-7xl mx-auto px-6 py-10">Loading…</div>}>
      <ItinerariesPageInner />
    </Suspense>
  );
}
