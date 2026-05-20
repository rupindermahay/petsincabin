import Head from "next/head";
import Link from "next/link";

export default function JapanPetTravel() {
  return (
    <>
      <Head>
        <title>Flying with a Pet to/from Japan (2026): Complete Guide | Pets in Cabin</title>
        <meta
          name="description"
          content="Bringing a dog or cat to Japan, or flying out with a pet? The cabin and cargo reality, the 180-day FAVN wait, AQS advance notification and approved entry ports."
        />
        <link rel="canonical" href="https://www.petsincabin.com/japan-pet-travel" />
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
            Country guide · Japan
          </div>

          <h1 className="font-serif text-4xl md:text-5xl leading-[1.05] text-stone-900 mb-6">
            Flying with a pet <span className="italic text-stone-600">to and from Japan</span>.
          </h1>

          <p className="font-serif text-lg md:text-xl text-stone-700 leading-relaxed mb-8">
            Japan has one of the world's strictest pet import processes — a 7-month timeline with a 180-day rabies titer waiting period and a separate 40-day AQS notification deadline. And neither Japanese flag carrier (JAL, ANA) accepts pets in the cabin. But cabin pet paths into and out of Japan do exist — there are exactly three, and this guide explains them.
          </p>

          <p className="font-serif italic text-stone-600 leading-relaxed mb-12">
            Verified against Japan's Ministry of Agriculture, Forestry and Fisheries (MAFF), Animal Quarantine Service (AQS), USDA APHIS, and current airline policies as of May 2026. Rules change — confirm directly before booking.
          </p>

          <div className="bg-white border border-stone-200 rounded-sm p-5 mb-12">
            <div className="text-xs uppercase tracking-widest text-stone-500 mb-3">In this guide</div>
            <div className="flex flex-wrap gap-2 text-sm">
              <a href="#cabin-paths" className="text-stone-700 hover:text-amber-700 underline decoration-stone-300 hover:decoration-amber-600 underline-offset-4">Three cabin pet paths</a>
              <a href="#jal-ana" className="text-stone-700 hover:text-amber-700 underline decoration-stone-300 hover:decoration-amber-600 underline-offset-4">Why JAL/ANA won't work</a>
              <a href="#timeline" className="text-stone-700 hover:text-amber-700 underline decoration-stone-300 hover:decoration-amber-600 underline-offset-4">The 7-month timeline</a>
              <a href="#favn" className="text-stone-700 hover:text-amber-700 underline decoration-stone-300 hover:decoration-amber-600 underline-offset-4">FAVN titer + 180-day wait</a>
              <a href="#advance-notification" className="text-stone-700 hover:text-amber-700 underline decoration-stone-300 hover:decoration-amber-600 underline-offset-4">AQS Advance Notification</a>
              <a href="#entry-ports" className="text-stone-700 hover:text-amber-700 underline decoration-stone-300 hover:decoration-amber-600 underline-offset-4">11 entry ports</a>
              <a href="#designated-countries" className="text-stone-700 hover:text-amber-700 underline decoration-stone-300 hover:decoration-amber-600 underline-offset-4">Rabies-free origin exemption</a>
            </div>
          </div>

          <div className="h-px bg-stone-300 mb-12" />

          {/* Cabin paths */}
          <section id="cabin-paths" className="mb-14 scroll-mt-24">
            <div className="text-xs uppercase tracking-[0.25em] text-amber-700 mb-3">01 · Cabin paths</div>
            <h2 className="font-serif text-2xl md:text-3xl text-stone-900 mb-3 leading-tight">
              There are exactly three cabin pet paths to Japan
            </h2>
            <p className="font-serif italic text-stone-600 text-lg mb-6 leading-snug">
              Most international airlines into Japan are cargo-only. These three are the exceptions.
            </p>

            <div className="space-y-5">
              <div>
                <h3 className="font-serif text-lg text-stone-900 mb-1.5">1. US ↔ Japan via United</h3>
                <p className="font-serif text-stone-700 leading-relaxed">
                  United accepts cabin pets US ↔ Japan with no weight limit (the pet just needs to fit in the carrier under the seat). $150 each way. From September-October 2026, United operates daily SFO to Tokyo (NRT and HND) and Osaka (KIX), plus twice-weekly Chicago ORD to Tokyo NRT. For Seattle travellers, fly Alaska/Delta SEA→SFO first, then connect to United.
                </p>
              </div>
              <div>
                <h3 className="font-serif text-lg text-stone-900 mb-1.5">2. Korea ↔ Japan via Korean carriers</h3>
                <p className="font-serif text-stone-700 leading-relaxed">
                  Korean Air, T'Way Air, and Air Premia all fly cabin pets between Tokyo (NRT/HND) or Osaka (KIX) and Seoul Incheon (ICN). Korean Air's max cabin weight is 7 kg combined; T'Way's is 9 kg. Korean Air's wider network (30+ countries cabin) means you can connect from Seoul to most of the world cabin-to-cabin — but only on Korean Air both legs. T'Way doesn't permit pet transit through Korea.
                </p>
              </div>
              <div>
                <h3 className="font-serif text-lg text-stone-900 mb-1.5">3. Mexico / Latin America → Japan via US west coast</h3>
                <p className="font-serif text-stone-700 leading-relaxed">
                  There is no direct cabin pet route from Mexico or Latin America to Japan. Aeromexico's Mexico City–Tokyo direct service is sometimes described as cabin pet–friendly, but Aeromexico's own published policy restricts cabin pets to flights under 6 hours, and the MEX-NRT route itself appears to have been suspended in early 2026. The cabin workaround: route Mexico City → US west coast (LAX/SFO) on Aeromexico or Volaris (~3-4 hours, well within Aeromexico's 6-hour rule), then United LAX/SFO → Tokyo direct (cabin pet, no weight limit, $150). Two segments, but both viable cabin.
                </p>
              </div>
            </div>
          </section>

          {/* JAL/ANA */}
          <section id="jal-ana" className="mb-14 scroll-mt-24">
            <div className="text-xs uppercase tracking-[0.25em] text-amber-700 mb-3">02 · JAL and ANA</div>
            <h2 className="font-serif text-2xl md:text-3xl text-stone-900 mb-3 leading-tight">
              Japan's flag carriers don't take cabin pets on any flight
            </h2>
            <p className="font-serif italic text-stone-600 text-lg mb-6 leading-snug">
              International, domestic — it doesn't matter. Cargo only.
            </p>

            <p className="font-serif text-stone-700 leading-relaxed mb-4">
              JAL (Japan Airlines) and ANA (All Nippon Airways) both used to allow cabin pets and stopped — JAL cites complaints about allergies, noise, and smell from other passengers. Both now accept pets only in the climate-controlled cargo hold. Service dogs are the only exception.
            </p>

            <p className="font-serif text-stone-700 leading-relaxed mb-4">
              <strong>If cargo is acceptable</strong>, JAL and ANA's cargo handling is generally well-regarded — pressurised, temperature-controlled holds, careful loading. ANA charges around $400 per cage cross-area international, $250 within Asia, JPY 6,000 domestic (from May 19, 2026). JAL is similar pricing.
            </p>

            <p className="font-serif text-stone-700 leading-relaxed">
              <strong>Both airlines have summer breed embargos</strong> — JAL adds 23 short-nosed breeds to its banned cargo list May-October due to heat-stress risk. Bulldogs and French Bulldogs are banned year-round.
            </p>
          </section>

          {/* Timeline */}
          <section id="timeline" className="mb-14 scroll-mt-24">
            <div className="text-xs uppercase tracking-[0.25em] text-amber-700 mb-3">03 · The timeline</div>
            <h2 className="font-serif text-2xl md:text-3xl text-stone-900 mb-3 leading-tight">
              Start at least 7 months before you want to land in Japan
            </h2>
            <p className="font-serif italic text-stone-600 text-lg mb-6 leading-snug">
              This is non-negotiable — the rabies titer wait is a hard floor.
            </p>

            <p className="font-serif text-stone-700 leading-relaxed mb-4">The full sequence, with example timing:</p>

            <ul className="font-serif text-stone-700 leading-relaxed mb-4 space-y-2 ml-5 list-disc">
              <li><strong>Month 1:</strong> ISO 11784/11785 microchip implanted. Must be done BEFORE the first rabies vaccine — get the vaccine order wrong and the whole process restarts.</li>
              <li><strong>Month 1 (same day OK):</strong> First rabies vaccine — pet must be at least 91 days old (12 weeks = 84 days, below Japan's minimum).</li>
              <li><strong>Month 2:</strong> Second rabies vaccine, at least 30 days after the first.</li>
              <li><strong>Month 2:</strong> FAVN/RFFIT rabies antibody titer blood draw at a Japan-approved lab (Kansas State University Rabies Lab is the standard US destination). Must show ≥0.5 IU/ml.</li>
              <li><strong>Months 2–8:</strong> 180-day waiting period from the blood draw date. The clock starts on the draw, NOT on the result coming back. Day 0 = blood draw day. Your flight must arrive on Day 180 or later.</li>
              <li><strong>~40 days before flight:</strong> Submit AQS Advance Notification to the entry port (separate forms for dogs vs cats).</li>
              <li><strong>10 days before flight:</strong> USDA-accredited vet clinical exam. Form A and Form C completed. USDA APHIS endorsement.</li>
              <li><strong>Travel day:</strong> Carry every original document. Land at an approved port before 5 PM.</li>
            </ul>

            <p className="font-serif text-stone-700 leading-relaxed">
              <strong>The single most common mistake</strong> is arriving before Day 180. Your pet will be detained at an AQS facility for the remaining days, at your expense (~$25/day plus transport and vet visits). Build a buffer — book your flight for Day 190+ if you can.
            </p>
            <p className="font-serif text-stone-700 leading-relaxed mt-4">
              The "USDA APHIS endorsement" line above trips people up — it is the step where USDA reviews and stamps the certificate your vet issues. Our <Link href="/usda-endorsement-guide" className="text-amber-700 underline decoration-amber-300 hover:decoration-amber-600 underline-offset-2">USDA endorsement guide</Link> walks through how it works, the prepaid return label, and how to keep it from becoming a last-minute scramble.
            </p>
          </section>

          {/* FAVN */}
          <section id="favn" className="mb-14 scroll-mt-24">
            <div className="text-xs uppercase tracking-[0.25em] text-amber-700 mb-3">04 · FAVN titer</div>
            <h2 className="font-serif text-2xl md:text-3xl text-stone-900 mb-3 leading-tight">
              The rabies antibody titer is the binding constraint
            </h2>
            <p className="font-serif italic text-stone-600 text-lg mb-6 leading-snug">
              This is the test that determines when your pet can enter Japan.
            </p>

            <p className="font-serif text-stone-700 leading-relaxed mb-4">
              The FAVN (Fluorescent Antibody Virus Neutralisation) test is a blood antibody check that confirms your pet developed immunity from the rabies vaccinations. Japan requires a result of ≥0.5 IU/ml from a MAFF-approved laboratory.
            </p>

            <p className="font-serif text-stone-700 leading-relaxed mb-4">
              <strong>Approved US labs include Kansas State University Rabies Laboratory.</strong> Some MAFF-listed US labs are restricted to military personnel only — confirm eligibility before sending samples.
            </p>

            <p className="font-serif text-stone-700 leading-relaxed mb-4">
              The test is valid for 2 years from the blood draw date. You can re-enter Japan within those 2 years without a new titer, as long as your rabies vaccinations stay continuously current (no lapses, even by a day). If the titer expires before you travel, you need a new test — but you don't have to repeat the 180-day wait if the original titer was valid.
            </p>

            <p className="font-serif text-stone-700 leading-relaxed">
              <strong>If the titer fails</strong> (under 0.5 IU/ml): re-vaccinate, wait 30 days, retest. The 180-day clock only starts from a passing test. Around 5-10% of pets fail their first titer.
            </p>
          </section>

          {/* AQS Notification */}
          <section id="advance-notification" className="mb-14 scroll-mt-24">
            <div className="text-xs uppercase tracking-[0.25em] text-amber-700 mb-3">05 · AQS Advance Notification</div>
            <h2 className="font-serif text-2xl md:text-3xl text-stone-900 mb-3 leading-tight">
              The 40-day deadline that's separate from the 180-day wait
            </h2>
            <p className="font-serif italic text-stone-600 text-lg mb-6 leading-snug">
              People conflate these. They are different rules. Both must be satisfied.
            </p>

            <p className="font-serif text-stone-700 leading-relaxed mb-4">
              Once your pet has completed the 180-day wait, you must submit an Advance Notification to the Japan Animal Quarantine Service (AQS) office at your intended port of arrival at least 40 days before your pet's arrival.
            </p>

            <p className="font-serif text-stone-700 leading-relaxed mb-4">
              <strong>The form requires:</strong> microchip number, vaccination dates and vaccine product details, blood draw date and titer result, pet's physical measurements (length and height in cm), your current home address, destination address in Japan, copy of your passport. Forms are different for dogs and cats.
            </p>

            <p className="font-serif text-stone-700 leading-relaxed mb-4">
              AQS reviews and issues an "Approval of Import Inspection of Animals" — print or save it, this is required for boarding. If quarantine facility space is full on your date, AQS may direct you to change port or date.
            </p>

            <p className="font-serif text-stone-700 leading-relaxed">
              <strong>Submissions less than 40 days before arrival are generally not accepted.</strong> This can block entry regardless of how perfect the rest of your paperwork is. Mark this deadline before you book flights.
            </p>
          </section>

          {/* Entry ports */}
          <section id="entry-ports" className="mb-14 scroll-mt-24">
            <div className="text-xs uppercase tracking-[0.25em] text-amber-700 mb-3">06 · Entry ports</div>
            <h2 className="font-serif text-2xl md:text-3xl text-stone-900 mb-3 leading-tight">
              Pets enter Japan only at 11 approved airports
            </h2>
            <p className="font-serif italic text-stone-600 text-lg mb-6 leading-snug">
              Other airports turn pets away.
            </p>

            <p className="font-serif text-stone-700 leading-relaxed mb-4">
              The full list of approved animal entry airports:
            </p>

            <ul className="font-serif text-stone-700 leading-relaxed mb-4 space-y-1.5 ml-5 list-disc">
              <li><strong>New Chitose (CTS)</strong> — Sapporo / Hokkaido</li>
              <li><strong>Narita (NRT)</strong> — Tokyo's main international gateway</li>
              <li><strong>Haneda (HND)</strong> — Tokyo's central airport, closer to the city</li>
              <li><strong>Chubu / Nagoya (NGO)</strong></li>
              <li><strong>Kansai / Osaka (KIX)</strong></li>
              <li><strong>Itami (ITM)</strong> — Osaka's domestic-focused airport</li>
              <li><strong>Kobe (UKB)</strong></li>
              <li><strong>Kitakyushu (KKJ)</strong></li>
              <li><strong>Fukuoka (FUK)</strong></li>
              <li><strong>Kagoshima (KOJ)</strong></li>
              <li><strong>Naha (OKA)</strong> — Okinawa</li>
            </ul>

            <p className="font-serif text-stone-700 leading-relaxed mb-4">
              <strong>Arrive before 5 PM.</strong> Pets arriving after 5 PM cannot be released from their crate until customs reopens the next morning — your pet spends the night at the airport.
            </p>

            <p className="font-serif text-stone-700 leading-relaxed">
              Domestic onward travel within Japan (to non-listed airports) is fine after AQS clearance.
            </p>
          </section>

          {/* Designated countries */}
          <section id="designated-countries" className="mb-14 scroll-mt-24">
            <div className="text-xs uppercase tracking-[0.25em] text-amber-700 mb-3">07 · Rabies-free origin shortcut</div>
            <h2 className="font-serif text-2xl md:text-3xl text-stone-900 mb-3 leading-tight">
              Six "designated" countries skip the FAVN and 180-day wait
            </h2>
            <p className="font-serif italic text-stone-600 text-lg mb-6 leading-snug">
              If your pet's been continuously resident in one of these for 6+ months, the process is much simpler.
            </p>

            <p className="font-serif text-stone-700 leading-relaxed mb-4">
              Japan classifies countries as "designated" (rabies-free) or "non-designated." Pets from designated countries that have been resident there for at least 6 months before travel skip the titer test and 180-day wait entirely.
            </p>

            <p className="font-serif text-stone-700 leading-relaxed mb-4">
              <strong>Designated regions:</strong>
            </p>

            <ul className="font-serif text-stone-700 leading-relaxed mb-4 space-y-1.5 ml-5 list-disc">
              <li>Iceland</li>
              <li>Australia</li>
              <li>New Zealand</li>
              <li>Fiji</li>
              <li>Hawaii (US state)</li>
              <li>Guam (US territory)</li>
            </ul>

            <p className="font-serif text-stone-700 leading-relaxed mb-4">
              Even from designated countries you still need: ISO microchip, government export health certificate, AQS Advance Notification ≥40 days before arrival, and approved-airport arrival.
            </p>

            <p className="font-serif text-stone-700 leading-relaxed">
              <strong>The US mainland is non-designated</strong> (because rabies exists in wildlife on the mainland). Hawaii and Guam being designated means a pet flown from Hawaii to Japan skips the titer — but a pet from California doesn't.
            </p>
          </section>

          {/* CTA */}
          <div className="bg-stone-900 text-stone-100 rounded-sm p-8 text-center mt-12">
            <h2 className="font-serif text-2xl text-stone-50 mb-3">Map your Japan journey</h2>
            <p className="font-serif text-stone-300 leading-relaxed mb-6">
              Use the journey planner to map your specific origin to Japan — with the right cabin airline, connection, and a checklist matched to your route.
            </p>
            <Link
              href="/?go=planner"
              className="inline-block bg-amber-600 text-white px-6 py-3 text-sm uppercase tracking-widest font-medium hover:bg-amber-500 transition-colors"
            >
              Open the journey planner
            </Link>
          </div>

          <p className="font-sans text-xs text-stone-400 leading-relaxed mt-12 text-center">
            Verified against MAFF (Japan Ministry of Agriculture, Forestry and Fisheries), AQS, USDA APHIS, JAL, ANA, United, Korean Air, T'Way, and Aeromexico published policies as of May 2026. The Japan import process is unforgiving — always verify the latest specifics with AQS at your intended entry port before travel.
          </p>
          {/* Related guides — cross-links to other country/topic pages */}
          <div className="mt-16 pt-10 border-t border-stone-300">
            <div className="text-xs uppercase tracking-[0.25em] text-amber-700 mb-2">Related guides</div>
            <h2 className="font-serif text-2xl text-stone-900 mb-6">More from the pets-in-cabin guide</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <Link href="/seattle-pet-travel" className="block bg-stone-50 border border-stone-200 hover:border-amber-300 transition-colors p-4 rounded-sm">
                <div className="font-serif text-base text-stone-900 mb-1">Seattle / US Pacific NW guide →</div>
                <div className="text-xs text-stone-600 leading-relaxed">United's US west coast → Japan cabin routes start here.</div>
              </Link>

              <Link href="/iceland-pet-travel" className="block bg-stone-50 border border-stone-200 hover:border-amber-300 transition-colors p-4 rounded-sm">
                <div className="font-serif text-base text-stone-900 mb-1">Iceland guide →</div>
                <div className="text-xs text-stone-600 leading-relaxed">Another country with strict titer + quarantine rules to compare.</div>
              </Link>

              <Link href="/india-pet-travel" className="block bg-stone-50 border border-stone-200 hover:border-amber-300 transition-colors p-4 rounded-sm">
                <div className="font-serif text-base text-stone-900 mb-1">India guide →</div>
                <div className="text-xs text-stone-600 leading-relaxed">Indian residents flying to Japan often need a European hub for cabin.</div>
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
