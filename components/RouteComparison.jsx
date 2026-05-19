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
      "Eurotunnel vehicle ticket £115–£229",
      "Eurotunnel pet fee ~£24",
      "Car hire & fuel for the ~3h CDG→Calais drive ~£110–£170",
    ],
    driveTotal: "≈ £250–£420 total",
    taxiCost: [
      "Pet-taxi driving fare (CDG→Calais) ~£400–£900",
      "+ Eurotunnel vehicle ticket £115–£229",
    ],
    taxiTotal: "≈ £515–£1,130 total",
    sortCost: 250,
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
      "Calais–Dover ferry vehicle ticket ~£110–£230",
      "Ferry pet fee ~£15–£22",
      "Car hire & fuel for the ~3h CDG→Calais drive ~£110–£170",
    ],
    driveTotal: "≈ £235–£420 total",
    taxiCost: [
      "Pet-taxi driving fare (CDG→Calais) ~£400–£900",
      "+ Calais–Dover ferry vehicle ticket ~£110–£230",
    ],
    taxiTotal: "≈ £510–£1,130 total",
    sortCost: 235,
    sortTime: 5.5,
    isEurotunnel: false,
    hasPetTaxi: true,
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
      "Le Pet Express departs Calais Frethun 16:00",
      "Eurotunnel crossing + pet checks ~2–3h",
      "Arrives Ashford International ~18:30",
      "No car needed — a fixed departure time",
    ],
    driveCost: null,
    driveNA:
      "this is a scheduled shuttle, not a self-drive route — there is no car, fuel or Eurotunnel vehicle ticket to budget",
    driveTotal: null,
    taxiCost: [
      "Le Pet Express shuttle £195 — one person + one pet, Eurotunnel crossing and pet fare included",
      "Second pet +£85",
      "Paris → Calais Frethun train ~£30–£70 per person",
      "Excess luggage £75/bag pre-booked (£100 on the day) — one 23 kg bag is included",
    ],
    taxiTotal: "≈ £230–£300 total, one person + one pet",
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
      "Eurotunnel vehicle ticket £115–£229",
      "Eurotunnel pet fee ~£24",
      "Car hire & fuel for the ~5–6h FRA→Calais drive ~£200–£320",
      "Pet-friendly overnight ~£80–£150",
    ],
    driveTotal: "≈ £420–£720 total",
    taxiCost: [
      "Pet-taxi driving fare (FRA→Calais) ~£600–£1,200",
      "+ Eurotunnel vehicle ticket £115–£229",
    ],
    taxiTotal: "≈ £715–£1,430 total",
    sortCost: 420,
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
      "Calais–Dover ferry vehicle ticket ~£110–£230",
      "Ferry pet fee ~£15–£22",
      "Car hire & fuel for the ~5–6h FRA→Calais drive ~£200–£320",
      "Pet-friendly overnight ~£80–£150",
    ],
    driveTotal: "≈ £415–£720 total",
    taxiCost: [
      "Pet-taxi driving fare (FRA→Calais) ~£600–£1,200",
      "+ Calais–Dover ferry vehicle ticket ~£110–£230",
    ],
    taxiTotal: "≈ £710–£1,430 total",
    sortCost: 345,
    sortTime: 7.5,
    isEurotunnel: false,
    hasPetTaxi: true,
    isFerrySea: true,
  },
  {
    id: "amsterdam-ferry",
    origin: "Amsterdam",
    name: "Via Amsterdam — ferry",
    sub: "DFDS overnight IJmuiden → Newcastle",
    timeHeadline: "~17h overnight",
    timeLegs: [
      "Schiphol→IJmuiden taxi ~40 min",
      "DFDS ferry ~16h (overnight, sleep onboard)",
      "Ferry check-in ~1h",
    ],
    driveCost: [
      "DFDS ferry passage (foot passenger or with car)",
      "Pet-friendly cabin ~£150–£350 (priced per cabin)",
      "DFDS pet fee ~£30 per pet each way",
    ],
    driveTotal: "≈ £180–£380 total",
    taxiCost: null,
    taxiNA: "this route is an overnight ferry you board yourself — there is no door-to-door pet-taxi version of it",
    taxiTotal: null,
    sortCost: 180,
    sortTime: 17,
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
      "Eurotunnel vehicle ticket £115–£229 (or Calais–Dover ferry ~£110–£230)",
      "Crossing pet fee ~£24 Eurotunnel / ~£15–£22 ferry",
      "Car hire & fuel for the ~3.5–4h AMS→Calais drive ~£130–£210",
    ],
    driveTotal: "≈ £270–£460 total",
    taxiCost: [
      "Pet-taxi driving fare (AMS→Calais) ~£500–£1,000",
      "+ Eurotunnel vehicle ticket £115–£229",
    ],
    taxiTotal: "≈ £615–£1,230 total",
    sortCost: 270,
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
      "Ferry passage for a car plus two passengers ~£250–£1,100 (the high end is peak summer season)",
      "Pet-friendly cabin — mandatory on this long crossing, priced per cabin, included in the range above",
      "Brittany Ferries pet fee — flat £50 per pet each way",
    ],
    driveTotal: "≈ £300–£1,150 total",
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
];

