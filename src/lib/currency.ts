"use client";

import { createContext, useContext } from "react";

export const INR_PER_USD = 92;

export type DisplayCurrency = "USD" | "INR";

export function formatPrice(usdCents: number, currency: DisplayCurrency): string {
  if (currency === "INR") {
    const inr = Math.round((usdCents / 100) * INR_PER_USD);
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(inr);
  }
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(usdCents / 100);
}

type CurrencyContextValue = {
  currency: DisplayCurrency;
  setCurrency: (c: DisplayCurrency) => void;
};

export const CurrencyContext = createContext<CurrencyContextValue>({
  currency: "USD",
  setCurrency: () => {},
});

export function useCurrency(): DisplayCurrency {
  return useContext(CurrencyContext).currency;
}

export function useSetCurrency(): (c: DisplayCurrency) => void {
  return useContext(CurrencyContext).setCurrency;
}
