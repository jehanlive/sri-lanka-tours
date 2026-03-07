"use client";

import { formatPrice, useCurrency } from "@/lib/currency";

export default function FromPrice({ usdCents }: { usdCents: number }) {
  const currency = useCurrency();
  return <>{formatPrice(usdCents, currency)} per person</>;
}
