import Head from "next/head";
import Link from "next/link";

// Verified rule changes from airlines and regulators, plus occasional
// significant site milestones (a new deep-dive guide, a published trip
// story). The homepage "What's New" block surfaces the most recent few
// of these; this page is the permanent archive. Keep the bar high — a
// milestone earns a slot only if the site's factual coverage or a
// reader's plan could change on the back of it.

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
    date: "20 Jul 2026",
    tag: "New story",
    headline: "New story — Miami to London, with the same small dog",
    body: "Story 02 in the From-the-desk series is now live: a first-person account of Theo's actual Miami → Paris → Le Shuttle → UK trip in July 2026. The trip surfaced a real-world paperwork trap that isn't obvious from published USDA/DEFRA guidance — a USDA-endorsed EU AHC listing the UK as final destination via France would have been rejected at Le Shuttle's pet reception at Calais, because Le Shuttle applies UK entry rules, not French entry rules. The fix, learned mid-journey from a pet taxi driver, was an EU Pet Passport issued on the spot by a French vet for €90. On the strength of this trip, the USDA endorsement guide (section 07) and the UK route guide (Via Paris section) have both been rewritten to warn readers upfront and document the €90 EU Pet Passport backup path. Read the full story on the homepage in the Stories section.",
    source: "Site milestone — trip completed early July 2026, story published 20 July 2026",
  },
  {
    date: "27 May 2026",
    tag: "La Compagnie",
    headline: "La Compagnie — business-class transatlantic cabin pets added",
    body: "La Compagnie, the all-business-class boutique airline operating Newark (EWR) to Paris Orly (ORY), Milan Malpensa (MXP) year-round and Nice (NCE) seasonally, is now catalogued on the site. La Compagnie is the only carrier in the world that pairs transatlantic cabin pets with business-class floor space — every seat on the Airbus A321neo fleet is lie-flat, and pets travel under the seat in front of you with markedly more space than the economy footwell on Air France or Delta. Cost framing matters: round-trip business fares typically run $2,400–$3,000 (more in peak, less in promo sales), with a €200 pet fee each way (€400/$500 round-trip). That's 3–4× the price of Air France economy round-trip (~$700) but roughly comparable to other carriers' standard business-class fares — so it's not a budget alternative, it's a premium pet-friendlier alternative to other premium options. Eligibility: dogs and cats up to 8 kg combined (reduced from 15 kg in October 2024 to align with EU rules), pet booking required 48 hours before departure, max 4 pets per flight. AIRPORTS now includes Paris Orly (ORY) so the journey planner can route via it. WORKAROUND_ROUTES_TABLE includes a premium-via-Orly variant of the USA→London/UK Eurotunnel workaround for travellers who'd value the business-class transatlantic leg. The `getting-your-pet-into-the-uk.js` Via Paris section now mentions La Compagnie as a premium alternative to the standard Air France CDG route, with explicit cost framing so users don't assume it's a budget option.",
    source: "lacompagnie.com/en/plan/special-services (Tier 1, May 2026); pricing verified against multiple Tier-2 fare-tracking sources",
  },
  {
    date: "27 May 2026",
    tag: "Glasgow",
    headline: "Glasgow (GLA) added as a UK cabin-pet departure airport",
    body: "Glasgow joins Edinburgh as a second Scottish cabin-pet departure airport. KLM operates GLA → Amsterdam daily year-round on its published cabin policy, connecting onward to most of KLM's network in cabin (including the only cabin route into Dublin, KLM AMS→DUB). Lufthansa operates GLA → Frankfurt direct on its published cabin policy as well, but flagged in early 2026 that some Frankfurt-to-Glasgow flights would be rerouted via Zurich during the 2026 summer schedule — confirm with Lufthansa directly that your specific date is a direct flight before booking. Beyond these two carriers, Glasgow's cabin-out picture is much thinner than Edinburgh's. The journey planner now routes Glasgow users via KLM Amsterdam for cabin destinations Glasgow can't serve directly (rather than the previous default of 'get to Heathrow first', which is a 6+ hour drive when Edinburgh is only an hour away). GLA is also on the UK government's pet-approved list for cargo-into-UK with Air France-KLM Martinair Cargo, Emirates SkyCargo, TUI Airways, United and Air Transat Cargo — though, as with every UK airport, no cabin pets INTO the UK on any airline.",
    source: "gov.uk approved air routes (updated April 2026); KLM and Lufthansa published cabin policies",
  },
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
    body: "EU pet passports may now only be issued to, and used by, owners whose main residence is in the EU. A GB resident can no longer use one to take a pet from Great Britain into the EU — even a passport issued before this date — and needs an Animal Health Certificate for each trip instead. The AHC's validity was extended from 4 to 6 months at the same time. Note the direction: Great Britain's own entry rules did NOT change, and an EU pet passport is still an accepted document for bringing a pet INTO GB.",
    source: "EU Commission travel-with-pets guidance",
  },
  ETIHAD_UPDATE,
  {
    date: "Apr–May 2026",
    tag: "Alaska Airlines",
    headline: "Alaska Airlines expanded its long-haul passenger network — but not pet service",
    body: "Alaska launched year-round SEA ⇄ Seoul (April 2026), SEA ⇄ London Heathrow (May 2026) and SEA ⇄ Rome (April 2026), with SEA ⇄ Reykjavík seasonal from May 28. These are PASSENGER routes only — Alaska's own pet pages list Europe (all), London, Japan (all) and Seoul as NOT pet-accepted, so none of the new long-haul routes carry cabin pets. For US West Coast → Asia pet travel, route via United (SEA→SFO then SFO→Tokyo cabin) or Korean Air to Seoul; for Europe/UK, connect via an EU hub on Delta/KLM/Lufthansa.",
    source: "Alaska Airlines pet pages (alaskaair.com/content/travel-info/policies/pets-traveling-international), verified May 2026",
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
    body: "Russian airspace remains closed to UK, US, EU and Canadian carriers, and reciprocally Russia's own carriers (Aeroflot) cannot fly to most Western destinations. Ukrainian commercial airspace remains closed to passenger flights (EASA's conflict-zone advisory has been rolled forward repeatedly since 2022; the current extension runs to 31 July 2026). The only realistic cabin route in or out of Russia is via Aeroflot's remaining ~17-country network through Istanbul, Dubai or Delhi; in or out of Ukraine, the realistic route is overland from Poland via train or specialist road shipper. One paperwork change worth flagging: Russia was removed from the EU's listed-country list on 16 September 2024, so — like Ukraine, which was never listed — a rabies titre test plus a three-month wait is now required to bring a pet back into the EU or UK from either country. Full detail on the new Russia & Ukraine guide.",
    source: "Aeroflot, EASA, EU Commission, USDA APHIS — see the Russia & Ukraine guide",
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
        {/* Per-page Open Graph. _document.js supplies site-wide defaults;
            next/head dedupes by property, so these override them for this
            page only. Without these every page shared the homepage's
            OG identity — which Google was substituting for the page's own
            meta description in search results. */}
        <meta property="og:title" content="Updates — Pet Travel Rule Changes" />
        <meta property="og:description" content="A timestamped archive of recent rule changes affecting pet travel — airlines, regulators, and routes. Updated as the rules change." />
        <meta property="og:url" content="https://www.petsincabin.com/updates" />
        <meta property="og:type" content="website" />
        <meta name="twitter:title" content="Updates — Pet Travel Rule Changes" />
        <meta name="twitter:description" content="A timestamped archive of recent rule changes affecting pet travel — airlines, regulators, and routes. Updated as the rules change." />
      </Head>

      <div className="min-h-screen" style={{ backgroundColor: "#faf6ed", fontFamily: "'Inter', -apple-system, sans-serif" }}>
        <style>{`
          @import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,400;0,9..144,500;0,9..144,600;1,9..144,400;1,9..144,500&family=Inter:wght@400;500;600&display=swap');
          .font-serif { font-family: 'Fraunces', Georgia, serif; font-optical-sizing: auto; }
        `}</style>

        {/* Nav */}
        <nav className="border-b border-stone-300 px-6 md:pl-5 md:pr-10 py-4" style={{ backgroundColor: "rgba(250, 246, 237, 0.98)" }}>
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
              <Link href="/how-we-check" className="hover:text-amber-700 transition-colors">How we check</Link>
              <Link href="/privacy" className="hover:text-amber-700 transition-colors">Privacy</Link>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
}
