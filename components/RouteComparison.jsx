import { useState } from "react";

// ---------------------------------------------------------------------------
// Route data. Each route drives BOTH the mobile cards and the desktop table,
// so the two layouts can never drift apart. Sort/filter operate on this array.
//   sortCost / sortTime  — numeric keys used only for ordering (low end of range)
//   isEurotunnel         — true for LeShuttle crossings (filter: Eurotunnel only)
//   hasPetTaxi           — true where a door-to-door pet taxi is an option
//   isFerrySea           — true where the Channel/sea crossing is by ferry or ship
// ---------------------------------------------------------------------------
const ROUTES = [
  {
    id: "paris-eurotunnel",
    origin: "Paris",
    name: "Via Paris — Eurotunnel",
    sub: "CDG → Calais → LeShuttle",
    timeHeadline: "~5–6h total",
    timeLegs: [
      "Drive CDG→Calais ~3h",
      "Eurotunnel crossing 35 min",
      "Check-in & pet reception ~1–1.5h",
    ],
    driveCost: [
      "Crossing ticket · £115–£229 per vehicle",
      "Pet fee · £22 each way",
      "Car hire + fuel · £130–£200",
    ],
    driveTotal: "≈ £270–£450 one way",
    taxiCost: [
      "Driving fare · £650–£900",
      "Crossing ticket · £260–£300 (booked as return)",
      "Deposit · ~£260 on booking (crossing fee)",
    ],
    taxiTotal: "≈ £910–£1,200 total",
    sortCost: 270,
    sortTime: 5,
    isEurotunnel: true,
    hasPetTaxi: true,
    isFerrySea: false,
  },
  {
    id: "paris-ferry",
    origin: "Paris",
    name: "Via Paris — Calais–Dover ferry",
    sub: "CDG → Calais → DFDS / P&O / Irish Ferries",
    timeHeadline: "~5.5–6.5h total",
    timeLegs: [
      "Drive CDG→Calais ~3h",
      "Ferry crossing ~1.5h",
      "Check-in & pet reception ~1–1.5h",
      "Pet stays in the car for the crossing",
    ],
    driveCost: [
      "Ferry ticket · £110–£230 per vehicle",
      "Pet fee · £15–£22 each way",
      "Car hire + fuel · £130–£200",
    ],
    driveTotal: "≈ £255–£450 one way",
    taxiCost: null,
    taxiNA: "pet taxis don't use ferry crossings — Eurotunnel only. If you want a pet-taxi, see the Eurotunnel option for this origin.",
    taxiTotal: null,
    sortCost: 255,
    sortTime: 5.5,
    isEurotunnel: false,
    hasPetTaxi: false,
    isFerrySea: true,
  },
  {
    id: "paris-lepetexpress",
    origin: "Paris",
    name: "Via Paris — Le Pet Express shuttle",
    sub: "CDG → train to Calais Frethun → Le Pet Express minibus → Ashford",
    timeHeadline: "~5–7h total",
    timeLegs: [
      "Train CDG-area → Calais Frethun ~1.5–2.5h",
      "Le Pet Express departs Calais Frethun — 16:00 or 18:00",
      "Eurotunnel crossing + pet checks ~2–3h",
      "Arrives Ashford International ~18:30 (or later on the 18:00 run)",
      "No car needed — a scheduled service, twice daily each way",
    ],
    driveCost: null,
    driveNA:
      "this is a scheduled shuttle, not a self-drive route — there is no car, fuel or Eurotunnel vehicle ticket to budget",
    driveTotal: null,
    taxiCost: [
      "Shuttle fare · £195 (1 person + 1 pet, all-in)",
      "Second pet · +£85",
      "Train to Calais Frethun · £30–£70 per person",
      "Train Ashford → London · £25–£60 per person",
      "Excess luggage · £75/bag (£100 on the day)",
      "Same-day rebooking fee · £50/ticket if needed",
    ],
    taxiTotal: "≈ £230–£475 one way (1 person + 1 pet)",
    // This route's secondary cost is a scheduled shuttle, not a private pet
    // taxi — costType drives the column label. taxiCaption overrides the
    // default "crossing ticket is extra" note, since the £195 already
    // includes the Eurotunnel crossing.
    costType: "shuttle",
    taxiCaption:
      "the £195 shuttle fare is for one person plus one pet and already includes the Eurotunnel crossing. The train fare is per person; excess luggage is per bag. The ceiling assumes peak walk-up train fares both sides, day-of excess luggage and a same-day rebooking — most journeys land near the floor. The shuttle runs twice daily each way — Ashford departs 10:00 and 13:00; Calais Frethun departs 16:00 and 18:00.",
    sortCost: 230,
    sortTime: 5,
    isEurotunnel: true,
    hasPetTaxi: true,
    isFerrySea: false,
  },
  {
    id: "frankfurt-eurotunnel",
    origin: "Frankfurt",
    name: "Via Frankfurt — Eurotunnel",
    sub: "FRA → Calais → LeShuttle",
    timeHeadline: "~7–8h total",
    timeLegs: [
      "Drive FRA→Calais ~5–6h",
      "Eurotunnel crossing 35 min",
      "Check-in & pet reception ~1–1.5h",
      "Most split it with an overnight",
    ],
    driveCost: [
      "Crossing ticket · £115–£229 per vehicle",
      "Pet fee · £22 each way",
      "Car hire + fuel · £230–£370",
    ],
    driveTotal: "≈ £370–£620 one way",
    taxiCost: [
      "Driving fare · £600–£1,200",
      "Crossing ticket · £260–£300 (booked as return)",
      "Deposit · ~£260 on booking (crossing fee)",
    ],
    taxiTotal: "≈ £860–£1,500 total",
    sortCost: 370,
    sortTime: 7,
    isEurotunnel: true,
    hasPetTaxi: true,
    isFerrySea: false,
  },
  {
    id: "frankfurt-ferry",
    origin: "Frankfurt",
    name: "Via Frankfurt — Calais–Dover ferry",
    sub: "FRA → Calais → DFDS / P&O / Irish Ferries",
    timeHeadline: "~7.5–8.5h total",
    timeLegs: [
      "Drive FRA→Calais ~5–6h",
      "Ferry crossing ~1.5h",
      "Check-in & pet reception ~1–1.5h",
      "Pet stays in the car · most split it with an overnight",
    ],
    driveCost: [
      "Ferry ticket · £110–£230 per vehicle",
      "Pet fee · £15–£22 each way",
      "Car hire + fuel · £230–£370",
    ],
    driveTotal: "≈ £365–£620 one way",
    taxiCost: null,
    taxiNA: "pet taxis don't use ferry crossings — Eurotunnel only. If you want a pet-taxi, see the Eurotunnel option for this origin.",
    taxiTotal: null,
    sortCost: 365,
    sortTime: 7.5,
    isEurotunnel: false,
    hasPetTaxi: false,
    isFerrySea: true,
  },
  {
    id: "amsterdam-overland",
    origin: "Amsterdam",
    name: "Via Amsterdam — overland",
    sub: "AMS → Belgium/France → Eurotunnel",
    timeHeadline: "~7–8h total",
    timeLegs: [
      "Drive AMS→Calais ~3.5–4h via Belgium",
      "Eurotunnel 35 min (or ferry ~1.5h)",
      "Check-in & pet reception ~1–1.5h",
    ],
    driveCost: [
      "Crossing ticket · £110–£230 (tunnel or ferry)",
      "Pet fee · £15–£22 each way",
      "Car hire + fuel · £150–£240",
    ],
    driveTotal: "≈ £290–£490 one way",
    taxiCost: [
      "Driving fare · £500–£1,000",
      "Crossing ticket · £260–£300 (booked as return)",
      "Deposit · ~£260 on booking (crossing fee)",
    ],
    taxiTotal: "≈ £760–£1,300 total",
    sortCost: 290,
    sortTime: 7,
    isEurotunnel: true,
    hasPetTaxi: true,
    isFerrySea: false,
  },
  {
    id: "spain",
    origin: "Spain",
    name: "Via Spain",
    sub: "Brittany Ferries Bilbao/Santander → Portsmouth or Plymouth",
    timeHeadline: "~24–36h crossing",
    timeLegs: null,
    driveCost: [
      "Ferry (car + 2 pax, cabin) · £250–£1,100",
      "Pet fee · £50 each way (flat)",
    ],
    driveTotal: "≈ £300–£1,150 one way",
    taxiCost: null,
    taxiNA: "no pet-taxi operator runs this far south as a standard service — possible only as a bespoke long-haul quote",
    taxiTotal: null,
    sortCost: 300,
    sortTime: 24,
    isEurotunnel: false,
    hasPetTaxi: false,
    isFerrySea: true,
  },
  {
    id: "qm2",
    origin: "New York",
    name: "Cunard QM2",
    sub: "Ocean liner New York → Southampton — no flight at all. Fare is a premium cruise booking (kennel place + crossing), varies widely by cabin and season — get a quote from Cunard.",
    timeHeadline: "~7 nights at sea",
    timeLegs: null,
    driveCost: null,
    driveNA: "the QM2 is a transatlantic ocean liner — there is no drive and no Channel crossing to pay for",
    driveTotal: null,
    taxiCost: null,
    taxiNA: "a pet taxi is a European road service — it has no role on an ocean crossing",
    taxiTotal: null,
    sortCost: 9000, // premium / unknowable — always sorts last on "cheapest"
    sortTime: 168,
    isEurotunnel: false,
    hasPetTaxi: false,
    isFerrySea: true,
    // QM2 is the only row with no leg breakdown and no totals in any
    // cost column — every cell in cols 2/3/4 is a single short paragraph.
    // Centre them vertically on desktop so they don't hang from the top.
    centerCells: true,
  },
  {
    id: "dublin-ferry",
    origin: "Dublin",
    name: "Via Dublin — fly in, then the Holyhead ferry",
    sub: "Cabin flight into Dublin (Iberia from Madrid or KLM from Amsterdam) → Dublin–Holyhead ferry → Britain",
    timeHeadline: "~5–7h total",
    timeLegs: [
      "Cabin flight into Dublin",
      "Dublin port transfer + ferry check-in ~1.5–2h",
      "Dublin → Holyhead ferry ~3h 15m (Irish Ferries / Stena Line)",
      "Arrive Holyhead in Wales — continue overland by road or rail",
    ],
    driveCost: null,
    driveNA:
      "this route is a flight plus a scheduled ferry — there is no self-drive leg, so no car, fuel or Eurotunnel ticket to budget",
    driveTotal: null,
    taxiCost: [
      "Foot passenger ticket · £31–£60 per person",
      "Pet · £17–£35 (ship's kennel or Pet Den)",
    ],
    taxiTotal: "≈ £50–£95 one way (1 person + 1 pet)",
    costType: "ferry",
    taxiCaption:
      "the figure is one person and one pet, one way. Pets under about 10 kg can travel in a carrier with you; larger dogs go in the ship's kennel.",
    sortCost: 75,
    sortTime: 6,
    isEurotunnel: false,
    hasPetTaxi: true,
    isFerrySea: true,
  },
  {
    id: "newcastle-ferry",
    origin: "Amsterdam",
    name: "Via Newcastle — the DFDS overnight ferry",
    sub: "Cabin flight into Amsterdam → DFDS overnight ferry to Newcastle → northern England / Scotland",
    timeHeadline: "~17h overnight total",
    timeLegs: [
      "Cabin flight into Amsterdam",
      "Transfer to IJmuiden ferry terminal + check-in",
      "DFDS overnight ferry IJmuiden → Newcastle ~16h 45m",
      "Arrive North Shields, Newcastle — continue overland",
    ],
    driveCost: [
      "Ferry (with car) · included in cabin price",
      "Pet-friendly cabin · £150–£350 (4-berth)",
      "Pet fee · £30 each way",
    ],
    driveTotal: "≈ £200–£420 one way (with car)",
    taxiCost: [
      "Foot passenger fare · included in cabin price",
      "Pet-friendly cabin · £150–£210 (up to 2 dogs)",
      "Pet fee · £30 each way",
    ],
    taxiTotal: "≈ £180–£240 one way (1 person + 1 pet)",
    costType: "ferry",
    taxiCaption:
      "the self-drive column is the same ferry taken with a car; this column is for foot passengers. Foot passengers travelling with a pet cannot book online — you must phone the DFDS contact centre. Dogs cannot be left in a vehicle: book a pet-friendly cabin or a kennel place, and bring your own bedding.",
    sortCost: 200,
    sortTime: 18,
    isEurotunnel: false,
    hasPetTaxi: true,
    isFerrySea: true,
  },
  {
    id: "newhaven-dieppe",
    origin: "Paris",
    name: "Via Dieppe — DFDS pet-friendly cabin (foot-passenger option)",
    sub: "Paris → Dieppe by train → DFDS ferry Dieppe → Newhaven → London by train",
    timeHeadline: "~7–9h total (with the day crossing)",
    timeLegs: [
      "Paris → Rouen → Dieppe by train ~2.5–3h (dogs allowed on French trains)",
      "Check-in at Dieppe Maritime Terminal (closes 45 min before sailing)",
      "Ferry crossing ~4h (day) or overnight (evening sailings available)",
      "Arrive Newhaven Marine Terminal",
      "Train Newhaven → Lewes → London Victoria ~1h 40m (dogs allowed on UK trains)",
    ],
    driveCost: [
      "Ferry (with car) · £100–£200 one way",
      "Pet fee · £20 each way (per pet, kennel or pet cabin)",
      "Car hire + fuel from Paris · £140–£220",
    ],
    driveTotal: "≈ £260–£440 one way (with car)",
    taxiCost: [
      "Foot passenger fare · £40–£90 one way",
      "Pet-friendly cabin · £80–£140 (4-berth, 2-bunk, sea view)",
      "Pet fee · £20 each way",
      "Paris→Dieppe train · €25–€50 per person",
      "Newhaven→London train · £15–£30 per person",
    ],
    taxiTotal: "≈ £180–£290 one way (1 person + 1 pet, no car)",
    costType: "ferry",
    taxiCaption:
      "the only English Channel ferry that accepts foot passengers with pets. Pet-friendly cabins added since late 2025 — three onboard. You CANNOT book pets online as a foot passenger; phone DFDS on +44 33 058 787 87 to add the pet to your booking. Three pet-friendly cabins only, so book early in peak season. Dogs in the dedicated kennel area must stay on a lead in transit; bedding not provided — bring your own. Cats and other pets must use a pet-friendly cabin, not the kennels.",
    sortCost: 180,
    sortTime: 8,
    isEurotunnel: false,
    hasPetTaxi: true,
    isFerrySea: true,
  },
];

