import React, { useState, useMemo } from "react";

/* ============================================================
   TapewormWindow — shared component
   ------------------------------------------------------------
   Calculates the tapeworm treatment window for dogs entering
   the UK, Ireland, Norway, Malta or Finland.

   Rule: vet-administered, vet-recorded praziquantel treatment
   between 24h and 120h before arrival in the destination.
   Cats are exempt.

   Used by BOTH the Journey Planner and the Checklist tool.
   Pure calc is separated from UI so it can be reasoned about
   and reused for the checklist auto-fill.
   ============================================================ */

/* ---- Timezone table -------------------------------------------------
   No heavy library. Each zone has a standard UTC offset (minutes) and
   a daylight-saving offset, plus which DST regime it follows. The
   regime drivers compute the exact changeover instants per year.
--------------------------------------------------------------------- */
const TZ = {
  // --- the 5 destination countries ---
  "UK": { label: "UK time",       std: 0,    dst: 60,   dstZone: "eu" },
  "IE": { label: "Ireland time",  std: 0,    dst: 60,   dstZone: "eu" },
  "NO": { label: "Norway time",   std: 60,   dst: 120,  dstZone: "eu" },
  "MT": { label: "Malta time",    std: 60,   dst: 120,  dstZone: "eu" },
  "FI": { label: "Finland time",  std: 120,  dst: 180,  dstZone: "eu" },
  // --- common origin / stopover countries ---
  "US-ET": { label: "US Eastern time",     std: -300, dst: -240, dstZone: "us" },
  "US-CT": { label: "US Central time",     std: -360, dst: -300, dstZone: "us" },
  "US-MT": { label: "US Mountain time",    std: -420, dst: -360, dstZone: "us" },
  "US-PT": { label: "US Pacific time",     std: -480, dst: -420, dstZone: "us" },
  "CA-ET": { label: "Canada Eastern time", std: -300, dst: -240, dstZone: "us" },
  "FR": { label: "France time",       std: 60,   dst: 120,  dstZone: "eu" },
  "ES": { label: "Spain time",        std: 60,   dst: 120,  dstZone: "eu" },
  "DE": { label: "Germany time",      std: 60,   dst: 120,  dstZone: "eu" },
  "NL": { label: "Netherlands time",  std: 60,   dst: 120,  dstZone: "eu" },
  "AE": { label: "UAE time",          std: 240,  dst: 240,  dstZone: "none" },
  "IN": { label: "India time",        std: 330,  dst: 330,  dstZone: "none" },
  "AU-E": { label: "Australia Eastern time", std: 600, dst: 660, dstZone: "au" },
};

/* ---- Precise DST changeover calculation -----------------------------
   nthSunday: the Nth Sunday (1-based; -1 = last) of a month, as a
   day-of-month integer.

   EU:  starts last Sunday March 01:00 UTC; ends last Sunday Oct 01:00 UTC
        (the EU switches at 01:00 UTC everywhere simultaneously).
   US:  starts 2nd Sunday March 02:00 local std; ends 1st Sunday Nov 02:00.
   AU:  starts 1st Sunday Oct 02:00 local std; ends 1st Sunday Apr 03:00.
--------------------------------------------------------------------- */
function nthSunday(year, monthIdx, n) {
  if (n === -1) {
    const last = new Date(Date.UTC(year, monthIdx + 1, 0));
    return last.getUTCDate() - last.getUTCDay();
  }
  const first = new Date(Date.UTC(year, monthIdx, 1));
  const offset = (7 - first.getUTCDay()) % 7;
  return 1 + offset + (n - 1) * 7;
}

