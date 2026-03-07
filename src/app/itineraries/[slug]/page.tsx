import Image from "next/image";
import Link from "next/link";
import BookingWidget from "@/components/BookingWidget";
import ItineraryTabs from "@/components/ItineraryTabs";
import { itineraries } from "@/lib/itineraries";
import { getFromPricePerPersonUsdCents } from "@/lib/pricing";
import FromPrice from "@/components/FromPrice";
import { buildStayOptions } from "@/lib/stayOptions";
import type { Metadata } from "next";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const itinerary = itineraries.find((i) => i.slug === slug);
  if (!itinerary) return {};
  return {
    title: `${itinerary.title} | Oriental Travels`,
    description: itinerary.summary,
  };
}

export default async function ItineraryDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const itinerary = itineraries.find((i) => i.slug === slug);

  if (!itinerary) {
    return (
      <main className="max-w-3xl mx-auto px-6 py-16">
        <h1 className="text-2xl font-bold mb-4">Itinerary not found</h1>
        <Link className="underline" href="/itineraries">
          Back to itineraries
        </Link>
      </main>
    );
  }

  const fromPriceUsdCents = getFromPricePerPersonUsdCents(slug);
  const stayOptions = buildStayOptions(itinerary.overnightCities);

  return (
    <main className="max-w-6xl mx-auto px-6 py-10">
      {/* Title */}
      <h1 className="text-3xl md:text-4xl font-bold tracking-tight">
        {itinerary.title}
      </h1>

      {/* Hero image */}
      <div className="mt-6 relative w-full h-[48vh] min-h-[360px] rounded-2xl overflow-hidden border border-black/10">
        <Image
          src={itinerary.image}
          alt={itinerary.title}
          fill
          priority
          className="object-cover"
        />
      </div>

      {/* Route highlight */}
      <div className="mt-6 text-black/70">
        <span className="font-semibold text-black">Route: </span>
        {itinerary.route ?? itinerary.summary}
      </div>
      {fromPriceUsdCents && (
        <div className="mt-2 text-black/70">
          <span className="font-semibold text-black">Price: </span>
          <FromPrice usdCents={fromPriceUsdCents} />
        </div>
      )}

      {/* Tabs */}
      <div className="mt-10">
        <ItineraryTabs
          overview={itinerary.overview}
          dayByDay={itinerary.dayByDay}
          includes={itinerary.includes}
          excludes={itinerary.excludes}
          stayOptions={stayOptions}
        />
      </div>

      {/* Booking block full width below tabs */}
      <div className="mt-8">
        <BookingWidget
          slug={itinerary.slug}
          title={itinerary.title}
          days={itinerary.days}
          fromPriceUsdCents={fromPriceUsdCents}
        />
      </div>

      <div className="mt-10">
        <Link className="underline text-sm" href="/itineraries">
          ← Back to itineraries
        </Link>
      </div>
    </main>
  );
}
