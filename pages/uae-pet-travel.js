import Head from "next/head";
import Link from "next/link";

export default function UAEPetTravel() {
  return (
    <>
      <Head>
        <title>Flying with a Pet to/from the UAE (2026): Complete Guide | Pets in Cabin</title>
        <meta
          name="description"
          content="Bringing a dog or cat to the UAE — Dubai or Abu Dhabi — takes real planning. Cabin pets in via Abu Dhabi on Etihad (some routes excluded); cargo in via Dubai. Plus the MOCCAE import permit, ISO microchip, full vaccinations, and a rabies titer test from high-risk countries. The complete, verified picture, including the banned breeds list."
        />
        <link rel="canonical" href="https://www.petsincabin.com/uae-pet-travel" />
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
            Country guide · United Arab Emirates
          </div>

          <h1 className="font-serif text-4xl md:text-5xl leading-[1.05] text-stone-900 mb-6">
            Flying with a pet <span className="italic text-stone-600">to and from the UAE</span>.
          </h1>

          <div className="bg-white border border-stone-200 rounded-sm p-5 mb-8">
            <div className="text-xs uppercase tracking-widest text-stone-500 mb-3">In this guide</div>
            <div className="flex flex-wrap gap-2 text-sm">
              <a href="#the-short-answer" className="text-stone-700 hover:text-amber-700 underline decoration-stone-300 hover:decoration-amber-600 underline-offset-4">The short answer</a>
              <a href="#permit" className="text-stone-700 hover:text-amber-700 underline decoration-stone-300 hover:decoration-amber-600 underline-offset-4">The MOCCAE permit</a>
              <a href="#paperwork" className="text-stone-700 hover:text-amber-700 underline decoration-stone-300 hover:decoration-amber-600 underline-offset-4">Microchip &amp; vaccines</a>
              <a href="#cargo" className="text-stone-700 hover:text-amber-700 underline decoration-stone-300 hover:decoration-amber-600 underline-offset-4">Cabin or cargo</a>
              <a href="#breeds" className="text-stone-700 hover:text-amber-700 underline decoration-stone-300 hover:decoration-amber-600 underline-offset-4">Banned breeds</a>
              <a href="#arrival" className="text-stone-700 hover:text-amber-700 underline decoration-stone-300 hover:decoration-amber-600 underline-offset-4">Airports &amp; arrival</a>
            </div>
          </div>

          <p className="font-serif text-lg md:text-xl text-stone-700 leading-relaxed mb-8">
            The UAE is a strict-import destination, and the rules are particular. Pets entering Dubai (DXB) travel as manifested cargo on every airline — but pets entering Abu Dhabi (AUH) can travel in the cabin on Etihad from most origins (UK, US, Australia and a few other routes are excluded). The process also needs an import permit obtained in advance, a precise microchip-then-vaccinate sequence, and — from many countries — a rabies titer test. None of it is impossible, but it all needs planning.
          </p>

          <p className="font-serif italic text-stone-600 leading-relaxed mb-12">
            Verified against MOCCAE (the UAE Ministry of Climate Change and Environment) and USDA APHIS guidance as of May 2026. UAE rules change and some details vary by source — confirm directly with MOCCAE before booking.
          </p>

          <div className="h-px bg-stone-300 mb-12" />

          {/* The short answer */}
          <section id="the-short-answer" className="mb-14 scroll-mt-24">
            <div className="text-xs uppercase tracking-[0.25em] text-amber-700 mb-3">01 · The short answer</div>
            <h2 className="font-serif text-2xl md:text-3xl text-stone-900 mb-3 leading-tight">
              Possible — cabin via Abu Dhabi on Etihad, or cargo via Dubai
            </h2>
            <p className="font-serif italic text-stone-600 text-lg mb-6 leading-snug">
              The UAE is firmly in the strict-import camp on paperwork — but Etihad's cabin route into AUH means the cabin option is real for many travellers.
            </p>

            <p className="font-serif text-stone-700 leading-relaxed mb-4">
              Bringing a pet into the UAE means working through several requirements in the right order: an import permit from MOCCAE obtained before travel, an ISO-standard microchip, a rabies vaccination given after the microchip, full core vaccinations, and — from countries the UAE classes as high-risk for rabies — a rabies antibody titer test. The paperwork is the same whether the pet travels cabin or cargo.
            </p>

            <p className="font-serif text-stone-700 leading-relaxed">
              For the flight itself: Etihad is the only airline that carries cabin pets into the UAE, and only into Abu Dhabi (AUH), with weight up to 8 kg total including the carrier. Some origins are excluded (notably the UK, US, Australia, Hong Kong, Johannesburg). For excluded origins and for any entry via Dubai (DXB), pets travel as manifested cargo via Emirates SkyCargo or Etihad Cargo. The UAE also limits individuals to two pets per person per year, and bans a list of dog breeds outright. This guide walks through the permit, the microchip-and-vaccine sequence, the cabin-vs-cargo split, the banned-breed list, and what happens on arrival.
            </p>
          </section>

          {/* The MOCCAE permit */}
          <section id="permit" className="mb-14 scroll-mt-24">
            <div className="text-xs uppercase tracking-[0.25em] text-amber-700 mb-3">02 · The MOCCAE permit</div>
            <h2 className="font-serif text-2xl md:text-3xl text-stone-900 mb-3 leading-tight">
              An import permit, obtained before you travel
            </h2>
            <p className="font-serif italic text-stone-600 text-lg mb-6 leading-snug">
              No permit, no entry — and you cannot import on an expired one.
            </p>

            <p className="font-serif text-stone-700 leading-relaxed mb-4">
              Before your pet travels, you must obtain an import permit from MOCCAE — the Ministry of Climate Change and Environment — through its online services portal. You register an account, complete the e-form and pay the fee; the permit is then issued electronically. A pet cannot enter the UAE on an expired permit.
            </p>

            <div className="bg-amber-50 border-l-2 border-amber-400 p-4 mb-4">
              <p className="font-serif text-stone-700 leading-relaxed text-sm">
                <strong>One detail to confirm directly:</strong> sources disagree on how long the import permit is valid. MOCCAE's own service pages state 90 days; USDA APHIS and UAE press guidance state 30 days. Because the figure differs between official sources, treat this as something to verify on the MOCCAE portal at the time you apply — and build in a comfortable margin so the permit is still valid on your travel date.
              </p>
            </div>

            <p className="font-serif text-stone-700 leading-relaxed">
              Individuals may import a maximum of two companion animals per person per year — resident pets returning to the UAE are the exception. If your pet is transiting the UAE rather than entering it, a separate transit permit is required from MOCCAE, unless the connection is airside at the same airport.
            </p>
          </section>

          {/* Microchip and vaccines */}
          <section id="paperwork" className="mb-14 scroll-mt-24">
            <div className="text-xs uppercase tracking-[0.25em] text-amber-700 mb-3">03 · Microchip &amp; vaccines</div>
            <h2 className="font-serif text-2xl md:text-3xl text-stone-900 mb-3 leading-tight">
              The order matters: microchip first, then vaccinate
            </h2>
            <p className="font-serif italic text-stone-600 text-lg mb-6 leading-snug">
              Get the sequence wrong and the rabies vaccination is not accepted.
            </p>

            <p className="font-serif text-stone-700 leading-relaxed mb-4">
              The microchip comes first. The UAE requires an ISO-standard microchip (11784 / 11785), and its number must match every supporting document. The rabies vaccination must then be given <em>on or after</em> the microchipping date — a rabies shot given before the chip will not be accepted, and the pet would need re-vaccinating. After the rabies vaccination there is a 21-day waiting period before travel.
            </p>

            <p className="font-serif text-stone-700 leading-relaxed mb-4">
              Beyond rabies, the UAE requires full core vaccinations: for dogs, distemper, parvovirus, hepatitis and leptospirosis; for cats, the FVRCP combination (feline viral rhinotracheitis, calicivirus and panleukopenia). The pet must also have received internal and external parasite treatment within the 14 days before shipment, recorded on the health certificate or passport.
            </p>

            <p className="font-serif text-stone-700 leading-relaxed mb-4">
              From countries the UAE classifies as <strong>high-risk for rabies</strong>, a rabies antibody titer test (RSNT) is also required, completed within 90 days of travel. The minimum age for an imported pet is 12 weeks from low-risk countries and 15 weeks from high-risk countries.
            </p>

            <p className="font-serif text-stone-700 leading-relaxed">
              On arrival, port officials will want a valid health certificate from your country's veterinary authority — endorsed by the relevant government body, such as <Link href="/usda-endorsement-guide" className="text-amber-700 underline decoration-amber-300">USDA endorsement</Link> for pets from the US, and valid for a short window after issue — plus the vaccination record showing the microchip number, the pet's full description, and every vaccine's name, manufacturer, batch number and date.
            </p>
          </section>

          {/* Cabin vs cargo */}
          <section id="cargo" className="mb-14 scroll-mt-24">
            <div className="text-xs uppercase tracking-[0.25em] text-amber-700 mb-3">04 · Cabin via Abu Dhabi, cargo via Dubai</div>
            <h2 className="font-serif text-2xl md:text-3xl text-stone-900 mb-3 leading-tight">
              Etihad cabin to Abu Dhabi, or cargo to Dubai
            </h2>
            <p className="font-serif italic text-stone-600 text-lg mb-6 leading-snug">
              This is the rule that most changes how you plan the trip — but Etihad's cabin route into Abu Dhabi is the one exception.
            </p>

            <p className="font-serif text-stone-700 leading-relaxed mb-4">
              Under UAE government import rules, every imported cat or dog must clear MOCCAE (Ministry of Climate Change and Environment) inspection at the port of entry and the underlying paperwork (import permit, health certificate, microchip, rabies) is the same regardless of how the pet arrives. What that does NOT mean — and is widely mis-reported — is that pets cannot enter the UAE in cabin. They can, on one airline only.
            </p>

            <p className="font-serif text-stone-700 leading-relaxed mb-4">
              <strong>Etihad is the only airline that carries pets in cabin INTO the UAE, and only into Abu Dhabi (AUH).</strong> Pets (cat or dog) up to 8 kg total including the carrier, at least 16 weeks old, travel under the seat in Economy or Business. Some routes are excluded — Etihad does NOT allow cabin pets on flights from the UK, USA, Australia, Hong Kong, Johannesburg or several South and South-East Asian origins. Outside those exclusions, Etihad's cabin route works in both directions. AUH is roughly 90 minutes by road from Dubai.
            </p>

            <p className="font-serif text-stone-700 leading-relaxed mb-4">
              <strong>Dubai International (DXB) is cargo-only for pets on every airline.</strong> Emirates does not accept pets in cabin or as checked baggage to/from DXB at all — pets to Dubai travel as manifested cargo via Emirates SkyCargo (booked separately, usually through an IATA-registered pet shipper). For an actual cabin trip into the UAE, your route must be via AUH on Etihad.
            </p>

            <p className="font-serif text-stone-700 leading-relaxed">
              For routes Etihad excludes (UK, US, Australia, etc.), the practical pattern is to fly cabin to a permitted hub Etihad serves (e.g. an EU hub or a Gulf neighbour) and connect onward — or, if your only origin option is excluded, accept that the trip will be cargo end-to-end via Emirates SkyCargo or Etihad Cargo. Always confirm the exact route with Etihad directly before booking.
            </p>
          </section>

          {/* Banned breeds */}
          <section id="breeds" className="mb-14 scroll-mt-24">
            <div className="text-xs uppercase tracking-[0.25em] text-amber-700 mb-3">05 · Banned breeds</div>
            <h2 className="font-serif text-2xl md:text-3xl text-stone-900 mb-3 leading-tight">
              The UAE bans a defined list of dog breeds
            </h2>
            <p className="font-serif italic text-stone-600 text-lg mb-6 leading-snug">
              Check the list before you start the process — a denied permit can't be appealed quickly.
            </p>

            <p className="font-serif text-stone-700 leading-relaxed mb-4">
              The UAE prohibits the import of certain dog breeds. Per MOCCAE and USDA APHIS, the banned list covers Pit Bull types — Staffordshire Bull Terrier, American Pit Bull Terrier, American Staffordshire Terrier and American Bully — and Mastiff types: Brazilian Mastiff (Fila Brasileiro), Argentinian Mastiff (Dogo Argentino), Tibetan Mastiff, Neapolitan Mastiff, French Mastiff (Dogue de Bordeaux), Boerboel, Bullmastiff, Cane Corso and Bully Kutta.
            </p>

            <p className="font-serif text-stone-700 leading-relaxed mb-4">
              The ban can extend to undeclared crosses of these breeds — so a mixed-breed dog whose appearance matches the list can be caught by it. The narrow exception is for service, emotional-support or medical-purpose dogs, which may be permitted in line with the regulating requirements and additional documentation.
            </p>

            <p className="font-serif text-stone-700 leading-relaxed">
              Because a permit denial or a customs seizure over a banned breed is difficult to reverse quickly, verify your dog's breed against the current MOCCAE list <em>before</em> beginning any paperwork or booking.
            </p>
          </section>

          {/* Airports and arrival */}
          <section id="arrival" className="mb-14 scroll-mt-24">
            <div className="text-xs uppercase tracking-[0.25em] text-amber-700 mb-3">06 · Airports &amp; arrival</div>
            <h2 className="font-serif text-2xl md:text-3xl text-stone-900 mb-3 leading-tight">
              Inspection at the port of entry before release
            </h2>
            <p className="font-serif italic text-stone-600 text-lg mb-6 leading-snug">
              MOCCAE checks the consignment against the permit before your pet is released.
            </p>

            <p className="font-serif text-stone-700 leading-relaxed mb-4">
              When the pet arrives, MOCCAE officials at the port of entry inspect the consignment — verifying it against the import permit, the health certificate, the vaccination record and the microchip — before releasing the animal. MOCCAE operates around the clock and has offices in both Dubai and Abu Dhabi.
            </p>

            <p className="font-serif text-stone-700 leading-relaxed mb-4">
              Consignments must be shipped directly from the exporting country; if the route crosses another country, the pet must not be mixed with other animals along the way. Because the process runs through the cargo terminal, most owners use an IATA-registered pet relocation specialist to coordinate the permit, the cargo booking and the airport clearance as one process.
            </p>

            <p className="font-serif text-stone-700 leading-relaxed">
              <strong>Leaving the UAE:</strong> the export side runs through MOCCAE too. You take the pet to a MOCCAE branch with its vaccination record for a physical assessment and microchip scan, and a veterinary health certificate is issued for the journey — then you follow the import rules of wherever you are heading next.
            </p>
          </section>

          {/* CTA */}
          <div className="bg-stone-900 text-stone-100 rounded-sm p-8 text-center mt-12">
            <h2 className="font-serif text-2xl text-stone-50 mb-3">Map your UAE journey</h2>
            <p className="font-serif text-stone-300 leading-relaxed mb-6">
              Use the journey planner to map your specific origin to the UAE — with the cabin and cargo realities, any connection, and a checklist matched to your route.
            </p>
            <Link
              href="/?go=planner"
              className="inline-block bg-amber-600 text-white px-6 py-3 text-sm uppercase tracking-widest font-medium hover:bg-amber-500 transition-colors"
            >
              Open the journey planner
            </Link>
          </div>

          <p className="font-sans text-xs text-stone-400 leading-relaxed mt-12 text-center">
            Verified against MOCCAE (the UAE Ministry of Climate Change and Environment) and USDA APHIS published guidance as of May 2026. UAE import rules can change, some details — including import-permit validity — differ between official sources, and requirements depend on your pet's age, breed, species and country of origin. Always confirm the latest specifics directly with MOCCAE before travel.
          </p>

          {/* Related guides — cross-links to other country/topic pages */}
          <div className="mt-16 pt-10 border-t border-stone-300">
            <div className="text-xs uppercase tracking-[0.25em] text-amber-700 mb-2">Related guides</div>
            <h2 className="font-serif text-2xl text-stone-900 mb-6">More from the pets-in-cabin guide</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <Link href="/india-pet-travel" className="block bg-stone-50 border border-stone-200 hover:border-amber-300 transition-colors p-4 rounded-sm">
                <div className="font-serif text-base text-stone-900 mb-1">India guide →</div>
                <div className="text-xs text-stone-600 leading-relaxed">Another strict-import destination — the AQCS permit process.</div>
              </Link>

              <Link href="/japan-pet-travel" className="block bg-stone-50 border border-stone-200 hover:border-amber-300 transition-colors p-4 rounded-sm">
                <div className="font-serif text-base text-stone-900 mb-1">Japan guide →</div>
                <div className="text-xs text-stone-600 leading-relaxed">The strictest of all — a process measured in months.</div>
              </Link>

              <Link href="/uk-pet-travel" className="block bg-stone-50 border border-stone-200 hover:border-amber-300 transition-colors p-4 rounded-sm">
                <div className="font-serif text-base text-stone-900 mb-1">UK guide →</div>
                <div className="text-xs text-stone-600 leading-relaxed">The UK's own cabin ban — and how pets actually get in.</div>
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
