"use client";

import { useEffect, useState } from "react";
import { usePathname, useSearchParams } from "next/navigation";

const LANGUAGE_OPTIONS = [
  { code: "de", label: "Deutsch" },
  { code: "es", label: "Español" },
  { code: "fr", label: "Français" },
  { code: "hi", label: "हिन्दी" },
  { code: "ja", label: "日本語" },
  { code: "pl", label: "Polski" },
  { code: "ru", label: "Русский" },
  { code: "zh-CN", label: "简体中文" },
  { code: "ta", label: "தமிழ்" },
  { code: "te", label: "తెలుగు" },
  { code: "uk", label: "Українська" },
] as const;

export default function LocaleCurrencyBar() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [lang, setLang] = useState<(typeof LANGUAGE_OPTIONS)[number]["code"]>("de");
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const w = window as Window & {
      google?: {
        translate?: {
          TranslateElement?: new (
            options: Record<string, unknown>,
            elementId: string
          ) => unknown;
          TranslateElement?: { InlineLayout?: { SIMPLE: number } };
        };
      };
      __orilankaGoogleTranslateInit?: () => void;
    };

    if (document.getElementById("google-translate-script")) return;

    w.__orilankaGoogleTranslateInit = () => {
      if (!w.google?.translate?.TranslateElement) return;
      new w.google.translate.TranslateElement(
        {
          pageLanguage: "en",
          autoDisplay: false,
        },
        "google_translate_element_hidden"
      );
    };

    const script = document.createElement("script");
    script.id = "google-translate-script";
    script.src = "https://translate.google.com/translate_a/element.js?cb=__orilankaGoogleTranslateInit";
    script.async = true;
    document.body.appendChild(script);
  }, []);

  function currentUrl() {
    const query = searchParams.toString();
    const path = query ? `${pathname}?${query}` : pathname;
    if (typeof window === "undefined") return path;
    return `${window.location.origin}${path}`;
  }

  function translatePage() {
    document.cookie = `googtrans=/en/${lang}; path=/`;
    document.cookie = `googtrans=/en/${lang}; domain=${window.location.hostname}; path=/`;

    const combo = document.querySelector<HTMLSelectElement>(".goog-te-combo");
    if (combo) {
      combo.value = lang;
      combo.dispatchEvent(new Event("change"));
      return;
    }

    const url = encodeURIComponent(currentUrl());
    window.location.href = `https://translate.google.com/translate?sl=en&tl=${lang}&u=${url}`;
  }

  return (
    <aside className="fixed right-3 top-28 z-50">
      <div id="google_translate_element_hidden" className="hidden" />
      <div className="theme-outline rounded-2xl bg-[var(--surface)] shadow-lg w-[280px] overflow-hidden">
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          className="w-full px-4 py-3 text-center font-bold border-b-2 border-black/20 bg-[var(--surface-strong)]"
        >
          Language
        </button>

        {open && (
          <div className="p-4">
            <div className="text-sm font-semibold mb-2">Translate from English</div>
            <select
              className="w-full theme-outline rounded-lg px-3 py-2 bg-[var(--surface)] text-sm"
              value={lang}
              onChange={(e) => setLang(e.target.value as (typeof LANGUAGE_OPTIONS)[number]["code"])}
            >
              {LANGUAGE_OPTIONS.map((opt) => (
                <option key={opt.code} value={opt.code}>
                  {opt.label}
                </option>
              ))}
            </select>
            <button type="button" onClick={translatePage} className="mt-2 w-full theme-btn-primary px-3 py-2 text-sm">
              Translate Page
            </button>
            <p className="mt-2 text-xs text-black/60">Auto translation is provided via Google Translate.</p>
          </div>
        )}
      </div>
    </aside>
  );
}
