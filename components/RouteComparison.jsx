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
    name: "Via Paris — Eurotunnel",
    sub: "CDG → Calais → LeShuttle",
    timeHeadline: "~5–6h total",
    timeLegs: [
      "Drive CDG→Calais ~3h",
      "Eurotunnel crossing 35 min",
      "Check-in & pet reception ~1–1.5h",
    ],
    driveCost: ["Vehicle crossing £115–£229", "Pet fee ~£24", "Car hire & fuel ~£110–£200"],
    driveTotal: "≈ £250–£450 total",
    taxiCost: ["Pet-taxi driving fare ~£400–£900", "+ vehicle crossing ticket £115–£229"],
    taxiTotal: "≈ £515–£1,130 total",
    sortCost: 250,
    sortTime: 5,
    isEurotunnel: true,
    hasPetTaxi: true,
    isFerrySea: false,
  },
  {
    id: "paris-ferry",
    name: "Via Paris — Calais–Dover ferry",
    sub: "CDG → Calais → DFDS / P&O / Irish Ferries",
    timeHeadline: "~5.5–6.5h total",
    timeLegs: [
      "Drive CDG→Calais ~3h",
      "Ferry crossing ~1.5h",
      "Check-in & pet reception ~1–1.5h",
      "Pet stays in the car for the crossing",
    ],
    driveCost: ["Vehicle crossing ~£110–£230", "Pet fee £15", "Car hire & fuel ~£110–£200"],
    driveTotal: "≈ £235–£445 total",
    taxiCost: ["Pet-taxi driving fare ~£400–£900", "+ vehicle crossing ticket ~£110–£230"],
    taxiTotal: "≈ £510–£1,130 total",
    sortCost: 235,
    sortTime: 5.5,
    isEurotunnel: false,
    hasPetTaxi: true,
    isFerrySea: true,
  },
  {
    id: "frankfurt-eurotunnel",
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
      "Vehicle crossing £115–£229",
      "Pet fee ~£24",
      "Car hire & fuel ~£140–£250",
      "Pet-friendly overnight ~£80–£150",
    ],
    driveTotal: "≈ £350–£600 total",
    taxiCost: ["Pet-taxi driving fare ~£600–£1,200", "+ vehicle crossing ticket £115–£229"],
    taxiTotal: "≈ £715–£1,430 total",
    sortCost: 350,
    sortTime: 7,
    isEurotunnel: true,
    hasPetTaxi: true,
    isFerrySea: false,
  },
  {
    id: "frankfurt-ferry",
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
      "Vehicle crossing ~£110–£230",
      "Pet fee £15",
      "Car hire & fuel ~£140–£250",
      "Pet-friendly overnight ~£80–£150",
    ],
    driveTotal: "≈ £345–£600 total",
    taxiCost: ["Pet-taxi driving fare ~£600–£1,200", "+ vehicle crossing ticket ~£110–£230"],
    taxiTotal: "≈ £710–£1,430 total",
    sortCost: 345,
    sortTime: 7.5,
    isEurotunnel: false,
    hasPetTaxi: true,
    isFerrySea: true,
  },
  {
    id: "amsterdam-ferry",
    name: "Via Amsterdam — ferry",
    sub: "DFDS overnight IJmuiden → Newcastle",
    timeHeadline: "~17h overnight",
    timeLegs: [
      "Schiphol→IJmuiden taxi ~40 min",
      "DFDS ferry ~16h (overnight, sleep onboard)",
      "Ferry check-in ~1h",
    ],
    driveCost: ["Ferry passage + pet-friendly cabin ~£150–£350", "Pet fee ~£30"],
    driveTotal: "≈ £180–£380 total",
    taxiCost: null,
    taxiTotal: "—",
    sortCost: 180,
    sortTime: 17,
    isEurotunnel: false,
    hasPetTaxi: false,
    isFerrySea: true,
  },
  {
    id: "amsterdam-overland",
    name: "Via Amsterdam — overland",
    sub: "AMS → Belgium/France → Eurotunnel",
    timeHeadline: "~7–8h total",
    timeLegs: [
      "Drive AMS→Calais ~3.5–4h via Belgium",
      "Eurotunnel 35 min (or ferry ~1.5h)",
      "Check-in & pet reception ~1–1.5h",
    ],
    driveCost: ["Vehicle crossing £115–£229", "Pet fee ~£24", "Car hire & fuel ~£130–£230"],
    driveTotal: "≈ £280–£480 total",
    taxiCost: ["Pet-taxi driving fare ~£500–£1,000", "+ vehicle crossing ticket £115–£229"],
    taxiTotal: "≈ £615–£1,230 total",
    sortCost: 280,
    sortTime: 7,
    isEurotunnel: true,
    hasPetTaxi: true,
    isFerrySea: false,
  },
  {
    id: "spain",
    name: "Via Spain",
    sub: "Brittany Ferries Bilbao/Santander → Portsmouth or Plymouth",
    timeHeadline: "~24–36h crossing",
    timeLegs: null,
    driveCost: [
      "Ferry passage + pet-friendly cabin (car & 2, peak) ~£250–£1,100",
      "Pet fee from ~£50",
    ],
    driveTotal: "≈ £300–£1,150 total",
    taxiCost: null,
    taxiTotal: "long-haul — get a quote",
    sortCost: 300,
    sortTime: 24,
    isEurotunnel: false,
    hasPetTaxi: false,
    isFerrySea: true,
  },
  {
    id: "qm2",
    name: "Cunard QM2",
    sub: "Ocean liner New York → Southampton — no flight at all",
    timeHeadline: "~7 nights at sea",
    timeLegs: null,
    driveCost: null,
    driveCostNote: "Crossing fare + kennel fee — premium, varies widely by cabin and season",
    driveTotal: "get a quote",
    taxiCost: null,
    taxiTotal: "n/a",
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

const FILTERS = [
  { id: "eurotunnel", label: "Eurotunnel only", test: (r) => r.isEurotunnel },
  { id: "petTaxi", label: "Pet taxi", test: (r) => r.hasPetTaxi },
  { id: "ferrySea", label: "Ferry / sea only", test: (r) => r.isFerrySea },
];

export default function RouteComparison() {
  const [sort, setSort] = useState("default");
  const [activeFilters, setActiveFilters] = useState([]);

  const toggleFilter = (id) =>
    setActiveFilters((prev) =>
      prev.includes(id) ? prev.filter((f) => f !== id) : [...prev, id]
    );

  let routes = ROUTES.filter((r) =>
    activeFilters.every((fid) => {
      const f = FILTERS.find((x) => x.id === fid);
      return f ? f.test(r) : true;
    })
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

  return (
    <div className="mb-3">
      {/* Controls */}
      <div className="mb-5 space-y-3">
        <div className="flex flex-wrap items-center gap-2">
          <span className="font-sans text-[11px] uppercase tracking-[0.12em] text-stone-500 font-semibold mr-1">
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
        <div className="flex flex-wrap items-center gap-2">
          <span className="font-sans text-[11px] uppercase tracking-[0.12em] text-stone-500 font-semibold mr-1">
            Filter
          </span>
          {FILTERS.map((f) => (
            <button
              key={f.id}
              type="button"
              onClick={() => toggleFilter(f.id)}
              aria-pressed={activeFilters.includes(f.id)}
              className={`${btnBase} ${
                activeFilters.includes(f.id) ? btnOn : btnOff
              }`}
            >
              {f.label}
            </button>
          ))}
          {activeFilters.length > 0 && (
            <button
              type="button"
              onClick={() => setActiveFilters([])}
              className="font-sans text-xs px-2 py-1.5 text-amber-700 underline decoration-amber-300 hover:decoration-amber-600 underline-offset-2"
            >
              Clear
            </button>
          )}
        </div>
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

                <div className="text-[11px] uppercase tracking-[0.12em] text-stone-500 font-semibold mb-1">
                  Cost — pet taxi
                </div>
                {r.taxiCost ? (
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
          <div className="hidden md:block overflow-x-auto -mx-6 px-6 lg:-mx-44 lg:px-0">
            <table className="w-full text-sm border-collapse">
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
                    <td className="py-3 pr-3">
                      <span className="font-medium text-stone-900">{r.name}</span>
                      <br />
                      <span className="text-xs text-stone-500">{r.sub}</span>
                    </td>
                    <td className="py-3 px-3 align-bottom">
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
                    <td className="py-3 px-3 align-bottom">
                      {r.driveCost &&
                        r.driveCost.map((c, i) => (
                          <span key={i} className="block text-xs text-stone-600">
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
                    </td>
                    <td className="py-3 pl-3 align-bottom">
                      {r.taxiCost ? (
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
