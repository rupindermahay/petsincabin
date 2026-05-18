import Head from "next/head";
import Link from "next/link";

export default function About() {
  return (
    <>
      <Head>
        <title>About — Pets in Cabin · By Theo's Mum</title>
        <meta name="description" content="The story behind Pets in Cabin — built by Theo's Mum after one too many 2am Google spirals trying to fly internationally with a small dog. A real guide for real pet parents." />
        <link rel="canonical" href="https://www.petsincabin.com/about" />
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

        <main className="max-w-2xl mx-auto px-6 py-16 md:py-24">

          {/* Kicker */}
          <div className="text-xs uppercase tracking-[0.25em] text-amber-700 mb-6">About this guide</div>

          {/* Headline */}
          <h1 className="font-serif text-5xl md:text-6xl leading-[1.0] text-stone-900 mb-8">
            Hi, I'm Theo's mum.
          </h1>

          {/* Photo strip — three photos, compact and horizontal */}
          <div className="grid grid-cols-3 gap-3 mb-10">
            <img src="/theo-gate.jpg" alt="Theo in his carrier at the departure gate" className="w-full h-40 object-cover rounded-sm" style={{ objectPosition: "center 65%" }} />
            <img src="/theo-carrier-seat.jpg" alt="Theo asleep under the airplane seat" className="w-full h-40 object-cover rounded-sm" style={{ objectPosition: "center 70%" }} />
            <img src="/theo-balcony.jpg" alt="Theo on the Miami balcony" className="w-full h-40 object-cover rounded-sm" style={{ objectPosition: "center 60%" }} />
          </div>
          <p className="font-sans text-[10px] uppercase tracking-widest text-stone-400 -mt-8 mb-10 text-center">
            Theo · Chihuahua · 9 years old · 5.8 kg · Main character energy
          </p>

          {/* Body — your text, verbatim, with search terms woven in naturally */}
          <div className="font-serif text-lg md:text-xl text-stone-800 leading-[1.8] space-y-6">

            <p>
              Chief overthinker, serial airline-policy checker, and emotional support human to a 9-year-old Chihuahua with main character energy.
            </p>

            <p>
              This project started after trying to plan an international relocation with a pet in cabin and discovering the internet is full of conflicting airline rules, vague destination guidance, outdated pet travel advice, and enough paperwork to make anyone spiral at 2am. After many sleepless nights stress-Googling things like <em>"Can my dog fly internationally in cabin?"</em> and <em>"Why does every airline have different pet carrier dimensions?"</em>, I figured other pet parents were probably suffering too.
            </p>

            <p>
              So I built this site to make international pet travel easier, clearer, and a little less chaotic. From airline pet policies and in-cabin dog travel tips to tricky destination requirements and relocation checklists, everything here is designed for pet parents trying to navigate <strong>flying with a dog</strong> — or a cat — without losing their sanity.
            </p>

            <p>
              Because moving abroad with pets is stressful enough without having to open 14 tabs, cross-reference embassy websites, and decode airline fine print like it's a legal contract.
            </p>

            <hr className="border-stone-300 my-8" />

            <div className="space-y-4 text-base md:text-lg text-stone-600">
              <p><strong className="text-stone-800">The route that started it all:</strong> London Heathrow → Montreal (overnight) → Miami. Air Canada out of Heathrow, then American Airlines on to Miami — in cabin the whole way. Theo slept for most of it. I did not.</p>

              <p><strong className="text-stone-800">What this site is:</strong> a practical, real-world guide to <strong>pets in cabin</strong> travel — which airlines actually allow it, what paperwork each country needs, which routes work and which don't, and the workarounds when your destination makes it difficult (looking at you, UK).</p>

              <p><strong className="text-stone-800">What this site isn't:</strong> a substitute for checking the airline's current policy directly before you book. Rules change. I update things when I find errors, but always verify.</p>

              <p><strong className="text-stone-800">Who it's for:</strong> anyone trying to figure out how to fly internationally with a small dog or cat in the cabin — without the 14-tab spiral.</p>
            </div>

            <hr className="border-stone-300 my-8" />

            <p className="text-base text-stone-500 font-sans">
              Got a route that's not covered, found an error, or just want to share how your trip went? <Link href="/#contact" className="text-amber-700 underline decoration-amber-300 underline-offset-4 hover:text-amber-600">Get in touch</Link> — I genuinely read everything.
            </p>

            {/* Ko-fi tip jar — warmer, more personal placement than the
                sitewide footer button. Same trust-protecting framing. */}
            <div className="mt-8 bg-amber-50 border border-amber-200 rounded-sm p-6">
              <div className="font-serif text-xl text-stone-900 mb-2">If this site helped you</div>
              <p className="text-base text-stone-600 mb-4 leading-relaxed">
                Pets in Cabin is free, and it's a one-person project — I research the airlines, check the country rules, and keep it all up to date myself. There are no ads and nothing behind a paywall. If the guide saved you some stress or a wrong turn, you can buy me a coffee. It's entirely optional, and the guide stays exactly the same either way — but it's a lovely thing to receive, and it helps keep everything maintained and accurate.
              </p>
              <a
                href="https://ko-fi.com/theosmum"
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => {
                  if (typeof window !== "undefined" && window.gtag) {
                    window.gtag("event", "kofi_click", { event_category: "support", location: "about_page" });
                  }
                }}
                className="inline-flex items-center gap-2 bg-amber-600 hover:bg-amber-500 text-white px-4 py-2.5 text-sm font-medium transition-colors rounded-sm"
              >
                <span aria-hidden="true">☕</span>
                Buy me a coffee
              </a>
            </div>

          </div>
        </main>

        {/* Footer */}
        <footer className="border-t border-stone-300 px-6 py-10 mt-8">
          <div className="max-w-2xl mx-auto flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <img src="/logo.png" alt="Pets in Cabin" className="w-10 h-10 rounded-full object-cover" />
              <div>
                <div className="font-serif italic text-stone-700 text-sm">Pets in Cabin</div>
                <div className="font-serif italic text-stone-400 text-xs">Travel together, stay together</div>
              </div>
            </div>
            <div className="flex gap-6 text-xs uppercase tracking-widest text-stone-400">
              <Link href="/" className="hover:text-amber-700 transition-colors">The guide</Link>
              <Link href="/privacy" className="hover:text-amber-700 transition-colors">Privacy</Link>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
}
