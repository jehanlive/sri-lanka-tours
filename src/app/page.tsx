export default function HomePage() {
  return (
    <main className="min-h-screen bg-white">
      <section className="max-w-6xl mx-auto px-6 py-20">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Oriental Travels and Tours Sri Lanka
        </h1>

        <p className="text-lg text-gray-600 max-w-2xl mb-10">
          Curated Sri Lanka itineraries from 3 to 25 days.  
          Choose your travel style, group size, and start date.
        </p>

        <div className="flex gap-4">
          <a
            href="/itineraries"
            className="bg-black text-white px-6 py-3 rounded-lg font-medium hover:bg-gray-800"
          >
            Browse Tours
          </a>

          <a
            href="/guide"
            className="border border-gray-300 px-6 py-3 rounded-lg font-medium hover:bg-gray-100"
          >
            Travel Guide
          </a>
        </div>
      </section>
    </main>
  );
}