// Is DST in effect for this UTC instant, for the given regime?
function isDST(utcDate, dstZone) {
  if (dstZone === "none") return false;
  const y = utcDate.getUTCFullYear();
  const t = utcDate.getTime();

  if (dstZone === "eu") {
    // EU transitions at 01:00 UTC
    const start = Date.UTC(y, 2, nthSunday(y, 2, -1), 1, 0, 0);
    const end   = Date.UTC(y, 9, nthSunday(y, 9, -1), 1, 0, 0);
    return t >= start && t < end;
  }
  if (dstZone === "us") {
    // US transitions at 02:00 local standard time. We reference the
    // changeover instant off Eastern standard (-300); all US zones change
    // on the same dates, and the only ambiguity is the 02:00–03:00 local
    // changeover hour itself, far from any realistic appointment edge.
    const stdOffMin = -300;
    const start = Date.UTC(y, 2, nthSunday(y, 2, 2), 2, 0, 0) - stdOffMin * 60000;
    const end   = Date.UTC(y, 10, nthSunday(y, 10, 1), 2, 0, 0) - stdOffMin * 60000;
    return t >= start && t < end;
  }
  if (dstZone === "au") {
    // Southern hemisphere: DST spans the new year.
    const stdOffMin = 600;
    const start = Date.UTC(y, 9, nthSunday(y, 9, 1), 2, 0, 0) - stdOffMin * 60000;
    const end   = Date.UTC(y, 3, nthSunday(y, 3, 1), 3, 0, 0) - stdOffMin * 60000;
    return t >= start || t < end;
  }
  return false;
}

function offsetFor(tzKey, utcDate) {
  const z = TZ[tzKey];
  if (!z) return 0;
  return isDST(utcDate, z.dstZone) ? z.dst : z.std;
}

/* ---- The calculation ------------------------------------------------
   arrivalLocal : "YYYY-MM-DDTHH:mm", in DESTINATION local time
   destTZ       : timezone key of the destination
   returns UTC instants for arrival, earliest and latest treatment.
--------------------------------------------------------------------- */
function calcWindow(arrivalLocal, destTZ) {
  if (!arrivalLocal) return null;
  const naive = new Date(arrivalLocal + ":00Z"); // parse wall-clock as UTC
  if (isNaN(naive.getTime())) return null;
  // Offset depends on the instant, which depends on the offset — one
  // refinement pass resolves it (matters only at a DST boundary).
  let destOff = offsetFor(destTZ, naive);
  let arrivalUTC = new Date(naive.getTime() - destOff * 60000);
  destOff = offsetFor(destTZ, arrivalUTC);
  arrivalUTC = new Date(naive.getTime() - destOff * 60000);

  const HOUR = 3600000;
  return {
    arrivalUTC,
    earliestUTC: new Date(arrivalUTC.getTime() - 120 * HOUR),
    latestUTC: new Date(arrivalUTC.getTime() - 24 * HOUR),
  };
}

// Format a UTC instant in a given timezone as "2 Jul 2026, 09:00"
function fmtInTZ(utcDate, tzKey) {
  const off = offsetFor(tzKey, utcDate);
  const shifted = new Date(utcDate.getTime() + off * 60000);
  const d = shifted.getUTCDate();
  const mon = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"][shifted.getUTCMonth()];
  const y = shifted.getUTCFullYear();
  const hh = String(shifted.getUTCHours()).padStart(2, "0");
  const mm = String(shifted.getUTCMinutes()).padStart(2, "0");
  return `${d} ${mon} ${y}, ${hh}:${mm}`;
}

/* ---- Country metadata ---------------------------------------------- */
const DEST_COUNTRIES = [
  { key: "UK", name: "United Kingdom" },
  { key: "IE", name: "Ireland" },
  { key: "NO", name: "Norway" },
  { key: "MT", name: "Malta" },
  { key: "FI", name: "Finland" },
];

// Origin / stopover options — the places a trip realistically starts or
// stops. Each maps to a timezone key so it can feed the vet-location list.
const TRIP_COUNTRIES = [
  { key: "US-ET", name: "United States — Eastern" },
  { key: "US-CT", name: "United States — Central" },
  { key: "US-MT", name: "United States — Mountain" },
  { key: "US-PT", name: "United States — Pacific" },
  { key: "CA-ET", name: "Canada — Eastern" },
  { key: "FR", name: "France" },
  { key: "ES", name: "Spain" },
  { key: "DE", name: "Germany" },
  { key: "NL", name: "Netherlands" },
  { key: "UK", name: "United Kingdom" },
  { key: "IE", name: "Ireland" },
  { key: "NO", name: "Norway" },
  { key: "MT", name: "Malta" },
  { key: "FI", name: "Finland" },
  { key: "AE", name: "United Arab Emirates" },
  { key: "IN", name: "India" },
  { key: "AU-E", name: "Australia — Eastern" },
];

