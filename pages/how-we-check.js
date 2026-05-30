import Head from "next/head";
import Link from "next/link";

export default function HowWeCheck() {
  return (
    <>
      <Head>
        <title>How We Check (2026): Our Sourcing &amp; Verification Method | Pets in Cabin</title>
        <meta
          name="description"
          content="The whole point of Pets in Cabin is that the info is actually checked. Airline policies read straight from the airline's own page, rules from the CDC, USDA APHIS and each country's own authority — and where we can't be sure, we say so."
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

          <p className="font-serif text-lg md:text-xl text-stone-700 leading-relaxed mb-6">
            Plenty of sites will tell you an airline is &ldquo;pet-friendly,&rdquo; and that&rsquo;s a kind thing to know. But it&rsquo;s usually not the question that matters. What you really need is whether <em>this</em> airline takes a cabin pet on <em>this</em> route, in <em>this</em> direction, at your pet&rsquo;s weight — and that&rsquo;s where the easy answers tend to run out.
          </p>

          <p className="font-serif text-lg md:text-xl text-stone-700 leading-relaxed mb-10">
            So here&rsquo;s how this site is put together, and how much to trust it. It&rsquo;s a quick read, promise.
          </p>

          {/* STRAIGHT FROM THE SOURCE */}
          <h2 className="font-serif text-2xl md:text-3xl text-stone-900 mb-3">Straight from the horse&rsquo;s mouth</h2>
          <p className="font-serif text-stone-700 leading-relaxed mb-4">
            Airline rules come from the airline&rsquo;s own page. Country rules come from the people who actually enforce them — the{" "}
            <a href="https://www.cdc.gov/importation/dogs/index.html" target="_blank" rel="noopener noreferrer" className="text-amber-700 underline decoration-amber-300 underline-offset-2 hover:text-amber-800">CDC</a>,{" "}
            <a href="https://www.aphis.usda.gov/pet-travel" target="_blank" rel="noopener noreferrer" className="text-amber-700 underline decoration-amber-300 underline-offset-2 hover:text-amber-800">USDA APHIS</a>,{" "}
            <a href="https://www.gov.uk/take-pet-abroad" target="_blank" rel="noopener noreferrer" className="text-amber-700 underline decoration-amber-300 underline-offset-2 hover:text-amber-800">gov.uk</a>, and each destination&rsquo;s own vet authority.
          </p>
          <p className="font-serif text-stone-700 leading-relaxed mb-10">
            The travel blogs and aggregators? Handy for sniffing out routes, never the final word. They summarise — and a summary is exactly where the one country with a sneaky cargo-only carve-out gets quietly tidied away. When a blog and the airline disagree, the airline wins, and we flag the spat rather than pretending it didn&rsquo;t happen.
          </p>

          {/* THE FINE PRINT */}
          <h2 className="font-serif text-2xl md:text-3xl text-stone-900 mb-3">We read the boring bits</h2>
          <p className="font-serif text-stone-700 leading-relaxed mb-4">
            One little word can flip the whole answer. &ldquo;Cabin pets <em>to</em> London&rdquo; blocks one direction. &ldquo;<em>To and from</em> London&rdquo; blocks both. &ldquo;Cargo only&rdquo; still gets your pet on the plane; &ldquo;not available&rdquo; means there&rsquo;s no plane to get them on. Same vibe, wildly different trip.
          </p>
          <p className="font-serif text-stone-700 leading-relaxed mb-10">
            So we read the actual words on the actual page — not someone&rsquo;s paraphrase of them. And the wording here matches how sure the source is. If an airline says &ldquo;on select routes,&rdquo; we&rsquo;re not going to slap a confident &ldquo;✓ cabin&rdquo; on it and send you off to find out the hard way.
          </p>

          {/* TIMES */}
          <h2 className="font-serif text-2xl md:text-3xl text-stone-900 mb-3">About those flight times</h2>
          <p className="font-serif text-stone-700 leading-relaxed mb-10">
            A real number means we can stand behind it — one city pair, one verified nonstop. A range means the leg genuinely wobbles (a vague gateway, a choice of hubs, no reliable nonstop), and we&rsquo;d rather be honestly approximate than confidently wrong. If there&rsquo;s no nonstop at all, we say that too — no inventing a tidy time for a flight you can&rsquo;t actually book.
          </p>

          {/* THE FINE FINE PRINT */}
          <h2 className="font-serif text-2xl md:text-3xl text-stone-900 mb-3">The bit where we&rsquo;re honest</h2>
          <p className="font-serif text-stone-700 leading-relaxed mb-4">
            This is a reference, not a promise. Three things to keep in your back pocket:
          </p>
          <ul className="space-y-3 mb-6">
            <li className="font-serif text-stone-700 leading-relaxed pl-5 relative">
              <span className="absolute left-0 text-amber-600">·</span>
              <strong>Rules move fast.</strong> Airspace closures, CDC dog-rule tweaks, seasonal routes that vanish — everything here carries the month it was checked, so always confirm before you book <em>and</em> before you fly.
            </li>
            <li className="font-serif text-stone-700 leading-relaxed pl-5 relative">
              <span className="absolute left-0 text-amber-600">·</span>
              <strong>Your details change the answer.</strong> Species, weight, age, breed, exact airports, direction — any of them can flip a rule. We&rsquo;ve got the general case; your case might be its own little adventure.
            </li>
            <li className="font-serif text-stone-700 leading-relaxed pl-5 relative">
              <span className="absolute left-0 text-amber-600">·</span>
              <strong>We&rsquo;re never the final word.</strong> That&rsquo;s your airline, your vet, and the country you&rsquo;re heading to. We&rsquo;re just here to get you asking them the right questions, early.
            </li>
          </ul>
          <p className="font-serif text-stone-700 leading-relaxed mb-10">
            And if something here is wrong — a policy shifted, a route got pulled — tell me and I&rsquo;ll fix it fast, everywhere it appears.{" "}
            <a href="mailto:petincabinguide@gmail.com" className="text-amber-700 underline decoration-amber-300 underline-offset-2 hover:text-amber-800">petincabinguide@gmail.com</a>. I read every one.
          </p>

          <p className="font-sans text-xs text-stone-400 leading-relaxed mt-4 text-center">
            A reference, not a substitute for the airline&rsquo;s official policy, your vet&rsquo;s advice, or the receiving country&rsquo;s government rules. Always confirm the current requirements directly before booking and before travel.
          </p>

          {/* Related guides */}
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
