import rateTables from "@/data/rateTables2026.json";
import { itineraries } from "@/lib/itineraries";

export type Tier = "VALUE" | "STAR3" | "STAR4" | "STAR5";
export type HotelLevel = "STANDARD" | "SUPERIOR" | "LUXURY";
export type TripEndpoint = "AIRPORT" | "COLOMBO_CITY";
export type MealPlan = "BREAKFAST_INCLUDED";

export type RoomSelection = {
  adults: number;
  childAges: number[];
};

export type QuoteInput = {
  slug: string;
  startDate: string;
  startFrom: TripEndpoint;
  endLocation: TripEndpoint;
  hotelLevel: HotelLevel;
  mealPlan: MealPlan;
  rooms: RoomSelection[];
};

export type QuoteBreakdown = {
  currency: "USD";
  seasonName: string;
  hotelLevel: HotelLevel;
  roomCount: number;
  totalAdults: number;
  totalChildren: number;
  totalPax: number;
  totalUsdCents: number;
};

type SeasonRow = { name: string; startDate: string; endDate: string };
type HotelRateRow = {
  hotelNumber: number | null;
  hotel: string;
  city: string;
  star: number;
  season: string;
  sglUsd: number;
  dblUsd: number;
  tplUsd: number;
  child5to11EbUsd: number;
  childUnder5NbUsd: number;
};
type TransportRateRow = {
  paxFrom: number;
  paxTo: number;
  dayRateLkr: number;
  includedKmPerDay: number;
  extraKmRateLkr: number;
};

const seasons = rateTables.seasons as SeasonRow[];
const hotelRates = rateTables.hotelRates as HotelRateRow[];
const transportRates = rateTables.transportRates as TransportRateRow[];

const DEFAULT_LKR_PER_USD = Number(process.env.NEXT_PUBLIC_LKR_PER_USD ?? process.env.LKR_PER_USD ?? 300);
const TOTAL_MARKUP_MULTIPLIER = 1.13;

const HOTEL_STAR_BY_LEVEL: Record<HotelLevel, number> = {
  STANDARD: 3,
  SUPERIOR: 4,
  LUXURY: 5,
};

export const hotelLevelLabels: Record<HotelLevel, string> = {
  STANDARD: "Standard (3 star or equivalent)",
  SUPERIOR: "Superior (4 star or equivalent)",
  LUXURY: "Luxury (5 star or equivalent)",
};

export const endpointLabels: Record<TripEndpoint, string> = {
  AIRPORT: "Bandaranaike International Airport",
  COLOMBO_CITY: "Colombo City",
};

export const mealPlanLabels: Record<MealPlan, string> = {
  BREAKFAST_INCLUDED: "Breakfast is Included",
};

function findSeasonByDate(startDate: string): SeasonRow {
  const d = new Date(`${startDate}T00:00:00Z`).toISOString().slice(0, 10);
  const season = seasons.find((s) => d >= s.startDate && d <= s.endDate);
  if (!season) throw new Error("No season found for selected date.");
  return season;
}

function getItineraryForQuote(slug: string) {
  const itinerary = itineraries.find((i) => i.slug === slug);
  if (!itinerary) throw new Error("Invalid itinerary.");
  if (!itinerary.overnightCities?.length) throw new Error("This itinerary is not yet configured for live pricing.");
  return itinerary;
}

function roomNightRateUsd(room: RoomSelection, hotel: HotelRateRow): number {
  let base = 0;
  if (room.adults === 1) base = hotel.sglUsd;
  else if (room.adults === 2) base = hotel.dblUsd;
  else if (room.adults === 3) base = hotel.tplUsd;
  else throw new Error("Invalid adults count for room.");

  let childrenUsd = 0;
  for (const age of room.childAges) {
    childrenUsd += age < 5 ? hotel.childUnder5NbUsd : hotel.child5to11EbUsd;
  }
  return base + childrenUsd;
}

function cheapestHotelRateForCity(city: string, star: number, seasonName: string): HotelRateRow {
  const matches = hotelRates.filter((h) => h.city === city && h.star === star && h.season === seasonName);
  if (!matches.length) throw new Error(`No ${star}-star hotel rate found for ${city} in ${seasonName}.`);
  return matches.reduce((best, row) => ((row.dblUsd ?? row.sglUsd) < (best.dblUsd ?? best.sglUsd) ? row : best));
}

function transportCostUsdCents(args: { totalPax: number; vehicleDays: number; totalKm: number }): number {
  const band = transportRates.find((r) => args.totalPax >= r.paxFrom && args.totalPax <= r.paxTo);
  if (!band) throw new Error("No transport rate available for this group size.");

  const includedKmTotal = band.includedKmPerDay * args.vehicleDays;
  const extraKm = Math.max(0, args.totalKm - includedKmTotal);
  const lkrTotal = band.dayRateLkr * args.vehicleDays + extraKm * band.extraKmRateLkr;
  return Math.round((lkrTotal / DEFAULT_LKR_PER_USD) * 100);
}

export function quoteItinerary(input: QuoteInput): QuoteBreakdown {
  const itinerary = getItineraryForQuote(input.slug);
  const season = findSeasonByDate(input.startDate);
  const star = HOTEL_STAR_BY_LEVEL[input.hotelLevel];

  const totalAdults = input.rooms.reduce((n, r) => n + r.adults, 0);
  const totalChildren = input.rooms.reduce((n, r) => n + r.childAges.length, 0);
  const totalPax = totalAdults + totalChildren;

  const hotelUsd = itinerary.overnightCities!.reduce((sum, city) => {
    const hotel = cheapestHotelRateForCity(city, star, season.name);
    const nightCost = input.rooms.reduce((roomSum, room) => roomSum + roomNightRateUsd(room, hotel), 0);
    return sum + nightCost;
  }, 0);

  const totalKm = itinerary.totalKm ?? 0;
  const vehicleDays = itinerary.vehicleDays ?? itinerary.days;
  const hotelUsdCents = Math.round(hotelUsd * 100);
  const transportUsdCents = transportCostUsdCents({ totalPax, vehicleDays, totalKm });
  const subtotalUsdCents = hotelUsdCents + transportUsdCents;
  const totalUsdCents = Math.round(subtotalUsdCents * TOTAL_MARKUP_MULTIPLIER);

  return {
    currency: "USD",
    seasonName: season.name,
    hotelLevel: input.hotelLevel,
    roomCount: input.rooms.length,
    totalAdults,
    totalChildren,
    totalPax,
    totalUsdCents,
  };
}

export function quoteUsdCents(input: QuoteInput): number {
  return quoteItinerary(input).totalUsdCents;
}

export function getFromPricePerPersonUsdCents(slug: string): number | null {
  let min: number | null = null;
  for (const season of seasons) {
    try {
      const total = quoteItinerary({
        slug,
        startDate: season.startDate,
        startFrom: "AIRPORT",
        endLocation: "AIRPORT",
        hotelLevel: "STANDARD",
        mealPlan: "BREAKFAST_INCLUDED",
        rooms: [{ adults: 2, childAges: [] }],
      }).totalUsdCents;
      const perPerson = Math.round(total / 2);
      min = min === null ? perPerson : Math.min(min, perPerson);
    } catch {
      // skip if not priceable in a season
    }
  }
  return min;
}

export function formatUsd(cents: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(cents / 100);
}
