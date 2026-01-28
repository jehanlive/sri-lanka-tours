export type Tier = "VALUE" | "STAR3" | "STAR4" | "STAR5";

/**
 * MVP pricing:
 * price depends on:
 *  - days
 *  - tier
 *  - paying pax (adults + children)
 * Infants are free (do not count in paying pax)
 *
 * This is placeholder data for now. We'll replace with DB later.
 */
const basePerDayUsd: Record<Tier, number> = {
  VALUE: 65,
  STAR3: 95,
  STAR4: 130,
  STAR5: 190,
};

// simple group discount multiplier by paying pax
function paxMultiplier(paxPaying: number): number {
  // solo is most expensive per person, groups get a better rate
  if (paxPaying <= 1) return 1.25;
  if (paxPaying === 2) return 1.12;
  if (paxPaying === 3) return 1.05;
  if (paxPaying === 4) return 1.0;
  if (paxPaying === 5) return 0.97;
  if (paxPaying === 6) return 0.95;
  if (paxPaying === 7) return 0.93;
  return 0.92; // 8
}

export function quoteUsdCents(args: {
  days: number;
  tier: Tier;
  adults: number;
  children: number;
  infants: number;
}): number {
  const paxPaying = args.adults + args.children;
  if (paxPaying <= 0) return 0;

  const perDay = basePerDayUsd[args.tier];
  const totalUsd = args.days * perDay * paxMultiplier(paxPaying) * paxPaying;

  return Math.round(totalUsd * 100);
}

export function formatUsd(cents: number): string {
  const dollars = cents / 100;
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(dollars);
}
