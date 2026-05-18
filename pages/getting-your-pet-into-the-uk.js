import Head from "next/head";
import Link from "next/link";

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

        <main className="max-w-2xl mx-auto px-6 py-16 md:py-24">
          <div className="text-xs uppercase tracking-[0.25em] text-amber-700 mb-6">
            The complete guide
          </div>

          <h1 className="font-serif text-4xl md:text-5xl leading-[1.05] text-stone-900 mb-6">
            Getting your pet <span className="italic text-stone-600">into the UK from Europe</span>.
          </h1>

          <p className="font-serif text-lg md:text-xl text-stone-700 leading-relaxed mb-8">
            No airline flies a pet in the cabin into the UK — that is a UK government rule, not an airline policy you can shop around. Every pet entering the UK by air must travel as manifested cargo. But thousands of people bring pets in every year without using cargo at all: they fly the pet in the cabin to continental Europe, then cross the Channel by land or sea, with the pet beside them the whole way. This page lays out every route that works, side by side.
          </p>

          <p className="font-serif italic text-stone-600 leading-relaxed mb-8">
            Verified against the UK government's official list of approved pet travel routes (gov.uk / APHA, updated May 2026), the ferry operators' own pet policies, and DEFRA-licensed pet transport operators. Rules, schedules and fares change — confirm directly before booking.
          </p>

          <div className="bg-white border border-stone-200 rounded-sm p-5 mb-12">
            <div className="text-xs uppercase tracking-widest text-stone-500 mb-3">In this guide</div>
            <div className="flex flex-wrap gap-2 text-sm">
              <a href="#why" className="text-stone-700 hover:text-amber-700 underline decoration-stone-300 hover:decoration-amber-600 underline-offset-4">Why there's no cabin route</a>
              <a href="#compare" className="text-stone-700 hover:text-amber-700 underline decoration-stone-300 hover:decoration-amber-600 underline-offset-4">Compare the routes</a>
              <a href="#via-paris" className="text-stone-700 hover:text-amber-700 underline decoration-stone-300 hover:decoration-amber-600 underline-offset-4">Via Paris</a>
              <a href="#via-frankfurt" className="text-stone-700 hover:text-amber-700 underline decoration-stone-300 hover:decoration-amber-600 underline-offset-4">Via Frankfurt</a>
              <a href="#via-amsterdam" className="text-stone-700 hover:text-amber-700 underline decoration-stone-300 hover:decoration-amber-600 underline-offset-4">Via Amsterdam</a>
              <a href="#ferries" className="text-stone-700 hover:text-amber-700 underline decoration-stone-300 hover:decoration-amber-600 underline-offset-4">Every approved ferry</a>
              <a href="#pet-taxis" className="text-stone-700 hover:text-amber-700 underline decoration-stone-300 hover:decoration-amber-600 underline-offset-4">Door-to-door pet taxis</a>
              <a href="#qm2" className="text-stone-700 hover:text-amber-700 underline decoration-stone-300 hover:decoration-amber-600 underline-offset-4">The ocean-liner option</a>
              <a href="#paperwork" className="text-stone-700 hover:text-amber-700 underline decoration-stone-300 hover:decoration-amber-600 underline-offset-4">Paperwork &amp; tapeworm</a>
              <a href="#ireland" className="text-stone-700 hover:text-amber-700 underline decoration-stone-300 hover:decoration-amber-600 underline-offset-4">A note on Ireland</a>
            </div>
          </div>

          <div className="h-px bg-stone-300 mb-12" />

          {/* Why no cabin route */}
          <section id="why" className="mb-14 scroll-mt-24">
            <div className="text-xs uppercase tracking-[0.25em] text-amber-700 mb-3">01 · The starting point</div>
            <h2 className="font-serif text-2xl md:text-3xl text-stone-900 mb-3 leading-tight">
              Why there is no cabin flight into the UK
            </h2>
            <p className="font-serif italic text-stone-600 text-lg mb-6 leading-snug">
              Every route below exists because of one fixed rule.
            </p>

            <p className="font-serif text-stone-700 leading-relaxed mb-4">
              Under UK government rules, a pet dog, cat or ferret entering Great Britain by air must travel as manifested cargo in the hold — never in the cabin. This applies to every airline and every airport, including Heathrow. It is not negotiable and it cannot be worked around in the air.
            </p>

            <p className="font-serif text-stone-700 leading-relaxed mb-4">
              So the cabin route is an overland one. You fly your pet in the cabin to a continental European hub — Paris, Frankfurt or Amsterdam are the practical choices, because Air France, Lufthansa and KLM all carry cabin pets on long-haul routes into them — and then cross into the UK by land and sea, where your pet stays with you. The Channel crossing itself is on an approved route: the Eurotunnel Le Shuttle train, or a pet-friendly ferry.
            </p>

            <p className="font-serif text-stone-700 leading-relaxed">
              The three hub routes below differ mainly in the crossing at the end — Paris and Frankfurt feed the short Calais–Folkestone crossing, while Amsterdam has its own direct ferry to Newcastle. After the routes, this guide also covers every UK-approved ferry, the door-to-door pet taxi option, and even the one way to cross the Atlantic into the UK without flying at all.
            </p>
          </section>

          {/* Comparison table */}
          <section id="compare" className="mb-14 scroll-mt-24">
            <div className="text-xs uppercase tracking-[0.25em] text-amber-700 mb-3">02 · Compare the routes</div>
            <h2 className="font-serif text-2xl md:text-3xl text-stone-900 mb-3 leading-tight">
              The routes, side by side
            </h2>
            <p className="font-serif italic text-stone-600 text-lg mb-6 leading-snug">
              Journey times and costs are indicative — they vary by season, operator and how far you travel.
            </p>

            <div className="overflow-x-auto -mx-6 px-6 mb-4">
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className="border-b-2 border-stone-300">
                    <th className="text-left font-serif text-stone-900 py-2 pr-3 font-semibold">Route</th>
                    <th className="text-left font-serif text-stone-900 py-2 px-3 font-semibold">The crossing</th>
                    <th className="text-left font-serif text-stone-900 py-2 px-3 font-semibold">Rough journey time</th>
                    <th className="text-left font-serif text-stone-900 py-2 pl-3 font-semibold">Indicative cost</th>
                  </tr>
                </thead>
                <tbody className="font-sans text-stone-700">
                  <tr className="border-b border-stone-200">
                    <td className="py-3 pr-3 font-medium">Via Paris</td>
                    <td className="py-3 px-3">Drive CDG→Calais, then Eurotunnel or ferry to Dover</td>
                    <td className="py-3 px-3">Flight + ~5–6h overland</td>
                    <td className="py-3 pl-3">Eurotunnel ~£22/pet or ferry ~£15/pet, + car hire/fuel</td>
                  </tr>
                  <tr className="border-b border-stone-200">
                    <td className="py-3 pr-3 font-medium">Via Frankfurt</td>
                    <td className="py-3 px-3">Drive FRA→Calais, then Eurotunnel or ferry to Dover</td>
                    <td className="py-3 px-3">Flight + ~7–8h overland</td>
                    <td className="py-3 pl-3">Eurotunnel ~£22/pet or ferry ~£15/pet, + car hire/fuel</td>
                  </tr>
                  <tr className="border-b border-stone-200">
                    <td className="py-3 pr-3 font-medium">Via Amsterdam</td>
                    <td className="py-3 px-3">DFDS overnight ferry IJmuiden→Newcastle</td>
                    <td className="py-3 px-3">Flight + ~17h ferry</td>
                    <td className="py-3 pl-3">Ferry ~£30/pet + pet-friendly cabin</td>
                  </tr>
                  <tr className="border-b border-stone-200">
                    <td className="py-3 pr-3 font-medium">Door-to-door pet taxi</td>
                    <td className="py-3 px-3">Driver meets you at the airport; handles the whole crossing</td>
                    <td className="py-3 px-3">As the route above, but you don't drive</td>
                    <td className="py-3 pl-3">~£400–£2,000 depending on distance</td>
                  </tr>
                  <tr>
                    <td className="py-3 pr-3 font-medium">Cunard QM2</td>
                    <td className="py-3 px-3">Ocean liner New York→Southampton (no flight at all)</td>
                    <td className="py-3 px-3">~7 nights at sea</td>
                    <td className="py-3 pl-3">Premium — kennel fare on top of the crossing</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p className="font-sans text-xs text-stone-500 leading-relaxed italic mb-4">
              The pet taxi isn't a separate route — it's a way to do any of the three hub routes without driving yourself. The detailed sections below explain each.
            </p>

            <div className="bg-amber-50 border-l-2 border-amber-500 p-4">
              <p className="font-serif text-stone-800 leading-relaxed text-sm">
                <strong>One thing the table can't show:</strong> if your pet's journey <em>starts</em> outside Europe — Jamaica, India, South Africa, much of the Caribbean and elsewhere — there is a major extra step before any of these routes apply: a rabies blood test and a fixed three-month wait. Transiting through Paris does not get around it. This is covered in full under <a href="#paperwork" className="text-amber-700 underline decoration-amber-300 hover:decoration-amber-600 underline-offset-2">paperwork &amp; tapeworm</a> — read that section first if it applies to you.
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
              The crossing has two approved options. The Eurotunnel Le Shuttle puts your car on a train at Calais (Coquelles) and arrives at Folkestone in about 35 minutes — your pet stays in the car the entire time, with pets travelling from around £22 each way. Alternatively a pet-friendly ferry runs Calais–Dover (DFDS, P&O or Irish Ferries) in about 90 minutes, from roughly £15 per pet, with the pet again staying in the vehicle.
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
              Because of that longer drive, many people split it with an overnight stop in Frankfurt or along the way, which also gives the pet a proper rest after the flight. The crossing itself is identical to the Paris route: Eurotunnel from around £22 per pet, or a Calais–Dover ferry from around £15.
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
              The appeal is that there is no drive through Belgium and France at all. DFDS carries pets in pet-friendly cabins or onboard kennels, at around £30 per pet each way on top of the cabin fare. One practical detail: foot passengers cannot add a pet to the booking online — pet bookings on this route must be made by phone with DFDS.
            </p>

            <p className="font-serif text-stone-700 leading-relaxed">
              Because it lands in the north of England, the Amsterdam route suits anyone heading for Scotland or northern England better than someone bound for London. As with the other routes, dogs still need their tapeworm treatment in the 24–120 hour window before UK arrival — covered in the paperwork section below.
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
                  Calais–Dover and Dunkerque–Dover are the short crossings (DFDS, P&O, Irish Ferries) — your pet stays in the car. Longer Brittany Ferries crossings from western France carry pets too: Caen–Portsmouth, Cherbourg–Poole, Cherbourg–Plymouth, Cherbourg–Portsmouth, Roscoff–Plymouth and St Malo–Portsmouth. Dieppe–Newhaven (DFDS) is a useful mid-length option. Brittany Ferries pet fares start from around £35 each way.
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
                  Brittany Ferries runs Bilbao–Portsmouth, Santander–Portsmouth and Santander–Plymouth. These are long crossings — 24 to 36 hours — but they have pet-friendly cabins and kennels, and they suit anyone whose journey starts in Spain or southern Europe. Note that on the Spain routes only passengers travelling with a vehicle can bring a pet, and pet fares start from around £50 each way.
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
              The pet usually rides in the vehicle with you, often out of its carrier on a blanket beside you, and the operator handles the pet check-in at the Eurotunnel or ferry terminal. Costs vary widely with distance — operators quote roughly £400 to £2,000 for the door-to-door journey. The Frankfurt route, being the longest drive, sits at the higher end; a Paris collection is typically less.
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

          {/* Ireland note */}
          <section id="ireland" className="mb-14 scroll-mt-24">
            <div className="text-xs uppercase tracking-[0.25em] text-amber-700 mb-3">10 · A note on Ireland</div>
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