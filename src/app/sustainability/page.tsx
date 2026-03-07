import Link from "next/link";

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="text-2xl md:text-3xl font-semibold tracking-tight">
      {children}
    </h2>
  );
}

function Divider() {
  return <div className="my-8 h-px w-full bg-black/10" />;
}

export default function SustainabilityPage() {
  return (
    <div className="bg-white text-black">
      <main className="max-w-6xl mx-auto px-6 py-14 md:py-16">
        {/* Page header */}
        <div className="max-w-3xl">
          <h1 className="text-4xl md:text-5xl font-semibold tracking-tight">
            Our Commitment to Sustainability
          </h1>
          <p className="mt-4 text-black/70 text-base md:text-lg leading-relaxed">
            Responsible travel, thoughtfully planned
          </p>
        </div>

        {/* Body */}
        <div className="mt-10 grid lg:grid-cols-[1fr_320px] gap-10 items-start">
          {/* Main content */}
          <article className="prose prose-neutral max-w-none">
            <p className="text-black/80 leading-relaxed">
              At OT, we believe that travel should be a positive force, for our customers, for
              the destinations we serve, and for the communities and environments that make travel
              possible. As a company founded in Sri Lanka and working closely with destinations
              across Asia and beyond, sustainability is not a trend for us; it is a responsibility.
            </p>

            <p className="text-black/80 leading-relaxed">
              Our goal is to create meaningful travel experiences while actively reducing negative
              impacts and supporting long-term benefits for people and places.
            </p>

            <Divider />

            <SectionTitle>Our approach to responsible travel</SectionTitle>
            <p className="mt-4 text-black/80 leading-relaxed">
              Sustainability in travel is complex, and we recognise that meaningful change happens
              through consistent, practical actions, not short-term claims. Our approach is built
              around three core principles:
            </p>
            <ul className="mt-4 list-disc pl-6 text-black/80 space-y-2">
              <li>Respect for destinations</li>
              <li>Support for local communities</li>
              <li>Responsible business practices</li>
            </ul>
            <p className="mt-4 text-black/80 leading-relaxed">
              By working closely with trusted partners and making conscious choices across our
              operations, we aim to continuously improve the way we plan and deliver travel.
            </p>

            <Divider />

            <SectionTitle>Supporting local communities</SectionTitle>
            <p className="mt-4 text-black/80 leading-relaxed">
              As a Sri Lanka–based company, we understand first-hand the importance of tourism to
              local livelihoods. Wherever possible, we prioritise partnerships that help local
              communities benefit directly from travel.
            </p>
            <p className="mt-4 text-black/80 leading-relaxed">This includes:</p>
            <ul className="mt-3 list-disc pl-6 text-black/80 space-y-2">
              <li>Working with locally owned hotels, guides and transport providers</li>
              <li>Encouraging experiences that showcase local culture, heritage and traditions</li>
              <li>Supporting businesses that employ and train local staff</li>
              <li>Promoting fair working conditions within our supply chain</li>
            </ul>
            <p className="mt-4 text-black/80 leading-relaxed">
              By keeping economic benefits within destinations, we help contribute to sustainable
              tourism growth that supports families, skills development and long-term opportunity.
            </p>

            <Divider />

            <SectionTitle>Protecting the environment</SectionTitle>
            <p className="mt-4 text-black/80 leading-relaxed">
              Many of the destinations we specialise in, from beaches and rainforests to cultural
              and wildlife-rich regions, are especially vulnerable to environmental pressures.
            </p>
            <p className="mt-4 text-black/80 leading-relaxed">We are committed to:</p>
            <ul className="mt-3 list-disc pl-6 text-black/80 space-y-2">
              <li>Encouraging responsible use of natural resources</li>
              <li>
                Promoting accommodation partners that take steps to reduce waste, energy and water
                consumption
              </li>
              <li>Supporting experiences that respect wildlife and natural habitats</li>
              <li>Discouraging activities that harm ecosystems or exploit animals</li>
            </ul>
            <p className="mt-4 text-black/80 leading-relaxed">
              While travel inevitably has an environmental footprint, we believe informed choices
              and responsible planning can make a meaningful difference.
            </p>

            <Divider />

            <SectionTitle>Thoughtful itinerary design</SectionTitle>
            <p className="mt-4 text-black/80 leading-relaxed">
              Sustainability begins at the planning stage. Our travel consultants are trained to
              design itineraries that balance enjoyment with responsibility.
            </p>
            <p className="mt-4 text-black/80 leading-relaxed">This includes:</p>
            <ul className="mt-3 list-disc pl-6 text-black/80 space-y-2">
              <li>Reducing unnecessary internal flights where suitable alternatives exist</li>
              <li>Encouraging longer stays in fewer locations, where possible</li>
              <li>Suggesting experiences that avoid overcrowding and overtourism</li>
              <li>Promoting travel outside peak periods when appropriate</li>
            </ul>
            <p className="mt-4 text-black/80 leading-relaxed">
              These choices not only help reduce pressure on destinations, but often result in more
              relaxed, rewarding holidays for our clients.
            </p>

            <Divider />

            <SectionTitle>Working with responsible partners</SectionTitle>
            <p className="mt-4 text-black/80 leading-relaxed">
              We recognise that sustainability is a shared responsibility. That’s why we work
              closely with airlines, hotels and ground operators who demonstrate a commitment to
              responsible practices.
            </p>
            <p className="mt-4 text-black/80 leading-relaxed">
              While we do not claim to control every aspect of the supply chain, we actively:
            </p>
            <ul className="mt-3 list-disc pl-6 text-black/80 space-y-2">
              <li>Prefer partners who follow recognised environmental and social standards</li>
              <li>Engage with suppliers who are open about their sustainability efforts</li>
              <li>Review partnerships regularly to ensure alignment with our values</li>
            </ul>
            <p className="mt-4 text-black/80 leading-relaxed">
              As the travel industry evolves, we aim to strengthen these partnerships and raise
              standards over time.
            </p>

            <Divider />

            <SectionTitle>Reducing our operational impact</SectionTitle>
            <p className="mt-4 text-black/80 leading-relaxed">
              Within our own business operations, we are committed to reducing waste and improving
              efficiency.
            </p>
            <p className="mt-4 text-black/80 leading-relaxed">Our ongoing efforts include:</p>
            <ul className="mt-3 list-disc pl-6 text-black/80 space-y-2">
              <li>Minimising paper use through digital documentation and communication</li>
              <li>Encouraging energy-efficient office practices</li>
              <li>Reducing unnecessary printing and single-use materials</li>
              <li>Supporting remote communication where appropriate to limit travel emissions</li>
            </ul>
            <p className="mt-4 text-black/80 leading-relaxed">
              These measures may seem small individually, but together they form part of a broader
              commitment to responsible business conduct.
            </p>

            <Divider />

            <SectionTitle>Ethical wildlife experiences</SectionTitle>
            <p className="mt-4 text-black/80 leading-relaxed">
              Wildlife encounters can be powerful and educational when handled responsibly. We are
              committed to promoting experiences that respect animal welfare and natural behaviour.
            </p>

            <p className="mt-4 text-black/80 leading-relaxed">We avoid supporting:</p>
            <ul className="mt-3 list-disc pl-6 text-black/80 space-y-2">
              <li>Attractions that exploit animals for entertainment</li>
              <li>Experiences that involve unethical handling or confinement of wildlife</li>
            </ul>

            <p className="mt-4 text-black/80 leading-relaxed">Instead, we encourage:</p>
            <ul className="mt-3 list-disc pl-6 text-black/80 space-y-2">
              <li>Observation-based wildlife experiences</li>
              <li>Responsible safaris and nature-based tours</li>
              <li>Operators who follow ethical wildlife guidelines</li>
            </ul>

            <Divider />

            <SectionTitle>Educating and empowering travellers</SectionTitle>
            <p className="mt-4 text-black/80 leading-relaxed">
              We believe travellers play an important role in sustainable tourism. Through guidance,
              communication and itinerary planning, we aim to help our clients make informed
              choices.
            </p>
            <p className="mt-4 text-black/80 leading-relaxed">This includes:</p>
            <ul className="mt-3 list-disc pl-6 text-black/80 space-y-2">
              <li>Offering advice on responsible behaviour while travelling</li>
              <li>Encouraging respect for local customs, cultures and environments</li>
              <li>Promoting awareness of conservation and community initiatives</li>
            </ul>
            <p className="mt-4 text-black/80 leading-relaxed">
              Sustainable travel works best when everyone is involved.
            </p>

            <Divider />

            <SectionTitle>A journey, not a destination</SectionTitle>
            <p className="mt-4 text-black/80 leading-relaxed">
              We are honest about the fact that sustainability is an ongoing journey. The travel
              industry continues to change, and so do the challenges and opportunities it presents.
            </p>
            <p className="mt-4 text-black/80 leading-relaxed">Our commitment is to:</p>
            <ul className="mt-3 list-disc pl-6 text-black/80 space-y-2">
              <li>Continuously review and improve our practices</li>
              <li>Learn from partners, destinations and industry developments</li>
              <li>Remain transparent about our progress and limitations</li>
              <li>Grow responsibly as a business</li>
            </ul>

            <Divider />

            <SectionTitle>Looking ahead</SectionTitle>
            <p className="mt-4 text-black/80 leading-relaxed">
              As OT continues to evolve, sustainability will remain a core consideration in
              how we operate and how we serve our customers. We believe responsible travel protects
              the places we love, supports the people who live there, and ensures that future
              generations can enjoy meaningful travel experiences.
            </p>
            <p className="mt-4 text-black/80 leading-relaxed">
              By choosing OT, you are supporting a company that values careful planning,
              local expertise and responsible tourism.
            </p>
          </article>

          {/* Right sidebar (nice “summary” box like Wikipedia) */}
          <aside className="lg:sticky lg:top-24">
            <div className="rounded-2xl border border-black/10 bg-white p-6">
              <div className="text-sm font-semibold text-black/70">Sustainability at a glance</div>
              <div className="mt-4 space-y-3 text-sm text-black/80">
                <div className="flex gap-3">
                  <span className="mt-0.5">✓</span>
                  <span>Locally rooted partnerships</span>
                </div>
                <div className="flex gap-3">
                  <span className="mt-0.5">✓</span>
                  <span>Ethical wildlife-first experiences</span>
                </div>
                <div className="flex gap-3">
                  <span className="mt-0.5">✓</span>
                  <span>Thoughtful itinerary planning</span>
                </div>
                <div className="flex gap-3">
                  <span className="mt-0.5">✓</span>
                  <span>Operational waste reduction</span>
                </div>
              </div>

              <div className="mt-6 flex flex-col gap-3">
                <Link
                  href="/itineraries"
                  className="inline-flex items-center justify-center rounded-full bg-black text-white px-5 py-2 text-sm font-semibold hover:bg-black/90"
                >
                  View Packages
                </Link>
                <Link
                  href="/contact"
                  className="inline-flex items-center justify-center rounded-full border border-black/15 px-5 py-2 text-sm font-semibold hover:bg-black/5"
                >
                  Contact Us
                </Link>
              </div>
            </div>
          </aside>
        </div>
      </main>
    </div>
  );
}