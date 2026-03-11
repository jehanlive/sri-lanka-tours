"use client";

import { useCurrency, useSetCurrency } from "@/lib/currency";

export default function CurrencyToggle() {
  const currency = useCurrency();
  const setCurrency = useSetCurrency();

  return (
    <div className="flex items-center rounded-full border-2 border-black overflow-hidden text-xs sm:text-sm font-bold shrink-0">
      <button
        type="button"
        onClick={() => setCurrency("USD")}
        className={`px-2.5 sm:px-3 py-1 transition-colors ${
          currency === "USD" ? "bg-black text-white" : "bg-transparent text-black hover:bg-black/10"
        }`}
      >
        USD
      </button>
      <button
        type="button"
        onClick={() => setCurrency("INR")}
        className={`px-2.5 sm:px-3 py-1 transition-colors ${
          currency === "INR" ? "bg-black text-white" : "bg-transparent text-black hover:bg-black/10"
        }`}
      >
        INR
      </button>
    </div>
  );
}
