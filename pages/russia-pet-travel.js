import Head from "next/head";
import Link from "next/link";

export default function RussiaPetTravel() {
  return (
    <>
      <Head>
        <title>Flying with a Pet to/from Russia &amp; Ukraine (2026): The Honest Guide | Pets in Cabin</title>
        <meta
          name="description"
          content="Russian airspace is shut to Western carriers, so the cabin route runs two legs via Istanbul, Dubai or Delhi on Aeroflot. Ukraine is overland through Poland."
        />
        <link rel="canonical" href="https://www.petsincabin.com/russia-pet-travel" />
        {/* Per-page Open Graph. _document.js supplies site-wide defaults;
            next/head dedupes by property, so these override them for this
            page only. Without these every page shared the homepage's
            OG identity — which Google was substituting for the page's own
            meta description in search results. */}
        <meta property="og:title" content="Flying with a Pet to and from Russia &amp; Ukraine" />
        <meta property="og:description" content="Russian airspace is shut to Western carriers, so the cabin route runs two legs via Istanbul, Dubai or Delhi on Aeroflot. Ukraine is overland through Poland." />
        <meta property="og:url" content="https://www.petsincabin.com/russia-pet-travel" />
        <meta property="og:type" content="article" />
        <meta name="twitter:title" content="Flying with a Pet to and from Russia &amp; Ukraine" />
        <meta name="twitter:description" content="Russian airspace is shut to Western carriers, so the cabin route runs two legs via Istanbul, Dubai or Delhi on Aeroflot. Ukraine is overland through Poland." />
        {/* Article schema — signals this is a maintained guide with a
            modification date, not a static page. dateModified must be
            bumped when the page's content materially changes. */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
                "@context": "https://schema.org",
                "@type": "Article",
                "headline": "Flying with a Pet to and from Russia & Ukraine",
                "description": "Russian airspace is shut to Western carriers, so the cabin route runs two legs via Istanbul, Dubai or Delhi on Aeroflot. Ukraine is overland through Poland.",
                "url": "https://www.petsincabin.com/russia-pet-travel",
                "author": {
                  "@type": "Person",
                  "name": "Theo's Mum"
                },
                "publisher": {
                  "@type": "Person",
                  "name": "Theo's Mum"
                },
                "dateModified": "2026-07-22",
                "isAccessibleForFree": true
              })
          }}
        />
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
            Country guide · Russia &amp; Ukraine
          </div>

          <h1 className="font-serif text-4xl md:text-5xl leading-[1.05] text-stone-900 mb-6">
            Flying with a pet <span className="italic text-stone-600">to and from Russia and Ukraine</span>.
          </h1>

          <div className="bg-white border border-stone-200 rounded-sm p-5 mb-8">
            <div className="text-xs uppercase tracking-widest text-stone-500 mb-3">In this guide</div>
            <div className="flex flex-wrap gap-2 text-sm">
              <a href="#the-short-answer" className="text-stone-700 hover:text-amber-700 underline decoration-stone-300 hover:decoration-amber-600 underline-offset-4">The short answer</a>
              <a href="#russia-route" className="text-stone-700 hover:text-amber-700 underline decoration-stone-300 hover:decoration-amber-600 underline-offset-4">The Russia cabin route</a>
              <a href="#russia-paperwork" className="text-stone-700 hover:text-amber-700 underline decoration-stone-300 hover:decoration-amber-600 underline-offset-4">Russia paperwork</a>
              <a href="#eu-reentry" className="text-stone-700 hover:text-amber-700 underline decoration-stone-300 hover:decoration-amber-600 underline-offset-4">Coming back to the EU</a>
              <a href="#ukraine" className="text-stone-700 hover:text-amber-700 underline decoration-stone-300 hover:decoration-amber-600 underline-offset-4">Ukraine: the land route</a>
              <a href="#ukraine-paperwork" className="text-stone-700 hover:text-amber-700 underline decoration-stone-300 hover:decoration-amber-600 underline-offset-4">Ukraine paperwork</a>
              <a href="#specialists" className="text-stone-700 hover:text-amber-700 underline decoration-stone-300 hover:decoration-amber-600 underline-offset-4">When to use a specialist</a>
            </div>
          </div>

          <p className="font-serif text-lg md:text-xl text-stone-700 leading-relaxed mb-8">
            This is the one guide on the site where the honest answer starts with what you <em>can't</em> do. Since February 2022, the direct routes that used to exist between Western countries and this part of the world have closed. Russian airspace is shut to UK, US, EU and Canadian carriers — and reciprocally, Russia's own airlines can't fly to most Western destinations. Ukrainian airspace is closed to commercial flights altogether, and has been for over four years. There is no straightforward way to put a pet on a plane between the West and either country.
          </p>

          <p className="font-serif text-lg md:text-xl text-stone-700 leading-relaxed mb-8">
            But people are still making these journeys — moving for work, returning home, leaving a war — and they're searching for real answers. So this page lays out the routes that <em>do</em> exist. They're indirect, they take planning, and the picture shifts with the security situation. We've kept Russia and Ukraine on one page because they share the same starting fact — closed airspace — but the two situations are not the same, and the sections below treat them separately.
          </p>

          <p className="font-serif italic text-stone-600 leading-relaxed mb-12">
            Verified against Aeroflot's own pet-travel pages, Rosselkhoznadzor (Russia's veterinary authority), USDA APHIS country guidance for Russia and Ukraine, the EU Commission's pet-movement rules, EASA's conflict-zone airspace bulletins, and Ukraine's government travel portal, as of May 2026. This is a fast-moving area — confirm every leg, crossing and certificate is currently operating before you commit to dates.
          </p>

          {/* 01 — short answer */}
          <section id="the-short-answer" className="mb-14 scroll-mt-24">
            <div className="text-xs uppercase tracking-[0.25em] text-amber-700 mb-3">01 · The short answer</div>
            <h2 className="font-serif text-2xl md:text-3xl text-stone-900 mb-3 leading-tight">
              No direct flight either way. Two very different workarounds.
            </h2>
            <p className="font-serif italic text-stone-600 text-lg mb-6 leading-snug">
              Russia: a two-leg cabin route via a hub. Ukraine: overland through Poland.
            </p>

            <p className="font-serif text-stone-700 leading-relaxed mb-4">
              For <strong>Russia</strong>, the cabin route still exists, just not in one hop. You fly cabin on a Western or Gulf carrier to a hub Aeroflot still serves — Istanbul, Dubai or Delhi are the usual ones — then connect onto Aeroflot for the Moscow leg. Aeroflot is genuinely pet-friendly in the cabin (8 kg under the seat, or up to 15 kg if you buy a second seat for the carrier), so each leg is a cabin leg. It's two tickets, two pet bookings and two sets of paperwork, but it works.
            </p>

            <p className="font-serif text-stone-700 leading-relaxed mb-4">
              For <strong>Ukraine</strong>, there is no commercial flight at all — every Ukrainian airport has been closed to civilian traffic since the full-scale invasion began. The route people actually use is to fly into Poland and continue overland: train or pet-friendly coach from Warsaw or Rzeszów across the border. It's slow and the crossings are unpredictable, but it's the real answer.
            </p>

            <div className="bg-amber-50 border border-amber-200 rounded-sm p-5">
              <p className="font-serif text-stone-700 leading-relaxed text-sm">
                One thing that catches people out in <em>both</em> directions home: coming back into the EU or UK from Russia or Ukraine, your pet needs a rabies antibody (titre) blood test, drawn at least three months before re-entry. Russia was removed from the EU's list of approved countries in September 2024, and Ukraine was never on it — so neither qualifies for the simpler path. Build that three-month wait into your plans from the start.
              </p>
            </div>
          </section>

          {/* 02 — Russia route */}
          <section id="russia-route" className="mb-14 scroll-mt-24">
            <div className="text-xs uppercase tracking-[0.25em] text-amber-700 mb-3">02 · The Russia cabin route</div>
            <h2 className="font-serif text-2xl md:text-3xl text-stone-900 mb-3 leading-tight">
              Fly to a hub, then take Aeroflot in
            </h2>
            <p className="font-serif italic text-stone-600 text-lg mb-6 leading-snug">
              Istanbul, Dubai or Delhi are the practical connecting points.
            </p>

            <p className="font-serif text-stone-700 leading-relaxed mb-4">
              No Western airline flies into Russia, so the cabin route is built around the network Aeroflot still operates — around 17 mostly non-Western destinations, including the UAE (Dubai), Turkey (Istanbul), India (Delhi, Mumbai, Goa), China, Egypt, the Maldives, Iran, Belarus, Kazakhstan and other former-Soviet states. The trick is to reach one of those hubs on a carrier that takes cabin pets, then connect onto Aeroflot for the Moscow leg.
            </p>

            <p className="font-serif text-stone-700 leading-relaxed mb-4">
              From the UK or Europe, the cleanest options are <strong>Istanbul</strong> (Turkish Airlines carries cabin pets out of most of Europe, and the Istanbul–Moscow hop is about three hours) or <strong>Dubai</strong> (Emirates and others reach Dubai, and Aeroflot runs the roughly five-and-a-half-hour Dubai–Moscow leg in the cabin — notable because Dubai is cargo-only on arrival for most <em>other</em> airlines). From Asia, <strong>Delhi</strong> works the same way, about six hours into Moscow.
            </p>

            <p className="font-serif text-stone-700 leading-relaxed mb-4">
              Aeroflot's cabin allowance is one of the more generous around: a carrier under the seat with a combined weight up to 8 kg, plus the option to buy a second seat for a carrier of up to 15 kg on the adjacent seat — useful for a dog that's just over the usual cabin size. Rigid carriers can be up to 44 × 30 × 26 cm. Reserve the pet space at least 36 hours ahead, and note that brachycephalic (flat-faced) breeds are banned from the cabin.
            </p>

            <div className="bg-white border border-stone-200 rounded-sm p-5 mb-4">
              <div className="text-xs uppercase tracking-widest text-stone-500 mb-2">The two-leg pattern, in short</div>
              <p className="font-serif text-stone-700 leading-relaxed text-sm mb-2">
                <strong>Leg 1:</strong> London / European city → Istanbul (Turkish), Dubai (Emirates) or Delhi (Air India) — cabin, Western or Gulf carrier.
              </p>
              <p className="font-serif text-stone-700 leading-relaxed text-sm mb-2">
                <strong>Buffer:</strong> a generous layover, or better an overnight, so the pet rests and you re-check in for the second ticket.
              </p>
              <p className="font-serif text-stone-700 leading-relaxed text-sm">
                <strong>Leg 2:</strong> Hub → Moscow Sheremetyevo (SVO) on Aeroflot — cabin, 8 kg under-seat or up to 15 kg with the adjacent seat.
              </p>
            </div>

            <p className="font-serif text-stone-700 leading-relaxed">
              Because these are two separate through-tickets, the pet allowance and fee are charged on each leg, and you'll re-clear check-in at the hub. Confirm both pet bookings by phone a few days before you travel — sanctions and route changes mean Aeroflot's schedule shifts more than most.
            </p>
          </section>

          {/* 03 — Russia paperwork */}
          <section id="russia-paperwork" className="mb-14 scroll-mt-24">
            <div className="text-xs uppercase tracking-[0.25em] text-amber-700 mb-3">03 · Russia paperwork</div>
            <h2 className="font-serif text-2xl md:text-3xl text-stone-900 mb-3 leading-tight">
              The Rosselkhoznadzor chain
            </h2>
            <p className="font-serif italic text-stone-600 text-lg mb-6 leading-snug">
              Form No. 1 on the way out, Form No. 6.1 on the way in.
            </p>

            <p className="font-serif text-stone-700 leading-relaxed mb-4">
              Russia's veterinary authority is Rosselkhoznadzor (the Federal Service for Veterinary and Phytosanitary Surveillance), and its paperwork runs through a specific exchange at the airport border-control desk. The underlying requirements are familiar: an ISO microchip, recorded both in the pet's international passport and on the veterinary certificate, and a rabies vaccination that is at least 30 days old and no more than 12 months old at travel. Up to two pets per person can travel without an import permit; three or more needs a Rosselkhoznadzor permit arranged in advance.
            </p>

            <p className="font-serif text-stone-700 leading-relaxed mb-4">
              <strong>Coming into Russia,</strong> you travel on a health certificate (or international passport) showing a clinical exam by an official vet within five days of travel — some Russian carriers and airports accept up to 14 days, but five is the safe assumption. At the border, Rosselkhoznadzor reissues your foreign certificate as Russian Form No. 6.1.
            </p>

            <p className="font-serif text-stone-700 leading-relaxed mb-4">
              <strong>Leaving Russia,</strong> the chain is different. You first obtain Russian Veterinary Certificate Form No. 1 from the State Veterinary Service within five days of departure; then, at the airport border control, Rosselkhoznadzor exchanges it for international Form No. 5a, free of charge. Leave time for that swap on the day. If your destination has its own import certificate — the EU especially — you'll need that issued in parallel at the same vet visit.
            </p>

            <p className="font-serif text-stone-700 leading-relaxed">
              A breed note that applies in both directions: wolf hybrids, and Savannah and Bengal cats less than five generations from a wild ancestor, are not permitted under the standard rules.
            </p>
          </section>

          {/* 04 — EU re-entry */}
          <section id="eu-reentry" className="mb-14 scroll-mt-24">
            <div className="text-xs uppercase tracking-[0.25em] text-amber-700 mb-3">04 · Coming back to the EU or UK</div>
            <h2 className="font-serif text-2xl md:text-3xl text-stone-900 mb-3 leading-tight">
              The titre test and the three-month wait
            </h2>
            <p className="font-serif italic text-stone-600 text-lg mb-6 leading-snug">
              This is the step that needs the most lead time — plan it first.
            </p>

            <p className="font-serif text-stone-700 leading-relaxed mb-4">
              The EU sorts the rest of the world into countries it considers low-risk for rabies and countries it doesn't. Pets returning from a "listed" country need only a microchip, a valid rabies vaccine and a health certificate. Pets returning from a <em>non-listed</em> country need an extra step: a rabies antibody (titre) blood test, taken at an EU-approved laboratory, with the blood drawn at least 30 days after vaccination — and crucially, at least <strong>three months before</strong> the pet enters the EU.
            </p>

            <p className="font-serif text-stone-700 leading-relaxed mb-4">
              Russia used to be on the listed side. It was <strong>removed from the EU's approved-country list in September 2024</strong> (along with Belarus), which means the titre-plus-three-month-wait now applies to pets coming from Russia. Ukraine has never been on the list, so the same applies there. Some older airline and aggregator pages still show Russia as listed — that information is out of date.
            </p>

            <div className="bg-amber-50 border border-amber-200 rounded-sm p-5">
              <p className="font-serif text-stone-700 leading-relaxed text-sm">
                The practical consequence: if you might bring your pet back to the EU or UK, get the rabies vaccination and the titre blood draw done <em>before</em> you leave, or very early in your stay. The three-month clock starts at the blood draw, not at departure — so a test done too late can strand a pet for months. Start the whole process at least four months before any planned return.
              </p>
            </div>
          </section>

          {/* 05 — Ukraine */}
          <section id="ukraine" className="mb-14 scroll-mt-24">
            <div className="text-xs uppercase tracking-[0.25em] text-amber-700 mb-3">05 · Ukraine — the land route</div>
            <h2 className="font-serif text-2xl md:text-3xl text-stone-900 mb-3 leading-tight">
              No flight. The real route runs through Poland.
            </h2>
            <p className="font-serif italic text-stone-600 text-lg mb-6 leading-snug">
              Fly into Poland, then continue overland by rail or road.
            </p>

            <p className="font-serif text-stone-700 leading-relaxed mb-4">
              Ukraine's situation is different from Russia's, and it deserves to be said plainly: this is a country at war, and many of the people moving pets across its borders are leaving rather than arriving. Civilian flights stopped on 24 February 2022, when the full-scale Russian invasion began, and every Ukrainian airport has stayed closed to commercial traffic since. The European aviation regulator's conflict-zone advisory keeps Ukrainian airspace off-limits to airlines, and has been rolled forward repeatedly since 2022 — the current extension runs to 31 July 2026, and further extensions have followed every time so far. A Ukrainian government working group began planning a phased reopening in March 2026, but no flights have resumed, and nobody is putting a date on it.
            </p>

            <p className="font-serif text-stone-700 leading-relaxed mb-4">
              So the route is overland, and in practice it runs through <strong>Poland</strong>. You fly cabin into Warsaw — LOT, Lufthansa and others carry pets there from across Europe — and then continue by train or pet-friendly long-distance coach toward the border. The rail line to <strong>Przemyśl</strong>, the Polish town closest to the main crossing, is the well-trodden path; from there, trains and buses run on into Lviv and onward. Polish State Railways (PKP) carry small pets in a carrier free of charge; larger dogs travel muzzled and on a lead.
            </p>

            <p className="font-serif text-stone-700 leading-relaxed mb-4">
              The honest caveats matter here more than anywhere else on the site. Border crossings can take anywhere from a few hours to most of a day, and which crossings are open — and how they're operating — changes with the security situation. A realistic door-to-door time from London to Kyiv is around two days. Verify that your specific route and crossing are running before you book anything, and check your government's current travel advice for Ukraine, which will frame whether the journey should be attempted at all.
            </p>

            <div className="bg-stone-100 border border-stone-200 rounded-sm p-5">
              <div className="text-xs uppercase tracking-widest text-stone-500 mb-2">If you are leaving Ukraine with a pet</div>
              <p className="font-serif text-stone-700 leading-relaxed text-sm">
                Since 2022, the EU and the UK have let people fleeing Ukraine bring pets in under relaxed rules — typically arriving first and completing any missing paperwork (microchip, rabies, titre) on arrival under official supervision, rather than being turned back. These concessions are extended and revised periodically, so check the current published rules from your destination country's veterinary authority before relying on them. For arrivals into the UK, contact the APHA pet team in advance; bring whatever vaccination or vet records you have, even if incomplete.
              </p>
            </div>
          </section>

          {/* 06 — Ukraine paperwork */}
          <section id="ukraine-paperwork" className="mb-14 scroll-mt-24">
            <div className="text-xs uppercase tracking-[0.25em] text-amber-700 mb-3">06 · Ukraine paperwork</div>
            <h2 className="font-serif text-2xl md:text-3xl text-stone-900 mb-3 leading-tight">
              The standard requirements, in peacetime terms
            </h2>
            <p className="font-serif italic text-stone-600 text-lg mb-6 leading-snug">
              Microchip, rabies, titre, certificate — with a few Ukraine-specific timings.
            </p>

            <p className="font-serif text-stone-700 leading-relaxed mb-4">
              Setting the wartime concessions aside, Ukraine's ordinary import rules for a dog or cat are: an ISO microchip; a rabies vaccination given at least <strong>21 days</strong> before travel (Ukraine recognises the vaccine's own validity period, including three-year vaccines); a rabies antibody titre test, with blood drawn at least 30 days after vaccination and more than three months before entry, showing a result of at least 0.5 IU/ml; and an international veterinary health certificate issued within 10 days of travel and endorsed by a government vet. For dogs, a tapeworm treatment is recorded 24 to 120 hours before arrival.
            </p>

            <p className="font-serif text-stone-700 leading-relaxed mb-4">
              Pets entering with their owners don't need an import permit — that applies to commercial imports only. The familiar breed exclusions apply: wolf hybrids, and Savannah and Bengal cats less than five generations from the wild.
            </p>

            <p className="font-serif text-stone-700 leading-relaxed">
              If you transit an EU country on the way — and via Poland you will — your pet has to satisfy that country's EU entry rules too, which since April 2026 means a fresh Animal Health Certificate for non-EU residents rather than an old EU pet passport. In effect you're meeting EU transit rules and Ukraine's entry rules on the same trip, so it's worth mapping both before you set the vaccination dates.
            </p>
          </section>

          {/* 07 — specialists */}
          <section id="specialists" className="mb-14 scroll-mt-24">
            <div className="text-xs uppercase tracking-[0.25em] text-amber-700 mb-3">07 · When to use a specialist</div>
            <h2 className="font-serif text-2xl md:text-3xl text-stone-900 mb-3 leading-tight">
              This is rarely a DIY journey
            </h2>
            <p className="font-serif italic text-stone-600 text-lg mb-6 leading-snug">
              For most people moving long-term, a relocation specialist earns their fee.
            </p>

            <p className="font-serif text-stone-700 leading-relaxed mb-4">
              For a short, well-planned cabin trip into Russia via Istanbul or Dubai, a confident owner can manage it alone. But for anyone moving long-term, moving a larger animal, or moving in or out of Ukraine, the realistic answer is a specialist pet relocation company. They handle the documentation, the routing through Turkey, Central Asia or Poland, and — the part that's hardest from a distance — the current ground intelligence on which crossings and connections are actually operating this week.
            </p>

            <p className="font-serif text-stone-700 leading-relaxed">
              IPATA-listed shippers serving Russia and Ukraine exist but are limited; emailing three or four and comparing their proposed routes is a sensible first step. Expect international relocation through this region to run into the several thousands of euros, scaling with origin and the size of the animal. It's a lot — but so is the cost of a pet stranded at a border by a single mistimed certificate.
            </p>
          </section>

          {/* CTA */}
          <div className="bg-stone-900 text-stone-100 rounded-sm p-8 text-center mt-12">
            <h2 className="font-serif text-2xl text-stone-50 mb-3">Map your Russia journey</h2>
            <p className="font-serif text-stone-300 leading-relaxed mb-6">
              Use the journey planner to map your origin to Moscow — it builds the two-leg cabin route via Istanbul, Dubai or Delhi on Aeroflot, with the paperwork and a checklist matched to your direction. (Ukraine has no air route to plan — see the land section above.)
            </p>
            <Link
              href="/?go=planner"
              className="inline-block bg-amber-600 text-white px-6 py-3 text-sm uppercase tracking-widest font-medium hover:bg-amber-500 transition-colors"
            >
              Open the journey planner
            </Link>
          </div>

          <p className="font-sans text-xs text-stone-400 leading-relaxed mt-12 text-center">
            Verified against Aeroflot's published pet rules, Rosselkhoznadzor, USDA APHIS country guidance for Russia and Ukraine, the European Commission's pet-movement rules, EASA conflict-zone airspace bulletins, and Ukraine's government travel portal, as of May 2026. This region's routes, crossings and rules change with the security situation — confirm every leg and certificate is currently operating, and check your government's travel advice, before you commit.
          </p>

          {/* Related guides */}
          <div className="mt-16 pt-10 border-t border-stone-300">
            <div className="text-xs uppercase tracking-[0.25em] text-amber-700 mb-2">Related guides</div>
            <h2 className="font-serif text-2xl text-stone-900 mb-6">More from the pets-in-cabin guide</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <Link href="/uae-pet-travel" className="block bg-stone-50 border border-stone-200 hover:border-amber-300 transition-colors p-4 rounded-sm">
                <div className="font-serif text-base text-stone-900 mb-1">UAE guide →</div>
                <div className="text-xs text-stone-600 leading-relaxed">Dubai is a key connecting hub — and a destination with its own permit rules.</div>
              </Link>

              <Link href="/india-pet-travel" className="block bg-stone-50 border border-stone-200 hover:border-amber-300 transition-colors p-4 rounded-sm">
                <div className="font-serif text-base text-stone-900 mb-1">India guide →</div>
                <div className="text-xs text-stone-600 leading-relaxed">Delhi is the other Aeroflot hub — plus the AQCS paperwork for India itself.</div>
              </Link>

              <Link href="/uk-pet-travel" className="block bg-stone-50 border border-stone-200 hover:border-amber-300 transition-colors p-4 rounded-sm">
                <div className="font-serif text-base text-stone-900 mb-1">UK guide →</div>
                <div className="text-xs text-stone-600 leading-relaxed">The titre-and-wait rule for coming home, explained for UK arrivals.</div>
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
