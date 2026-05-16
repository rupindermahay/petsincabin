import Head from "next/head";
import Link from "next/link";
import { useState, useMemo } from "react";
import { AIRLINES_COMPARE } from "../components/airlinesCompare";

const FILTERS = [
  { id: "all", label: "All airlines" },
  { id: "uk-out", label: "Cabin out of UK" },
  { id: "yes", label: "Cabin allowed" },
  { id: "conditional", label: "Cabin with conditions" },
  { id: "no", label: "Cargo only" },
  { id: "brachy", label: "Brachy-friendly" },
];

const SORTS = [
  { id: "name", label: "A → Z" },
  { id: "weight", label: "Highest weight limit" },
  { id: "feeAsc", label: "Cheapest fee" },
];

// Extract numeric weight (kg) from the weight string for sorting.
// Returns 0 if not parseable.
function parseWeightKg(s) {
  if (!s) return 0;
  // Match "10 kg" or "8 kg" or "20 lb" — convert lb to kg.
  const kgMatch = s.match(/(\d+(?:\.\d+)?)\s*kg/i);
  if (kgMatch) return parseFloat(kgMatch[1]);
  const lbMatch = s.match(/(\d+(?:\.\d+)?)\s*lb/i);
  if (lbMatch) return parseFloat(lbMatch[1]) * 0.453592;
  return 0;
}

// Extract approximate numeric USD-ish fee from the fee string, for "cheapest"
// sorting. Returns infinity for cargo-only entries so they sort to the end.
function parseFeeApprox(s) {
  if (!s || /cargo only/i.test(s)) return Infinity;
  // Take the lowest number in the string.
  const nums = s.match(/\d+/g);
  if (!nums) return Infinity;
  return Math.min(...nums.map(Number));
}

function statusBadge(status) {
  if (status === "yes") {
    return <span className="inline-flex items-center px-2 py-0.5 text-[10px] uppercase tracking-widest bg-emerald-100 text-emerald-800 border border-emerald-300">Cabin allowed</span>;
  }
  if (status === "conditional") {
    return <span className="inline-flex items-center px-2 py-0.5 text-[10px] uppercase tracking-widest bg-amber-100 text-amber-800 border border-amber-300">Conditional</span>;
  }
  return <span className="inline-flex items-center px-2 py-0.5 text-[10px] uppercase tracking-widest bg-stone-200 text-stone-700 border border-stone-400">Cargo only</span>;
}

