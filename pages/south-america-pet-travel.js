import Head from "next/head";
import Link from "next/link";

export default function SouthAmericaPetTravel() {
  return (
    <>
      <Head>
        <title>Flying with a Pet to/from South America (2026): Complete Guide | Pets in Cabin</title>
        <meta
          name="description"
          content="South America has two great cabin pet airlines (LATAM and Avianca) and five mostly-easy countries to enter — once you know each country's paperwork. Brazil, Argentina, Chile, Peru, Colombia rules explained, plus banned breeds, brachycephalic policies, and routing strategies."
        />
        <link rel="canonical" href="https://www.petsincabin.com/south-america-pet-travel" />
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
            Region guide · South America
          </div>

          <h1 className="font-serif text-4xl md:text-5xl leading-[1.05] text-stone-900 mb-6">
            Flying with a pet <span className="italic text-stone-600">to and from South America</span>.
          </h1>

          <p className="font-serif text-lg md:text-xl text-stone-700 leading-relaxed mb-8">
            South America is genuinely one of the easier continents to fly cabin pets to and from. LATAM and Avianca both have strong cabin networks. Brazil's import rules are some of the most lenient in the world. The catch: each country has its own paperwork, Colombia bans specific breeds by law, and the cabin weight limits cap out at 10 kg. Here's what you actually need to know.
          </p>

          <p className="font-serif italic text-stone-600 leading-relaxed mb-12">
            Verified against LATAM, Avianca, USDA APHIS, Brazil's MAPA, Argentina's SENASA, Chile's SAG, Peru's SENASA, and Colombia's ICA as of May 2026. Rules change — confirm with each country's authority before booking.
          </p>

          <div className="bg-white border border-stone-200 rounded-sm p-5 mb-12">
            <div className="text-xs uppercase tracking-widest text-stone-500 mb-3">In this guide</div>
            <div className="flex flex-wrap gap-2 text-sm">
              <a href="#airlines" className="text-stone-700 hover:text-amber-700 underline decoration-stone-300 hover:decoration-amber-600 underline-offset-4">Cabin airlines</a>
              <a href="#ranking" className="text-stone-700 hover:text-amber-700 underline decoration-stone-300 hover:decoration-amber-600 underline-offset-4">Easy vs hard countries</a>
              <a href="#brazil" className="text-stone-700 hover:text-amber-700 underline decoration-stone-300 hover:decoration-amber-600 underline-offset-4">Brazil</a>
              <a href="#argentina" className="text-stone-700 hover:text-amber-700 underline decoration-stone-300 hover:decoration-amber-600 underline-offset-4">Argentina</a>
              <a href="#chile" className="text-stone-700 hover:text-amber-700 underline decoration-stone-300 hover:decoration-amber-600 underline-offset-4">Chile</a>
              <a href="#peru" className="text-stone-700 hover:text-amber-700 underline decoration-stone-300 hover:decoration-amber-600 underline-offset-4">Peru</a>
              <a href="#colombia" className="text-stone-700 hover:text-amber-700 underline decoration-stone-300 hover:decoration-amber-600 underline-offset-4">Colombia</a>
              <a href="#breeds" className="text-stone-700 hover:text-amber-700 underline decoration-stone-300 hover:decoration-amber-600 underline-offset-4">Banned breeds &amp; brachys</a>
            </div>
          </div>

          <div className="h-px bg-stone-300 mb-12" />

          {/* Airlines */}
          <section id="airlines" className="mb-14 scroll-mt-24">
            <div className="text-xs uppercase tracking-[0.25em] text-amber-700 mb-3">01 · Cabin airlines</div>
            <h2 className="font-serif text-2xl md:text-3xl text-stone-900 mb-3 leading-tight">
              LATAM and Avianca are the cabin pet workhorses
            </h2>
            <p className="font-serif italic text-stone-600 text-lg mb-6 leading-snug">
              Plus a useful Mexico connector and several European long-haul cabin options.
            </p>

            <div className="space-y-5">
              <div>
                <h3 className="font-serif text-lg text-stone-900 mb-1.5">LATAM Airlines</h3>
                <p className="font-serif text-stone-700 leading-relaxed">
                  South America's largest cabin pet network. Hubs in Santiago (SCL), São Paulo (GRU), and Lima (LIM). Cabin weight 7-10 kg combined (varies by aircraft). Carrier max: soft 40×28×25 cm or hard 36×33×19 cm. Fee ~USD 200 international, BRL 200 (~$40) domestic Brazil. The critical rule: LATAM-operated flights only, no codeshares, no connections to other airlines. Book through their Contact Center, not online. Brachycephalic dogs welcome in cabin (banned from cargo). One pet per passenger.
                </p>
              </div>
              <div>
                <h3 className="font-serif text-lg text-stone-900 mb-1.5">Avianca</h3>
                <p className="font-serif text-stone-700 leading-relaxed">
                  Colombia-based, 10 kg combined cabin limit — the most generous in Latin America. Hub at Bogotá (BOG). Excellent for the northern half of South America plus Central America connections. Cabin NOT allowed to UK (cargo only), Galapagos (live animals prohibited), Aruba and Curaçao (except permanent moves). Carrier max 55×35×25 cm soft only. Fee ~USD 160 to North America, USD 180–200 to Europe. Brachycephalic dogs cabin-only.
                </p>
              </div>
              <div>
                <h3 className="font-serif text-lg text-stone-900 mb-1.5">Copa Airlines</h3>
                <p className="font-serif text-stone-700 leading-relaxed">
                  Often overlooked, but essential for deeper South America. Panama City (PTY) is Copa's hub, and Copa is the cabin pet route to Uruguay (Montevideo), Paraguay (Asunción), and Bolivia — countries with no direct US cabin connections. Cabin weight 10 kg combined, max carrier 45 × 27 × 27 cm soft-sided only. $125 international, $25 domestic. Network covers all of South America plus Central America, the Caribbean, Mexico, US, and Canada. Brachycephalic dogs accepted in cabin (never cargo).
                </p>
              </div>
              <div>
                <h3 className="font-serif text-lg text-stone-900 mb-1.5">Aeromexico</h3>
                <p className="font-serif text-stone-700 leading-relaxed">
                  Connects Mexico City to several South American capitals (Bogotá, Lima, San José within the 6-hour window; São Paulo, Buenos Aires and Santiago beyond it). Cabin pets are capped at 9 kg combined, and Aeromexico's own policy restricts cabin pets to flights of 6 hours or less — useful for the shorter pairs, but the longer pairs are blocked under the published rule. Aeromexico's example page does cite Mexico City–Paris as an exception, so call to confirm in writing before booking anything over 6 hours. Snub-nosed breeds are welcome in cabin.
                </p>
              </div>
              <div>
                <h3 className="font-serif text-lg text-stone-900 mb-1.5">Long-haul connections via Europe and US</h3>
                <p className="font-serif text-stone-700 leading-relaxed">
                  From Europe: Iberia (Madrid is the main hub), Air France (CDG), LATAM-operated long-haul (MAD, FRA, FCO, LIS). From the US: this is more limited than you might expect. American Airlines and Delta do NOT accept cabin pets to/from Brazil, Colombia, Argentina, Chile, Bolivia, Uruguay, or Venezuela — those are cargo-only (American PetEmbark). LATAM is the main cabin US-South America option, but as of May 2026 has suspended cabin service on US ↔ Brazil, Colombia, Peru, Bolivia, and Ecuador routes pending CDC dog-import rule updates. So for US→SA cabin in 2026, your realistic options narrow to: LATAM to Chile or Argentina (still active), or Avianca via Colombia connections (also affected by US-Colombia suspension on direct routes).
                </p>
              </div>
            </div>
          </section>

          {/* Easy vs hard ranking */}
          <section id="ranking" className="mb-14 scroll-mt-24">
            <div className="text-xs uppercase tracking-[0.25em] text-amber-700 mb-3">02 · Country ranking</div>
            <h2 className="font-serif text-2xl md:text-3xl text-stone-900 mb-3 leading-tight">
              From easiest to strictest
            </h2>
            <p className="font-serif italic text-stone-600 text-lg mb-6 leading-snug">
              Same continent, very different import bureaucracies.
            </p>

            <div className="space-y-3">
              <div className="bg-white border border-stone-200 rounded-sm p-5">
                <h3 className="font-serif text-lg text-stone-900 mb-1">1. Brazil 🇧🇷 — Easiest</h3>
                <p className="font-serif text-stone-700 leading-relaxed">
                  No microchip required. No titer. Just rabies vaccine 21+ days old, USDA-endorsed health certificate within 10 days, and a vet exam. No import permit. No quarantine.
                </p>
              </div>
              <div className="bg-white border border-stone-200 rounded-sm p-5">
                <h3 className="font-serif text-lg text-stone-900 mb-1">2. Argentina 🇦🇷 — Easy</h3>
                <p className="font-serif text-stone-700 leading-relaxed">
                  ISO microchip + rabies 30+ days + SENASA-endorsed health certificate. No pre-trip permit needed; SENASA inspection happens at EZE on arrival.
                </p>
              </div>
              <div className="bg-white border border-stone-200 rounded-sm p-5">
                <h3 className="font-serif text-lg text-stone-900 mb-1">3. Uruguay 🇺🇾 — Easy, but only via connection</h3>
                <p className="font-serif text-stone-700 leading-relaxed">
                  ISO microchip + rabies 30+ days + MGAP-recognised health certificate from origin country's official veterinary authority. No direct US cabin pet route to Montevideo (MVD) — connect via Copa (through Panama City), Avianca (through Bogotá), or LATAM (through São Paulo or Buenos Aires). The 1-hour Buenos Aires → Montevideo hop is the shortest cabin entry to Uruguay.
                </p>
              </div>
              <div className="bg-white border border-stone-200 rounded-sm p-5">
                <h3 className="font-serif text-lg text-stone-900 mb-1">4. Peru 🇵🇪 — Moderate</h3>
                <p className="font-serif text-stone-700 leading-relaxed">
                  ISO microchip + rabies 30+ days + SENASA import permit (apply 30+ days ahead) + health certificate from origin country's official authority.
                </p>
              </div>
              <div className="bg-white border border-stone-200 rounded-sm p-5">
                <h3 className="font-serif text-lg text-stone-900 mb-1">5. Colombia 🇨🇴 — Moderate but with breed bans</h3>
                <p className="font-serif text-stone-700 leading-relaxed">
                  Standard paperwork (microchip recommended, rabies 30+ days, health certificate). The complication: Pit Bull, American Staffordshire, and Staffordshire Bull Terrier imports are banned by law. ICA inspection on arrival.
                </p>
              </div>
              <div className="bg-white border border-stone-200 rounded-sm p-5">
                <h3 className="font-serif text-lg text-stone-900 mb-1">6. Chile 🇨🇱 — Strictest</h3>
                <p className="font-serif text-stone-700 leading-relaxed">
                  ISO microchip mandatory. Rabies 30+ days. SAG import permit MUST be pre-arranged 30+ days ahead. Without the permit, your pet is detained at SCL on arrival. SAG is rigorous about paperwork accuracy.
                </p>
              </div>
            </div>
          </section>

          {/* Brazil */}
          <section id="brazil" className="mb-14 scroll-mt-24">
            <div className="text-xs uppercase tracking-[0.25em] text-amber-700 mb-3">03 · Brazil 🇧🇷</div>
            <h2 className="font-serif text-2xl md:text-3xl text-stone-900 mb-3 leading-tight">
              Brazil is one of the most lenient countries in the world for pet imports
            </h2>
            <p className="font-serif italic text-stone-600 text-lg mb-6 leading-snug">
              The exception, not the rule, for South America. Easy paperwork, no quarantine, multiple entry airports.
            </p>

            <p className="font-serif text-stone-700 leading-relaxed mb-4">
              <strong>Required:</strong> rabies vaccine administered at least 21 days before travel (for pets over 3 months old); <Link href="/usda-endorsement-guide" className="text-amber-700 underline decoration-amber-300">USDA-endorsed Veterinary Health Certificate</Link> completed within 10 days of departure; vet examination confirming the pet is healthy; parasite treatment (internal and external) shortly before travel, recorded on the health certificate; additional vaccines depending on origin (Distemper, Hepatitis, Parvovirus, Leptospirosis for dogs; FVRCP for cats).
            </p>

            <p className="font-serif text-stone-700 leading-relaxed mb-4">
              <strong>NOT required:</strong> ISO microchip (though strongly recommended), rabies titer test, import permit, quarantine.
            </p>

            <p className="font-serif text-stone-700 leading-relaxed mb-4">
              <strong>Entry airports:</strong> São Paulo (GRU), Rio de Janeiro (GIG), Brasília (BSB), Porto Alegre (POA), plus other international airports with VIGIAGRO agriculture customs offices.
            </p>

            <p className="font-serif text-stone-700 leading-relaxed mb-4">
              <strong>On arrival:</strong> follow the customs route (Receita Federal) and agriculture inspection (MAPA/VIGIAGRO). Pets cleared on the spot if documents are in order — no quarantine.
            </p>

            <p className="font-serif text-stone-700 leading-relaxed">
              <strong>Local breed law:</strong> Rio de Janeiro requires Pit Bull-type dogs (and crosses) already in the city to be registered with proof of sterilization and vaccination. Federal law doesn't ban the breed at the import level.
            </p>
          </section>

          {/* Argentina */}
          <section id="argentina" className="mb-14 scroll-mt-24">
            <div className="text-xs uppercase tracking-[0.25em] text-amber-700 mb-3">04 · Argentina 🇦🇷</div>
            <h2 className="font-serif text-2xl md:text-3xl text-stone-900 mb-3 leading-tight">
              Argentina's process is straightforward but documentation matters
            </h2>
            <p className="font-serif italic text-stone-600 text-lg mb-6 leading-snug">
              SENASA's inspection at the airport is the gate — get the paperwork right and you're through in 30 minutes.
            </p>

            <p className="font-serif text-stone-700 leading-relaxed mb-4">
              <strong>Required:</strong> ISO 11784/11785 microchip implanted (before rabies vaccine if possible); rabies vaccine administered at least 30 days before travel and current; USDA or origin-country official veterinary health certificate within 10 days of travel; internal/external parasite treatment.
            </p>

            <p className="font-serif text-stone-700 leading-relaxed mb-4">
              <strong>Entry airports:</strong> Buenos Aires Ezeiza (EZE) is the main international gateway. Córdoba (COR) and Mendoza (MDZ) also receive international pets.
            </p>

            <p className="font-serif text-stone-700 leading-relaxed mb-4">
              <strong>On arrival:</strong> SENASA inspection at EZE — present all documents and your pet for examination. Typically 15–30 minutes if documents are in order. No quarantine.
            </p>

            <p className="font-serif text-stone-700 leading-relaxed">
              <strong>If you're an Argentine resident returning with your pet:</strong> additional documentation may simplify the process — SENASA recognises pets returning to their country of habitual residence.
            </p>
          </section>

          {/* Chile */}
          <section id="chile" className="mb-14 scroll-mt-24">
            <div className="text-xs uppercase tracking-[0.25em] text-amber-700 mb-3">05 · Chile 🇨🇱</div>
            <h2 className="font-serif text-2xl md:text-3xl text-stone-900 mb-3 leading-tight">
              Chile is the strictest — the SAG import permit is non-negotiable
            </h2>
            <p className="font-serif italic text-stone-600 text-lg mb-6 leading-snug">
              Show up without the pre-arranged paperwork and your pet will be detained at Santiago.
            </p>

            <p className="font-serif text-stone-700 leading-relaxed mb-4">
              <strong>Required:</strong> ISO 11784/11785 microchip implanted before rabies vaccine; rabies vaccine administered at least 30 days before travel; SAG (Servicio Agrícola y Ganadero) import permit pre-arranged at least 30 days ahead — this is the critical step; official veterinary health certificate from origin country within 10 days of travel; parasite treatments documented.
            </p>

            <p className="font-serif text-stone-700 leading-relaxed mb-4">
              <strong>How to get the SAG import permit:</strong> apply through Chile's SAG online portal. You'll need your pet's microchip number, rabies vaccine date and product details, intended arrival date and airport, and origin country. Permit is route- and date-specific.
            </p>

            <p className="font-serif text-stone-700 leading-relaxed mb-4">
              <strong>Entry airport:</strong> Santiago Arturo Merino Benítez (SCL) is the main international entry. SAG handles the inspection.
            </p>

            <p className="font-serif text-stone-700 leading-relaxed">
              <strong>The strict part:</strong> SAG officials verify every document against the permit. Discrepancies (a vaccine date that doesn't match, an incorrect microchip number, a missing parasite treatment record) can result in your pet being held until corrections are made. The penalty is at the owner's expense.
            </p>
          </section>

          {/* Peru */}
          <section id="peru" className="mb-14 scroll-mt-24">
            <div className="text-xs uppercase tracking-[0.25em] text-amber-700 mb-3">06 · Peru 🇵🇪</div>
            <h2 className="font-serif text-2xl md:text-3xl text-stone-900 mb-3 leading-tight">
              Peru sits in the middle — permit required, but the process is straightforward
            </h2>
            <p className="font-serif italic text-stone-600 text-lg mb-6 leading-snug">
              SENASA Peru issues the import permit; the paperwork load is between Brazil's and Chile's.
            </p>

            <p className="font-serif text-stone-700 leading-relaxed mb-4">
              <strong>Required:</strong> ISO microchip (strongly recommended, sometimes required depending on origin); rabies vaccine 30+ days old; SENASA import permit (apply at least 30 days ahead via SENASA Peru's online portal); official sanitary certificate from origin country's veterinary authority; vet examination within 10 days of travel.
            </p>

            <p className="font-serif text-stone-700 leading-relaxed mb-4">
              <strong>Entry airport:</strong> Lima Jorge Chávez (LIM) is the main international gateway. SENASA inspection on arrival.
            </p>

            <p className="font-serif text-stone-700 leading-relaxed">
              <strong>Returning:</strong> Peru-resident pets exporting need a SENASA export certificate. If your trip is less than 30 days, the same certificate may be reused on return — check with SENASA when applying.
            </p>
          </section>

          {/* Colombia */}
          <section id="colombia" className="mb-14 scroll-mt-24">
            <div className="text-xs uppercase tracking-[0.25em] text-amber-700 mb-3">07 · Colombia 🇨🇴</div>
            <h2 className="font-serif text-2xl md:text-3xl text-stone-900 mb-3 leading-tight">
              Colombia is straightforward for most breeds — but the breed bans are absolute
            </h2>
            <p className="font-serif italic text-stone-600 text-lg mb-6 leading-snug">
              Pit Bull–type dogs cannot be imported, period. The law (Article 108-E) trumps any airline's general policy.
            </p>

            <p className="font-serif text-stone-700 leading-relaxed mb-4">
              <strong>Required:</strong> ISO microchip recommended; rabies vaccine 30+ days old; health certificate from origin country's veterinary authority (USDA-endorsed for US origins, AHC for UK, EU vet for EU origins); parasite treatments documented.
            </p>

            <p className="font-serif text-stone-700 leading-relaxed mb-4">
              <strong>Banned by law (Article 108-E of Law 746 of 2002):</strong> Staffordshire Terrier, American Staffordshire Terrier, American Pit Bull Terrier, and any crosses or hybrids of these breeds. Imports of these breeds are prohibited even with perfect paperwork. Colombian-born dogs of these breeds can leave and return with a re-entry permit.
            </p>

            <p className="font-serif text-stone-700 leading-relaxed mb-4">
              <strong>Entry airport:</strong> Bogotá El Dorado (BOG) is the main international entry. ICA (Instituto Colombiano Agropecuario) handles inspections.
            </p>

            <p className="font-serif text-stone-700 leading-relaxed">
              <strong>If your dog looks like a banned breed but isn't:</strong> bring pedigree papers and ideally DNA test results. ICA inspectors can make discretionary calls on visual identification.
            </p>
          </section>

          {/* Breeds and brachys */}
          <section id="breeds" className="mb-14 scroll-mt-24">
            <div className="text-xs uppercase tracking-[0.25em] text-amber-700 mb-3">08 · Breeds &amp; brachycephalic</div>
            <h2 className="font-serif text-2xl md:text-3xl text-stone-900 mb-3 leading-tight">
              Brachycephalic and breed restrictions across the region
            </h2>
            <p className="font-serif italic text-stone-600 text-lg mb-6 leading-snug">
              Bulldogs, Pugs, and Frenchies have specific rules in South America. Plus the legal breed bans.
            </p>

            <p className="font-serif text-stone-700 leading-relaxed mb-4">
              <strong>Brachycephalic in cabin:</strong> LATAM and Avianca both allow brachycephalic dogs in cabin if they meet weight (10 kg combined max). Aeromexico is more generous (9 kg combined, snub-nosed welcome).
            </p>

            <p className="font-serif text-stone-700 leading-relaxed mb-4">
              <strong>Brachycephalic in cargo:</strong> NEVER on LATAM or Avianca. Both airlines explicitly ban snub-nosed breeds from the aircraft hold due to respiratory risk. If your French Bulldog or Pug is over 10 kg, your options become: charter flights (K9 Jets does not yet serve South America directly), professional pet relocation with a specialised cargo carrier, or driving where geographically possible.
            </p>

            <p className="font-serif text-stone-700 leading-relaxed mb-4">
              For the full brachycephalic playbook, see our <Link href="/flying-with-a-french-bulldog" className="text-amber-700 underline decoration-amber-300">French Bulldog flying guide</Link>.
            </p>

            <p className="font-serif text-stone-700 leading-relaxed mb-4">
              <strong>Legal breed bans summary:</strong>
            </p>

            <ul className="font-serif text-stone-700 leading-relaxed mb-4 space-y-1.5 ml-5 list-disc">
              <li><strong>Colombia (federal):</strong> Pit Bull, American Pit Bull Terrier, Staffordshire Terrier, American Staffordshire Terrier — banned from import.</li>
              <li><strong>Rio de Janeiro (city):</strong> Pit Bull-type dogs require special registration with sterilization and vaccination proof.</li>
              <li><strong>Brazil (federal):</strong> no banned breed list, but individual states/cities may have local rules.</li>
              <li><strong>Argentina, Chile, Peru (federal):</strong> no banned breed lists at the import level; airline-specific restrictions apply.</li>
            </ul>
          </section>

          {/* CTA */}
          <div className="bg-stone-900 text-stone-100 rounded-sm p-8 text-center mt-12">
            <h2 className="font-serif text-2xl text-stone-50 mb-3">Map your South America journey</h2>
            <p className="font-serif text-stone-300 leading-relaxed mb-6">
              Use the journey planner to pick exact origin and destination airports and get a country-specific checklist for the SA country your pet will enter.
            </p>
            <Link
              href="/?go=planner"
              className="inline-block bg-amber-600 text-white px-6 py-3 text-sm uppercase tracking-widest font-medium hover:bg-amber-500 transition-colors"
            >
              Open the journey planner
            </Link>
          </div>

          <p className="font-sans text-xs text-stone-400 leading-relaxed mt-12 text-center">
            Verified against LATAM Airlines, Avianca, USDA APHIS, Brazil MAPA/VIGIAGRO, Argentina SENASA, Chile SAG, Peru SENASA, and Colombia ICA published policies as of May 2026. Pet import rules change — always confirm specifics with the destination country's veterinary authority before booking, especially for Chile (permit timing) and Colombia (breed verification).
          </p>
          {/* Related guides — cross-links to other country/topic pages */}
          <div className="mt-16 pt-10 border-t border-stone-300">
            <div className="text-xs uppercase tracking-[0.25em] text-amber-700 mb-2">Related guides</div>
            <h2 className="font-serif text-2xl text-stone-900 mb-6">More from the pets-in-cabin guide</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <Link href="/central-america-pet-travel" className="block bg-stone-50 border border-stone-200 hover:border-amber-300 transition-colors p-4 rounded-sm">
                <div className="font-serif text-base text-stone-900 mb-1">Central America guide →</div>
                <div className="text-xs text-stone-600 leading-relaxed">Panama City is the cabin transit hub for Uruguay, Paraguay, Bolivia.</div>
              </Link>

              <Link href="/travel-day-with-a-pet" className="block bg-stone-50 border border-stone-200 hover:border-amber-300 transition-colors p-4 rounded-sm">
                <div className="font-serif text-base text-stone-900 mb-1">Travel day guide guide →</div>
                <div className="text-xs text-stone-600 leading-relaxed">LATAM/Avianca/Copa booking quirks on travel day.</div>
              </Link>

              <Link href="/japan-pet-travel" className="block bg-stone-50 border border-stone-200 hover:border-amber-300 transition-colors p-4 rounded-sm">
                <div className="font-serif text-base text-stone-900 mb-1">Japan guide →</div>
                <div className="text-xs text-stone-600 leading-relaxed">No direct cabin route from Latin America — route via US west coast on United instead.</div>
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
