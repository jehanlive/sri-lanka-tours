import Link from "next/link";
import BookingWidget from "@/components/BookingWidget";
import { itineraries } from "@/lib/itineraries";

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
        <p className="text-sm text-gray-500">Slug: {slug || "(empty)"}</p>

        <h1 className="text-2xl font-bold mb-4">Itinerary not found</h1>
        <Link className="underline" href="/itineraries">
          Back to itineraries
        </Link>
      </main>
    );
  }

  return (
    <main className="max-w-3xl mx-auto px-6 py-16">
      <p className="text-sm text-gray-500">Slug: {slug}</p>

      <Link className="underline text-sm" href="/itineraries">
        ← Back to itineraries
      </Link>

      <h1 className="text-3xl font-bold mt-4">{itinerary.title}</h1>
      <p className="text-gray-600 mt-2">{itinerary.days} days</p>

      <p className="text-gray-700 mt-6">{itinerary.summary}</p>

      <h2 className="text-xl font-semibold mt-10 mb-3">Highlights</h2>
      <ul className="list-disc pl-6 space-y-2 text-gray-700">
        {itinerary.highlights.map((h) => (
          <li key={h}>{h}</li>
        ))}
      </ul>

      <div className="mt-10">
        <BookingWidget
  slug={itinerary.slug}
  title={itinerary.title}
  days={itinerary.days}/>
      </div>
    </main>
  );
}
