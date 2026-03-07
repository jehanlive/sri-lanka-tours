import Image from "next/image";
import Link from "next/link";
import Header from "@/components/Header";
import SalesBanner from "@/components/SalesBanner";
import { itineraries } from "@/lib/itineraries";
import { getFromPricePerPersonUsdCents } from "@/lib/pricing";
import BudgetDeals from "@/components/BudgetDeals";


const CATEGORIES = [
"Hot Deals",
  "Adventure",
"Ayurveda",
"Birding",
"Buddhism",
"Culinary",
"Culture",
"Honeymoon",
"Luxury",
"Ramayana",
"Value",
"Wildlife"
];

function SectionTitle({ title }: { title: string }) {
  return (
    <div className="max-w-6xl mx-auto px-6">
      <h2 className="text-2xl md:text-3xl font-semibold tracking-tight">{title}</h2>
      <div className="mt-4 h-px w-full bg-black/10" />
    </div>
  );
}

function pick3Random<T>(arr: T[]) {
  const copy = [...arr];
  copy.sort(() => Math.random() - 0.5);
  return copy.slice(0, 3);
}


export default function HomePage() {

   const picks = pick3Random(itineraries).map((it) => ({
    slug: it.slug,
    title: it.title,
    days: it.days,
    image: it.image,
    fromUsdCents: getFromPricePerPersonUsdCents(it.slug) ?? undefined,
  }));


return (
  <div className="min-h-screen bg-white text-black">
    {/* Hero */}
    <section className="relative">
      <div className="relative h-[78vh] min-h-[620px] w-full">
        <Image
          src="/hero3.jpg"
          alt="Sri Lanka landscape"
          fill
          priority
          className="object-cover"
        />
        <div className="absolute inset-0 bg-black/45" />

        <div className="absolute inset-0">
          <div className="max-w-6xl mx-auto h-full px-6 flex items-center justify-center text-center">
            <div className="max-w-3xl">
              <h1 className="text-white text-4xl md:text-6xl font-semibold leading-tight">
                Trusted Sri Lankan
                <br />
                Travel Partner
              </h1>

              <p className="mt-5 text-white/85 text-base md:text-lg">
                Travel with confidence.
                <br />
                Sustainable, Local and Trustworthy
              </p>

              <div className="mt-8 flex justify-center">
                <Link
                  href="/itineraries"
                  className="inline-flex items-center justify-center rounded-full bg-black text-white px-8 py-3 text-sm md:text-base font-semibold hover:bg-black/90"
                >
                  Book Now
                </Link>
              </div>
            </div>
          </div>
        </div>
        

        {/* 3 tiles row */}
        <div className="absolute bottom-0 left-0 right-0">
          <div className="max-w-6xl mx-auto px-6 pb-10">
            <div className="grid md:grid-cols-3 gap-4">
              {[
                ["Tailored Tour Packages", "Custom itineraries designed for your needs."],
                ["Local Insights", "Expert local guidance for immersive experiences."],
                ["Seamless Experience", "Smooth planning, bookings, and support."],
              ].map(([title, desc]) => (
                <div
                  key={title}
                  className="rounded-xl bg-black/35 backdrop-blur border border-white/15 p-6 text-center"
                >
                  <div className="text-white font-semibold">{title}</div>
                  <div className="mt-2 text-white/80 text-sm">{desc}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>

    {/* Limited time sales */}
    <SalesBanner picks={picks}/>

{/* BUDGET DEALS */}
<section className="py-1">
  <div className="max-w-6xl mx-auto px-6">

    <h2 className="text-2xl md:text-3xl font-semibold mb-8">
      Holiday deals on a budget
    </h2>

    <BudgetDeals />

    {/* HOLIDAY TYPES */}
    <h2 className="text-2xl md:text-3xl font-semibold mb-8">
      Holiday types
    </h2>

    <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
      {[
        { name: "Adventure", image: "/adventure.jpg" },
        { name: "Ayurveda", image: "/ayurveda.jpg" },
        { name: "Beach", image: "/beach.jpg" },
        { name: "Birding", image: "/bird.jpg" },
        { name: "Culinary", image: "/culinary.jpg" },
        { name: "Culture", image: "/culture.jpg" },
        { name: "Honeymoon", image: "/honeymoon.jpg" },
        { name: "Ramayana", image: "/ramayana.jpg" },
        { name: "Wildlife", image: "/wildlife.jpg" },
      ].map((category) => (
        <Link
          key={category.name}
          href={`/itineraries?category=${encodeURIComponent(
            category.name.toLowerCase()
          )}`}
          className="
            group relative h-44 rounded-2xl overflow-hidden
            bg-neutral-900
            flex items-center justify-center
            transition
          "
        >
          <Image
            src={category.image}
            alt={`${category.name} in Sri Lanka`}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
            sizes="(min-width: 768px) 33vw, 50vw"
          />
          <div className="absolute inset-0 bg-black/40" />

          <div className="relative z-10 text-white text-lg font-semibold tracking-wide">
            {category.name}
          </div>
        </Link>
      ))}
    </div>

  </div>
</section>

{/* HOW BOOKING WORKS */}
<section className="py-1 md:py-20">
  <SectionTitle title="HOW BOOKING WORKS" />

  <div className="max-w-6xl mx-auto px-6 mt-8">
    <div className="rounded-2xl border border-black/10 bg-white p-6 md:p-8">
      {/* Optional “map” style banner (placeholder) */}
      <div className="mb-8 rounded-2xl border border-black/10 bg-gradient-to-r from-emerald-50 via-sky-50 to-amber-50 p-6">
        <div className="text-sm font-semibold text-black/70 tracking-wide">
          Simple 4-Step Booking Process
        </div>
        <div className="mt-2 text-lg font-semibold">
          Plan → Deposit → Confirm → Travel
        </div>
        <div className="mt-2 text-sm text-black/60">
          (Quick, Safe, and Secure Booking)
        </div>
      </div>

      {/* Steps */}
      <div className="grid md:grid-cols-4 gap-6">
        <div className="rounded-xl border border-black/10 p-5 bg-white hover:bg-black/[0.03] transition">
          <div className="text-lg font-semibold">1) Choose your itinerary</div>
          <p className="mt-2 text-sm text-black/60">
            Select a package or request a tailored itinerary.
          </p>
        </div>

        <div className="rounded-xl border border-black/10 p-5 bg-white hover:bg-black/[0.03] transition">
          <div className="text-lg font-semibold">2) Pay 10% refundable deposit</div>
          <p className="mt-2 text-sm text-black/60">
            Secure your booking with a deposit via card.
          </p>
        </div>

        <div className="rounded-xl border border-black/10 p-5 bg-white hover:bg-black/[0.03] transition">
          <div className="text-lg font-semibold">3) Pay full amount</div>
          <p className="mt-2 text-sm text-black/60">
            1 month before travel date.
          </p>
        </div>

        <div className="rounded-xl border border-black/10 p-5 bg-white hover:bg-black/[0.03] transition">
          <div className="text-lg font-semibold">4) Travel and Enjoy</div>
          <p className="mt-2 text-sm text-black/60">
            We handle your travel while you enjoy Sri Lanka.
          </p>
        </div>
      </div>
    </div>
  </div>
</section>

{/* WHY TRAVEL WITH US */}
<section className="py-1 md:py-2">
        <SectionTitle title="WHY TRAVEL WITH US" />
        <div className="max-w-6xl mx-auto px-6 mt-8">
          <div className="rounded-2xl border border-black/10 bg-white p-6 md:p-8">
           <ul className="grid md:grid-cols-2 gap-4 text-base">
  <li className="flex gap-3">
    <span className="mt-1">✓</span>
    <span>Licensed by Sri Lanka Tourism Development Authority (SLTDA)</span>
  </li>

  <li className="flex gap-3">
    <span className="mt-1">✓</span>
    <span>IATA-accredited travel company</span>
  </li>

  <li className="flex gap-3">
    <span className="mt-1">✓</span>
    <span>Sri Lanka specialists</span>
  </li>

  <li className="flex gap-3">
    <span className="mt-1">✓</span>
    <span>Handpicked hotels</span>
  </li>

  <li className="flex gap-3">
    <span className="mt-1">✓</span>
    <span>Experienced local guides</span>
  </li>

  <li className="flex gap-3">
    <span className="mt-1">✓</span>
    <span>24/7 local support</span>
  </li>

  <li className="flex gap-3">
    <span className="mt-1">✓</span>
    <span>Established in 1989</span>
  </li>

  <li className="flex gap-3">
    <span className="mt-1">✓</span>
    <span>Sustainable operation</span>
  </li>
</ul>
          </div>
        </div>
      </section>

      {/* TRUST & SOCIAL PROOF */}
      <section className="pb-20 py-7">
<SectionTitle title="WHAT OUR CUSTOMERS SAY" />
        <div className="rounded-2xl border border-black/10 bg-white p-6 md:p-8">
  <div className="grid md:grid-cols-2 gap-6">
    
    {/* Review 1 */}
    <div className="rounded-xl border border-black/10 p-5">
      <div className="text-sm text-black/60">★★★★★ TripAdvisor</div>
      <p className="mt-3 text-base leading-relaxed">
        “Absolutely wonderful care and time taken into planning the most memorable trip we could have in Sri Lanka. 
        From route and destination suggestions to choosing the most unique and amazing hotels for us to stay in. 
        Everything was organized and done in such a seamless way we didn’t have to worry about anything. 
        Highly recommend the professional and knowledgeable travel planning service Oriental Travels provides.”
      </p>
      <div className="mt-4 text-sm font-semibold">
        Christina from Canada
      </div>
    </div>

    {/* Review 2 */}
    <div className="rounded-xl border border-black/10 p-5">
      <div className="text-sm text-black/60">★★★★★ TripAdvisor</div>
      <p className="mt-3 text-base leading-relaxed">
        “From the first enquiry to the last day of our holiday, OT were
        professional, responsive and genuinely caring. Sri Lanka exceeded all
        our expectations.”
      </p>
      <div className="mt-4 text-sm font-semibold">
        Ian from the UK
      </div>
    </div>

  </div>
</div>
      </section>

      </div>
      );      
          
    }
