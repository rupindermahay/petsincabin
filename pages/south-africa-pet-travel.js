import Head from "next/head";
import Link from "next/link";

export default function SouthAfricaPetTravel() {
  return (
    <>
      <Head>
        <title>Flying with a Pet to/from South Africa (2026): Complete Guide | Pets in Cabin</title>
        <meta
          name="description"
          content="Every pet entering or leaving South Africa internationally travels as manifested cargo — no cabin option on any airline. Inside the country, Lift carries small dogs in the cabin domestically. Plus the State Vet import permit, the new Animal Improvement permit for dogs, the microchip-then-vaccinate order, and when a rabies titre is (and isn't) needed. The complete, verified picture."
        />
        <link rel="canonical" href="https://www.petsincabin.com/south-africa-pet-travel" />
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
            Country guide · South Africa
          </div>

          <h1 className="font-serif text-4xl md:text-5xl leading-[1.05] text-stone-900 mb-6">
            Flying with a pet <span className="italic text-stone-600">to and from South Africa</span>.
          </h1>

          <div className="bg-white border border-stone-200 rounded-sm p-5 mb-8">
            <div className="text-xs uppercase tracking-widest text-stone-500 mb-3">In this guide</div>
            <div className="flex flex-wrap gap-2 text-sm">
              <a href="#the-short-answer" className="text-stone-700 hover:text-amber-700 underline decoration-stone-300 hover:decoration-amber-600 underline-offset-4">The short answer</a>
              <a href="#cargo" className="text-stone-700 hover:text-amber-700 underline decoration-stone-300 hover:decoration-amber-600 underline-offset-4">Cargo, not cabin</a>
              <a href="#into" className="text-stone-700 hover:text-amber-700 underline decoration-stone-300 hover:decoration-amber-600 underline-offset-4">Importing into SA</a>
              <a href="#dogs" className="text-stone-700 hover:text-amber-700 underline decoration-stone-300 hover:decoration-amber-600 underline-offset-4">The extra dog permit</a>
              <a href="#out" className="text-stone-700 hover:text-amber-700 underline decoration-stone-300 hover:decoration-amber-600 underline-offset-4">Leaving SA &amp; the titre</a>
              <a href="#agent" className="text-stone-700 hover:text-amber-700 underline decoration-stone-300 hover:decoration-amber-600 underline-offset-4">Relocation agents</a>
              <a href="#domestic" className="text-stone-700 hover:text-amber-700 underline decoration-stone-300 hover:decoration-amber-600 underline-offset-4">Cabin within SA</a>
            </div>
          </div>

          <p className="font-serif text-lg md:text-xl text-stone-700 leading-relaxed mb-8">
            For pet-cabin purposes, South Africa is an island. No airline carries pets in the cabin on international flights to or from the country — every pet entering or leaving travels as manifested cargo in a temperature- and pressure-controlled hold. The upside is that South Africa has one of the most experienced pet-relocation industries in the world, so the cargo route is well-trodden and the holds are properly climate-controlled. The work is in the paperwork: an import permit, a precise microchip-then-vaccinate order, and — for dogs since 2024 — a second permit most guides still don't mention.
          </p>

          <p className="font-serif text-lg md:text-xl text-stone-700 leading-relaxed mb-8">
            Inside the country it's a different story: the low-cost airline Lift carries small dogs in the cabin on select domestic routes. So your pet can fly in the cabin with you within South Africa — just never on the international leg.
          </p>

          <p className="font-serif italic text-stone-600 leading-relaxed mb-12">
            Verified against South Africa's Department of Agriculture (DALRRD) veterinary import procedures, USDA APHIS guidance, and South African pet-relocation specialists as of May 2026. Because international travel is cargo-only, exact crate specs, timings and costs vary by airline and route — confirm every detail with the airline's cargo division or a professional relocation agent before you commit to dates.
          </p>

          <div className="h-px bg-stone-300 mb-12" />

          {/* The short answer */}
          <section id="the-short-answer" className="mb-14 scroll-mt-24">
            <div className="text-xs uppercase tracking-[0.25em] text-amber-700 mb-3">01 · The short answer</div>
            <h2 className="font-serif text-2xl md:text-3xl text-stone-900 mb-3 leading-tight">
              Cargo internationally, permit-driven, well-trodden
            </h2>
            <p className="font-serif italic text-stone-600 text-lg mb-6 leading-snug">
              No international cabin option — but the cargo process is mature and the agents are excellent.
            </p>

            <p className="font-serif text-stone-700 leading-relaxed mb-4">
              Bringing a pet into South Africa means: an ISO microchip implanted before the rabies vaccination, a rabies vaccination given between 30 days and 12 months before travel, a State Veterinary import permit obtained in advance, a government-endorsed veterinary health certificate completed close to travel, and — for dogs — a separate Animal Improvement permit plus a panel of disease tests. The pet flies as manifested cargo with an airway bill; it cannot travel as cabin or excess baggage.
            </p>

            <p className="font-serif text-stone-700 leading-relaxed mb-4">
              Leaving South Africa is the mirror image: a State Vet health certificate plus whatever the destination country requires — and for the UK, EU or UAE that means a rabies antibody titre test, planned well ahead because of the waiting periods those destinations impose.
            </p>

            <p className="font-serif text-stone-700 leading-relaxed">
              This guide covers the cargo reality, the import paperwork, the extra dog permit, the export side and its titre, why an agent is worth it, and the domestic Lift cabin service inside the country.
            </p>
          </section>

          {/* Cargo, not cabin */}
          <section id="cargo" className="mb-14 scroll-mt-24">
            <div className="text-xs uppercase tracking-[0.25em] text-amber-700 mb-3">02 · Cargo, not cabin</div>
            <h2 className="font-serif text-2xl md:text-3xl text-stone-900 mb-3 leading-tight">
              Every international pet flies as manifested cargo
            </h2>
            <p className="font-serif italic text-stone-600 text-lg mb-6 leading-snug">
              Unlike the UK, there isn't even a ferry workaround — but the cargo route is genuinely well-established.
            </p>

            <p className="font-serif text-stone-700 leading-relaxed mb-4">
              No airline allows pets in the cabin on international flights to or from South Africa. South African Airways, Airlink and Lift carry pets only as checked baggage (domestic) or manifested cargo (international), and infrastructure rules at OR Tambo (Johannesburg) mean international SAA flights take pets as cargo only. Every international pet travels in a temperature- and pressure-controlled hold, in an IATA-compliant crate.
            </p>

            <p className="font-serif text-stone-700 leading-relaxed">
              The good news is the route is heavily used. Lufthansa Cargo runs pets via Frankfurt's Animal Lounge — widely regarded as the best pet-cargo facility in the world — and KLM Cargo, Qatar Cargo and Emirates SkyCargo all run regular pet cargo into Johannesburg (JNB) and Cape Town (CPT). Most owners use a relocation agent who handles the crate, booking and customs clearance end to end.
            </p>
          </section>

          {/* Importing into SA */}
          <section id="into" className="mb-14 scroll-mt-24">
            <div className="text-xs uppercase tracking-[0.25em] text-amber-700 mb-3">03 · Importing into South Africa</div>
            <h2 className="font-serif text-2xl md:text-3xl text-stone-900 mb-3 leading-tight">
              The permit, the microchip order, the health certificate
            </h2>
            <p className="font-serif italic text-stone-600 text-lg mb-6 leading-snug">
              South Africa is permit-driven — no pet enters legally without an approved import permit.
            </p>

            <p className="font-serif text-stone-700 leading-relaxed mb-4">
              The core document is the State Veterinary import permit, issued by South Africa's veterinary authority. Apply a few weeks ahead; the permit names your port of entry, and changing it later can mean delays or a permit amendment. The permit comes with a veterinary health certificate that your private vet completes — typically within 10 days of the flight — and that the exporting country's government veterinarian must endorse (a <Link href="/usda-endorsement-guide" className="text-amber-700 underline decoration-amber-300">USDA endorsement</Link> for pets from the US). The original is presented to the State Veterinarian who inspects your pet at the port of entry.
            </p>

            <div className="bg-amber-50 border-l-2 border-amber-400 p-4 mb-4">
              <p className="font-serif text-stone-700 leading-relaxed text-sm">
                <strong>Microchip first, then vaccinate.</strong> South Africa requires a 15-digit ISO-standard microchip (11784 / Annex A of 11785), and it must be implanted <em>before or at the same time</em> as the rabies vaccination. If the chip goes in afterwards, the vaccination can be treated as invalid for import. Tattoos are not accepted as identification. Every vaccination record must show the microchip number.
              </p>
            </div>

            <p className="font-serif text-stone-700 leading-relaxed mb-4">
              The rabies vaccination must fall in the 30-days-to-12-months window before travel. Pets coming from the UK, Australia and New Zealand are the usual exception to the rabies requirement, as recognised rabies-free origins — but because South Africa is itself rabies-controlled, vaccinating regardless is sensible.
            </p>

            <p className="font-serif text-stone-700 leading-relaxed">
              A common misconception: a rabies <em>titre</em> test is generally <strong>not</strong> required to enter South Africa. The titre is an <em>export</em> requirement for rabies-controlled destinations like the UK, EU and UAE — not an entry condition for South Africa itself. Don't let a generic checklist send you chasing a titre you don't need on the way in.
            </p>
          </section>

          {/* The extra dog permit */}
          <section id="dogs" className="mb-14 scroll-mt-24">
            <div className="text-xs uppercase tracking-[0.25em] text-amber-700 mb-3">04 · The extra dog permit</div>
            <h2 className="font-serif text-2xl md:text-3xl text-stone-900 mb-3 leading-tight">
              Dogs need a second permit — and disease tests
            </h2>
            <p className="font-serif italic text-stone-600 text-lg mb-6 leading-snug">
              This is the requirement most online guides still miss — and without it, dogs are refused entry.
            </p>

            <p className="font-serif text-stone-700 leading-relaxed mb-4">
              Since 1 April 2024, dogs entering South Africa need an <strong>Animal Improvement Compliance Permit</strong> in addition to the standard State Veterinary import permit. It's issued under the Animal Improvement Act, takes around 30 working days to process — so it has to be started before the main import permit application — and each permit can cover up to five dogs. Without it, dogs are denied entry. There is documentation to supply on the dog's breed, and conditions including spay/neuter status. Cats are not affected by this permit — their process is the simpler one.
            </p>

            <p className="font-serif text-stone-700 leading-relaxed">
              Dogs also face a disease-test panel that cats don't: within 30 days of export, dogs typically need to test free of conditions such as Brucella canis, Trypanosoma evansi, Babesia gibsoni, Dirofilaria immitis and Leishmania, unless the origin country is certified free of them. Snub-nosed and strong-jawed breeds may also face airline-level restrictions on the cargo leg. Build the dog requirements into your timeline first, because they're the long pole.
            </p>
          </section>

          {/* Leaving SA and the titre */}
          <section id="out" className="mb-14 scroll-mt-24">
            <div className="text-xs uppercase tracking-[0.25em] text-amber-700 mb-3">05 · Leaving South Africa</div>
            <h2 className="font-serif text-2xl md:text-3xl text-stone-900 mb-3 leading-tight">
              The titre is the export requirement to watch
            </h2>
            <p className="font-serif italic text-stone-600 text-lg mb-6 leading-snug">
              Going to the UK, EU or UAE? The rabies titre and its waiting period set your timeline.
            </p>

            <p className="font-serif text-stone-700 leading-relaxed mb-4">
              Leaving South Africa, the baseline is a State Vet health certificate plus whatever your destination requires. For rabies-controlled destinations — the UK, the EU, the UAE — that means a rabies antibody titre (RNATT / FAVN) from an approved lab, drawn at least 30 days after vaccination. The EU then imposes a three-month wait from a successful blood draw before travel; other destinations set their own windows. This is the step that turns a South African export into a multi-month project, so plan it first.
            </p>

            <p className="font-serif text-stone-700 leading-relaxed">
              Because the international leg is cargo regardless of direction, the export side is best handled by the same relocation agent who books the cargo — they time the titre against the destination's waiting period and make sure the State Vet certificate is issued in the right window. If you're heading to the UK specifically, our <Link href="/getting-your-pet-into-the-uk" className="text-amber-700 underline decoration-amber-300">getting your pet into the UK</Link> guide covers what waits at the other end.
            </p>
          </section>

          {/* Relocation agents */}
          <section id="agent" className="mb-14 scroll-mt-24">
            <div className="text-xs uppercase tracking-[0.25em] text-amber-700 mb-3">06 · Relocation agents</div>
            <h2 className="font-serif text-2xl md:text-3xl text-stone-900 mb-3 leading-tight">
              Use an agent — South Africa has great ones
            </h2>
            <p className="font-serif italic text-stone-600 text-lg mb-6 leading-snug">
              Because cargo is the only international option, the relocation industry here is mature and worth it.
            </p>

            <p className="font-serif text-stone-700 leading-relaxed mb-4">
              South Africa's pet-relocation agents do hundreds of international moves a year and know exactly what each destination needs. A good agent handles the IATA-compliant crate, the cargo booking, both permits, the State Vet paperwork, the rabies-titre timing for export, and customs clearance at both ends. For a cargo move — which is inherently more stressful than a cabin trip — this is money well spent, and it's the single biggest reduction in risk you can buy.
            </p>

            <p className="font-serif text-stone-700 leading-relaxed">
              When you brief an agent, confirm in writing that they're applying for <em>all</em> required permits — for a dog, that explicitly includes the Animal Improvement Compliance Permit, not just the basic import permit. The most common cause of a delayed move is a step done in the wrong order, and South Africa's rules are date-sensitive on exactly the points (microchip-before-vaccine, the dog permit lead time) where order matters most.
            </p>
          </section>

          {/* Cabin within SA */}
          <section id="domestic" className="mb-14 scroll-mt-24">
            <div className="text-xs uppercase tracking-[0.25em] text-amber-700 mb-3">07 · Cabin within South Africa</div>
            <h2 className="font-serif text-2xl md:text-3xl text-stone-900 mb-3 leading-tight">
              Lift carries small dogs in the cabin — domestically
            </h2>
            <p className="font-serif italic text-stone-600 text-lg mb-6 leading-snug">
              Your pet can be in the cabin with you — but only on domestic Lift flights, never international.
            </p>

            <p className="font-serif text-stone-700 leading-relaxed mb-4">
              For travel <em>within</em> South Africa, the low-cost airline Lift accepts small dogs — under 7 kg — in the cabin on select dog-friendly flights. It's window seats only, a limited number of dogs per flight, a pet-friendly carrier required, and you complete Lift's Dog-in-Cabin request form 7 or more days ahead. No cats. The busiest route is Johannesburg ↔ Cape Town, with Durban and George also served.
            </p>

            <p className="font-serif text-stone-700 leading-relaxed mb-4">
              For dogs over 7 kg, for cats, or on other domestic routes, the options are FlySafair's climate-controlled PetLounge cargo service, or SAA/Airlink checked baggage on domestic flights. So the cabin really is possible inside the country — just on Lift's dog-friendly flights specifically.
            </p>

            <p className="font-serif text-stone-700 leading-relaxed">
              None of this changes the international rule: in or out of South Africa, the international leg is always cargo. The Lift cabin service is useful for an onward domestic hop once your pet has cleared into the country.
            </p>
          </section>

          {/* CTA */}
          <div className="bg-stone-900 text-stone-100 rounded-sm p-8 text-center mt-12">
            <h2 className="font-serif text-2xl text-stone-50 mb-3">Map your South Africa journey</h2>
            <p className="font-serif text-stone-300 leading-relaxed mb-6">
              Use the journey planner to map your specific origin to South Africa — with the cargo reality spelled out, the domestic Lift cabin legs where they run, and a checklist matched to your route.
            </p>
            <Link
              href="/?go=planner"
              className="inline-block bg-amber-600 text-white px-6 py-3 text-sm uppercase tracking-widest font-medium hover:bg-amber-500 transition-colors"
            >
              Open the journey planner
            </Link>
          </div>

          <p className="font-sans text-xs text-stone-400 leading-relaxed mt-12 text-center">
            Verified against South Africa's Department of Agriculture (DALRRD) veterinary import procedures, USDA APHIS guidance and South African pet-relocation specialists as of May 2026. Because international pet travel to and from South Africa is cargo-only, exact crate specs, booking processes, timings and costs vary by airline and route — and permit requirements (including the Animal Improvement permit for dogs) change. Always confirm the latest specifics with the State Veterinary authority, the airline's cargo division, or a professional relocation agent before travel.
          </p>

          {/* Related guides — cross-links to other country/topic pages */}
          <div className="mt-16 pt-10 border-t border-stone-300">
            <div className="text-xs uppercase tracking-[0.25em] text-amber-700 mb-2">Related guides</div>
            <h2 className="font-serif text-2xl text-stone-900 mb-6">More from the pets-in-cabin guide</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <Link href="/australia-pet-travel" className="block bg-stone-50 border border-stone-200 hover:border-amber-300 transition-colors p-4 rounded-sm">
                <div className="font-serif text-base text-stone-900 mb-1">Australia guide →</div>
                <div className="text-xs text-stone-600 leading-relaxed">The other cargo-only-on-arrival country — plus its quarantine.</div>
              </Link>

              <Link href="/uae-pet-travel" className="block bg-stone-50 border border-stone-200 hover:border-amber-300 transition-colors p-4 rounded-sm">
                <div className="font-serif text-base text-stone-900 mb-1">UAE guide →</div>
                <div className="text-xs text-stone-600 leading-relaxed">Another strict-import destination — permit, titre and banned breeds.</div>
              </Link>

              <Link href="/getting-your-pet-into-the-uk" className="block bg-stone-50 border border-stone-200 hover:border-amber-300 transition-colors p-4 rounded-sm">
                <div className="font-serif text-base text-stone-900 mb-1">Into the UK →</div>
                <div className="text-xs text-stone-600 leading-relaxed">A common destination from SA — what waits at the other end.</div>
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
