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
          content="No airline flies a pet in the cabin into the UK — so here is every route that actually works, compared side by side. The three European hub routes (Paris, Frankfurt, Amsterdam), every UK-approved ferry crossing, door-to-door pet taxis, costs, journey times, and the paperwork including the tapeworm window."
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

        <main className="max-w-4xl mx-auto px-6 py-8 md:py-12">
          <div className="text-xs uppercase tracking-[0.25em] text-amber-700 mb-3">
            The complete guide
          </div>

          <h1 className="font-serif text-4xl md:text-5xl leading-[1.05] text-stone-900 mb-4">
            Getting your pet <span className="italic text-stone-600">into the UK from Europe</span>.
          </h1>

          <p className="font-serif text-lg text-stone-700 leading-relaxed mb-3">
            You can't fly a pet into the UK in the cabin — so people fly to Europe and cross the Channel with the pet beside them. This page compares every route that works: costs, times, the lot.
          </p>

          <p className="font-sans text-xs italic text-stone-500 leading-relaxed mb-8">
            Verified against the UK government's approved pet routes (gov.uk / APHA, May 2026), operator pet policies and DEFRA-licensed transporters. Rules and fares change — confirm before booking.
          </p>

          <div className="bg-white border border-stone-200 rounded-sm p-5 mb-8">
            <div className="text-xs uppercase tracking-widest text-stone-500 mb-3">In this guide</div>
            <div className="flex flex-wrap gap-2 text-sm">
              <a href="#why" className="text-stone-700 hover:text-amber-700 underline decoration-stone-300 hover:decoration-amber-600 underline-offset-4">The one rule</a>
              <a href="#compare" className="text-stone-700 hover:text-amber-700 underline decoration-stone-300 hover:decoration-amber-600 underline-offset-4">Compare the routes</a>
              <a href="#via-paris" className="text-stone-700 hover:text-amber-700 underline decoration-stone-300 hover:decoration-amber-600 underline-offset-4">Via Paris</a>
              <a href="#via-frankfurt" className="text-stone-700 hover:text-amber-700 underline decoration-stone-300 hover:decoration-amber-600 underline-offset-4">Via Frankfurt</a>
              <a href="#via-amsterdam" className="text-stone-700 hover:text-amber-700 underline decoration-stone-300 hover:decoration-amber-600 underline-offset-4">Via Amsterdam</a>
              <a href="#ferries" className="text-stone-700 hover:text-amber-700 underline decoration-stone-300 hover:decoration-amber-600 underline-offset-4">Every approved ferry</a>
              <a href="#pet-taxis" className="text-stone-700 hover:text-amber-700 underline decoration-stone-300 hover:decoration-amber-600 underline-offset-4">Door-to-door pet taxis</a>
              <a href="#qm2" className="text-stone-700 hover:text-amber-700 underline decoration-stone-300 hover:decoration-amber-600 underline-offset-4">The ocean-liner option</a>
              <a href="#paperwork" className="text-stone-700 hover:text-amber-700 underline decoration-stone-300 hover:decoration-amber-600 underline-offset-4">Paperwork &amp; tapeworm</a>
              <a href="#usda" className="text-stone-700 hover:text-amber-700 underline decoration-stone-300 hover:decoration-amber-600 underline-offset-4">Leaving the US</a>
              <a href="#ireland" className="text-stone-700 hover:text-amber-700 underline decoration-stone-300 hover:decoration-amber-600 underline-offset-4">A note on Ireland</a>
            </div>
          </div>

          <div className="h-px bg-stone-300 mb-10" />

          {/* Why no cabin route */}
          <section id="why" className="mb-14 scroll-mt-24">
            <div className="text-xs uppercase tracking-[0.25em] text-amber-700 mb-3">01 · The one rule</div>
            <h2 className="font-serif text-2xl md:text-3xl text-stone-900 mb-3 leading-tight">
              You cannot fly your pet into the UK in the cabin. Full stop.
            </h2>

            <p className="font-serif text-stone-700 leading-relaxed mb-4">
              It's a UK government rule, not an airline policy you can sweet-talk your way around — every pet flying into Britain rides as cargo, in the hold, no exceptions, Heathrow included. So nobody flies their pet <em>in</em>. What thousands of people do instead: fly the pet in the cabin to Europe, then cross the Channel by land or sea with the pet right beside them.
            </p>

            <p className="font-serif text-stone-700 leading-relaxed">
              That's the whole trick. The rest of this page is just <em>which</em> way to make that crossing — compared, costed and timed, so you can pick yours and get on with it.
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

            <p className="font-sans text-xs text-stone-500 leading-relaxed mb-3">
              <strong>How to read these costs.</strong> Every figure above is for a <em>single one-way crossing</em>. Two things people miss: first, the <em>vehicle ticket</em> (roughly £89–£230 for a car on the Calais–Dover ferry, more in peak summer) is the real cost — the pet fee of ~£15–£24 is only the surcharge for the dog on top of it. Second, the ferry and Eurotunnel both charge <em>per vehicle, not per person</em>: one car carries up to nine passengers for the same fare, so you, a sibling and the dog travel on one vehicle ticket plus one pet fee — not three fares. But if someone drives out from the UK to collect you, that is <em>two</em> crossings to pay for (their outbound trip and the return with you), each with its own vehicle ticket and — on the leg the pet is aboard — its own pet fee. Budget for the round trip, not a single leg.
            </p>

            <p className="font-sans text-xs text-stone-500 leading-relaxed mb-3">
              <strong>How the pet-taxi total is built.</strong> The figures above show the pet-taxi driving fare <em>plus</em> the vehicle crossing ticket — because the crossing is almost always charged on top of the driving fare, not bundled into it. The crossing ticket is the same one a self-driver buys, and its price changes daily with demand, so treat the total as a guide. A few operators do quote a single all-in price with the crossing included — so always ask, in writing: <em>"Does your fare include the Channel crossing ticket and tolls, or are those extra?"</em>
            </p>

            <div className="bg-white border border-stone-300 rounded-sm p-5 mb-3">
              <div className="font-serif text-lg text-stone-900 mb-2">The costs that ambush you — read this before you budget</div>
              <p className="font-serif text-stone-700 leading-relaxed text-sm mb-3">
                Here's the trap: every guide quotes the <em>pet's</em> crossing fee — that cheery "from £24" for the Eurotunnel — and stops there. But the pet fee is the tiny number. The one that actually stings is <strong>your own crossing ticket</strong>. The pet doesn't cross on its own; it crosses in a vehicle, and that vehicle needs a ticket.
              </p>
              <ul className="font-serif text-stone-700 leading-relaxed text-sm space-y-1.5 ml-5 list-disc mb-3">
                <li><strong>The vehicle crossing itself.</strong> A one-way standard Eurotunnel fare for a car is roughly £115–£229 — and one-way movers can't use the cheap return-only "day trip" deals. The fare covers the car and up to 9 passengers, so it's per <em>car</em>, not per person — but it's still the biggest single line, and it's <em>on top</em> of the ~£24 pet fee.</li>
                <li><strong>Car hire, if you don't bring your own.</strong> A one-way rental dropped in another country carries a hefty one-way drop fee, plus fuel and tolls across France or Belgium.</li>
                <li><strong>An overnight stop.</strong> The Frankfurt route especially is a long day — most people build in a hotel night, and it has to be a pet-friendly one.</li>
                <li><strong>Ferry cabins and per-pet fees.</strong> On the Amsterdam, Spain and longer France crossings, a pet-friendly cabin isn't the pet fee — it's a separate, often pricey, booking (priced per cabin). And the pet fee on a ferry is charged <em>per pet, each way</em> — unlike the Eurotunnel vehicle ticket, which is one price for the whole car. Two pets means two pet fees.</li>
              </ul>
              <p className="font-serif text-stone-700 leading-relaxed text-sm">
                None of this is hidden by anyone trying to trick you — it's just rarely added up in one place. So do add it up. The realistic all-in cost of the overland routes is the vehicle crossing <em>plus</em> the pet fee <em>plus</em> car hire/fuel <em>plus</em> any overnight — easily several hundred pounds before you've factored the flight. And if you use a pet taxi, the crossing ticket is normally charged on top of the driving fare — it's the same ticket either way — so when you compare a pet-taxi quote against driving it yourself, make sure both totals include that crossing. Ask the operator outright whether the crossing, pet fee and tolls are in their number.
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
              Fly your pet in the cabin to Paris Charles de Gaulle — Air France carries cabin pets up to 8 kg including the carrier on its long-haul network. From CDG, the route is overland to Calais (around three hours by road), then the Channel crossing into England.
            </p>

            <p className="font-serif text-stone-700 leading-relaxed mb-4">
              The crossing has two approved options. The Eurotunnel Le Shuttle puts your car on a train at Calais (Coquelles) and arrives at Folkestone in about 35 minutes — your pet stays in the car the entire time. The pet fee is small, from around £24 each way; the cost that matters is the vehicle ticket itself, roughly £115–£229 one way for a car (it covers up to nine passengers). Alternatively a pet-friendly ferry runs Calais–Dover (DFDS, P&O or Irish Ferries) in about 90 minutes — the pet again stays in the vehicle, and the same logic applies: a modest pet fee on top of the vehicle fare. See the cost breakdown above so nothing ambushes your budget.
            </p>

            <p className="font-serif text-stone-700 leading-relaxed">
              This is the route most people use, simply because the CDG–Calais drive is the shortest of the three hubs. If you would rather not drive it yourself, a door-to-door pet taxi (see below) covers exactly this route — collecting you at CDG and delivering you and your pet to your UK address.
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
              Fly your pet in the cabin to Frankfurt on Lufthansa, which carries cabin pets up to 8 kg including the carrier. From Frankfurt the route is the same idea as Paris — drive to Calais, then Eurotunnel or a ferry to Dover — but the overland leg is longer, roughly seven to eight hours by road.
            </p>

            <p className="font-serif text-stone-700 leading-relaxed mb-4">
              Because of that longer drive, many people split it with an overnight stop in Frankfurt or along the way, which also gives the pet a proper rest after the flight — just budget for a pet-friendly hotel. The crossing itself is identical to the Paris route: the small pet fee (from ~£24) sits on top of the vehicle crossing ticket (~£115–£229 one way for a car), whether you take the Eurotunnel or a Calais–Dover ferry.
            </p>

            <p className="font-serif text-stone-700 leading-relaxed">
              Frankfurt earns its place when Lufthansa offers a better flight from your departure city than Air France or KLM — for many long-haul origins it does. Door-to-door pet taxi operators run the Frankfurt route too, typically quoting a Frankfurt-to-London journey of around 10–14 hours including comfort breaks.
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
              Fly your pet in the cabin to Amsterdam on KLM, then take a short taxi from Schiphol to the DFDS ferry terminal at IJmuiden. From there, the DFDS overnight ferry sails directly to Newcastle — a UK-approved pet route — in around 16 to 17 hours, docking at North Shields.
            </p>

            <p className="font-serif text-stone-700 leading-relaxed mb-4">
              The appeal is that there's no white-knuckle motorway drive through Belgium and France — you let the boat do the work overnight. DFDS carries pets in pet-friendly cabins or onboard kennels, around £30 per pet each way on top of the cabin fare. One practical catch: foot passengers can't add a pet to the booking online — pet bookings on this route are made by phone with DFDS.
            </p>

            <p className="font-serif text-stone-700 leading-relaxed mb-4">
              There's also a faster version of the Amsterdam route. A door-to-door pet taxi from Schiphol doesn't take the slow ferry — it drives down through Belgium and France to the Eurotunnel, landing you in the UK in around seven to eight hours rather than seventeen. So Amsterdam gives you a genuine choice: the restful overnight boat, or the quicker overland drive with someone else at the wheel.
            </p>

            <p className="font-serif text-stone-700 leading-relaxed">
              The ferry version lands in the north of England, so it suits anyone heading for Scotland or northern England better than someone bound for London. Either way, dogs still need their tapeworm treatment in the 24–120 hour window before UK arrival — covered below.
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
                  Calais–Dover and Dunkerque–Dover are the short crossings (DFDS, P&O, Irish Ferries) — your pet stays in the car, and the pet fee is modest, around £15–£22 per pet each way on top of the vehicle fare. Longer Brittany Ferries crossings from western France carry pets too: Caen–Portsmouth, Cherbourg–Poole, Cherbourg–Plymouth, Cherbourg–Portsmouth, Roscoff–Plymouth and St Malo–Portsmouth. Dieppe–Newhaven (DFDS) is a useful mid-length option. Brittany Ferries pet fares on these France routes start from around £35 each way.
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
              A specialist pet transport service collects you and your pet at the European airport, drives the whole overland leg, handles the Channel crossing, and delivers you to your UK address. Multiple DEFRA-licensed operators run this on all three hub routes — Paris, Frankfurt and Amsterdam — meeting you at the arrivals gate so there is no airport-to-station transfer to organise.
            </p>

            <p className="font-serif text-stone-700 leading-relaxed mb-4">
              The pet usually rides in the vehicle with you, often out of its carrier on a blanket beside you, and the operator handles the pet check-in at the Eurotunnel or ferry terminal. Costs vary widely with distance — operators quote roughly £400 to £2,000 for the door-to-door driving. The Frankfurt route, being the longest drive, sits at the higher end; a Paris collection is typically less. One thing to be clear on: that driving fare almost always sits separately from the Channel crossing ticket, which is normally charged on top (it's the same ticket a self-driver buys, and its price moves daily). A few operators quote a single all-in price with the crossing included — so always ask outright what's in the number.
            </p>

            <div className="bg-amber-50 border-l-2 border-amber-400 p-4 mb-4">
              <p className="font-serif text-stone-700 leading-relaxed text-sm">
                <strong>Check the licence.</strong> A transporter carrying pets commercially into the UK should hold a DEFRA authorisation. The UK government publishes a list of authorised long-journey transporters — it's reasonable to ask an operator for their authorisation before booking, and not every business advertising "pet taxi" is licensed for cross-border animal transport.
              </p>
            </div>

            <p className="font-serif text-stone-700 leading-relaxed">
              The pet taxi is the lowest-stress version of these routes: no hire car, no navigating a foreign motorway after a long-haul flight, and someone experienced handling the border paperwork. It costs more than driving yourself — but for many people, after the flight, that is exactly the part worth paying for.
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
              The UK government's approved-routes list includes one sea crossing that isn't a Channel ferry: New York to Southampton, on the Cunard Queen Mary 2. The QM2 is an ocean liner with dedicated kennels, and it is an approved route for bringing a pet into the UK.
            </p>

            <p className="font-serif text-stone-700 leading-relaxed mb-4">
              For a pet travelling from the United States or Canada, this removes the flight altogether — no cabin-versus-cargo question, no European hub, no Channel crossing. The crossing takes about seven nights. It is a premium option, with a kennel fare on top of the cabin, and the kennels are limited and book up far in advance — but for an anxious pet, or an owner who would simply rather not fly, it is a genuine alternative worth knowing about.
            </p>

            <p className="font-serif text-stone-700 leading-relaxed">
              The same paperwork applies as for any other route into the UK — microchip, rabies vaccination, the tapeworm treatment for dogs in the correct window before arrival — so read the paperwork section below regardless of how you cross.
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

          {/* USDA endorsement — black box, matching the CTA weighting */}
          <section id="usda" className="mb-14 scroll-mt-24">
            <div className="bg-stone-900 text-stone-50 rounded-sm p-7 md:p-9">
              <div className="text-xs uppercase tracking-[0.25em] text-amber-400 mb-3">
                10 · If your pet is leaving the US
              </div>
              <h2 className="font-serif text-2xl md:text-3xl mb-3 leading-tight">
                The USDA endorsement step — less scary than the forums suggest
              </h2>
              <p className="font-serif text-stone-300 leading-relaxed mb-4">
                A pet flying out of the US needs its health certificate <em>endorsed</em> — reviewed and stamped — by USDA APHIS. Reddit and Facebook are full of worried posts about certificates not arriving in time, or being endorsed at the airport. The reassuring part those posts leave out: for the UK, the endorsement does <strong className="text-stone-100">not</strong> have to happen before you fly. The non-commercial UK health certificate must be endorsed within 10 days of your pet <em>arriving</em> in the UK, and is valid for 30 days from your vet's signature. The tight 48-hour deadline people quote applies to <em>commercial</em> movements — not a typical family flying with their own pet.
              </p>
              <p className="font-serif text-stone-300 leading-relaxed mb-6">
                Two things actually cause the delays. First, paperwork errors — an incorrect certificate gets bounced back for correction, and that round trip eats the days, not USDA's review. Second, the return shipping label: if your destination needs a physical embossed certificate, you must supply a prepaid, trackable courier label so the stamped document can be posted back to you, with your own address in both the sender and recipient fields and no USDA address on it. Get those two right and endorsement becomes the routine administrative step it should be.
              </p>
              <Link
                href="/usda-endorsement-guide"
                className="inline-flex items-center gap-2 bg-amber-600 hover:bg-amber-500 text-white font-serif text-base px-6 py-3 rounded-sm transition-colors"
              >
                Read the full USDA endorsement guide →
              </Link>
            </div>
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
              There is a well-known ferry between Holyhead in Wales and Dublin — Stena Line and Irish Ferries both run it, the crossing is about 3 hours 15 minutes, it carries pets in pet-friendly cabins, kennels or in your vehicle, and foot passengers with pets are accepted (a foot passenger's pet must travel in a rigid carrier). It is a genuinely good pet crossing.
            </p>

            <p className="font-serif text-stone-700 leading-relaxed mb-4">
              But it is worth being clear about direction. That ferry connects Great Britain and Ireland — it is not a route <em>into</em> the UK from continental Europe. If your destination is the Republic of Ireland, the cleanest way in is the direct France→Ireland ferry (Cherbourg or Roscoff to Rosslare or Dublin), which skips Great Britain altogether. The Holyhead–Dublin ferry only becomes relevant as an <em>onward</em> leg — for example, a pet that has come into Great Britain by one of the routes above and is then continuing to Ireland.
            </p>

            <p className="font-serif text-stone-700 leading-relaxed">
              One thing that surprises people: getting a pet into Ireland by air runs into the same wall as the UK — no airline currently offers a cabin-pet service on flights into Ireland. Unlike the UK, that is not a legal ban (the Irish authorities do not object to cabin pets); it is simply that no carrier runs the service. Either way, a pet bound for Ireland comes in by sea or as cargo. If Ireland is your destination, the dedicated Ireland section of the main guide covers it properly.
            </p>
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
            This guide is for planning purposes and is not veterinary, legal or border-control advice. Pet travel rules, ferry schedules, operator policies and fares change — always confirm the current requirements with the official UK government guidance and directly with your chosen carrier or transporter before booking and again before travelling. Last reviewed May 2026.
          </p>
        </main>
      </div>
    </>
  );
}