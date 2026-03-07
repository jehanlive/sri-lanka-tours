import Link from "next/link";

type Section = {
  id: string;
  title: string;
  body: React.ReactNode;
};

const SECTIONS: Section[] = [
  {
    id: "trip-planning-essentials",
    title: "Trip planning essentials",
    body: (
      <>
        <p className="text-black/80 leading-relaxed">
          Before you book, check entry requirements (visa/ETA), passport validity,
          and any travel advisories. Requirements can change and depend on nationality.{" "}
        </p>

        <ul className="mt-4 list-disc pl-5 space-y-2 text-black/80">
          <li>
            <b>Money:</b> Sri Lankan rupee (LKR). Cash is essential for small towns,
            buses, and many local eateries; ATMs are common in cities and tourist hubs.{" "}
          </li>
          <li>
            <b>Connectivity:</b> local SIMs are inexpensive and coverage is generally good,
            but remote rainforest/highlands can be patchy.{" "}
  
          </li>
          <li>
            <b>Health:</b> sun protection, insect repellent, personal meds; tap water isn’t
            typically drunk (use bottled/filtered).{" "}
            
          </li>
          <li>
            <b>Safety:</b> generally welcoming, but take common-sense precautions and use
            reputable operators.{" "}
            
          </li>
        </ul>
      </>
    ),
  },

  {
    id: "weather-seasons",
    title: "Weather, seasons, and when to go",
    body: (
      <>
        <p className="text-black/80 leading-relaxed">
          Sri Lanka’s tropical climate is shaped by monsoons and elevation, and it can be “in season”
          somewhere year-round.{" "}
          
        </p>

        <div className="mt-5 rounded-xl border border-black/10 p-5 bg-white">
          <div className="font-semibold">Quick rule of thumb</div>
          <ul className="mt-3 list-disc pl-5 space-y-2 text-black/80">
            <li>
              <b>South &amp; West beaches</b> (Galle/Mirissa/Hikkaduwa/Bentota): typically best
              from about Dec to Apr.{" "}
              
            </li>
            <li>
              <b>East coast</b> (Trincomalee/Pasikudah/Arugam Bay): typically best from about May to Sep.{" "}
               
            </li>
            <li>
              <b>Hill country</b> (Kandy/Nuwara Eliya/Ella): pleasant most of the year; nights can be cold Dec–Feb.{" "}
              
            </li>
            <li>
              <b>Safaris</b> (Yala/Udawalawe/Wilpattu): wildlife is year-round; drier months can concentrate animals.{" "}
               
            </li>
          </ul>
        </div>
      </>
    ),
  },

  {
    id: "getting-around",
    title: "Getting around Sri Lanka",
    body: (
      <>
        <p className="text-black/80 leading-relaxed">
          Trains are scenic and affordable, buses are comprehensive, and private drivers are convenient for
          tight schedules. Expect slower speeds than the map suggests—especially in hill country—so build buffer time.{" "}
       
        </p>

        <ul className="mt-4 list-disc pl-5 space-y-2 text-black/80">
          <li>
            <b>Trains:</b> great for scenery (Colombo–Kandy–Ella corridor; coastal line). Reserve popular services.{" "}

          </li>
          <li>
            <b>Buses:</b> reach almost everywhere; cheap but can be crowded. Private “express” buses run major routes.{" "}
          
          </li>
          <li>
            <b>Tuk-tuks:</b> perfect for short hops/day touring; agree a price or use a meter/app where available.{" "}
            
          </li>
        </ul>
      </>
    ),
  },

  {
    id: "food-drink",
    title: "Food and drink",
    body: (
      <>
        <p className="text-black/80 leading-relaxed">
          Sri Lankan food is built around rice, coconut, spices, and seafood, with bold flavors. Vegetarian/vegan options
          are easy thanks to Buddhist and Hindu culinary traditions.{" "}
         
        </p>

        <div className="mt-5 grid md:grid-cols-2 gap-4">
          <div className="rounded-xl border border-black/10 p-5">
            <div className="font-semibold">Must-try dishes</div>
            <ul className="mt-3 list-disc pl-5 space-y-2 text-black/80">
              <li>Rice &amp; curry  </li>
              <li>Hoppers (appa)  </li>
              <li>String hoppers (idi appa)  </li>
              <li>Kottu roti  </li>
              <li>Pol sambol  </li>
              <li>“Short eats” snacks </li>
            </ul>
          </div>

          <div className="rounded-xl border border-black/10 p-5">
            <div className="font-semibold">Food safety tips</div>
            <ul className="mt-3 list-disc pl-5 space-y-2 text-black/80">
              <li>Choose busy stalls; eat hot, freshly cooked food. </li>
              <li>Carry ORS for long travel days. </li>
              <li>If you have allergies, write them down and show them. </li>
            </ul>
          </div>
        </div>
      </>
    ),
  },

  {
    id: "budget",
    title: "Budget and costs",
    body: (
      <>
        <p className="text-black/80 leading-relaxed">
          Sri Lanka can be excellent value, but popular areas and peak seasons can raise prices. Use these as planning anchors.{" "}
          
        </p>

        <div className="mt-5 rounded-xl border border-black/10 overflow-hidden">
          <div className="grid grid-cols-3 bg-black/5 text-sm font-semibold">
            <div className="p-3">Budget</div>
            <div className="p-3">Mid-range</div>
            <div className="p-3">Comfort/Luxury</div>
          </div>
          <div className="grid grid-cols-3 text-sm text-black/80">
            <div className="p-3 border-t border-black/10">Guesthouse / homestay</div>
            <div className="p-3 border-t border-black/10">Boutique hotel</div>
            <div className="p-3 border-t border-black/10">Resort / high-end</div>
          </div>
        </div>

        <div className="mt-4 rounded-xl border border-black/10 p-5">
          <div className="font-semibold">Money-saving ideas</div>
          <ul className="mt-3 list-disc pl-5 space-y-2 text-black/80">
            <li>Use trains for long scenic routes; save private cars for short hops.  </li>
            <li>Eat where locals eat: small rice-and-curry shops are filling and inexpensive. </li>
            <li>Travel in shoulder season for better deals and fewer crowds. </li>
            <li>Book safaris/whale trips with reputable operators.  </li>
          </ul>
        </div>
      </>
    ),
  },

  {
    id: "district-snapshots",
    title: "District snapshots",
    body: (
      <div className="grid md:grid-cols-3 gap-4">
        <div className="rounded-xl border border-black/10 p-5">
          <div className="font-semibold">Galle</div>
          <p className="mt-2 text-sm text-black/70">
            Galle Fort is compact, walkable, with cafes/museums and rampart views; easy day trips to beaches and lake areas.{" "}
             
          </p>
        </div>

        <div className="rounded-xl border border-black/10 p-5">
          <div className="font-semibold">Kandy</div>
          <p className="mt-2 text-sm text-black/70">
            Central hills pilgrimage city and key transport hub between Cultural Triangle and tea country.{" "}
             
          </p>
        </div>

        <div className="rounded-xl border border-black/10 p-5">
          <div className="font-semibold">Ella / Badulla area</div>
          <p className="mt-2 text-sm text-black/70">
            Scenic base for hikes, bridges, tea plantations, with many cafes and guesthouses.{" "}
            
          </p>
        </div>
      </div>
    ),
  },

  {
    id: "emergency-numbers",
    title: "Emergency and helpful numbers",
    body: (
      <div className="rounded-xl border border-black/10 p-5">
        <p className="text-black/80 leading-relaxed">
          Numbers can vary; confirm locally and via your accommodation. Keep your embassy/consulate contact saved.{" "}
          
        </p>

        <ul className="mt-4 list-disc pl-5 space-y-2 text-black/80">
          <li>Police / Emergency: <b>119</b>  </li>
          <li>Ambulance / Fire: <b>110</b> </li>
        </ul>
      </div>
    ),
  },
];

