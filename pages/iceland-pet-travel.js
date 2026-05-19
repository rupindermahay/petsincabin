import Head from "next/head";
import Link from "next/link";

export default function IcelandPetTravel() {
  return (
    <>
      <Head>
        <title>Flying a Pet to Iceland (2026): Icelandair, Quarantine &amp; Rules | Pets in Cabin</title>
        <meta
          name="description"
          content="Bringing a dog or cat to Iceland — the realistic picture: the mandatory 14-day quarantine, MAST import permit, FAVN titer test, banned breeds and Keflavík-only entry."
        />
        <link rel="canonical" href="https://www.petsincabin.com/iceland-pet-travel" />
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
            Country guide · Iceland
          </div>

          <h1 className="font-serif text-4xl md:text-5xl leading-[1.05] text-stone-900 mb-6">
            Flying with a pet <span className="italic text-stone-600">to and from Iceland</span>.
          </h1>

          <p className="font-serif text-lg md:text-xl text-stone-700 leading-relaxed mb-8">
            Iceland is one of the strictest pet-import countries in the world — closer to Hawaii or Australia than to anywhere else in Europe. Iceland has been rabies-free throughout recorded history, and the rules exist to keep it that way. Every imported pet does a <strong>mandatory 14-day quarantine</strong> at a government-approved facility, on top of a long pre-travel paperwork trail. Start 4–6 months ahead, or don't start at all.
          </p>

          <p className="font-serif italic text-stone-600 leading-relaxed mb-12">
            Verified against the Icelandic Food and Veterinary Authority (MAST) and US APHIS as of May 2026.
          </p>

          <div className="bg-white border border-stone-200 rounded-sm p-5 mb-12">
            <div className="text-xs uppercase tracking-widest text-stone-500 mb-3">In this guide</div>
            <div className="flex flex-wrap gap-2 text-sm">
              <a href="#reality-check" className="text-stone-700 hover:text-amber-700 underline decoration-stone-300 hover:decoration-amber-600 underline-offset-4">Reality check</a>
              <a href="#quarantine" className="text-stone-700 hover:text-amber-700 underline decoration-stone-300 hover:decoration-amber-600 underline-offset-4">14-day quarantine</a>
              <a href="#approved-countries" className="text-stone-700 hover:text-amber-700 underline decoration-stone-300 hover:decoration-amber-600 underline-offset-4">Approved countries</a>
              <a href="#paperwork" className="text-stone-700 hover:text-amber-700 underline decoration-stone-300 hover:decoration-amber-600 underline-offset-4">Paperwork & timeline</a>
              <a href="#banned-breeds" className="text-stone-700 hover:text-amber-700 underline decoration-stone-300 hover:decoration-amber-600 underline-offset-4">Banned breeds</a>
              <a href="#flights" className="text-stone-700 hover:text-amber-700 underline decoration-stone-300 hover:decoration-amber-600 underline-offset-4">Flights & entry port</a>
              <a href="#flying-out" className="text-stone-700 hover:text-amber-700 underline decoration-stone-300 hover:decoration-amber-600 underline-offset-4">Flying out of Iceland</a>
            </div>
          </div>

          <div className="h-px bg-stone-300 mb-12" />

          {/* Reality check */}
          <section id="reality-check" className="mb-14 scroll-mt-24">
            <div className="text-xs uppercase tracking-[0.25em] text-amber-700 mb-3">01 · Reality check</div>
            <h2 className="font-serif text-2xl md:text-3xl text-stone-900 mb-3 leading-tight">
              No cabin pets. No exceptions. Quarantine for everyone.
            </h2>
            <p className="font-serif italic text-stone-600 text-lg mb-6 leading-snug">
              Before you do anything else, understand what Iceland is actually asking.
            </p>
            <div className="space-y-4 font-serif text-stone-800 leading-relaxed">
              <p>
                Pets cannot travel in the cabin to Iceland on any commercial airline. The only legal route is manifested cargo via Icelandair, and only into Keflavík (KEF) — the only approved port of entry for pets in the entire country.
              </p>
              <p>
                On arrival every dog and cat enters a <strong>government-approved quarantine facility for a minimum of 14 days</strong>. There are currently two facilities: Mósel and Reykjanes. You book and pay for your pet's stay in advance, and quarantine "intake days" only run on specific dates (typically monthly), so your travel date is dictated by the facility's calendar, not yours.
              </p>
              <p>
                The total preparation timeline is <strong>4 to 6 months minimum</strong> from start to landing. Skip a step and your pet is refused entry or sent back at your expense. There is no fast-track and no grace period.
              </p>
              <p>
                If that sounds like a lot — it is. The good news is that the rules are well-documented, MAST is responsive by email (<a href="mailto:[email protected]" className="text-amber-700 underline decoration-amber-300 underline-offset-4 hover:text-amber-800 transition-colors">[email protected]</a>), and once you've done the paperwork it actually goes smoothly. The bad news is there's no shortcut, and the realistic cost (permit + flights + quarantine + vet work) runs into the thousands.
              </p>
            </div>
          </section>

          <div className="h-px bg-stone-300 mb-12" />

          {/* 14-day quarantine */}
          <section id="quarantine" className="mb-14 scroll-mt-24">
            <div className="text-xs uppercase tracking-[0.25em] text-amber-700 mb-3">02 · The 14-day quarantine</div>
            <h2 className="font-serif text-2xl md:text-3xl text-stone-900 mb-3 leading-tight">
              You book it, you pay for it, you visit during it.
            </h2>
            <p className="font-serif italic text-stone-600 text-lg mb-6 leading-snug">
              The single biggest practical commitment of importing a pet to Iceland.
            </p>
            <div className="space-y-4 font-serif text-stone-800 leading-relaxed">
              <p>
                The two approved quarantine facilities — <strong>Mósel</strong> (in the south, the larger one) and <strong>Reykjanes</strong> — are run privately under MAST oversight. You book a space directly with the facility well before applying for the import permit, because the permit application asks for your confirmed quarantine booking.
              </p>
              <p>
                Pets can only arrive on a "quarantine admission day" — typically once a month, decided by the facility. The Keflavík airport admission window is <strong>05:00 to 17:00 on those days</strong>; if your flight lands outside that window, you need pre-arranged approval from MAST (apply by 16:00 the Wednesday before your intended admission day) and pay extra inspection costs.
              </p>
              <p>
                During the 14 days, you can visit your pet at scheduled times, bring familiar bedding and food, and stay in contact with the facility staff. Pets must be picked up at the end of the quarantine period (typically the morning after day 14). The facility will not extend stays casually.
              </p>
              <p>
                Costs vary by facility and animal size — budget roughly the equivalent of a moderate hotel stay per pet, plus admission and supervision fees. Get a written quote at the booking stage. Insurance during quarantine is generally the owner's responsibility.
              </p>
            </div>
          </section>

          <div className="h-px bg-stone-300 mb-12" />

          {/* Approved countries */}
          <section id="approved-countries" className="mb-14 scroll-mt-24">
            <div className="text-xs uppercase tracking-[0.25em] text-amber-700 mb-3">03 · Approved countries</div>
            <h2 className="font-serif text-2xl md:text-3xl text-stone-900 mb-3 leading-tight">
              Your country of origin matters — a lot.
            </h2>
            <p className="font-serif italic text-stone-600 text-lg mb-6 leading-snug">
              Iceland splits the world into Category 1, Category 2, and "not approved at all".
            </p>
            <div className="space-y-4 font-serif text-stone-800 leading-relaxed">
              <p>
                <strong>Category 1 (rabies-free):</strong> the easier category. Most EU member states, the UK, Ireland, Norway, Sweden, Australia, New Zealand, and Japan are typically here. Paperwork uses the D1 certificate.
              </p>
              <p>
                <strong>Category 2 (rabies controlled):</strong> the United States, Canada, Greenland, Hungary, Poland, Romania, Serbia, Slovakia, Taiwan, Turkey, and a handful of others. Paperwork uses the D2 certificate and adds further vaccination and titer requirements. Strict but doable.
              </p>
              <p>
                <strong>Not on either list:</strong> import is not permitted. You can apply to MAST to have a country assessed — the list is revised twice a year — but don't plan a relocation around an unassessed country.
              </p>
              <p>
                The MAST website publishes the current category list and is the only authoritative source. Confirm your origin country's category before booking anything else.
              </p>
            </div>
          </section>

          <div className="h-px bg-stone-300 mb-12" />

          {/* Paperwork & timeline */}
          <section id="paperwork" className="mb-14 scroll-mt-24">
            <div className="text-xs uppercase tracking-[0.25em] text-amber-700 mb-3">04 · Paperwork & timeline</div>
            <h2 className="font-serif text-2xl md:text-3xl text-stone-900 mb-3 leading-tight">
              Six months out is the right start date.
            </h2>
            <p className="font-serif italic text-stone-600 text-lg mb-6 leading-snug">
              Every step has a clock attached to it. Miss a window and the whole timeline restarts.
            </p>
            <div className="space-y-4 font-serif text-stone-800 leading-relaxed">
              <p>
                <strong>6 months before:</strong> Confirm your pet is healthy enough for this. Implant an ISO 11784/11785 microchip <em>before</em> the rabies vaccination — chips after the vaccine don't count.
              </p>
              <p>
                <strong>5–6 months before:</strong> Rabies vaccine (or booster). At least 30 days after the vaccine, take a FAVN rabies titer blood sample at an authorised laboratory; you need a result of ≥0.5 IU/ml. <strong>The pet may only be imported after 90 days have passed since the date of the satisfactory blood sample.</strong> This is the single longest clock in the whole process.
              </p>
              <p>
                <strong>3 months before:</strong> Book your quarantine space at Mósel or Reykjanes. Confirm the admission day. Apply for the MAST import permit (the 2026 permit fee is around 39,633 ISK / ~£230 / ~$290 USD, covering paperwork and airport inspection).
              </p>
              <p>
                <strong>2 months before:</strong> Additional vaccinations — leptospirosis, canine distemper, infectious canine hepatitis, canine parvovirus, canine parainfluenza (for dogs); feline panleukopenia, calicivirus, herpesvirus (for cats). Must be administered at least 14 days before entry.
              </p>
              <p>
                <strong>28–21 days before:</strong> First antiparasitic treatment (internal and external) by an authorised vet, documented on the Certificate of Health.
              </p>
              <p>
                <strong>10–5 days before:</strong> Second antiparasitic treatment. Specific lab tests as required by category — dogs are typically tested for <em>Brucella canis</em>, <em>Leishmania</em>, and <em>Angiostrongylus vasorum</em>; cats for FIV and FeLV.
              </p>
              <p>
                <strong>5 days before:</strong> The signed Certificate of Health and all test results must be submitted to MAST for approval. Without prior approval, your pet will not be admitted on arrival.
              </p>
              <p>
                US-origin pets do <strong>not</strong> need USDA APHIS endorsement for Iceland (confirmed on the official APHIS page) — but they DO need everything else.
              </p>
            </div>
          </section>

          <div className="h-px bg-stone-300 mb-12" />

          {/* Banned breeds */}
          <section id="banned-breeds" className="mb-14 scroll-mt-24">
            <div className="text-xs uppercase tracking-[0.25em] text-amber-700 mb-3">05 · Banned breeds</div>
            <h2 className="font-serif text-2xl md:text-3xl text-stone-900 mb-3 leading-tight">
              These dogs cannot enter Iceland. No appeal.
            </h2>
            <p className="font-serif italic text-stone-600 text-lg mb-6 leading-snug">
              Iceland's banned list is short but absolute.
            </p>
            <div className="space-y-4 font-serif text-stone-800 leading-relaxed">
              <p>
                The following breeds (and their crosses) cannot be imported to Iceland under any circumstances:
              </p>
              <ul className="space-y-1 ml-5">
                <li>— American Pit Bull Terrier</li>
                <li>— American Staffordshire Terrier</li>
                <li>— Staffordshire Bull Terrier</li>
                <li>— Fila Brasileiro (Brazilian Mastiff)</li>
                <li>— Tosa Inu</li>
                <li>— Dogo Argentino (Argentine Mastiff)</li>
                <li>— Any wolf hybrids</li>
              </ul>
              <p>
                If your dog merely <em>looks</em> like one of these breeds, MAST can ask for DNA evidence or pedigree papers to confirm it isn't. Don't gamble on visual judgment — if your dog is on the line, contact MAST in advance for guidance rather than discovering the issue at Keflavík.
              </p>
              <p>
                Exotic cats (Bengal, Savannah, etc.) are subject to CITES rules and additional restrictions. Email <a href="mailto:[email protected]" className="text-amber-700 underline decoration-amber-300 underline-offset-4 hover:text-amber-800 transition-colors">[email protected]</a> before applying for any permits if your cat has hybrid heritage.
              </p>
            </div>
          </section>

          <div className="h-px bg-stone-300 mb-12" />

          {/* Flights & entry port */}
          <section id="flights" className="mb-14 scroll-mt-24">
            <div className="text-xs uppercase tracking-[0.25em] text-amber-700 mb-3">06 · Flights & entry port</div>
            <h2 className="font-serif text-2xl md:text-3xl text-stone-900 mb-3 leading-tight">
              Keflavík (KEF) is the only door in.
            </h2>
            <p className="font-serif italic text-stone-600 text-lg mb-6 leading-snug">
              Reykjavík's smaller domestic airport doesn't accept pet imports.
            </p>
            <div className="space-y-4 font-serif text-stone-800 leading-relaxed">
              <p>
                Iceland has multiple airports but only Keflavík (KEF) is approved for pet imports. Domestic airports — including Reykjavík city airport (RKV) — cannot clear an imported pet under any circumstances.
              </p>
              <p>
                Pets travel as <strong>manifested cargo</strong>, not as checked baggage and not in the cabin. Icelandair is the primary carrier; Icelandair Cargo handles the booking. Some other carriers serve Keflavík but they typically route pet bookings through Icelandair Cargo too.
              </p>
              <p>
                Crates must meet IATA Live Animals Regulations (LAR). Order early — IATA-compliant crates take time to source, and your pet should be carrier-trained for at least 2 weeks before the flight to reduce stress.
              </p>
              <p>
                Brachycephalic (snub-nosed) breeds — pugs, French bulldogs, Persian cats, etc. — face the usual cargo restrictions. Some airlines refuse them outright in cargo. Confirm with the carrier before booking.
              </p>
            </div>
          </section>

          <div className="h-px bg-stone-300 mb-12" />

          {/* Flying out of Iceland */}
          <section id="flying-out" className="mb-14 scroll-mt-24">
            <div className="text-xs uppercase tracking-[0.25em] text-amber-700 mb-3">07 · Flying out of Iceland</div>
            <h2 className="font-serif text-2xl md:text-3xl text-stone-900 mb-3 leading-tight">
              Easier going the other way — but still cargo.
            </h2>
            <p className="font-serif italic text-stone-600 text-lg mb-6 leading-snug">
              Leaving Iceland is mostly about meeting your destination's rules, not Iceland's.
            </p>
            <div className="space-y-4 font-serif text-stone-800 leading-relaxed">
              <p>
                Iceland doesn't restrict export. The work goes into meeting the <em>destination</em> country's import rules — which for many destinations is significantly less onerous than coming the other way.
              </p>
              <p>
                <strong>To the EU/EEA:</strong> EU Animal Health Certificate or EU Pet Passport (Iceland is part of the EEA, so the EU pet movement framework applies). Microchip + rabies + tapeworm treatment for dogs going to the UK, Ireland, Malta, Finland, or Norway.
              </p>
              <p>
                <strong>To the UK:</strong> No cabin pets allowed into the UK on any airline — that's a UK government rule, not an Iceland one. Cargo via Icelandair, or fly to Paris/Amsterdam first and cross by Eurotunnel.
              </p>
              <p>
                <strong>To the US:</strong> CDC Dog Import Form for dogs (Iceland is on the CDC's low-risk list — no extra titer required). Vet "fit to fly" health certificate. Six US airports accept dogs (LAX, ATL, MIA, JFK, PHL, IAD).
              </p>
              <p>
                <strong>Cabin out of Iceland:</strong> Icelandair does not offer cabin pet travel on any route. To fly cabin internationally with your pet, you'd need to fly cargo to a European hub (Paris, Amsterdam, Frankfurt) and connect onward — but at that point you're managing two carriers and a cargo collection, and most pet owners just book the entire journey as cargo for sanity.
              </p>
            </div>
          </section>

          <div className="h-px bg-stone-300 mb-12" />

          {/* Related guides — cross-links to other country/topic pages */}
          <div className="mt-16 pt-10 border-t border-stone-300">
            <div className="text-xs uppercase tracking-[0.25em] text-amber-700 mb-2">Related guides</div>
            <h2 className="font-serif text-2xl text-stone-900 mb-6">More from the pets-in-cabin guide</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <Link href="/oslo-pet-travel" className="block bg-stone-50 border border-stone-200 hover:border-amber-300 transition-colors p-4 rounded-sm">
                <div className="font-serif text-base text-stone-900 mb-1">Oslo (Norway) guide →</div>
                <div className="text-xs text-stone-600 leading-relaxed">Nordic neighbour but a much easier import regime — cabin IS allowed in.</div>
              </Link>

              <Link href="/uk-pet-travel" className="block bg-stone-50 border border-stone-200 hover:border-amber-300 transition-colors p-4 rounded-sm">
                <div className="font-serif text-base text-stone-900 mb-1">UK guide →</div>
                <div className="text-xs text-stone-600 leading-relaxed">Iceland's strictness sits alongside the UK's cabin ban — useful contrast.</div>
              </Link>

              <Link href="/japan-pet-travel" className="block bg-stone-50 border border-stone-200 hover:border-amber-300 transition-colors p-4 rounded-sm">
                <div className="font-serif text-base text-stone-900 mb-1">Japan guide →</div>
                <div className="text-xs text-stone-600 leading-relaxed">Similar titer + quarantine logic to compare with Iceland's.</div>
              </Link>
            </div>
            <p className="text-xs text-stone-500 italic mt-6">
              <Link href="/" className="text-amber-700 underline decoration-amber-300 underline-offset-4 hover:text-amber-800 transition-colors not-italic">Back to the main guide</Link> — for the airline grid, journey planner, and full destination list.
            </p>
          </div>

          <p className="text-xs text-stone-500 leading-relaxed mt-10">
            Last verified: May 2026. Iceland's pet import rules are regulated by the Icelandic Food and Veterinary Authority (MAST). Always confirm current requirements directly with MAST before relying on any third-party guide, including this one. The category list, fee structure, and approved facilities can change without notice.
          </p>
        </main>

        <footer className="border-t border-stone-300 py-10 px-6 md:px-12">
          <div className="max-w-4xl mx-auto text-center">
            <p className="font-serif italic text-stone-500 text-sm">
              Pets in Cabin · By Theo's Mum · <Link href="/privacy" className="underline decoration-stone-300 hover:text-amber-700 transition-colors">Privacy</Link>
            </p>
          </div>
        </footer>
      </div>
    </>
  );
}