const SORTS = [
  { id: "default", label: "Default order" },
  { id: "cheapest", label: "Cheapest first" },
  { id: "fastest", label: "Fastest first" },
];

// Filters come in two groups. Origin first — it's the thing a traveller knows
// before anything else ("I'm flying into Paris") — then the crossing type.
const ORIGIN_FILTERS = [
  { id: "o-paris", label: "Paris", test: (r) => r.origin === "Paris" },
  { id: "o-frankfurt", label: "Frankfurt", test: (r) => r.origin === "Frankfurt" },
  { id: "o-amsterdam", label: "Amsterdam", test: (r) => r.origin === "Amsterdam" },
  { id: "o-spain", label: "Spain", test: (r) => r.origin === "Spain" },
  { id: "o-ny", label: "New York", test: (r) => r.origin === "New York" },
  { id: "o-dublin", label: "Dublin", test: (r) => r.origin === "Dublin" },
];

const CROSSING_FILTERS = [
  { id: "eurotunnel", label: "Eurotunnel only", test: (r) => r.isEurotunnel },
  { id: "petTaxi", label: "Pet taxi / shuttle", test: (r) => r.hasPetTaxi },
  { id: "ferrySea", label: "Ferry / sea only", test: (r) => r.isFerrySea },
];

const ALL_FILTERS = [...ORIGIN_FILTERS, ...CROSSING_FILTERS];

