import Head from "next/head";
import Link from "next/link";

export default function USDAEndorsementGuide() {
  return (
    <>
      <Head>
        <title>The USDA Endorsement Guide: Getting Your Pet's Health Certificate Stamped (2026) | Pets in Cabin</title>
        <meta
          name="description"
          content="A plain-English guide to the USDA APHIS endorsement step for flying a pet out of the US — the deadlines that really apply, and the prepaid return label explained."
        />
        <link rel="canonical" href="https://www.petsincabin.com/usda-endorsement-guide" />
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
            The deep-dive guide
          </div>

          <h1 className="font-serif text-4xl md:text-5xl leading-[1.05] text-stone-900 mb-4">
            The USDA <span className="italic text-stone-600">endorsement guide</span>.
          </h1>

          <p className="font-serif text-lg text-stone-700 leading-relaxed mb-3">
            Getting your pet's health certificate stamped — without the last-minute panic. A plain-English walkthrough for anyone flying a pet out of the United States, focused on the step that generates the most worried posts online.
          </p>

          <p className="font-sans text-xs italic text-stone-500 leading-relaxed mb-8">
            Verified against USDA APHIS pet-travel and live-animal-export guidance, May 2026. This is general information, not official guidance — endorsement rules and timelines change, so always confirm with a USDA-accredited vet and the official APHIS website before you travel.
          </p>

          <div className="bg-white border border-stone-200 rounded-sm p-5 mb-8">
            <div className="text-xs uppercase tracking-widest text-stone-500 mb-3">In this guide</div>
            <div className="flex flex-wrap gap-2 text-sm">
              <a href="#reassurance" className="text-stone-700 hover:text-amber-700 underline decoration-stone-300 hover:decoration-amber-600 underline-offset-4">First, the reassurance</a>
              <a href="#big-picture" className="text-stone-700 hover:text-amber-700 underline decoration-stone-300 hover:decoration-amber-600 underline-offset-4">Where endorsement sits</a>
              <a href="#vet" className="text-stone-700 hover:text-amber-700 underline decoration-stone-300 hover:decoration-amber-600 underline-offset-4">Use an accredited vet</a>
              <a href="#vehcs" className="text-stone-700 hover:text-amber-700 underline decoration-stone-300 hover:decoration-amber-600 underline-offset-4">VEHCS &amp; the colour banners</a>
              <a href="#deadline" className="text-stone-700 hover:text-amber-700 underline decoration-stone-300 hover:decoration-amber-600 underline-offset-4">The two deadlines</a>
              <a href="#label" className="text-stone-700 hover:text-amber-700 underline decoration-stone-300 hover:decoration-amber-600 underline-offset-4">The prepaid return label</a>
              <a href="#horror-stories" className="text-stone-700 hover:text-amber-700 underline decoration-stone-300 hover:decoration-amber-600 underline-offset-4">What the horror stories mean</a>
              <a href="#checklist" className="text-stone-700 hover:text-amber-700 underline decoration-stone-300 hover:decoration-amber-600 underline-offset-4">A quick checklist</a>
            </div>
          </div>

          <div className="h-px bg-stone-300 mb-10" />

          {/* Reassurance */}
          <section id="reassurance" className="mb-14 scroll-mt-24">
            <div className="text-xs uppercase tracking-[0.25em] text-amber-700 mb-3">01 · First, the reassurance</div>
            <h2 className="font-serif text-2xl md:text-3xl text-stone-900 mb-3 leading-tight">
              The horror stories are missing the calming part
            </h2>
            <p className="font-serif italic text-stone-600 text-lg mb-6 leading-snug">
              The panicked posts are real. They are also missing context.
            </p>

            <p className="font-serif text-stone-700 leading-relaxed mb-4">
              If you have been reading Reddit threads or Facebook groups, you have seen the horror stories: certificates not delivered in time, owners getting paperwork endorsed while standing at the airport, packages lost in transit. Those posts are real — and they happen because the endorsement genuinely has to be done <em>before</em> you fly, and USDA processing takes time. So this is the one step to plan early.
            </p>

            <div className="bg-stone-900 text-stone-100 p-5 rounded-sm mb-4">
              <p className="font-serif text-base leading-relaxed mb-2">
                The endorsed certificate must be in your hand before you travel — it flies with the pet.
              </p>
              <p className="font-sans text-sm text-stone-300 leading-relaxed">
                USDA APHIS is explicit: the endorsed, ink-signed and embossed health certificate must accompany your pet during travel. You cannot fly with an un-endorsed certificate and sort the endorsement after arrival. The "10 days" you may have read about is not a grace period — it is an expiry clock: once APHIS endorses the certificate, your pet must <em>arrive</em> in the UK within 10 days. The certificate is also valid for only 30 days from your vet's signature. So the order is fixed: vet signs it, USDA endorses it, then you fly — and you must leave enough time for the endorsement to come back.
              </p>
            </div>

            <p className="font-serif text-stone-700 leading-relaxed mb-4">
              The 48-hour deadline people quote in fear is real — but it applies to a <em>different</em> situation, commercial movements, not the typical family flying with one pet. Most genuine delays trace back to two avoidable things: a paperwork error that bounces the certificate back for correction, and a return shipping label that was missing, wrong, or not prepaid. This guide is built to keep you clear of both.
            </p>

            <p className="font-serif text-stone-700 leading-relaxed">
              How long does USDA take? APHIS's own current notice is the honest answer: endorsements <strong>"may take several business days"</strong> and are often completed just one or two days before travel. Mailing adds more time on top. There is no in-person or drop-off service, and the endorsement offices run Monday-Friday only, 7:00am-4:30pm Central Time. So while the review itself can be quick when paperwork is clean, the right plan is to leave buffer for the system around it — not to rely on a same-day turnaround.
            </p>
          </section>

          {/* Big picture */}
          <section id="big-picture" className="mb-14 scroll-mt-24">
            <div className="text-xs uppercase tracking-[0.25em] text-amber-700 mb-3">02 · Where endorsement sits</div>
            <h2 className="font-serif text-2xl md:text-3xl text-stone-900 mb-3 leading-tight">
              Endorsement is step four of seven
            </h2>
            <p className="font-serif italic text-stone-600 text-lg mb-6 leading-snug">
              It is not a standalone task — it is where everything you did earlier gets checked.
            </p>

            <p className="font-serif text-stone-700 leading-relaxed mb-4">
              If you treat endorsement in isolation, you will miss that its timing is locked to steps before and after it. Here is the whole chain, in order:
            </p>

            <ol className="font-serif text-stone-700 leading-relaxed mb-4 space-y-2 ml-5 list-decimal">
              <li><strong>Microchip</strong> — an ISO-standard microchip must be implanted <em>first</em>. If it goes in after the rabies shot, the vaccination does not count.</li>
              <li><strong>Rabies vaccination</strong> — given after the microchip, with a waiting period before travel. Some countries also require a rabies blood test and a fixed three-month wait — check early.</li>
              <li><strong>Vet exam &amp; certificate issued</strong> — a USDA-accredited vet examines your pet, confirms it meets the destination's rules, and completes and signs the certificate.</li>
              <li><strong>USDA endorsement</strong> — the focus of this guide. USDA reviews and stamps the certificate.</li>
              <li><strong>Tapeworm treatment</strong> (UK and a few others, dogs only) — a narrow timing window, usually done close to arrival. The UK allows this before or after endorsement.</li>
              <li><strong>The airline's own paperwork deadline</strong> — separate from, and often earlier than, the government rules. Confirm it directly with your carrier.</li>
              <li><strong>Arrival</strong> — you hand over the endorsed paper certificate at the border.</li>
            </ol>

            <p className="font-serif text-stone-700 leading-relaxed">
              You do not need to master all seven. But know that endorsement is step four of seven, and getting it slightly wrong ripples into the steps around it. Your USDA-accredited vet is the person who connects these dots — which is exactly why choosing the right vet matters.
            </p>
          </section>

          {/* Accredited vet */}
          <section id="vet" className="mb-14 scroll-mt-24">
            <div className="text-xs uppercase tracking-[0.25em] text-amber-700 mb-3">03 · Use an accredited vet</div>
            <h2 className="font-serif text-2xl md:text-3xl text-stone-900 mb-3 leading-tight">
              Not every vet can do this
            </h2>

            <p className="font-serif text-stone-700 leading-relaxed mb-4">
              Only a <strong>USDA-accredited</strong> veterinarian can issue an export health certificate that USDA will endorse. Booking a non-accredited vet by mistake is one of the quieter ways people lose a week.
            </p>

            <p className="font-serif text-stone-700 leading-relaxed mb-4">
              Ask directly when you book: <em>"Are you USDA-accredited, and have you issued export health certificates for my destination country before?"</em> The second half matters — an accredited vet who has done your specific destination knows the certificate type and the quirks. APHIS publishes an accredited-vet locator on its pet-travel website.
            </p>

            <div className="bg-amber-50 border-l-2 border-amber-500 p-4">
              <p className="font-serif text-stone-800 leading-relaxed text-sm">
                <strong>What good help looks like.</strong> A strong accredited vet will walk you through the whole process, confirm your pet meets the destination's rules, submit the certificate for endorsement on your behalf, and keep you posted on its status. If a clinic seems unsure, find one that does this routinely.
              </p>
            </div>
          </section>

          {/* VEHCS */}
          <section id="vehcs" className="mb-14 scroll-mt-24">
            <div className="text-xs uppercase tracking-[0.25em] text-amber-700 mb-3">04 · VEHCS &amp; the colour banners</div>
            <h2 className="font-serif text-2xl md:text-3xl text-stone-900 mb-3 leading-tight">
              Digital or physical — your destination decides
            </h2>
            <p className="font-serif italic text-stone-600 text-lg mb-6 leading-snug">
              This single fact decides how stressful your timeline is.
            </p>

            <p className="font-serif text-stone-700 leading-relaxed mb-4">
              USDA runs an online system called <strong>VEHCS</strong> — the Veterinary Export Health Certification System. Your accredited vet uses it to create, sign, and submit the certificate to USDA electronically. That is faster and cleaner than mailing paper, because mistakes can be fixed online instead of couriered back and forth.
            </p>

            <p className="font-serif text-stone-700 leading-relaxed mb-4">
              But <em>how</em> USDA endorses depends on your destination. APHIS uses a colour-banner system on its country pages:
            </p>

            <ul className="font-serif text-stone-700 leading-relaxed mb-4 space-y-2 ml-5 list-disc">
              <li><strong>Green</strong> — the destination accepts USDA's <em>digital</em> endorsement. A digital seal is applied in VEHCS; no physical document travels back and forth. The smoothest case.</li>
              <li><strong>Yellow</strong> — partial digital acceptance, depending on the certificate or animal type.</li>
              <li><strong>Red</strong> — digital endorsement is not allowed; the certificate must be a physical paper original, wet-ink signed and overnight-shipped.</li>
            </ul>

            <p className="font-serif text-stone-700 leading-relaxed mb-4">
              When digital endorsement is <em>not</em> accepted, USDA must physically ink-sign and emboss the paper certificate — and then it has to physically get back to you. That return journey is where delivery delays happen, and it is why the prepaid return label exists and matters so much.
            </p>

            <div className="bg-amber-50 border-l-2 border-amber-500 p-4">
              <p className="font-serif text-stone-800 leading-relaxed text-sm">
                <strong>One rule holds no matter what:</strong> even when endorsement is digital, you must travel with a <em>printed paper hardcopy</em> of the endorsed certificate. The pet cannot board, and cannot clear the border, on a screen alone. Print it, and carry it.
              </p>
            </div>
          </section>

          {/* Deadlines */}
          <section id="deadline" className="mb-14 scroll-mt-24">
            <div className="text-xs uppercase tracking-[0.25em] text-amber-700 mb-3">05 · The two deadlines</div>
            <h2 className="font-serif text-2xl md:text-3xl text-stone-900 mb-3 leading-tight">
              Don't confuse the relaxed one with the strict one
            </h2>

            <p className="font-serif text-stone-700 leading-relaxed mb-4">
              The single biggest source of online panic is mixing up two deadlines that apply to two different situations.
            </p>

            <p className="font-serif text-stone-700 leading-relaxed mb-4">
              <strong>The relaxed one — non-commercial pet travel.</strong> The typical family flying with their own pet, not selling or transferring it. For the UK, once APHIS endorses the certificate your pet must <em>arrive</em> within 10 days — the EU works exactly the same way. The certificate is also valid for 30 days from your vet's signature. So the endorsement still has to be done before you fly, but the timing around it is workable: a certificate endorsed a few days before your flight is normal. The key is to leave enough time for USDA to process and return it — do not assume it is instant.
            </p>

            <p className="font-serif text-stone-700 leading-relaxed mb-4">
              <strong>One useful nuance for ferry routes.</strong> APHIS's own UK page adds that <em>"for pets traveling to the UK by sea, the 10 days is extended by the duration of sea travel."</em> So if you are flying into mainland Europe and crossing the Channel by ferry or Eurotunnel, that crossing time is added to your 10-day arrival window. A small but useful piece of slack if your route includes a sea leg into the UK.
            </p>

            <p className="font-serif text-stone-700 leading-relaxed mb-4">
              <strong>The strict one — commercial movements.</strong> Here the certificate must be endorsed within 48 hours of <em>departing</em> the US. This is the deadline people quote in fear. It catches owners who do not realise their move counts as commercial, or who were issued the wrong certificate type.
            </p>

            <div className="bg-stone-900 text-stone-100 p-5 rounded-sm">
              <p className="font-serif text-base leading-relaxed mb-2">
                If anyone tells you "you have 48 hours" — ask one question first.
              </p>
              <p className="font-sans text-sm text-stone-300 leading-relaxed">
                <em>Is my move commercial or non-commercial?</em> For most pet owners flying with their own pet, it is non-commercial, and the 48-hour rule simply does not apply. Your accredited vet will know your category. Getting this one distinction right removes most of the anxiety on its own.
              </p>
            </div>
          </section>

          {/* The prepaid return label */}
          <section id="label" className="mb-14 scroll-mt-24">
            <div className="text-xs uppercase tracking-[0.25em] text-amber-700 mb-3">06 · The prepaid return label</div>
            <h2 className="font-serif text-2xl md:text-3xl text-stone-900 mb-3 leading-tight">
              The prepaid return label, explained properly
            </h2>
            <p className="font-serif italic text-stone-600 text-lg mb-6 leading-snug">
              Most people have never made one — and aren't sure why they can't just collect the certificate from the vet.
            </p>

            <p className="font-serif text-stone-700 leading-relaxed mb-4">
              If your destination needs a physical, embossed certificate, the stamped document has to physically travel back to you after USDA endorses it. Your vet will ask you to provide a <strong>prepaid return shipping label</strong>. Here is the whole thing, plainly.
            </p>

            <h3 className="font-serif text-xl text-stone-900 mb-2 leading-snug">
              Why you can't pick it up from the vet
            </h3>
            <p className="font-serif text-stone-700 leading-relaxed mb-4">
              The vet's clinic and the USDA endorsement office are two different places, often in different cities. Your vet completes and signs the certificate — but the <em>endorsed</em> version only exists after USDA stamps it, and USDA has it, not your vet. So the finished certificate has to get from the USDA office back to you somehow. That "somehow" is a courier, and the prepaid label is how you arrange and pay for that return trip in advance.
            </p>

            <h3 className="font-serif text-xl text-stone-900 mb-2 leading-snug">
              What a prepaid return label actually is
            </h3>
            <p className="font-serif text-stone-700 leading-relaxed mb-3">
              It is an ordinary FedEx or UPS shipping label you buy <em>before</em> anything is sent, with three specific features:
            </p>
            <ul className="font-serif text-stone-700 leading-relaxed mb-4 space-y-2 ml-5 list-disc">
              <li><strong>It is prepaid</strong> — the shipping cost is charged when you create the label, not collected when the package is picked up.</li>
              <li><strong>It has a tracking number</strong> — so you can watch the certificate come back to you.</li>
              <li><strong>Your own name and address go in BOTH the sender and recipient fields.</strong> This surprises everyone. You are not shipping <em>to</em> USDA on this label — USDA is just putting your stamped certificate into a package and using your label to send it back to you. So this label goes from you, to you. The USDA office's address must not appear anywhere on it.</li>
            </ul>

            <h3 className="font-serif text-xl text-stone-900 mb-2 leading-snug">
              How to create one — the steps
            </h3>
            <ol className="font-serif text-stone-700 leading-relaxed mb-4 space-y-2 ml-5 list-decimal">
              <li>Go to the FedEx or UPS website (or a courier store in person) and start creating a shipping label.</li>
              <li>In <strong>both</strong> the "from / sender" and "to / recipient" fields, enter <strong>your own name and address</strong> — where you want the endorsed certificate delivered.</li>
              <li>Choose a fast, <strong>trackable</strong> service — overnight or priority. If your flight is on a Monday, consider Saturday delivery so the certificate isn't sitting in a depot over the weekend.</li>
              <li><strong>Pay for the label when you create it.</strong> USDA cannot accept a label with a credit card number written on it. If you want to pay by card, the courier must charge your card <em>at the moment you generate the label</em>, so the label comes out already paid. A label that says "bill recipient" or shows card details on its face will be rejected.</li>
              <li>Save and print the label as a PDF or image. Your vet uploads it into VEHCS, or you include the printed label in the package if paper is being mailed.</li>
              <li><strong>Keep your own copy of the tracking number.</strong> USDA will not look it up for you later.</li>
            </ol>

            <div className="bg-amber-50 border-l-2 border-amber-500 p-4">
              <p className="font-serif text-stone-800 leading-relaxed text-sm">
                <strong>That's it.</strong> Once the label is in the submission, USDA stamps your certificate, drops it in a package with your label on it, and it comes straight back to you — tracked.
              </p>
            </div>
          </section>

          {/* Light touch on neighbours */}
          <section className="mb-14 scroll-mt-24">
            <div className="text-xs uppercase tracking-[0.25em] text-amber-700 mb-3">07 · The steps either side</div>
            <h2 className="font-serif text-2xl md:text-3xl text-stone-900 mb-3 leading-tight">
              Two neighbours that catch people out
            </h2>

            <p className="font-serif text-stone-700 leading-relaxed mb-4">
              This guide is about endorsement, but two neighbouring steps cause trouble when people forget they connect.
            </p>

            <ul className="font-serif text-stone-700 leading-relaxed mb-2 space-y-3 ml-5 list-disc">
              <li><strong>Tapeworm treatment (UK, dogs only).</strong> A dog entering the UK needs a vet-recorded tapeworm treatment in a narrow window — no less than 24 and no more than 120 hours before arrival. The UK allows this before or after the USDA endorsement, so it does not constrain your endorsement timing — but it is a separate appointment you must not forget.</li>
              <li><strong>The airline's own deadline.</strong> Airlines set their own document requirements, often earlier and stricter than the government rules. The USDA endorsement window and the airline's cut-off are two different clocks. Confirm directly with your carrier — being fine for the border but missing the airline's paperwork deadline still grounds you.</li>
            </ul>
          </section>

          {/* Horror stories */}
          <section id="horror-stories" className="mb-14 scroll-mt-24">
            <div className="text-xs uppercase tracking-[0.25em] text-amber-700 mb-3">08 · What the horror stories mean</div>
            <h2 className="font-serif text-2xl md:text-3xl text-stone-900 mb-3 leading-tight">
              Real risks, and noise
            </h2>
            <p className="font-serif italic text-stone-600 text-lg mb-6 leading-snug">
              Most scary posts are avoidable mistakes dressed up as bad luck. A few are worth respecting.
            </p>

            <h3 className="font-serif text-xl text-stone-900 mb-3 leading-snug">
              Real risks — take these seriously
            </h3>
            <ul className="font-serif text-stone-700 leading-relaxed mb-6 space-y-2 ml-5 list-disc">
              <li><strong>Wrong certificate type.</strong> Being issued the wrong form, or a commercial certificate when you needed non-commercial. Fix: an accredited vet who has done your destination before.</li>
              <li><strong>The 48-hour commercial trap.</strong> Genuinely tight — but only if your move is commercial. Fix: confirm your category early.</li>
              <li><strong>Incomplete or incorrect paperwork.</strong> The number-one cause of "it didn't come back in time." An error sends the certificate back for correction, and <em>that</em> round trip eats the days — not USDA's review. Fix: let your vet check everything before submission.</li>
              <li><strong>Missing, wrong, or unpaid return label.</strong> No label, a label with the USDA address on it, or one that wasn't prepaid — any of these stalls the return. Fix: section 06, done carefully.</li>
            </ul>

            <h3 className="font-serif text-xl text-stone-900 mb-3 leading-snug">
              Mostly noise — don't lose sleep
            </h3>
            <ul className="font-serif text-stone-700 leading-relaxed mb-6 space-y-2 ml-5 list-disc">
              <li><strong>"Endorsed at the airport" / "came through close to the flight."</strong> For UK and EU non-commercial travel there is real slack — a 10-day-after-arrival window for the UK. Cutting it close is uncomfortable, but usually not the failure it looks like.</li>
              <li><strong>"USDA is so slow."</strong> APHIS's own notice says endorsements may take several business days, and most are completed just one or two days before travel — so it isn't instant. But the worst delays people post about usually involve a paperwork bounce-back or a courier leg, not USDA's review itself. Start early enough that "several business days" isn't a problem.</li>
            </ul>

            <div className="bg-stone-900 text-stone-100 p-5 rounded-sm">
              <p className="font-serif text-base leading-relaxed mb-2">
                The pattern is clear.
              </p>
              <p className="font-sans text-sm text-stone-300 leading-relaxed">
                The process is reliable when the paperwork is right and the label is done properly. Start early, use an accredited vet who knows your destination, get the return label right, and keep a printed copy of the endorsed certificate with you. Do that, and endorsement becomes the boring administrative step it is supposed to be.
              </p>
            </div>
          </section>

          {/* Checklist */}
          <section id="checklist" className="mb-14 scroll-mt-24">
            <div className="text-xs uppercase tracking-[0.25em] text-amber-700 mb-3">09 · A quick checklist</div>
            <h2 className="font-serif text-2xl md:text-3xl text-stone-900 mb-3 leading-tight">
              Before you submit
            </h2>

            <div className="bg-white border border-stone-200 rounded-sm p-5">
              <ul className="font-serif text-stone-700 leading-relaxed space-y-2.5">
                <li>☐ Vet confirmed as <strong>USDA-accredited</strong> — ideally experienced with your destination</li>
                <li>☐ Microchip and rabies vaccination done <strong>in the right order</strong>, before the certificate</li>
                <li>☐ Destination's <strong>colour-banner status</strong> checked — digital endorsement, or physical?</li>
                <li>☐ Clear on <strong>non-commercial vs commercial</strong> — and therefore which deadline applies</li>
                <li>☐ If physical: <strong>prepaid, trackable return label</strong> — your address in both fields, no USDA address, no card number on the label</li>
                <li>☐ <strong>Printed paper hardcopy</strong> of the endorsed certificate ready to travel with the pet</li>
                <li>☐ <strong>Airline's own document deadline</strong> confirmed directly with the carrier</li>
                <li>☐ Tapeworm appointment (UK, dogs) booked into the timeline</li>
                <li>☐ <strong>Backup plan</strong> in case the certificate isn't ready in time — APHIS itself recommends one (a caretaker, or a movable travel date)</li>
              </ul>
            </div>
          </section>

          <p className="font-serif text-stone-700 leading-relaxed mb-2">
            To confirm the current rules and your destination's specifics, use the official guidance:
          </p>
          <ul className="font-serif text-stone-700 leading-relaxed mb-12 space-y-1.5 ml-5 list-disc">
            <li>
              <a href="https://www.aphis.usda.gov/pet-travel" target="_blank" rel="noopener noreferrer" className="text-amber-700 underline decoration-amber-300 hover:decoration-amber-600 underline-offset-2">aphis.usda.gov · pet travel</a> — the official USDA APHIS pet-travel hub, including country requirements and the accredited-vet locator.
            </li>
            <li>
              <a href="https://www.aphis.usda.gov/pet-travel/us-to-another-country-export" target="_blank" rel="noopener noreferrer" className="text-amber-700 underline decoration-amber-300 hover:decoration-amber-600 underline-offset-2">aphis.usda.gov · taking a pet from the US (export)</a> — the process overview, fees, and the pet-owner shipping checklist.
            </li>
          </ul>

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
                The journey planner takes your starting city and works out the cabin legs, the crossing, and a checklist tailored to your route. If you're flying out of the US, it is the fastest way to see where the endorsement step lands in your timeline.
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
              <Link href="/getting-your-pet-into-the-uk" className="block bg-white border border-stone-200 rounded-sm p-4 hover:border-amber-400 transition-colors group">
                <div className="font-serif text-lg text-stone-900 group-hover:text-amber-700 transition-colors">Getting your pet into the UK</div>
                <div className="font-sans text-sm text-stone-600">Every route into the UK compared — and the paperwork, including where USDA endorsement fits.</div>
              </Link>
              <Link href="/seattle-pet-travel" className="block bg-white border border-stone-200 rounded-sm p-4 hover:border-amber-400 transition-colors group">
                <div className="font-serif text-lg text-stone-900 group-hover:text-amber-700 transition-colors">Flying with a pet from Seattle</div>
                <div className="font-sans text-sm text-stone-600">A US origin guide — the airlines, the routes, and the export paperwork.</div>
              </Link>
              <Link href="/japan-pet-travel" className="block bg-white border border-stone-200 rounded-sm p-4 hover:border-amber-400 transition-colors group">
                <div className="font-serif text-lg text-stone-900 group-hover:text-amber-700 transition-colors">Japan — pet travel guide</div>
                <div className="font-sans text-sm text-stone-600">A destination where the endorsement step is part of an unforgiving timeline.</div>
              </Link>
              <Link href="/" className="block bg-white border border-stone-200 rounded-sm p-4 hover:border-amber-400 transition-colors group">
                <div className="font-serif text-lg text-stone-900 group-hover:text-amber-700 transition-colors">Back to the main guide</div>
                <div className="font-sans text-sm text-stone-600">Every tool — the journey planner, the checklist builder, and all the country guides.</div>
              </Link>
            </div>
          </section>

          <p className="font-sans text-xs text-stone-400 leading-relaxed border-t border-stone-200 pt-6">
            This guide is for planning purposes and is not veterinary, legal or border-control advice. USDA endorsement rules, timelines, fees and country requirements change — always confirm the current requirements with a USDA-accredited veterinarian and the official USDA APHIS pet-travel website before you travel. Last reviewed May 2026.
          </p>
        </main>
      </div>
    </>
  );
}
