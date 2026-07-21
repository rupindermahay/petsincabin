import Head from "next/head";
import Link from "next/link";

export default function UKPetTravel() {
  return (
    <>
      <Head>
        <title>Flying a Dog or Cat in Cabin to the UK: Why You Can't (and the Workarounds That Do) | Pets in Cabin</title>
        <meta
          name="description"
          content="No airline flies pets in the cabin into the UK — it's a government rule, not an airline one. Here's why, plus the verified workaround routes (mainland EU hub + Eurotunnel, Channel and North Sea ferries, pet taxi) that get your dog or cat to Britain without the cargo hold."
        />
        <link rel="canonical" href="https://www.petsincabin.com/uk-pet-travel" />
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
            UK pet travel · The honest guide
          </div>

          {/* Headline */}
          <h1 className="font-serif text-4xl md:text-5xl leading-[1.05] text-stone-900 mb-6">
            Flying a dog or cat in the cabin <span className="italic text-stone-600">to the UK</span> — why you can't, and what works instead.
          </h1>

          <p className="font-serif text-lg md:text-xl text-stone-700 leading-relaxed mb-10">
            This is the single most confusing thing in pet travel, and the internet is full of half-answers. So here's the plain version: no commercial airline will fly your pet in the cabin into the United Kingdom. Not one. It's not the airline being difficult — it's a UK government rule that applies to every carrier equally. But pets arrive in Britain every single day, and almost none of them go in the cargo hold. Here's how.
          </p>

          <div className="h-px bg-stone-300 my-12" />

          {/* Section: Why */}
          <h2 className="font-serif text-2xl md:text-3xl text-stone-900 mb-5">
            Why pets can't fly in cabin to the UK
          </h2>
          <div className="space-y-4 font-serif text-stone-700 leading-relaxed mb-8">
            <p>
              The UK requires every pet entering the country on a commercial flight to travel as <strong>manifested cargo</strong> — booked separately, travelling in the hold, processed through an Animal Reception Centre on arrival. There is no in-cabin option and no checked-baggage option. The only exception is a registered assistance dog.
            </p>
            <p>
              This catches people out because it's <em>directional</em>. You can fly out of the UK with your pet in the cabin — Heathrow to Paris, to Frankfurt, to Lisbon, to Toronto — on plenty of airlines. Manchester and Edinburgh also have their own direct cabin departures (Etihad from Manchester to Abu Dhabi; KLM, Air France, Lufthansa, SAS, Iberia, Finnair, TAP and Air Canada from Edinburgh). Glasgow has KLM to Amsterdam — fewer carriers than Edinburgh, but for someone living in the west of Scotland, often the right airport for a cabin pet to mainland Europe. It's only the inbound leg that's blocked. So a route that worked beautifully on the way out simply doesn't exist on the way home.
            </p>
            <p>
              And to close off the obvious question: <strong>Eurostar does not carry pets either</strong>. The train through the Channel Tunnel bans them on every route. The tunnel itself is part of the answer — but not the passenger train.
            </p>
          </div>

          {/* Pull quote */}
          <div className="border-l-2 border-amber-600 pl-5 py-1 my-10">
            <p className="font-serif text-xl md:text-2xl italic text-stone-800 leading-snug">
              The wall is real. The workaround is a short drive and a 35-minute crossing.
            </p>
          </div>

          {/* Section: The workarounds */}
          <h2 className="font-serif text-2xl md:text-3xl text-stone-900 mb-5">
            The workaround routes that actually work
          </h2>
          <p className="font-serif text-stone-700 leading-relaxed mb-8">
            Every reliable route into the UK has the same shape: fly your pet in the cabin to mainland Europe, then make the final crossing by land or sea — where your pet stays with you the whole way. Three versions, in the order most people use them.
          </p>

          {/* Workaround 1 — Paris Pivot */}
          <div className="bg-white border border-stone-200 rounded-sm p-6 mb-5">
            <div className="text-xs uppercase tracking-widest text-amber-700 mb-2">Workaround 1 · The favourite</div>
            <h3 className="font-serif text-xl text-stone-900 mb-3">EU hub + Eurotunnel (the "Paris Pivot" is the famous one)</h3>
            <p className="font-serif text-stone-700 leading-relaxed mb-4">
              Fly into Paris CDG in the cabin — Air France, KLM, Lufthansa or another EU carrier will all take a pet in the cabin. Then a pet taxi or rental car from Paris to Calais, around three hours. Cross the Channel on <strong>Eurotunnel Le Shuttle</strong> from Calais to Folkestone: your pet stays in the car with you for the 35-minute crossing. Drive on into London. This is the route most savvy owners use, and the one most UK pet importers will quote you.
            </p>
            <p className="font-serif text-stone-700 leading-relaxed mb-4">
              <strong>Frankfurt</strong> (Lufthansa) and <strong>Amsterdam</strong> (KLM) and <strong>Lisbon</strong> (TAP) work the same way — fly cabin to the hub, drive to Calais, take the Eurotunnel. Use whichever hub your origin city flies to most directly. Frankfurt→Calais is the longer drive (7–8h, consider an overnight stop); Amsterdam→Calais is roughly the same as Paris.
            </p>
            <div className="text-sm text-stone-500 border-t border-stone-100 pt-3">
              <strong className="text-stone-700">Rough cost:</strong> Eurotunnel pet fee from ~£24 per pet each way (the vehicle ticket is separate, roughly £115–£229 one way for the car) · pet taxi hub-to-Calais £300–£600 · plan a full day, 8–10 hours door to door from Paris (longer from Frankfurt).
            </div>
          </div>

          {/* Workaround 2 — Ferry */}
          <div className="bg-white border border-stone-200 rounded-sm p-6 mb-5">
            <div className="text-xs uppercase tracking-widest text-amber-700 mb-2">Workaround 2 · Often the calmest</div>
            <h3 className="font-serif text-xl text-stone-900 mb-3">The Ferry Route</h3>
            <p className="font-serif text-stone-700 leading-relaxed mb-4">
              Brittany Ferries, DFDS, P&O and Stena Line all run pet-friendly crossings from France, the Netherlands and Spain into the UK. Many now have dedicated pet-friendly cabins where your dog or cat stays with you for the whole crossing — far less stressful than a hold. Routes from Caen, Cherbourg, Hoek van Holland and Bilbao are the popular ones. Slower than the tunnel, but for an anxious animal the extra space is worth a lot.
            </p>
            <div className="text-sm text-stone-500 border-t border-stone-100 pt-3">
              <strong className="text-stone-700">Rough cost:</strong> £40–£200 per pet depending on the route and whether you book a pet cabin.
            </div>
          </div>

          {/* Workaround 3 — Pet taxi */}
          <div className="bg-white border border-stone-200 rounded-sm p-6 mb-8">
            <div className="text-xs uppercase tracking-widest text-amber-700 mb-2">Workaround 3 · If you can't drive it yourself</div>
            <h3 className="font-serif text-xl text-stone-900 mb-3">Door-to-Door Pet Taxi</h3>
            <p className="font-serif text-stone-700 leading-relaxed mb-4">
              Companies like PetAir UK, Animal Couriers and Pet Express will collect your pet from your hotel in mainland Europe and deliver them to your London address — handling the paperwork and the Channel crossing for you. It's the priciest option, but if you can't drive the European leg yourself, it's the one that still keeps your pet out of the cargo hold.
            </p>
            <div className="text-sm text-stone-500 border-t border-stone-100 pt-3">
              <strong className="text-stone-700">Rough cost:</strong> £500–£1,200 from Paris to London.
            </div>
          </div>

          {/* Section: common origins */}
          <h2 className="font-serif text-2xl md:text-3xl text-stone-900 mb-5">
            Coming from the US, Canada, India or the Gulf?
          </h2>
          <div className="space-y-4 font-serif text-stone-700 leading-relaxed mb-8">
            <p>
              The shape is always the same: get to a European hub in the cabin, then do the land crossing. From any major US gateway — JFK, Boston, Chicago, Miami, LA — you can fly cabin to Paris on Air France or Delta, or to Amsterdam on KLM/Delta, then cross the Channel. From Canada, Air Canada takes cabin pets to Paris, then Eurotunnel. From India, the route runs through continental Europe first (Air India is cargo-only to the UK, and the UK wall applies on top — Air France, Lufthansa, SWISS, KLM or Etihad-via-AUH all carry cabin pets out of India to an EU hub). From Abu Dhabi, Etihad carries cabin pets out to a European hub, and the tunnel or a ferry does the rest.
            </p>
            <p>
              In every case the long-haul leg needs to be confirmed as cabin-eligible with the airline before you book — but the final Europe-to-UK leg always keeps your pet with you.
            </p>
          </div>

          {/* Section: paperwork */}
          <h2 className="font-serif text-2xl md:text-3xl text-stone-900 mb-5">
            The paperwork you'll need either way
          </h2>
          <p className="font-serif text-stone-700 leading-relaxed mb-4">
            However you make the crossing, the UK entry requirements are the same:
          </p>
          <ul className="space-y-2 font-serif text-stone-700 leading-relaxed mb-4 list-none">
            <li className="flex gap-3"><span className="text-amber-600 flex-shrink-0">·</span><span>An ISO-standard microchip, implanted before the rabies vaccine.</span></li>
            <li className="flex gap-3"><span className="text-amber-600 flex-shrink-0">·</span><span>A rabies vaccination at least 21 days old before entry.</span></li>
            <li className="flex gap-3"><span className="text-amber-600 flex-shrink-0">·</span><span>An Animal Health Certificate (AHC) from an accredited vet, issued within 10 days of travel. For GB residents this has replaced the pet passport for travel into the EU — see the note below.</span></li>
            <li className="flex gap-3"><span className="text-amber-600 flex-shrink-0">·</span><span>A tapeworm treatment given by a vet 24–120 hours before arrival — dogs only.</span></li>
          </ul>

          <div className="bg-amber-50 border border-amber-200 rounded-sm p-5 mb-4">
            <div className="font-serif text-stone-900 mb-1">A 2026 change worth knowing</div>
            <p className="font-serif text-stone-700 text-sm leading-relaxed">
              From 22 April 2026, if you live in Great Britain (England, Scotland or Wales) you can no longer use an EU pet passport to travel with your pet into the EU — even one issued by an EU vet, and even if it was issued before that date. EU pet passports are now only issued to people whose main home is in the EU. GB residents travelling to the EU now need an Animal Health Certificate (AHC) instead, obtained from a vet within 10 days of travel. You still need a new AHC for each outbound trip, but once you've arrived it covers up to six months of onward travel within the EU and the return journey home (validity extended from four to six months at the same time as the April 2026 change), as long as the rabies vaccination stays valid. GB residents can still use an EU pet passport for the return leg back into Great Britain. Always confirm the current detail on the UK government's pet travel pages before you go.
            </p>
          </div>

          <p className="font-serif text-stone-700 leading-relaxed mb-10">
            This is required no matter how you cross the Channel — tunnel, ferry or taxi. Always confirm the current detail against the UK government's official pet travel pages before you travel, since the rules do change.
          </p>

          <div className="h-px bg-stone-300 my-12" />

          {/* Feature callout — the dedicated routes-into-the-UK guide */}
          <Link
            href="/getting-your-pet-into-the-uk"
            className="block bg-amber-50 border-2 border-amber-300 hover:border-amber-500 rounded-sm p-6 md:p-7 transition-colors group mb-12"
          >
            <div className="text-xs uppercase tracking-[0.25em] text-amber-700 mb-2">The companion guide</div>
            <div className="font-serif text-xl md:text-2xl text-stone-900 group-hover:text-amber-800 transition-colors mb-2 leading-tight">
              Getting your pet into the UK from Europe — every route, compared →
            </div>
            <p className="font-serif text-stone-700 leading-relaxed text-sm">
              The three hub routes (Paris, Frankfurt, Amsterdam), every UK-approved ferry crossing, door-to-door pet taxis, the ocean-liner option, costs and journey times side by side — and the extra blood-test rule if your pet's journey starts outside Europe.
            </p>
          </Link>

          {/* The trip story */}
          <Link
            href="/#stories"
            className="block bg-stone-50 border border-stone-300 hover:border-amber-500 rounded-sm p-6 md:p-7 transition-colors group mb-12"
          >
            <div className="text-xs uppercase tracking-[0.25em] text-amber-700 mb-2">The trip story</div>
            <div className="font-serif text-xl md:text-2xl text-stone-900 group-hover:text-amber-800 transition-colors mb-2 leading-tight">
              Miami to London, with the same small dog →
            </div>
            <p className="font-serif text-stone-700 leading-relaxed text-sm">
              First-person account of Theo's actual July 2026 trip — the USDA paperwork trap that almost ended the crossing at Calais, the €90 EU Pet Passport backup that saved it, and the pet taxi driver who spotted the problem in time.
            </p>
          </Link>

          {/* CTA back to tools */}
          <div className="bg-stone-900 text-stone-100 rounded-sm p-8 text-center">
            <h2 className="font-serif text-2xl text-stone-50 mb-3">Map your own route</h2>
            <p className="font-serif text-stone-300 leading-relaxed mb-6">
              The journey planner takes your origin and destination and gives you the exact cabin route — or the workaround, if the UK wall is in the way.
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
                Get my UK checklist
              </Link>
            </div>
          </div>

          {/* Footer note */}
          <p className="font-sans text-xs text-stone-400 leading-relaxed mt-12 text-center">
            A reference, not a substitute for veterinary advice or official government policy. Rules change frequently — always confirm directly with your airline, the crossing operator, and the UK government before you travel.
          </p>

          {/* Related guides — cross-links to other country/topic pages */}
          <div className="mt-16 pt-10 border-t border-stone-300">
            <div className="text-xs uppercase tracking-[0.25em] text-amber-700 mb-2">Related guides</div>
            <h2 className="font-serif text-2xl text-stone-900 mb-6">More from the pets-in-cabin guide</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <Link href="/india-pet-travel" className="block bg-stone-50 border border-stone-200 hover:border-amber-300 transition-colors p-4 rounded-sm">
                <div className="font-serif text-base text-stone-900 mb-1">India guide →</div>
                <div className="text-xs text-stone-600 leading-relaxed">The heaviest NRI route into the UK — paperwork is similar.</div>
              </Link>

              <Link href="/iceland-pet-travel" className="block bg-stone-50 border border-stone-200 hover:border-amber-300 transition-colors p-4 rounded-sm">
                <div className="font-serif text-base text-stone-900 mb-1">Iceland guide →</div>
                <div className="text-xs text-stone-600 leading-relaxed">Even stricter than the UK — 14-day mandatory quarantine on entry.</div>
              </Link>

              <Link href="/oslo-pet-travel" className="block bg-stone-50 border border-stone-200 hover:border-amber-300 transition-colors p-4 rounded-sm">
                <div className="font-serif text-base text-stone-900 mb-1">Oslo (Norway) guide →</div>
                <div className="text-xs text-stone-600 leading-relaxed">Tapeworm rule and breed bans similar to the UK, but cabin IS allowed in.</div>
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
