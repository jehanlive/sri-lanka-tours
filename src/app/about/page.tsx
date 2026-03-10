import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About Us",
};

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-white text-black">
      <main className="max-w-6xl mx-auto px-6 py-16">
        {/* Page title */}
        <h1 className="text-4xl font-semibold tracking-tight">About Us</h1>

        {/* Intro */}
        <section className="mt-10 max-w-3xl">
          <h2 className="text-xl font-semibold">What we do best</h2>
          <p className="mt-4 text-black/70 leading-relaxed">
            At Ori Lanka Travels & Tours, we believe great holidays start with great planning. With roots
            in Sri Lanka and decades of experience behind us, we combine local
            knowledge, global connections and personal service to create holidays
            that feel effortless from start to finish.
          </p>
        </section>

        <Divider />

        {/* Our story */}
        <section className="max-w-3xl">
          <h2 className="text-xl font-semibold">Our story</h2>
          <p className="mt-4 text-black/70 leading-relaxed">
            We began our journey in 1989, in the heart of Colombo’s commercial
            district, as a specialist corporate travel company. Over the years,
            as our expertise grew and our clients’ needs evolved, so did we.
          </p>
          <p className="mt-4 text-black/70 leading-relaxed">
            Today, Ori Lanka Travels & Tours is a full-service travel company, offering carefully
            planned leisure holidays alongside our long-standing corporate travel
            services. While much has changed since we started, our commitment to
            service, reliability and attention to detail has remained the same.
          </p>
        </section>

        <Divider />

        {/* Personal service */}
        <section className="max-w-3xl">
          <h2 className="text-xl font-semibold">
            Personal service, every step of the way
          </h2>
          <p className="mt-4 text-black/70 leading-relaxed">
            We know that no two travellers are the same. That’s why we take a
            personal, consultative approach to every booking.
          </p>
          <p className="mt-4 text-black/70 leading-relaxed">
            Whether you’re planning a family holiday, a honeymoon, a
            multi-centre adventure or a bespoke itinerary, our experienced travel
            consultants are on hand to guide you, from the first enquiry through
            to your return home. And if you need support while you’re travelling,
            you’ll always have a real person to speak to.
          </p>
        </section>

        <Divider />

        {/* Carefully planned holidays */}
        <section className="max-w-3xl">
          <h2 className="text-xl font-semibold">Carefully planned holidays</h2>
          <p className="mt-4 text-black/70 leading-relaxed">
            From beach escapes and cultural journeys to tailor-made tours and
            multi-destination itineraries, we design holidays that balance
            comfort, value and experience.
          </p>
          <p className="mt-4 text-black/70 leading-relaxed">
            Our team works closely with trusted airlines, hotels and local
            partners to ensure every detail is thoughtfully arranged, so you
            can travel with confidence and enjoy the journey as much as the
            destination.
          </p>
        </section>

        <Divider />

        {/* Specialists */}
        <section className="max-w-3xl">
          <h2 className="text-xl font-semibold">
            Specialists in Sri Lanka &amp; Asia
          </h2>
          <p className="mt-4 text-black/70 leading-relaxed">
            With our heritage firmly rooted in Sri Lanka, we bring first-hand
            knowledge and local insight to every itinerary we create. Alongside
            Sri Lanka, we also design holidays across Asia and beyond, offering
            authentic experiences, flexible routing and carefully selected
            accommodation.
          </p>
        </section>

        <Divider />

        {/* Accredited */}
        <section className="max-w-3xl">
          <h2 className="text-xl font-semibold">Accredited and trusted</h2>
          <p className="mt-4 text-black/70 leading-relaxed">
            Your peace of mind matters to us.
          </p>

          <ul className="mt-4 space-y-2 text-black/70">
            <li>• Registered with the International Air Transport Association (IATA)</li>
            <li>• Licensed by the Sri Lanka Tourism Development Authority (SLTDA)</li>
          </ul>

          <p className="mt-4 text-black/70 leading-relaxed">
            These accreditations reflect our professionalism, compliance and
            commitment to operating to recognised international standards.
          </p>
        </section>

        <Divider />

        {/* Experience */}
        <section className="max-w-3xl">
          <h2 className="text-xl font-semibold">Travel built on experience</h2>
          <p className="mt-4 text-black/70 leading-relaxed">
            With over three decades of experience, Ori Lanka Travels & Tours Travel has grown through
            long-standing relationships, repeat customers and word-of-mouth
            recommendations. We’re proud to be a company that values trust,
            transparency and service — and we look forward to helping you plan
            your next journey.
          </p>

          <p className="mt-8 text-sm text-black/50">
            Est. 1989 · Sri Lanka
          </p>
        </section>
      </main>
    </div>
  );
}

/* Simple divider component */
function Divider() {
  return <div className="my-14 h-px w-full bg-black/10" />;
}
