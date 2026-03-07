import rateTables from "@/data/rateTables2026.json";

type HotelRateRow = {
  city: string;
  star: number;
  hotel: string;
  dblUsd: number;
  sglUsd: number;
};

export type StayOptions = {
  star3: string[];
  star4: string[];
  star5: string[];
};

const hotelRates = rateTables.hotelRates as HotelRateRow[];

function optionLine(city: string, hotel: string): string {
  return `${city} - ${hotel} or Equivalent Standards`;
}

function bestHotelForCity(city: string, star: number): string | null {
  const options = hotelRates.filter((r) => r.city === city && r.star === star);
  if (!options.length) return null;
  const best = options.reduce((a, b) => ((b.dblUsd || b.sglUsd) < (a.dblUsd || a.sglUsd) ? b : a));
  return best.hotel;
}

function uniqueCities(cities: string[]): string[] {
  return Array.from(new Set(cities.filter(Boolean)));
}

export function buildStayOptions(overnightCities: string[] | undefined): StayOptions {
  const cities = uniqueCities(overnightCities ?? []);

  const star3 = cities
    .map((city) => {
      const hotel = bestHotelForCity(city, 3);
      return hotel ? optionLine(city, hotel) : null;
    })
    .filter((v): v is string => Boolean(v));

  const star4 = cities
    .map((city) => {
      const hotel = bestHotelForCity(city, 4);
      return hotel ? optionLine(city, hotel) : null;
    })
    .filter((v): v is string => Boolean(v));

  const star5 = cities
    .map((city) => {
      const hotel = bestHotelForCity(city, 5);
      return hotel ? optionLine(city, hotel) : null;
    })
    .filter((v): v is string => Boolean(v));

  return { star3, star4, star5 };
}