// The second cost column adapts to what the route's secondary cost actually
// is: a private pet taxi, a scheduled shuttle, or a flight-plus-ferry. Using
// the wrong word (e.g. "pet taxi" on a flight+ferry route) is misleading.
function costLabel(costType) {
  if (costType === "shuttle") return "shuttle";
  if (costType === "ferry") return "ferry";
  return "pet taxi";
}

export default function RouteComparison() {
  const [sort, setSort] = useState("default");
  const [activeFilters, setActiveFilters] = useState([]);

  const toggleFilter = (id) =>
    setActiveFilters((prev) =>
      prev.includes(id) ? prev.filter((f) => f !== id) : [...prev, id]
    );

  // Single-select toggle for a group: picking a filter clears any other
  // selection from the SAME group, so only one can be active at a time.
  // Tapping the active one again clears it.
  const selectSingle = (id, group) =>
    setActiveFilters((prev) => {
      const groupIds = group.map((f) => f.id);
      const withoutGroup = prev.filter((f) => !groupIds.includes(f));
      return prev.includes(id) ? withoutGroup : [...withoutGroup, id];
    });

  // Group-aware filtering. Within a group (e.g. origins) selections are OR —
  // "Paris or Frankfurt". Across groups they're AND — "(Paris or Frankfurt)
  // AND ferry". A group with nothing selected imposes no constraint.
  const matchesGroup = (route, group) => {
    const picked = group.filter((f) => activeFilters.includes(f.id));
    return picked.length === 0 || picked.some((f) => f.test(route));
  };

  let routes = ROUTES.filter(
    (r) => matchesGroup(r, ORIGIN_FILTERS) && matchesGroup(r, CROSSING_FILTERS)
  );

  if (sort === "cheapest") {
    routes = [...routes].sort((a, b) => a.sortCost - b.sortCost);
  } else if (sort === "fastest") {
    routes = [...routes].sort((a, b) => a.sortTime - b.sortTime);
  }

  const btnBase =
    "font-sans text-xs px-3 py-1.5 rounded-sm border transition-colors";
  const btnOn = "bg-stone-900 text-white border-stone-900";
  const btnOff =
    "bg-white text-stone-600 border-stone-300 hover:border-stone-500";

  // `single` groups (departure point) allow only one active filter at a time.
  const FilterRow = ({ label, group, single }) => (
    <div className="flex flex-wrap items-center gap-2">
      <span className="font-sans text-[11px] uppercase tracking-[0.12em] text-stone-500 font-semibold mr-1 w-full sm:w-auto">
        {label}
      </span>
      {group.map((f) => (
        <button
          key={f.id}
          type="button"
          onClick={() =>
            single ? selectSingle(f.id, group) : toggleFilter(f.id)
          }
          aria-pressed={activeFilters.includes(f.id)}
          className={`${btnBase} ${
            activeFilters.includes(f.id) ? btnOn : btnOff
          }`}
        >
          {f.label}
        </button>
      ))}
    </div>
  );

  return (
    <div className="mb-3">
      {/* Controls — sort, then filter by origin, then by crossing type.
          Origin comes first because it's what a traveller knows up front. */}
      <div className="mb-5 space-y-3">
        <div className="flex flex-wrap items-center gap-2">
          <span className="font-sans text-[11px] uppercase tracking-[0.12em] text-stone-500 font-semibold mr-1 w-full sm:w-auto">
            Sort
          </span>
          {SORTS.map((s) => (
            <button
              key={s.id}
              type="button"
              onClick={() => setSort(s.id)}
              aria-pressed={sort === s.id}
              className={`${btnBase} ${sort === s.id ? btnOn : btnOff}`}
            >
              {s.label}
            </button>
          ))}
        </div>
        <FilterRow label="Filter by departure point" group={ORIGIN_FILTERS} single />
        <FilterRow label="Filter by crossing" group={CROSSING_FILTERS} />
        {activeFilters.length > 0 && (
          <button
            type="button"
            onClick={() => setActiveFilters([])}
            className="font-sans text-xs px-2 py-1 text-amber-700 underline decoration-amber-300 hover:decoration-amber-600 underline-offset-2"
          >
            Clear all filters
          </button>
        )}
      </div>

      {routes.length === 0 ? (
        <p className="font-serif italic text-stone-600 mb-3">
          No routes match those filters together — try removing one.
        </p>
      ) : (
        <>
          {/* MOBILE — stacked cards. A 4-column comparison table can't be read
              on a phone, so below md each route is a full-width card. */}
          <div className="md:hidden space-y-4">
            {routes.map((r) => (
              <div
                key={r.id}
                className="bg-white border border-stone-200 rounded-sm p-4"
              >
                <div className="font-serif text-lg text-stone-900">{r.name}</div>
                <div className="text-xs text-stone-500 mb-3">{r.sub}</div>

                <div className="text-[11px] uppercase tracking-[0.12em] text-stone-500 font-semibold mb-1">
                  Journey time — {r.timeHeadline}
                </div>
                {r.timeLegs && (
                  <ul className="text-sm text-stone-700 mb-3 space-y-0.5">
                    {r.timeLegs.map((leg, i) => (
                      <li key={i}>{leg}</li>
                    ))}
                  </ul>
                )}
                {!r.timeLegs && <div className="mb-3" />}

                <div className="text-[11px] uppercase tracking-[0.12em] text-stone-500 font-semibold mb-1">
                  Cost — self-drive
                </div>
                {r.driveNA ? (
                  <div className="mb-3">
                    <div className="text-[11px] uppercase tracking-[0.12em] text-stone-400 font-semibold mb-1">
                      Not applicable
                    </div>
                    <div className="text-sm text-stone-500 italic">
                      {r.driveNA}
                    </div>
                  </div>
                ) : (
                  <>
                    {r.driveCost && (
                      <ul className="text-sm text-stone-700 mb-1 space-y-0.5">
                        {r.driveCost.map((c, i) => (
                          <li key={i}>{c}</li>
                        ))}
                      </ul>
                    )}
                    {r.driveCostNote && (
                      <div className="text-sm text-stone-700 mb-1">
                        {r.driveCostNote}
                      </div>
                    )}
                    <div className="flex items-baseline gap-2 mb-3">
                      <span className="text-[11px] uppercase tracking-[0.12em] text-stone-500 font-semibold">
                        Total
                      </span>
                      <span className="font-serif text-base text-stone-900 font-semibold">
                        {r.driveTotal}
                      </span>
                    </div>
                  </>
                )}

                <div className="text-[11px] uppercase tracking-[0.12em] text-stone-500 font-semibold mb-1">
                  Cost — {costLabel(r.costType)}
                </div>
                {r.taxiNA ? (
                  <div>
                    <div className="text-[11px] uppercase tracking-[0.12em] text-stone-400 font-semibold mb-1">
                      Not applicable
                    </div>
                    <div className="text-sm text-stone-500 italic">
                      {r.taxiNA}
                    </div>
                  </div>
                ) : r.taxiCost ? (
                  <>
                    <ul className="text-sm text-stone-700 mb-1 space-y-0.5">
                      {r.taxiCost.map((c, i) => (
                        <li key={i}>{c}</li>
                      ))}
                    </ul>
                    <div className="flex items-baseline gap-2">
                      <span className="text-[11px] uppercase tracking-[0.12em] text-stone-500 font-semibold">
                        Total
                      </span>
                      <span className="font-serif text-base text-stone-900 font-semibold">
                        {r.taxiTotal}
                      </span>
                    </div>
                    <div className="text-xs text-stone-500">
                      {r.taxiCaption ||
                        "the crossing ticket is extra on top of the pet-taxi fare, and its price changes daily — treat the total as a guide"}
                    </div>
                  </>
                ) : (
                  <div className="text-sm text-stone-500">{r.taxiTotal}</div>
                )}
              </div>
            ))}
          </div>

          {/* DESKTOP — CSS grid rows (NOT a <table>) so every cell in a row
              is the same height, which lets the totals anchor to the bottom
              and align across the row. Sits inside the page's max-w-6xl
              reading column. */}
          <div className="hidden md:block text-sm">
            {/* Header row */}
            <div className="grid grid-cols-[22%_26%_26%_26%] border-b-2 border-stone-300">
              <div className="text-left font-sans text-[11px] uppercase tracking-[0.12em] text-stone-500 font-semibold py-2.5 pr-3">
                Route
              </div>
              <div className="text-left font-sans text-[11px] uppercase tracking-[0.12em] text-stone-500 font-semibold py-2.5 px-3">
                Journey time
              </div>
              <div className="text-left font-sans text-[11px] uppercase tracking-[0.12em] text-stone-500 font-semibold py-2.5 px-3">
                Self-drive cost
              </div>
              <div className="text-left font-sans text-[11px] uppercase tracking-[0.12em] text-stone-500 font-semibold py-2.5 pl-3">
                Pet taxi / shuttle / ferry cost
              </div>
            </div>

            {/* Body rows */}
            <div className="font-sans text-stone-700">
              {routes.map((r, idx) => (
                <div
                  key={r.id}
                  className={`grid grid-cols-[22%_26%_26%_26%] ${
                    idx < routes.length - 1 ? "border-b border-stone-200" : ""
                  }`}
                >
                  {/* Route */}
                  <div className="py-3 pr-3">
                    <span className="font-medium text-stone-900 break-words">{r.name}</span>
                    <br />
                    <span className="text-xs text-stone-500 break-words">{r.sub}</span>
                  </div>

                  {/* Journey time — label / body / total */}
                  <div className="py-3 px-3 flex flex-col">
                    <span className="block text-[10px] uppercase tracking-[0.1em] text-stone-400 font-semibold mb-1">
                      Breakdown
                    </span>
                    <div className={r.centerCells ? "flex-grow flex items-center" : "flex-grow"}>
                      <div>
                        {r.timeLegs &&
                          r.timeLegs.map((leg, i) => (
                            <span
                              key={i}
                              className="block text-xs text-stone-500"
                            >
                              {leg}
                            </span>
                          ))}
                        {r.centerCells && (
                          <span className="block font-semibold text-stone-900">
                            {r.timeHeadline}
                          </span>
                        )}
                      </div>
                    </div>
                    {!r.centerCells && (
                      <span className="block font-semibold text-stone-900 mt-2">
                        {r.timeHeadline}
                      </span>
                    )}
                  </div>

                  {/* Self-drive cost — label / body / total */}
                  <div className="py-3 px-3 flex flex-col">
                    {r.driveNA ? (
                      <>
                        <span className="block text-[10px] uppercase tracking-[0.1em] text-stone-400 font-semibold mb-1">
                          Not applicable
                        </span>
                        <div className={r.centerCells ? "flex-grow flex items-center" : "flex-grow"}>
                          <span className="text-xs text-stone-500 italic">
                            {r.driveNA}
                          </span>
                        </div>
                      </>
                    ) : (
                      <>
                        <span className="block text-[10px] uppercase tracking-[0.1em] text-stone-400 font-semibold mb-1">
                          Self-drive
                        </span>
                        <div className={r.centerCells ? "flex-grow flex items-center" : "flex-grow"}>
                          {r.driveCost &&
                            r.driveCost.map((c, i) => (
                              <span
                                key={i}
                                className="block text-xs text-stone-600"
                              >
                                {c}
                              </span>
                            ))}
                          {r.driveCostNote && (
                            <span className="text-xs text-stone-600">
                              {r.driveCostNote}
                            </span>
                          )}
                        </div>
                        <span className="block font-semibold text-stone-900 mt-2">
                          {r.driveTotal}
                        </span>
                      </>
                    )}
                  </div>

                  {/* Pet taxi / shuttle / ferry cost — label / body / total */}
                  <div className="py-3 pl-3 flex flex-col">
                    {r.taxiNA ? (
                      <>
                        <span className="block text-[10px] uppercase tracking-[0.1em] text-stone-400 font-semibold mb-1">
                          Not applicable
                        </span>
                        <div className={r.centerCells ? "flex-grow flex items-center" : "flex-grow"}>
                          <span className="text-xs text-stone-500 italic">
                            {r.taxiNA}
                          </span>
                        </div>
                      </>
                    ) : r.taxiCost ? (
                      <>
                        <span className="block text-[10px] uppercase tracking-[0.1em] text-stone-400 font-semibold mb-1">
                          {costLabel(r.costType).replace(/^./, (c) => c.toUpperCase())}
                        </span>
                        <div className={r.centerCells ? "flex-grow flex items-center" : "flex-grow"}>
                          {r.taxiCost.map((c, i) => (
                            <span
                              key={i}
                              className="block text-xs text-stone-600"
                            >
                              {c}
                            </span>
                          ))}
                        </div>
                        <span className="block font-semibold text-stone-900 mt-2">
                          {r.taxiTotal}
                        </span>
                      </>
                    ) : (
                      <span className="text-stone-500">{r.taxiTotal}</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Tapeworm timing note — these routes end in Britain or Ireland,
              where the tapeworm rule is window-specific. Framed calmly: a
              well-planned trip fits the window; the European vet is a
              backup, not the expected step. */}
          <div className="mt-5 bg-amber-50 border border-amber-200 rounded-sm p-4">
            <div className="font-sans text-[11px] uppercase tracking-[0.12em] text-amber-700 font-semibold mb-1">
              One timing rule worth planning around
            </div>
            <p className="text-sm text-stone-700 leading-relaxed">
              Every route here ends in Britain or Ireland, where a dog needs a
              tapeworm treatment recorded by a vet <strong>24–120 hours before
              arrival</strong>. That window is a comfortable two days wide, so
              for most trips it is easily met — have the treatment done shortly
              before you travel and you will usually be well inside it. If your
              schedule shifts and the timing slips, the simple fix is a quick
              top-up treatment from a vet in Europe before the crossing. Cats
              are exempt. The{" "}
              <a
                href="/?go=planner"
                className="text-amber-700 underline decoration-amber-300 hover:decoration-amber-600 underline-offset-2"
              >
                tapeworm timing calculator in the journey planner
              </a>{" "}
              works out your exact window once you've picked your route.
            </p>
          </div>
        </>
      )}
    </div>
  );
}