export default function GuidePage() {
  return (
    <div className="bg-white text-black">
      <div className="max-w-6xl mx-auto px-6 py-10">
        <div className="flex items-end justify-between gap-6">
          <div>
            <h1 className="text-4xl md:text-5xl font-semibold tracking-tight">Sri Lanka Travel Guide</h1>
            <p className="mt-3 text-black/70 max-w-2xl">
              
            </p>
          </div>

          <Link
            href="/itineraries"
            className="hidden md:inline-flex rounded-full border border-black/15 px-5 py-2 text-sm font-semibold hover:bg-black/5"
          >
            View itineraries
          </Link>
        </div>

        <div className="mt-10 grid lg:grid-cols-[260px_1fr] gap-10">
          {/* Left “Wikipedia” sidebar */}
          <aside className="hidden lg:block">
            <div className="sticky top-24">
              <div className="text-sm font-semibold text-black/70">Contents</div>
              <nav className="mt-3 space-y-1">
                {SECTIONS.map((s) => (
                  <a
                    key={s.id}
                    href={`#${s.id}`}
                    className="block rounded-md px-3 py-2 text-sm hover:bg-black/5 text-black/80"
                  >
                    {s.title}
                  </a>
                ))}
              </nav>
            </div>
          </aside>

          {/* Main content */}
          <article className="min-w-0">
            {/* Mobile contents */}
            <div className="lg:hidden rounded-xl border border-black/10 p-4">
              <div className="text-sm font-semibold text-black/70">Contents</div>
              <div className="mt-3 flex flex-wrap gap-2">
                {SECTIONS.map((s) => (
                  <a
                    key={s.id}
                    href={`#${s.id}`}
                    className="rounded-full border border-black/15 px-3 py-1.5 text-sm hover:bg-black/5"
                  >
                    {s.title}
                  </a>
                ))}
              </div>
            </div>

            <div className="mt-8 space-y-12">
              {SECTIONS.map((s) => (
                <section key={s.id} id={s.id} className="scroll-mt-28">
                  <h2 className="text-2xl md:text-3xl font-semibold tracking-tight">{s.title}</h2>
                  <div className="mt-4 h-px w-full bg-black/10" />
                  <div className="mt-6">{s.body}</div>
                </section>
              ))}
            </div>

            <div className="mt-12 text-sm text-black/60">
              
            </div>
          </article>
        </div>
      </div>
    </div>
  );
}