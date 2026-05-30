import Head from "next/head";
import Link from "next/link";

export default function MexicoPetTravel() {
  return (
    <>
      <Head>
        <title>Flying with a Pet to/from Mexico (2026): Complete Guide | Pets in Cabin</title>
        <meta
          name="description"
          content="Bringing a dog or cat to Mexico is one of the easiest international pet moves there is. No health certificate from the US or Canada, no quarantine, no titer test — just rabies vaccination, parasite treatment, and a SENASICA inspection on arrival. Plus the screwworm catch for dogs returning to the US."
        />
        <link rel="canonical" href="https://www.petsincabin.com/mexico-pet-travel" />
      </Head>

      <div
        className="min-h-screen"
        style={{ backgroundColor: "transparent", fontFamily: "'Inter', -apple-system, sans-serif" }}
      >
        <style>{`
          @import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,400;0,9..144,500;0,9..144,600;1,9..144,400;1,9..144,500&family=Inter:wght@400;500;600&display=swap');
          .font-serif { font-family: 'Fraunces', Georgia, serif; font-optical-sizing: auto; }
        `}</style>

        <nav
          className="border-b border-stone-300 px-6 md:pl-5 md:pr-10 py-4"
          style={{ backgroundColor: "rgba(250, 246, 237, 0.98)" }}
        >
          <div className="max-w-4xl mx-auto flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2.5 group">
              <img src="/logo.png" alt="Pets in Cabin" className="w-8 h-8 rounded-full object-cover" />
              <span className="font-serif font-semibold text-stone-800 group-hover:text-amber-700 transition-colors" style={{ letterSpacing: "-0.02em" }}>
                Pets in Cabin
              </span>
            </Link>
            <Link href="/" className="text-xs uppercase tracking-widest text-stone-500 hover:text-amber-700 transition-colors">
              ← Back to the guide
            </Link>
          </div>
        </nav>

        <main className="max-w-2xl mx-auto px-6 py-16 md:py-24">
          <div className="text-xs uppercase tracking-[0.25em] text-amber-700 mb-6">
            Country guide · Mexico
          </div>

          <h1 className="font-serif text-4xl md:text-5xl leading-[1.05] text-stone-900 mb-6">
            Flying with a pet <span className="italic text-stone-600">to and from Mexico</span>.
          </h1>

          <div className="bg-white border border-stone-200 rounded-sm p-5 mb-8">
            <div className="text-xs uppercase tracking-widest text-stone-500 mb-3">In this guide</div>
            <div className="flex flex-wrap gap-2 text-sm">
              <a href="#the-short-answer" className="text-stone-700 hover:text-amber-700 underline decoration-stone-300 hover:decoration-amber-600 underline-offset-4">The short answer</a>
              <a href="#paperwork" className="text-stone-700 hover:text-amber-700 underline decoration-stone-300 hover:decoration-amber-600 underline-offset-4">The paperwork</a>
              <a href="#airlines" className="text-stone-700 hover:text-amber-700 underline decoration-stone-300 hover:decoration-amber-600 underline-offset-4">Cabin airlines</a>
              <a href="#routes" className="text-stone-700 hover:text-amber-700 underline decoration-stone-300 hover:decoration-amber-600 underline-offset-4">Cabin routes</a>
              <a href="#arrival" className="text-stone-700 hover:text-amber-700 underline decoration-stone-300 hover:decoration-amber-600 underline-offset-4">Arrival &amp; SENASICA</a>
              <a href="#returning" className="text-stone-700 hover:text-amber-700 underline decoration-stone-300 hover:decoration-amber-600 underline-offset-4">The screwworm catch</a>
            </div>
          </div>

          <p className="font-serif text-lg md:text-xl text-stone-700 leading-relaxed mb-8">
            Mexico is, genuinely, one of the easiest international destinations for a pet. There is no quarantine, no rabies titer test, no import permit for a personal dog or cat — and for pets arriving from the US or Canada, no health certificate at all. The Mexican animal-health service inspects your pet at the airport on arrival, and if it looks healthy and your vaccination records are in order, you are through.
          </p>

          <p className="font-serif italic text-stone-600 leading-relaxed mb-12">
            Verified against SENASICA (Mexico's National Service for Agri-Food Health, Safety and Quality) and USDA APHIS guidance as of May 2026. Rules change — confirm directly before booking.
          </p>

          <div className="h-px bg-stone-300 mb-12" />

          {/* The short answer */}
          <section id="the-short-answer" className="mb-14 scroll-mt-24">
            <div className="text-xs uppercase tracking-[0.25em] text-amber-700 mb-3">01 · The short answer</div>
            <h2 className="font-serif text-2xl md:text-3xl text-stone-900 mb-3 leading-tight">
              Yes — and Mexico asks for less than almost anywhere
            </h2>
            <p className="font-serif italic text-stone-600 text-lg mb-6 leading-snug">
              For a personal pet from the US or Canada, there is barely any paperwork at all.
            </p>

            <p className="font-serif text-stone-700 leading-relaxed mb-4">
              Mexico lets dogs and cats fly in the cabin, and the import rules are the gentlest of any major destination. There is no quarantine, no rabies blood-titer test, and no import permit for a personal pet. Since December 2019, Mexico no longer even requires a health certificate for dogs and cats arriving from the US or Canada — your pet is simply inspected by a SENASICA officer at the airport.
            </p>

            <p className="font-serif text-stone-700 leading-relaxed">
              The core requirements are a current rabies vaccination, documented parasite treatment, and a clean carrier. Everything else is logistical: choosing your airline and entry airport. This guide walks through each piece — and the one real catch, which is bringing a dog back into the US afterwards.
            </p>
          </section>

          {/* Paperwork */}
          <section id="paperwork" className="mb-14 scroll-mt-24">
            <div className="text-xs uppercase tracking-[0.25em] text-amber-700 mb-3">02 · The paperwork</div>
            <h2 className="font-serif text-2xl md:text-3xl text-stone-900 mb-3 leading-tight">
              Rabies, parasite treatment, and a clean carrier — that's the core
            </h2>
            <p className="font-serif italic text-stone-600 text-lg mb-6 leading-snug">
              What you need depends on whether you're coming from the US/Canada or elsewhere.
            </p>

            <p className="font-serif text-stone-700 leading-relaxed mb-4">
              For a dog or cat entering Mexico, SENASICA's requirements are:
            </p>

            <ul className="font-serif text-stone-700 leading-relaxed mb-4 space-y-2 ml-5 list-disc">
              <li><strong>Rabies vaccination</strong> — current and valid. Pets under three months of age are exempt. Carry the vaccination record showing the date given and the validity period.</li>
              <li><strong>Parasite treatment</strong> — your pet must have been treated against internal and external parasites within the six months before arrival, and must be free of ectoparasites (fleas, ticks) at inspection.</li>
              <li><strong>A clean carrier</strong> — the crate or carrier must be clean and free of bedding. No hay, straw, cloth, newspaper or wood shavings; SENASICA may ask you to remove them.</li>
            </ul>

            <p className="font-serif text-stone-700 leading-relaxed mb-4">
              <strong>From the US or Canada:</strong> no health certificate is required. Mexico dropped that requirement in December 2019 — your pet is inspected physically at the airport instead. It is still worth carrying vaccination records and a recent vet summary, because airlines often check paperwork at boarding regardless.
            </p>

            <p className="font-serif text-stone-700 leading-relaxed mb-4">
              <strong>From any other country:</strong> a certificate of good health is required, issued by a licensed veterinarian no more than 15 days before arrival, and presented in original plus a copy. It must identify the pet, confirm it is clinically healthy, and state the rabies and parasite-treatment details.
            </p>

            <p className="font-serif text-stone-700 leading-relaxed">
              Mexico does not require a microchip — but if you are travelling with a dog, get one anyway, because bringing the dog back into the US later does require one. And note that most airlines have their own rules: many require a health certificate or a minimum pet age regardless of what Mexico asks, so always confirm with your carrier.
            </p>
          </section>

          {/* Airlines */}
          <section id="airlines" className="mb-14 scroll-mt-24">
            <div className="text-xs uppercase tracking-[0.25em] text-amber-700 mb-3">03 · Cabin airlines</div>
            <h2 className="font-serif text-2xl md:text-3xl text-stone-900 mb-3 leading-tight">
              US carriers and Aeroméxico cover most routes
            </h2>
            <p className="font-serif italic text-stone-600 text-lg mb-6 leading-snug">
              Mexico is well served for cabin pets from North America and beyond.
            </p>

            <div className="space-y-5">
              <div>
                <h3 className="font-serif text-lg text-stone-900 mb-1.5">US carriers</h3>
                <p className="font-serif text-stone-700 leading-relaxed">
                  American, Delta and United all carry cabin pets on US–Mexico routes, typically capping the pet plus carrier at around 20 lb combined. For the short hops from Texas, California or Florida into Mexico City, Cancún or Guadalajara, these are the workhorses — book whichever serves your city pair, and always confirm the pet space by phone, as per-flight quotas fill.
                </p>
              </div>
              <div>
                <h3 className="font-serif text-lg text-stone-900 mb-1.5">Aeroméxico</h3>
                <p className="font-serif text-stone-700 leading-relaxed">
                  Mexico's flag carrier takes cabin pets on most domestic and short-haul international routes — and crucially, only on flights under 6 hours. That covers all of Mexico, the US, Central America, and the Caribbean. For transatlantic routes (Paris, Madrid, Amsterdam, Rome), Aeroméxico's own example pages do mention these as pet-friendly segments, but the 6-hour rule from their published policy would technically exclude them. Confirm cabin pet acceptance in writing before booking transatlantic.
                </p>
              </div>
              <div>
                <h3 className="font-serif text-lg text-stone-900 mb-1.5">From Europe</h3>
                <p className="font-serif text-stone-700 leading-relaxed">
                  Air France flies cabin pets Paris to Mexico, and KLM connects via Amsterdam. From the UK, the route is the usual cabin-out-of-the-UK pattern — fly cabin to a European hub, then onward — since no airline flies cabin pets out of the UK direct to Mexico.
                </p>
              </div>
            </div>
          </section>

          {/* Routes */}
          <section id="routes" className="mb-14 scroll-mt-24">
            <div className="text-xs uppercase tracking-[0.25em] text-amber-700 mb-3">04 · Cabin routes</div>
            <h2 className="font-serif text-2xl md:text-3xl text-stone-900 mb-3 leading-tight">
              Mexico City, Cancún and Guadalajara are the main gateways
            </h2>
            <p className="font-serif italic text-stone-600 text-lg mb-6 leading-snug">
              Short cabin hops from the US dominate; Europe connects through the hubs.
            </p>

            <p className="font-serif text-stone-700 leading-relaxed mb-4">
              <strong>From the US:</strong> these are short, frequent cabin flights — Miami to Mexico City is about 3h 30m on American or Aeroméxico, and there are plentiful cabin routes from Texas, California and the southern US into all three Mexican gateways. Mexico is one of the easiest cabin destinations from the US precisely because the flights are short and the import rules light.
            </p>

            <p className="font-serif text-stone-700 leading-relaxed mb-4">
              <strong>From Europe:</strong> Air France flies cabin pets Paris to Mexico, and KLM connects via Amsterdam. Aeroméxico's own example page does mention Mexico City–Paris as a pet-friendly route, but their published 6-hour cabin pet rule technically excludes transatlantic — written confirmation before booking is essential. Expect a long-haul flight of 11 hours or more — worth planning a calm routing and confirming the cabin pet space well ahead.
            </p>

            <p className="font-serif text-stone-700 leading-relaxed">
              <strong>Within Mexico:</strong> Aeroméxico carries cabin pets on domestic routes between Mexico City, Cancún, Guadalajara and other cities. For your exact city pair, the journey planner below maps the specific cabin airline, any connection, and a checklist matched to the route.
            </p>
          </section>

          {/* Arrival */}
          <section id="arrival" className="mb-14 scroll-mt-24">
            <div className="text-xs uppercase tracking-[0.25em] text-amber-700 mb-3">05 · Arrival &amp; SENASICA</div>
            <h2 className="font-serif text-2xl md:text-3xl text-stone-900 mb-3 leading-tight">
              A physical inspection at the airport — usually quick
            </h2>
            <p className="font-serif italic text-stone-600 text-lg mb-6 leading-snug">
              SENASICA replaces the paperwork with a hands-on check on arrival.
            </p>

            <p className="font-serif text-stone-700 leading-relaxed mb-4">
              On arrival, you take your pet to the Mexican animal-health inspection office — the OISA — inside the airport, and present yourself to the SENASICA officer. They carry out a documentary and physical check: confirming the rabies vaccination, that the pet shows no signs of infectious disease, has no fresh or healing wounds, and is free of external parasites.
            </p>

            <p className="font-serif text-stone-700 leading-relaxed mb-4">
              If everything is in order, the inspection is brief. If ectoparasites are found, you will be asked to have a vet treat the pet before release; if your pet is under treatment for a skin condition, bring a vet's letter on official letterhead with the diagnosis, treatment and the vet's professional registration number. Missing or incomplete paperwork can mean a local vet is called in — adding an hour or two and a service fee.
            </p>

            <p className="font-serif text-stone-700 leading-relaxed">
              The standard process allows up to two pets per person. Bringing three or more is treated as a commercial shipment, which carries an additional SENASICA fee and extra rules — so if you are moving a larger group of animals, plan for that in advance.
            </p>
          </section>

          {/* Returning — the screwworm catch */}
          <section id="returning" className="mb-14 scroll-mt-24">
            <div className="text-xs uppercase tracking-[0.25em] text-amber-700 mb-3">06 · The screwworm catch</div>
            <h2 className="font-serif text-2xl md:text-3xl text-stone-900 mb-3 leading-tight">
              Bringing a dog back into the US is now the harder half
            </h2>
            <p className="font-serif italic text-stone-600 text-lg mb-6 leading-snug">
              Since late 2024, the return trip needs more paperwork than the outbound.
            </p>

            <p className="font-serif text-stone-700 leading-relaxed mb-4">
              This is the one genuine catch with Mexico, and it is easy to overlook because the outbound trip is so simple. As of 22 November 2024, Mexico is considered affected with New World screwworm. That means every dog entering — or re-entering — the US after time in Mexico must meet USDA APHIS requirements for screwworm-freedom certification.
            </p>

            <p className="font-serif text-stone-700 leading-relaxed mb-4">
              On top of that, a dog entering the US must satisfy the CDC's rules that have applied since August 2024: the dog must be microchipped, at least six months old, and the traveller must complete the CDC Dog Import Form before arrival. So a dog that left the US with almost no paperwork needs a screwworm-freedom certificate, a CDC Dog Import Form and a microchip to come home.
            </p>

            <p className="font-serif text-stone-700 leading-relaxed">
              Cats have it far easier on the return — no CDC import form, no screwworm certificate, no microchip requirement. If you are travelling with a dog, build the return paperwork into your plan from the start: arrange the screwworm-freedom certification with a vet in Mexico before you fly home, and check the current APHIS and CDC requirements close to your travel date.
            </p>
          </section>

          {/* CTA */}
          <div className="bg-stone-900 text-stone-100 rounded-sm p-8 text-center mt-12">
            <h2 className="font-serif text-2xl text-stone-50 mb-3">Map your Mexico journey</h2>
            <p className="font-serif text-stone-300 leading-relaxed mb-6">
              Use the journey planner to map your specific origin to Mexico — with the right cabin airline, connection, and a checklist matched to your route.
            </p>
            <Link
              href="/?go=planner"
              className="inline-block bg-amber-600 text-white px-6 py-3 text-sm uppercase tracking-widest font-medium hover:bg-amber-500 transition-colors"
            >
              Open the journey planner
            </Link>
          </div>

          <p className="font-sans text-xs text-stone-400 leading-relaxed mt-12 text-center">
            Verified against SENASICA (Servicio Nacional de Sanidad, Inocuidad y Calidad Agroalimentaria) and USDA APHIS published guidance as of May 2026. Import rules can change and depend on your pet's age, origin and species — and the screwworm and CDC rules for dogs returning to the US are evolving — always confirm the latest specifics with SENASICA and, for the return trip, USDA APHIS and the CDC before travel.
          </p>

          {/* Related guides — cross-links to other country/topic pages */}
          <div className="mt-16 pt-10 border-t border-stone-300">
            <div className="text-xs uppercase tracking-[0.25em] text-amber-700 mb-2">Related guides</div>
            <h2 className="font-serif text-2xl text-stone-900 mb-6">More from the pets-in-cabin guide</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <Link href="/canada-pet-travel" className="block bg-stone-50 border border-stone-200 hover:border-amber-300 transition-colors p-4 rounded-sm">
                <div className="font-serif text-base text-stone-900 mb-1">Canada guide →</div>
                <div className="text-xs text-stone-600 leading-relaxed">The other gentle North American destination — rabies certificate, no quarantine.</div>
              </Link>

              <Link href="/central-america-pet-travel" className="block bg-stone-50 border border-stone-200 hover:border-amber-300 transition-colors p-4 rounded-sm">
                <div className="font-serif text-base text-stone-900 mb-1">Central America guide →</div>
                <div className="text-xs text-stone-600 leading-relaxed">Continuing south from Mexico — Panama and the isthmus.</div>
              </Link>

              <Link href="/travel-day-with-a-pet" className="block bg-stone-50 border border-stone-200 hover:border-amber-300 transition-colors p-4 rounded-sm">
                <div className="font-serif text-base text-stone-900 mb-1">Travel day guide →</div>
                <div className="text-xs text-stone-600 leading-relaxed">What to expect at the airport, step by step.</div>
              </Link>
            </div>
            <p className="text-xs text-stone-500 italic mt-6">
              <Link href="/" className="text-amber-700 underline decoration-amber-300 underline-offset-4 hover:text-amber-800 transition-colors not-italic">Back to the main guide</Link> — for the airline grid, journey planner, and full destination list.
            </p>
          </div>

        </main>
      </div>
    </>
  );
}