export default function AirlinesCompared() {
  const [filter, setFilter] = useState("all");
  const [sort, setSort] = useState("name");

  const filtered = useMemo(() => {
    let list = [...AIRLINES_COMPARE];
    if (filter === "uk-out") list = list.filter((a) => a.ukOut);
    else if (filter === "yes" || filter === "conditional" || filter === "no") {
      list = list.filter((a) => a.cabinStatus === filter);
    } else if (filter === "brachy") {
      list = list.filter((a) => /allowed/i.test(a.brachy) && !/banned|cargo only/i.test(a.brachy));
    }
    if (sort === "name") list.sort((a, b) => a.name.localeCompare(b.name));
    else if (sort === "weight") list.sort((a, b) => parseWeightKg(b.weight) - parseWeightKg(a.weight));
    else if (sort === "feeAsc") list.sort((a, b) => parseFeeApprox(a.fee) - parseFeeApprox(b.fee));
    return list;
  }, [filter, sort]);

  return (
    <>
      <Head>
        <title>Cabin Pet Airline Comparison (2026): Carrier Sizes, Fees, Weight Limits | Pets in Cabin</title>
        <meta
          name="description"
          content="Side-by-side comparison of 30+ airlines that fly pets in the cabin. Carrier dimensions, weight limits, fees, brachycephalic policies, and which airlines fly cabin out of the UK. Last verified May 2026."
        />
        <link rel="canonical" href="https://petsincabin.com/airlines-compared" />
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
          className="border-b border-stone-300 px-6 md:px-12 py-4 sticky top-0 z-40"
          style={{ backgroundColor: "rgba(250, 246, 237, 0.98)", backdropFilter: "blur(8px)" }}
        >
          <div className="max-w-5xl mx-auto flex items-center justify-between">
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

        <main className="max-w-5xl mx-auto px-6 py-12 md:py-16">
          <div className="text-xs uppercase tracking-[0.25em] text-amber-700 mb-6">Comparison</div>

          <h1 className="font-serif text-4xl md:text-5xl leading-[1.05] text-stone-900 mb-6">
            Cabin pet airlines, <span className="italic text-stone-600">compared.</span>
          </h1>

          <p className="font-serif text-lg md:text-xl text-stone-700 leading-relaxed mb-8 max-w-2xl">
            Every airline handles cabin pets differently — carrier sizes vary by centimetres, weight limits by kilos, and fees by hundreds. We track {AIRLINES_COMPARE.length} airlines that pet owners actually use, including the small handful that fly cabin pets <strong>out of the UK</strong>.
          </p>

          <p className="font-serif italic text-stone-600 leading-relaxed mb-10 max-w-2xl">
            Sourced from each airline's official policy page. Last full review: May 2026. Click an airline name to open its official pet policy in a new tab — they change occasionally, so always confirm before booking.
          </p>

          {/* Filter chips */}
          <div className="mb-4">
            <div className="text-xs uppercase tracking-widest text-stone-500 mb-2">Filter</div>
            <div className="flex flex-wrap gap-2">
              {FILTERS.map((f) => {
                const active = filter === f.id;
                return (
                  <button
                    key={f.id}
                    onClick={() => setFilter(f.id)}
                    className={`px-3 py-1.5 text-xs uppercase tracking-widest border transition-colors ${
                      active
                        ? "bg-stone-900 text-stone-50 border-stone-900"
                        : "bg-white text-stone-700 border-stone-300 hover:border-amber-600 hover:text-amber-700"
                    }`}
                  >
                    {f.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Sort chips */}
          <div className="mb-8">
            <div className="text-xs uppercase tracking-widest text-stone-500 mb-2">Sort</div>
            <div className="flex flex-wrap gap-2">
              {SORTS.map((s) => {
                const active = sort === s.id;
                return (
                  <button
                    key={s.id}
                    onClick={() => setSort(s.id)}
                    className={`px-3 py-1.5 text-xs uppercase tracking-widest border transition-colors ${
                      active
                        ? "bg-amber-700 text-stone-50 border-amber-700"
                        : "bg-white text-stone-700 border-stone-300 hover:border-amber-600 hover:text-amber-700"
                    }`}
                  >
                    {s.label}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="text-xs uppercase tracking-widest text-stone-500 mb-6">
            Showing {filtered.length} {filtered.length === 1 ? "airline" : "airlines"}
          </div>

          {/* Cards */}
          <div className="space-y-4">
            {filtered.map((a) => (
              <article key={a.name} className="bg-white border border-stone-200 hover:border-amber-300 transition-colors p-5 md:p-6">
                {/* Top row: name + status + UK-out badge */}
                <div className="flex flex-wrap items-baseline gap-x-3 gap-y-2 mb-3">
                  <h2 className="font-serif text-2xl text-stone-900">
                    <a
                      href={a.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:text-amber-700 transition-colors underline decoration-stone-300 hover:decoration-amber-600 underline-offset-4"
                    >
                      {a.name}
                    </a>
                  </h2>
                  {statusBadge(a.cabinStatus)}
                  {a.ukOut && (
                    <span className="inline-flex items-center px-2 py-0.5 text-[10px] uppercase tracking-widest bg-stone-900 text-stone-50">
                      🇬🇧 Flies cabin out of UK
                    </span>
                  )}
                </div>

                {/* Grid of specs */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                  <div>
                    <div className="text-[10px] uppercase tracking-widest text-amber-700 mb-1">Carrier (max)</div>
                    <div className="font-serif text-stone-800 text-sm leading-snug">{a.carrier}</div>
                  </div>
                  <div>
                    <div className="text-[10px] uppercase tracking-widest text-amber-700 mb-1">Weight limit</div>
                    <div className="font-serif text-stone-800 text-sm leading-snug">{a.weight}</div>
                  </div>
                  <div>
                    <div className="text-[10px] uppercase tracking-widest text-amber-700 mb-1">Fee (each way)</div>
                    <div className="font-serif text-stone-800 text-sm leading-snug">{a.fee}</div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
                  <div>
                    <div className="text-[10px] uppercase tracking-widest text-amber-700 mb-1">International cabin</div>
                    <div className="font-serif text-stone-800 text-sm leading-snug">{a.intl}</div>
                  </div>
                  <div>
                    <div className="text-[10px] uppercase tracking-widest text-amber-700 mb-1">Snub-nosed (brachy)</div>
                    <div className="font-serif text-stone-800 text-sm leading-snug">{a.brachy}</div>
                  </div>
                </div>

                {/* Notes */}
                <div className="text-sm text-stone-600 italic font-serif leading-relaxed border-t border-stone-200 pt-3">
                  {a.notes}
                </div>

                {/* Verified */}
                <div className="text-[10px] uppercase tracking-widest text-stone-400 mt-3">
                  Verified {a.verified} · <a href={a.link} target="_blank" rel="noopener noreferrer" className="text-amber-700 underline decoration-amber-300 hover:text-amber-800 transition-colors">Official policy ↗</a>
                </div>
              </article>
            ))}
          </div>

          {filtered.length === 0 && (
            <div className="bg-white border border-stone-200 p-8 text-center">
              <p className="font-serif italic text-stone-500">
                No airlines match this filter. Try a wider one.
              </p>
            </div>
          )}

          {/* Bottom: how to use this + back to guide */}
          <div className="bg-amber-50/60 border border-amber-200 p-6 mt-16">
            <div className="text-xs uppercase tracking-widest text-amber-700 mb-3">How to use this page</div>
            <p className="font-serif text-stone-800 leading-relaxed mb-4">
              The most useful filters for cabin pet travellers are <strong>"Cabin out of UK"</strong> (the small handful of airlines that take pets in the cabin OUT of the UK — the UK bans cabin pets INTO the country, but several airlines fly them out), and <strong>"Brachy-friendly"</strong> (airlines that explicitly allow pugs, French bulldogs, Persian cats and other snub-nosed breeds in the cabin where most refuse them in cargo).
            </p>
            <p className="font-serif text-stone-800 leading-relaxed mb-4">
              Carrier dimensions can — and often DO — differ across airlines on the same journey. On a multi-airline route, buy a carrier that fits the strictest airline's spec, or bring two. Our <Link href="/" className="text-amber-700 underline decoration-amber-300 underline-offset-4 hover:text-amber-800 transition-colors">journey planner</Link> pulls each airline's specs into your tailored checklist when you select a route.
            </p>
            <Link href="/" className="inline-flex items-center gap-2 text-sm text-amber-700 underline decoration-amber-300 underline-offset-4 hover:text-amber-800 transition-colors">
              ← Back to the main pet travel guide
            </Link>
          </div>

          <p className="text-xs text-stone-500 leading-relaxed mt-10">
            Airline pet policies change without notice. Always confirm directly with the airline before booking. Specifications above are summaries — each airline's official policy page (linked) is the authoritative source. We update this comparison roughly every 6 months and after major policy changes.
          </p>
        </main>

        <footer className="border-t border-stone-300 py-10 px-6 md:px-12">
          <div className="max-w-5xl mx-auto text-center">
            <p className="font-serif italic text-stone-500 text-sm">
              Pets in Cabin · By Theo's Mum · <Link href="/privacy" className="underline decoration-stone-300 hover:text-amber-700 transition-colors">Privacy</Link>
            </p>
          </div>
        </footer>
      </div>
    </>
  );
}