const CROSSING_FILTERS = [
  { id: "eurotunnel", label: "Eurotunnel only", test: (r) => r.isEurotunnel },
  { id: "petTaxi", label: "Pet taxi", test: (r) => r.hasPetTaxi },
  { id: "ferrySea", label: "Ferry / sea only", test: (r) => r.isFerrySea },
];

const ALL_FILTERS = [...ORIGIN_FILTERS, ...CROSSING_FILTERS];

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
                  <div className="text-sm text-stone-500 italic mb-3">
                    Not applicable — {r.driveNA}
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
                    <div className="font-serif text-base text-stone-900 mb-3">
                      {r.driveTotal}
                    </div>
                  </>
                )}

                <div className="text-[11px] uppercase tracking-[0.12em] text-stone-500 font-semibold mb-1">
                  Cost — pet taxi
                </div>
                {r.taxiNA ? (
                  <div className="text-sm text-stone-500 italic">
                    Not applicable — {r.taxiNA}
                  </div>
                ) : r.taxiCost ? (
                  <>
                    <ul className="text-sm text-stone-700 mb-1 space-y-0.5">
                      {r.taxiCost.map((c, i) => (
                        <li key={i}>{c}</li>
                      ))}
                    </ul>
                    <div className="font-serif text-base text-stone-900">
                      {r.taxiTotal}
                    </div>
                    <div className="text-xs text-stone-500">
                      the crossing ticket is extra on top of the pet-taxi fare,
                      and its price changes daily — treat the total as a guide
                    </div>
                  </>
                ) : (
                  <div className="text-sm text-stone-500">{r.taxiTotal}</div>
                )}
              </div>
            ))}
          </div>

          {/* DESKTOP — table. Breaks out wider than the reading column on lg. */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full text-sm border-collapse table-fixed">
              <colgroup>
                <col style={{ width: "22%" }} />
                <col style={{ width: "26%" }} />
                <col style={{ width: "26%" }} />
                <col style={{ width: "26%" }} />
              </colgroup>
              <thead>
                <tr className="border-b-2 border-stone-300 align-bottom">
                  <th className="text-left font-sans text-[11px] uppercase tracking-[0.12em] text-stone-500 font-semibold py-2.5 pr-3">
                    Route
                  </th>
                  <th className="text-left font-sans text-[11px] uppercase tracking-[0.12em] text-stone-500 font-semibold py-2.5 px-3">
                    Journey time
                  </th>
                  <th className="text-left font-sans text-[11px] uppercase tracking-[0.12em] text-stone-500 font-semibold py-2.5 px-3">
                    Cost — self-drive
                  </th>
                  <th className="text-left font-sans text-[11px] uppercase tracking-[0.12em] text-stone-500 font-semibold py-2.5 pl-3">
                    Cost — pet taxi
                  </th>
                </tr>
              </thead>
              <tbody className="font-sans text-stone-700">
                {routes.map((r, idx) => (
                  <tr
                    key={r.id}
                    className={
                      idx < routes.length - 1 ? "border-b border-stone-200" : ""
                    }
                  >
                    <td className="py-3 pr-3 align-top">
                      <span className="font-medium text-stone-900">{r.name}</span>
                      <br />
                      <span className="text-xs text-stone-500">{r.sub}</span>
                    </td>
                    <td className="py-3 px-3 align-top">
                      <span className="font-medium text-stone-900">
                        {r.timeHeadline}
                      </span>
                      {r.timeLegs &&
                        r.timeLegs.map((leg, i) => (
                          <span
                            key={i}
                            className={`block text-xs text-stone-500${
                              i === 0 ? " mt-0.5" : ""
                            }`}
                          >
                            {leg}
                          </span>
                        ))}
                    </td>
                    <td className="py-3 px-3 align-top">
                      {r.driveNA ? (
                        <span className="text-xs text-stone-500 italic">
                          Not applicable — {r.driveNA}
                        </span>
                      ) : (
                        <>
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
                          <span className="block font-medium text-stone-900 mt-1">
                            {r.driveTotal}
                          </span>
                        </>
                      )}
                    </td>
                    <td className="py-3 pl-3 align-top">
                      {r.taxiNA ? (
                        <span className="text-xs text-stone-500 italic">
                          Not applicable — {r.taxiNA}
                        </span>
                      ) : r.taxiCost ? (
                        <>
                          {r.taxiCost.map((c, i) => (
                            <span
                              key={i}
                              className="block text-xs text-stone-600"
                            >
                              {c}
                            </span>
                          ))}
                          <span className="block font-medium text-stone-900 mt-1">
                            {r.taxiTotal}
                          </span>
                        </>
                      ) : (
                        <span className="text-stone-500">{r.taxiTotal}</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
}
