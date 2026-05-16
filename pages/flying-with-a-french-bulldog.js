import Head from "next/head";
import Link from "next/link";

export default function FlyingWithAFrenchBulldog() {
  return (
    <>
      <Head>
        <title>Flying with a French Bulldog (2026): The Honest Guide | Pets in Cabin</title>
        <meta
          name="description"
          content="Your Frenchie is too big for cabin, brachycephalic, and most airlines won't touch them. Here's what actually works in 2026 — cargo airlines that take snub-nosed dogs, the Queen Mary 2 transatlantic, K9 Jets pet charters, and what could kill your dog (sedation, summer cargo, the wrong airline). For Bulldogs, Pugs, Boston Terriers, Shih Tzus and other flat-faced breeds too."
        />
        <link rel="canonical" href="https://www.petsincabin.com/flying-with-a-french-bulldog" />
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
            Breed guide · Brachycephalic dogs
          </div>

          <h1 className="font-serif text-4xl md:text-5xl leading-[1.05] text-stone-900 mb-6">
            Flying with a <span className="italic text-stone-600">French Bulldog</span>.
          </h1>

          <p className="font-serif text-lg md:text-xl text-stone-700 leading-relaxed mb-6">
            Your Frenchie is too heavy for cabin (most are over the 8 kg airline limit). She's brachycephalic, which means most airlines won't take her in cargo either. You've been quoted prices that made you wince. You've read horror stories. You're stuck.
          </p>

          <p className="font-serif text-lg text-stone-700 leading-relaxed mb-8">
            This is the honest, complete guide. We're not going to tell you it's easy, because it isn't. But there are real options, and one of them will work for you. <span className="italic text-stone-600">Also relevant if you have a Bulldog, Pug, Boston Terrier, Boxer, Shih Tzu, Pekingese, Cavalier, Persian cat, or any other flat-faced breed — the same rules apply across all of them.</span>
          </p>

          <p className="font-serif italic text-stone-600 leading-relaxed mb-12">
            Verified May 2026 against AVMA, IATA Live Animals Regulations, Lufthansa Cargo, KLM, Air France, Cunard, K9 Jets, and current airline policies. Things change — confirm specifics with each operator before booking.
          </p>

          <div className="bg-white border border-stone-200 rounded-sm p-5 mb-12">
            <div className="text-xs uppercase tracking-widest text-stone-500 mb-3">In this guide</div>
            <div className="flex flex-wrap gap-2 text-sm">
              <a href="#two-things-to-know" className="text-stone-700 hover:text-amber-700 underline decoration-stone-300 hover:decoration-amber-600 underline-offset-4">Two things to know first</a>
              <a href="#the-bad-news" className="text-stone-700 hover:text-amber-700 underline decoration-stone-300 hover:decoration-amber-600 underline-offset-4">Why this is so hard</a>
              <a href="#cargo-options" className="text-stone-700 hover:text-amber-700 underline decoration-stone-300 hover:decoration-amber-600 underline-offset-4">Airlines that still take brachys</a>
              <a href="#queen-mary" className="text-stone-700 hover:text-amber-700 underline decoration-stone-300 hover:decoration-amber-600 underline-offset-4">The Queen Mary 2</a>
              <a href="#k9-jets" className="text-stone-700 hover:text-amber-700 underline decoration-stone-300 hover:decoration-amber-600 underline-offset-4">K9 Jets &amp; pet charters</a>
              <a href="#summer-rules" className="text-stone-700 hover:text-amber-700 underline decoration-stone-300 hover:decoration-amber-600 underline-offset-4">Summer / heat embargos</a>
              <a href="#what-not-to-do" className="text-stone-700 hover:text-amber-700 underline decoration-stone-300 hover:decoration-amber-600 underline-offset-4">What not to do</a>
              <a href="#decision-tree" className="text-stone-700 hover:text-amber-700 underline decoration-stone-300 hover:decoration-amber-600 underline-offset-4">Which option is right for you</a>
            </div>
          </div>

          {/* TWO THINGS TO KNOW FIRST - top placement */}
          <section id="two-things-to-know" className="mb-14 scroll-mt-24">
            <div className="bg-red-50 border-l-4 border-red-600 p-6">
              <div className="text-xs uppercase tracking-[0.25em] text-red-700 mb-3 font-medium">Before you do anything else</div>
              <h2 className="font-serif text-2xl text-stone-900 mb-4 leading-tight">
                Two things that could kill your dog
              </h2>

              <div className="space-y-4">
                <div>
                  <h3 className="font-serif text-lg text-stone-900 mb-1">1. Never sedate a brachycephalic dog for a flight.</h3>
                  <p className="font-serif text-stone-700 leading-relaxed">
                    The AVMA, IATA, and every major airline explicitly say no. Sedatives relax the upper airway muscles in brachy dogs to the point of full airway obstruction at altitude. Half of all dogs that died during US air transport between 2005 and 2010 were brachycephalic — sedation makes those odds dramatically worse. Most airlines will refuse a sedated-looking pet at check-in. Talk to your vet about non-sedating anti-anxiety options like Trazodone or Gabapentin if needed — but never acepromazine, and never the first time on flight day.
                  </p>
                </div>

                <div>
                  <h3 className="font-serif text-lg text-stone-900 mb-1">2. Never put a Frenchie in summer cargo.</h3>
                  <p className="font-serif text-stone-700 leading-relaxed">
                    Tarmac temperatures regularly exceed 30°C (85°F) at most major airports between May and September. Most airlines impose heat embargos on brachycephalic breeds when ground temperatures exceed 27°C (80°F) — but some don't, and some make exceptions you don't want them making for your dog. If you're moving in summer and cargo is your only option, wait. Move in October–April, or use Queen Mary 2 / K9 Jets instead.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* THE BAD NEWS */}
          <section id="the-bad-news" className="mb-14 scroll-mt-24">
            <div className="text-xs uppercase tracking-[0.25em] text-amber-700 mb-3">01 · The bad news</div>
            <h2 className="font-serif text-2xl md:text-3xl text-stone-900 mb-3 leading-tight">
              Why flying with a Frenchie is so much harder than flying with a regular dog
            </h2>
            <p className="font-serif italic text-stone-600 text-lg mb-6 leading-snug">
              Three things stack against you. Each rules out a chunk of options.
            </p>

            <p className="font-serif text-stone-700 leading-relaxed mb-4">
              <strong>The weight problem.</strong> Cabin pet allowances on commercial airlines max out at 8 kg combined (pet + carrier) on most European carriers — Lufthansa, KLM, Air France, SAS, Iberia, SWISS, TAP, Aegean all use this number. American Airlines and United have no published weight limit but require the pet to fit under the seat in a carrier of about 18 × 11 × 11 inches. A typical adult French Bulldog is 11–14 kg (24–31 lb). She's just too big for cabin.
            </p>

            <p className="font-serif text-stone-700 leading-relaxed mb-4">
              <strong>The breed problem.</strong> Since January 2020, Lufthansa banned all brachycephalic breeds from cargo hold travel — permanently. United, American, and most major US carriers don't accept brachy breeds in cargo either. KLM and Air France have restrictions and seasonal embargos. The list of breeds affected: Bulldogs (English, French, American), Pugs, Boston Terriers, Boxers, Shih Tzus, Pekingese, Cavalier King Charles Spaniels, Lhasa Apso, Chow Chow, Shar Pei, Brussels Griffon, Affenpinscher — and for cats, Persian, Himalayan, British Shorthair, Exotic Shorthair, Scottish Fold.
            </p>

            <p className="font-serif text-stone-700 leading-relaxed mb-4">
              <strong>The country problem.</strong> Some destinations rule out cabin travel entirely regardless of your pet's size — the UK and Australia require pets to enter as manifested cargo only (commercial cabin is not an option, on any airline, ever). Ireland, Norway, and a few others have similar rules. So even if you found a magical airline that took a 13 kg Frenchie in cabin, the destination country might not let her arrive that way.
            </p>

            <p className="font-serif text-stone-700 leading-relaxed">
              The combination of these three creates the panic spiral you're in right now. The good news: real options exist. They're more expensive than a normal cabin booking, but they exist.
            </p>
          </section>

          {/* CARGO OPTIONS */}
          <section id="cargo-options" className="mb-14 scroll-mt-24">
            <div className="text-xs uppercase tracking-[0.25em] text-amber-700 mb-3">02 · Cargo options</div>
            <h2 className="font-serif text-2xl md:text-3xl text-stone-900 mb-3 leading-tight">
              Airlines that will still carry brachycephalic dogs (as cargo, not passenger baggage)
            </h2>
            <p className="font-serif italic text-stone-600 text-lg mb-6 leading-snug">
              Important distinction: "checked baggage" cargo (banned for brachys) vs. dedicated freight cargo (often still allowed).
            </p>

            <p className="font-serif text-stone-700 leading-relaxed mb-4">
              When airlines say "brachycephalic banned from cargo," they usually mean banned as <strong>AVIH/excess baggage</strong> — the route where the pet flies on the same plane as you, in the climate-controlled hold below the cabin. The other channel — <strong>manifested freight cargo</strong>, handled by the airline's freight division on freighter or belly-cargo flights — sometimes still accepts these breeds with extra requirements and the right paperwork. The pet may not be on your flight; it flies separately and gets collected at the freight terminal.
            </p>

            <p className="font-serif text-stone-700 leading-relaxed mb-4">
              <strong>Lufthansa Cargo</strong> — the freight division — still accepts brachycephalic breeds even though Lufthansa Passenger banned them. Pets fly through Frankfurt's Animal Lounge, widely considered the world's best pet cargo facility (climate-controlled, 24/7 vet on call, separated species areas). You need an IATA-compliant CR82 crate one size larger than standard, with ventilation on all four sides. Temperature embargos apply: if either origin or destination has tarmac temperatures above 27°C, the flight won't accept brachy breeds that day. Expect £1,500–£3,000 transatlantic, plus an agent fee on top.
            </p>

            <p className="font-serif text-stone-700 leading-relaxed mb-4">
              <strong>KLM Cargo</strong> via Amsterdam — similar to Lufthansa Cargo, brachycephalic accepted in freight with restrictions. KLM Passenger has stricter rules. Schiphol's pet handling is well-organised. Useful if your destination has direct KLM Cargo connections.
            </p>

            <p className="font-serif text-stone-700 leading-relaxed mb-4">
              <strong>Air France Cargo</strong> — accepts brachycephalic with extra paperwork and seasonal embargos. Charles de Gaulle has the second-best pet handling in Europe after Frankfurt.
            </p>

            <p className="font-serif text-stone-700 leading-relaxed mb-4">
              <strong>Specialist pet cargo airlines</strong> — companies like IAG Cargo (the freight division of BA/Iberia, used heavily for UK pet arrivals), Cathay Cargo, and Korean Air Cargo all run dedicated pet transport channels. They're typically booked through a relocation agent rather than directly.
            </p>

            <div className="bg-amber-50 border border-amber-200 rounded-sm p-5 mt-6">
              <h3 className="font-serif text-lg text-stone-900 mb-2">Use a pet relocation agent for cargo</h3>
              <p className="font-serif text-stone-700 leading-relaxed text-[15px]">
                For a brachycephalic dog going cargo, a professional pet relocation agent is genuinely worth the £400–£1,200 fee on top of the freight cost. They know which specific flights have working A/C in the holding facility, which crate suppliers ship with the right ventilation pattern, which routes have summer embargos active right now, and they handle paperwork end-to-end. Look for members of <span className="font-medium">IPATA</span> (International Pet and Animal Transport Association) — that's the industry body. Get three quotes and ask each one specifically: "have you moved a French Bulldog this route in the last 12 months?"
              </p>
            </div>
          </section>

          {/* QUEEN MARY 2 */}
          <section id="queen-mary" className="mb-14 scroll-mt-24">
            <div className="text-xs uppercase tracking-[0.25em] text-amber-700 mb-3">03 · The Queen Mary 2</div>
            <h2 className="font-serif text-2xl md:text-3xl text-stone-900 mb-3 leading-tight">
              The only way to take your Frenchie transatlantic without putting her on a plane
            </h2>
            <p className="font-serif italic text-stone-600 text-lg mb-6 leading-snug">
              Cunard's QM2 is the last working ocean liner. It has 24 kennels and runs Southampton/Hamburg ↔ New York all year. People with brachycephalic dogs swear by it.
            </p>

            <p className="font-serif text-stone-700 leading-relaxed mb-4">
              The Queen Mary 2 is the only passenger ship in the world that takes dogs and cats. Twenty-four kennels (12 upper, 12 lower) on Deck 12. Air-conditioned. A dedicated Kennel Master in a red bellhop uniform. Daily exercise time on a gated deck with a Liverpool lamp post and a New York fire hydrant — yes, really. Voyage time: 7 days each way.
            </p>

            <p className="font-serif text-stone-700 leading-relaxed mb-4">
              <strong>2026 pricing:</strong> $1,300 for an upper kennel (dogs under 25 lb / 11 kg) or $1,500 for a lower kennel (over 25 lb). That's per kennel, not per dog. Cats need two kennels (one for them, one for the litter tray) so $2,800 for two cats sharing. The kennel fee is on top of your own cabin fare for the cruise. Total cost for one Frenchie + one owner in a basic cabin: around $3,500–$6,000 each way.
            </p>

            <p className="font-serif text-stone-700 leading-relaxed mb-4">
              <strong>How to book:</strong> book your own cruise first, then call Cunard's contact centre to add the kennel. You can reserve up to 2 years in advance and the kennels routinely sell out 12+ months ahead — they're tiny on a ship of 2,691 passengers. There's a waitlist; many cruisers book and cancel, so last-minute spots open up sometimes.
            </p>

            <p className="font-serif text-stone-700 leading-relaxed mb-4">
              <strong>Size and breed restrictions:</strong> max 27 inches height at the shoulder, 35 inches nose to base of tail (or 60 inches if you book two adjacent kennels). Frenchies fit comfortably. Banned breeds: dogs prohibited by the UK (Pit Bull, XL Bully, Tosa, Dogo Argentino, Fila Brasileiro) plus dogs too large for the kennels (Great Danes, Mastiffs, Bloodhounds, St Bernards, Greyhounds — list is long).
            </p>

            <p className="font-serif text-stone-700 leading-relaxed mb-4">
              <strong>The catch:</strong> pets stay in the kennel area the whole time — they cannot come to your cabin or any public area. You can visit them anytime during designated hours, walk them on the dog deck, sit in the owners' lounge. For brachycephalic dogs this is actually a feature, not a bug — air pressure stays stable, temperature is consistent, no altitude stress. Many Frenchie and Bulldog owners specifically choose this route to avoid the cargo risk entirely.
            </p>

            <p className="font-serif text-stone-700 leading-relaxed">
              <strong>Paperwork:</strong> eastbound to Southampton needs microchip, current rabies, EU Pet Passport or UK AHC, tapeworm treatment 24–120 hours before disembarking. Westbound to New York needs USDA health certificate and rabies proof. Cunard's pre-sailing team will walk you through the exact paperwork about 5 months ahead — they do this constantly.
            </p>
          </section>

          {/* K9 JETS */}
          <section id="k9-jets" className="mb-14 scroll-mt-24">
            <div className="text-xs uppercase tracking-[0.25em] text-amber-700 mb-3">04 · Pet charter flights</div>
            <h2 className="font-serif text-2xl md:text-3xl text-stone-900 mb-3 leading-tight">
              K9 Jets and shared pet charters: cabin pet travel for big dogs
            </h2>
            <p className="font-serif italic text-stone-600 text-lg mb-6 leading-snug">
              Yes, you can fly with a 30 kg dog in the cabin — on a private jet shared with other pet owners. It's not as wild as it sounds.
            </p>

            <p className="font-serif text-stone-700 leading-relaxed mb-4">
              <a href="https://www.k9jets.com" className="text-amber-700 underline decoration-amber-300 hover:decoration-amber-600">K9 Jets</a> started when one group of pet owners pooled together to charter a private jet from New Jersey to London with their dogs during the pandemic, when Cunard had suspended sailings. The founders realised this was a real market and turned it into a scheduled service. The model: a private jet runs on a fixed route on a fixed date, with seats sold individually (each seat = one human + one pet over 51 lb, or two pets under 50 lb each). Dogs stay with their owners in the cabin for the entire flight. No cargo, no crate, no separation.
            </p>

            <p className="font-serif text-stone-700 leading-relaxed mb-4">
              <strong>2026 pricing:</strong> $8,000–$11,000 per seat (human + pet/s) on transatlantic routes. Shorter European routes are less. You're sharing a jet with up to ~8 other passengers and their dogs.
            </p>

            <p className="font-serif text-stone-700 leading-relaxed mb-4">
              <strong>Routes:</strong> the backbone is Teterboro (New Jersey) ↔ Farnborough (London area) — multiple flights per month. Also: Paris (Le Bourget), Milan (Malpensa), Lisbon, Los Angeles, Nice, Dubai. The network grows steadily; check current routes on their site.
            </p>

            <p className="font-serif text-stone-700 leading-relaxed mb-4">
              <strong>Important booking nuance:</strong> you buy a seat one-way, but the flight only operates if K9 Jets sells 75% of seats across the round-trip route. So your "guaranteed" date isn't fully guaranteed until close to departure. Most flights do operate — over 95% according to K9 Jets — but if yours doesn't fill, you'll be offered another date or a refund.
            </p>

            <p className="font-serif text-stone-700 leading-relaxed mb-4">
              <strong>Paperwork is still the same.</strong> A private jet doesn't bypass UK, EU, or US import rules. You still need the microchip, rabies vaccine, the right travel document for the direction (a GB AHC for travel from the UK into the EU — GB residents can no longer use an EU pet passport for that since April 2026; an EU pet passport still works for arrivals into the UK and for EU residents), USDA-endorsed health certificate (westbound to US), and for the UK: tapeworm treatment for dogs 24–120 hours before arrival. K9 Jets land at smaller airports (Farnborough, Le Bourget) that still have full pet customs facilities — but you handle the documents.
            </p>

            <p className="font-serif text-stone-700 leading-relaxed mb-4">
              <strong>When K9 Jets makes sense:</strong> transatlantic relocation with a brachycephalic dog where Cunard isn't an option (wrong dates, sold out, or you don't have 7 days for a sail). Or if you have multiple pets — one seat covers two small/medium dogs. Or if you simply cannot bear to put your dog through cargo, regardless of cost.
            </p>

            <p className="font-serif text-stone-700 leading-relaxed mb-4">
              <strong>When it doesn't make sense:</strong> if your dog fits under a normal airline seat and weighs under 8 kg, paying $9,000 instead of $150 for a cabin fee is unnecessary unless you specifically want the experience. K9 Jets is for the pets that have no other safe cabin option.
            </p>

            <p className="font-serif text-stone-700 leading-relaxed">
              <strong>Alternatives in this category:</strong> full private jet charters (paying for the whole aircraft — $70,000+ transatlantic, only makes sense for groups). VistaJet runs a pet-friendly program across its global fleet. GlobalCharter offers traditional charter from $25,000+ on transcontinental routes. For most individual French Bulldog owners, K9 Jets shared seats are the realistic private-aviation option.
            </p>
          </section>

          {/* SUMMER RULES */}
          <section id="summer-rules" className="mb-14 scroll-mt-24">
            <div className="text-xs uppercase tracking-[0.25em] text-amber-700 mb-3">05 · Heat embargos</div>
            <h2 className="font-serif text-2xl md:text-3xl text-stone-900 mb-3 leading-tight">
              Why summer travel is the most dangerous time for brachycephalic dogs
            </h2>
            <p className="font-serif italic text-stone-600 text-lg mb-6 leading-snug">
              Ground temperature on the tarmac determines whether your dog can fly. Many airlines impose embargos that owners aren't told about until check-in.
            </p>

            <p className="font-serif text-stone-700 leading-relaxed mb-4">
              Cargo holds in flight are climate-controlled and safe. The danger zone for brachycephalic dogs is the <strong>ground</strong> — the holding facility before loading, the trolley ride across the tarmac, the 20–40 minutes sitting in a crate while the plane is loaded. If ambient temperature exceeds about 27°C (80°F), the heat in a closed crate on the tarmac can rapidly become lethal for a Frenchie.
            </p>

            <p className="font-serif text-stone-700 leading-relaxed mb-4">
              <strong>Lufthansa's brachycephalic temperature rule:</strong> won't transport snub-nosed breeds in cargo if temperature at origin or destination exceeds 27°C. The list of breeds covered: Boston Terrier, Boxer, Brussels Griffon, all Bulldogs (except American Bulldog), Chow Chow, English Toy Spaniel, Japanese Chin, Pekingese, all Pugs, Shih Tzu. The exact breed must be listed on transport documents — generic "small dog" won't pass.
            </p>

            <p className="font-serif text-stone-700 leading-relaxed mb-4">
              <strong>Most airlines apply similar embargos.</strong> Some are explicit (temperature thresholds published); others are case-by-case (gate agent's discretion). British Airways and IAG Cargo apply seasonal restrictions May–September on many UK routes. American Airlines refuses cargo pets when forecast temperatures exceed 85°F (29.4°C) at any point on the itinerary, with full May 1–September 30 embargos on flights through Phoenix (PHX), Tucson (TUS), Las Vegas (LAS) and Palm Springs (PSP).
            </p>

            <p className="font-serif text-stone-700 leading-relaxed mb-4">
              <strong>Practical implications:</strong> if you have to move between May and September with a Frenchie, your options narrow significantly. Cargo becomes unreliable — you might be turned away at the airport on the day if temperatures spike. Pet relocation agents who specialise in summer brachycephalic moves typically use these strategies:
            </p>

            <ul className="font-serif text-stone-700 leading-relaxed mb-4 space-y-2 ml-5 list-disc">
              <li><strong>Fly overnight or at dawn</strong> — coolest time on the tarmac</li>
              <li><strong>Route through Frankfurt or Amsterdam in summer</strong> — better-equipped facilities to keep pets cool pre-departure</li>
              <li><strong>Use Queen Mary 2 between June and August</strong> if your dates are flexible</li>
              <li><strong>Avoid layovers at hot airports</strong> (Dubai, Doha, Singapore, Miami summer) entirely</li>
              <li><strong>Use K9 Jets</strong> if budget allows — smaller airports, climate-controlled boarding, the dog stays with you</li>
            </ul>

            <p className="font-serif text-stone-700 leading-relaxed">
              If your moving dates are flexible, scheduling between October and April is far safer for a brachycephalic dog. If they're not flexible, factor a summer embargo risk into your plan — book refundable, build slack into your timeline, and have a backup route ready.
            </p>
          </section>

          {/* WHAT NOT TO DO */}
          <section id="what-not-to-do" className="mb-14 scroll-mt-24">
            <div className="text-xs uppercase tracking-[0.25em] text-amber-700 mb-3">06 · What not to do</div>
            <h2 className="font-serif text-2xl md:text-3xl text-stone-900 mb-3 leading-tight">
              The mistakes that get Frenchies killed
            </h2>
            <p className="font-serif italic text-stone-600 text-lg mb-6 leading-snug">
              Each of these has actually happened. None of them should happen to your dog.
            </p>

            <div className="space-y-5">
              <div>
                <h3 className="font-serif text-lg text-stone-900 mb-1.5">Don't sedate — and don't let a vet sedate "just a little."</h3>
                <p className="font-serif text-stone-700 leading-relaxed">
                  We said this at the top. We're saying it again because every year, dogs die because someone thought a small dose would just take the edge off. With brachycephalic dogs the upper airway is already compromised — sedation removes the muscle tone that keeps it open. Use non-sedating anxiety medication (Trazodone, Gabapentin) with your vet's specific dose, trialled at home weeks before, never first-time on flight day.
                </p>
              </div>

              <div>
                <h3 className="font-serif text-lg text-stone-900 mb-1.5">Don't take a "checked baggage" booking that wasn't supposed to be possible.</h3>
                <p className="font-serif text-stone-700 leading-relaxed">
                  If an airline that publicly bans brachycephalic from cargo accepts your Bulldog as checked baggage anyway, something has gone wrong on their end — not yours. The handlers at the destination might be expecting a different breed. The hold might not be the climate-controlled section. Call back, get it confirmed in writing, and if it still looks wrong, walk away. You don't want to be the test case for whether an exception works.
                </p>
              </div>

              <div>
                <h3 className="font-serif text-lg text-stone-900 mb-1.5">Don't fly with a Frenchie who has recently had BOAS surgery.</h3>
                <p className="font-serif text-stone-700 leading-relaxed">
                  Many Frenchies, Bulldogs, and Pugs have had brachycephalic obstructive airway syndrome (BOAS) surgery to widen nostrils or shorten the soft palate. The recovery period (typically 6–8 weeks) is high-risk for any stress — flight pressure changes, anxiety, panting can all complicate healing. Talk to your vet before flying within 3 months of any airway surgery.
                </p>
              </div>

              <div>
                <h3 className="font-serif text-lg text-stone-900 mb-1.5">Don't trust pricing that seems too good to be true on Facebook groups.</h3>
                <p className="font-serif text-stone-700 leading-relaxed">
                  "Pet transport" scams are common, especially in Facebook groups where panicked owners gather. Some are scams (you pay deposit, dog doesn't exist). Some are real but unsafe — uninsured handlers, dodgy crate hire, unverified routes. Always: ask for IPATA membership number, verify on ipata.org, demand references for the exact route, never pay in full upfront, never pay via crypto or gift cards.
                </p>
              </div>

              <div>
                <h3 className="font-serif text-lg text-stone-900 mb-1.5">Don't book without checking destination cabin restrictions.</h3>
                <p className="font-serif text-stone-700 leading-relaxed">
                  The UK does not allow ANY pet to enter via cabin. Australia is the same. Ireland mostly the same. So even if you found a way to get your Frenchie in cabin for $11,000 on K9 Jets, landing in Heathrow direct doesn't work — UK rules require manifested cargo entry. K9 Jets knows this and lands at Farnborough where the rules are slightly different (still customs-controlled but treated more flexibly). Always verify cabin entry is legally permitted at your destination on your chosen airline before paying anything.
                </p>
              </div>
            </div>
          </section>

          {/* DECISION TREE */}
          <section id="decision-tree" className="mb-14 scroll-mt-24">
            <div className="text-xs uppercase tracking-[0.25em] text-amber-700 mb-3">07 · Decision tree</div>
            <h2 className="font-serif text-2xl md:text-3xl text-stone-900 mb-3 leading-tight">
              Which option is right for your specific situation?
            </h2>
            <p className="font-serif italic text-stone-600 text-lg mb-6 leading-snug">
              The honest matrix.
            </p>

            <div className="space-y-5">
              <div className="bg-white border border-stone-200 rounded-sm p-5">
                <h3 className="font-serif text-lg text-stone-900 mb-2">Your Frenchie is under 7 kg and you're not going to the UK or Australia</h3>
                <p className="font-serif text-stone-700 leading-relaxed">
                  Lucky. She might just fit cabin under the 8 kg limit (carrier included). Try Lufthansa, Air France, KLM, SAS, Iberia, or American/United (no published weight limit). Book early — only 1–2 pet spaces per flight. Standard cabin fee €100–€200. <Link href="/" className="text-amber-700 underline decoration-amber-300">Use the journey planner</Link> to map your specific route.
                </p>
              </div>

              <div className="bg-white border border-stone-200 rounded-sm p-5">
                <h3 className="font-serif text-lg text-stone-900 mb-2">Transatlantic move (UK/EU ↔ US/Canada), dates flexible, October–April</h3>
                <p className="font-serif text-stone-700 leading-relaxed">
                  <strong>First choice: Queen Mary 2.</strong> $1,300–$1,500 per kennel + your cabin. Safest option for a brachy dog. Book 12+ months ahead.<br/>
                  <strong>Second choice: K9 Jets.</strong> $8,000–$11,000. Faster (8 hours vs 7 days), more flexible dates.<br/>
                  <strong>Third choice: Lufthansa Cargo via Frankfurt.</strong> £1,500–£3,000 + agent fees. Safe but more stress on the dog.
                </p>
              </div>

              <div className="bg-white border border-stone-200 rounded-sm p-5">
                <h3 className="font-serif text-lg text-stone-900 mb-2">Transatlantic move, dates fixed, May–September</h3>
                <p className="font-serif text-stone-700 leading-relaxed">
                  <strong>Best: K9 Jets or Queen Mary 2.</strong> Both bypass tarmac heat exposure.<br/>
                  <strong>Avoid: cargo on commercial flights.</strong> Embargo risk is high. If you must, route through Frankfurt or Amsterdam (best summer facilities) and fly overnight only.
                </p>
              </div>

              <div className="bg-white border border-stone-200 rounded-sm p-5">
                <h3 className="font-serif text-lg text-stone-900 mb-2">Europe-to-Europe move (e.g. France to Spain, Germany to Italy)</h3>
                <p className="font-serif text-stone-700 leading-relaxed">
                  Shorter flights have lower stress and more options. Lufthansa Cargo / KLM Cargo / Air France Cargo all serve brachy with the right paperwork. Consider also: <strong>driving</strong>. A long drive is sometimes the right answer for a Frenchie — no flight stress, your dog with you the whole time, total control over breaks and temperature.
                </p>
              </div>

              <div className="bg-white border border-stone-200 rounded-sm p-5">
                <h3 className="font-serif text-lg text-stone-900 mb-2">Going to the UK or Australia from anywhere</h3>
                <p className="font-serif text-stone-700 leading-relaxed">
                  Manifested cargo only. There is no commercial cabin option, period. Use IAG Cargo for the UK (Lufthansa Cargo also routes via Frankfurt with FRA→LHR handoff). For Australia, expect AQIS quarantine. Use a relocation agent specifically experienced with brachycephalic Australia imports — the requirements are extreme.
                </p>
              </div>

              <div className="bg-white border border-stone-200 rounded-sm p-5">
                <h3 className="font-serif text-lg text-stone-900 mb-2">Going to Japan, Korea, or other rabies-free Asian destinations</h3>
                <p className="font-serif text-stone-700 leading-relaxed">
                  Long-haul cargo with brachy is risky. Korean Air Cargo accepts brachycephalic with documentation. The Japan AQS 180-day rabies process is a separate complication — see the <Link href="/japan-pet-travel" className="text-amber-700 underline decoration-amber-300">Japan pet travel guide</Link>. For a Frenchie specifically, consider whether the move is worth the risk; some owners choose to delay until conditions align (cooler season, well-rehearsed route, pre-trip vet certification of fitness to fly).
                </p>
              </div>
            </div>
          </section>

          {/* CTA */}
          <div className="bg-stone-900 text-stone-100 rounded-sm p-8 text-center mt-12">
            <h2 className="font-serif text-2xl text-stone-50 mb-3">Map your Frenchie's journey</h2>
            <p className="font-serif text-stone-300 leading-relaxed mb-6">
              The journey planner can sketch your route options. For brachycephalic dogs the planner will flag breed-restricted carriers and suggest the safer cabin/charter/sea alternatives where they exist.
            </p>
            <Link
              href="/?go=planner"
              className="inline-block bg-amber-600 text-white px-6 py-3 text-sm uppercase tracking-widest font-medium hover:bg-amber-500 transition-colors"
            >
              Open the journey planner
            </Link>
          </div>

          <p className="font-sans text-xs text-stone-400 leading-relaxed mt-12 text-center">
            Verified against AVMA, IATA Live Animals Regulations 52nd Edition, Lufthansa Cargo, KLM Cargo, Air France Cargo, Cunard Queen Mary 2, K9 Jets, and current airline pet policies as of May 2026. Brachycephalic pet travel rules change frequently and vary by route, season, and airline — always confirm specifics with each operator before booking, and consult your vet about your individual dog's fitness to fly.
          </p>
          {/* Related guides — cross-links to other country/topic pages */}
          <div className="mt-16 pt-10 border-t border-stone-300">
            <div className="text-xs uppercase tracking-[0.25em] text-amber-700 mb-2">Related guides</div>
            <h2 className="font-serif text-2xl text-stone-900 mb-6">More from the pets-in-cabin guide</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <Link href="/uk-pet-travel" className="block bg-stone-50 border border-stone-200 hover:border-amber-300 transition-colors p-4 rounded-sm">
                <div className="font-serif text-base text-stone-900 mb-1">UK guide →</div>
                <div className="text-xs text-stone-600 leading-relaxed">The Paris Pivot is the standard way to get a Frenchie into the UK in cabin.</div>
              </Link>

              <Link href="/japan-pet-travel" className="block bg-stone-50 border border-stone-200 hover:border-amber-300 transition-colors p-4 rounded-sm">
                <div className="font-serif text-base text-stone-900 mb-1">Japan guide →</div>
                <div className="text-xs text-stone-600 leading-relaxed">United accepts brachy breeds in cabin to Japan — one of very few.</div>
              </Link>

              <Link href="/iceland-pet-travel" className="block bg-stone-50 border border-stone-200 hover:border-amber-300 transition-colors p-4 rounded-sm">
                <div className="font-serif text-base text-stone-900 mb-1">Iceland guide →</div>
                <div className="text-xs text-stone-600 leading-relaxed">Iceland is cargo-only, and many cargo airlines refuse brachy breeds.</div>
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
