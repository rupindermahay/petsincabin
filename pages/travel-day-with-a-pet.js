import Head from "next/head";
import Link from "next/link";
import { TRAVEL_DAY_GUIDE } from "../components/travelDayGuide";

export default function TravelDayWithAPet() {
  return (
    <>
      <Head>
        <title>Flying with a Pet: What to Expect at the Airport (Step-by-Step) | Pets in Cabin</title>
        <meta
          name="description"
          content="The full walkthrough of an airport day flying with a dog or cat in the cabin — from the morning at home, through check-in, security, the gate, the flight, and arrival. Practical, honest, no fluff."
        />
        <link rel="canonical" href="https://www.petsincabin.com/travel-day-with-a-pet" />
      </Head>

      <div
        className="min-h-screen"
        style={{ backgroundColor: "#faf6ed", fontFamily: "'Inter', -apple-system, sans-serif" }}
      >
        <style>{`
          @import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,400;0,9..144,500;0,9..144,600;1,9..144,400;1,9..144,500&family=Inter:wght@400;500;600&display=swap');
          .font-serif { font-family: 'Fraunces', Georgia, serif; font-optical-sizing: auto; }
        `}</style>

        {/* Nav */}
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

          {/* Kicker */}
          <div className="text-xs uppercase tracking-[0.25em] text-amber-700 mb-6">
            Travel day with a pet · The airport guide
          </div>

          {/* Headline */}
          <h1 className="font-serif text-4xl md:text-5xl leading-[1.05] text-stone-900 mb-6">
            Flying with a pet: <span className="italic text-stone-600">what to expect at the airport</span>.
          </h1>

          <p className="font-serif text-lg md:text-xl text-stone-700 leading-relaxed mb-8">
            Whether it's your first time flying with a dog or cat, or your tenth, the airport day has its own choreography — pet check-in, TSA security with a pet, the carrier turn-around test, pet relief areas, gate-side priority boarding, settling on the plane, and arrival. This is the full walkthrough — eight stages in journey order, from the morning at home through to walking out of the destination terminal.
          </p>
          <p className="font-serif text-stone-600 leading-relaxed mb-8 italic">
            The paperwork prep gets you to the airport; this is what happens once you're there.
          </p>

          {/* Jump-to nav for the page */}
          <div className="bg-white border border-stone-200 rounded-sm p-5 mb-12">
            <div className="text-xs uppercase tracking-widest text-stone-500 mb-3">Skip to a stage</div>
            <div className="flex flex-wrap gap-2 text-sm">
              {TRAVEL_DAY_GUIDE.stages.map((s) => (
                <a
                  key={s.id}
                  href={`#${s.id}`}
                  className="text-stone-700 hover:text-amber-700 underline decoration-stone-300 hover:decoration-amber-600 underline-offset-4"
                >
                  {s.title}
                </a>
              ))}
            </div>
          </div>

          <div className="h-px bg-stone-300 mb-12" />

          {/* The eight stages — full content */}
          {TRAVEL_DAY_GUIDE.stages.map((s, i) => (
            <section key={s.id} id={s.id} className="mb-14 scroll-mt-24">
              <div className="text-xs uppercase tracking-[0.25em] text-amber-700 mb-3">{s.kicker}</div>
              <h2 className="font-serif text-2xl md:text-3xl text-stone-900 mb-3 leading-tight">
                {s.title}
              </h2>
              <p className="font-serif italic text-stone-600 text-lg mb-6 leading-snug">
                {s.summary}
              </p>

              <div className="space-y-5">
                {s.points.map((p, j) => (
                  <div key={j}>
                    <h3 className="font-serif text-lg text-stone-900 mb-1.5">
                      {p.h}
                    </h3>
                    <p className="font-serif text-stone-700 leading-relaxed">
                      {p.p}
                    </p>
                  </div>
                ))}
              </div>

              {i < TRAVEL_DAY_GUIDE.stages.length - 1 && (
                <div className="h-px bg-stone-200 mt-12" />
              )}
            </section>
          ))}

          {/* CTA back to tools */}
          <div className="bg-stone-900 text-stone-100 rounded-sm p-8 text-center mt-12">
            <h2 className="font-serif text-2xl text-stone-50 mb-3">Map your full journey</h2>
            <p className="font-serif text-stone-300 leading-relaxed mb-6">
              This is the airport day. The other half is the paperwork — country-specific, route-aware. The journey planner does that part for you.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link
                href="/?go=planner"
                className="inline-block bg-amber-600 text-white px-6 py-3 text-sm uppercase tracking-widest font-medium hover:bg-amber-500 transition-colors"
              >
                Open the journey planner
              </Link>
              <Link
                href="/?go=checklist"
                className="inline-block border border-stone-600 text-stone-200 px-6 py-3 text-sm uppercase tracking-widest font-medium hover:border-amber-500 hover:text-amber-400 transition-colors"
              >
                Get my prep checklist
              </Link>
            </div>
          </div>

          {/* Footer note */}
          <p className="font-sans text-xs text-stone-400 leading-relaxed mt-12 text-center">
            Written by Theo's Mum, from real airport days flying a Chihuahua across the Atlantic. Airline and airport procedures vary — always confirm specifics with your airline before you fly.
          </p>

          {/* Related guides — cross-links to other country/topic pages */}
          <div className="mt-16 pt-10 border-t border-stone-300">
            <div className="text-xs uppercase tracking-[0.25em] text-amber-700 mb-2">Related guides</div>
            <h2 className="font-serif text-2xl text-stone-900 mb-6">More from the pets-in-cabin guide</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <Link href="/uk-pet-travel" className="block bg-stone-50 border border-stone-200 hover:border-amber-300 transition-colors p-4 rounded-sm">
                <div className="font-serif text-base text-stone-900 mb-1">UK guide →</div>
                <div className="text-xs text-stone-600 leading-relaxed">Paris Pivot day-of logistics — Eurotunnel timing and what to bring.</div>
              </Link>

              <Link href="/india-pet-travel" className="block bg-stone-50 border border-stone-200 hover:border-amber-300 transition-colors p-4 rounded-sm">
                <div className="font-serif text-base text-stone-900 mb-1">India guide →</div>
                <div className="text-xs text-stone-600 leading-relaxed">Long-haul day with multiple connections + NOC paperwork at customs.</div>
              </Link>

              <Link href="/japan-pet-travel" className="block bg-stone-50 border border-stone-200 hover:border-amber-300 transition-colors p-4 rounded-sm">
                <div className="font-serif text-base text-stone-900 mb-1">Japan guide →</div>
                <div className="text-xs text-stone-600 leading-relaxed">Long-haul day specifics for the 180-day-prepared trip.</div>
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
