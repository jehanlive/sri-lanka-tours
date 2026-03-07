import itineraryData from "@/data/itineraries.generated.json";

export type BudgetBand = "UNDER_100" | "UNDER_300" | "UNDER_500" | "PREMIUM";

export type ItineraryDay = {
  title: string;
  description: string;
  image?: string;
};

export type Itinerary = {
  slug: string;
  days: number;
  title: string;
  summary: string;
  route?: string;
  overview?: string;
  dayByDay?: ItineraryDay[];
  includes?: string[];
  excludes?: string[];
  overnightCities?: string[];
  routeStops?: string[];
  totalKm?: number;
  vehicleDays?: number;
  priceUsd: number;
  categories: string[];
  budget: BudgetBand;
  image: string;
  highlights: string[];
};

export const itineraries = itineraryData as Itinerary[];
