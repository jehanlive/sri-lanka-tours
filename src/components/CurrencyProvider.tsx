"use client";

import { useEffect, useState } from "react";
import { CurrencyContext, type DisplayCurrency } from "@/lib/currency";

export default function CurrencyProvider({ children }: { children: React.ReactNode }) {
  const [currency, setCurrency] = useState<DisplayCurrency>("USD");

  useEffect(() => {
    fetch("/api/country")
      .then((r) => r.json())
      .then((data) => {
        if (data.country === "IN") setCurrency("INR");
      })
      .catch(() => {});
  }, []);

  return (
    <CurrencyContext.Provider value={{ currency, setCurrency }}>
      {children}
    </CurrencyContext.Provider>
  );
}
