// Single source of truth for the travel-day guide content.
// Used by the homepage TravelDay section AND the standalone
// /travel-day-with-a-pet page. Edit once, updates both.

export const TRAVEL_DAY_GUIDE = {
  title: "Flying with a pet: what to expect at the airport",
  kicker: "A step-by-step walkthrough — from the morning at home to settling into your seat.",
  stages: [
    {
      id: "before-you-leave",
      kicker: "00 · Before you leave home",
      title: "The morning routine",
      summary: "What you do in the 3–4 hours before you go has more impact on the flight than anything that happens at the airport.",
      points: [
        {
          h: "Walk your dog properly — 2 to 3 hours before you leave",
          p: "Tire them out. A proper walk, not a quick block. A tired dog in a carrier is a sleeping dog in a carrier; a fresh dog in a carrier is an anxious dog. This is the single most useful thing you can do for the flight itself.",
        },
        {
          h: "Cats: litter tray right up until you leave",
          p: "The cat version of the long walk. Keep the litter tray accessible until the moment you put them in the carrier — they'll use it once more before you go. The flight is the first time in their life they can't reach a tray, so this last visit matters.",
        },
        {
          h: "Light meal about 4 hours before the flight",
          p: "Not on an empty stomach (anxious), not on a full one (stressed digestion in a confined space). A small meal four hours out is the sweet spot. Water freely until you leave — don't restrict it.",
        },
        {
          h: "Calming spray on the carrier — not the pet",
          p: "If your pet has flying anxiety, spray Adaptil (for dogs) or Feliway (for cats) on the carrier lining about 15 minutes before you head out. Spraying directly on the pet doesn't work and irritates them. Never sedate without explicit vet approval for air travel — most vets advise against it because sedatives behave differently at altitude.",
        },
        {
          h: "Final toilet trip just before you leave the house",
          p: "Dogs: long walk, full toilet, fresh water. Cats: one more pass at the litter tray. Now you're ready.",
        },
      ],
    },
    {
      id: "airport-choice",
      kicker: "01 · Why airport choice matters",
      title: "Not all airports are equal for pet travel",
      summary: "If you have a choice of departure airport, pick the pet-friendly one even if it's a longer drive. The day will be much smoother.",
      points: [
        {
          h: "Some airports have dedicated pet check-in counters",
          p: "Heathrow, JFK, Frankfurt, Amsterdam Schiphol, Paris CDG all have established processes for travellers with pets. Smaller airports may handle it as a one-off and the staff are less practised — expect longer waits and more confusion.",
        },
        {
          h: "Pet relief areas vary wildly",
          p: "Some airports have post-security pet relief rooms (a godsend on a long layover). Some only have areas pre-security, meaning if your dog needs to go after you've cleared, you're either taking them out of the carrier in a corner of the terminal or doing the whole security process again. Check the airport's website beforehand — search '[airport name] pet relief area'.",
        },
        {
          h: "On some routes, the specific Heathrow vs Gatwick choice matters",
          p: "For UK departure, Heathrow has cabin pets on more airlines (Air France, KLM, Lufthansa, Air Canada, Etihad). Gatwick blocks cabin pets on most airlines — it's effectively cargo-only for international pet travel. Manchester (MAN) is a useful alternative for the north of England — Air Transat takes cabin pets MAN→Canada, Etihad takes cabin MAN→Abu Dhabi. Glasgow (GLA) only handles Air Transat cabin to Canada. If you can fly out of Heathrow or Manchester, do; avoid Gatwick for cabin pets.",
        },
      ],
    },
    {
      id: "check-in",
      kicker: "02 · Check-in",
      title: "Arrive 2.5–3 hours early and head straight to pet check-in",
      summary: "Pet check-in is always in person, often at a separate desk, and it takes longer than regular check-in. Don't try to do it in the standard line.",
      points: [
        {
          h: "Find the pet check-in counter on arrival",
          p: "It's usually marked separately from regular check-in. If you can't find it, ask any airline staff member — they'll point you. Some airlines (Air France, KLM) have a dedicated 'travelling with a pet' desk near oversized baggage.",
        },
        {
          h: "Paperwork review",
          p: "The agent will check every document — health certificate, rabies certificate, microchip number, CDC Dog Import Form receipt (for US-bound), EU Animal Health Certificate (for travellers entering the EU from outside) or EU Pet Passport (only if you're an EU resident with one issued previously), import permit (for some destinations). Have all originals in a clear folder, in the order the destination country expects them. Photocopies in a separate folder as backup.",
        },
        {
          h: "The carrier turn-around test — and why size matters",
          p: "The agent may ask you to set the carrier on the floor and have your pet turn around inside it without touching the walls or ceiling. If the carrier is too small for your pet's size, you can't fly. This is THE moment to have a slightly larger carrier than you think you need — better to err on the side of more room within your airline's stated under-seat dimensions. Practise this at home so neither of you is fazed.",
        },
        {
          h: "Weighing",
          p: "Pet plus carrier gets weighed. If you're at or near the limit, this is the moment of truth. Pre-weigh at home to avoid surprises.",
        },
        {
          h: "Pet fee paid here — even if you think you've already paid",
          p: "Most airlines charge the pet fee at check-in, not at booking. The catch: when you call to add a pet to a booking, it can be easy to assume the pet fee went through with the rest of the booking when actually it didn't — the fee is collected separately at the airport. (This happened to me on a United flight to MIA: I thought I'd paid on the phone, but ended up paying at check-in.) Have a card ready regardless. If you're sure you paid in advance, keep the receipt or confirmation email handy and bring it up — sometimes they can find the record, sometimes they can't. Either way, save every receipt from the day so you can sort out any discrepancy with the airline afterwards.",
        },
      ],
    },
    {
      id: "security",
      kicker: "03 · Security",
      title: "Pet out of carrier, walk through with you",
      summary: "Security with a pet — TSA in the US, CATSA in Canada, the equivalent everywhere else — is the most stressful 90 seconds of the day for most pets. Here's exactly what happens.",
      points: [
        {
          h: "They take you to a separate screening area",
          p: "Most major airports take pet travellers to a side room or family-friendly lane for security. This is calmer than the main line. If they don't offer, you can ask — most are happy to.",
        },
        {
          h: "Pet comes OUT of the carrier",
          p: "The carrier goes through the X-ray empty. You carry or walk your pet (on a harness or leash — fit one at home in advance and practise) through the metal detector with you. Pets do not go through X-ray. Ever.",
        },
        {
          h: "Then they may inspect you and the carrier in a room",
          p: "Once you're through, a security officer often takes you and the carrier to a small room or screened area to swab-test the carrier for explosives residue (called ETD — explosive trace detection). Standard for pet travel. Takes 2–3 minutes. Stay calm — your pet reads your energy.",
        },
        {
          h: "If you're flying to the US via a Canadian airport, expect US Preclearance",
          p: "At Montreal (YUL), Toronto (YYZ), Vancouver (YVR) and other Canadian airports, US-bound passengers clear US Customs and Border Protection BEFORE boarding — this is called Preclearance. For pets, that's a paperwork check at a desk (CDC Dog Import Form, rabies, microchip). The full security screening still happens once with CATSA; you arrive in the US as a domestic passenger.",
        },
        {
          h: "Pet back in carrier as soon as you're clear",
          p: "Don't linger after security — get your pet settled back in the carrier promptly. The next leg of the airport day is calmer.",
        },
      ],
    },
    {
      id: "airside",
      kicker: "04 · Airside — between security and the gate",
      title: "Pet relief and the carrier-or-leash question",
      summary: "Rules vary by airport and country, but a few things are universal.",
      points: [
        {
          h: "Find the pet relief area — if it's after security",
          p: "Few major airports have post-security (airside) pet relief: Heathrow lists airside facilities at T2/T3/T4/T5 but its own guidance describes them as for assistance dogs, with pet access at staff discretion; JFK has an airside room in B Concourse (B31–B33); Munich has one airside in T1 Hall C1 West (non-Schengen); Helsinki has indoor airside zones in T2; Madrid Barajas has an indoor airside area. Many big hubs DON'T — Amsterdam Schiphol officially has no pet relief area at all, and Frankfurt explicitly states no designated pet relief in transit. Use the airport app or signage to find yours. If your airport doesn't have one, your pet has to wait until arrival — give them a full toilet break right before you go through security.",
        },
        {
          h: "Carrier vs leash rules in the terminal",
          p: "In most airports your pet must stay in the carrier the whole time once airside. Some allow you to take a small dog out on a harness in designated pet areas only. Larger airports tend to be stricter; smaller ones often look the other way. When in doubt, stay in the carrier — it's never wrong.",
        },
        {
          h: "If your pet is in the carrier and can handle a short walk, take it",
          p: "If airport rules allow you to take your dog out (on leash, in a designated area or just airside-quiet), do — even a 10-minute leg-stretch before boarding helps them settle on the plane. The longer they've been confined before the flight, the harder the flight itself will be.",
        },
      ],
    },
    {
      id: "gate",
      kicker: "05 · At the gate",
      title: "Tell them you have a pet — priority boarding usually follows",
      summary: "Most airlines will board you early if they know you're travelling with a pet. Just ask.",
      points: [
        {
          h: "Check in with the gate agent on arrival",
          p: "Walk up to the gate desk when they're set up, say 'I'm travelling with a pet in cabin.' They'll usually mark your boarding pass for priority boarding so you can settle the carrier under the seat before the cabin fills.",
        },
        {
          h: "One last pet relief stop if possible",
          p: "If there's a pet relief area near your gate (some terminals do), use it. The next time your pet can go to the toilet is after you land — that might be 8+ hours away.",
        },
        {
          h: "Don't open the carrier at the gate",
          p: "Even if your pet is whining, keep the carrier zipped. Opening it in a busy terminal is how pets escape. Soft voice, calm presence, occasional finger through the mesh for reassurance.",
        },
      ],
    },
    {
      id: "on-the-plane",
      kicker: "06 · On the plane",
      title: "Carrier under the seat in front of you. Always.",
      summary: "Settling your pet on board is mostly about staying calm yourself and resisting the urge to fuss.",
      points: [
        {
          h: "Carrier goes under the seat in front of you — never your own",
          p: "Push it all the way under so the carrier handle is at your feet. This is a regulation, not a suggestion. Don't let crew put it anywhere else (overhead, in your lap during takeoff).",
        },
        {
          h: "Don't book a bulkhead or exit row — pets aren't allowed there",
          p: "Bulkhead seats (the front row of a cabin or behind a divider) have no under-seat storage at all — your carrier has nowhere to go. Exit rows are off-limits to pet travellers on every airline because cabin pets can't be in a row with safety-critical egress duties. If you accidentally got assigned one when adding the pet to the booking, the gate agent will reseat you — but better to fix it before you fly.",
        },
        {
          h: "First 15 minutes are the hardest",
          p: "Taxi, takeoff and the engine roar are the loudest moments of the flight. Most pets settle within 20 minutes of cruising altitude. Talk quietly to them, slip a finger through the mesh, then leave them be — over-fussing keeps them alert.",
        },
        {
          h: "Don't open the carrier mid-flight",
          p: "Most airlines and many aviation authorities prohibit opening a pet carrier during flight. If your pet seems distressed, ask a flight attendant — don't unzip on your own.",
        },
        {
          h: "Window seat is usually better — with a small caveat",
          p: "Window seats give your pet more floor depth under the seat in front, and you're away from cart traffic in the aisle. The trade-off: on most narrow-body aircraft, the fuselage curves inward, so under-seat HEIGHT is slightly less at the window than the middle. If your carrier sits right at the published maximum, the middle seat is actually the most forgiving spot. For most cabin pets and standard 18×11×11 carriers, window still wins — but check seat maps on SeatGuru if your carrier is on the edge of the height limit.",
        },
      ],
    },
    {
      id: "arrival",
      kicker: "07 · Arrival",
      title: "Off the plane, through immigration, then a long-overdue walk",
      summary: "The destination process depends on the country — but the principles are the same everywhere.",
      points: [
        {
          h: "Stay in carrier through immigration",
          p: "Don't take your pet out at baggage claim or immigration. Most countries require the pet to stay in the carrier until you've cleared customs.",
        },
        {
          h: "Pet inspection at customs",
          p: "Many countries (US, UK if entering by ferry/tunnel, EU, UAE) have a customs officer review your paperwork on arrival. Have everything ready in one folder, in order. Usually quick if your prep was thorough.",
        },
        {
          h: "Pet relief area outside the terminal",
          p: "Most international terminals have a pet relief area near arrivals — find it as soon as you clear customs. Long walk, water, the toilet break they've been waiting for. Don't go straight to a taxi — your pet needs 15–20 minutes of decompression first.",
        },
        {
          h: "Soft landing at the destination",
          p: "Once you get where you're going, set the carrier somewhere quiet with the door open and let them come out on their own. Don't tip them out. Their first half-hour in a new place is a lot — let them sniff, drink, and find their feet at their own pace.",
        },
      ],
    },
  ],
};