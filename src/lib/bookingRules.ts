import type { QuoteInput } from "@/lib/pricing";

const HOTEL_LEVELS = new Set(["STANDARD", "SUPERIOR", "LUXURY"]);
const ENDPOINTS = new Set(["AIRPORT", "COLOMBO_CITY"]);
const MEAL_PLANS = new Set(["BREAKFAST_INCLUDED"]);

function toIsoDate(date: Date): string {
  return date.toISOString().slice(0, 10);
}

export function getMinStartDateISO(baseDate = new Date()): string {
  const d = new Date(Date.UTC(baseDate.getUTCFullYear(), baseDate.getUTCMonth(), baseDate.getUTCDate()));
  d.setUTCDate(d.getUTCDate() + 4);
  return toIsoDate(d);
}

export function getMaxStartDateISO(baseDate = new Date()): string {
  const d = new Date(Date.UTC(baseDate.getUTCFullYear(), baseDate.getUTCMonth(), baseDate.getUTCDate()));
  d.setUTCFullYear(d.getUTCFullYear() + 1);
  return toIsoDate(d);
}

export function validateBookingInput(input: QuoteInput & { days: number }) {
  const errors: string[] = [];

  if (!Number.isInteger(input.days) || input.days < 3 || input.days > 25) {
    errors.push("Invalid itinerary duration.");
  }

  if (!/^\d{4}-\d{2}-\d{2}$/.test(input.startDate)) {
    errors.push("Start date is required.");
  } else if (input.startDate < getMinStartDateISO()) {
    errors.push(`Start date must be at least 4 days from today (${getMinStartDateISO()}).`);
  } else if (input.startDate > getMaxStartDateISO()) {
    errors.push(`Start date must be within 12 months from today (${getMaxStartDateISO()}).`);
  }

  if (!ENDPOINTS.has(input.startFrom)) {
    errors.push("Invalid start location.");
  }

  if (!ENDPOINTS.has(input.endLocation)) {
    errors.push("Invalid end location.");
  }

  if (!HOTEL_LEVELS.has(input.hotelLevel)) {
    errors.push("Invalid hotel level.");
  }

  if (!MEAL_PLANS.has(input.mealPlan)) {
    errors.push("Invalid meal plan.");
  }

  if (!Array.isArray(input.rooms) || input.rooms.length < 1) {
    errors.push("At least 1 room is required.");
  }

  if (Array.isArray(input.rooms) && input.rooms.length > 6) {
    errors.push("Maximum 6 rooms for instant quoting.");
  }

  let totalAdults = 0;
  let totalChildren = 0;

  (input.rooms ?? []).forEach((room, idx) => {
    const label = `Room ${idx + 1}`;
    const adults = Number(room?.adults ?? 0);
    const childAges = Array.isArray(room?.childAges) ? room.childAges.map(Number) : [];
    const children = childAges.length;
    const pax = adults + children;

    if (!Number.isInteger(adults) || adults < 1) {
      errors.push(`${label}: at least 1 adult is required.`);
    }

    if (adults > 3) {
      errors.push(`${label}: maximum 3 adults.`);
    }

    if (children > 2) {
      errors.push(`${label}: maximum 2 children (under 12).`);
    }

    if (children > 0 && adults > 2) {
      errors.push(`${label}: if children are included, maximum adults is 2.`);
    }

    if (pax > 4) {
      errors.push(`${label}: maximum 4 passengers per room.`);
    }

    for (const age of childAges) {
      if (!Number.isInteger(age) || age < 0 || age > 11) {
        errors.push(`${label}: child ages must be between 0 and 11.`);
        break;
      }
    }

    totalAdults += adults;
    totalChildren += children;
  });

  const totalPax = totalAdults + totalChildren;

  if (totalPax < 1) {
    errors.push("At least 1 traveller is required.");
  }

  if (totalPax > 15) {
    errors.push("Maximum 15 travellers for instant quoting.");
  }

  return {
    ok: errors.length === 0,
    errors,
    totalAdults,
    totalChildren,
    totalPax,
  };
}
