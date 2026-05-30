import Head from "next/head";
import Link from "next/link";

export default function OsloPetTravel() {
  return (
    <>
      <Head>
        <title>Flying with a Pet to/from Oslo, Norway (2026): Complete Guide | Pets in Cabin</title>
        <meta
          name="description"
          content="Bringing a dog or cat to Norway, or flying out of Oslo with a pet? The full picture — SAS and Norwegian cabin pet rules, Norway's tapeworm requirement, banned dog breeds, Storskog and Oslo-only entry, and EEA paperwork."
        />
        <link rel="canonical" href="https://www.petsincabin.com/oslo-pet-travel" />
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
            Country guide · Norway
          </div>

          <h1 className="font-serif text-4xl md:text-5xl leading-[1.05] text-stone-900 mb-6">
            Flying with a pet <span className="italic text-stone-600">to and from Oslo, Norway</span>.
          </h1>

          <p className="font-serif text-lg md:text-xl text-stone-700 leading-relaxed mb-8">
            Norway has a generous cabin pet airline ecosystem and follows the EU pet passport system — but it adds two real complications. Dogs need a tapeworm treatment in a precise time window before arrival, and seven dog breeds are banned outright. Plus pets can only enter via Oslo Airport (OSL) or one land border in the north. Get the timing right and the rest is straightforward.
          </p>

          <p className="font-serif italic text-stone-600 leading-relaxed mb-12">
            Verified against the Norwegian Food Safety Authority (Mattilsynet), SAS, Norwegian, and EU pet movement rules as of May 2026.
          </p>

          <div className="bg-white border border-stone-200 rounded-sm p-5 mb-12">
            <div className="text-xs uppercase tracking-widest text-stone-500 mb-3">In this guide</div>
            <div className="flex flex-wrap gap-2 text-sm">
              <a href="#cabin-airlines" className="text-stone-700 hover:text-amber-700 underline decoration-stone-300 hover:decoration-amber-600 underline-offset-4">Cabin airlines from Oslo</a>
              <a href="#tapeworm" className="text-stone-700 hover:text-amber-700 underline decoration-stone-300 hover:decoration-amber-600 underline-offset-4">The tapeworm requirement</a>
              <a href="#banned-breeds" className="text-stone-700 hover:text-amber-700 underline decoration-stone-300 hover:decoration-amber-600 underline-offset-4">Banned breeds</a>
              <a href="#entry-ports" className="text-stone-700 hover:text-amber-700 underline decoration-stone-300 hover:decoration-amber-600 underline-offset-4">Pet entry ports</a>
              <a href="#paperwork" className="text-stone-700 hover:text-amber-700 underline decoration-stone-300 hover:decoration-amber-600 underline-offset-4">Paperwork</a>
              <a href="#third-country" className="text-stone-700 hover:text-amber-700 underline decoration-stone-300 hover:decoration-amber-600 underline-offset-4">From outside the EU/EEA</a>
              <a href="#norway-to-us-uk" className="text-stone-700 hover:text-amber-700 underline decoration-stone-300 hover:decoration-amber-600 underline-offset-4">Oslo to US, UK, India</a>
            </div>
          </div>

          <div className="h-px bg-stone-300 mb-12" />

          {/* Cabin airlines */}
          <section id="cabin-airlines" className="mb-14 scroll-mt-24">
            <div className="text-xs uppercase tracking-[0.25em] text-amber-700 mb-3">01 · Cabin airlines</div>
            <h2 className="font-serif text-2xl md:text-3xl text-stone-900 mb-3 leading-tight">
              Oslo has one of Europe's strongest cabin pet networks
            </h2>
            <p className="font-serif italic text-stone-600 text-lg mb-6 leading-snug">
              Three reliable cabin airlines work directly from OSL, plus the major European hubs.
            </p>

            <div className="space-y-5">
              <div>
                <h3 className="font-serif text-lg text-stone-900 mb-1.5">SAS Scandinavian Airlines</h3>
                <p className="font-serif text-stone-700 leading-relaxed">
                  Oslo is one of SAS's three hubs (with Copenhagen and Stockholm). Cabin pets are accepted on flights to 25+ countries including the US (direct EWR), China, Japan, Morocco, Turkey, and across Europe. Weight limit 8 kg combined; carrier 40 × 25 × 23 cm. Fees €55 domestic, €70–149 international. Book at least 24 hours ahead — space is limited.
                </p>
              </div>
              <div>
                <h3 className="font-serif text-lg text-stone-900 mb-1.5">Norwegian Air Shuttle</h3>
                <p className="font-serif text-stone-700 leading-relaxed">
                  Cabin pets within Schengen and EU only — no transatlantic, no UK. 8 kg combined limit; Sherpa-style soft carrier max 43 × 31 × 20 cm. Fees €55–75 online, €60–85 at airport. Three small puppies or kittens can share one carrier if the weight limit holds. Note: Norse Atlantic (the long-haul subsidiary) does NOT carry pets.
                </p>
              </div>
              <div>
                <h3 className="font-serif text-lg text-stone-900 mb-1.5">KLM, Air France, Lufthansa</h3>
                <p className="font-serif text-stone-700 leading-relaxed">
                  All three serve Oslo with cabin pet routes onward to their European hubs (AMS, CDG, FRA), and from there to most of the world. 8 kg combined limit across all three. Useful for India (FRA, AMS, CDG), Asia, and US routes that SAS doesn't fly.
                </p>
              </div>
            </div>
          </section>

          {/* Tapeworm */}
          <section id="tapeworm" className="mb-14 scroll-mt-24">
            <div className="text-xs uppercase tracking-[0.25em] text-amber-700 mb-3">02 · Tapeworm treatment</div>
            <h2 className="font-serif text-2xl md:text-3xl text-stone-900 mb-3 leading-tight">
              Dogs need Echinococcus treatment 24–120 hours before arrival
            </h2>
            <p className="font-serif italic text-stone-600 text-lg mb-6 leading-snug">
              Get the timing wrong, and the fine starts at NOK 7,000 plus a 24-hour quarantine.
            </p>

            <p className="font-serif text-stone-700 leading-relaxed mb-4">
              All dogs entering Norway must be treated for the fox tapeworm (Echinococcus multilocularis) by a licensed vet between 24 hours and 120 hours (1–5 days) before arrival. Active ingredient must be praziquantel. Treatment date and exact time must be recorded by the vet in your pet passport or EU Health Certificate.
            </p>

            <p className="font-serif text-stone-700 leading-relaxed mb-4">
              <strong>Exemption:</strong> dogs travelling directly from Finland, Malta, or Ireland skip this requirement — those three countries are already Echinococcus-free under the same EU framework. Coming via a layover doesn't count; it must be a direct flight from one of those origin countries.
            </p>

            <p className="font-serif text-stone-700 leading-relaxed mb-4">
              <strong>Cats and ferrets are exempt</strong> — the tapeworm rule is dog-only.
            </p>

            <p className="font-serif text-stone-700 leading-relaxed">
              If you skip the treatment, the minimum penalty is NOK 7,000 (about £550 / $650) and the dog is taken into a 24-hour quarantine at the owner's expense while the treatment is administered properly.
            </p>
          </section>

          {/* Banned breeds */}
          <section id="banned-breeds" className="mb-14 scroll-mt-24">
            <div className="text-xs uppercase tracking-[0.25em] text-amber-700 mb-3">03 · Banned breeds</div>
            <h2 className="font-serif text-2xl md:text-3xl text-stone-900 mb-3 leading-tight">
              Seven dog breeds are banned outright
            </h2>
            <p className="font-serif italic text-stone-600 text-lg mb-6 leading-snug">
              Pure-bred and mixed-breed. If your dog looks like one of these, plan ahead.
            </p>

            <p className="font-serif text-stone-700 leading-relaxed mb-4">Norway's banned-breed list:</p>

            <ul className="font-serif text-stone-700 leading-relaxed mb-4 space-y-1.5 ml-5 list-disc">
              <li>Pit Bull Terrier</li>
              <li>American Staffordshire Terrier</li>
              <li>Fila Brasileiro</li>
              <li>Tosa Inu</li>
              <li>Dogo Argentino</li>
              <li>Czechoslovakian Wolfdog</li>
              <li>All wolf-dog hybrids (any percentage)</li>
            </ul>

            <p className="font-serif text-stone-700 leading-relaxed mb-4">
              The ban applies to pure-bred and mixed-breed dogs that resemble these breeds. If your dog looks similar (e.g. a Staffordshire Bull Terrier mix that could be mistaken for an Am Staff), Norwegian authorities may require documentation proving otherwise — pedigree papers, DNA testing, vet certification.
            </p>

            <p className="font-serif text-stone-700 leading-relaxed">
              Check with the Norwegian Food Safety Authority (Mattilsynet) before booking if there's any doubt. Banned dogs at the border can be denied entry, returned, or in severe cases destroyed — the owner is financially liable.
            </p>
          </section>

          {/* Entry ports */}
          <section id="entry-ports" className="mb-14 scroll-mt-24">
            <div className="text-xs uppercase tracking-[0.25em] text-amber-700 mb-3">04 · Pet entry ports</div>
            <h2 className="font-serif text-2xl md:text-3xl text-stone-900 mb-3 leading-tight">
              Pets enter Norway only at Oslo or Storskog
            </h2>
            <p className="font-serif italic text-stone-600 text-lg mb-6 leading-snug">
              Just two approved pet entry points — pick your flight accordingly.
            </p>

            <p className="font-serif text-stone-700 leading-relaxed mb-4">
              Norway has just two official animal entry points:
            </p>

            <ul className="font-serif text-stone-700 leading-relaxed mb-4 space-y-2 ml-5 list-disc">
              <li><strong>Oslo Airport (OSL) Gardermoen</strong> — the only airport approved for pet entry. SAS hub, full pet check-in support. Norway's main international gateway.</li>
              <li><strong>Storskog</strong> — a land border crossing in northern Norway near the Russian frontier. Relevant if you're driving in from the east.</li>
            </ul>

            <p className="font-serif text-stone-700 leading-relaxed mb-4">
              Other airports — Bergen, Stavanger, Trondheim, Tromsø — do not have customs pet entry facilities. If your flight lands somewhere other than OSL, your pet will be refused entry. Even connecting through OSL on the way to a domestic Norwegian destination is fine, as long as you clear customs at OSL.
            </p>

            <p className="font-serif text-stone-700 leading-relaxed">
              On arrival at Oslo Gardermoen, follow the <strong>red customs channel</strong> with your pet — do not go through the green/nothing-to-declare channel even if your documents are perfect. Present the pet and the documents to Norwegian Customs.
            </p>
          </section>

          {/* Paperwork */}
          <section id="paperwork" className="mb-14 scroll-mt-24">
            <div className="text-xs uppercase tracking-[0.25em] text-amber-700 mb-3">05 · Paperwork</div>
            <h2 className="font-serif text-2xl md:text-3xl text-stone-900 mb-3 leading-tight">
              Standard EU pet passport baseline plus the tapeworm record
            </h2>
            <p className="font-serif italic text-stone-600 text-lg mb-6 leading-snug">
              Norway is in the EEA, not the EU, but the documentation is essentially the same.
            </p>

            <p className="font-serif text-stone-700 leading-relaxed mb-4">
              Required for all pet entries to Norway:
            </p>

            <ul className="font-serif text-stone-700 leading-relaxed mb-4 space-y-2 ml-5 list-disc">
              <li><strong>ISO 11784/11785 microchip</strong> — implanted before the first rabies vaccine. Tattoos accepted only if applied before 3 July 2011 with continuous rabies vaccine records since.</li>
              <li><strong>Rabies vaccine</strong> — pet must be at least 12 weeks old when first vaccinated. At least 21 days must pass between vaccination and entry.</li>
              <li><strong>EU pet passport</strong> (if you're an EU/EEA resident) OR <strong>EU Health Certificate for Norway</strong> (from elsewhere) — issued by your origin country vet within 10 days of travel.</li>
              <li><strong>Tapeworm treatment record</strong> — dogs only, 24–120 hours before arrival, with vet signature, date, time, and praziquantel as active ingredient.</li>
            </ul>

            <p className="font-serif text-stone-700 leading-relaxed">
              <strong>Norway↔Sweden exception:</strong> pets travelling specifically between Norway and Sweden don't need a rabies vaccine. This is a special bilateral arrangement and doesn't extend to other countries — even Denmark or Finland.
            </p>
          </section>

          {/* Third-country origin */}
          <section id="third-country" className="mb-14 scroll-mt-24">
            <div className="text-xs uppercase tracking-[0.25em] text-amber-700 mb-3">06 · From outside the EU/EEA</div>
            <h2 className="font-serif text-2xl md:text-3xl text-stone-900 mb-3 leading-tight">
              Rabies titer test + 3-month wait
            </h2>
            <p className="font-serif italic text-stone-600 text-lg mb-6 leading-snug">
              This adds months to your timeline — plan ahead.
            </p>

            <p className="font-serif text-stone-700 leading-relaxed mb-4">
              If you're bringing your pet to Norway from a country that's not on the EU "listed third countries" list (i.e. anywhere outside EU/EEA/US/Canada/UK/Switzerland/Japan/Australia/New Zealand and a few others), you need a rabies antibody titer test (RNATT / FAVN) from an EU-approved lab.
            </p>

            <p className="font-serif text-stone-700 leading-relaxed mb-4">
              The titer test must show antibody level ≥0.5 IU/ml. Blood is drawn at least 30 days after the rabies vaccine. Once you have a passing result, there's a mandatory 3-month wait before your pet can enter Norway.
            </p>

            <p className="font-serif text-stone-700 leading-relaxed">
              <strong>Good news:</strong> once you have a passing titer, it's valid for the rest of the pet's life as long as the rabies vaccination stays continuously current (no lapses, even by a day). You don't have to repeat the titer for future trips.
            </p>
          </section>

          {/* Norway to US, UK, India */}
          <section id="norway-to-us-uk" className="mb-14 scroll-mt-24">
            <div className="text-xs uppercase tracking-[0.25em] text-amber-700 mb-3">07 · Oslo to the world</div>
            <h2 className="font-serif text-2xl md:text-3xl text-stone-900 mb-3 leading-tight">
              Flying out of Oslo with a pet
            </h2>
            <p className="font-serif italic text-stone-600 text-lg mb-6 leading-snug">
              SAS gives Oslo a remarkably wide cabin pet reach.
            </p>

            <div className="space-y-5">
              <div>
                <h3 className="font-serif text-lg text-stone-900 mb-1.5">Oslo → USA</h3>
                <p className="font-serif text-stone-700 leading-relaxed">
                  SAS flies a direct cabin pet route from OSL to Newark (EWR), about 8 hours. From Newark, connect to anywhere in the US on Alaska, Delta, United, or American (note American does NOT do cabin transatlantic). Required paperwork: CDC Dog Import Form (Norway is NOT on the high-risk list, so the standard form is enough).
                </p>
              </div>
              <div>
                <h3 className="font-serif text-lg text-stone-900 mb-1.5">Oslo → UK</h3>
                <p className="font-serif text-stone-700 leading-relaxed">
                  No cabin pet flights to the UK from anywhere — UK government embargo. Fly cabin from Oslo to a mainland EU hub (Paris CDG via SAS or Norwegian, Amsterdam via KLM/SAS, Frankfurt via Lufthansa/SAS), then cross by Eurotunnel Le Shuttle (Calais → Folkestone) or a UK-government-approved ferry (DFDS Amsterdam IJmuiden → Newcastle is a useful direct option from the Netherlands). See the <Link href="/uk-pet-travel" className="text-amber-700 underline decoration-amber-300">UK pet travel guide</Link> for the full route.
                </p>
              </div>
              <div>
                <h3 className="font-serif text-lg text-stone-900 mb-1.5">Oslo → India</h3>
                <p className="font-serif text-stone-700 leading-relaxed">
                  Two cabin options. Via Frankfurt: SAS or Lufthansa OSL→FRA, then Lufthansa to DEL/BOM/MAA/CCU/HYD (note Lufthansa excludes Bangalore from cabin). Via Paris or Amsterdam: SAS or Air France/KLM, then Air France direct to DEL/BOM or KLM onward. India's AQCS No Objection Certificate is required. See the <Link href="/india-pet-travel" className="text-amber-700 underline decoration-amber-300">India pet travel guide</Link>.
                </p>
              </div>
              <div>
                <h3 className="font-serif text-lg text-stone-900 mb-1.5">Oslo → Japan</h3>
                <p className="font-serif text-stone-700 leading-relaxed">
                  SAS flies a direct cabin pet route OSL→NRT (Tokyo Narita), about 11.5 hours. Japan has the strictest pet import process in the world — 180-day waiting period after a passing rabies titer, 40-day advance notification to Japan's Animal Quarantine Service. Start preparation 7 months before travel.
                </p>
              </div>
            </div>
          </section>

          {/* CTA */}
          <div className="bg-stone-900 text-stone-100 rounded-sm p-8 text-center mt-12">
            <h2 className="font-serif text-2xl text-stone-50 mb-3">Map your Norway journey</h2>
            <p className="font-serif text-stone-300 leading-relaxed mb-6">
              Use the journey planner to pick exact origin and destination airports and get a checklist tailored to every country your pet touches.
            </p>
            <Link
              href="/?go=planner"
              className="inline-block bg-amber-600 text-white px-6 py-3 text-sm uppercase tracking-widest font-medium hover:bg-amber-500 transition-colors"
            >
              Open the journey planner
            </Link>
          </div>

          <p className="font-sans text-xs text-stone-400 leading-relaxed mt-12 text-center">
            Verified against the Norwegian Food Safety Authority (Mattilsynet), SAS, Norwegian Air Shuttle, and EU pet movement regulations as of May 2026. Rules change — always confirm specifics before travel.
          </p>
          {/* Related guides — cross-links to other country/topic pages */}
          <div className="mt-16 pt-10 border-t border-stone-300">
            <div className="text-xs uppercase tracking-[0.25em] text-amber-700 mb-2">Related guides</div>
            <h2 className="font-serif text-2xl text-stone-900 mb-6">More from the pets-in-cabin guide</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <Link href="/iceland-pet-travel" className="block bg-stone-50 border border-stone-200 hover:border-amber-300 transition-colors p-4 rounded-sm">
                <div className="font-serif text-base text-stone-900 mb-1">Iceland guide →</div>
                <div className="text-xs text-stone-600 leading-relaxed">Nordic neighbour but a much stricter import regime — useful contrast.</div>
              </Link>

              <Link href="/uk-pet-travel" className="block bg-stone-50 border border-stone-200 hover:border-amber-300 transition-colors p-4 rounded-sm">
                <div className="font-serif text-base text-stone-900 mb-1">UK guide →</div>
                <div className="text-xs text-stone-600 leading-relaxed">Norway's tapeworm and breed rules closely mirror the UK's.</div>
              </Link>

              <Link href="/travel-day-with-a-pet" className="block bg-stone-50 border border-stone-200 hover:border-amber-300 transition-colors p-4 rounded-sm">
                <div className="font-serif text-base text-stone-900 mb-1">Travel day guide guide →</div>
                <div className="text-xs text-stone-600 leading-relaxed">What the actual airport day looks like with a pet.</div>
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
