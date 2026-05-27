import Head from "next/head";
import Link from "next/link";

// Verified rule changes from airlines and regulators only — not
// site housekeeping. The homepage "What's New" block surfaces the
// most recent few of these; this page is the permanent archive.

// ⏰ Etihad promo expiry — mirrors components/PetTravel.jsx lines 14-30.
// IMPORTANT: this evaluates at module load — at Vercel build time for
// statically-generated pages, or at server-start for SSR. The flip from
// active → expired therefore requires a fresh deploy on or after 1 June
// 2026; it is NOT a true runtime auto-flip.
// See also: components/PetTravel.jsx lines 6-13 (optimistic comment block,
// known to be misleading) and lines 14-30 (matching constants), plus
// DECISIONS_LOG.md entry on build-time vs runtime flip semantics.
const ETIHAD_PROMO_EXPIRY = new Date("2026-05-31T23:59:59Z");
const ETIHAD_PROMO_ACTIVE = new Date() <= ETIHAD_PROMO_EXPIRY;

const ETIHAD_UPDATE = ETIHAD_PROMO_ACTIVE
  ? {
      date: "Apr 2026",
      tag: "Etihad",
      headline: "Etihad launched a $399 promotional cabin pet fare",
      body: "Until 31 May 2026, Etihad's Pets Onboard service is reduced to $399 per flight segment (booking + travel both within the promo window). Etihad remains the only UAE carrier offering cabin pet travel. Post-promo, the standard rate is significantly higher.",
      source: "Etihad newsroom, April 2026",
    }
  : {
      date: "Apr 2026",
      tag: "Etihad",
      headline: "Etihad ran a $399 promotional cabin pet fare",
      body: "Through 31 May 2026, Etihad's Pets Onboard service was reduced to $399 per flight segment (booking + travel both within the promo window). Etihad remains the only UAE carrier offering cabin pet travel. The standard rate is now around $1,500 per segment.",
      source: "Etihad newsroom, April 2026",
    };

