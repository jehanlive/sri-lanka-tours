"use client";

import Image from "next/image";
import { useState } from "react";
import type { StayOptions } from "@/lib/stayOptions";

type DayItem = { title: string; description: string; image?: string };

export default function ItineraryTabs(props: {
  overview?: string;
  dayByDay?: DayItem[];
  includes?: string[];
  excludes?: string[];
  stayOptions?: StayOptions;
}) {
  const [tab, setTab] = useState<"overview" | "itinerary" | "stay" | "important">("overview");
  const [openAll, setOpenAll] = useState(true);

  const tabs = [
    { key: "overview", label: "Overview" },
    { key: "itinerary", label: "Itinerary" },
    { key: "stay", label: "Where you'll stay" },
    { key: "important", label: "Important Information" },
  ] as const;

  return (
    <div className="rounded-2xl theme-outline bg-[var(--surface)]">
      {/* Tab bar */}
      <div className="flex items-center gap-6 px-6 pt-5 border-b-2 border-black/20">
        {tabs.map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={[
              "pb-4 text-base",
              tab === t.key
                ? "font-semibold border-b-2 border-black"
                : "text-black/60 hover:text-black",
            ].join(" ")}
            type="button"
          >
            {t.label}
          </button>
        ))}

        {tab === "itinerary" && (
          <div className="ml-auto flex items-center gap-3 pb-4">
            <span className="text-sm text-black/60">Expand all</span>
            <button
              type="button"
              onClick={() => setOpenAll((v) => !v)}
              className={[
                "w-14 h-7 rounded-full border transition relative",
                openAll ? "bg-black border-black" : "bg-white border-black/20",
              ].join(" ")}
              aria-label="Toggle expand all"
            >
              <span
                className={[
                  "absolute top-0.5 h-6 w-6 rounded-full transition",
                  openAll ? "left-7 bg-white" : "left-0.5 bg-black",
                ].join(" ")}
              />
            </button>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-6 md:p-8">
        {tab === "overview" && (
          <div>
            <h2 className="text-2xl font-semibold tracking-tight">Overview</h2>
            <p className="mt-4 text-black/70 leading-relaxed whitespace-pre-line">
              {props.overview ?? "Overview coming soon."}
            </p>
          </div>
        )}

        {tab === "itinerary" && (
          <div>
            <h2 className="text-2xl font-semibold tracking-tight">Itinerary</h2>

            <div className="mt-6 space-y-4">
              {(props.dayByDay?.length ? props.dayByDay : []).map((d, idx) => (
                <details
                  key={idx}
                  open={openAll}
                  className="group rounded-xl theme-outline p-5 bg-[var(--surface)]"
                >
                  <summary className="cursor-pointer list-none flex items-start justify-between gap-6">
                    <div className="text-lg font-semibold">{d.title}</div>
                    <span className="text-black/40 group-open:rotate-180 transition">
                      ▾
                    </span>
                  </summary>
                  {d.image && (
                    <div className="mt-4 relative w-full h-56 md:h-72 rounded-lg overflow-hidden border border-black/10">
                      <Image src={d.image} alt={d.title} fill className="object-cover" />
                    </div>
                  )}
                  <p className="mt-4 text-black/70 leading-relaxed whitespace-pre-line">
                    {d.description}
                  </p>
                </details>
              ))}

              {!props.dayByDay?.length && (
                <div className="text-black/60">Detailed itinerary coming soon.</div>
              )}
            </div>
          </div>
        )}

        {tab === "stay" && (
          <div>
            <h2 className="text-2xl font-semibold tracking-tight">Where you&apos;ll stay</h2>

            <div className="mt-6 rounded-xl theme-outline p-5 bg-[var(--surface)]">
              <div>
                <div className="font-medium text-sm">3 Star</div>
                <ul className="mt-2 space-y-1 text-black/70 text-sm">
                  {(props.stayOptions?.star3 ?? []).map((x) => (
                    <li key={`s3-${x}`}>{x}</li>
                  ))}
                  {!props.stayOptions?.star3?.length && <li className="text-black/60">Coming soon.</li>}
                </ul>
              </div>

              <div className="mt-4">
                <div className="font-medium text-sm">4 Star</div>
                <ul className="mt-2 space-y-1 text-black/70 text-sm">
                  {(props.stayOptions?.star4 ?? []).map((x) => (
                    <li key={`s4-${x}`}>{x}</li>
                  ))}
                  {!props.stayOptions?.star4?.length && <li className="text-black/60">Coming soon.</li>}
                </ul>
              </div>

              <div className="mt-4">
                <div className="font-medium text-sm">5 Star</div>
                <ul className="mt-2 space-y-1 text-black/70 text-sm">
                  {(props.stayOptions?.star5 ?? []).map((x) => (
                    <li key={`s5-${x}`}>{x}</li>
                  ))}
                  {!props.stayOptions?.star5?.length && <li className="text-black/60">Coming soon.</li>}
                </ul>
              </div>

              <p className="mt-4 text-xs text-black/60 leading-relaxed">
                Hotels are indicative only. While we will endeavour to book the listed hotels first, we may book alternative hotels in similar locations at the same standards or better standards if rooms are unavailable.
              </p>
            </div>
          </div>
        )}

        {tab === "important" && (
          <div>
            <h2 className="text-2xl font-semibold tracking-tight">
              Inclusions and Exclusions
            </h2>

            <div className="mt-6 grid md:grid-cols-2 gap-6">
              <div className="rounded-xl theme-outline p-5 bg-[var(--surface)]">
                <div className="text-lg font-semibold">Cost Includes</div>
                <ul className="mt-4 space-y-2 text-black/70">
                  {(props.includes ?? []).map((x) => (
                    <li key={x} className="flex gap-3">
                      <span className="mt-1">✓</span>
                      <span>{x}</span>
                    </li>
                  ))}
                  {!props.includes?.length && (
                    <li className="text-black/60">Coming soon.</li>
                  )}
                </ul>
              </div>

              <div className="rounded-xl theme-outline p-5 bg-[var(--surface)]">
                <div className="text-lg font-semibold">Cost Excludes</div>
                <ul className="mt-4 space-y-2 text-black/70">
                  {(props.excludes ?? []).map((x) => (
                    <li key={x} className="flex gap-3">
                      <span className="mt-1">✕</span>
                      <span>{x}</span>
                    </li>
                  ))}
                  {!props.excludes?.length && (
                    <li className="text-black/60">Coming soon.</li>
                  )}
                </ul>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
