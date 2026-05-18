import Head from "next/head";
import Link from "next/link";

export default function CanadaPetTravel() {
  return (
    <>
      <Head>
        <title>Flying with a Pet to/from Canada (2026): Complete Guide | Pets in Cabin</title>
        <meta
          name="description"
          content="Bringing a dog or cat to Canada, or flying out with a pet? The full picture — Air Canada and Air Transat cabin policies, the simple rabies-certificate paperwork (no titer, no quarantine), CBSA border inspection, and the cabin routes through Toronto, Montreal and Vancouver."
        />
        <link rel="canonical" href="https://www.petsincabin.com/canada-pet-travel" />
      </Head>

      <div
        className="min-h-screen"
        style={{ backgroundColor: "#faf6ed", fontFamily: "'Inter', -apple-system, sans-serif" }}
      >
        <style>{`
          @import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,400;0,9..144,500;0,9..144,600;1,9..144,400;1,9..144,500&family=Inter:wght@400;500;600&display=swap');
          .font-serif { font-family: 'Fraunces', Georgia, serif; font-optical-sizing: auto; }
        `}</style>

        <nav
          className="border-b border-stone-300 px-6 md:px-12 py-4"
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
            Country guide · Canada
          </div>

          <h1 className="font-serif text-4xl md:text-5xl leading-[1.05] text-stone-900 mb-6">
            Flying with a pet <span className="italic text-stone-600">to and from Canada</span>.
          </h1>

          <p className="font-serif text-lg md:text-xl text-stone-700 leading-relaxed mb-8">
            After the strict-import countries, Canada is a relief. There is no rabies titer test, no quarantine, and no import permit for a personal pet dog or cat — the core requirement is a valid rabies vaccination certificate. The bigger decisions are practical ones: which airline takes your pet in the cabin, which Canadian airport to fly into, and getting the paperwork right for your specific origin country.
          </p>

          <p className="font-serif italic text-stone-600 leading-relaxed mb-12">
            Verified against the Canadian Food Inspection Agency (CFIA), the Canada Border Services Agency (CBSA), and current Air Canada and Air Transat policies as of May 2026. Rules change — confirm directly before booking.
          </p>

          <div className="bg-white border border-stone-200 rounded-sm p-5 mb-12">
            <div className="text-xs uppercase tracking-widest text-stone-500 mb-3">In this guide</div>
            <div className="flex flex-wrap gap-2 text-sm">
              <a href="#the-short-answer" className="text-stone-700 hover:text-amber-700 underline decoration-stone-300 hover:decoration-amber-600 underline-offset-4">The short answer</a>
              <a href="#paperwork" className="text-stone-700 hover:text-amber-700 underline decoration-stone-300 hover:decoration-amber-600 underline-offset-4">The paperwork</a>
              <a href="#airlines" className="text-stone-700 hover:text-amber-700 underline decoration-stone-300 hover:decoration-amber-600 underline-offset-4">Cabin airlines</a>
              <a href="#routes" className="text-stone-700 hover:text-amber-700 underline decoration-stone-300 hover:decoration-amber-600 underline-offset-4">Cabin routes</a>
              <a href="#commercial" className="text-stone-700 hover:text-amber-700 underline decoration-stone-300 hover:decoration-amber-600 underline-offset-4">Personal vs commercial</a>
              <a href="#arrival" className="text-stone-700 hover:text-amber-700 underline decoration-stone-300 hover:decoration-amber-600 underline-offset-4">Arrival &amp; CBSA</a>
            </div>
          </div>

          <div className="h-px bg-stone-300 mb-12" />

          {/* The short answer */}
          <section id="the-short-answer" className="mb-14 scroll-mt-24">
            <div className="text-xs uppercase tracking-[0.25em] text-amber-700 mb-3">01 · The short answer</div>
            <h2 className="font-serif text-2xl md:text-3xl text-stone-900 mb-3 leading-tight">
              Yes — cabin travel into Canada works, and the rules are gentle
            </h2>
            <p className="font-serif italic text-stone-600 text-lg mb-6 leading-snug">
              Canada is one of the easier countries to fly a cabin pet into.
            </p>

            <p className="font-serif text-stone-700 leading-relaxed mb-4">
              Unlike the UK (which bans cabin pets outright) or Japan (a 7-month process), Canada lets pets fly in the cabin and asks for very little. For a personal pet dog or cat there is no quarantine, no rabies blood-titer test, and no import permit. The single core document is a valid rabies vaccination certificate.
            </p>

            <p className="font-serif text-stone-700 leading-relaxed">
              The work is mostly logistical: picking an airline that takes cabin pets on your route, choosing your entry airport, and matching the health-certificate paperwork to the country you are leaving from. This guide covers each of those.
            </p>
          </section>

          {/* Paperwork */}
          <section id="paperwork" className="mb-14 scroll-mt-24">
            <div className="text-xs uppercase tracking-[0.25em] text-amber-700 mb-3">02 · The paperwork</div>
            <h2 className="font-serif text-2xl md:text-3xl text-stone-900 mb-3 leading-tight">
              A rabies certificate is the core — the rest depends on your origin
            </h2>
            <p className="font-serif italic text-stone-600 text-lg mb-6 leading-snug">
              No EU-style Animal Health Certificate exists for Canada. The documents vary by where you start.
            </p>

            <p className="font-serif text-stone-700 leading-relaxed mb-4">
              For a personal pet dog or cat aged 3 months or older, Canada requires a valid rabies vaccination certificate, written in English or French and signed by a licensed veterinarian. It should identify your pet precisely — breed, colour, weight, microchip number — and state how long the vaccine is valid.
            </p>

            <p className="font-serif text-stone-700 leading-relaxed mb-4">
              The other documents depend on your starting point:
            </p>

            <ul className="font-serif text-stone-700 leading-relaxed mb-4 space-y-2 ml-5 list-disc">
              <li><strong>From the US:</strong> a health certificate from a USDA-accredited vet. USDA APHIS endorsement is not required for Canada — which saves a step compared with EU travel.</li>
              <li><strong>From the UK:</strong> a vet's "fit to fly" health letter is what airlines want — there is no GB Animal Health Certificate for Canada, because the AHC is an EU-only document. Air Canada and Air Transat typically want this letter issued within 10 days of travel.</li>
              <li><strong>From elsewhere:</strong> your origin country's government health certificate, issued by an accredited vet, typically within 10 days of arrival.</li>
            </ul>

            <p className="font-serif text-stone-700 leading-relaxed mb-4">
              A microchip is strongly recommended and your airline will generally need one, even though Canada does not strictly require a microchip for entry of a personal pet.
            </p>

            <p className="font-serif text-stone-700 leading-relaxed">
              The single best reference is the CFIA's own page — see the{" "}
              <a href="https://inspection.canada.ca/en/travelling-pets-food-plants/travelling-pets" target="_blank" rel="noopener noreferrer" className="text-amber-700 underline decoration-amber-300 underline-offset-4 hover:text-amber-800 transition-colors">
                Canadian Food Inspection Agency's travelling-with-a-pet guidance
              </a>
              {" "}— which branches by animal, age and origin country. Always confirm against it before you book.
            </p>
          </section>

          {/* Airlines */}
          <section id="airlines" className="mb-14 scroll-mt-24">
            <div className="text-xs uppercase tracking-[0.25em] text-amber-700 mb-3">03 · Cabin airlines</div>
            <h2 className="font-serif text-2xl md:text-3xl text-stone-900 mb-3 leading-tight">
              Air Canada is the backbone — with US carriers across the border
            </h2>
            <p className="font-serif italic text-stone-600 text-lg mb-6 leading-snug">
              Which carrier you use depends on whether you're crossing the Atlantic or the 49th parallel.
            </p>

            <div className="space-y-5">
              <div>
                <h3 className="font-serif text-lg text-stone-900 mb-1.5">Air Canada</h3>
                <p className="font-serif text-stone-700 leading-relaxed">
                  The main cabin-pet carrier in and out of Canada, on both transatlantic and North American routes. The cabin pet limit is a combined 10 kg (pet plus carrier) — generous compared with the 8 kg of many European carriers. Air Canada serves the EU, India, and US destinations cabin-to-cabin from its Toronto, Montreal and Vancouver hubs.
                </p>
              </div>
              <div>
                <h3 className="font-serif text-lg text-stone-900 mb-1.5">Air Transat</h3>
                <p className="font-serif text-stone-700 leading-relaxed">
                  A useful cabin option from the UK, flying into Toronto from Manchester and Glasgow (not London Gatwick). Air Transat's cabin pet limit is a combined 8 kg.
                </p>
              </div>
              <div>
                <h3 className="font-serif text-lg text-stone-900 mb-1.5">US carriers across the border</h3>
                <p className="font-serif text-stone-700 leading-relaxed">
                  American, Delta and United all carry cabin pets on Canada–US routes, and WestJet operates within North America. US carriers generally cap cabin pets at around 20 lb combined, slightly under Air Canada's 10 kg / 22 lb. For a short cross-border hop, book whichever carrier serves your city pair — but always confirm the pet space by phone, as per-flight pet quotas fill up.
                </p>
              </div>
            </div>
          </section>

          {/* Routes */}
          <section id="routes" className="mb-14 scroll-mt-24">
            <div className="text-xs uppercase tracking-[0.25em] text-amber-700 mb-3">04 · Cabin routes</div>
            <h2 className="font-serif text-2xl md:text-3xl text-stone-900 mb-3 leading-tight">
              Direct cabin routes into and out of Canada
            </h2>
            <p className="font-serif italic text-stone-600 text-lg mb-6 leading-snug">
              Toronto, Montreal and Vancouver are the three cabin gateways.
            </p>

            <p className="font-serif text-stone-700 leading-relaxed mb-4">
              <strong>From Europe:</strong> Air Canada flies cabin pets London (LHR) to Montreal (about 7h 30m) and Toronto, and Air Transat flies Manchester and Glasgow to Toronto. Paris and Frankfurt connect cabin-to-cabin to Vancouver, Montreal and Toronto. Montreal to Paris (about 7h 15m) is the most popular direct cabin route between Canada and the EU.
            </p>

            <p className="font-serif text-stone-700 leading-relaxed mb-4">
              <strong>Within North America:</strong> short cabin hops are plentiful — Seattle to Vancouver is a one-hour flight on Alaska, and there are frequent cabin routes Toronto and Montreal to Miami, New York, Chicago and Los Angeles. These are popular with Canadians wintering in Florida.
            </p>

            <p className="font-serif text-stone-700 leading-relaxed">
              <strong>Long-haul:</strong> Air Canada flies cabin pets Toronto to Delhi and Vancouver to Frankfurt direct — India is not on Air Canada's no-cabin list, though you will need India's AQCS paperwork for the import side. For your exact city pair, the journey planner below maps the specific cabin airline, any connection, and a checklist matched to the route.
            </p>
          </section>

          {/* Commercial */}
          <section id="commercial" className="mb-14 scroll-mt-24">
            <div className="text-xs uppercase tracking-[0.25em] text-amber-700 mb-3">05 · Personal vs commercial</div>
            <h2 className="font-serif text-2xl md:text-3xl text-stone-900 mb-3 leading-tight">
              Canada draws a sharp line between a personal pet and a "commercial" dog
            </h2>
            <p className="font-serif italic text-stone-600 text-lg mb-6 leading-snug">
              This guide is about personal pets — but it's worth knowing the distinction.
            </p>

            <p className="font-serif text-stone-700 leading-relaxed mb-4">
              The gentle rules above apply to a <strong>personal pet</strong> — your own dog or cat, travelling with you, not for sale or transfer. A dog brought into Canada for adoption, fostering, breeding or resale is classified as a <strong>commercial import</strong>, and the requirements are stricter.
            </p>

            <p className="font-serif text-stone-700 leading-relaxed mb-4">
              Commercial dogs younger than 8 months from countries at high risk for dog rabies face additional requirements, and since 2022 commercial dogs from high-risk countries have faced import restrictions. Personal pets under 3 months old face no rabies vaccine requirement but have limited entry options.
            </p>

            <p className="font-serif text-stone-700 leading-relaxed">
              If your situation is anything other than a straightforward personal pet travelling with its owner, check the CFIA's Automated Import Reference System (AIRS), which gives the exact requirements for your specific scenario.
            </p>
          </section>

          {/* Arrival */}
          <section id="arrival" className="mb-14 scroll-mt-24">
            <div className="text-xs uppercase tracking-[0.25em] text-amber-700 mb-3">06 · Arrival &amp; CBSA</div>
            <h2 className="font-serif text-2xl md:text-3xl text-stone-900 mb-3 leading-tight">
              The border check is quick when your paperwork is in order
            </h2>
            <p className="font-serif italic text-stone-600 text-lg mb-6 leading-snug">
              CBSA officers inspect; CFIA sets the rules they enforce.
            </p>

            <p className="font-serif text-stone-700 leading-relaxed mb-4">
              On arrival, a Canada Border Services Agency (CBSA) officer may review your pet's documents — the rabies certificate and health certificate. Always declare your pet. Carry the originals (not just phone photos) in a clear folder. If the paperwork is complete, the inspection is typically quick.
            </p>

            <p className="font-serif text-stone-700 leading-relaxed mb-4">
              CBSA officers can refuse entry, confiscate or detain an animal if the documentation does not meet CFIA requirements — so the few documents Canada does ask for genuinely need to be right.
            </p>

            <p className="font-serif text-stone-700 leading-relaxed">
              Most major Canadian airports have pet relief areas near arrivals — find yours as soon as you clear the border, before heading to a taxi. Your pet has earned a proper break.
            </p>
          </section>

          {/* CTA */}
          <div className="bg-stone-900 text-stone-100 rounded-sm p-8 text-center mt-12">
            <h2 className="font-serif text-2xl text-stone-50 mb-3">Map your Canada journey</h2>
            <p className="font-serif text-stone-300 leading-relaxed mb-6">
              Use the journey planner to map your specific origin to Canada — with the right cabin airline, connection, and a checklist matched to your route.
            </p>
            <Link
              href="/?go=planner"
              className="inline-block bg-amber-600 text-white px-6 py-3 text-sm uppercase tracking-widest font-medium hover:bg-amber-500 transition-colors"
            >
              Open the journey planner
            </Link>
          </div>

          <p className="font-sans text-xs text-stone-400 leading-relaxed mt-12 text-center">
            Verified against the Canadian Food Inspection Agency (CFIA), Canada Border Services Agency (CBSA), and Air Canada and Air Transat published policies as of May 2026. Import rules can change and depend on your pet's age, origin and personal-versus-commercial status — always confirm the latest specifics with the CFIA before travel.
          </p>

          {/* Related guides — cross-links to other country/topic pages */}
          <div className="mt-16 pt-10 border-t border-stone-300">
            <div className="text-xs uppercase tracking-[0.25em] text-amber-700 mb-2">Related guides</div>
            <h2 className="font-serif text-2xl text-stone-900 mb-6">More from the pets-in-cabin guide</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <Link href="/seattle-pet-travel" className="block bg-stone-50 border border-stone-200 hover:border-amber-300 transition-colors p-4 rounded-sm">
                <div className="font-serif text-base text-stone-900 mb-1">Seattle / US Pacific NW guide →</div>
                <div className="text-xs text-stone-600 leading-relaxed">The one-hour Seattle–Vancouver cabin hop starts here.</div>
              </Link>

              <Link href="/uk-pet-travel" className="block bg-stone-50 border border-stone-200 hover:border-amber-300 transition-colors p-4 rounded-sm">
                <div className="font-serif text-base text-stone-900 mb-1">UK guide →</div>
                <div className="text-xs text-stone-600 leading-relaxed">Flying a pet out of the UK to Canada — and the cabin-ban catch.</div>
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
