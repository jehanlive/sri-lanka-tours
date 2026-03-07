"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import CurrencyToggle from "./CurrencyToggle";

const NAV = [
  { label: "Home", href: "/" },
  { label: "Itineraries", href: "/itineraries" },
  { label: "Sri Lanka Guide", href: "/guide" },
  { label: "About Us", href: "/about" },
  { label: "Contact", href: "/contact" },
];

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-[var(--surface)] border-b-2 border-black">
      <div className="max-w-6xl mx-auto px-6 py-3 flex items-center justify-between gap-6">
        {/* Logo */}
        <Link href="/" className="shrink-0" onClick={() => setMobileOpen(false)}>
          <Image
            src="/UpdateOriLankaLogo.png"
            alt="Oriental Travels"
            width={350}
            height={120}
            priority
            className="h-auto w-65"
          />
        </Link>

        {/* Desktop nav */}
        <nav className="hidden lg:flex items-center gap-2 text-[16px] font-bold">
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="whitespace-nowrap rounded-full px-4 py-2 transition hover:bg-[var(--surface-strong)]"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        {/* Desktop: currency toggle + CTA */}
        <div className="hidden lg:flex items-center gap-3">
          <CurrencyToggle />
          <Link
            href="/itineraries"
            className="inline-flex items-center justify-center theme-btn-primary px-5 py-2 text-[18px] text-center"
          >
            View Packages
          </Link>
        </div>

        {/* Mobile: currency toggle + hamburger */}
        <div className="flex lg:hidden items-center gap-3">
          <CurrencyToggle />
          <button
            type="button"
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
            onClick={() => setMobileOpen((v) => !v)}
            className="flex flex-col justify-center gap-1.5 p-2"
          >
            <span
              className={`block h-0.5 w-6 bg-black transition-transform duration-200 ${
                mobileOpen ? "translate-y-2 rotate-45" : ""
              }`}
            />
            <span
              className={`block h-0.5 w-6 bg-black transition-opacity duration-200 ${
                mobileOpen ? "opacity-0" : ""
              }`}
            />
            <span
              className={`block h-0.5 w-6 bg-black transition-transform duration-200 ${
                mobileOpen ? "-translate-y-2 -rotate-45" : ""
              }`}
            />
          </button>
        </div>
      </div>

      {/* Mobile nav panel */}
      {mobileOpen && (
        <nav className="lg:hidden border-t-2 border-black bg-[var(--surface)] px-6 py-4 flex flex-col gap-1 text-[16px] font-bold">
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setMobileOpen(false)}
              className="rounded-lg px-3 py-3 transition hover:bg-[var(--surface-strong)]"
            >
              {item.label}
            </Link>
          ))}
          <Link
            href="/itineraries"
            onClick={() => setMobileOpen(false)}
            className="mt-2 inline-flex items-center justify-center theme-btn-primary px-5 py-3 text-base text-center rounded-lg"
          >
            View Packages
          </Link>
        </nav>
      )}
    </header>
  );
}