const RULE_CHANGES = [
  {
    date: "27 May 2026",
    tag: "Edinburgh",
    headline: "Edinburgh (EDI) added as a UK cabin-pet departure airport",
    body: "Edinburgh joins Heathrow and Manchester as a verified UK cabin-pet departure airport — KLM (to Amsterdam), Air France (Paris CDG), Lufthansa (Frankfurt/Munich), SAS (Copenhagen), Iberia (Madrid), Finnair (Helsinki) and TAP (Lisbon) all carry cabin pets out of Edinburgh on their published policies. EDI is also on the UK government's pet-approved list for cargo-into-UK with Air Canada, Air France-KLM Martinair Cargo, Atlantic Airways, Delta, Emirates SkyCargo, Etihad, Lufthansa, Qatar Airways, TUI, Turkish Airlines, United and WestJet — though, as with every UK airport, no cabin pets INTO the UK on any airline. The journey planner, route cards, dropdowns and checklists are now Edinburgh-aware; a Scottish traveller picking EDI gets the same depth of coverage as one picking LHR. Virgin Atlantic flies EDI to several US cities but is assistance-dogs-only in cabin — for transatlantic cabin pets from Edinburgh, the path is EDI → an EU hub → US on a single carrier (KLM via Amsterdam or Air France via Paris).",
    source: "gov.uk approved air routes (updated 30 March 2026); each airline's own published policy",
  },
  {
    date: "22 Apr 2026",
    tag: "EU",
    headline: "EU pet passport rules changed for non-EU residents",
    body: "UK, US, Canadian and other non-EU residents can no longer use EU pet passports to enter the EU — even if the passport was issued before this date. You now need a fresh Animal Health Certificate (AHC) for every single trip. The AHC's validity was extended from 4 to 6 months at the same time.",
    source: "EU Commission travel-with-pets guidance",
  },
  ETIHAD_UPDATE,
  {
    date: "Apr–May 2026",
    tag: "Alaska Airlines",
    headline: "Alaska Airlines expanded its long-haul international network",
    body: "Alaska launched year-round SEA ⇄ Seoul (April 2026), SEA ⇄ London Heathrow (May 2026) and SEA ⇄ Rome (April 2026), with SEA ⇄ Reykjavík seasonal from May 28. Most new routes carry cabin pets (UK arrivals remain cargo-only by UK government rule). This makes Alaska a genuine option for US West Coast → Europe / Asia cabin pet routes for the first time.",
    source: "Alaska Airlines press release, March 2026",
  },
  {
    date: "May 2026",
    tag: "Delta",
    headline: "Delta confirmed cabin pets to the Republic of Ireland",
    body: "Delta's own international travel page confirms cabin pet travel to Ireland on true Delta-operated flights (JFK ⇄ DUB direct, $200 each way at check-in, advance notification required to petmove@agriculture.gov.ie). Most third-party policy lists still show Ireland as banned on Delta — that information is out of date.",
    source: "Delta Air Lines international pet travel page",
  },
  {
    date: "Summer 2026",
    tag: "ITA Airways",
    headline: "ITA Airways: dogs up to 30 kg in cabin on domestic Italian routes",
    body: "Italy's civil aviation authority (ENAC) approved a new rule allowing medium and large dogs in the cabin on selected 'large pet-friendly' domestic Italian flights. ITA Airways is the first carrier rolling it out; an extra seat purchase is required. Watch for the public booking launch through summer 2026.",
    source: "ENAC announcement / ITA Airways",
  },
  {
    date: "Jun 2025",
    tag: "Air Canada",
    headline: "Air Canada formalised soft-sided-only cabin carriers",
    body: "Air Canada's news page confirmed that from 1 June 2025, hard-sided kennels are no longer accepted under the seat on flights operated by Air Canada, Rouge or Express. Soft-sided had long been the recommendation; this makes it a firm rule. Combined weight limit (pet + carrier) stays at 10 kg.",
    source: "Air Canada news page",
  },
  {
    date: "Aug 2024",
    tag: "CDC (US)",
    headline: "New CDC dog import rules replaced the 2021 high-risk suspension",
    body: "From 1 August 2024, the CDC's two-year suspension on dog imports from 113 high-risk-rabies countries was replaced with new entry requirements: CDC Dog Import Form for all dogs, plus additional documentation for dogs from high-risk countries (microchip before vaccine, rabies titer, USDA-endorsed certification of US-issued vaccine for re-entries, minimum age 6 months at entry). Some airlines — notably LATAM — have temporarily suspended cabin pet service on US ↔ Brazil / Bolivia / Ecuador / Peru / Colombia routes as a result.",
    source: "CDC importation guidance",
  },
  {
    date: "Feb 2022 — ongoing",
    tag: "Russia / Ukraine",
    headline: "Western airspace closures continue to limit Russia and Ukraine routes",
    body: "Russian airspace remains closed to UK, US, EU and Canadian carriers, and reciprocally Russia's own carriers (Aeroflot) cannot fly to most Western destinations. Ukrainian commercial airspace remains closed to passenger flights. The only realistic cabin route in or out of Russia is via Aeroflot's remaining ~17-country network through Istanbul, Dubai or Central Asia; in or out of Ukraine, the realistic route is overland from Poland via train or specialist road shipper.",
    source: "Multiple — see Russia & Ukraine in Difficult Destinations",
  },
];