function nameFor(key) {
  return (
    TRIP_COUNTRIES.find((c) => c.key === key)?.name ||
    DEST_COUNTRIES.find((c) => c.key === key)?.name ||
    key
  );
}

/* ============================================================
   The component
   props:
     destKey   — optional pre-set destination ("UK" etc).
                 If valid, the destination selector is hidden.
     onResult  — optional callback(resultObject|null) so the parent
                 (planner / checklist) can auto-fill the checklist.
   ============================================================ */
export default function TapewormWindow({ destKey = null, onResult = null }) {
  const presetDest = DEST_COUNTRIES.find((c) => c.key === destKey);

  const [open, setOpen] = useState(false);
  const [dest, setDest] = useState(presetDest ? presetDest.key : "UK");
  const [origin, setOrigin] = useState("US-ET");
  const [stopover, setStopover] = useState(""); // "" = no stopover
  const [arrival, setArrival] = useState("");
  const [treatLoc, setTreatLoc] = useState("US-ET");

  // The vet-location list = origin + stopover (if any) + destination,
  // de-duplicated. No unrelated countries.
  const vetOptions = useMemo(() => {
    const keys = [origin];
    if (stopover) keys.push(stopover);
    keys.push(dest);
    const seen = new Set();
    return keys
      .filter((k) => (seen.has(k) ? false : (seen.add(k), true)))
      .map((k) => ({ key: k, name: nameFor(k) }));
  }, [origin, stopover, dest]);

  // Keep treatLoc valid: if it's no longer in the list, snap to origin.
  React.useEffect(() => {
    if (!vetOptions.some((o) => o.key === treatLoc)) {
      setTreatLoc(vetOptions[0]?.key || origin);
    }
  }, [vetOptions, treatLoc, origin]);

  const result = useMemo(() => {
    const w = calcWindow(arrival, dest);
    if (!w) return null;
    return {
      earliestStr: fmtInTZ(w.earliestUTC, treatLoc),
      latestStr: fmtInTZ(w.latestUTC, treatLoc),
      cutoffStr: fmtInTZ(w.arrivalUTC, dest),
      treatLabel: TZ[treatLoc]?.label || treatLoc,
      destLabel: TZ[dest]?.label || dest,
      destName: nameFor(dest),
      treatName: nameFor(treatLoc),
    };
  }, [arrival, dest, treatLoc]);

  React.useEffect(() => {
    if (onResult) onResult(result);
  }, [result, onResult]);

  return (
    <div className="border border-amber-200 bg-amber-50/50 rounded-sm overflow-hidden">
      <button
        onClick={() => setOpen((o) => !o)}
        className="w-full flex items-center justify-between gap-3 px-5 py-4 text-left hover:bg-amber-50 transition-colors"
      >
        <div>
          <div className="font-serif text-stone-900 text-lg">
            Tapeworm treatment timing
          </div>
          <div className="text-sm text-stone-600">
            Dogs entering {presetDest ? presetDest.name : "the UK, Ireland, Norway, Malta or Finland"} need a vet-recorded treatment in a strict time window. Work out yours.
          </div>
        </div>
        <span className="text-amber-700 text-xl flex-shrink-0" aria-hidden="true">
          {open ? "−" : "+"}
        </span>
      </button>

      {open && (
        <div className="px-5 pb-5 pt-1 border-t border-amber-200 space-y-4">
          {/* Destination — only if not preset */}
          {!presetDest && (
            <label className="block">
              <span className="text-sm font-medium text-stone-700">Destination country</span>
              <select
                value={dest}
                onChange={(e) => setDest(e.target.value)}
                className="mt-1 w-full border border-stone-300 rounded-sm px-3 py-2 bg-white text-stone-900"
              >
                {DEST_COUNTRIES.map((c) => (
                  <option key={c.key} value={c.key}>{c.name}</option>
                ))}
              </select>
            </label>
          )}

          {/* Origin + stopover together at the top */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <label className="block">
              <span className="text-sm font-medium text-stone-700">Where does your trip start?</span>
              <select
                value={origin}
                onChange={(e) => setOrigin(e.target.value)}
                className="mt-1 w-full border border-stone-300 rounded-sm px-3 py-2 bg-white text-stone-900"
              >
                {TRIP_COUNTRIES.map((c) => (
                  <option key={c.key} value={c.key}>{c.name}</option>
                ))}
              </select>
            </label>
            <label className="block">
              <span className="text-sm font-medium text-stone-700">
                Stopover <span className="text-stone-400 font-normal">(optional)</span>
              </span>
              <select
                value={stopover}
                onChange={(e) => setStopover(e.target.value)}
                className="mt-1 w-full border border-stone-300 rounded-sm px-3 py-2 bg-white text-stone-900"
              >
                <option value="">No stopover</option>
                {TRIP_COUNTRIES.map((c) => (
                  <option key={c.key} value={c.key}>{c.name}</option>
                ))}
              </select>
            </label>
          </div>

          {/* Arrival date + time */}
          <label className="block">
            <span className="text-sm font-medium text-stone-700">
              Arrival date &amp; time in {nameFor(dest)}
            </span>
            <input
              type="datetime-local"
              value={arrival}
              onChange={(e) => setArrival(e.target.value)}
              className="mt-1 w-full border border-stone-300 rounded-sm px-3 py-2 bg-white text-stone-900"
            />
            <span className="text-xs text-stone-500 mt-1 block">
              The scheduled time you land — in {nameFor(dest)} local time.
            </span>
          </label>

          {/* Vet location — scoped to origin / stopover / destination */}
          <label className="block">
            <span className="text-sm font-medium text-stone-700">
              Where will the vet give the treatment?
            </span>
            <select
              value={treatLoc}
              onChange={(e) => setTreatLoc(e.target.value)}
              className="mt-1 w-full border border-stone-300 rounded-sm px-3 py-2 bg-white text-stone-900"
            >
              {vetOptions.map((c) => (
                <option key={c.key} value={c.key}>{c.name}</option>
              ))}
            </select>
            <span className="text-xs text-stone-500 mt-1 block">
              Only the places on your route — pick where the appointment actually happens.
            </span>
          </label>

          {/* Result */}
          {result ? (
            <div className="bg-white border border-stone-200 rounded-sm p-4 space-y-3">
              <div>
                <div className="text-xs uppercase tracking-wider text-amber-700 mb-1">
                  Treatment window
                </div>
                <p className="text-stone-900 leading-relaxed">
                  Get your vet to treat and record the tapeworm dose between{" "}
                  <strong>{result.earliestStr}</strong> and{" "}
                  <strong>{result.latestStr}</strong> — times shown in{" "}
                  <strong>{result.treatLabel}</strong>.
                </p>
              </div>
              <div className="border-t border-stone-100 pt-3">
                <div className="text-xs uppercase tracking-wider text-stone-500 mb-1">
                  Arrival cut-off
                </div>
                <p className="text-stone-700 text-sm leading-relaxed">
                  This window depends on landing in {result.destName} by{" "}
                  <strong>{result.cutoffStr} {result.destLabel}</strong>. If your flight
                  is delayed past that, the treatment may fall outside the 24-hour
                  minimum — recheck before you travel.
                </p>
              </div>
              {stopover && (
                <div className="border-t border-stone-100 pt-3">
                  <p className="text-stone-600 text-sm leading-relaxed">
                    Your stopover in {nameFor(stopover)} doesn't change this — the window
                    is measured against your arrival in {result.destName}, not when you
                    leave the stopover. If the treatment is done before the stopover,
                    make sure the stopover plus onward travel still lands you inside
                    the window.
                  </p>
                </div>
              )}
            </div>
          ) : (
            <p className="text-sm text-stone-500">
              Enter your arrival date and time above to see the treatment window.
            </p>
          )}

          {/* Disclaimer — always shown */}
          <p className="text-xs text-stone-500 leading-relaxed border-t border-amber-200 pt-3">
            This is a guide based on the standard 24–120 hour rule. Always confirm the
            exact window and recording requirements with your vet and the destination's
            official guidance — and book the vet appointment early, as availability is
            limited. Times are based on the scheduled arrival you entered; if your
            flight is delayed past the 120-hour mark, the treatment may no longer be
            valid. Applies to dogs only — cats are exempt.
          </p>
        </div>
      )}
    </div>
  );
}

export { calcWindow, fmtInTZ, isDST, nthSunday, TZ, DEST_COUNTRIES, TRIP_COUNTRIES };
