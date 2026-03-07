"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { formatPrice, useCurrency } from "@/lib/currency";

type SaleItinerary = {
  slug: string;
  title: string;
  days: number;
  image?: string;
  fromUsdCents?: number;
};

const TWO_DAYS_MS = 2 * 24 * 60 * 60 * 1000;
const RESET_AT_MS = 30 * 60 * 1000; // 30 minutes
const STORAGE_KEY = "ot_sale_end_time_v1";

function formatRemaining(ms: number) {
  const totalSeconds = Math.max(0, Math.floor(ms / 1000));
  const days = Math.floor(totalSeconds / 86400);
  const hours = Math.floor((totalSeconds % 86400) / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  const pad = (n: number) => String(n).padStart(2, "0");
  return `${days}d ${pad(hours)}h ${pad(minutes)}m ${pad(seconds)}s`;
}

export default function SalesBanner({ picks }: { picks: SaleItinerary[] }) {
  const currency = useCurrency();
  // ✅ Never trust props 100% (prevents “object” rendering crashes)
  const safePicks: SaleItinerary[] = Array.isArray(picks) ? picks : [];

  const [endTime, setEndTime] = useState<number>(() => Date.now() + TWO_DAYS_MS);
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    const parsed = stored ? Number(stored) : NaN;

    const initial =
      Number.isFinite(parsed) && parsed > Date.now()
        ? parsed
        : Date.now() + TWO_DAYS_MS;

    setEndTime(initial);
    window.localStorage.setItem(STORAGE_KEY, String(initial));
  }, []);

  useEffect(() => {
    const t = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    const remaining = endTime - now;
    if (remaining <= RESET_AT_MS) {
      const next = Date.now() + TWO_DAYS_MS;
      setEndTime(next);
      window.localStorage.setItem(STORAGE_KEY, String(next));
    }
  }, [endTime, now]);

  const remainingText = useMemo(
    () => formatRemaining(endTime - now),
    [endTime, now]
  );

  return (
    <section className="py-14">
      <div className="max-w-6xl mx-auto px-6">
        <div className="rounded-2xl border border-black/10 bg-white shadow-sm p-6 md:p-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div>
              <div className="text-sm font-semibold tracking-wide text-black/70">
                LIMITED TIME SALE
              </div>
              <div className="mt-2 text-2xl md:text-3xl font-semibold tracking-tight">
                Ends in <span className="tabular-nums">{remainingText}</span>
              </div>
              <div className="mt-2 text-sm text-black/60">
                Book selected packages before the timer resets.
              </div>
            </div>

            <Link
              href="/itineraries"
              className="inline-flex items-center justify-center rounded-full bg-black text-white px-6 py-3 text-sm font-semibold hover:bg-black/90"
            >
              View all itineraries
            </Link>
          </div>

          <div className="mt-8 grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {safePicks.slice(0, 12).map((it) => (
              <Link
                key={it.slug}
                href={`/itineraries/${it.slug}`}
                className="rounded-xl border border-black/10 overflow-hidden hover:shadow-md transition group"
              >
                {it.image && (
                  <div className="relative h-44 w-full bg-black/5">
                    <Image
                      src={it.image}
                      alt={it.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                      sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                    />
                  </div>
                )}
                <div className="p-5">
                  <div className="text-base font-semibold leading-snug">{it.title}</div>
                  <div className="mt-1 text-sm text-black/60">{it.days} days</div>
                  <div className="mt-3 text-lg font-semibold">
                    {it.fromUsdCents ? `From ${formatPrice(it.fromUsdCents, currency)}` : "—"}
                  </div>
                </div>
              </Link>
            ))}

            {safePicks.length === 0 && (
              <div className="text-sm text-black/60">
                No sale itineraries available yet.
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}