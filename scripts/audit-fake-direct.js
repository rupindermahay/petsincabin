#!/usr/bin/env node
/**
 * audit-fake-direct.js
 * ====================
 * Finds FALLBACK_STRATEGIES leg objects whose airline field admits multi-leg
 * routing — i.e. cards that claim to be a 1-FLIGHT JOURNEY but whose airline
 * text says "via X" or "cargo only" or "✗ no direct".
 *
 * This is the class of bug fixed in DECISIONS_LOG.md #13 (Fake-direct route
 * fixes). Re-run this script after any FALLBACK_STRATEGIES edit.
 *
 * USAGE:
 *   node scripts/audit-fake-direct.js
 *   node scripts/audit-fake-direct.js path/to/PetTravel.jsx   # alternate path
 *
 * WHAT IT FINDS:
 *   Legs in FALLBACK_STRATEGIES whose airline string contains any of:
 *     - "\bvia\b"        (admits via routing)
 *     - "cargo-only"     (admits cargo only)
 *     - "no direct"      (admits no direct)
 *     - "✗"              (flagged with ✗)
 *     - "position to"    (admits position-to-hub)
 *
 * INTENTIONAL FALSE POSITIVES (do NOT "fix" these):
 *   - south-africa / south-africa-out: legs are explicitly cargo-only, honest framing
 *   - south-america → US gateway: leg 1 of an explicit 2-leg journey
 *   - hawaii / hawaii-out: already correctly structured as 3-leg ending at HNL
 *   - korea handler else: contains "Korean Air via Seoul is the cabin workaround"
 *     in the airline string as honest context — leg structure is a real 2-leg
 *
 * CRITICAL: This script handles BOTH backtick-quoted AND double-quoted leg
 * strings (one of the lessons learnt in WORKING_WITH_RUPINDER.md). Don't
 * strip that — half the suspicious legs are invisible to a single-quoting
 * regex.
 */

const fs = require("fs");
const path = require("path");

const DEFAULT_PATH = "components/PetTravel.jsx";

function main(filePath) {
  const resolved = path.resolve(filePath);
  if (!fs.existsSync(resolved)) {
    console.error(`ERROR: ${resolved} not found.`);
    console.error(`Usage: node scripts/audit-fake-direct.js [path/to/PetTravel.jsx]`);
    process.exit(1);
  }

  const src = fs.readFileSync(resolved, "utf8");

  // Find the FALLBACK_STRATEGIES block
  const startIdx = src.indexOf("const FALLBACK_STRATEGIES");
  if (startIdx === -1) {
    console.error("ERROR: 'const FALLBACK_STRATEGIES' not found in source.");
    process.exit(1);
  }
  const endRel = src.slice(startIdx).indexOf("\n};");
  if (endRel === -1) {
    console.error("ERROR: end of FALLBACK_STRATEGIES block not found.");
    process.exit(1);
  }
  const block = src.slice(startIdx, startIdx + endRel + 3);

  // Match any inline leg construction: { route: 'X' or `X`, time: ..., airline: ... }
  // Handles BOTH backtick and double-quote strings.
  const legPattern = /\{\s*route:\s*(?:`([^`]+)`|"([^"]+)")\s*,\s*time:\s*(?:`([^`]+)`|"([^"]+)")\s*,\s*airline:\s*(?:`([^`]+)`|"([^"]+)")/gs;

  // Tell-tales that the airline string admits the leg isn't really direct.
  // The negative-lookaheads after \bvia\b prevent flagging legitimate
  // explanatory text like "via Seoul is the cabin workaround" inside the
  // korea handler's note-style airline string.
  const badPhrases = [
    [/\bvia\b(?!\s+the\s+route|\s+a\s+hub|\s+seoul\s+is\s+the\s+cabin)/i, "admits via routing"],
    [/cargo[- ]?only/i, "admits cargo only"],
    [/no direct(?!ly|\s+from)/i, "admits no direct"],
    [/✗/, "flagged with ✗"],
    [/position to/i, "admits position-to-hub"],
  ];

  const issues = [];
  let m;
  while ((m = legPattern.exec(block)) !== null) {
    const route = m[1] || m[2];
    const airline = m[5] || m[6];

    // Find which handler this leg lives in by walking back through the
    // block to the most recent "handler-key": ( definition.
    const pre = block.slice(0, m.index);
    const handlerKeyPattern = /"([a-z][a-z-]*)":\s*\(/g;
    let lastHandler = "?";
    let h;
    while ((h = handlerKeyPattern.exec(pre)) !== null) {
      lastHandler = h[1];
    }

    for (const [pattern, label] of badPhrases) {
      if (pattern.test(airline)) {
        issues.push({ handler: lastHandler, route, airline, label });
        break;
      }
    }
  }

  // Dedupe on (handler, route, airline)
  const seen = new Set();
  const unique = [];
  for (const issue of issues) {
    const key = `${issue.handler}::${issue.route}::${issue.airline}`;
    if (seen.has(key)) continue;
    seen.add(key);
    unique.push(issue);
  }

  console.log(`Suspicious legs found (${unique.length}):`);
  for (const issue of unique) {
    console.log(`\n  Handler: ${issue.handler}  [${issue.label}]`);
    console.log(`  route:   ${issue.route}`);
    console.log(`  airline: ${issue.airline.slice(0, 200)}`);
  }

  if (unique.length === 0) {
    console.log("  (none — all FALLBACK_STRATEGIES legs are clean)");
  }

  process.exit(unique.length > 0 ? 1 : 0);
}

const arg = process.argv[2] || DEFAULT_PATH;
main(arg);
