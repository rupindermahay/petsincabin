import Head from "next/head";
import Link from "next/link";

export default function HowWeCheck() {
  return (
    <>
      <Head>
        <title>How We Check (2026): Our Sourcing &amp; Verification Method | Pets in Cabin</title>
        <meta
          name="description"
          content="Pets in Cabin's whole point is that the information is actually checked. Here's exactly how: airline policies read word-by-word from each carrier's own page, government rules taken from the CDC, USDA APHIS and destination authorities, and a discipline for catching the carve-outs that summary sites miss."
        />
        <link rel="canonical" href="https://www.petsincabin.com/how-we-check" />
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
            About this site · How we check
          </div>

          <h1 className="font-serif text-4xl md:text-5xl leading-[1.05] text-stone-900 mb-6">
            How we <span className="italic text-stone-600">actually check</span>.
          </h1>

          <div className="bg-white border border-stone-200 rounded-sm p-5 mb-8">
            <div className="text-xs uppercase tracking-widest text-stone-500 mb-3">On this page</div>
            <div className="flex flex-wrap gap-2 text-sm">
              <a href="#why" className="text-stone-700 hover:text-amber-700 underline decoration-stone-300 hover:decoration-amber-600 underline-offset-4">Why this page exists</a>
              <a href="#sources" className="text-stone-700 hover:text-amber-700 underline decoration-stone-300 hover:decoration-amber-600 underline-offset-4">Where the facts come from</a>
              <a href="#word-level" className="text-stone-700 hover:text-amber-700 underline decoration-stone-300 hover:decoration-amber-600 underline-offset-4">Reading the fine print</a>
              <a href="#times" className="text-stone-700 hover:text-amber-700 underline decoration-stone-300 hover:decoration-amber-600 underline-offset-4">Flight times</a>
              <a href="#limits" className="text-stone-700 hover:text-amber-700 underline decoration-stone-300 hover:decoration-amber-600 underline-offset-4">What we can't promise</a>
              <a href="#wrong" className="text-stone-700 hover:text-amber-700 underline decoration-stone-300 hover:decoration-amber-600 underline-offset-4">If we get it wrong</a>
            </div>
          </div>

          <p className="font-serif text-lg md:text-xl text-stone-700 leading-relaxed mb-8">
            There are plenty of pages on the internet that will tell you an airline is &ldquo;pet-friendly.&rdquo; The trouble is that pet-friendly is rarely the question that matters. The question is whether <em>this</em> airline takes a cabin pet on <em>this</em> route, in <em>this</em> direction, at your pet&rsquo;s weight — and that&rsquo;s where most of the easy answers fall apart. This page explains how the information here is put together, so you can judge how much to trust it.
          </p>

          <p className="font-serif italic text-stone-600 leading-relaxed mb-12">
            The short version: airline policies are read word-by-word from each carrier&rsquo;s own page, government rules come from the CDC, USDA APHIS and the destination country&rsquo;s own authority, and every claim is written to match exactly how confident the source actually is — no more.
          </p>

          {/* WHY */}
          <section id="why" className="mb-12">
            <h2 className="font-serif text-2xl md:text-3xl text-stone-900 mb-4">Why this page exists</h2>
            <p className="font-serif text-stone-700 leading-relaxed mb-4">
              Moving a pet across a border is one of those situations where a small wrong detail is expensive. A carrier that turns out to be cargo-only into the UK, a rabies titer test that needed to be done three months earlier, a return form that had to be filled in <em>before</em> you left — these aren&rsquo;t things you want to discover at a check-in desk. So the bar for what goes on this site is higher than &ldquo;it sounds about right.&rdquo;
            </p>
            <p className="font-serif text-stone-700 leading-relaxed">
              The differentiator here is meant to be simple: the information is checked, and where it can&rsquo;t be checked, that&rsquo;s said plainly rather than papered over. This page is the receipt for that claim.
            </p>
          </section>

          {/* SOURCES */}
          <section id="sources" className="mb-12">
            <h2 className="font-serif text-2xl md:text-3xl text-stone-900 mb-4">Where the facts come from</h2>
            <p className="font-serif text-stone-700 leading-relaxed mb-4">
              Sources are ranked. A claim is only as good as the most authoritative place it can be traced to, and the order is always the same:
            </p>
            <div className="bg-white border border-stone-200 rounded-sm p-5 mb-4">
              <p className="font-serif text-stone-800 leading-relaxed mb-3">
                <strong>First, the primary source.</strong> For an airline&rsquo;s pet policy, that&rsquo;s the airline&rsquo;s own current page. For an import rule, it&rsquo;s the government authority that enforces it — the{" "}
                <a href="https://www.cdc.gov/importation/dogs/index.html" target="_blank" rel="noopener noreferrer" className="text-amber-700 underline decoration-amber-300 underline-offset-2 hover:text-amber-800">CDC</a>{" "}
                for dogs entering the United States, the{" "}
                <a href="https://www.aphis.usda.gov/pet-travel" target="_blank" rel="noopener noreferrer" className="text-amber-700 underline decoration-amber-300 underline-offset-2 hover:text-amber-800">USDA APHIS</a>{" "}
                country pages for pets leaving the US, the UK&rsquo;s{" "}
                <a href="https://www.gov.uk/take-pet-abroad" target="_blank" rel="noopener noreferrer" className="text-amber-700 underline decoration-amber-300 underline-offset-2 hover:text-amber-800">gov.uk</a>{" "}
                pet-travel pages, and each destination&rsquo;s equivalent veterinary authority.
              </p>
              <p className="font-serif text-stone-800 leading-relaxed">
                <strong>Second, and only to fill gaps, the summary sites.</strong> The aggregator and travel-blog pages are useful for finding routes and getting a rough lay of the land — but they&rsquo;re never the last word, because they summarise. A summary is exactly where a country-specific carve-out gets smoothed away. When a summary site and an airline&rsquo;s own page disagree, the airline&rsquo;s page wins, and the disagreement gets flagged rather than quietly resolved.
              </p>
            </div>
            <p className="font-serif text-stone-700 leading-relaxed">
              That second rule matters more than it looks. Several airlines are genuinely cabin-friendly across most of their network but route one specific country through cargo — and that&rsquo;s precisely the detail the summaries miss, because they answer &ldquo;is this airline cabin-friendly?&rdquo; rather than &ldquo;does this country have an exception?&rdquo;
            </p>
          </section>

          {/* WORD LEVEL */}
          <section id="word-level" className="mb-12">
            <h2 className="font-serif text-2xl md:text-3xl text-stone-900 mb-4">Reading the fine print word by word</h2>
            <p className="font-serif text-stone-700 leading-relaxed mb-4">
              On a question like this, single words carry the whole meaning. &ldquo;Cabin pets accepted <em>to</em> London&rdquo; and &ldquo;cabin pets accepted <em>to and from</em> London&rdquo; look almost identical and mean completely different things — one blocks inbound travel only, the other blocks both directions. &ldquo;Not available&rdquo; is a stronger statement than &ldquo;cargo only&rdquo;: cargo-only still gets your pet on the plane, while not-available means no service at all.
            </p>
            <p className="font-serif text-stone-700 leading-relaxed mb-4">
              So airline restrictions are read at the level of the actual preposition on the carrier&rsquo;s own page, not through someone else&rsquo;s paraphrase. This cuts both ways. It catches cases where the site would otherwise over-claim — saying a route works when the airline quietly excludes it — and it also catches the reverse, where a summary makes a perfectly valid route look blocked. A correction only gets made when the airline&rsquo;s own wording actually supports it.
            </p>
            <p className="font-serif text-stone-700 leading-relaxed">
              The wording you read here is meant to match the confidence of the source. If a carrier says &ldquo;on select international routes,&rdquo; you won&rsquo;t see a flat &ldquo;✓ cabin&rdquo; here without that qualifier attached. When two of an airline&rsquo;s own documents disagree — a binding terms-and-conditions PDF saying one thing and a customer FAQ saying another — both are noted, and you&rsquo;re told to confirm at booking rather than being handed a false certainty.
            </p>
          </section>

          {/* TIMES */}
          <section id="times" className="mb-12">
            <h2 className="font-serif text-2xl md:text-3xl text-stone-900 mb-4">Flight times</h2>
            <p className="font-serif text-stone-700 leading-relaxed mb-4">
              The journey planner shows a specific flight time whenever it can stand behind one — a single known city pair with a verified nonstop duration gets a real number, checked against the airline&rsquo;s schedule or current route data. Where the planner shows a range instead, that&rsquo;s deliberate: it means the leg genuinely varies — a generic gateway, a choice of hubs, or a city pair without a reliable nonstop — and a single fabricated figure would be misleading.
            </p>
            <p className="font-serif text-stone-700 leading-relaxed">
              In other words, a range is an honest answer, not a lazy one. Where no nonstop service actually exists between two cities, the planner says so rather than inventing a plausible-looking time for a flight you couldn&rsquo;t book.
            </p>
          </section>

          {/* LIMITS */}
          <section id="limits" className="mb-12">
            <h2 className="font-serif text-2xl md:text-3xl text-stone-900 mb-4">What we can&rsquo;t promise</h2>
            <p className="font-serif text-stone-700 leading-relaxed mb-4">
              This is a reference, not a substitute for the airline&rsquo;s official policy or your vet&rsquo;s advice — and not a booking guarantee. Three honest limits are worth stating plainly:
            </p>
            <ul className="space-y-3 mb-4">
              <li className="font-serif text-stone-700 leading-relaxed pl-5 relative">
                <span className="absolute left-0 text-amber-600">·</span>
                <strong>Rules change, sometimes overnight.</strong> Airspace closures, CDC dog-rule updates, screwworm restrictions, seasonal routes — these move faster than any single page can. Everything here carries the month it was checked, and the standing instruction is always to confirm directly before you book and again before you fly.
              </li>
              <li className="font-serif text-stone-700 leading-relaxed pl-5 relative">
                <span className="absolute left-0 text-amber-600">·</span>
                <strong>Your specifics change the answer.</strong> Your pet&rsquo;s species, weight, age and breed, the exact airports, and the direction of travel can all flip a rule. The guidance here is the general case; your case may differ.
              </li>
              <li className="font-serif text-stone-700 leading-relaxed pl-5 relative">
                <span className="absolute left-0 text-amber-600">·</span>
                <strong>The final authority is never us.</strong> It&rsquo;s the airline, your vet, and the receiving country&rsquo;s government. This site is here to get you asking the right questions of the right people, well ahead of time.
              </li>
            </ul>
          </section>

          {/* WRONG */}
          <section id="wrong" className="mb-8">
            <h2 className="font-serif text-2xl md:text-3xl text-stone-900 mb-4">If we get something wrong</h2>
            <p className="font-serif text-stone-700 leading-relaxed mb-4">
              Despite the care, things will occasionally be out of date or mistaken — a policy changes the week after it&rsquo;s checked, a route gets suspended, a fee moves. If you spot something that doesn&rsquo;t match what an airline or government page is telling you, please say so. Corrections are taken seriously and made quickly, and a fix to one fact is traced through every place that fact appears, not just the page you happened to be reading.
            </p>
            <p className="font-serif text-stone-700 leading-relaxed">
              You can reach me at{" "}
              <a href="mailto:petincabinguide@gmail.com" className="text-amber-700 underline decoration-amber-300 underline-offset-2 hover:text-amber-800">petincabinguide@gmail.com</a>.
            </p>
          </section>

          <p className="font-sans text-xs text-stone-400 leading-relaxed mt-12 text-center">
            This page describes the method behind Pets in Cabin. It is a reference, not a substitute for the airline&rsquo;s official policy, your veterinarian&rsquo;s advice, or the receiving country&rsquo;s government requirements. Always confirm the current rules directly before booking and before travel.
          </p>

          {/* Related guides — cross-links to other pages */}
          <div className="mt-16 pt-10 border-t border-stone-300">
            <div className="text-xs uppercase tracking-[0.25em] text-amber-700 mb-2">Related</div>
            <h2 className="font-serif text-2xl text-stone-900 mb-6">More from the pets-in-cabin guide</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <Link href="/about" className="block bg-stone-50 border border-stone-200 hover:border-amber-300 transition-colors p-4 rounded-sm">
                <div className="font-serif text-base text-stone-900 mb-1">About this guide →</div>
                <div className="text-xs text-stone-600 leading-relaxed">Who&rsquo;s behind Pets in Cabin, and why it exists.</div>
              </Link>

              <Link href="/travel-day-with-a-pet" className="block bg-stone-50 border border-stone-200 hover:border-amber-300 transition-colors p-4 rounded-sm">
                <div className="font-serif text-base text-stone-900 mb-1">Travel day guide →</div>
                <div className="text-xs text-stone-600 leading-relaxed">What to expect at the airport, step by step.</div>
              </Link>

              <Link href="/privacy" className="block bg-stone-50 border border-stone-200 hover:border-amber-300 transition-colors p-4 rounded-sm">
                <div className="font-serif text-base text-stone-900 mb-1">Privacy &amp; data →</div>
                <div className="text-xs text-stone-600 leading-relaxed">What this site collects, and what it doesn&rsquo;t.</div>
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