export default function Updates() {
  return (
    <>
      <Head>
        <title>Updates — Pets in Cabin · By Theo's Mum</title>
        <meta
          name="description"
          content="A timestamped archive of recent rule changes affecting pet travel — airlines, regulators, and routes. Updated as the rules change."
        />
        <link rel="canonical" href="https://www.petsincabin.com/updates" />
      </Head>

      <div className="min-h-screen" style={{ backgroundColor: "#faf6ed", fontFamily: "'Inter', -apple-system, sans-serif" }}>
        <style>{`
          @import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,400;0,9..144,500;0,9..144,600;1,9..144,400;1,9..144,500&family=Inter:wght@400;500;600&display=swap');
          .font-serif { font-family: 'Fraunces', Georgia, serif; font-optical-sizing: auto; }
        `}</style>

        {/* Nav */}
        <nav className="border-b border-stone-300 px-6 md:px-12 py-4" style={{ backgroundColor: "rgba(250, 246, 237, 0.98)" }}>
          <div className="max-w-4xl mx-auto flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2.5 group">
              <img src="/logo.png" alt="Pets in Cabin" className="w-8 h-8 rounded-full object-cover" />
              <span className="font-serif italic font-semibold text-stone-800 group-hover:text-amber-700 transition-colors">Pets in Cabin</span>
            </Link>
            <Link href="/" className="text-xs uppercase tracking-widest text-stone-500 hover:text-amber-700 transition-colors">← Back to the guide</Link>
          </div>
        </nav>

        <main className="max-w-3xl mx-auto px-6 py-16 md:py-24">

          {/* Kicker */}
          <div className="text-xs uppercase tracking-[0.25em] text-amber-700 mb-6">Updates archive</div>

          {/* Headline */}
          <h1 className="font-serif text-5xl md:text-6xl leading-[1.05] text-stone-900 mb-8">
            The rules keep changing.<br />
            <span className="italic text-amber-700">We keep checking.</span>
          </h1>

          <div className="font-serif text-lg md:text-xl text-stone-700 leading-[1.7] mb-16 max-w-2xl">
            <p className="mb-4">
              Pet-travel rules shift constantly. Airlines change weight limits, regulators tighten paperwork, sanctions close airspace. Most online guides go out of date within months because nobody goes back to check.
            </p>
            <p>
              This page is our permanent log of what's changed — with dates and sources where they exist. The most recent few entries also appear on the homepage in the <Link href="/#whats-new" className="text-amber-700 underline decoration-amber-300 underline-offset-4 hover:text-amber-600">What's New</Link> block.
            </p>
          </div>

          {/* Section: Rule changes */}
          <section className="mb-20">

            <div className="space-y-10">
              {RULE_CHANGES.map((item, i) => (
                <article key={i} className="border-l-2 border-amber-200 pl-6 md:pl-8">
                  <div className="flex items-baseline gap-2 mb-2 flex-wrap">
                    <span className="text-xs uppercase tracking-[0.2em] text-amber-700 font-medium">
                      {item.date}
                    </span>
                    <span className="text-xs uppercase tracking-[0.2em] text-stone-400">·</span>
                    <span className="text-xs uppercase tracking-[0.2em] text-stone-500">
                      {item.tag}
                    </span>
                  </div>
                  <h3 className="font-serif text-2xl text-stone-900 mb-3 leading-snug">
                    {item.headline}
                  </h3>
                  <p className="text-stone-700 leading-relaxed mb-3">{item.body}</p>
                  {item.source && (
                    <p className="text-xs text-stone-500 italic">
                      Source: {item.source}
                    </p>
                  )}
                </article>
              ))}
            </div>
          </section>

          {/* CTA */}
          <div className="mt-16 bg-amber-50 border border-amber-200 rounded-sm p-6">
            <div className="font-serif text-xl text-stone-900 mb-2">Spotted something out of date?</div>
            <p className="text-base text-stone-600 leading-relaxed">
              Email <a href="mailto:petincabinguide@gmail.com" className="text-amber-700 underline decoration-amber-300 hover:text-amber-600">petincabinguide@gmail.com</a> and we'll verify it. The site is updated as airlines, regulators and routes shift — and reader reports of stale data are how we catch what we'd otherwise miss.
            </p>
          </div>

        </main>

        {/* Footer */}
        <footer className="border-t border-stone-300 px-6 py-10 mt-8">
          <div className="max-w-3xl mx-auto flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <img src="/logo.png" alt="Pets in Cabin" className="w-10 h-10 rounded-full object-cover" />
              <div>
                <div className="font-serif italic text-stone-700 text-sm">Pets in Cabin</div>
                <div className="font-serif italic text-stone-400 text-xs">Travel together, stay together</div>
              </div>
            </div>
            <div className="flex gap-6 text-xs uppercase tracking-widest text-stone-400">
              <Link href="/" className="hover:text-amber-700 transition-colors">The guide</Link>
              <Link href="/about" className="hover:text-amber-700 transition-colors">About</Link>
              <Link href="/privacy" className="hover:text-amber-700 transition-colors">Privacy</Link>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
}
