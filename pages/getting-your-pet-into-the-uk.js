import Head from "next/head";
import Link from "next/link";
import RouteComparison from "../components/RouteComparison";

export default function GettingYourPetIntoTheUK() {
  return (
    <>
      <Head>
        <title>Getting Your Pet Into the UK From Europe (2026): Every Route Compared | Pets in Cabin</title>
        <meta
          name="description"
          content="No airline flies a pet in the cabin into the UK — so here's every route that works, compared: the Paris, Frankfurt and Amsterdam crossings, ferries, costs and times."
        />
        <link rel="canonical" href="https://www.petsincabin.com/getting-your-pet-into-the-uk" />
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

        <main className="max-w-4xl mx-auto px-6 py-8 md:py-12">
          <div className="text-xs uppercase tracking-[0.25em] text-amber-700 mb-3">
            The complete guide
          </div>

          <h1 className="font-serif text-4xl md:text-5xl leading-[1.05] text-stone-900 mb-5">
            Getting your pet <span className="italic text-stone-600">into the UK from Europe</span>.
          </h1>

          <div className="bg-amber-50 border border-amber-200 rounded-sm px-4 py-3 mb-6">
            <div className="text-xs uppercase tracking-widest text-stone-500 mb-1.5">In this guide</div>
            <div className="grid grid-cols-2 items-start gap-x-4 gap-y-1.5 md:flex md:flex-wrap text-sm">
              <a href="#why" className="block md:inline text-stone-700 hover:text-amber-700 underline decoration-stone-300 hover:decoration-amber-600 underline-offset-4">The one rule</a>
              <a href="#compare" className="block md:inline text-stone-700 hover:text-amber-700 underline decoration-stone-300 hover:decoration-amber-600 underline-offset-4">Compare the routes</a>
              <a href="#via-paris" className="block md:inline text-stone-700 hover:text-amber-700 underline decoration-stone-300 hover:decoration-amber-600 underline-offset-4">Via Paris</a>
              <a href="#via-frankfurt" className="block md:inline text-stone-700 hover:text-amber-700 underline decoration-stone-300 hover:decoration-amber-600 underline-offset-4">Via Frankfurt</a>
              <a href="#via-amsterdam" className="block md:inline text-stone-700 hover:text-amber-700 underline decoration-stone-300 hover:decoration-amber-600 underline-offset-4">Via Amsterdam</a>
              <a href="#ferries" className="block md:inline text-stone-700 hover:text-amber-700 underline decoration-stone-300 hover:decoration-amber-600 underline-offset-4">Every approved ferry</a>
              <a href="#pet-taxis" className="block md:inline text-stone-700 hover:text-amber-700 underline decoration-stone-300 hover:decoration-amber-600 underline-offset-4">Door-to-door pet taxis</a>
              <a href="#qm2" className="block md:inline text-stone-700 hover:text-amber-700 underline decoration-stone-300 hover:decoration-amber-600 underline-offset-4">The ocean-liner option</a>
              <a href="#paperwork" className="block md:inline text-stone-700 hover:text-amber-700 underline decoration-stone-300 hover:decoration-amber-600 underline-offset-4">Paperwork &amp; tapeworm</a>
              <a href="#usda" className="block md:inline text-stone-700 hover:text-amber-700 underline decoration-stone-300 hover:decoration-amber-600 underline-offset-4">Leaving the US</a>
              <a href="#ireland" className="block md:inline text-stone-700 hover:text-amber-700 underline decoration-stone-300 hover:decoration-amber-600 underline-offset-4">A note on Ireland</a>
            </div>
          </div>

          <p className="font-sans text-xs italic text-stone-500 leading-relaxed mb-6">
            Verified against the UK government's approved pet routes (gov.uk / APHA, May 2026), operator pet policies and DEFRA-licensed transporters. Rules and fares change — confirm before booking.
          </p>

          <div className="h-px bg-stone-300 mb-6" />

          {/* Why no cabin route */}
          <section id="why" className="mb-10 scroll-mt-24">
            <div className="text-xs uppercase tracking-[0.25em] text-amber-700 mb-3">01 · The one rule</div>
            <h2 className="font-serif text-2xl md:text-3xl text-stone-900 mb-3 leading-tight">
              You cannot fly your pet into the UK in the cabin. Full stop.
            </h2>

            <p className="font-serif text-stone-700 leading-relaxed mb-4">
              It's a UK government rule, not an airline policy you can sweet-talk your way around — every pet flying into Britain rides as cargo, in the hold, no exceptions, Heathrow included. So nobody flies their pet <em>in</em>. What thousands of people do instead: fly the pet in the cabin to Europe, then cross the Channel by land or sea with the pet right beside them. The rest of this page is just <em>which</em> way to make that crossing — compared, costed and timed.
            </p>

            <p className="font-serif italic text-stone-600 text-sm leading-relaxed mt-4">
              There's an active UK Parliament petition to change this rule — <a
                href="https://petition.parliament.uk/petitions/750817"
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => {
                  if (typeof window !== "undefined" && window.gtag) {
                    window.gtag("event", "petition_link", {
                      event_category: "outbound",
                      event_label: "UK Parliament petition 750817 · getting-uk page",
                    });
                  }
                }}
                className="not-italic text-amber-700 underline decoration-amber-300 hover:decoration-amber-600 underline-offset-2"
              >sign here if you're a UK resident</a>. 100,000 signatures forces a parliamentary debate.
            </p>
          </section>

          {/* Comparison table */}
          <section id="compare" className="mb-14 scroll-mt-24">
            <div className="text-xs uppercase tracking-[0.25em] text-amber-700 mb-3">02 · Compare the routes</div>
            <h2 className="font-serif text-2xl md:text-3xl text-stone-900 mb-3 leading-tight">
              Every route in, side by side
            </h2>
            <p className="font-serif italic text-stone-600 text-lg mb-6 leading-snug">
              Pick your European hub, then your crossing. Times and costs are ballpark — they swing with season, operator and how far you're going.
            </p>

            <RouteComparison />

            <div className="bg-white border border-stone-300 rounded-sm p-5 mb-3 mt-4">
              <div className="font-serif text-lg text-stone-900 mb-2">Reading the costs — the bit guides leave out</div>
              <p className="font-serif text-stone-700 leading-relaxed text-sm mb-3">
                The pet fee is the small number. The vehicle crossing ticket is the big one — and almost every guide quotes only the first.
              </p>
              <ul className="font-serif text-stone-700 leading-relaxed text-sm space-y-1.5 ml-5 list-disc mb-3">
                <li><strong>Vehicle ticket.</strong> Eurotunnel ~£115–£229 one way for a car; Calais–Dover ferry similar. The car ticket covers up to 9 passengers — so it's per car, not per person.</li>
                <li><strong>Pet fee.</strong> A modest surcharge on top: ~£15–£24 each way on Eurotunnel and short Channel ferries, ~£30–£50 on the longer Brittany Ferries and DFDS Amsterdam crossings — and it's charged <em>per pet, each way</em>.</li>
                <li><strong>Round trips, not single legs.</strong> If someone drives out from the UK to collect you, that's two crossings — outbound and return — each with its own vehicle ticket. Budget for both.</li>
                <li><strong>One-way car hire.</strong> Picking up at CDG and dropping in the UK adds a hefty one-way drop fee plus fuel and tolls.</li>
                <li><strong>Overnight on the Frankfurt route.</strong> A long day; most people split it with a pet-friendly hotel.</li>
                <li><strong>Pet-friendly cabin on longer ferries.</strong> Booked and priced as a cabin (per cabin, ~£75–£200 for four berths), separate from and on top of the pet fee. Effectively mandatory on the 24–36-hour Spain crossings.</li>
                <li><strong>Pet-taxi quotes.</strong> The crossing is normally charged on top of the driving fare — same ticket either way. Ask outright: <em>"Does your fare include the Channel crossing and tolls, or are those extra?"</em></li>
              </ul>
              <p className="font-serif text-stone-700 leading-relaxed text-sm">
                The realistic all-in is vehicle crossing <em>plus</em> pet fee <em>plus</em> car hire or pet-taxi driving fare <em>plus</em> any overnight. Add it up before you commit.
              </p>
            </div>

            <p className="font-sans text-xs text-stone-500 leading-relaxed mb-3">
              <strong>Heading to Ireland, not Britain?</strong> Different trip. The clean way in is the direct France→Ireland ferry — skip Britain entirely. The Holyhead (Wales)→Dublin ferry only matters as an <em>onward</em> hop once your pet is already in Britain. Full detail in <a href="#ireland" className="text-amber-700 underline decoration-amber-300 hover:decoration-amber-600 underline-offset-2">the Ireland note</a> below.
            </p>

            <div className="bg-amber-50 border-l-2 border-amber-500 p-4">
              <p className="font-serif text-stone-800 leading-relaxed text-sm">
                <strong>The table can't show this, but it's the big one:</strong> if your pet's journey <em>starts</em> outside Europe — Jamaica, India, South Africa, much of the Caribbean — there's a rabies blood test plus a fixed three-month wait <em>before</em> any route here applies. A layover in Paris does not reset that clock. Don't skim past <a href="#paperwork" className="text-amber-700 underline decoration-amber-300 hover:decoration-amber-600 underline-offset-2">paperwork &amp; tapeworm</a> if this is you.
              </p>
            </div>
          </section>

          {/* Via Paris */}
          <section id="via-paris" className="mb-14 scroll-mt-24">
            <div className="text-xs uppercase tracking-[0.25em] text-amber-700 mb-3">03 · Via Paris</div>
            <h2 className="font-serif text-2xl md:text-3xl text-stone-900 mb-3 leading-tight">
              The most-used route — Paris, then the Channel
            </h2>
            <p className="font-serif italic text-stone-600 text-lg mb-6 leading-snug">
              The shortest overland leg of the three hubs.
            </p>

            <p className="font-serif text-stone-700 leading-relaxed mb-4">
              Fly cabin to Paris CDG on Air France (8 kg pet + carrier), drive ~3 hours to Calais, cross via Eurotunnel Le Shuttle (Calais Coquelles → Folkestone, ~35 minutes, pet stays in the car) or a Calais–Dover ferry (DFDS, P&amp;O, Irish Ferries — ~90 minutes, vehicle stays on board). Most-used hub because the CDG–Calais leg is the shortest. Door-to-door pet taxis run this end to end.
            </p>

            <div className="bg-amber-50 border-2 border-amber-500 p-5 mb-6 rounded-sm">
              <p className="font-serif text-stone-900 leading-relaxed mb-2">
                <strong>The single biggest paperwork trap on this route — read this before you book your USDA appointment.</strong>
              </p>
              <p className="font-serif text-stone-700 leading-relaxed mb-3">
                Le Shuttle's pet reception at Calais applies UK entry rules, not French entry rules. That means an <strong>EU Animal Health Certificate</strong> alone — even one that names the UK as final destination via France — will not clear the crossing. UK entry needs a <strong>GB Health Certificate</strong>, USDA-endorsed for Great Britain, in addition to the EU AHC for the French leg. Ask your US vet specifically for both, USDA-endorsed together. If a phone call to USDA suggests one form covers both destinations, ask again — we have seen this misadvised in practice.
              </p>
              <p className="font-serif text-stone-700 leading-relaxed mb-3">
                If you do land in France with only the EU AHC, the fix is an <strong>EU Pet Passport</strong> issued on the spot by a French vet — typically €80–150 (we paid €90 in July 2026), same-day, valid at Le Shuttle. Many door-to-door pet taxi operators arrange this through a partner vet — see the pet taxi section below.
              </p>
              <p className="font-sans text-sm text-stone-600 leading-relaxed italic">
                Bring your own passport too — Le Shuttle checks driver and passenger IDs at pet reception alongside your pet's documents.
              </p>
            </div>

            <p className="font-serif italic text-stone-600 text-sm mb-6">
              For the full first-person account of how this route actually plays out — including the paperwork trap that almost ended our own crossing at Calais and the €90 fix that saved it — read <a href="/#stories" className="text-amber-700 underline decoration-amber-300 underline-offset-2 hover:text-amber-800 transition-colors">Story 02 · Miami to London</a> on the homepage.
            </p>

            <p className="font-serif text-stone-700 leading-relaxed">
              Premium variant: <strong>La Compagnie</strong>, an all-business-class boutique airline, flies Newark (EWR) → Paris Orly (ORY) and is the only carrier in the world pairing transatlantic cabin pets with business-class floor space (€200 each way, 8 kg). Round-trip fares ~$2,400–$3,000 — comparable to other carriers' standard business. From Orly the drive to Calais is roughly the same as from CDG. Sensible if you'd be booking business anyway, or if a quieter long-haul leg matters for your pet.
            </p>
          </section>

          {/* Via Frankfurt */}
          <section id="via-frankfurt" className="mb-14 scroll-mt-24">
            <div className="text-xs uppercase tracking-[0.25em] text-amber-700 mb-3">04 · Via Frankfurt</div>
            <h2 className="font-serif text-2xl md:text-3xl text-stone-900 mb-3 leading-tight">
              Frankfurt — the same crossing, a longer drive
            </h2>
            <p className="font-serif italic text-stone-600 text-lg mb-6 leading-snug">
              Worth choosing when Lufthansa's schedule or fares beat the others.
            </p>

            <p className="font-serif text-stone-700 leading-relaxed mb-4">
              Fly cabin to Frankfurt on Lufthansa (8 kg pet + carrier). Same crossing as Paris (Calais → Eurotunnel or ferry), but the overland leg is much longer: ~7–8 hours by road. Most people split it with an overnight in a pet-friendly hotel — gives the pet a proper rest after the flight.
            </p>

            <p className="font-serif text-stone-700 leading-relaxed">
              Frankfurt earns its place when Lufthansa offers a better flight from your departure city than Air France or KLM — for many long-haul origins it does. Pet taxis run this route too, typically quoting Frankfurt → London at 10–14 hours with comfort breaks.
            </p>
          </section>

          {/* Via Amsterdam */}
          <section id="via-amsterdam" className="mb-14 scroll-mt-24">
            <div className="text-xs uppercase tracking-[0.25em] text-amber-700 mb-3">05 · Via Amsterdam</div>
            <h2 className="font-serif text-2xl md:text-3xl text-stone-900 mb-3 leading-tight">
              Amsterdam — no French drive at all
            </h2>
            <p className="font-serif italic text-stone-600 text-lg mb-6 leading-snug">
              The route that swaps the Channel drive for an overnight ferry.
            </p>

            <p className="font-serif text-stone-700 leading-relaxed mb-4">
              Fly cabin to Amsterdam on KLM, short taxi from Schiphol to the DFDS terminal at IJmuiden, then the DFDS overnight ferry directly to Newcastle (~16–17 hours, docking at North Shields). No motorway drive through Belgium and France — the boat does the work overnight. Pets travel in pet-friendly cabins or onboard kennels, ~£30 per pet each way on top of the cabin fare. Foot passengers can't add a pet online — pet bookings on this route are made by phone with DFDS.
            </p>

            <p className="font-serif text-stone-700 leading-relaxed">
              Faster alternative: a door-to-door pet taxi from Schiphol skips the ferry and drives via Belgium/France to the Eurotunnel — ~7–8 hours instead of 17. The ferry version lands in the north of England, so it suits Scotland or northern England better than London. For Edinburgh: Newcastle is ~1h 30m on the LNER train (pets free in cabin on UK domestic, max 2 small pets per passenger in a carrier) or ~2 hours by road. Either way, dogs need their tapeworm treatment in the 24–120-hour window before UK arrival — covered below.
            </p>
          </section>

          {/* Every approved ferry */}
          <section id="ferries" className="mb-14 scroll-mt-24">
            <div className="text-xs uppercase tracking-[0.25em] text-amber-700 mb-3">06 · Every approved ferry</div>
            <h2 className="font-serif text-2xl md:text-3xl text-stone-900 mb-3 leading-tight">
              Every UK-approved pet ferry crossing
            </h2>
            <p className="font-serif italic text-stone-600 text-lg mb-6 leading-snug">
              The three hub routes use the most common crossings — but the government approves many more.
            </p>

            <p className="font-serif text-stone-700 leading-relaxed mb-4">
              The UK government publishes the full list of approved sea routes for pets. If your continental hub is somewhere other than Paris, Frankfurt or Amsterdam, one of these crossings may suit you better:
            </p>

            <div className="space-y-4 mb-4">
              <div>
                <h3 className="font-serif text-lg text-stone-900 mb-1">From France</h3>
                <p className="font-serif text-stone-700 leading-relaxed">
                  Calais–Dover and Dunkerque–Dover are the short crossings (DFDS, P&O, Irish Ferries) — your pet stays in the car, and the pet fee is modest, around £15–£22 per pet each way on top of the vehicle fare. Longer Brittany Ferries crossings from western France carry pets too: Caen–Portsmouth, Cherbourg–Plymouth, Cherbourg–Portsmouth, Le Havre–Portsmouth (vehicle passengers only), Roscoff–Plymouth, St Malo–Plymouth (winter only) and St Malo–Portsmouth. Dieppe–Newhaven (DFDS) is a useful mid-length option — and since late 2025, this route also takes <strong>foot passengers with pets</strong>, the only English Channel ferry that does. Three pet-friendly cabins onboard, £20 per pet each way on top of the cabin fare; foot-passenger pet bookings can't be made online and must be added by phone with DFDS. Brittany Ferries pet fares on these France routes start from around £35 each way.
                </p>
              </div>
              <div>
                <h3 className="font-serif text-lg text-stone-900 mb-1">From the Netherlands</h3>
                <p className="font-serif text-stone-700 leading-relaxed">
                  Amsterdam (IJmuiden)–Newcastle with DFDS is the route used by the Amsterdam hub above. Hook of Holland–Harwich (Stena Line) and Rotterdam–Hull (P&O) are the other two approved Dutch crossings — both overnight, with pet-friendly cabins. P&O's Rotterdam–Hull route is also approved to carry pets travelling with foot passengers.
                </p>
              </div>
              <div>
                <h3 className="font-serif text-lg text-stone-900 mb-1">From Spain</h3>
                <p className="font-serif text-stone-700 leading-relaxed">
                  Brittany Ferries runs Bilbao–Portsmouth, Santander–Portsmouth and Santander–Plymouth. These are long crossings — 24 to 36 hours — but they have pet-friendly cabins and kennels, and they suit anyone whose journey starts in Spain or southern Europe. Note that on the Spain routes only passengers travelling with a vehicle can bring a pet. The pet fee here is charged <em>per pet, each way</em> — a flat £50 on the Spain routes (the France routes are from around £35) — and that fee is <em>separate from and on top of</em> the pet-friendly cabin or kennel, which is itself booked and priced as a cabin (per cabin, not per person, typically £75–£200 for a four-berth). A cabin is effectively mandatory on the Spain crossings given the length.
                </p>
              </div>
            </div>

            <p className="font-serif text-stone-700 leading-relaxed">
              Whichever ferry you choose, book the pet-friendly cabin or kennel as early as you can — they are limited in number and sell out, especially in summer. And always confirm the route is still approved on the official gov.uk list before booking, since the list is updated when operators change.
            </p>
          </section>

          {/* Pet taxis */}
          <section id="pet-taxis" className="mb-14 scroll-mt-24">
            <div className="text-xs uppercase tracking-[0.25em] text-amber-700 mb-3">07 · Door-to-door pet taxis</div>
            <h2 className="font-serif text-2xl md:text-3xl text-stone-900 mb-3 leading-tight">
              The door-to-door option — you don't drive at all
            </h2>
            <p className="font-serif italic text-stone-600 text-lg mb-6 leading-snug">
              A pet taxi isn't a different route — it's any of the routes above, driven for you.
            </p>

            <p className="font-serif text-stone-700 leading-relaxed mb-4">
              A specialist pet transport service collects you and your pet at the European airport, drives the whole overland leg, handles the Channel crossing, and delivers you to your UK address. Multiple DEFRA-licensed operators run all three hub routes — Paris, Frankfurt, Amsterdam — meeting you at the arrivals gate, so no airport-to-station transfer to organise. The pet usually rides in the vehicle with you, often out of its carrier on a blanket beside you, and the operator handles pet check-in at the Eurotunnel or ferry terminal. Driving fares vary widely with distance: ~£400 to £2,000 door-to-door. Frankfurt sits at the higher end (longest drive); Paris is typically lower. The Channel crossing ticket is normally on top of the driving fare — see the cost callout above.
            </p>

            <div className="bg-amber-50 border-l-2 border-amber-400 p-4 mb-4">
              <p className="font-serif text-stone-700 leading-relaxed text-sm">
                <strong>Check the licence.</strong> A transporter carrying pets commercially into the UK should hold a DEFRA authorisation. The UK government publishes a list of authorised long-journey transporters — ask an operator for their authorisation before booking. Not every business advertising "pet taxi" is licensed for cross-border animal transport.
              </p>
            </div>

            <div className="bg-white border border-stone-200 rounded-sm p-4 mb-4">
              <p className="font-serif text-stone-900 leading-relaxed text-sm mb-2">
                <strong>An operator we can vouch for.</strong>
              </p>
              <p className="font-serif text-stone-700 leading-relaxed text-sm">
                On Theo's July 2026 crossing we used <a href="https://petmovesabroad.co.uk" target="_blank" rel="noopener noreferrer" className="text-amber-700 underline decoration-amber-300 hover:decoration-amber-600 underline-offset-2">Pet Moves Abroad</a> — a family-run, DEFRA Type 2 authorised operator. Responsive from booking through to journey day, communicated throughout, and — critically — our driver Kawa checked our US-issued paperwork at pickup and spotted the EU-only-AHC problem before we left for the terminal. Their partner-vet arrangement in France meant an EU Pet Passport was issued on the spot, and the crossing itself was straightforward. If you're routing through France and want a door-to-door service that watches the paperwork as well as the driving, we recommend them.
              </p>
            </div>

            <p className="font-serif text-stone-700 leading-relaxed">
              Pet taxi is the lowest-stress version of these routes: no hire car, no navigating a foreign motorway after a long-haul flight, someone experienced handling the border paperwork. Costs more than driving yourself — but after the flight, that's often exactly the part worth paying for.
            </p>
          </section>

          {/* QM2 */}
          <section id="qm2" className="mb-14 scroll-mt-24">
            <div className="text-xs uppercase tracking-[0.25em] text-amber-700 mb-3">08 · The ocean-liner option</div>
            <h2 className="font-serif text-2xl md:text-3xl text-stone-900 mb-3 leading-tight">
              No flight at all — the Cunard Queen Mary 2
            </h2>
            <p className="font-serif italic text-stone-600 text-lg mb-6 leading-snug">
              For a pet coming from North America, there is a way to skip the plane entirely.
            </p>

            <p className="font-serif text-stone-700 leading-relaxed mb-4">
              The UK government's approved-routes list includes one sea crossing that isn't a Channel ferry: New York → Southampton on the Cunard Queen Mary 2. The QM2 has dedicated kennels and is approved for bringing a pet into the UK. For a pet travelling from the US or Canada, this skips the flight altogether — no cabin-versus-cargo question, no European hub, no Channel crossing. Crossing takes ~7 nights. Premium option (kennel fare on top of cabin; kennels limited, book far in advance) but a genuine alternative for an anxious pet, or an owner who'd rather not fly.
            </p>

            <p className="font-serif text-stone-700 leading-relaxed">
              Same paperwork as any other route into the UK — microchip, rabies vaccination, tapeworm for dogs in the correct window before arrival. Read the paperwork section below regardless of how you cross.
            </p>
          </section>

          {/* Paperwork & tapeworm */}
          <section id="paperwork" className="mb-14 scroll-mt-24">
            <div className="text-xs uppercase tracking-[0.25em] text-amber-700 mb-3">09 · Paperwork &amp; tapeworm</div>
            <h2 className="font-serif text-2xl md:text-3xl text-stone-900 mb-3 leading-tight">
              The paperwork — the same whichever route you take
            </h2>
            <p className="font-serif italic text-stone-600 text-lg mb-6 leading-snug">
              The route changes; the entry requirements don't.
            </p>

            <p className="font-serif text-stone-700 leading-relaxed mb-4">
              Whichever crossing you use, a pet entering Great Britain needs:
            </p>

            <ul className="font-serif text-stone-700 leading-relaxed mb-4 space-y-2 ml-5 list-disc">
              <li><strong>An ISO-standard microchip</strong> — implanted before the rabies vaccination.</li>
              <li><strong>A valid rabies vaccination</strong> — given after the microchip, with the required waiting period before travel.</li>
              <li><strong>An accepted travel document for Great Britain</strong> — for most travellers an Animal Health Certificate, or an EU pet passport for EU-resident pets travelling within the rules that apply to them.</li>
              <li><strong>Entry on an approved route with an approved operator</strong> — which is what this whole guide is about.</li>
            </ul>

            <div className="bg-amber-50 border-l-2 border-amber-500 p-4 mb-6">
              <p className="font-serif text-stone-800 leading-relaxed text-sm mb-2">
                <strong>The tapeworm treatment — dogs only, and the timing is strict.</strong>
              </p>
              <p className="font-serif text-stone-700 leading-relaxed text-sm">
                A dog entering the UK must be treated for tapeworm by a vet, and the treatment must be recorded no less than 24 hours and no more than 120 hours (1–5 days) before you arrive in the UK. That is a narrow window — for the routes on this page, it usually means a vet visit in the European hub city, or along the way, after the flight but before the crossing. Cats and ferrets do not need it. The treatment is also not required for dogs arriving from Finland, Ireland, Malta or Norway. If the timing or the paperwork is wrong, the dog can be refused entry — so build the vet appointment into your route from the start.
              </p>
            </div>

            <h3 className="font-serif text-xl text-stone-900 mb-2 leading-snug">
              If your journey starts outside Europe — the extra step that catches people out
            </h3>
            <p className="font-serif text-stone-700 leading-relaxed mb-4">
              This is the most important thing on the page for anyone whose pet is coming from outside Europe — from Jamaica, India, South Africa, much of the Caribbean, the UAE, and many other countries. The UK sorts the world into <em>listed</em> and <em>unlisted</em> countries, and if your pet is travelling <em>from</em> an unlisted country, there is a major extra requirement: a rabies blood test (a titre test), and a fixed three-month wait afterwards.
            </p>

            <p className="font-serif text-stone-700 leading-relaxed mb-4">
              The sequence is exact: microchip first, then the rabies vaccination, then — at least 30 days later — a blood sample drawn by a vet and sent to an approved laboratory. The result must show the vaccination worked. And then you must wait three calendar months from the date that blood sample was taken before the pet can enter the UK. The blood test stays valid as long as the rabies boosters are kept up without a gap.
            </p>

            <div className="bg-stone-900 text-stone-100 p-5 rounded-sm mb-4">
              <p className="font-serif text-base leading-relaxed mb-2">
                Transiting through Paris does <em>not</em> reset this.
              </p>
              <p className="font-sans text-sm text-stone-300 leading-relaxed">
                It is the country your pet has actually been living in that sets the rule — not the airport it changes planes in. A pet flying Jamaica → Paris → UK is still treated as arriving from Jamaica, an unlisted country, and still needs the blood test done at least three months before UK arrival. The European hub is just a transit point. The one exemption is narrow: a pet that was vaccinated, blood-tested and given its travel document <em>while in the EU</em> before going to an unlisted country can skip the three-month wait — but that does not help a pet whose journey simply begins in an unlisted country.
              </p>
            </div>

            <p className="font-serif text-stone-700 leading-relaxed mb-4">
              The practical consequence: if you are coming from an unlisted country, the blood test must be one of the very first things you do — months before you fly. Pets from unlisted countries also need an official third-country veterinary health certificate rather than an EU pet passport. Get the order wrong, or miscount the three months, and the pet faces up to four months of quarantine, or refusal of entry. For unlisted-country moves, start planning four to six months ahead.
            </p>

            <p className="font-serif text-stone-700 leading-relaxed mb-2">
              To check which category your country is in, and confirm the current rules, use the official UK government guidance:
            </p>
            <ul className="font-serif text-stone-700 leading-relaxed mb-2 space-y-1.5 ml-5 list-disc">
              <li>
                <a href="https://www.gov.uk/bring-pet-to-great-britain" target="_blank" rel="noopener noreferrer" className="text-amber-700 underline decoration-amber-300 hover:decoration-amber-600 underline-offset-2">gov.uk · bring your pet to Great Britain</a> — the main guidance, including the listed/unlisted country checker.
              </li>
              <li>
                <a href="https://www.gov.uk/guidance/pet-travel-to-and-from-great-britain" target="_blank" rel="noopener noreferrer" className="text-amber-700 underline decoration-amber-300 hover:decoration-amber-600 underline-offset-2">gov.uk · pet travel to and from Great Britain</a> — the approved routes and operators.
              </li>
            </ul>
            <p className="font-sans text-xs text-stone-500 leading-relaxed italic">
              For destination-specific paperwork — what an individual country requires before your pet can leave it — see that country's guide in the related guides below, or its official animal-health authority.
            </p>
          </section>

          {/* USDA endorsement */}
          <section id="usda" className="mb-14 scroll-mt-24">
            <div className="text-xs uppercase tracking-[0.25em] text-amber-700 mb-3">10 · If your pet is leaving the US</div>
            <h2 className="font-serif text-2xl md:text-3xl text-stone-900 mb-3 leading-tight">
              The USDA endorsement step — less scary than the forums suggest
            </h2>
            <p className="font-serif italic text-stone-600 text-lg mb-6 leading-snug">
              If your journey starts in the United States, there is one extra step — and a lot of unnecessary panic around it.
            </p>

            <p className="font-serif text-stone-700 leading-relaxed mb-4">
              A pet flying out of the US needs its health certificate <em>endorsed</em> — reviewed and stamped — by USDA APHIS. Reddit and Facebook are full of worried posts about certificates not arriving in time, or being endorsed at the airport. Those posts are a real warning: the endorsement <strong>must be done before you fly</strong> — the endorsed, ink-signed certificate physically travels with your pet, and USDA processing takes time, so this is the step to start early. The "10 days" you may see quoted is not a grace period to sort it after landing — it is an expiry clock: once APHIS endorses the certificate, your pet must <em>arrive</em> in the UK within 10 days. The certificate is also valid for 30 days from your vet's signature. The tight 48-hour deadline people quote applies to <em>commercial</em> movements — not a typical family flying with their own pet — but a non-commercial move still needs the endorsement in hand before departure.
            </p>

            <div className="bg-amber-50 border-l-2 border-amber-500 p-4 mb-6">
              <p className="font-serif text-stone-800 leading-relaxed text-sm mb-2">
                <strong>The two things that actually cause delays.</strong>
              </p>
              <p className="font-serif text-stone-700 leading-relaxed text-sm">
                First, paperwork errors — an incorrect certificate gets bounced back for correction, and that round trip eats the days, not USDA's review. Second, the return shipping label: if your destination needs a physical embossed certificate, you must supply a prepaid, trackable courier label so the stamped document can be posted back to you — with your own address in both the sender and recipient fields, and no USDA address on it. Get those two right and endorsement becomes the routine administrative step it should be.
              </p>
            </div>

            <p className="font-serif text-stone-700 leading-relaxed mb-2">
              This is a genuinely important step that catches people out — so we have written it up in full, including a proper walkthrough of that return label and what the forum horror stories actually mean.
            </p>
            <ul className="font-serif text-stone-700 leading-relaxed mb-2 space-y-1.5 ml-5 list-disc">
              <li>
                <Link href="/usda-endorsement-guide" className="text-amber-700 underline decoration-amber-300 hover:decoration-amber-600 underline-offset-2">The USDA endorsement guide</Link> — the full deep-dive: where endorsement sits, the VEHCS colour banners, the deadlines, and the prepaid return label explained step by step.
              </li>
            </ul>
          </section>

          {/* Ireland note */}
          <section id="ireland" className="mb-14 scroll-mt-24">
            <div className="text-xs uppercase tracking-[0.25em] text-amber-700 mb-3">11 · A note on Ireland</div>
            <h2 className="font-serif text-2xl md:text-3xl text-stone-900 mb-3 leading-tight">
              Ireland is a separate destination — not a back door into the UK
            </h2>
            <p className="font-serif italic text-stone-600 text-lg mb-6 leading-snug">
              People often ask about the Wales–Ireland ferry. Here is how it actually fits.
            </p>

            <p className="font-serif text-stone-700 leading-relaxed mb-4">
              The Holyhead–Dublin ferry (Stena Line and Irish Ferries, ~3h 15m) is a great pet crossing — but it connects Britain and Ireland, not continental Europe to the UK. If your destination is the Republic of Ireland, the cleanest route in is the direct France→Ireland ferry (Cherbourg or Roscoff to Rosslare or Dublin), skipping Britain altogether. Cabin flights into Dublin exist — Iberia (Madrid→Dublin) and KLM (Amsterdam→Dublin) — but options are limited beyond those two routes. One Ireland-specific rule that catches people out: arrivals into Ireland (by air or ferry) must be pre-notified at least 24 hours in advance via Ireland's official Pet Travel Portal at <a href="https://www.pettravel.gov.ie/" target="_blank" rel="noopener noreferrer" className="text-amber-700 underline decoration-amber-300 hover:decoration-amber-600 underline-offset-2">pettravel.gov.ie</a> — many airlines (Iberia, KLM, TAP among them) will not confirm boarding until that notice is filed, so submit it ideally a week ahead. The main guide's Ireland section covers the rest properly.
            </p>

            <div className="bg-amber-50 border-l-2 border-amber-500 p-5 mb-4">
              <p className="font-serif text-stone-800 leading-relaxed text-sm mb-2">
                <strong>Flown your pet into Dublin and now need Britain?</strong>
              </p>
              <p className="font-serif text-stone-700 leading-relaxed text-sm">
                The Holyhead ferry works in reverse — a useful onward route. Cabin flight into Dublin (Iberia or KLM), then <strong>Dublin → Holyhead</strong> (Irish Ferries or Stena Line, ~3h 15m), then overland. Pets travel free or for a small fee in a kennel, pet-friendly cabin or your vehicle; foot passengers with a pet in a rigid carrier are accepted, so no car needed. Into Britain a dog needs an AHC, GB pet health certificate or valid EU/NI pet passport with current rabies vaccination, plus tapeworm treatment 24–120 hours before arrival. A back route into Britain when no in-cabin flight into the UK exists.
              </p>
            </div>
          </section>

          <div className="h-px bg-stone-300 mb-12" />

          {/* CTA */}
          <section className="mb-14">
            <div className="bg-stone-900 text-stone-50 rounded-sm p-7 md:p-9">
              <div className="text-xs uppercase tracking-[0.25em] text-amber-400 mb-3">
                Plan your own route
              </div>
              <h2 className="font-serif text-2xl md:text-3xl mb-3 leading-tight">
                Build this into a step-by-step plan
              </h2>
              <p className="font-serif text-stone-300 leading-relaxed mb-6">
                The journey planner takes your starting city and works out the cabin legs, the crossing, and a checklist tailored to your route — including the tapeworm window dates. It is the fastest way to turn this guide into a plan for your specific trip.
              </p>
              <Link
                href="/?go=planner"
                className="inline-flex items-center gap-2 bg-amber-600 hover:bg-amber-500 text-white font-serif text-base px-6 py-3 rounded-sm transition-colors"
              >
                Open the journey planner →
              </Link>
            </div>
          </section>

          {/* Related guides */}
          <section className="mb-8">
            <div className="text-xs uppercase tracking-[0.25em] text-amber-700 mb-4">Related guides</div>
            <div className="space-y-3">
              <Link href="/uk-pet-travel" className="block bg-white border border-stone-200 rounded-sm p-4 hover:border-amber-400 transition-colors group">
                <div className="font-serif text-lg text-stone-900 group-hover:text-amber-700 transition-colors">United Kingdom — the full country guide</div>
                <div className="font-sans text-sm text-stone-600">The cabin ban explained, plus the Paris-pivot workaround in depth.</div>
              </Link>
              <Link href="/travel-day-with-a-pet" className="block bg-white border border-stone-200 rounded-sm p-4 hover:border-amber-400 transition-colors group">
                <div className="font-serif text-lg text-stone-900 group-hover:text-amber-700 transition-colors">Travel day with a pet</div>
                <div className="font-sans text-sm text-stone-600">What the airport, the flight and the crossing actually feel like — and how to prepare.</div>
              </Link>
              <Link href="/india-pet-travel" className="block bg-white border border-stone-200 rounded-sm p-4 hover:border-amber-400 transition-colors group">
                <div className="font-serif text-lg text-stone-900 group-hover:text-amber-700 transition-colors">India — pet travel guide</div>
                <div className="font-sans text-sm text-stone-600">An unlisted-country example: the blood test, the timeline, and the routes out.</div>
              </Link>
              <Link href="/" className="block bg-white border border-stone-200 rounded-sm p-4 hover:border-amber-400 transition-colors group">
                <div className="font-serif text-lg text-stone-900 group-hover:text-amber-700 transition-colors">Back to the main guide</div>
                <div className="font-sans text-sm text-stone-600">Every tool — the journey planner, the checklist builder, and all the country guides.</div>
              </Link>
            </div>
          </section>

          <p className="font-sans text-xs text-stone-400 leading-relaxed border-t border-stone-200 pt-6">
            This guide is for planning purposes and is not veterinary, legal or border-control advice. Pet travel rules, ferry schedules, operator policies and fares change — always confirm the current requirements with the official UK government guidance and directly with your chosen carrier or transporter before booking and again before travelling. Last reviewed July 2026.
          </p>
        </main>
      </div>
    </>
  );
}