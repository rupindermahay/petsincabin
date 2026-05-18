import { useState, useMemo, useEffect, useRef } from "react";
import { TRAVEL_DAY_GUIDE } from "./travelDayGuide";
import { PawPrint, Plane, FileCheck, AlertTriangle, ArrowRight, ArrowLeft, RotateCcw, Check, Info, Luggage, Stethoscope, ScrollText, Sparkles, Ship, Map as MapIcon, Train, Compass, Menu, X } from "lucide-react";

// ---------- ROBUST SCROLL HELPER ----------
// On mobile, content above a scroll target can change height while a
// smooth-scroll is animating (intake/assessment blocks collapsing, result
// cards/checklists expanding, images loading). The browser then overshoots
// or undershoots and lands on the wrong section. scrollToTarget scrolls,
// then re-measures after layout settles and corrects any drift.
//   target: a DOM element, OR a string element id.
function scrollToTarget(target) {
  const resolve = () =>
    typeof target === "string" ? document.getElementById(target) : target;
  const doScroll = () => {
    const el = resolve();
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  };
  doScroll();
  // Re-correct after layout settles. A correctly-landed section sits near the
  // top of the viewport (within its scroll-margin, ~96px); large drift means
  // an overshoot/undershoot worth correcting. Two passes catch the immediate
  // reflow and any slightly later async height changes.
  [450, 900].forEach((delay) => {
    setTimeout(() => {
      const el = resolve();
      if (!el) return;
      const top = el.getBoundingClientRect().top;
      if (top < -120 || top > 220) {
        el.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }, delay);
  });
}

// ---------- ROUTE LEG CLASSIFICATION ----------
// A "transit" leg is any non-flight segment of a journey: a layover, a drive,
// a train, a ferry, the Eurotunnel, etc. Everything else is a flight leg.
// This is used both to label routes ("2-flight journey") and to drive
// per-leg paperwork inference, so it must be accurate.
//
// Detection: the leg is transit if it STARTS with a transit keyword, OR if it
// mentions a ground/sea crossing marker anywhere (Calais, Folkestone, Dover,
// Eurotunnel, a ferry, Holyhead, Cherbourg/Roscoff, Rosslare). A genuine
// flight leg never names those. This catches descriptive legs like
// "Hub → Calais, then Eurotunnel or DFDS/P&O ferry → UK" that don't happen
// to start with a keyword.
const TRANSIT_LEG_START = /^(Layover|Overnight|Drive|Train|Ferry|Eurotunnel|Recommended|At |Wait )/i;
const TRANSIT_LEG_MARKER = /Calais|Folkestone|Eurotunnel|Holyhead|Cherbourg|Roscoff|Rosslare|ferry/i;
function isTransitLeg(legRoute) {
  const t = legRoute || "";
  return TRANSIT_LEG_START.test(t) || TRANSIT_LEG_MARKER.test(t);
}


// Update this date whenever the site content changes — it's shown in the
// footer as "Updated on DD Month YYYY" so visitors know how current the
// guidance is. Format: "DD Month YYYY".
const LAST_UPDATED = "15 May 2026";

// ---------- DATA ----------

const AIRLINES = [
  {
    name: "Alaska Airlines",
    scope: "north-america",
    tags: ["us", "mexico"],
    cabin: "Cabin US domestic ✓ — limited intl (Mexico, Canada, Costa Rica)",
    cabinStatus: "yes",
    direction: "Cabin allowed: domestic US, Hawaii (with strict prep), some Mexico, Canada, and Costa Rica routes. Cabin NOT allowed: most other international destinations (Alaska's network is mostly North America-focused).",
    originAllowed: { uk: "no", us: "yes", eu: "no", india: "no", canada: "yes", uae: "no", caribbean: "no", mexico: "yes", "south-america": "no", "central-america": "yes", japan: "no", korea: "no" },
    destinationAllowed: { uk: "no", us: "yes", eu: "no", india: "no", canada: "yes", uae: "no", caribbean: "no", mexico: "yes", "south-america": "no", "central-america": "yes", japan: "no", korea: "no" },
    fee: "$100 each way cabin / $200 each way checked baggage (increased from $150 on Jan 2, 2026)",
    weight: "No stated weight limit; pet must fit comfortably in carrier (under 17 × 11 × 9.5 in soft / 17 × 11 × 7.5 in hard)",
    carrier: "Soft: 17 × 11 × 9.5 in. Hard: 17 × 11 × 7.5 in.",
    notes: "Seattle-based (SEA hub) — strongest pet-friendly network on the US west coast. Cabin pets allowed on domestic, plus Canada, Mexico, Costa Rica, Bahamas, Japan, and Hawaii (with Direct Airport Release prep — start 4+ months out). Two pets of the same species can share one carrier if both fit comfortably. Max 3 cabin pets in First, 8 in Main on each flight. No transatlantic or India routes — connect via partner airlines.",
    intl: "Yes (limited routes)",
    verified: "May 2026",
    link: "https://www.alaskaair.com/content/travel-info/policies/pets-traveling-with-pets",
  },
  {
    name: "American Airlines",
    scope: "north-america",
    tags: ["us", "caribbean", "mexico", "korea"],
    cabin: "Yes — but NO transatlantic / transpacific cabin",
    cabinStatus: "conditional",
    direction: "Cabin allowed: domestic US, Canada, Mexico, Puerto Rico, Caribbean, Central America (up to 12 hour flights). Cabin NOT allowed (both directions): transatlantic flights (Europe), transpacific flights (Asia), UK, Hawaii.",
    originAllowed: { uk: "no", us: "yes", eu: "no", india: "no", canada: "yes", uae: "no", caribbean: "yes", mexico: "yes", "south-america": "no", "central-america": "yes", japan: "no", korea: "yes" },
    destinationAllowed: { uk: "no", us: "yes", eu: "no", india: "no", canada: "yes", uae: "no", caribbean: "yes", mexico: "yes", "south-america": "no", "central-america": "yes", japan: "no", korea: "yes" },
    fee: "$150 each way",
    weight: "Pet + carrier max 20 lb (~9 kg) combined",
    carrier: "Soft (recommended): 18 × 11 × 11 in. Hard: 19 × 13 × 9 in",
    notes: "Cabin only for general public — cargo limited to active U.S. Military and State Dept. NOT a transatlantic option (no cabin pets on Europe/Asia flights). Restrictions to/from PHX, TUS, LAS, PSP May–Sept.",
    intl: "Limited (Americas + Caribbean only)",
    verified: "May 2026",
    link: "https://www.aa.com/i18n/travel-info/special-assistance/pets.jsp",
  },
  {
    name: "Delta",
    tags: ["us", "europe", "longhaul", "caribbean", "mexico", "korea"],
    cabin: "Cabin US/Canada/EU only — long banned list",
    cabinStatus: "conditional",
    direction: "Cabin allowed: domestic US, Canada, Puerto Rico, USVI, continental EU (Paris, Amsterdam, Rome, etc.). Cabin NOT allowed (both directions): UK, Australia, NZ, UAE/Dubai, Hong Kong, Hawaii, Ireland, Brazil, Colombia, South Africa, Jamaica, Iceland, Barbados, Dakar, Dominican Republic.",
    originAllowed: { uk: "no", us: "yes", eu: "yes", india: "no", canada: "yes", uae: "no", caribbean: "yes", mexico: "yes", "south-america": "no", "central-america": "yes", japan: "no", korea: "yes" },
    destinationAllowed: { uk: "no", us: "yes", eu: "yes", india: "no", canada: "yes", uae: "no", caribbean: "yes", mexico: "yes", "south-america": "no", "central-america": "yes", japan: "no", korea: "yes" },
    fee: "$150 domestic / $200 international",
    weight: "No stated weight; must fit under seat",
    carrier: "Soft-sided with 3+ ventilation panels (4 international). ~18 × 11 × 11 in",
    notes: "Long list of country exclusions — always confirm by phone before booking. JFK → CDG is a verified working route (Delta cabin to Paris, OK). Cargo only available to active U.S. Military and State Dept. Pet must be 10 weeks old (domestic), 16 weeks (international to US), 15 weeks (EU).",
    intl: "Yes (restricted)",
    verified: "May 2026",
    link: "https://www.delta.com/us/en/pet-travel/overview",
  },
  {
    name: "United",
    tags: ["us", "europe", "longhaul", "caribbean", "japan", "mexico", "korea"],
    cabin: "Cabin allowed — including US ↔ Japan direct (one of very few)",
    cabinStatus: "conditional",
    direction: "Cabin allowed: domestic US, Canada, Mexico, continental EU, and notably US ↔ Japan (SFO/ORD ↔ NRT/HND/KIX, with new routes launching Sept-Oct 2026). Cabin NOT allowed (both directions): Australia, Barbados, Cuba, Guam (one-way exception: cabin OK from Guam to Tokyo-Narita but not back), French Polynesia, Hawaii, Hong Kong, Iceland, India, Ireland, Jamaica, Marshall Islands, Micronesia, NZ, Palau, Philippines, Saint Kitts and Nevis, South Africa, Sweden, Trinidad and Tobago, UAE, UK.",
    originAllowed: { uk: "no", us: "yes", eu: "yes", india: "no", canada: "yes", uae: "no", caribbean: "yes", mexico: "yes", japan: "yes", "south-america": "no", "central-america": "yes", korea: "yes" },
    destinationAllowed: { uk: "no", us: "yes", eu: "yes", india: "no", canada: "yes", uae: "no", caribbean: "yes", mexico: "yes", japan: "yes", "south-america": "no", "central-america": "yes", korea: "yes" },
    fee: "$150 each way (plus $150 again for stopovers over 4 hours)",
    weight: "No weight limit — pet must fit in carrier under the seat",
    carrier: "Hard: 17.5 × 12 × 7.5 in. Soft: 18 × 11 × 11 in",
    notes: "Pets in cabin only — PetSafe cargo program discontinued except for active U.S. Military and State Dept. United is one of very few airlines accepting cabin pets US↔Japan direct (no weight limit). Long destination ban list — always confirm by phone before booking. Reserve early; limited spots per flight.",
    intl: "Yes (restricted)",
    verified: "May 2026",
    link: "https://www.united.com/en/us/fly/travel/traveling-with-pets.html",
  },
  {
    name: "JetBlue",
    scope: "us-caribbean",
    tags: ["us", "caribbean", "mexico"],
    cabin: "Yes — domestic + many Caribbean / Latin America destinations",
    cabinStatus: "conditional",
    direction: "Cabin allowed: domestic US, Puerto Rico, USVI, plus broad Caribbean and Latin America reach via JetBlue's network. Cabin NOT allowed (both directions): UK (service dogs only), Europe (no transatlantic cabin). IMPORTANT: cabin pet eligibility depends on each destination country's own import rules — JetBlue may operate the route but the country's paperwork (and sometimes breed restrictions or rabies titer requirements) determines whether your pet qualifies. Always verify directly with JetBlue for your specific route AND check the destination's official import requirements.",
    originAllowed: { uk: "no", us: "yes", eu: "no", india: "no", canada: "yes", uae: "no", caribbean: "yes", mexico: "yes", "south-america": "no", "central-america": "yes", japan: "no", korea: "no" },
    destinationAllowed: { uk: "no", us: "yes", eu: "no", india: "no", canada: "yes", uae: "no", caribbean: "yes", mexico: "yes", "south-america": "no", "central-america": "yes", japan: "no", korea: "no" },
    fee: "$125 each way (some routes higher)",
    weight: "Pet + carrier max 20 lb (strictly enforced)",
    carrier: "17 × 12.5 × 8.5 in",
    notes: "JetPaws program. Strong cabin reach for North America and Latin America/Caribbean travellers. For destinations like Jamaica, Cayman Islands, Barbados — start the destination's import process 30+ days before travel (strict paperwork). Max 4 pets per flight — book early. No cargo service for pets. Confirm cabin eligibility for your specific route by calling JetBlue 800-JETBLUE.",
    intl: "Yes (Americas — no transatlantic cabin)",
    verified: "May 2026",
    link: "https://www.jetblue.com/traveling-together/traveling-with-pets",
  },
  {
    name: "Southwest",
    scope: "domestic-only",
    tags: ["us", "mexico"],
    cabin: "Yes — domestic only",
    cabinStatus: "yes",
    direction: "Cabin allowed: domestic US, Puerto Rico, USVI only. Cabin NOT allowed: all other international routes (Southwest is a domestic-only carrier with limited Caribbean reach).",
    originAllowed: { uk: "no", us: "yes", eu: "no", india: "no", canada: "no", uae: "no", caribbean: "no", mexico: "yes", "south-america": "no", "central-america": "yes", japan: "no", korea: "no" },
    destinationAllowed: { uk: "no", us: "yes", eu: "no", india: "no", canada: "no", uae: "no", caribbean: "no", mexico: "yes", "south-america": "no", "central-america": "yes", japan: "no", korea: "no" },
    fee: "$125 each way",
    weight: "Pet must fit comfortably in carrier",
    carrier: "18.5 × 8.5 × 13.5 in",
    notes: "Domestic only — no international, no Hawaii. Six pets per flight max.",
    intl: "No",
    verified: "May 2026",
    link: "https://www.southwest.com/help/traveling-with-pets",
  },
  {
    name: "Spirit",
    scope: "us-caribbean",
    tags: ["us", "caribbean", "mexico"],
    cabin: "Yes — domestic only",
    cabinStatus: "yes",
    direction: "Cabin allowed: domestic US, Puerto Rico, USVI, plus a few Caribbean and Latin America routes. Cabin NOT allowed: most international destinations.",
    originAllowed: { uk: "no", us: "yes", eu: "no", india: "no", canada: "no", uae: "no", caribbean: "yes", mexico: "yes", "south-america": "no", "central-america": "yes", japan: "no", korea: "no" },
    destinationAllowed: { uk: "no", us: "yes", eu: "no", india: "no", canada: "no", uae: "no", caribbean: "yes", mexico: "yes", "south-america": "no", "central-america": "yes", japan: "no", korea: "no" },
    fee: "$125 each way",
    weight: "Pet + carrier max 40 lb",
    carrier: "18 × 14 × 9 in",
    notes: "Domestic US, Puerto Rico, USVI, plus some Mexico, Central America, and select Caribbean / Latin America routes. Cabin pet eligibility varies by route and destination country rules. Pets must be at least 8 weeks old. Confirm your specific route by calling Spirit directly.",
    intl: "Limited",
    verified: "May 2026",
    link: "https://customersupport.spirit.com/en-US/category/article/KA-01066",
  },
  {
    name: "Frontier",
    scope: "domestic-only",
    tags: ["us", "mexico"],
    cabin: "Yes — domestic only",
    cabinStatus: "yes",
    direction: "Cabin allowed: domestic US only. Cabin NOT allowed: all international routes (Frontier is a domestic-only carrier).",
    originAllowed: { uk: "no", us: "yes", eu: "no", india: "no", canada: "no", uae: "no", caribbean: "no", mexico: "yes", "south-america": "no", "central-america": "yes", japan: "no", korea: "no" },
    destinationAllowed: { uk: "no", us: "yes", eu: "no", india: "no", canada: "no", uae: "no", caribbean: "no", mexico: "yes", "south-america": "no", "central-america": "yes", japan: "no", korea: "no" },
    fee: "~$99 each way",
    weight: "Pet must fit comfortably in carrier",
    carrier: "18 × 14 × 8 in",
    notes: "One of the cheapest pet fees. Domestic and limited international.",
    intl: "Limited",
    verified: "May 2026",
    link: "https://www.flyfrontier.com/travel/travel-info/animals/",
  },
  {
    name: "Hawaiian Airlines",
    scope: "hawaii-only",
    tags: ["us", "korea"],
    cabin: "Cabin OUT of Hawaii ✓ — but limited routes INTO Hawaii",
    cabinStatus: "conditional",
    direction: "Cabin allowed: inter-island Hawaii flights AND flights LEAVING Hawaii to US mainland. Cabin NOT allowed: flights INTO Hawaii from the mainland (cargo only — Hawaii's strict quarantine rules), AND no cabin to/from JFK, BOS, AUS, SLC, PPG. No international cabin at all.",
    originAllowed: { uk: "no", us: "yes", eu: "no", india: "no", canada: "no", uae: "no", caribbean: "no", mexico: "no", "south-america": "no", "central-america": "no", japan: "yes", korea: "yes" },
    destinationAllowed: { uk: "no", us: "no", eu: "no", india: "no", canada: "no", uae: "no", caribbean: "no", mexico: "no", "south-america": "no", "central-america": "no", japan: "yes", korea: "yes" },
    fee: "$35 inter-island / $100 mainland–Hawaii (decreased from $125 in Jan 2026)",
    weight: "25 lb combined (pet + carrier) — most generous in U.S.",
    carrier: "Soft: 16 × 10 × 9.5 in",
    notes: "Asymmetric route rules — pets can leave Hawaii cabin but not arrive cabin. Cabin not accepted at all on routes to/from JFK, BOS, AUS, SLC, PPG. No international cabin. Hawaii's strict quarantine rules apply — 120-day default unless 4+ months Direct Airport Release prep is completed.",
    intl: "No (in-cabin)",
    verified: "May 2026",
    link: "https://www.hawaiianairlines.com/our-services/special-assistance/traveling-with-pets",
  },
  {
    name: "Air Canada",
    tags: ["canada", "uk-out", "us", "longhaul", "caribbean", "mexico", "korea"],
    cabin: "Cabin OUT of UK ✓ — but cargo only INTO UK",
    cabinStatus: "conditional",
    direction: "Cabin allowed: domestic, US/Canada, Europe, and OUT of UK (LHR, Edinburgh). Cabin NOT allowed: INTO UK (cargo only), Australia, NZ, Hawaii, Ireland, Hong Kong, South Africa, Jamaica, Barbados.",
    originAllowed: { uk: "yes", us: "yes", eu: "yes", india: "no", canada: "yes", uae: "no", caribbean: "yes", mexico: "yes", "south-america": "yes", "central-america": "yes", japan: "yes", korea: "yes" },
    destinationAllowed: { uk: "no", us: "yes", eu: "yes", india: "no", canada: "yes", uae: "no", caribbean: "yes", mexico: "yes", "south-america": "yes", "central-america": "yes", japan: "yes", korea: "yes" },
    fee: "CAD $50–$59 domestic / $100–$118 intl",
    weight: "Pet + carrier max 22 lb (10 kg)",
    carrier: "Soft-sided. Max 21.5 × 15.5 × 9 in (55 × 40 × 23 cm) — sometimes smaller depending on aircraft",
    notes: "Important: cabin rules are directional. Pets CAN fly with you in cabin from London Heathrow or Edinburgh TO Canada (verified — many UK pet owners use this as the route out). What's blocked is the return leg — UK government rules mean pets can ONLY enter the UK as cargo, not as cabin or checked baggage. Aircraft-specific carrier sizes — confirm at booking. Combined weight strictly enforced.",
    intl: "Yes",
    verified: "May 2026",
    link: "https://www.aircanada.com/us/en/aco/home/plan/special-assistance/pets.html",
  },
  {
    name: "Air Transat",
    tags: ["canada", "uk-out", "longhaul", "mexico"],
    cabin: "Cabin OUT of UK ✓ (Manchester / Glasgow only)",
    cabinStatus: "conditional",
    direction: "Cabin allowed: Canada, US, Europe, and OUT of UK from Manchester (MAN) and Glasgow (GLA) — NOT Gatwick. Cabin NOT allowed: into UK (cargo only).",
    originAllowed: { uk: "yes", us: "no", eu: "yes", india: "no", canada: "yes", uae: "no", caribbean: "no", mexico: "yes", "south-america": "yes", "central-america": "yes", japan: "no", korea: "no" },
    destinationAllowed: { uk: "no", us: "no", eu: "yes", india: "no", canada: "yes", uae: "no", caribbean: "no", mexico: "yes", "south-america": "yes", "central-america": "yes", japan: "no", korea: "no" },
    fee: "CAD $50–$120 depending on route",
    weight: "Pet + carrier max 17.6 lb (8 kg)",
    carrier: "Soft-sided. Max 16 × 9 × 9 in (40 × 23 × 23 cm)",
    notes: "Another Canadian carrier that allows pets in cabin OUT of the UK — handy if you live closer to Manchester or Glasgow than London. Air Transat operates this from Manchester (MAN) and Glasgow (GLA) only — NOT Gatwick. Like Air Canada, pets can't fly cabin into the UK on return.",
    intl: "Yes (transatlantic)",
    verified: "May 2026",
    link: "https://www.airtransat.com/en-CA/travel-information/special-services/pets-and-service-dogs",
  },
  {
    name: "Air France / KLM",
    tags: ["uk-out", "europe", "india", "us", "longhaul", "mexico", "korea"],
    cabin: "Cabin OUT of UK ✓ — but cargo only INTO UK",
    cabinStatus: "conditional",
    direction: "Cabin allowed: most international routes including OUT of UK (LHR → Paris/Amsterdam). Cabin NOT allowed: INTO UK or Ireland (cargo only — UK government rule). Bans cabin on connecting US flights operated by Delta/Virgin (operator's rules apply).",
    originAllowed: { uk: "yes", us: "yes", eu: "yes", india: "yes", canada: "yes", uae: "no", caribbean: "no", mexico: "yes", "south-america": "yes", "central-america": "yes", japan: "yes", korea: "yes" },
    destinationAllowed: { uk: "no", us: "yes", eu: "yes", india: "yes", canada: "yes", uae: "no", caribbean: "no", mexico: "yes", "south-america": "yes", "central-america": "yes", japan: "yes", korea: "yes" },
    fee: "~€75–€200 depending on route",
    weight: "Pet + carrier max 8 kg (17.6 lb)",
    carrier: "46 × 28 × 24 cm (~18 × 11 × 9 in), soft-sided only",
    notes: "One of the most popular cabin options OUT of the UK for travel to Europe or onwards. Combined carrier from LHR (NOT Gatwick — Gatwick blocks cabin pets). Connect at Paris/Amsterdam for cabin-friendly onward flights to USA, India, and most of the world. Not allowed in business class on intercontinental. Snub-nosed breeds: cabin OK; cargo banned for medical reasons.",
    intl: "Yes",
    verified: "May 2026",
    link: "https://wwws.airfrance.us/information/passagers/voyager-avec-son-animal-chien-chat",
  },
  {
    name: "Lufthansa",
    tags: ["uk-out", "europe", "india", "us", "longhaul", "mexico", "korea"],
    cabin: "Cabin OUT of UK ✓ — but cargo only INTO UK",
    cabinStatus: "conditional",
    direction: "Cabin allowed: most international routes including OUT of UK (LHR → Frankfurt/Munich). Cabin NOT allowed: INTO UK (cargo only — UK government rule), into Australia, NZ, Hawaii.",
    originAllowed: { uk: "yes", us: "yes", eu: "yes", india: "yes", canada: "yes", uae: "no", caribbean: "no", mexico: "yes", "south-america": "yes", "central-america": "yes", japan: "yes", korea: "yes" },
    destinationAllowed: { uk: "no", us: "yes", eu: "yes", india: "yes", canada: "yes", uae: "no", caribbean: "no", mexico: "yes", "south-america": "yes", "central-america": "yes", japan: "yes", korea: "yes" },
    fee: "€70–€110 in Europe / €110–€300 long-haul",
    weight: "Pet + carrier max 8 kg (17.6 lb)",
    carrier: "55 × 40 × 23 cm (~21.7 × 15.7 × 9 in) — slightly larger than Air France",
    notes: "Strong UK-out option: fly LHR → Frankfurt or Munich in cabin, connect onwards to most of the world (USA, India, Asia) all in cabin. Slightly larger carrier allowance than Air France/KLM. Frankfurt's Animal Lounge is the world's most advanced animal handling facility — comforting for cargo pets transferring through. NOTE: Gatwick (LGW) blocks cabin pets — use Heathrow.",
    intl: "Yes",
    verified: "May 2026",
    link: "https://www.lufthansa.com/us/en/travelling-with-animals",
  },
  {
    name: "Air India",
    tags: ["india", "europe", "us", "canada", "longhaul", "korea"],
    cabin: "Cabin India ↔ USA / Europe / Asia ✓ — NOT to UK / Australia",
    cabinStatus: "yes",
    direction: "Air India's 2026 'Paws on Board' programme allows cabin pets up to 10 kg (combined with carrier) on 80+ domestic and international routes. Cabin allowed: domestic India, India ↔ USA (direct: DEL/BOM/BLR/HYD/MAA ↔ JFK/SFO/IAD/ORD), India ↔ Europe (Frankfurt, Paris, Amsterdam, London cargo-only), India ↔ Asia. Cabin NOT allowed: India ↔ UK (cargo hold only — UK government embargo), India ↔ UAE (departing India, pets must go cargo; arriving in India from UAE has cabin options).",
    originAllowed: { uk: "no", us: "yes", eu: "yes", india: "yes", canada: "yes", uae: "no", caribbean: "no", mexico: "no", "south-america": "no", "central-america": "no", japan: "yes", korea: "yes" },
    destinationAllowed: { uk: "no", us: "yes", eu: "yes", india: "yes", canada: "yes", uae: "no", caribbean: "no", mexico: "no", "south-america": "no", "central-america": "no", japan: "yes", korea: "yes" },
    fee: "₹7,500 domestic India / $140 short-haul international / $160 medium-haul / non-refundable",
    weight: "Pet + carrier max 10 kg (22 lb) for cabin — generous compared to most carriers' 8 kg",
    carrier: "Soft-sided only in cabin, max 17 × 10 × 9 in (43 × 25 × 23 cm), ventilated on 3 sides, leakproof. IATA-compliant hard crates required for cargo hold (10–32 kg pets).",
    notes: "Book via Air India customer support or city booking office at least 48 hours before departure (reduced from 72 hrs in 2026). Confirmation requires submitted paperwork. Pet sits in last aisle row, economy only. Max 2 pets per flight, seated 5 rows apart if both present. Brachycephalic breeds allowed in cabin but not in cargo (welfare reasons).",
    intl: "Yes — including direct India ↔ USA cabin pet routes (rare for any carrier)",
    verified: "May 2026",
    link: "https://www.airindia.com/in/en/frequently-asked-questions/pet-travel.html",
  },
  {
    name: "LOT Polish Airlines",
    tags: ["uk-out", "europe", "india", "us", "longhaul", "korea"],
    cabin: "Cabin OUT of UK ✓ — and India ↔ USA via Warsaw",
    cabinStatus: "conditional",
    direction: "Cabin allowed: most international routes including OUT of UK (LHR → Warsaw), India (Delhi) ↔ USA via Warsaw both legs. Cabin NOT allowed: INTO UK (cargo only — UK government rule).",
    originAllowed: { uk: "yes", us: "yes", eu: "yes", india: "yes", canada: "yes", uae: "no", caribbean: "no", mexico: "no", "south-america": "no", "central-america": "no", japan: "yes", korea: "yes" },
    destinationAllowed: { uk: "no", us: "yes", eu: "yes", india: "yes", canada: "yes", uae: "no", caribbean: "no", mexico: "no", "south-america": "no", "central-america": "no", japan: "yes", korea: "yes" },
    fee: "€12 domestic · €50 Europe/Middle East · €70 USA/Canada/China/Japan",
    weight: "Pet + carrier max 8 kg (17 lb)",
    carrier: "Soft-sided. Max 55×40×20 cm (B787/B737)",
    notes: "Under-rated cabin option for long-haul. Flies UK → Warsaw → onward to USA, India, China, Japan — all legs cabin-friendly. One of the cheapest international cabin fees on the market (€70 to USA). Reserve by phone or via Manage My Booking.",
    intl: "Yes (most routes)",
    verified: "May 2026",
    link: "https://www.lot.com/uk/en/travelling-with-pets",
  },
  {
    name: "SWISS",
    tags: ["uk-out", "europe", "india", "us", "longhaul", "korea"],
    cabin: "Cabin OUT of UK ✓ — and India ↔ USA via Zurich",
    cabinStatus: "conditional",
    direction: "Cabin allowed: most international routes including OUT of UK (LHR → Zurich), India ↔ USA via Zurich both legs. Cabin NOT allowed: INTO UK (cargo only — UK government rule).",
    originAllowed: { uk: "yes", us: "yes", eu: "yes", india: "yes", canada: "yes", uae: "no", caribbean: "no", mexico: "no", "south-america": "yes", "central-america": "no", japan: "yes", korea: "yes" },
    destinationAllowed: { uk: "no", us: "yes", eu: "yes", india: "yes", canada: "yes", uae: "no", caribbean: "no", mexico: "no", "south-america": "yes", "central-america": "no", japan: "yes", korea: "yes" },
    fee: "$60–$120 per segment depending on route",
    weight: "Pet + carrier max 8 kg (17 lb)",
    carrier: "Soft-sided, max 55×40×23 cm",
    notes: "Strong UK-out option AND excellent cabin route from India to USA via Zurich. Uniquely accommodating to brachycephalic (snub-nosed) breeds — allowed in cabin (most airlines ban them from cargo only; SWISS keeps them in cabin). Use Heathrow not Gatwick.",
    intl: "Yes (most routes)",
    verified: "May 2026",
    link: "https://www.swiss.com/us/en/prepare/special-care/animals-travelling",
  },
  {
    name: "TAP Air Portugal",
    tags: ["uk-out", "europe", "us", "longhaul"],
    cabin: "Cabin OUT of UK ✓ — best for UK → Portugal",
    cabinStatus: "conditional",
    direction: "Cabin allowed: most international routes including OUT of UK (LHR → Lisbon/Porto, 184 flights per week from Heathrow). Cabin NOT allowed: INTO UK or Ireland (cargo only — UK/Ireland government rule).",
    originAllowed: { uk: "yes", us: "yes", eu: "yes", india: "no", canada: "yes", uae: "no", caribbean: "no", mexico: "no", "south-america": "yes", "central-america": "no", japan: "no", korea: "no" },
    destinationAllowed: { uk: "no", us: "yes", eu: "yes", india: "no", canada: "yes", uae: "no", caribbean: "no", mexico: "no", "south-america": "yes", "central-america": "no", japan: "no", korea: "no" },
    fee: "€75 short-haul · €200 long-haul (US, Brazil)",
    weight: "Pet + carrier max 8 kg (17.6 lb)",
    carrier: "Soft-sided, max 45 × 30 × 23 cm (~18 × 12 × 9 in)",
    notes: "The flag carrier of Portugal — and the most popular option for UK pet owners moving to Portugal (Lisbon, Porto, Faro). Flies LHR → Lisbon in cabin daily. Lisbon is also a good connection hub for onward cabin flights to USA, Brazil, and Morocco. Reserve at least 48 hours ahead by phone. Snub-nosed breeds: cabin allowed.",
    intl: "Yes",
    verified: "May 2026",
    link: "https://www.flytap.com/en-us/information/traveling-with-animals/pets",
  },
  {
    name: "Etihad Airways",
    tags: ["dubai", "india", "europe", "uk-out", "us", "korea"],
    cabin: "Cabin OUT of UK / US / India / Europe → Abu Dhabi ✓ — but NOT cabin INTO the UK or US",
    cabinStatus: "conditional",
    direction: "Cabin allowed: OUT of the UK (London Heathrow, Manchester) to Abu Dhabi, OUT of the USA to Abu Dhabi, India ↔ Abu Dhabi (Delhi, Mumbai, Bangalore, Chennai), Europe ↔ Abu Dhabi (most major cities), Canada ↔ Abu Dhabi. All under 8 kg combined. Cabin NOT allowed: INTO the UK (London, Manchester) and INTO the USA — Etihad's country-restrictions page lists these as 'flights to' only, meaning the inbound direction is blocked while flying OUT to Abu Dhabi is permitted. Also no cabin to/from Australia (Sydney), Hong Kong, Maldives, South Africa, Bali, and several Indian airports (Ahmedabad, Jaipur, Kochi, Kozhikode, Thiruvananthapuram). And NEVER into Dubai (DXB) — UAE law requires cargo into DXB for all airlines.",
    originAllowed: { uk: "yes", us: "yes", eu: "yes", india: "yes", canada: "yes", uae: "yes", caribbean: "no", mexico: "no", "south-america": "no", "central-america": "no", japan: "yes", korea: "yes" },
    destinationAllowed: { uk: "no", us: "no", eu: "yes", india: "yes", canada: "yes", uae: "yes", caribbean: "no", mexico: "no", "south-america": "no", "central-america": "no", japan: "yes", korea: "yes" },
    fee: "Promo: $399 per segment (bookings before end of May 2026). Standard: $1,500 per segment.",
    weight: "Pet + carrier max 8 kg (17.6 lb) — economy under-seat OR buy adjacent seat for bigger carrier",
    carrier: "Economy under-seat: max 40 × 40 × 22 cm. Adjacent seat: max 50 × 43 × 50 cm. Soft-sided, well-ventilated.",
    notes: "The ONLY airline that allows cabin pets into the UAE — and only into Abu Dhabi (AUH), 90 minutes from Dubai by road. Per Etihad's official country-restrictions page, the UK and USA are listed as 'flights to' restrictions — meaning cabin pets flying OUT of the UK (LHR, MAN) or OUT of the US to Abu Dhabi are permitted, while the inbound direction is not. Always confirm your specific route directly with Etihad when booking. Submit booking form 7+ days before, email all docs 72 hrs before. UAE Health Certificate required. Banned breeds: Pit Bull, Staffies, American Bully, Brazilian/Argentinian Mastiff, Tosa, Doberman, Rottweiler, Boxer, Canario Presa. Snub-nosed breeds restricted seasonally.",
    intl: "Yes (Abu Dhabi-routed only)",
    verified: "May 2026",
    link: "https://www.etihad.com/en-us/plan/travel-companion/travelling-with-pets",
  },
  {
    name: "Turkish Airlines",
    tags: ["uk-out", "europe", "india", "us", "korea"],
    cabin: "Cabin OUT of UK ✓ via Istanbul — but NOT into Dubai (UAE law)",
    cabinStatus: "conditional",
    direction: "Cabin allowed: most international routes via Istanbul including OUT of UK (LHR/MAN → Istanbul), USA ↔ Istanbul, India ↔ Istanbul (Delhi, Mumbai, Bangalore, Hyderabad), and many Asian/African destinations. Economy class only — business class cabin pets banned from April 21, 2026 (new bookings). Cabin NOT allowed: INTO UK from Istanbul (cargo only — UK government rule), into Dubai DXB (UAE law applies regardless of airline), some Middle East destinations.",
    originAllowed: { uk: "yes", us: "yes", eu: "yes", india: "yes", canada: "yes", uae: "no", caribbean: "no", mexico: "no", "south-america": "yes", "central-america": "no", japan: "yes", korea: "yes" },
    destinationAllowed: { uk: "no", us: "yes", eu: "yes", india: "yes", canada: "yes", uae: "no", caribbean: "no", mexico: "no", "south-america": "yes", "central-america": "no", japan: "yes", korea: "yes" },
    fee: "$15 short-haul domestic · $70 starting price international (varies by route)",
    weight: "Pet + carrier max 8 kg (17.6 lb)",
    carrier: "Soft-sided. Max 40 × 30 × 23 cm (L × W × H) under-seat",
    notes: "Strong Istanbul-hub option for Asia-Europe-Americas connections. Pet rooms at Istanbul (IST) airport include a pet toilet — useful for layovers. Frequent IST flights to most Indian cities. Good for India → Europe → USA routings via Istanbul. ECONOMY ONLY (no cabin pets in business since April 2026). Reserve at least 6 hours before, recommended 48+ hours for international.",
    intl: "Yes (most routes)",
    verified: "May 2026",
    link: "https://www.turkishairlines.com/en-us/any-questions/traveling-with-pets/",
  },
  {
    name: "Iberia",
    tags: ["europe", "us", "longhaul", "mexico"],
    cabin: "Cabin EU/transatlantic ✓ — but NOT to UK",
    cabinStatus: "conditional",
    direction: "Cabin allowed: most international routes including Spain ↔ EU, Spain ↔ USA (JFK/MIA/ORD/BOS via Madrid), Spain ↔ Latin America. Cabin NOT allowed (both directions): UK (LHR, MAN, EDI, LGW — Iberia uses IAG Cargo to/from UK). Snub-nosed breeds allowed cabin only (not hold).",
    originAllowed: { uk: "no", us: "yes", eu: "yes", india: "no", canada: "yes", uae: "no", caribbean: "no", mexico: "yes", "south-america": "yes", "central-america": "yes", japan: "yes", korea: "no" },
    destinationAllowed: { uk: "no", us: "yes", eu: "yes", india: "no", canada: "yes", uae: "no", caribbean: "no", mexico: "yes", "south-america": "yes", "central-america": "yes", japan: "yes", korea: "no" },
    fee: "€35 within Spain · €50 Europe / Africa / Middle East · €150 America / Asia",
    weight: "Pet + carrier max 8 kg (17.6 lb) combined",
    carrier: "Soft-sided. Max 45 × 35 × 25 cm (sum of dimensions ≤105 cm)",
    notes: "Spain's flag carrier, hub at Madrid (MAD). The most-used cabin pet airline for Spanish + Latin American routes. Book pet space via Iberia Booking Offices ≥48 hours before flight. Snub-nosed breeds are cabin-only (banned from hold). For UK travel, use a workaround via Eurotunnel + ferry.",
    intl: "Yes (extensive)",
    verified: "May 2026",
    link: "https://www.iberia.com/us/fly-with-iberia/pets/",
  },
  {
    name: "ITA Airways",
    tags: ["europe", "us", "longhaul"],
    cabin: "Cabin EU/transatlantic ✓ — but NOT to UK",
    cabinStatus: "conditional",
    direction: "Cabin allowed: domestic Italy (up to 12 kg combined!), Italy ↔ EU, Italy ↔ USA (JFK/MIA/ORD/LAX/BOS via Rome FCO), Italy ↔ Tokyo / Buenos Aires / Sao Paulo. Cabin NOT allowed (both directions): UK (cargo only). Snub-nosed cabin OK (not hold).",
    originAllowed: { uk: "no", us: "yes", eu: "yes", india: "no", canada: "no", uae: "no", caribbean: "no", mexico: "no", "south-america": "yes", "central-america": "no", japan: "yes", korea: "no" },
    destinationAllowed: { uk: "no", us: "yes", eu: "yes", india: "no", canada: "no", uae: "no", caribbean: "no", mexico: "no", "south-america": "yes", "central-america": "no", japan: "yes", korea: "no" },
    fee: "€73 domestic Italy · €95 Europe / North Africa · €210 N. America · €230 S. America / Japan",
    weight: "Domestic Italy: 12 kg combined. International: 8 kg combined",
    carrier: "Soft-sided. Max 55 × 40 × 23 cm international (slightly larger than most). 24 × 40 × 30 cm domestic Italy.",
    notes: "Italy's flag carrier, hub at Rome Fiumicino (FCO). One of the most pet-friendly European carriers. As of 2026, ITA is piloting 'large pet-friendly' flights allowing pets up to 30 kg in cabin on selected DOMESTIC Italy routes (summer 2026 launch — extra seat purchase required). Book pet space ≥48 hours before via Customer Center.",
    intl: "Yes",
    verified: "May 2026",
    link: "https://www.ita-airways.com/us/en/book-and-prepare/other-requests/travelling-with-pets",
  },
  {
    name: "Lift",
    scope: "south-africa",
    tags: [],
    cabin: "Cabin ✓ — small dogs, domestic South Africa only",
    cabinStatus: "conditional",
    direction: "Cabin allowed: small dogs (under 7 kg) on Lift's dog-friendly domestic South Africa flights only — Johannesburg (JNB), Cape Town (CPT), Durban (DUR), George (GRJ). Cabin NOT allowed: cats are not accepted at all; no international flights — Lift only operates domestic SA routes. There is no cabin pet option in or out of South Africa internationally on any airline; international pets travel as manifested cargo.",
    originAllowed: {},
    destinationAllowed: {},
    fee: "Same as an adult fare (less taxes) — you book the dog its own blocked window seat.",
    weight: "Dog max 7 kg. Carrier max 55 × 35 × 28 cm, soft-sided, well-ventilated.",
    carrier: "Purpose-built soft-sided carrier, max 55 × 35 × 28 cm. Lined with puppy pads. Must fit fully under the window seat. Dog stays inside the carrier at all times — including in the terminal.",
    notes: "South Africa's only in-cabin pet option — and it's domestic-only. Dogs only (no cats), one dog per adult passenger, dog must be 10+ weeks old and rabies-vaccinated if over 3 months. IMPORTANT: don't book your flight first — submit Lift's Dog-in-Cabin Request Form at least 7 days before travel; they confirm availability within 24 business hours, then book it for you. The window seat is blocked for the dog and you sit in the adjacent middle seat. Arrive 2 hours early. Dog seats per flight are limited — request early. For international travel to or from South Africa, pets must travel as manifested cargo (see the South Africa tab in Difficult Destinations).",
    intl: "No — domestic South Africa only",
    verified: "May 2026",
    link: "https://www.lift.co.za/LIFT-Extras/travelling-with-small-dogs",
  },
  {
    name: "LATAM Airlines",
    tags: ["south-america", "europe", "caribbean", "us", "mexico"],
    cabin: "Cabin ✓ — small dogs and cats on LATAM-operated routes",
    cabinStatus: "conditional",
    direction: "Cabin allowed: Economy and Premium Economy on LATAM-operated routes only (no codeshares, no connections with other airlines). Strongest for South America — domestic Brazil (São Paulo, Rio, Brasília), domestic Chile (Santiago and regional), and regional hops between Brazil, Chile, Argentina, Peru, Uruguay, Ecuador and Colombia. Also LATAM's own long-haul routes from South America to Europe (Madrid, Frankfurt, Rome, Lisbon). Cabin TEMPORARILY SUSPENDED on US↔Brazil, Bolivia, Ecuador, Peru and Colombia due to CDC dog import rules. NOT available to/from the UK, Australia, New Zealand, South Africa or the Galapagos.",
    originAllowed: { us: "yes (Brazil/Peru/Ecuador/Colombia routes suspended — verify)", canada: "no", uk: "no", eu: "yes (LATAM-operated long-haul only)", india: "no", caribbean: "yes", uae: "no", "south-america": "yes", mexico: "yes", "central-america": "yes", japan: "no", korea: "no" },
    destinationAllowed: { us: "yes (some routes suspended — verify)", canada: "no", uk: "no", eu: "yes (LATAM-operated only)", india: "no", caribbean: "yes", uae: "no", "south-america": "yes", mexico: "yes", "central-america": "yes", japan: "no", korea: "no" },
    fee: "Cabin: BRL 200 domestic Brazil · ~USD 200 regional South America · ~USD 250 long-haul (to Europe). Hold fees are separate and weight-banded.",
    weight: "Pet + carrier combined max 7 kg for cabin. Soft carrier max 40 × 28 × 25 cm. Hard kennel max 36 × 33 × 19 cm. Cabin pets carried on A319/A320/A321/A350 and B777 aircraft.",
    carrier: "Soft-sided carrier (max 40 × 28 × 25 cm) or hard kennel (max 36 × 33 × 19 cm). No wheels. Must be leak-proof and well-ventilated. Pet must be able to stand, turn and move without touching walls or ceiling.",
    notes: "LATAM is THE cabin-pet carrier for South America — if you're moving within Brazil, Chile, or between South American countries, this is the airline. Key restrictions: LATAM-operated flights ONLY — no codeshares, no connections to/from other airlines (a connection on Delta or any partner voids the pet booking). Minimum 16 weeks old (6 months for US travel). Brachycephalic breeds not accepted in the hold but CAN travel in cabin if they meet size requirements. Dangerous breeds banned from both. Book through LATAM's Contact Center or WhatsApp — not online — up to 4 hours before a cabin flight. Arrive 3 hours early for domestic Brazil, 4 hours for international. Within Brazil you need a health certificate (issued within 10 days) and proof of rabies vaccine with the 21-day waiting period observed.",
    intl: "Yes — South America domestic and regional, plus LATAM-operated long-haul to Europe",
    verified: "May 2026",
    link: "https://www.latamairlines.com/us/en/experience/prepare-your-trip/pets-transportation/cabin",
  },
  {
    name: "Avianca",
    tags: ["south-america", "us", "europe", "caribbean", "mexico"],
    cabin: "Cabin ✓ — Colombia hub, strong South / Central America coverage",
    cabinStatus: "yes",
    direction: "Cabin allowed: dogs and cats up to 10 kg combined on most international and domestic routes. Strong network: Colombia, Peru, Ecuador, Costa Rica, El Salvador, plus connections to Brazil, Argentina, Chile, Mexico, US, Canada, Spain. Cabin NOT allowed: UK (cargo only — Animal Reception Centre rules), Galapagos Islands (live animal transport prohibited), Aruba and Curaçao (except permanent moves to Curaçao). Brachycephalic dog and cat breeds: cabin only — never accepted in the hold due to breathing risk.",
    originAllowed: { uk: "no (cargo only)", us: "yes", eu: "yes", india: "no", canada: "yes", uae: "no", caribbean: "yes", mexico: "yes", "south-america": "yes", "central-america": "yes", japan: "no", korea: "no" },
    destinationAllowed: { uk: "no (cargo only)", us: "yes", eu: "yes", india: "no", canada: "yes", uae: "no", caribbean: "yes", mexico: "yes", "south-america": "yes", "central-america": "yes", japan: "no", korea: "no" },
    fee: "Cabin: ~USD 19–29 domestic Colombia (COP 75,000–115,000) · ~USD 160 to/from North America · USD 180–200 to/from Europe. Hold: ~USD 50–70 domestic / USD 225–245 international depending on route.",
    weight: "Pet + carrier max 10 kg (22 lb) combined for cabin. Up to 70 kg combined in the hold (size restrictions apply). Minimum age 4 months (2 months for domestic Colombia routes).",
    carrier: "Soft-sided only for cabin, max 56 × 36 × 25 cm (22 × 14 × 10 in). Waterproof fabric, well-ventilated, leak-proof. Must fit under seat. For hold travel: rigid IATA-compliant kennel.",
    notes: "Avianca is the natural cabin carrier for the northern half of South America — Colombia, Peru, Ecuador, plus Central America. Hub at Bogotá El Dorado (BOG). Important: Avianca does NOT permit transit with pets on connecting flights with codeshare partners — must be Avianca-operated end to end (including TACA, Avianca Costa Rica, Avianca Peru, Avianca Ecuador). Pit Bull, American Pit Bull Terrier, Staffordshire Terrier, and American Staffordshire Terrier are banned from import to Colombia by law (Article 108-E). Avianca will refuse these breeds on Colombia-bound flights. Brachycephalic dogs can travel in cabin (signed cabin/hold form required at airport) but never in cargo. Max 1 pet per passenger in cabin, max 6 pets per flight (including ESAs). Book 48+ hours in advance through Avianca Contact Center.",
    intl: "Yes — South America, Central America, Caribbean, North America, Europe (Madrid/Barcelona)",
    verified: "May 2026",
    link: "https://www.avianca.com/en/information-and-help/pet-transport/",
  },
  {
    name: "Copa Airlines",
    tags: ["south-america", "us", "caribbean", "mexico", "central-america"],
    cabin: "Cabin ✓ — Panama hub, strong Americas coverage including Uruguay",
    cabinStatus: "yes",
    direction: "Cabin allowed: dogs and cats up to 10 kg (20 lb) combined on most Copa-operated routes. Panama City (PTY) is the hub — Copa serves Argentina, Bolivia, Brazil, Chile, Colombia, Ecuador, Peru, Paraguay, Uruguay (Montevideo), Venezuela, plus the Caribbean, Central America, Mexico, US and Canada. Useful for deeper South American destinations (Montevideo, Asunción) that lack direct US cabin connections. Cabin NOT allowed: connecting flights with airlines other than Copa (no codeshare pets). Pets are not permitted on flights to Armenia (AXM) on weekends due to closed quarantine offices.",
    originAllowed: { uk: "no", us: "yes", eu: "no", india: "no", canada: "yes", uae: "no", caribbean: "yes", mexico: "yes", "south-america": "yes", "central-america": "yes", japan: "no", korea: "no" },
    destinationAllowed: { uk: "no", us: "yes", eu: "no", india: "no", canada: "yes", uae: "no", caribbean: "yes", mexico: "yes", "south-america": "yes", "central-america": "yes", japan: "no", korea: "no" },
    fee: "Cabin: $125 international, $25 domestic Panama. Cargo: varies by route.",
    weight: "Pet + carrier max 10 kg (20 lb) combined for cabin. Minimum age 16 weeks for cabin (8 weeks for cargo).",
    carrier: "Soft-sided only for cabin, max 45 × 27 × 27 cm (18 × 11 × 11 in). Well-ventilated, leak-proof, must fit under the seat with the pet able to stand and turn around. Hard-sided not permitted for cabin.",
    notes: "Copa is THE cabin pet route to deeper South America — especially useful for Montevideo (Uruguay), Asunción (Paraguay), and Santa Cruz (Bolivia), all of which lack direct US cabin routes. Typical routing: US → Panama City (PTY) → onward South American hub. Max 3 cabin pets per flight (book 48+ hours ahead). Pets not allowed in Business Class (seat configuration). Brachycephalic dogs accepted in cabin only — never in cargo (Copa specifically restricts upper-airway-obstruction breeds from the hold). Banned cargo breeds: Pit Bull Terrier, American Staffordshire Terrier, English Bulldog, Canary Catch Dog, Argentine Dogo, Cane Corso, Brasilian Fila. Health certificate and rabies vaccination required for international cabin pets.",
    intl: "Yes — Americas-wide (US, Canada, Mexico, Central America, Caribbean, all of South America)",
    verified: "May 2026",
    link: "https://www.copaair.com/en-us/travel-information/special-assistance/traveling-with-pets/",
  },
  {
    name: "Vueling",
    tags: ["europe"],
    cabin: "Cabin ✓ — small dogs and cats across Europe",
    cabinStatus: "yes",
    direction: "Cabin allowed: dogs, cats, birds (not birds of prey) and turtles across Vueling's European network — Spain domestics, and routes between Spain and the rest of Europe. Cabin NOT allowed: flights to/from the UK and Iceland (Vueling does not carry pets on those routes at all). Vueling has no hold or cargo option — cabin is the only way, so larger pets can't fly Vueling.",
    originAllowed: { us: "no", canada: "no", uk: "no", eu: "yes", india: "no", caribbean: "no", uae: "no", mexico: "no", "south-america": "no", "central-america": "no", japan: "no", korea: "no" },
    destinationAllowed: { us: "no", canada: "no", uk: "no", eu: "yes", india: "no", caribbean: "no", uae: "no", mexico: "no", "south-america": "no", "central-america": "no", japan: "no", korea: "no" },
    fee: "~€50 domestic Spain · ~€60 international and Canary Islands",
    weight: "Pet + carrier combined max 10 kg (8 kg on Iberia-operated flights). Soft carrier max 45 × 39 × 21 cm.",
    carrier: "Soft-sided, non-rigid carrier only, max 45 × 39 × 21 cm. Must have ventilation holes and a waterproof base. Goes under the seat in front. Homemade carriers not accepted. Up to 2 cats or dogs of the same species/litter may share one carrier if within the weight limit.",
    notes: "Vueling is one of the easiest cabin-pet airlines in Europe — a key carrier for Spain (Barcelona, Madrid, Valencia) and Spain↔Europe routes. No breed restrictions, brachycephalic breeds welcome in cabin. Microchip and EU pet passport with rabies vaccine (21+ days old) required. You can book the pet online during booking via the Fly Light fare — no need to call. Max 5 pets per flight (2 on Iberia-operated flights). Selecting a pet disables seat selection — your seat is assigned at check-in. Remember: no UK or Iceland routes, and no hold option at all.",
    intl: "Yes — across Europe (not UK or Iceland)",
    verified: "May 2026",
    link: "https://www.vueling.com/en/vueling-services/prepare-your-trip/pets-on-board",
  },
  {
    name: "Volaris",
    scope: "north-america",
    tags: ["mexico", "us"],
    cabin: "Cabin ✓ — small dogs and cats, Mexico and the Americas",
    cabinStatus: "conditional",
    direction: "Cabin allowed: small dogs and cats across Volaris's network — domestic Mexico, Mexico↔US, and Mexico↔Central America (Guatemala, El Salvador, Costa Rica, Honduras) and Colombia. Cabin NOT allowed: a long list of breeds is banned outright, including all brachycephalic dogs and cats — this is stricter than Aeromexico, which allows flat-faced breeds in cabin.",
    originAllowed: { us: "yes", canada: "no", uk: "no", eu: "no", india: "no", caribbean: "no", uae: "no", mexico: "yes", "south-america": "no", "central-america": "yes", japan: "no", korea: "no" },
    destinationAllowed: { us: "yes", canada: "no", uk: "no", eu: "no", india: "no", caribbean: "no", uae: "no", mexico: "yes", "south-america": "no", "central-america": "yes", japan: "no", korea: "no" },
    fee: "Varies by route — typically ~$150 USD per kennel each way · lower for domestic Mexico",
    weight: "Pet + carrier combined max ~12 kg. Carrier max 44 × 30 × 19 cm.",
    carrier: "Max 44 × 30 × 19 cm, must fit under the seat. For dogs the carrier may be soft or rigid; for cats it MUST be rigid plastic. Fully enclosed, no perforated floor, no wheels. Secured with a plastic strap provided at the airport. Pet stays inside the whole flight.",
    notes: "Volaris is Mexico's big low-cost carrier — useful for domestic Mexico and Mexico↔US/Central America cabin travel. The key limitation versus Aeromexico: Volaris bans a long list of breeds entirely (all brachycephalic dogs and cats, plus pit bull types, mastiffs, and others) — neither cabin nor checked. Minimum 4 months old. One pet per passenger. Owner must sit in a window seat, not an exit row. Book through Volaris directly. Arrive 2 hours early domestic, 3 hours international.",
    intl: "Yes — Mexico, US, Central America, Colombia",
    verified: "May 2026",
    link: "https://cms.volaris.com/en/travel-info/optional-services/fly-with-your-pet/",
  },
  {
    name: "SAS Scandinavian Airlines",
    tags: ["europe", "us", "longhaul"],
    cabin: "Cabin ✓ — strong network covering Nordics, Europe, US, Asia",
    cabinStatus: "yes",
    direction: "Cabin allowed: SAS allows small cats and dogs in cabin on flights to 25+ countries including the US, China, Japan, Morocco, Turkey, and across Europe. Three hubs: Copenhagen (CPH), Stockholm (ARN), and Oslo (OSL). Cabin NOT allowed: brachycephalic-breed restrictions apply per destination; pets to Iceland and Svalbard have separate rules (Svalbard dogs only, requires permit; no cats to Svalbard).",
    originAllowed: { uk: "no", us: "yes", eu: "yes", india: "no", canada: "no", uae: "no", caribbean: "no", mexico: "no", "south-america": "no", "central-america": "no", japan: "yes", korea: "no" },
    destinationAllowed: { uk: "no", us: "yes", eu: "yes", india: "no", canada: "no", uae: "no", caribbean: "no", mexico: "no", "south-america": "no", "central-america": "no", japan: "yes", korea: "no" },
    fee: "€55 domestic / €70–149 international depending on route (highest fees to China and long-haul Asia)",
    weight: "Pet + carrier max 8 kg (17.6 lb) combined for cabin",
    carrier: "Soft-sided, max 40 × 25 × 23 cm (15.7 × 9.8 × 9 in). Counts as your carry-on bag.",
    notes: "Book at least 24 hours in advance — space is limited per flight. Two pets of the same species who know each other can share one carrier if combined weight stays under 8 kg. No cabin pets in exit row or bulkhead seats. SAS does NOT fly cabin pets to/from the UK (UK government embargo applies, like all airlines).",
    intl: "Yes (extensive network)",
    verified: "May 2026",
    link: "https://www.flysas.com/us-en/travel-info/travel-with-pets/cabin",
  },
  {
    name: "Norwegian Air Shuttle",
    tags: ["europe"],
    cabin: "Cabin ✓ — within Schengen / EU only",
    cabinStatus: "conditional",
    direction: "Cabin allowed: small cats and dogs on flights within the Schengen area and EU. Cabin NOT allowed: flights to/from Iceland; cats not permitted on Madeira routes; UK cabin not permitted (UK embargo); cats not permitted on Svalbard routes (dogs only, with permit). No transatlantic cabin pets — Norwegian's long-haul subsidiary (Norse Atlantic) does not accept pets at all.",
    originAllowed: { uk: "no", us: "no", eu: "yes", india: "no", canada: "no", uae: "no", caribbean: "no", mexico: "no", "south-america": "no", "central-america": "no", japan: "no", korea: "no" },
    destinationAllowed: { uk: "no", us: "no", eu: "yes", india: "no", canada: "no", uae: "no", caribbean: "no", mexico: "no", "south-america": "no", "central-america": "no", japan: "no", korea: "no" },
    fee: "€55–75 each way (online) / €60–85 each way (at airport)",
    weight: "Pet + carrier max 8 kg (17.6 lb) combined",
    carrier: "Sherpa-style soft carrier, max 43 × 31 × 20 cm (17 × 12 × 8 in) — must compress to these dimensions if soft.",
    notes: "Up to 3 very small puppies or kittens can share one carrier as 'one animal' if combined weight is under 8 kg. Cargo hold available for larger pets on connecting flights within Norway only (Oslo Gardermoen ↔ Bergen ↔ Trondheim). Norse Atlantic (the long-haul subsidiary, US/Caribbean routes) does NOT carry pets — service dogs only.",
    intl: "Limited to Schengen / EU",
    verified: "May 2026",
    link: "https://www.norwegian.com/en/travel-info/baggage/travelling-with-pets/",
  },
  {
    name: "Korean Air",
    tags: ["japan", "us", "europe", "india", "longhaul", "korea"],
    cabin: "Cabin ✓ — including Japan ↔ Korea and onward to US/Europe/India",
    cabinStatus: "yes",
    direction: "Cabin allowed: 30+ countries including Japan, US, France, Germany, Italy, Netherlands, Spain, Switzerland, India, Singapore, Thailand. Korea ↔ Japan is one of the best cabin pet paths to/from Japan. Cabin NOT allowed: UK and UAE (cargo only). Brachycephalic breeds only allowed in cabin, never cargo. Fierce-breed bans: Tosa, Pit Bull, Rottweiler, Mastiff, Laika, Ovcharka, Kangal, Wolfdog.",
    originAllowed: { uk: "no", us: "yes", eu: "yes", india: "yes", canada: "yes", uae: "no", caribbean: "no", japan: "yes", mexico: "no", "south-america": "no", "central-america": "no", korea: "yes" },
    destinationAllowed: { uk: "no", us: "yes", eu: "yes", india: "yes", canada: "yes", uae: "no", caribbean: "no", japan: "yes", mexico: "no", "south-america": "no", "central-america": "no", korea: "yes" },
    fee: "Korea↔Japan/China/Taiwan: $100. Other Asia: $150. Asia↔Americas or Europe/ME/Africa/Oceania: $200. Domestic KRW 30,000.",
    weight: "Pet + carrier max 7 kg (15.4 lb) for cabin. Verified against Korean Air's official Travel With Pets policy May 2026.",
    carrier: "Soft: max 32 × 45 × 19 cm (12.5 × 17.5 × 7.5 in). Hard: same. Soft carriers can be up to 26 cm tall if they compress to 19 cm.",
    notes: "Book at least 48 hrs before international, 24 hrs before domestic. Hub: Seoul Incheon (ICN). The Japan ↔ Korea ↔ rest-of-world path is one of the best ways into/out of Japan in cabin, since JAL and ANA don't carry cabin pets. Max 1 cabin pet per passenger, plus up to 2 in cargo.",
    intl: "Yes (extensive network)",
    verified: "May 2026",
    link: "https://www.koreanair.com/us/en/airport/assistance/travel-with-pet/checklist",
  },
  {
    name: "T'Way Air",
    tags: ["japan", "europe", "korea"],
    cabin: "Cabin ✓ — domestic Korea + select international (Japan, Asia, Croatia)",
    cabinStatus: "conditional",
    direction: "Cabin allowed: domestic Korea, plus select international routes including Japan, Vietnam, Taiwan, Hong Kong, Thailand, and Zagreb (Croatia — newer European route). Cabin NOT allowed: no UK/US/Australia. Business Saver zone seats don't permit pets. No pets carried in the hold.",
    originAllowed: { uk: "no", us: "no", eu: "yes", india: "no", canada: "no", uae: "no", caribbean: "no", japan: "yes", mexico: "no", "south-america": "no", "central-america": "no", korea: "yes" },
    destinationAllowed: { uk: "no", us: "no", eu: "yes", india: "no", canada: "no", uae: "no", caribbean: "no", japan: "yes", mexico: "no", "south-america": "no", "central-america": "no", korea: "yes" },
    fee: "Domestic Korea: 30,000 KRW (~$23). International: 100,000–200,000 KRW (~$75–150).",
    weight: "Pet + carrier max 9 kg (20 lb) — the most generous limit among Korean cabin-pet airlines",
    carrier: "Hard: max 37 cm wide × 23 cm tall. Soft: up to 26 cm tall. T'carriers can be purchased at check-in from Korean airports.",
    notes: "T'Way's 9 kg weight limit beats Korean Air's 7 kg — useful for slightly larger small dogs. One pet stroller or car seat checks free per pet (including at gate). Max 6 pets per flight, one per adult. Important: no transit with pets in Korea — so Japan ↔ T'Way ↔ onward isn't a workable cabin route, only point-to-point.",
    intl: "Yes (limited Asia routes + ZAG)",
    verified: "May 2026",
    link: "https://www.twayair.com/app/serviceInfo/contents/1148",
  },
  {
    name: "Aeromexico",
    tags: ["mexico", "us", "japan", "south-america", "longhaul", "korea"],
    cabin: "Cabin ✓ — including Japan ↔ Mexico direct (rare)",
    cabinStatus: "yes",
    direction: "Cabin allowed: domestic Mexico, Mexico ↔ US, Mexico ↔ Central/South America, Mexico ↔ Europe (Madrid, Paris, Amsterdam), and notably Mexico ↔ Japan (one of very few airlines offering cabin pets to Tokyo direct). Snub-nosed breeds allowed in cabin (more flexible than Volaris). Cabin NOT allowed: UK.",
    originAllowed: { uk: "no", us: "yes", eu: "yes", india: "no", canada: "yes", uae: "no", caribbean: "yes", mexico: "yes", "south-america": "yes", japan: "yes", "central-america": "yes", korea: "yes" },
    destinationAllowed: { uk: "no", us: "yes", eu: "yes", india: "no", canada: "yes", uae: "no", caribbean: "yes", mexico: "yes", "south-america": "yes", japan: "yes", "central-america": "yes", korea: "yes" },
    fee: "Mexico domestic: $35. Mexico ↔ US: $125. International long-haul: $200–250.",
    weight: "Pet + carrier max 9 kg (20 lb)",
    carrier: "Soft: max 40 × 30 × 21 cm. Hard: max 40 × 28 × 22 cm. Must fit under the seat.",
    notes: "Aeromexico is one of the very few airlines that allows cabin pets on flights to Japan (alongside United for US routes and Korean carriers for Korea routes). MEX ↔ NRT direct is the Pacific cabin pet route via Mexico. Pets must be at least 8 weeks old; brachycephalic breeds welcome in cabin but not cargo.",
    intl: "Yes",
    verified: "May 2026",
    link: "https://aeromexico.com/en-us/help-center/general-questions/special-traveler/pets",
  },
];

// Airlines that explicitly DO NOT allow pets in cabin — kept here so people searching for them find the answer.
const NO_CABIN_AIRLINES = [
  {
    name: "British Airways",
    detail: "Assistance dogs only. Pets travel via IAG Cargo. No cabin option, ever.",
    link: "https://www.britishairways.com/en-gb/information/travel-assistance/travelling-with-pets",
  },
  {
    name: "Qatar Airways",
    detail: "No cabin pets on any route (only falcons and service dogs). Excellent cargo handling at Doha hub.",
    link: "https://www.qatarairways.com/en-us/baggage/animals.html",
  },
  {
    name: "Emirates",
    detail: "No cabin pets on any route. All pets to/from Dubai must travel as manifested cargo (UAE law).",
    link: "https://www.emirates.com/us/english/help/forms/pets-travel/",
  },
  {
    name: "Japan Airlines (JAL) / ANA",
    detail: "Neither Japanese flag carrier accepts cabin pets on international flights — assistance dogs only. (So 'India → Tokyo → USA in cabin' is a myth — it's not a real route.)",
    link: "https://www.ana.co.jp/en/us/travel-information/pet-policy/",
  },
  {
    name: "Icelandair",
    detail: "No cabin pets on any route — service and assistance dogs only. As of November 2024, pets are no longer accepted as checked baggage either. The only option is cargo-only freighter aircraft operated by Icelandair Cargo (flying out of LAX and Liège, Belgium). Iceland itself requires 4 weeks quarantine for all pets entering the country.",
    link: "https://www.icelandair.com/support/special-assistance/animal-transportation/",
  },
];

// ---------- POPULAR ROUTES & TIMES ----------

const DIRECT_ROUTES = [
  // ═══════ FROM AMSTERDAM ═══════
  { from: "Amsterdam (AMS)", to: "New York (JFK)", duration: "7h 50m", note: "KLM. ✓ Cabin (under 8 kg). KLM's flagship transatlantic — one of the most reliable cabin pet options.", tags: ["europe", "us"] },
  { from: "Amsterdam (AMS)", to: "Newark (EWR)", duration: "7h 50m", note: "KLM / United. ✓ Cabin (under 8 kg). Newark is the NJ/CT alternative to JFK — same distance from AMS.", tags: ["europe", "us"] },
  { from: "Amsterdam (AMS)", to: "Miami (MIA)", duration: "9h 30m", note: "KLM. ✓ Cabin (under 8 kg).", tags: ["europe", "us"] },
  { from: "Amsterdam (AMS)", to: "London (LHR)", duration: "1h 10m", note: "KLM. ✓ Cabin OUT of Europe (remember: cabin INTO the UK is not possible — this route works as the last leg out of UK using AMS as a hub, not the return).", tags: ["europe", "uk-out"] },
  { from: "Amsterdam (AMS)", to: "Oslo (OSL)", duration: "1h 55m", note: "KLM / Norwegian / SAS. ✓ Cabin (under 8 kg). For dogs: tapeworm treatment 24–120 hrs before arrival is required for Norway entry.", tags: ["europe"] },

  // ═══════ INTRA-EUROPE TRAINS (Eurostar Red — former Thalys) ═══════
  // Pets are allowed on Eurostar's continental routes between France,
  // Belgium, the Netherlands and Germany — NOT on trains to/from London.
  // Small pets under 6 kg travel free in a carrier (max 45×30×25 cm);
  // larger dogs need a €30 dog ticket and must be muzzled and leashed.
  { from: "Amsterdam (AMS)", to: "Paris (CDG)", duration: "~3h 20m by train", mode: "train", note: "By train, not plane — and for this hop the train is the better pet option. Eurostar (former Thalys) runs Amsterdam Centraal → Paris Gare du Nord direct. Pets are welcome: small pets under 6 kg travel free in a carrier; larger dogs need a €30 dog ticket and must be muzzled and on a lead. No cargo, no crate — your pet is with you the whole way. (Airport codes shown for routing; the journey is city-centre to city-centre.)", tags: ["europe"] },
  { from: "Paris (CDG)", to: "Amsterdam (AMS)", duration: "~3h 20m by train", mode: "train", note: "By train, not plane. Eurostar (former Thalys) runs Paris Gare du Nord → Amsterdam Centraal direct. Pets welcome: small pets under 6 kg free in a carrier; larger dogs need a €30 dog ticket, muzzled and leashed. Your pet stays with you — no cargo. (Airport codes shown for routing; the journey is city-centre to city-centre.)", tags: ["europe"] },
  { from: "Amsterdam (AMS)", to: "Frankfurt (FRA)", duration: "~4h by train", mode: "train", note: "By train. Eurostar (former Thalys) and Deutsche Bahn ICE both run Amsterdam → Frankfurt direct. Pets travel with you in the carriage — small pets under 6 kg free in a carrier; larger dogs need a dog ticket and must be muzzled and leashed. (Airport codes shown for routing; the journey is city-centre to city-centre.)", tags: ["europe"] },
  { from: "Frankfurt (FRA)", to: "Amsterdam (AMS)", duration: "~4h by train", mode: "train", note: "By train. Eurostar (former Thalys) and Deutsche Bahn ICE run Frankfurt → Amsterdam direct. Pets welcome in the carriage — small pets under 6 kg free in a carrier; larger dogs need a dog ticket, muzzled and leashed. (Airport codes shown for routing; the journey is city-centre to city-centre.)", tags: ["europe"] },
  { from: "Paris (CDG)", to: "Frankfurt (FRA)", duration: "~4h by train", mode: "train", note: "By train. Direct high-speed services (Deutsche Bahn ICE / TGV) link Paris and Frankfurt. Pets travel with you — small pets under 6 kg free in a carrier; on French TGV a €7-per-carrier ticket applies, larger dogs muzzled and leashed. (Airport codes shown for routing; the journey is city-centre to city-centre.)", tags: ["europe"] },
  { from: "Frankfurt (FRA)", to: "Paris (CDG)", duration: "~4h by train", mode: "train", note: "By train. Direct high-speed services (Deutsche Bahn ICE / TGV) link Frankfurt and Paris. Pets travel with you — small pets under 6 kg free in a carrier; larger dogs need a dog ticket, muzzled and leashed. (Airport codes shown for routing; the journey is city-centre to city-centre.)", tags: ["europe"] },

  // ═══════ FROM FRANKFURT ═══════
  { from: "Frankfurt (FRA)", to: "New York (JFK)", duration: "8h 30m", note: "Lufthansa. ✓ Cabin (under 8 kg). Frankfurt has the world's most advanced Animal Lounge for cargo layovers — but for cabin, Lufthansa is the reliable choice.", tags: ["europe", "us"] },
  { from: "Frankfurt (FRA)", to: "Newark (EWR)", duration: "8h 30m", note: "Lufthansa / United. ✓ Cabin (under 8 kg). Newark is a strong US East Coast alternative.", tags: ["europe", "us"] },
  { from: "Frankfurt (FRA)", to: "Boston (BOS)", duration: "7h 45m", note: "Lufthansa. ✓ Cabin (under 8 kg).", tags: ["europe", "us"] },
  { from: "Frankfurt (FRA)", to: "Washington (IAD)", duration: "8h 30m", note: "Lufthansa / United. ✓ Cabin (under 8 kg).", tags: ["europe", "us"] },
  { from: "Frankfurt (FRA)", to: "San Francisco (SFO)", duration: "11h 30m", note: "Lufthansa. ✓ Cabin (under 8 kg). Long flight — consider an overnight in Frankfurt before returning.", tags: ["europe", "us"] },
  { from: "Frankfurt (FRA)", to: "Vancouver (YVR)", duration: "9h 45m", note: "Air Canada / Lufthansa. ✓ Cabin.", tags: ["europe", "canada"] },
  { from: "Frankfurt (FRA)", to: "Miami (MIA)", duration: "10h", note: "Lufthansa. ✓ Cabin (under 8 kg).", tags: ["europe", "us"] },
  { from: "Frankfurt (FRA)", to: "Delhi (DEL)", duration: "8h", note: "Lufthansa / Air India. ✓ Cabin (under 8 kg Lufthansa / under 10 kg Air India). Frankfurt is one of the best hubs for Europe→India cabin travel.", tags: ["europe", "india"] },
  { from: "Frankfurt (FRA)", to: "Mumbai (BOM)", duration: "9h", note: "Lufthansa. ✓ Cabin (under 8 kg). Mumbai is one of India's six approved pet-entry airports.", tags: ["europe", "india"] },
  { from: "Frankfurt (FRA)", to: "Bengaluru (BLR)", duration: "9h 30m", note: "Lufthansa. ✓ Cabin (under 8 kg). Bengaluru is one of India's six approved pet-entry airports.", tags: ["europe", "india"] },
  { from: "Frankfurt (FRA)", to: "Chennai (MAA)", duration: "9h 30m", note: "Lufthansa. ✓ Cabin (under 8 kg). Chennai is one of India's six approved pet-entry airports.", tags: ["europe", "india"] },
  { from: "Frankfurt (FRA)", to: "Kolkata (CCU)", duration: "9h", note: "Lufthansa. ✓ Cabin (under 8 kg). Kolkata is one of India's six approved pet-entry airports.", tags: ["europe", "india"] },
  { from: "Frankfurt (FRA)", to: "Hyderabad (HYD)", duration: "9h 30m", note: "Lufthansa. ✓ Cabin (under 8 kg). Hyderabad is one of India's six approved pet-entry airports.", tags: ["europe", "india"] },
  { from: "Frankfurt (FRA)", to: "Valencia (VLC)", duration: "2h 30m", note: "Vueling / Lufthansa. ✓ Cabin (under 8 kg). Frankfurt→Valencia direct cabin.", tags: ["europe"] },
  { from: "Frankfurt (FRA)", to: "Oslo (OSL)", duration: "1h 55m", note: "Lufthansa / SAS. ✓ Cabin (under 8 kg). Lufthansa connects from Asia/India onward to Oslo. Tapeworm treatment required for dogs.", tags: ["europe"] },

  // ═══════ FROM MUNICH ═══════
  { from: "Munich (MUC)", to: "New York (JFK)", duration: "9h", note: "Lufthansa. ✓ Cabin (under 8 kg). Munich is Lufthansa's second hub — a solid cabin-pet departure point alongside Frankfurt. Register the pet with Lufthansa at least 72 hours ahead.", tags: ["europe", "us"] },
  { from: "Munich (MUC)", to: "Newark (EWR)", duration: "9h", note: "Lufthansa / United. ✓ Cabin (under 8 kg). Newark is the New York-area alternative to JFK.", tags: ["europe", "us"] },
  { from: "Munich (MUC)", to: "Washington (IAD)", duration: "9h 15m", note: "Lufthansa / United. ✓ Cabin (under 8 kg).", tags: ["europe", "us"] },
  { from: "Munich (MUC)", to: "Chicago (ORD)", duration: "9h 30m", note: "Lufthansa / United. ✓ Cabin (under 8 kg).", tags: ["europe", "us"] },
  { from: "Munich (MUC)", to: "Delhi (DEL)", duration: "8h", note: "Lufthansa. ✓ Cabin (under 8 kg). Munich→India cabin route — Delhi is one of India's six approved pet-entry airports.", tags: ["europe", "india"] },
  { from: "Munich (MUC)", to: "Oslo (OSL)", duration: "2h", note: "Lufthansa / SAS. ✓ Cabin (under 8 kg). For dogs entering Norway: tapeworm treatment 24–120 hrs before arrival is required.", tags: ["europe"] },

  // ═══════ FROM PARIS ═══════
  { from: "Paris (CDG)", to: "New York (JFK)", duration: "7h 45m", note: "Air France / Delta. ✓ Cabin (under 8 kg). Paris is the central hub for the UK→USA cabin workaround — fly cabin out of the UK to CDG, then onward.", tags: ["europe", "us"] },
  { from: "Paris (CDG)", to: "Boston (BOS)", duration: "7h", note: "Air France. ✓ Cabin (under 8 kg). Shortest transatlantic cabin from Europe.", tags: ["europe", "us"] },
  { from: "Paris (CDG)", to: "Miami (MIA)", duration: "9h 30m", note: "Air France. ✓ Cabin (under 8 kg).", tags: ["europe", "us"] },
  { from: "Paris (CDG)", to: "Delhi (DEL)", duration: "8h 30m", note: "Air France. ✓ Cabin (under 8 kg). Paris→India is a strong cabin route — Air France accepts cabin pets and connects to the India AQCS NOC system.", tags: ["europe", "india"] },
  { from: "Paris (CDG)", to: "Vancouver (YVR)", duration: "10h", note: "Air France / Air Canada. ✓ Cabin.", tags: ["europe", "canada"] },
  { from: "Paris (CDG)", to: "Guadalajara (GDL)", duration: "11h", note: "Air France / Aeromexico. ✓ Cabin (under 8 kg).", tags: ["europe", "mexico"] },

  // ═══════ FROM LISBON ═══════
  { from: "Lisbon (LIS)", to: "New York (JFK)", duration: "7h 30m", note: "TAP Air Portugal. ✓ Cabin (under 8 kg). TAP is one of the better cabin-pet airlines for transatlantic — more flexibility than some US carriers.", tags: ["europe", "us"] },
  { from: "Lisbon (LIS)", to: "Miami (MIA)", duration: "8h 45m", note: "TAP Air Portugal. ✓ Cabin (under 8 kg).", tags: ["europe", "us"] },

  // ═══════ FROM ZURICH ═══════
  { from: "Zurich (ZRH)", to: "New York (JFK)", duration: "9h", note: "SWISS. ✓ Cabin (under 8 kg). Snub-nosed breeds are permitted in cabin on SWISS — one of the few that explicitly allows brachycephalic pets.", tags: ["europe", "us"] },
  { from: "Zurich (ZRH)", to: "Miami (MIA)", duration: "10h 30m", note: "SWISS. ✓ Cabin (under 8 kg). Brachycephalic breeds also allowed.", tags: ["europe", "us"] },

  // ═══════ FROM BOSTON ═══════
  { from: "Boston (BOS)", to: "Paris (CDG)", duration: "7h", note: "Air France. ✓ Cabin (under 8 kg). The shortest US east coast direct cabin to Europe.", tags: ["us", "europe"] },
  { from: "Boston (BOS)", to: "Frankfurt (FRA)", duration: "7h 45m", note: "Lufthansa. ✓ Cabin (under 8 kg).", tags: ["us", "europe"] },

  // ═══════ FROM NEWARK ═══════
  { from: "Newark (EWR)", to: "Frankfurt (FRA)", duration: "8h", note: "Lufthansa / United. ✓ Cabin (under 8 kg). Newark's main direct cabin to Europe — good alternative to JFK for NJ/CT pet owners.", tags: ["us", "europe"] },
  { from: "Newark (EWR)", to: "Paris (CDG)", duration: "7h 30m", note: "Air France / United. ✓ Cabin (under 8 kg).", tags: ["us", "europe"] },
  { from: "Newark (EWR)", to: "Oslo (OSL)", duration: "8h", note: "SAS. ✓ Cabin (under 8 kg, ~€149). Direct US east coast → Norway cabin route. Tapeworm treatment for dogs required 24–120 hrs before arrival.", tags: ["us", "europe"] },
  { from: "Newark (EWR)", to: "Mumbai (BOM)", duration: "15h", note: "Air India 'Paws on Board'. ✓ Cabin direct (under 10 kg combined). Newark direct to Mumbai.", tags: ["us", "india"] },

  // ═══════ FROM SAN FRANCISCO ═══════
  { from: "San Francisco (SFO)", to: "Frankfurt (FRA)", duration: "11h 30m", note: "Lufthansa / United. ✓ Cabin (under 8 kg). West coast to Europe direct — long flight, consider an overnight in Europe before onward connections.", tags: ["us", "europe"] },
  { from: "San Francisco (SFO)", to: "Paris (CDG)", duration: "11h", note: "Air France / United. ✓ Cabin (under 8 kg).", tags: ["us", "europe"] },
  { from: "San Francisco (SFO)", to: "Delhi (DEL)", duration: "16h 30m", note: "Air India 'Paws on Board'. ✓ Cabin direct (under 10 kg combined). The shortest US west coast → India cabin route. Book via Air India customer support 48 hrs ahead; AQCS NOC must be ready before boarding.", tags: ["us", "india"] },
  { from: "San Francisco (SFO)", to: "Mumbai (BOM)", duration: "17h", note: "Air India 'Paws on Board'. ✓ Cabin direct (under 10 kg combined). Direct SFO→Mumbai.", tags: ["us", "india"] },
  { from: "San Francisco (SFO)", to: "Bengaluru (BLR)", duration: "17h", note: "Air India 'Paws on Board'. ✓ Cabin direct (under 10 kg combined). One of the few direct cabin options to South India.", tags: ["us", "india"] },
  { from: "San Francisco (SFO)", to: "Hyderabad (HYD)", duration: "17h", note: "Air India 'Paws on Board'. ✓ Cabin direct (under 10 kg combined). Direct SFO→Hyderabad.", tags: ["us", "india"] },
  { from: "San Francisco (SFO)", to: "Tokyo (NRT)", duration: "11h", note: "United. ✓ Cabin direct (no weight limit, carrier-bound, $150). One of very few cabin pet routes to Japan — JAL and ANA don't carry cabin pets. New SFO↔Haneda daily service launches Sept 2026.", tags: ["us", "japan"] },
  { from: "San Francisco (SFO)", to: "Tokyo (HND)", duration: "11h", note: "United. ✓ Cabin direct (no weight limit, $150). Daily service from Sept 2026 on 787-10. Haneda is closer to central Tokyo than Narita.", tags: ["us", "japan"] },
  { from: "San Francisco (SFO)", to: "Osaka (KIX)", duration: "11h 30m", note: "United. ✓ Cabin direct (no weight limit, $150). 5 weekly flights from Oct 2026 — direct to Osaka Kansai, an approved pet entry port.", tags: ["us", "japan"] },

  // ═══════ FROM SEATTLE ═══════
  { from: "Seattle (SEA)", to: "San Francisco (SFO)", duration: "2h 20m", note: "Alaska Airlines / Delta. ✓ Cabin ($100 each way). The crucial domestic leg for Seattle travellers heading to India — connect at SFO to Air India's direct cabin route to DEL/BOM/BLR/HYD. Same-airline booking preferred to avoid re-check.", tags: ["us"] },
  { from: "Seattle (SEA)", to: "Frankfurt (FRA)", duration: "10h 30m", note: "Lufthansa / Condor. ✓ Cabin (under 8 kg). Seattle's main direct cabin route to Europe — onward to India via Lufthansa (except Bangalore — Lufthansa specifically excludes BLR; use Air India SFO instead).", tags: ["us", "europe"] },
  { from: "Seattle (SEA)", to: "Amsterdam (AMS)", duration: "9h 45m", note: "Delta / KLM. ✓ Cabin (under 8 kg). Seattle's direct to Amsterdam — onward KLM cabin to most major Indian cities.", tags: ["us", "europe"] },
  { from: "Seattle (SEA)", to: "Paris (CDG)", duration: "10h", note: "Delta / Air France. ✓ Cabin (under 8 kg). Direct to Paris — onward Air France cabin to Delhi/Mumbai.", tags: ["us", "europe"] },
  { from: "Seattle (SEA)", to: "Vancouver (YVR)", duration: "1h", note: "Alaska Airlines. ✓ Cabin ($100 each way). Short domestic-style hop to Canada.", tags: ["us", "canada"] },

  // ═══════ FROM JFK ═══════
  { from: "New York (JFK)", to: "Delhi (DEL)", duration: "14h 30m", note: "Air India 'Paws on Board'. ✓ Cabin direct (under 10 kg combined). East coast → India direct.", tags: ["us", "india"] },
  { from: "New York (JFK)", to: "Mumbai (BOM)", duration: "16h", note: "Air India 'Paws on Board'. ✓ Cabin direct (under 10 kg combined). JFK→Mumbai direct cabin.", tags: ["us", "india"] },

  // ═══════ FROM CHICAGO ═══════
  { from: "Chicago (ORD)", to: "Frankfurt (FRA)", duration: "8h 45m", note: "Lufthansa. ✓ Cabin (under 8 kg). Frankfurt's Animal Lounge available for cargo connections.", tags: ["us", "europe"] },
  { from: "Chicago (ORD)", to: "Paris (CDG)", duration: "8h 30m", note: "Air France. ✓ Cabin (under 8 kg). Midwest's main direct cabin to Europe.", tags: ["us", "europe"] },
  { from: "Chicago (ORD)", to: "Delhi (DEL)", duration: "14h 30m", note: "Air India 'Paws on Board'. ✓ Cabin direct (under 10 kg combined). Midwest direct to India.", tags: ["us", "india"] },
  { from: "Chicago (ORD)", to: "Tokyo (NRT)", duration: "13h", note: "United. ✓ Cabin direct (no weight limit, $150). Twice-weekly service from Sept 2026 on Boeing 787-9. One of very few cabin pet paths Chicago→Japan.", tags: ["us", "japan"] },

  // ═══════ FROM WASHINGTON DULLES ═══════
  { from: "Washington (IAD)", to: "Frankfurt (FRA)", duration: "8h 30m", note: "Lufthansa / United. ✓ Cabin (under 8 kg). Dulles's main direct cabin to Europe.", tags: ["us", "europe"] },
  { from: "Washington (IAD)", to: "Paris (CDG)", duration: "7h 45m", note: "Air France / United. ✓ Cabin (under 8 kg).", tags: ["us", "europe"] },
  { from: "Washington (IAD)", to: "Delhi (DEL)", duration: "14h 30m", note: "Air India 'Paws on Board'. ✓ Cabin direct (under 10 kg combined). Dulles direct to India.", tags: ["us", "india"] },

  // ═══════ FROM CAPE TOWN ═══════
  { from: "Cape Town (CPT)", to: "Johannesburg (JNB)", duration: "2h", note: "Lift. ✓ Cabin — small dogs under 7 kg only, on Lift's dog-friendly flights. Domestic South Africa only. Submit Lift's Dog-in-Cabin form 7+ days ahead. No cats. International SA travel is cargo-only on all airlines.", tags: ["south-africa"] },
  { from: "Cape Town (CPT)", to: "Durban (DUR)", duration: "1h 50m", note: "Lift. ✓ Cabin — small dogs under 7 kg on dog-friendly flights. Domestic only. Cargo-equivalent options: FlySafair's PetLounge service (climate-controlled hold).", tags: ["south-africa"] },

  // ═══════ FROM JOHANNESBURG ═══════
  { from: "Johannesburg (JNB)", to: "Cape Town (CPT)", duration: "2h", note: "Lift. ✓ Cabin — small dogs under 7 kg only, on Lift's dog-friendly flights. South Africa's busiest domestic route. Submit Lift's Dog-in-Cabin form 7+ days ahead, window seat is blocked for the dog. No cats, no international.", tags: ["south-africa"] },
  { from: "Johannesburg (JNB)", to: "Durban (DUR)", duration: "1h 5m", note: "Lift. ✓ Cabin — small dogs under 7 kg on dog-friendly flights. Domestic only. For dogs over 7 kg or cats: FlySafair PetLounge cargo, or SAA/Airlink checked baggage (domestic).", tags: ["south-africa"] },
  { from: "Johannesburg (JNB)", to: "George (GRJ)", duration: "2h", note: "Lift. ✓ Cabin — small dogs under 7 kg on dog-friendly flights. Domestic only. Note: no airline flies cabin pets internationally in or out of South Africa — see the South Africa tab in Difficult Destinations.", tags: ["south-africa"] },

  // ═══════ FROM DELHI ═══════
  { from: "Delhi (DEL)", to: "Istanbul (IST)", duration: "7h 30m", note: "Turkish Airlines. ✓ Cabin (under 8 kg). Connect at IST for onward cabin to Europe / USA.", tags: ["india", "europe"] },
  { from: "Delhi (DEL)", to: "Paris (CDG)", duration: "9h", note: "Air India 'Paws on Board'. ✓ Cabin direct (under 10 kg combined).", tags: ["india", "europe"] },
  { from: "Delhi (DEL)", to: "Abu Dhabi (AUH)", duration: "3h 30m", note: "Etihad. ✓ Cabin (under 8 kg). Direct cabin route from Delhi to Abu Dhabi.", tags: ["india", "dubai"] },
  { from: "Delhi (DEL)", to: "Frankfurt (FRA)", duration: "8h", note: "Lufthansa / Air India. ✓ Cabin. Delhi→Frankfurt is one of the main India→Europe cabin routes.", tags: ["india", "europe"] },
  { from: "Delhi (DEL)", to: "San Francisco (SFO)", duration: "16h", note: "Air India 'Paws on Board'. ✓ Cabin direct (under 10 kg combined). The shortest direct India→US west coast cabin route — book via Air India customer support 48 hrs ahead. For Seattle, connect SFO→SEA on Alaska/Delta after a layover.", tags: ["india", "us"] },
  { from: "Delhi (DEL)", to: "New York (JFK)", duration: "15h", note: "Air India 'Paws on Board'. ✓ Cabin direct (under 10 kg combined). Direct US east coast option.", tags: ["india", "us"] },
  { from: "Delhi (DEL)", to: "Chicago (ORD)", duration: "15h", note: "Air India 'Paws on Board'. ✓ Cabin direct (under 10 kg combined). Direct Midwest US option.", tags: ["india", "us"] },
  { from: "Delhi (DEL)", to: "Washington (IAD)", duration: "15h", note: "Air India 'Paws on Board'. ✓ Cabin direct (under 10 kg combined). Direct DC option.", tags: ["india", "us"] },
  { from: "Delhi (DEL)", to: "Toronto (YYZ)", duration: "14h", note: "Air India 'Paws on Board' / Air Canada. ✓ Cabin direct (under 10 kg combined). For Canada-bound travellers — Air Canada also flies the route.", tags: ["india", "canada"] },

  // ═══════ FROM MUMBAI ═══════
  { from: "Mumbai (BOM)", to: "Frankfurt (FRA)", duration: "9h", note: "Lufthansa / Air India. ✓ Cabin (under 8 kg Lufthansa / under 10 kg Air India). Mumbai is one of India's six approved pet-entry airports — works for both departures and arrivals.", tags: ["india", "europe"] },
  { from: "Mumbai (BOM)", to: "Abu Dhabi (AUH)", duration: "3h", note: "Etihad. ✓ Cabin (under 8 kg).", tags: ["india", "dubai"] },
  { from: "Mumbai (BOM)", to: "Paris (CDG)", duration: "9h 30m", note: "Air France / Air India. ✓ Cabin.", tags: ["india", "europe"] },
  { from: "Mumbai (BOM)", to: "San Francisco (SFO)", duration: "17h", note: "Air India 'Paws on Board'. ✓ Cabin direct (under 10 kg combined). Mumbai's direct US west coast cabin route.", tags: ["india", "us"] },
  { from: "Mumbai (BOM)", to: "New York (JFK)", duration: "15h", note: "Air India 'Paws on Board'. ✓ Cabin direct (under 10 kg combined). Mumbai's direct US east coast cabin route.", tags: ["india", "us"] },
  { from: "Mumbai (BOM)", to: "Newark (EWR)", duration: "15h", note: "Air India 'Paws on Board'. ✓ Cabin direct (under 10 kg combined). Alternative US east coast option via Newark.", tags: ["india", "us"] },

  // ═══════ FROM BENGALURU ═══════
  { from: "Bengaluru (BLR)", to: "Frankfurt (FRA)", duration: "9h 30m", note: "Lufthansa. ✓ Cabin (under 8 kg). Bengaluru is one of India's six approved pet-entry airports.", tags: ["india", "europe"] },
  { from: "Bengaluru (BLR)", to: "Abu Dhabi (AUH)", duration: "3h 30m", note: "Etihad. ✓ Cabin (under 8 kg).", tags: ["india", "dubai"] },
  { from: "Bengaluru (BLR)", to: "San Francisco (SFO)", duration: "17h", note: "Air India 'Paws on Board'. ✓ Cabin direct (under 10 kg combined). Note: Lufthansa specifically EXCLUDES Bangalore from cabin pets, but Air India's direct route is fully cabin-eligible.", tags: ["india", "us"] },

  // ═══════ FROM CHENNAI ═══════
  { from: "Chennai (MAA)", to: "Frankfurt (FRA)", duration: "10h", note: "Lufthansa. ✓ Cabin (under 8 kg). Chennai is one of India's six approved pet-entry airports.", tags: ["india", "europe"] },
  { from: "Chennai (MAA)", to: "Abu Dhabi (AUH)", duration: "3h 45m", note: "Etihad. ✓ Cabin (under 8 kg).", tags: ["india", "dubai"] },

  // ═══════ FROM KOLKATA ═══════
  { from: "Kolkata (CCU)", to: "Frankfurt (FRA)", duration: "9h", note: "Lufthansa. ✓ Cabin (under 8 kg). Kolkata is one of India's six approved pet-entry airports.", tags: ["india", "europe"] },

  // ═══════ FROM HYDERABAD ═══════
  { from: "Hyderabad (HYD)", to: "Frankfurt (FRA)", duration: "9h 30m", note: "Lufthansa. ✓ Cabin (under 8 kg). Hyderabad is one of India's six approved pet-entry airports.", tags: ["india", "europe"] },
  { from: "Hyderabad (HYD)", to: "Abu Dhabi (AUH)", duration: "3h", note: "Etihad. ✓ Cabin (under 8 kg).", tags: ["india", "dubai"] },
  { from: "Hyderabad (HYD)", to: "San Francisco (SFO)", duration: "17h", note: "Air India 'Paws on Board'. ✓ Cabin direct (under 10 kg combined). Hyderabad has a direct US west coast cabin route via Air India.", tags: ["india", "us"] },

  // ═══════ FROM TOKYO (NARITA) ═══════
  { from: "Tokyo (NRT)", to: "San Francisco (SFO)", duration: "9h 30m", note: "United. ✓ Cabin direct (no weight limit, $150). One of the very few cabin pet routes OUT of Japan. JAL and ANA don't carry cabin pets at all.", tags: ["japan", "us"] },
  { from: "Tokyo (NRT)", to: "Chicago (ORD)", duration: "11h 30m", note: "United. ✓ Cabin direct (no weight limit, $150). Twice-weekly service from Sept 2026.", tags: ["japan", "us"] },
  { from: "Tokyo (NRT)", to: "Seoul (ICN)", duration: "2h 30m", note: "Korean Air / T'Way / Air Premia. ✓ Cabin (under 7 kg Korean Air / 9 kg T'Way). Cabin pet path Japan→Korea, useful as a connection to Korean Air's wider network (but not with T'Way: no pet transits).", tags: ["japan"] },
  { from: "Tokyo (NRT)", to: "Mexico City (MEX)", duration: "13h", note: "Aeromexico. ✓ Cabin direct (under 9 kg combined, $200–250). One of very few cabin pet routes out of Japan — Aeromexico flies Tokyo↔Mexico City directly with cabin pets accepted.", tags: ["japan", "mexico"] },

  // ═══════ FROM TOKYO (HANEDA) ═══════
  { from: "Tokyo (HND)", to: "San Francisco (SFO)", duration: "9h 30m", note: "United. ✓ Cabin direct (no weight limit, $150). Daily service from Sept 2026. Haneda is closer to central Tokyo than Narita.", tags: ["japan", "us"] },
  { from: "Tokyo (HND)", to: "Seoul (ICN)", duration: "2h 30m", note: "Korean Air / Asiana. ✓ Cabin (under 7 kg). Shortest Japan↔Korea cabin route from central Tokyo.", tags: ["japan"] },

  // ═══════ FROM OSAKA (KANSAI) ═══════
  { from: "Osaka (KIX)", to: "San Francisco (SFO)", duration: "10h 30m", note: "United. ✓ Cabin direct (no weight limit, $150). 5 weekly flights from Oct 2026. Osaka is an approved pet entry port.", tags: ["japan", "us"] },
  { from: "Osaka (KIX)", to: "Seoul (ICN)", duration: "1h 50m", note: "Korean Air / T'Way / Air Premia. ✓ Cabin (under 7 kg Korean Air / 9 kg T'Way). Direct Korea cabin connection from Osaka.", tags: ["japan"] },

  // ═══════ FROM SEOUL ═══════
  { from: "Seoul (ICN)", to: "Tokyo (NRT)", duration: "2h 30m", note: "Korean Air / T'Way / Air Premia. ✓ Cabin (under 7 kg Korean Air / 9 kg T'Way). Reverse of the Japan→Korea cabin route. Onward Korean Air connects to 30+ countries in cabin.", tags: ["japan"] },
  { from: "Seoul (ICN)", to: "Tokyo (HND)", duration: "2h 30m", note: "Korean Air / Asiana. ✓ Cabin (under 7 kg). Direct to Tokyo's closer-to-city airport.", tags: ["japan"] },
  { from: "Seoul (ICN)", to: "Osaka (KIX)", duration: "1h 50m", note: "Korean Air / T'Way / Air Premia. ✓ Cabin.", tags: ["japan"] },
  { from: "Seoul (ICN)", to: "San Francisco (SFO)", duration: "11h", note: "Korean Air. ✓ Cabin direct ($200, under 7 kg). The Korea→US route for travellers connecting from Japan via Seoul.", tags: ["japan", "us"] },

  // ═══════ FROM MEXICO CITY ═══════
  { from: "Mexico City (MEX)", to: "Tokyo (NRT)", duration: "14h 30m", note: "Aeromexico. ✓ Cabin direct (under 9 kg combined, $200–250). The Mexico→Japan cabin route — rare and useful for Latin American travellers heading to Japan.", tags: ["mexico", "japan"] },

  // ═══════ FROM ABU DHABI ═══════
  { from: "Abu Dhabi (AUH)", to: "Delhi / Mumbai", duration: "3h 30m", note: "Etihad. ✓ Cabin (under 8 kg). The return leg of the Etihad cabin route — same $399 promo through May 2026.", tags: ["dubai", "india"] },
  { from: "Abu Dhabi (AUH)", to: "Delhi (DEL)", duration: "3h 30m", note: "Etihad. ✓ Cabin (under 8 kg). Direct cabin AUH→Delhi.", tags: ["dubai", "india"] },
  { from: "Abu Dhabi (AUH)", to: "Mumbai (BOM)", duration: "3h", note: "Etihad. ✓ Cabin (under 8 kg). Direct cabin AUH→Mumbai.", tags: ["dubai", "india"] },
  { from: "Abu Dhabi (AUH)", to: "Bengaluru (BLR)", duration: "3h 30m", note: "Etihad. ✓ Cabin (under 8 kg).", tags: ["dubai", "india"] },
  { from: "Abu Dhabi (AUH)", to: "Chennai (MAA)", duration: "3h 45m", note: "Etihad. ✓ Cabin (under 8 kg). Chennai is one of India's six approved pet-entry airports.", tags: ["dubai", "india"] },
  { from: "Abu Dhabi (AUH)", to: "Kolkata (CCU)", duration: "4h", note: "Etihad. ✓ Cabin (under 8 kg). Kolkata is one of India's six approved pet-entry airports.", tags: ["dubai", "india"] },
  { from: "Abu Dhabi (AUH)", to: "Hyderabad (HYD)", duration: "3h", note: "Etihad. ✓ Cabin (under 8 kg). Hyderabad is one of India's six approved pet-entry airports.", tags: ["dubai", "india"] },
  { from: "Abu Dhabi (AUH)", to: "Paris (CDG)", duration: "7h 30m", note: "Etihad. ✓ Cabin out of UAE (under 8 kg). Major Etihad hub onward to most of Europe.", tags: ["dubai", "europe"] },
  { from: "Abu Dhabi (AUH)", to: "Amsterdam (AMS)", duration: "7h 30m", note: "Etihad. ✓ Cabin out of UAE (under 8 kg). Connects to KLM cabin onward.", tags: ["dubai", "europe"] },
  { from: "Abu Dhabi (AUH)", to: "Frankfurt (FRA)", duration: "7h 15m", note: "Etihad. ✓ Cabin out of UAE (under 8 kg). Frankfurt Animal Lounge available for cargo connections.", tags: ["dubai", "europe"] },
  { from: "Abu Dhabi (AUH)", to: "Zurich (ZRH)", duration: "6h 50m", note: "Etihad. ✓ Cabin out of UAE (under 8 kg). Snub-nosed breeds allowed in cabin via SWISS connections.", tags: ["dubai", "europe"] },
  { from: "Abu Dhabi (AUH)", to: "Milan (MXP) / Rome (FCO)", duration: "6h", note: "Etihad. ✓ Cabin out of UAE (under 8 kg). Direct cabin to Italy.", tags: ["dubai", "europe"] },
  { from: "Abu Dhabi (AUH)", to: "Valencia (VLC)", duration: "6h 30m", note: "Etihad. ✓ Cabin out of UAE (under 8 kg). Etihad flies to Spain direct.", tags: ["dubai", "europe"] },
  // Note: Abu Dhabi → London / Manchester is cabin OUT of AUH BUT NOT cabin INTO UK on any airline. See workarounds for UK arrivals.

  // ═══════ FROM DUBAI ═══════
  { from: "Dubai (DXB)", to: "Delhi / Mumbai", duration: "3h 15m", note: "Air India. ✓ Cabin OUT of UAE (under 10 kg combined). Pets entering UAE must go cargo regardless of airline.", tags: ["dubai", "india"] },

  // ═══════ FROM DUBLIN ═══════
  { from: "Dublin (DUB)", to: "Paris (CDG)", duration: "2h", note: "Air France. ✓ Cabin OUT of Ireland (under 8 kg). Leaving Ireland in cabin is straightforward — it's only flights INTO Ireland that ban cabin pets. Connects onward across Europe.", tags: ["europe"] },
  { from: "Dublin (DUB)", to: "Amsterdam (AMS)", duration: "1h 50m", note: "KLM. ✓ Cabin OUT of Ireland (under 8 kg). Amsterdam is a strong onward cabin hub.", tags: ["europe"] },
  { from: "Dublin (DUB)", to: "Frankfurt (FRA)", duration: "2h", note: "Lufthansa. ✓ Cabin OUT of Ireland (under 8 kg). Onward connections across Europe and beyond.", tags: ["europe"] },

  // ═══════ FROM LONDON ═══════
  { from: "London (LHR)", to: "Abu Dhabi (AUH)", duration: "7h 30m", note: "Etihad. ✓ Cabin OUT of UK (under 8 kg) — Etihad's restrictions block 'flights to London/Manchester' (inbound), not flights out. Promo $399 per segment through May 2026. The cabin route into the UAE — AUH is 90 min from Dubai by road. Confirm your route with Etihad when booking.", tags: ["uk-out", "dubai"] },
  { from: "London (LHR)", to: "Amsterdam (AMS)", duration: "1h 15m", note: "KLM. ✓ Cabin out of UK (under 8 kg). KLM hub for onward cabin flights to USA, India.", tags: ["uk-out", "europe"] },
  { from: "London (LHR)", to: "Frankfurt (FRA)", duration: "1h 35m", note: "Lufthansa. ✓ Cabin out of UK (under 8 kg). Frankfurt Animal Lounge available for cargo connections.", tags: ["uk-out", "europe"] },
  { from: "London (LHR)", to: "Istanbul (IST)", duration: "3h 50m", note: "Turkish Airlines. ✓ Cabin out of UK (under 8 kg, economy only since April 2026).", tags: ["uk-out", "europe"] },
  { from: "London (LHR)", to: "Lisbon (LIS)", duration: "2h 45m", note: "TAP Air Portugal. ✓ Cabin out of UK (under 8 kg). 184 flights/week from Heathrow.", tags: ["uk-out", "europe"] },
  { from: "London (LHR)", to: "Montreal (YUL)", duration: "7h 30m", note: "Air Canada. ✓ Cabin out of UK (under 10 kg). Theo's Mum's first leg.", tags: ["uk-out", "canada"] },
  { from: "London (LHR)", to: "Paris (CDG)", duration: "1h 20m", note: "Air France. ✓ Cabin out of UK (under 8 kg). Strong hub for onward cabin connections.", tags: ["uk-out", "europe"] },
  { from: "London (LHR)", to: "Porto (OPO)", duration: "2h 35m", note: "TAP Air Portugal. ✓ Cabin out of UK (under 8 kg). Northern Portugal direct.", tags: ["uk-out", "europe"] },
  { from: "London (LHR)", to: "Rome (FCO)", duration: "2h 45m", note: "ITA Airways. ✓ Cabin out of UK (under 8 kg). Italy's main cabin pet hub.", tags: ["uk-out", "europe"] },
  { from: "London (LHR)", to: "Toronto (YYZ)", duration: "7h 45m", note: "Air Canada. ✓ Cabin out of UK (under 10 kg combined).", tags: ["uk-out", "canada"] },
  { from: "London (LHR)", to: "Warsaw (WAW)", duration: "2h 25m", note: "LOT Polish. ✓ Cabin out of UK (under 8 kg). Cheapest long-haul connection (€70 LOT onward to USA).", tags: ["uk-out", "europe"] },
  { from: "London (LHR)", to: "Zurich (ZRH)", duration: "1h 50m", note: "SWISS. ✓ Cabin out of UK (under 8 kg). Snub-nosed breeds OK in cabin.", tags: ["uk-out", "europe"] },

  // ═══════ FROM LOS ANGELES ═══════
  { from: "Los Angeles (LAX)", to: "Frankfurt (FRA)", duration: "11h", note: "Lufthansa. ✓ Cabin (under 8 kg). West coast direct to Europe — consider stopover for long flight.", tags: ["us", "europe"] },
  { from: "Los Angeles (LAX)", to: "Paris (CDG)", duration: "11h", note: "Air France. ✓ Cabin (under 8 kg). The west coast option — longer flight, consider stopover advice.", tags: ["us", "europe"] },
  { from: "Los Angeles (LAX)", to: "Mexico City (MEX)", duration: "4h", note: "Aeromexico, Delta, American. ✓ Cabin. The main west-coast cabin route into Mexico.", tags: ["us", "mexico"] },
  { from: "Los Angeles (LAX)", to: "Honolulu (HNL)", duration: "6h", note: "Hawaiian Airlines, Alaska, Delta, United, American. ✓ Cabin on most. Cabin access is the easy part — Hawaii's rabies-free import programme is the real work: ISO microchip, two rabies vaccines, FAVN titer, paperwork to HDOA 10+ days ahead. Start 4+ months out. HNL is the only animal port of entry.", tags: ["us", "hawaii"] },

  // ═══════ FROM HONOLULU ═══════
  { from: "Honolulu (HNL)", to: "Los Angeles (LAX)", duration: "5h 40m", note: "Hawaiian Airlines, Alaska, Delta, United, American. ✓ Cabin on most. Leaving Hawaii is far simpler than arriving — standard mainland cabin pet rules apply.", tags: ["hawaii", "us"] },
  { from: "Honolulu (HNL)", to: "Kahului — Maui (OGG)", duration: "40m", note: "Hawaiian Airlines. ✓ Cabin inter-island. If your final stop is Maui or Kauai you still clear animal inspection at Honolulu first, then take the inter-island hop.", tags: ["hawaii"] },

  // ═══════ FROM MADRID ═══════
  { from: "Madrid (MAD)", to: "Lisbon (LIS)", duration: "1h 15m", note: "Iberia. ✓ Cabin (under 8 kg, €35 within Spain → Portugal).", tags: ["europe"] },
  { from: "Madrid (MAD)", to: "Miami (MIA)", duration: "9h 30m", note: "Iberia. ✓ Cabin (under 8 kg, €150 to Americas). Strong Spain → USA cabin route.", tags: ["us", "europe"] },
  { from: "Madrid (MAD)", to: "New York (JFK)", duration: "8h", note: "Iberia. ✓ Cabin (under 8 kg, €150 to Americas).", tags: ["us", "europe"] },
  { from: "Madrid (MAD)", to: "Barcelona (BCN)", duration: "1h 10m", note: "Iberia / Iberia Express / Vueling. ✓ Cabin (under 8 kg, €35 within Spain). Multiple daily. Quickest Spain domestic cabin hop.", tags: ["europe"] },

  // ═══════ FROM BARCELONA ═══════
  { from: "Barcelona (BCN)", to: "Madrid (MAD)", duration: "1h 10m", note: "Iberia Express / Vueling. ✓ Cabin (under 8 kg, €35 within Spain).", tags: ["europe"] },
  { from: "Barcelona (BCN)", to: "Paris (CDG)", duration: "1h 55m", note: "Vueling / Air France. ✓ Cabin (under 8 kg). BCN is a strong Vueling hub — one of the best European cabin options.", tags: ["europe"] },
  { from: "Barcelona (BCN)", to: "Amsterdam (AMS)", duration: "2h 20m", note: "Vueling / KLM. ✓ Cabin (under 8 kg).", tags: ["europe"] },
  { from: "Barcelona (BCN)", to: "Frankfurt (FRA)", duration: "2h 20m", note: "Vueling / Lufthansa. ✓ Cabin (under 8 kg).", tags: ["europe"] },
  { from: "Barcelona (BCN)", to: "New York (JFK)", duration: "9h 15m", note: "Level (Iberia group). ✓ Cabin (under 8 kg, €150 to Americas). Barcelona's own transatlantic cabin route — a good alternative to Madrid for US-bound travel.", tags: ["us", "europe"] },
  { from: "Barcelona (BCN)", to: "Miami (MIA)", duration: "10h", note: "Level (Iberia group). ✓ Cabin (under 8 kg, €150). Check Level's pet policy when booking — always call to confirm a pet space, not just select online.", tags: ["us", "europe"] },
  { from: "Barcelona (BCN)", to: "London (LHR)", duration: "2h 15m", note: "Iberia / Vueling / BA. ✓ Cabin OUT of Spain — note cabin INTO the UK is not possible on any airline (UK government rule). This route works as the first leg of a Paris Pivot workaround.", tags: ["uk-out", "europe"] },

  // ═══════ FROM VALENCIA ═══════
  { from: "Valencia (VLC)", to: "Madrid (MAD)", duration: "1h", note: "Iberia / Air Nostrum. ✓ Cabin (under 8 kg, €35 within Spain). Short domestic hop.", tags: ["europe"] },
  { from: "Valencia (VLC)", to: "Barcelona (BCN)", duration: "1h 5m", note: "Vueling / Air Nostrum. ✓ Cabin (under 8 kg, €35). Barcelona connects onward to Europe and the US.", tags: ["europe"] },
  { from: "Valencia (VLC)", to: "Paris (CDG)", duration: "2h 10m", note: "Vueling / Air France. ✓ Cabin (under 8 kg). Good direct cabin route for Valencia pet owners heading to France/onward Europe.", tags: ["europe"] },

  // ═══════ FROM OSLO ═══════
  { from: "Oslo (OSL)", to: "Copenhagen (CPH)", duration: "1h 10m", note: "SAS / Norwegian. ✓ Cabin (under 8 kg, €55–75). Short Nordic hop — popular Scandinavian connection.", tags: ["europe"] },
  { from: "Oslo (OSL)", to: "Stockholm (ARN)", duration: "1h", note: "SAS / Norwegian. ✓ Cabin (under 8 kg, €55–75). Important: rabies vaccine NOT required for pet movement Norway↔Sweden specifically.", tags: ["europe"] },
  { from: "Oslo (OSL)", to: "Amsterdam (AMS)", duration: "1h 55m", note: "SAS / KLM / Norwegian. ✓ Cabin (under 8 kg). KLM connects onward to most of the world from Amsterdam.", tags: ["europe"] },
  { from: "Oslo (OSL)", to: "Frankfurt (FRA)", duration: "1h 55m", note: "SAS / Lufthansa. ✓ Cabin (under 8 kg). Lufthansa connection onward to India, Asia.", tags: ["europe"] },
  { from: "Oslo (OSL)", to: "Paris (CDG)", duration: "2h 15m", note: "SAS / Air France / Norwegian. ✓ Cabin (under 8 kg). Air France onward to most international destinations.", tags: ["europe"] },
  { from: "Oslo (OSL)", to: "Madrid (MAD)", duration: "3h 20m", note: "SAS / Norwegian / Iberia. ✓ Cabin (under 8 kg). Iberia onward cabin to South America and US.", tags: ["europe"] },
  { from: "Oslo (OSL)", to: "Newark (EWR)", duration: "8h", note: "SAS. ✓ Cabin (under 8 kg, ~€149). Direct Oslo → US east coast cabin route.", tags: ["us", "europe"] },
  { from: "Oslo (OSL)", to: "Tokyo (NRT)", duration: "11h 30m", note: "SAS. ✓ Cabin (under 8 kg, fee around €149). Long-haul cabin route — note Japan's strict import rules (180-day FAVN wait, AQS Advance Notification ≥40 days before).", tags: ["europe", "japan"] },

  // ═══════ TO OSLO (reverse routes) ═══════
  { from: "Copenhagen (CPH)", to: "Oslo (OSL)", duration: "1h 10m", note: "SAS / Norwegian. ✓ Cabin (under 8 kg). For dogs: tapeworm treatment 24–120 hrs before arrival in Norway.", tags: ["europe"] },
  { from: "Stockholm (ARN)", to: "Oslo (OSL)", duration: "1h", note: "SAS / Norwegian. ✓ Cabin (under 8 kg). Norway↔Sweden specifically does NOT require rabies vaccine — but still need microchip and pet passport. Tapeworm treatment still required for dogs.", tags: ["europe"] },
  { from: "Paris (CDG)", to: "Oslo (OSL)", duration: "2h 15m", note: "SAS / Air France / Norwegian. ✓ Cabin (under 8 kg). For dogs: tapeworm treatment 24–120 hrs before arrival in Norway.", tags: ["europe"] },
  { from: "Madrid (MAD)", to: "Oslo (OSL)", duration: "3h 20m", note: "SAS / Iberia / Norwegian. ✓ Cabin (under 8 kg). For dogs: tapeworm treatment 24–120 hrs before arrival in Norway.", tags: ["europe"] },
  { from: "Tokyo (NRT)", to: "Oslo (OSL)", duration: "11h 30m", note: "SAS. ✓ Cabin (under 8 kg, ~€149). Reverse of the OSL→NRT cabin route. Tapeworm treatment for dogs required before Norway entry. SAS is one of the very few airlines offering cabin pets Tokyo→Europe direct.", tags: ["japan", "europe"] },

  // ═══════ FROM MANCHESTER ═══════
  { from: "Manchester (MAN)", to: "Abu Dhabi (AUH)", duration: "7h 45m", note: "Etihad. ✓ Cabin out of UK (under 8 kg). Promo $399 segment through May 2026.", tags: ["uk-out", "dubai"] },
  { from: "Manchester (MAN)", to: "Toronto (YYZ)", duration: "7h 45m", note: "Air Transat. ✓ Cabin out of UK (under 8 kg). Manchester/Glasgow only — not Gatwick.", tags: ["uk-out", "canada"] },

  // ═══════ FROM VANCOUVER ═══════
  { from: "Vancouver (YVR)", to: "Frankfurt (FRA)", duration: "9h 45m", note: "Air Canada. ✓ Cabin (under 10 kg combined). West-coast Canada direct cabin to Europe.", tags: ["canada", "europe"] },
  { from: "Vancouver (YVR)", to: "Toronto (YYZ)", duration: "4h 30m", note: "Air Canada. ✓ Cabin (under 22 lb combined). Connect at YYZ for onward cabin routes.", tags: ["canada"] },
  { from: "Vancouver (YVR)", to: "Los Angeles (LAX)", duration: "2h 45m", note: "Air Canada, Alaska, United. ✓ Cabin. Short Pacific coast hop.", tags: ["canada", "us"] },
  { from: "Vancouver (YVR)", to: "New York (JFK)", duration: "5h 30m", note: "Air Canada / United. ✓ Cabin (under 22 lb AC).", tags: ["canada", "us"] },

  // ═══════ FROM GUADALAJARA ═══════
  { from: "Guadalajara (GDL)", to: "Mexico City (MEX)", duration: "1h", note: "Aeromexico / Volaris. ✓ Cabin within Mexico (under 10 kg). Short domestic hop connecting to international cabin routes.", tags: ["mexico"] },
  { from: "Guadalajara (GDL)", to: "Los Angeles (LAX)", duration: "3h 30m", note: "Aeromexico / Alaska. ✓ Cabin. Guadalajara's main cross-border cabin route to the US.", tags: ["mexico", "us"] },

  // ═══════ FROM MIAMI ═══════
  { from: "Miami (MIA)", to: "Nassau (NAS)", duration: "55m", note: "JetBlue, AA, Delta, Bahamasair. ✓ Cabin (under 20 lb on JetBlue). Shortest US-Caribbean route — Bahamas import permit required (apply 6–8 weeks ahead).", tags: ["us", "caribbean"] },
  { from: "Miami (MIA)", to: "New York (JFK)", duration: "3h 15m", note: "Delta, AA, United, JetBlue. ✓ Cabin all four. Domestic-equivalent route, multiple daily.", tags: ["us"] },
  { from: "Miami (MIA)", to: "Paris (CDG)", duration: "9h 30m", note: "Air France. ✓ Cabin (under 8 kg). Southern US direct cabin to Europe.", tags: ["us", "europe"] },
  { from: "Miami (MIA)", to: "Santo Domingo (SDQ)", duration: "2h 30m", note: "JetBlue, AA, Delta. ✓ Cabin (under 20 lb on JetBlue). NOTE: DR is CDC high-risk — get Certification of US-issued Rabies Vaccination form BEFORE departure for return.", tags: ["us", "caribbean"] },
  { from: "Miami (MIA)", to: "Mexico City (MEX)", duration: "3h 30m", note: "American, Aeromexico. ✓ Cabin. Mexico is an easy cabin destination — vet health certificate + rabies is the core requirement.", tags: ["us", "mexico"] },
  { from: "Miami (MIA)", to: "Cancún (CUN)", duration: "1h 50m", note: "American, Delta, JetBlue. ✓ Cabin. The shortest US → Mexico cabin route.", tags: ["us", "mexico"] },
  { from: "Miami (MIA)", to: "Madrid (MAD)", duration: "8h 45m", note: "Iberia. ✓ Cabin (under 8 kg, €150). Iberia's MIA→MAD route is a solid cabin option for Florida pet owners heading to Spain.", tags: ["us", "europe"] },
  { from: "Miami (MIA)", to: "São Paulo (GRU)", duration: "8h 30m", note: "LATAM cabin (under 7 kg) — note: LATAM has temporarily suspended cabin pet service on US ↔ Brazil routes due to CDC dog rules; check current status when booking. American Airlines: cargo only (PetEmbark) — does NOT accept cabin pets on US-Brazil routes. Florida is the main US gateway to Brazil — multiple daily.", tags: ["us", "south-america"] },
  { from: "Miami (MIA)", to: "Bogotá (BOG)", duration: "3h 30m", note: "Avianca cabin (under 10 kg). LATAM cabin currently suspended US ↔ Colombia (CDC dog rules) — verify status. American Airlines: cargo only (PetEmbark) — does NOT accept cabin pets on US-Colombia routes. NOTE: Pit Bull, American Staffordshire, and Staffordshire Bull Terrier breeds banned from import to Colombia by law.", tags: ["us", "south-america"] },
  { from: "Miami (MIA)", to: "Lima (LIM)", duration: "5h 30m", note: "LATAM cabin (under 7 kg). LATAM cabin currently suspended US ↔ Peru (CDC dog rules) — verify status. American Airlines: cargo only (PetEmbark) — does NOT accept cabin pets on US-Peru routes. Peru requires SENASA import permit — apply 30+ days ahead.", tags: ["us", "south-america"] },
  { from: "Miami (MIA)", to: "Santiago (SCL)", duration: "8h 30m", note: "LATAM cabin (under 7 kg) — Chile is not on the LATAM US suspension list, so cabin is available. American Airlines: cargo only (PetEmbark) — does NOT accept cabin pets on US-Chile routes. Chile's SAG requires advance import authorization, ISO microchip, and rabies vaccine 30+ days old. Strict on paperwork.", tags: ["us", "south-america"] },
  { from: "Miami (MIA)", to: "Buenos Aires (EZE)", duration: "9h", note: "LATAM cabin (under 7 kg) — Argentina is not on the LATAM US suspension list, so cabin is available. American Airlines: cargo only (PetEmbark) — does NOT accept cabin pets on US-Argentina routes. Argentina requires SENASA-endorsed health certificate and ISO microchip.", tags: ["us", "south-america"] },

  // ═══════ FROM NEW YORK (JFK) TO SOUTH AMERICA ═══════
  { from: "New York (JFK)", to: "Bogotá (BOG)", duration: "5h 30m – 7h", note: "Avianca. ✓ Cabin (under 10 kg combined). The cabin pet route to Colombia from the US east coast — Avianca runs direct from JFK, MIA, LAX, IAH, BOS, ORD, MCO. LATAM cabin currently suspended US ↔ Colombia (CDC dog rules). American Airlines: cargo only on US-Colombia routes. Colombia bans Pit Bull, AmStaff, and Staffordshire breeds from import by law.", tags: ["us", "south-america"] },
  { from: "New York (JFK)", to: "Lima (LIM)", duration: "7h 30m", note: "LATAM. ✓ Cabin (under 7 kg) where not suspended. Avianca via Bogotá is the reliable cabin alternative. Peru requires SENASA pre-arranged import permit — apply 30+ days ahead.", tags: ["us", "south-america"] },
  { from: "New York (JFK)", to: "Santiago (SCL)", duration: "11h", note: "LATAM. ✓ Cabin (under 7 kg). Chile is NOT on LATAM's US suspension list — cabin is available. American Airlines: cargo only. Chile's SAG requires advance import authorization, ISO microchip, and rabies vaccine 30+ days old.", tags: ["us", "south-america"] },
  { from: "New York (JFK)", to: "Buenos Aires (EZE)", duration: "10h 30m", note: "LATAM. ✓ Cabin (under 7 kg). Argentina is not on LATAM's US suspension list. American Airlines: cargo only. SENASA-endorsed health certificate and ISO microchip required.", tags: ["us", "south-america"] },

  // ═══════ FROM LOS ANGELES (LAX) TO SOUTH AMERICA ═══════
  { from: "Los Angeles (LAX)", to: "Bogotá (BOG)", duration: "8h", note: "Avianca. ✓ Cabin (under 10 kg combined). The US west coast cabin pet route to Colombia. Pit Bull/AmStaff/Staffordshire breeds banned from import to Colombia.", tags: ["us", "south-america"] },
  { from: "Los Angeles (LAX)", to: "Lima (LIM)", duration: "8h 30m", note: "LATAM. ✓ Cabin (under 7 kg) where not suspended. Avianca via BOG is the cabin alternative. SENASA import permit required for Peru.", tags: ["us", "south-america"] },
  { from: "Los Angeles (LAX)", to: "Santiago (SCL)", duration: "11h", note: "LATAM. ✓ Cabin (under 7 kg). SAG advance authorization required for Chile.", tags: ["us", "south-america"] },

  // ═══════ FROM HOUSTON (IAH) TO SOUTH AMERICA ═══════
  { from: "Houston (IAH)", to: "Bogotá (BOG)", duration: "5h", note: "Avianca. ✓ Cabin (under 10 kg). United also serves this route but cabin pet acceptance varies — verify.", tags: ["us", "south-america"] },

  // ═══════ EUROPE → SOUTH AMERICA cabin routes ═══════
  { from: "London (LHR)", to: "Bogotá (BOG)", duration: "11h 30m", note: "Avianca. ✓ Cabin (under 10 kg combined) OUT of the UK. Pet cabin departures from the UK are fine — only INBOUND to the UK is blocked. Colombia bans Pit Bull/AmStaff breeds by law.", tags: ["uk-out", "south-america"] },
  { from: "London (LHR)", to: "São Paulo (GRU)", duration: "11h 30m", note: "British Airways: cargo only. LATAM cabin (under 7 kg) where operated. Otherwise via Madrid (Iberia) or Frankfurt (Lufthansa) cabin connection.", tags: ["uk-out", "south-america"] },
  { from: "Madrid (MAD)", to: "Lima (LIM)", duration: "12h", note: "Iberia, LATAM. ✓ Cabin (under 7-8 kg). Spanish gateway to Peru.", tags: ["europe", "south-america"] },
  { from: "Madrid (MAD)", to: "Santiago (SCL)", duration: "13h", note: "Iberia, LATAM. ✓ Cabin (under 7-8 kg). Spain ↔ Chile direct cabin.", tags: ["europe", "south-america"] },
  { from: "Madrid (MAD)", to: "Montevideo (MVD)", duration: "13h", note: "Iberia. ✓ Cabin (under 8 kg). The European direct cabin route to Uruguay — Iberia is the only carrier doing this directly.", tags: ["europe", "south-america"] },
  { from: "Frankfurt (FRA)", to: "São Paulo (GRU)", duration: "11h 30m", note: "Lufthansa, LATAM. ✓ Cabin (Lufthansa under 8 kg, LATAM under 7 kg). German gateway to Brazil.", tags: ["europe", "south-america"] },
  { from: "Frankfurt (FRA)", to: "Buenos Aires (EZE)", duration: "13h 30m", note: "Lufthansa. ✓ Cabin (under 8 kg).", tags: ["europe", "south-america"] },
  { from: "Paris (CDG)", to: "São Paulo (GRU)", duration: "11h 30m", note: "Air France. ✓ Cabin (under 8 kg combined). Strong Europe → Brazil cabin route.", tags: ["europe", "south-america"] },
  { from: "Paris (CDG)", to: "Buenos Aires (EZE)", duration: "13h 30m", note: "Air France. ✓ Cabin (under 8 kg). The Paris → Argentina direct cabin route.", tags: ["europe", "south-america"] },
  { from: "Amsterdam (AMS)", to: "Lima (LIM)", duration: "12h 30m", note: "KLM. ✓ Cabin (under 8 kg). Dutch gateway to Peru.", tags: ["europe", "south-america"] },

  // ═══════ MEXICO → SOUTH AMERICA cabin ═══════
  { from: "Mexico City (MEX)", to: "Buenos Aires (EZE)", duration: "10h", note: "Aeromexico. ✓ Cabin (under 9 kg).", tags: ["mexico", "south-america"] },
  { from: "Mexico City (MEX)", to: "Lima (LIM)", duration: "6h", note: "Aeromexico, LATAM. ✓ Cabin (under 7-9 kg).", tags: ["mexico", "south-america"] },

  // ═══════ FROM MONTEGO BAY ═══════
  { from: "Montego Bay (MBJ)", to: "Miami (MIA)", duration: "1h 50m", note: "JetBlue, AA, Delta. ✓ Cabin (under 20 lb on JetBlue). Returning to US: standard CDC Dog Import Form (Jamaica is NOT on CDC high-risk list).", tags: ["caribbean", "us"] },
  { from: "Montego Bay (MBJ)", to: "New York (JFK)", duration: "3h 50m", note: "JetBlue, Delta. ✓ Cabin (under 20 lb).", tags: ["caribbean", "us"] },

  // ═══════ FROM MEXICO CITY ═══════
  { from: "Mexico City (MEX)", to: "Miami (MIA)", duration: "3h 30m", note: "Aeromexico, American. ✓ Cabin (under 10 kg combined). Returning to the US with a dog still needs the CDC Dog Import Form receipt; cats don't.", tags: ["mexico", "us"] },
  { from: "Mexico City (MEX)", to: "Los Angeles (LAX)", duration: "4h", note: "Aeromexico, Delta, American. ✓ Cabin. Popular cabin route — book early, pet space is per-flight limited.", tags: ["mexico", "us"] },
  { from: "Mexico City (MEX)", to: "Toronto (YYZ)", duration: "5h", note: "Air Canada or Aeromexico. ✓ Cabin (Air Canada ≤10 kg combined).", tags: ["mexico", "canada"] },

  // ═══════ FROM CANCUN ═══════
  { from: "Cancún (CUN)", to: "Miami (MIA)", duration: "1h 50m", note: "American, Delta, JetBlue. ✓ Cabin. Short hop — one of the easiest US ↔ Mexico cabin routes.", tags: ["mexico", "us"] },
  { from: "Cancún (CUN)", to: "New York (JFK)", duration: "4h", note: "JetBlue, Delta, American. ✓ Cabin (under 20 lb on JetBlue).", tags: ["mexico", "us"] },

  // ═══════ FROM MONTREAL ═══════
  { from: "Montreal (YUL)", to: "Miami (MIA)", duration: "3h 30m", note: "Air Canada, American, or United. ✓ Cabin all three (22 lb AC / 20 lb US carriers).", tags: ["canada", "us"] },
  { from: "Montreal (YUL)", to: "Paris (CDG)", duration: "7h 15m", note: "Air Canada. ✓ Cabin (under 10 kg combined). Montreal's most popular direct cabin route to Europe — Paris connects onward across the EU.", tags: ["canada", "europe"] },
  { from: "Montreal (YUL)", to: "Frankfurt (FRA)", duration: "7h 45m", note: "Air Canada. ✓ Cabin (under 10 kg combined). Frankfurt is a strong onward hub for the rest of Europe and India.", tags: ["canada", "europe"] },

  // ═══════ FROM NASSAU ═══════
  { from: "Nassau (NAS)", to: "Miami (MIA)", duration: "55m", note: "JetBlue, AA, Delta, Bahamasair. ✓ Cabin. Returning to US: standard CDC Dog Import Form — Bahamas is CDC-rabies-FREE so easy return.", tags: ["caribbean", "us"] },
  { from: "Nassau (NAS)", to: "New York (JFK)", duration: "3h", note: "JetBlue, Delta. ✓ Cabin (under 20 lb).", tags: ["caribbean", "us"] },

  { from: "New York (JFK)", to: "Abu Dhabi (AUH)", duration: "12h 45m", note: "Etihad. ✓ Cabin OUT of the US (under 8 kg) — Etihad's restrictions block 'flights to the USA', not flights out. The cabin route into the UAE; AUH is 90 min from Dubai by road. Confirm your route with Etihad when booking.", tags: ["us", "dubai"] },
  { from: "New York (JFK)", to: "Amsterdam (AMS)", duration: "7h 30m", note: "KLM. ✓ Cabin (under 8 kg). Strong onward hub for India / continental Europe.", tags: ["us", "europe"] },
  { from: "New York (JFK)", to: "Frankfurt (FRA)", duration: "7h 45m", note: "Lufthansa. ✓ Cabin (under 8 kg). Larger carrier allowance than most (55×40×23 cm).", tags: ["us", "europe"] },
  { from: "New York (JFK)", to: "Istanbul (IST)", duration: "10h 30m", note: "Turkish Airlines. ✓ Cabin (under 8 kg). Connect at IST for cabin onward to Europe, India, Africa.", tags: ["us", "europe"] },
  { from: "New York (JFK)", to: "Lisbon (LIS)", duration: "7h 15m", note: "TAP Air Portugal. ✓ Cabin (under 8 kg). Snub-nosed breeds welcome.", tags: ["us", "europe"] },
  { from: "New York (JFK)", to: "Madrid (MAD)", duration: "7h 30m", note: "Iberia. ✓ Cabin (under 8 kg, €150). Direct cabin route to Spain — Iberia's flagship transatlantic. Call to reserve pet space ahead.", tags: ["us", "europe"] },
  { from: "New York (JFK)", to: "Paris (CDG)", duration: "7h 45m", note: "Delta and Air France. ✓ Cabin (under 8 kg). NOT American Airlines (AA bans transatlantic cabin).", tags: ["us", "europe"] },
  { from: "New York (JFK)", to: "Rome (FCO)", duration: "9h", note: "ITA Airways. ✓ Cabin (under 8 kg, €210 fee). Plus EU pet passport hub access.", tags: ["us", "europe"] },
  { from: "New York (JFK)", to: "Warsaw (WAW)", duration: "9h", note: "LOT Polish. ✓ Cabin (under 8 kg, €70 fee). Cheapest long-haul cabin fee on the market.", tags: ["us", "europe"] },
  { from: "New York (JFK)", to: "Zurich (ZRH)", duration: "8h", note: "SWISS. ✓ Cabin (under 8 kg). Snub-nosed breeds OK in cabin.", tags: ["us", "europe"] },
  { from: "New York (JFK)", to: "Barcelona (BCN)", duration: "9h 15m", note: "Level (Iberia group). ✓ Cabin (under 8 kg). Barcelona's own transatlantic cabin option — less known than the Madrid route but worth checking.", tags: ["us", "europe"] },
  { from: "New York (JFK)", to: "Nassau (NAS)", duration: "3h", note: "JetBlue, Delta. ✓ Cabin (under 20 lb on JetBlue). Bahamas import permit required — apply 6–8 weeks ahead. Bahamas is CDC-rabies-FREE so US re-entry is straightforward.", tags: ["us", "caribbean"] },
  { from: "New York (JFK)", to: "Montego Bay (MBJ)", duration: "3h 50m", note: "JetBlue, Delta. ✓ Cabin (under 20 lb on JetBlue). Jamaica has a strict 6+ month import process — start very early. Jamaica is NOT on the CDC high-risk list, so US re-entry is the standard form.", tags: ["us", "caribbean"] },
  { from: "New York (JFK)", to: "Punta Cana (PUJ)", duration: "3h 45m", note: "JetBlue, Delta. ✓ Cabin (under 20 lb on JetBlue). NOTE: DR is CDC high-risk — get the Certification of US-issued Rabies Vaccination form BEFORE leaving the US for the return.", tags: ["us", "caribbean"] },

  // ═══════ FROM PUNTA CANA ═══════
  { from: "Punta Cana (PUJ)", to: "Miami (MIA)", duration: "2h 25m", note: "JetBlue, AA, Delta, Spirit. ✓ Cabin (under 20 lb on JetBlue). NOTE: DR is CDC high-risk — US re-entry needs Certification of US-issued Rabies Vaccination form obtained BEFORE leaving the US.", tags: ["caribbean", "us"] },
  { from: "Punta Cana (PUJ)", to: "New York (JFK)", duration: "3h 45m", note: "JetBlue, Delta. ✓ Cabin (under 20 lb).", tags: ["caribbean", "us"] },

  // ═══════ FROM SANTO DOMINGO ═══════
  { from: "Santo Domingo (SDQ)", to: "Miami (MIA)", duration: "2h 30m", note: "JetBlue, AA, Delta. ✓ Cabin (under 20 lb). DR is CDC high-risk — the Certification of US-issued Rabies Vaccination form must be prepared BEFORE you leave the US. Return trips: originals only.", tags: ["caribbean", "us"] },
  { from: "Santo Domingo (SDQ)", to: "New York (JFK)", duration: "3h 30m", note: "JetBlue, Delta. ✓ Cabin (under 20 lb). Same CDC high-risk rules apply on return.", tags: ["caribbean", "us"] },

  // ═══════ FROM ROME ═══════
  { from: "Rome (FCO)", to: "New York (JFK)", duration: "9h 30m", note: "ITA Airways. ✓ Cabin (under 8 kg, €210). Italy's flagship transatlantic cabin route.", tags: ["us", "europe"] },
  { from: "Rome (FCO)", to: "Milan (MXP)", duration: "1h 15m", note: "ITA Airways. ✓ Cabin domestic Italy (up to 12 kg!). One of EU's most generous cabin pet limits.", tags: ["europe"] },

  // ═══════ FROM TORONTO ═══════
  { from: "Toronto (YYZ)", to: "Chicago (ORD)", duration: "1h 30m", note: "Air Canada or United. ✓ Cabin both. Shortest US Midwest cabin from Canada.", tags: ["canada", "us"] },
  { from: "Toronto (YYZ)", to: "Delhi (DEL)", duration: "14h", note: "Air Canada. ✓ Cabin (under 10 kg combined). India isn't on Air Canada's no-cabin list — but you'll need India's AQCS NOC for the import side. One of the very few direct cabin options Canada ↔ India. Confirm with Air Canada when booking.", tags: ["canada", "india"] },
  { from: "Toronto (YYZ)", to: "Frankfurt (FRA)", duration: "8h 15m", note: "Air Canada. ✓ Cabin (under 10 kg combined). Frankfurt is a strong onward cabin hub for the rest of Europe and India.", tags: ["canada", "europe"] },
  { from: "Toronto (YYZ)", to: "Los Angeles (LAX)", duration: "5h 15m", note: "Air Canada. ✓ Cabin (under 22 lb combined). West coast direct.", tags: ["canada", "us"] },
  { from: "Toronto (YYZ)", to: "Miami (MIA)", duration: "3h 22m", note: "Air Canada or American. ✓ Cabin both. Popular cabin route for Canadians wintering in Florida.", tags: ["canada", "us"] },
  { from: "Toronto (YYZ)", to: "Montreal (YUL)", duration: "1h 30m", note: "Air Canada. ✓ Cabin (under 22 lb combined).", tags: ["canada"] },
  { from: "Toronto (YYZ)", to: "New York (JFK)", duration: "1h 45m", note: "Air Canada, Delta, United, American. ✓ Cabin all four. Shortest US cabin from Canada.", tags: ["canada", "us"] },
  { from: "Toronto (YYZ)", to: "Paris (CDG)", duration: "7h 30m", note: "Air Canada. ✓ Cabin (under 10 kg combined). Direct cabin Canada → Europe — Paris connects onward cabin-friendly across the EU.", tags: ["canada", "europe"] },
  { from: "Toronto (YYZ)", to: "Madrid (MAD)", duration: "8h 30m", note: "Air Canada / Iberia. ✓ Cabin. Toronto→Spain cabin option.", tags: ["canada", "europe"] },

  // ═══════ FROM SÃO PAULO ═══════
  { from: "São Paulo (GRU)", to: "Miami (MIA)", duration: "8h 30m", note: "LATAM cabin (under 7 kg) — note: cabin pet service on this route currently suspended due to CDC dog rules; verify status before booking. American Airlines: cargo only (PetEmbark). Brazil's main US gateway — daily.", tags: ["south-america", "us"] },
  { from: "São Paulo (GRU)", to: "New York (JFK)", duration: "10h", note: "LATAM. ✓ Cabin (under 7 kg, ~USD 200). Direct overnight.", tags: ["south-america", "us"] },
  { from: "São Paulo (GRU)", to: "Madrid (MAD)", duration: "10h 30m", note: "Iberia, LATAM. ✓ Cabin. The main South America → Europe cabin route. Onward to most of Europe.", tags: ["south-america", "europe"] },
  { from: "São Paulo (GRU)", to: "Paris (CDG)", duration: "11h 30m", note: "Air France, LATAM. ✓ Cabin. Onward to all of Europe.", tags: ["south-america", "europe"] },
  { from: "São Paulo (GRU)", to: "Buenos Aires (EZE)", duration: "3h", note: "LATAM, Aerolineas Argentinas, GOL. ✓ Cabin (LATAM under 7 kg). The main intra-South-America cabin pet hop.", tags: ["south-america"] },
  { from: "São Paulo (GRU)", to: "Santiago (SCL)", duration: "4h 30m", note: "LATAM. ✓ Cabin. Brazil ↔ Chile is the South America cabin pet workhorse.", tags: ["south-america"] },
  { from: "São Paulo (GRU)", to: "Lisbon (LIS)", duration: "10h", note: "TAP Portugal, LATAM. ✓ Cabin. Brazil-Portugal cultural/migration corridor — busy cabin route.", tags: ["south-america", "europe"] },

  // ═══════ FROM BUENOS AIRES ═══════
  { from: "Buenos Aires (EZE)", to: "Miami (MIA)", duration: "9h", note: "LATAM cabin (under 7 kg). American Airlines: cargo only — does NOT accept cabin pets on US-Argentina routes. Direct US east coast.", tags: ["south-america", "us"] },
  { from: "Buenos Aires (EZE)", to: "São Paulo (GRU)", duration: "3h", note: "LATAM, Aerolineas Argentinas, GOL. ✓ Cabin. Short Mercosur hop.", tags: ["south-america"] },
  { from: "Buenos Aires (EZE)", to: "Santiago (SCL)", duration: "2h", note: "LATAM, JetSmart, Sky. ✓ Cabin (LATAM under 7 kg). Trans-Andes hop, busiest South America route.", tags: ["south-america"] },
  { from: "Buenos Aires (EZE)", to: "Madrid (MAD)", duration: "12h", note: "Iberia, LATAM, Aerolineas Argentinas. ✓ Cabin. The Argentina-Spain cabin link.", tags: ["south-america", "europe"] },

  // ═══════ FROM SANTIAGO ═══════
  { from: "Santiago (SCL)", to: "São Paulo (GRU)", duration: "4h 30m", note: "LATAM. ✓ Cabin (under 7 kg). LATAM's home base.", tags: ["south-america"] },
  { from: "Santiago (SCL)", to: "Buenos Aires (EZE)", duration: "2h", note: "LATAM, JetSmart, Sky. ✓ Cabin.", tags: ["south-america"] },
  { from: "Santiago (SCL)", to: "Miami (MIA)", duration: "8h 30m", note: "LATAM cabin (under 7 kg). American Airlines: cargo only — does NOT accept cabin pets on US-Chile routes. Chile's main US route.", tags: ["south-america", "us"] },
  { from: "Santiago (SCL)", to: "Madrid (MAD)", duration: "13h", note: "Iberia, LATAM. ✓ Cabin. Direct LATAM-operated long-haul cabin pet route.", tags: ["south-america", "europe"] },
  { from: "Santiago (SCL)", to: "Lima (LIM)", duration: "3h 30m", note: "LATAM, Sky. ✓ Cabin.", tags: ["south-america"] },

  // ═══════ FROM BOGOTÁ ═══════
  { from: "Bogotá (BOG)", to: "Miami (MIA)", duration: "3h 30m", note: "Avianca cabin (under 10 kg). LATAM cabin currently suspended US ↔ Colombia (CDC dog rules) — verify status. American Airlines: cargo only — does NOT accept cabin pets on US-Colombia routes. NOTE: dog breeds prohibited from import to Colombia (Pit Bull / AmStaff / Staffordshire) also affect Colombia-resident dogs of these breeds returning home.", tags: ["south-america", "us"] },
  { from: "Bogotá (BOG)", to: "Madrid (MAD)", duration: "10h", note: "Avianca, Iberia. ✓ Cabin. Colombia-Spain cabin route — Avianca's main long-haul.", tags: ["south-america", "europe"] },
  { from: "Bogotá (BOG)", to: "Mexico City (MEX)", duration: "4h 30m", note: "Avianca, Aeromexico. ✓ Cabin (both under 10 kg).", tags: ["south-america", "mexico"] },
  { from: "Bogotá (BOG)", to: "Lima (LIM)", duration: "3h", note: "Avianca, LATAM. ✓ Cabin.", tags: ["south-america"] },

  // ═══════ FROM LIMA ═══════
  { from: "Lima (LIM)", to: "Miami (MIA)", duration: "5h 30m", note: "LATAM cabin (under 7 kg) — note: cabin suspension on US ↔ Peru may apply; verify. American Airlines: cargo only — does NOT accept cabin pets on US-Peru routes.", tags: ["south-america", "us"] },
  { from: "Lima (LIM)", to: "Bogotá (BOG)", duration: "3h", note: "Avianca, LATAM. ✓ Cabin.", tags: ["south-america"] },
  { from: "Lima (LIM)", to: "Madrid (MAD)", duration: "11h 30m", note: "Iberia, LATAM. ✓ Cabin. Peru-Spain direct.", tags: ["south-america", "europe"] },
  { from: "Lima (LIM)", to: "Santiago (SCL)", duration: "3h 30m", note: "LATAM, Sky. ✓ Cabin.", tags: ["south-america"] },

  // ═══════ TO SOUTH AMERICA from elsewhere ═══════
  { from: "Mexico City (MEX)", to: "Bogotá (BOG)", duration: "4h 30m", note: "Aeromexico, Avianca. ✓ Cabin. Mexico ↔ Colombia cabin hop.", tags: ["mexico", "south-america"] },
  { from: "Mexico City (MEX)", to: "São Paulo (GRU)", duration: "9h 30m", note: "Aeromexico, LATAM. ✓ Cabin. Mexico ↔ Brazil cabin direct.", tags: ["mexico", "south-america"] },
  { from: "Madrid (MAD)", to: "Buenos Aires (EZE)", duration: "12h", note: "Iberia, LATAM, Aerolineas Argentinas. ✓ Cabin. Reverse of EZE→MAD — Spain is Latin America's main European gateway.", tags: ["europe", "south-america"] },
  { from: "Madrid (MAD)", to: "São Paulo (GRU)", duration: "10h 30m", note: "Iberia, LATAM. ✓ Cabin.", tags: ["europe", "south-america"] },
  { from: "Madrid (MAD)", to: "Bogotá (BOG)", duration: "10h", note: "Iberia, Avianca. ✓ Cabin.", tags: ["europe", "south-america"] },
  { from: "New York (JFK)", to: "São Paulo (GRU)", duration: "10h", note: "LATAM. ✓ Cabin (under 7 kg).", tags: ["us", "south-america"] },

  // ═══════ COPA AIRLINES VIA PANAMA — deeper South America cabin routes ═══════
  { from: "Miami (MIA)", to: "Panama City (PTY)", duration: "2h 50m", note: "Copa Airlines. ✓ Cabin (under 10 kg, $125 international). Copa's main US gateway — best onward connections to deeper South America (Uruguay, Paraguay, Bolivia, Ecuador).", tags: ["us", "central-america"] },
  { from: "New York (JFK)", to: "Panama City (PTY)", duration: "5h 30m", note: "Copa Airlines. ✓ Cabin (under 10 kg). Strong NYC → deeper South America hub via Panama.", tags: ["us", "central-america"] },
  { from: "Los Angeles (LAX)", to: "Panama City (PTY)", duration: "7h", note: "Copa Airlines. ✓ Cabin. West Coast → deeper South America via Panama.", tags: ["us", "central-america"] },
  { from: "Panama City (PTY)", to: "Montevideo (MVD)", duration: "7h 30m", note: "Copa Airlines. ✓ Cabin (under 10 kg). One of the few cabin pet routes to Uruguay. Total US→MVD via PTY is realistic in cabin (Copa-only itinerary required, no codeshares).", tags: ["central-america", "south-america"] },
  { from: "Panama City (PTY)", to: "Buenos Aires (EZE)", duration: "7h", note: "Copa Airlines. ✓ Cabin. Alternative to LATAM direct via PTY hub.", tags: ["central-america", "south-america"] },
  { from: "Panama City (PTY)", to: "Santiago (SCL)", duration: "7h 30m", note: "Copa Airlines. ✓ Cabin. Alternative to LATAM direct.", tags: ["central-america", "south-america"] },
  { from: "Panama City (PTY)", to: "São Paulo (GRU)", duration: "7h", note: "Copa Airlines. ✓ Cabin (under 10 kg). Useful if LATAM cabin US-Brazil suspension is still active.", tags: ["central-america", "south-america"] },
  { from: "Panama City (PTY)", to: "Lima (LIM)", duration: "3h 30m", note: "Copa Airlines. ✓ Cabin.", tags: ["central-america", "south-america"] },
  { from: "Panama City (PTY)", to: "Bogotá (BOG)", duration: "1h 30m", note: "Copa Airlines. ✓ Cabin. Short hop — Copa or Avianca both work.", tags: ["central-america", "south-america"] },
  // ═══════ MONTEVIDEO connections ═══════
  { from: "Bogotá (BOG)", to: "Montevideo (MVD)", duration: "6h 30m", note: "Avianca. ✓ Cabin (under 10 kg). The Avianca cabin pet route to Uruguay — useful if you're routing via Colombia.", tags: ["south-america"] },
  { from: "São Paulo (GRU)", to: "Montevideo (MVD)", duration: "2h 30m", note: "LATAM. ✓ Cabin (under 7 kg). Short Brazil ↔ Uruguay hop.", tags: ["south-america"] },
  { from: "Buenos Aires (EZE)", to: "Montevideo (MVD)", duration: "1h", note: "LATAM, Aerolineas Argentinas. ✓ Cabin. The shortest cabin pet flight to Uruguay — Buenos Aires sits just across the Rio de la Plata.", tags: ["south-america"] },
  { from: "Montevideo (MVD)", to: "Bogotá (BOG)", duration: "6h 30m", note: "Avianca. ✓ Cabin (under 10 kg). Reverse of BOG→MVD.", tags: ["south-america"] },
  { from: "Montevideo (MVD)", to: "Panama City (PTY)", duration: "7h 30m", note: "Copa Airlines. ✓ Cabin (under 10 kg). Reverse of PTY→MVD.", tags: ["south-america", "central-america"] },
  { from: "Montevideo (MVD)", to: "Buenos Aires (EZE)", duration: "1h", note: "LATAM, Aerolineas Argentinas. ✓ Cabin. Short cross-river hop.", tags: ["south-america"] },
];

const WORKAROUND_ROUTES_TABLE = [
  // UK → USA via Europe (cabin all the way)
  {
    from: "London (LHR)",
    to: "New York (JFK)",
    duration: "~12h total",
    legs: [
      { route: "LHR → Paris CDG", time: "1h 20m", airline: "Air France ✓ Cabin" },
      { route: "Layover at CDG", time: "2–3h", airline: "Recommended buffer for pet handover" },
      { route: "Paris CDG → New York JFK", time: "7h 45m", airline: "Air France or Delta ✓ Cabin" },
    ],
    note: "The cabin workaround for the no-direct-cabin UK→USA wall. Same-day connection works for an under-8 kg pet, but a longer layover (or overnight in Paris) is gentler for both of you.",
    tags: ["uk-out", "us", "europe"],
  },
  {
    from: "London (LHR)",
    to: "Miami (MIA)",
    duration: "~24h with overnight",
    legs: [
      { route: "LHR → Montreal YUL", time: "7h 30m", airline: "Air Canada ✓ Cabin" },
      { route: "Overnight in Montreal", time: "12+ hours", airline: "Dog-friendly hotel — strongly recommended" },
      { route: "Montreal YUL → Miami MIA", time: "3h 30m", airline: "American Airlines ✓ Cabin" },
    ],
    note: "Theo's Mum's actual route — Air Canada out of Heathrow, then American Airlines on the Montreal–Miami leg. The overnight in Montreal is what made it work — the pet recovers, you recover, then the short hop to Miami the next morning is easy. (On the Montreal–Miami leg, Air Canada and United also carry cabin pets if you'd rather stay on one carrier.)",
    tags: ["uk-out", "us", "canada"],
  },

  // India → USA via Europe (cabin both legs)
  {
    from: "Delhi (DEL)",
    to: "Los Angeles (LAX)",
    duration: "20–22h total",
    legs: [
      { route: "DEL → Frankfurt FRA", time: "8h 30m", airline: "Lufthansa ✓ Cabin" },
      { route: "Layover at FRA", time: "2–3h", airline: "Frankfurt Animal Lounge available" },
      { route: "Frankfurt FRA → Los Angeles LAX", time: "12h", airline: "Lufthansa ✓ Cabin" },
    ],
    note: "Long total time — for an under-8 kg pet, a brief overnight in Frankfurt is genuinely kinder than 20+ hours in transit. Lufthansa's Animal Lounge at FRA is the world's most advanced.",
    tags: ["india", "us", "europe"],
  },
  {
    from: "Mumbai (BOM)",
    to: "New York (JFK)",
    duration: "18–20h total",
    legs: [
      { route: "BOM → Amsterdam AMS", time: "9h 15m", airline: "KLM ✓ Cabin" },
      { route: "Layover at AMS", time: "2–3h", airline: "Recommended buffer" },
      { route: "Amsterdam AMS → New York JFK", time: "8h", airline: "KLM ✓ Cabin" },
    ],
    note: "Max 8 kg combined. KLM's Amsterdam hub is well-organised for pet connections. Consider an Amsterdam overnight if your pet doesn't travel well.",
    tags: ["india", "us", "europe"],
  },
  {
    from: "Delhi (DEL)",
    to: "Chicago (ORD)",
    duration: "19–21h total",
    legs: [
      { route: "DEL → Warsaw WAW", time: "8h", airline: "LOT Polish ✓ Cabin (€50)" },
      { route: "Layover at WAW", time: "2–3h", airline: "Recommended buffer" },
      { route: "Warsaw WAW → Chicago ORD", time: "10h", airline: "LOT Polish ✓ Cabin (€70)" },
    ],
    note: "Cheapest cabin route from India to USA at €120 total in pet fees. Both legs under 8 kg combined.",
    tags: ["india", "us", "europe"],
  },
  {
    from: "Mumbai (BOM)",
    to: "USA via Zurich",
    duration: "18–20h total",
    legs: [
      { route: "BOM → Zurich ZRH", time: "8h 30m", airline: "SWISS ✓ Cabin" },
      { route: "Layover at ZRH", time: "2–3h", airline: "Recommended buffer" },
      { route: "ZRH → USA (JFK/LAX/MIA/ORD)", time: "8–13h", airline: "SWISS ✓ Cabin" },
    ],
    note: "SWISS uniquely allows snub-nosed (brachycephalic) breeds in cabin where most airlines force them to cargo. Worth considering if you have a French Bulldog, Pug, etc.",
    tags: ["india", "us", "europe"],
  },
  // USA → UK workaround (UK only allows entry via Eurotunnel/ferry, never cabin)
  {
    from: "USA (major airports)",
    to: "London / UK",
    duration: "~14h total (incl. ground)",
    legs: [
      { route: "JFK / BOS / ORD / MIA / LAX → Paris CDG", time: "7–11h", airline: "Air France or Delta ✓ Cabin" },
      { route: "CDG → Calais (drive/taxi)", time: "2h 30m", airline: "Pet stays with you" },
      { route: "Eurotunnel Le Shuttle, or DFDS / P&O ferry — both Calais → UK", time: "35m–1h 30m", airline: "Pet stays in car" },
      { route: "Folkestone / Dover → London (drive)", time: "1h 30m", airline: "Pet stays with you" },
    ],
    note: "There's no cabin pet flight INTO the UK from anywhere (UK government rule, all airlines). The standard workaround: fly cabin to Paris, then drive to Calais and cross the Channel. Two approved crossings run Calais → UK — the Eurotunnel Le Shuttle (35 min, pet stays in your car, ~£22 per pet) or a DFDS/P&O ferry to Dover (~1h 30m, pet stays in the car or, on P&O, a bookable Pet Lounge; ~£15 per pet). Both are UK-government-approved pet routes — pick whichever suits. Works from any major US gateway with cabin pets to Paris (JFK, BOS, ORD, MIA, LAX).",
    tags: ["us", "uk-out", "europe"],
  },
  {
    from: "Paris (CDG)",
    to: "London / UK",
    duration: "4–5h total",
    legs: [
      { route: "CDG → Calais (drive/taxi)", time: "2h 30m", airline: "Pet stays with you" },
      { route: "Eurotunnel Le Shuttle, or DFDS / P&O ferry — both Calais → UK", time: "35m–1h 30m", airline: "Pet stays in car" },
      { route: "Folkestone / Dover → London (drive)", time: "1h 30m", airline: "Pet stays with you" },
    ],
    note: "If you're already in Europe (Paris, Amsterdam, Brussels) crossing the Channel by land is by far the easiest way to bring your pet INTO the UK. From Calais you have two UK-government-approved crossings: the Eurotunnel Le Shuttle (35 min, ~£22 per pet) or a DFDS/P&O ferry to Dover (~1h 30m, ~£15 per pet). Pet stays in the car either way. The same workflow applies departing from AMS or BRU (just a longer drive to Calais).",
    tags: ["europe", "uk-out"],
  },
  // USA → UK via Amsterdam (KLM hub + direct Amsterdam–Newcastle ferry — no
  // drive through France needed; the pet travels with you the whole way).
  {
    from: "USA (major airports)",
    to: "Newcastle / UK (via Amsterdam)",
    duration: "~24h total (incl. overnight ferry)",
    legs: [
      { route: "JFK / BOS / ORD / IAD / MIA → Amsterdam AMS", time: "7–9h", airline: "KLM or Delta ✓ Cabin" },
      { route: "Drive: Amsterdam Schiphol → DFDS ferry terminal, IJmuiden", time: "25m", airline: "Taxi — pet stays with you" },
      { route: "Ferry: DFDS overnight, Amsterdam → Newcastle", time: "~17h", airline: "Pet in a pet-friendly cabin or onboard kennel" },
      { route: "Drive or train: Newcastle → onward UK", time: "varies", airline: "Pet stays with you" },
    ],
    note: "An alternative to the Paris route, and a documented way US owners move pets to the UK in cabin. Fly cabin to Amsterdam on KLM (or Delta), then take the DFDS overnight ferry from Amsterdam (IJmuiden) directly to Newcastle — a UK-government-approved pet route. The big advantage: no drive through Belgium and France, and DFDS takes foot passengers with pets, so you don't need a car. Book a pet-friendly cabin so your dog is with you (~£19+ per pet; cabins limited — book early). It lands you in the north of England, so it suits Scotland or northern England better than London. Dogs still need the tapeworm treatment 24–120h before arrival.",
    tags: ["us", "uk-out", "europe"],
  },
  // USA → UAE (no direct cabin to UAE — go via Europe to Abu Dhabi)
  {
    from: "New York (JFK)",
    to: "Abu Dhabi (AUH)",
    duration: "20–22h total",
    legs: [
      { route: "JFK → Paris CDG", time: "7h 45m", airline: "Air France ✓ Cabin" },
      { route: "Layover at CDG", time: "3–4h", airline: "Recommended buffer for pet handover" },
      { route: "Paris CDG → Abu Dhabi AUH", time: "6h 45m", airline: "Etihad ✓ Cabin ($399 promo through May 2026)" },
    ],
    note: "No direct US ↔ UAE cabin flight exists on any airline. The cabin route uses Paris (or Frankfurt/Amsterdam/Zurich) as the pivot, then Etihad onward to Abu Dhabi. Abu Dhabi is 90 min from Dubai by road.",
    tags: ["us", "dubai", "europe"],
  },
  {
    from: "New York (JFK)",
    to: "Dubai (DXB)",
    duration: "~22h total + 90min drive",
    legs: [
      { route: "JFK → Paris CDG", time: "7h 45m", airline: "Air France ✓ Cabin" },
      { route: "Layover at CDG", time: "3–4h", airline: "Recommended buffer" },
      { route: "CDG → AUH (Abu Dhabi)", time: "6h 45m", airline: "Etihad ✓ Cabin" },
      { route: "AUH → Dubai (taxi)", time: "~90 min", airline: "AED 250 taxi, pet with you" },
    ],
    note: "Cabin entry into Dubai (DXB) is impossible on any airline (UAE law). The workaround is to fly cabin into Abu Dhabi (AUH) instead, then road transfer 90 min to Dubai. This is the only way to land in the UAE with your pet in cabin.",
    tags: ["us", "dubai", "europe"],
  },
  // UK → Dubai workaround
  {
    from: "London (LHR)",
    to: "Dubai (DXB)",
    duration: "~9h total + 90min drive",
    legs: [
      { route: "LHR → Abu Dhabi AUH", time: "7h 30m", airline: "Etihad ✓ Cabin ($399 promo through May 2026)" },
      { route: "AUH → Dubai (taxi)", time: "~90 min", airline: "AED 250 taxi, pet with you" },
    ],
    note: "Etihad is the only airline that allows cabin pets INTO the UAE — and only into Abu Dhabi (AUH), not Dubai. From AUH it's a 90-minute drive to Dubai. The neat thing about this route: you fly direct from Heathrow with your pet in cabin and skip a stopover entirely. Manchester also works (same Etihad cabin policy).",
    tags: ["uk-out", "dubai"],
  },
  // India → Dubai workaround
  {
    from: "Delhi / Mumbai",
    to: "Dubai (DXB)",
    duration: "~5h total + 90min drive",
    legs: [
      { route: "DEL/BOM → Abu Dhabi AUH", time: "3h 30m", airline: "Etihad ✓ Cabin ($399 promo through May 2026)" },
      { route: "AUH → Dubai (taxi)", time: "~90 min", airline: "AED 250 taxi, pet with you" },
    ],
    note: "No airline allows cabin pets INTO Dubai (DXB) — UAE law. The workaround: fly cabin into Abu Dhabi on Etihad (cabin from Delhi, Mumbai, Bangalore, and Chennai all permitted), then 90-minute road transfer to Dubai. Etihad cabin from Indian airports outside those four is NOT permitted (Ahmedabad, Jaipur, Kochi excluded).",
    tags: ["india", "dubai"],
  },
  // USA → India workaround
  {
    from: "Los Angeles (LAX)",
    to: "Delhi (DEL)",
    duration: "22–24h total",
    legs: [
      { route: "LAX → Frankfurt FRA", time: "11h", airline: "Lufthansa ✓ Cabin" },
      { route: "Layover at FRA", time: "2–3h", airline: "Frankfurt Animal Lounge available" },
      { route: "Frankfurt FRA → Delhi DEL", time: "8h", airline: "Lufthansa ✓ Cabin" },
    ],
    note: "Long total time — a brief overnight in Frankfurt is genuinely kinder than 22+ hours in transit for an under-8 kg pet. Could also route via Paris (Air France), Amsterdam (KLM), Zurich (SWISS), or Warsaw (LOT).",
    tags: ["us", "india", "europe"],
  },
  {
    from: "New York (JFK)",
    to: "Mumbai (BOM)",
    duration: "18–20h total",
    legs: [
      { route: "JFK → Amsterdam AMS", time: "7h 30m", airline: "KLM ✓ Cabin" },
      { route: "Layover at AMS", time: "2–3h", airline: "Recommended buffer" },
      { route: "Amsterdam AMS → Mumbai BOM", time: "8h 30m", airline: "KLM ✓ Cabin" },
    ],
    note: "Max 8 kg combined on both legs. KLM's Amsterdam hub is well-organised for pet connections.",
    tags: ["us", "india", "europe"],
  },
  // Caribbean → UK workaround (no cabin into UK from anywhere)
  {
    from: "Nassau / Punta Cana / Montego Bay",
    to: "London / UK",
    duration: "~14h total",
    legs: [
      { route: "Caribbean → Miami (MIA) or JFK", time: "1–4h", airline: "JetBlue, AA, Delta ✓ Cabin" },
      { route: "Layover at MIA or JFK", time: "2–4h", airline: "Recommended buffer" },
      { route: "MIA/JFK → Paris CDG", time: "7h 45m", airline: "Air France ✓ Cabin" },
      { route: "CDG → Calais (drive/taxi)", time: "2h 30m", airline: "Pet stays with you" },
      { route: "Eurotunnel Le Shuttle, or DFDS / P&O ferry — Calais → UK, then drive to London", time: "2h–3h", airline: "Pet in car" },
    ],
    note: "There's no cabin pet flight INTO the UK from anywhere. From the Caribbean: route via the US (Miami or JFK), then transatlantic cabin to Paris, then cross the Channel. From Calais you can use either the Eurotunnel Le Shuttle (35 min, ~£22 per pet) or a DFDS/P&O ferry to Dover (~1h 30m, ~£15 per pet) — both are UK-government-approved pet routes, pet stays in the car. Long but workable. For Bahamas + Jamaica (CDC NOT high-risk), no extra US re-entry paperwork. For Dominican Republic (CDC high-risk), the Certification of US-issued Rabies Vaccination form must have been obtained BEFORE you left the US originally.",
    tags: ["caribbean", "uk-out", "us", "europe"],
  },
  // Caribbean → Europe workaround
  {
    from: "Nassau / Punta Cana",
    to: "Europe (Paris / Frankfurt / Amsterdam)",
    duration: "~12h total",
    legs: [
      { route: "Caribbean → Miami (MIA) or JFK", time: "1–4h", airline: "JetBlue, AA, Delta ✓ Cabin" },
      { route: "Layover at MIA or JFK", time: "2–4h", airline: "Recommended buffer" },
      { route: "MIA/JFK → Paris/Frankfurt/Amsterdam", time: "7h 30m – 9h 30m", airline: "Air France, Lufthansa, KLM ✓ Cabin" },
    ],
    note: "No direct cabin Caribbean → Europe — you must route via the US. From Miami the transatlantic cabin options are Paris (Air France) and Frankfurt (Lufthansa). From JFK you have Paris, Amsterdam (KLM), Frankfurt, Zurich (SWISS), Rome (ITA), Warsaw (LOT). All accept cabin pets under 8 kg.",
    tags: ["caribbean", "europe", "us"],
  },
  // Canada → UK workaround (no cabin into UK from anywhere)
  {
    from: "Toronto / Montreal / Vancouver",
    to: "London / UK",
    duration: "~12h total",
    legs: [
      { route: "Canada → Paris CDG (or Frankfurt)", time: "7h 15m – 9h 45m", airline: "Air Canada ✓ Cabin (under 10 kg)" },
      { route: "CDG → Calais (drive/taxi)", time: "2h 30m", airline: "Pet stays with you" },
      { route: "Eurotunnel Le Shuttle, or DFDS / P&O ferry — both Calais → UK", time: "35m–1h 30m", airline: "Pet stays in car" },
      { route: "Folkestone / Dover → London (drive)", time: "1h 30m", airline: "Pet stays with you" },
    ],
    note: "Air Canada does NOT allow cabin pets on flights to the UK (UK is on their no-cabin list, like the UK government rule for all airlines). The workaround: fly cabin Canada → Paris on Air Canada, then cross the Channel. From Calais, two UK-government-approved crossings — the Eurotunnel Le Shuttle (35 min, ~£22 per pet) or a DFDS/P&O ferry to Dover (~1h 30m, ~£15 per pet). Pet stays with you from Paris onward, in the car for the crossing.",
    tags: ["canada", "uk-out", "europe"],
  },
  // Canada → UAE workaround
  {
    from: "Toronto / Montreal",
    to: "Abu Dhabi / Dubai (UAE)",
    duration: "~16h total",
    legs: [
      { route: "Canada → Paris CDG or Frankfurt", time: "7h 15m – 8h 15m", airline: "Air Canada ✓ Cabin (under 10 kg)" },
      { route: "Layover at CDG / FRA", time: "2–4h", airline: "Recommended buffer" },
      { route: "Paris/Frankfurt → Abu Dhabi (AUH)", time: "6h 30m – 7h 30m", airline: "Etihad ✓ Cabin (under 8 kg)" },
      { route: "AUH → Dubai (if needed)", time: "90 min", airline: "Taxi — pet stays with you" },
    ],
    note: "Air Canada doesn't fly cabin pets to the UAE directly. Route via a European hub: Air Canada cabin to Paris or Frankfurt, then Etihad cabin onward to Abu Dhabi. Note the carrier weight DROPS from Air Canada's 10 kg to Etihad's 8 kg limit — your pet + carrier must meet the stricter 8 kg for the whole journey. Abu Dhabi is the only cabin entry to the UAE; Dubai (DXB) is cargo-only for all airlines.",
    tags: ["canada", "dubai", "europe"],
  },
  // Canada → India direct note (Air Canada flies it cabin)
  {
    from: "Toronto (YYZ)",
    to: "Delhi / Mumbai (India)",
    duration: "14h direct",
    legs: [
      { route: "Toronto → Delhi", time: "14h", airline: "Air Canada ✓ Cabin (under 10 kg) — direct" },
    ],
    note: "This one is actually a DIRECT cabin route, not a workaround — Air Canada flies Toronto → Delhi and India isn't on their no-cabin list. Included here as a reminder: you still need India's AQCS No Objection Certificate for the import side, and entry is only via Delhi, Mumbai, Chennai, Kolkata, Bengaluru or Hyderabad. From Montreal/Vancouver, connect via Toronto. Always confirm cabin space with Air Canada when booking.",
    tags: ["canada", "india"],
  },
  // UK → India (no direct cabin — Air India is cargo-only for the UK)
  {
    from: "London (LHR)",
    to: "Delhi / Mumbai (India)",
    duration: "~16h+ with layover",
    legs: [
      { route: "LHR → Frankfurt FRA (or Paris CDG)", time: "1h 30m", airline: "Lufthansa / Air France ✓ Cabin (out of UK)" },
      { route: "Layover at the European hub", time: "3h+ (overnight gentler)", airline: "Recommended buffer for pet handover" },
      { route: "FRA/CDG → Delhi or Mumbai", time: "8–9h", airline: "Confirm cabin pet acceptance with the operating airline before booking" },
    ],
    note: "Air India's own policy confirms pets are CARGO-ONLY to and from the UK — there is no direct UK↔India cabin route. Flying cabin OUT of the UK to a European hub is allowed, and from Europe you continue toward India. The second leg's cabin availability varies by airline and aircraft, so confirm it directly before you book — and remember the India side still needs the AQCS NOC and entry via one of the six approved airports. If a fully-cabin second leg can't be confirmed, this becomes a cargo move for the long-haul portion.",
    tags: ["uk-out", "india", "europe"],
  },
  // India → UK (reverse — cabin into the UK is never allowed)
  {
    from: "Delhi / Mumbai (India)",
    to: "London / UK",
    duration: "~16h+ with layover",
    legs: [
      { route: "Delhi/Mumbai → Frankfurt FRA (or Paris CDG)", time: "8–9h", airline: "Confirm cabin pet acceptance with the operating airline" },
      { route: "Layover at the European hub", time: "3h+ (overnight gentler)", airline: "Recommended buffer" },
      { route: "FRA/CDG → Calais, then Eurotunnel or DFDS/P&O ferry → UK", time: "5–6h", airline: "Pet stays with you — car + crossing" },
    ],
    note: "Two walls here: Air India is cargo-only for the UK, AND no airline flies cabin pets INTO the UK from anywhere (UK government rule). So the route is India → continental Europe, then a land/sea crossing into the UK. From Calais you can use the Eurotunnel Le Shuttle or a DFDS/P&O ferry to Dover — both UK-government-approved pet routes that keep your pet with you. Confirm the India→Europe leg's cabin availability before booking; if it can't be confirmed as cabin, the long-haul portion becomes cargo.",
    tags: ["india", "uk-out", "europe"],
  },
  // UAE → UK (outbound from UAE; cabin into UK never allowed)
  {
    from: "Abu Dhabi (AUH)",
    to: "London / UK",
    duration: "~12h+ with layover",
    legs: [
      { route: "Abu Dhabi → European hub (Paris / Frankfurt / Amsterdam)", time: "7–8h", airline: "Etihad ✓ Cabin (under 8 kg) out of AUH" },
      { route: "Layover at the European hub", time: "3h+ (overnight gentler)", airline: "Recommended buffer" },
      { route: "Hub → Calais, then Eurotunnel or DFDS/P&O ferry → UK", time: "5–6h", airline: "Pet stays with you — car + crossing" },
    ],
    note: "Etihad accepts cabin pets OUT of Abu Dhabi to Europe (under 8 kg). From a European hub, a land/sea crossing brings your pet into the UK with you — the Eurotunnel Le Shuttle or a DFDS/P&O ferry from Calais, both UK-government-approved pet routes — since no airline flies cabin pets into the UK directly. Start the journey at Abu Dhabi (AUH), not Dubai (DXB), which is cargo-only for all airlines.",
    tags: ["dubai", "uk-out", "europe"],
  },
  // UAE → USA (outbound from UAE)
  {
    from: "Abu Dhabi (AUH)",
    to: "New York / US East Coast",
    duration: "~16h+ with layover",
    legs: [
      { route: "Abu Dhabi → European hub (Paris / Frankfurt / Amsterdam)", time: "7–8h", airline: "Etihad ✓ Cabin (under 8 kg) out of AUH" },
      { route: "Layover at the European hub", time: "3h+ (overnight gentler)", airline: "Recommended buffer" },
      { route: "Hub → New York / Boston / Chicago", time: "8–9h", airline: "Air France / Lufthansa / KLM ✓ Cabin (under 8 kg)" },
    ],
    note: "Etihad's restrictions block cabin pets on 'flights to the USA' — inbound to the US — but flying cabin OUT of Abu Dhabi to Europe is permitted. From a European hub, the transatlantic carriers (Air France, Lufthansa, KLM) take cabin pets onward to the US. Keep the pet + carrier within 8 kg for the whole journey. Start at Abu Dhabi (AUH), not Dubai.",
    tags: ["dubai", "us", "europe"],
  },
  // UAE → India (outbound from UAE — Air India cabin works this direction)
  {
    from: "Abu Dhabi / Dubai (UAE)",
    to: "Delhi / Mumbai (India)",
    duration: "3–4h direct",
    legs: [
      { route: "UAE → Delhi / Mumbai", time: "3–4h", airline: "Air India ✓ Cabin OUT of the UAE (under 10 kg)" },
    ],
    note: "This one is close to direct: Air India's official policy allows cabin pets on flights DEPARTING the UAE (the restriction is only on flights departing India and arriving in the UAE — that reverse direction is blocked). So UAE → India can be a single cabin flight. You still need India's AQCS NOC and entry via one of the six approved airports. Confirm the specific route and cabin space with Air India when booking.",
    tags: ["dubai", "india"],
  },
  // USA / Europe → Ireland (no cabin into Ireland — same as UK)
  {
    from: "USA or Europe",
    to: "Dublin / Ireland",
    duration: "varies — allow a full day",
    legs: [
      { route: "Fly cabin into a continental EU hub (Paris / Amsterdam / Frankfurt)", time: "1h 30m – 9h", airline: "Air France / KLM / Lufthansa ✓ Cabin" },
      { route: "Drive to Cherbourg or Roscoff", time: "3–5h", airline: "Pet stays with you" },
      { route: "Ferry to Rosslare or Dublin", time: "14–18h", airline: "Irish Ferries / Brittany Ferries — pet-friendly cabin or stays in vehicle" },
    ],
    note: "No commercial airline flies cabin pets INTO Ireland — same government-rule wall as the UK. The cleanest workaround is the direct France→Ireland ferry, which skips the UK landbridge entirely. From the US, fly cabin to a European hub first, then pick up the ferry route. The crossing is long but your pet is with you. Alternative: Eurotunnel into the UK, then the short Holyhead→Dublin ferry.",
    tags: ["us", "europe", "ireland"],
  },
];

// Combined for backward compatibility (other components reference ROUTES)
const ROUTES = [...DIRECT_ROUTES, ...WORKAROUND_ROUTES_TABLE];

// ---------- HUB-BASED WORKAROUND GENERATION ----------
// The hand-written WORKAROUND_ROUTES_TABLE covers specific city pairs (e.g.
// London → New York). But the SAME workaround structure works for London →
// any major US city. Rather than hand-write every pair, we define the KEY
// AIRPORTS per region and a STRATEGY per region-pair, then generate concrete
// city-level workarounds covering every key destination airport.
//
// This is the "guaranteed coverage floor": for every supported region pair,
// the journey planner returns workarounds landing at ALL the main airports —
// not just the two cities someone happened to write up.

// Key airports per region — the minimum floor the planner guarantees.
const REGION_HUBS = {
  // UK cabin-out hubs: Heathrow and Manchester ONLY. Gatwick (LGW) is
  // deliberately excluded — the carriers that fly cabin pets out of the UK
  // (Air France, KLM, Lufthansa, SWISS, TAP, Etihad, Turkish, Air Transat)
  // operate that service from LHR and MAN, NOT Gatwick. Including LGW here
  // would generate workarounds implying a cabin route that doesn't exist.
  "uk-out": ["London (LHR)", "Manchester (MAN)"],
  "ireland": ["Dublin (DUB)"],
  "us": ["New York (JFK)", "Newark (EWR)", "Boston (BOS)", "Chicago (ORD)", "Miami (MIA)", "Los Angeles (LAX)", "Washington (IAD)", "San Francisco (SFO)", "Seattle (SEA)"],
  "canada": ["Toronto (YYZ)", "Montreal (YUL)", "Vancouver (YVR)"],
  "mexico": ["Mexico City (MEX)", "Cancún (CUN)", "Guadalajara (GDL)"],
  "europe": ["Paris (CDG)", "Amsterdam (AMS)", "Frankfurt (FRA)", "Munich (MUC)", "Madrid (MAD)", "Barcelona (BCN)", "Rome (FCO)", "Lisbon (LIS)", "Zurich (ZRH)", "Oslo (OSL)"],
  "india": ["Delhi (DEL)", "Mumbai (BOM)", "Bengaluru (BLR)", "Chennai (MAA)"],
  // UAE cabin hub order matters: Abu Dhabi (AUH) is FIRST because it's the
  // only UAE airport where cabin pets are permitted (Etihad). Dubai (DXB) is
  // cargo-only for ALL airlines under UAE law — it stays in the list so DXB
  // routes still match the UAE region, but AUH must be the generation origin
  // so "from UAE" workarounds never imply a cabin departure from Dubai.
  "dubai": ["Abu Dhabi (AUH)", "Dubai (DXB)"],
  "caribbean": ["Nassau (NAS)", "Montego Bay (MBJ)", "Punta Cana (PUJ)", "Santo Domingo (SDQ)"],
  "hawaii": ["Honolulu (HNL)"],
  "south-africa": ["Johannesburg (JNB)", "Cape Town (CPT)"],
  "south-america": ["São Paulo (GRU)", "Buenos Aires (EZE)", "Santiago (SCL)", "Bogotá (BOG)", "Lima (LIM)", "Montevideo (MVD)"],
  "central-america": ["Panama City (PTY)"],
  "japan": ["Tokyo Narita (NRT)", "Tokyo Haneda (HND)", "Osaka Kansai (KIX)", "Nagoya Chubu (NGO)", "Fukuoka (FUK)", "Seoul Incheon (ICN)"],
};

const REGION_LABELS_SHORT = {
  "uk-out": "the UK", "ireland": "Ireland", "us": "the US", "canada": "Canada",
  "mexico": "Mexico", "europe": "Europe", "india": "India", "dubai": "the UAE",
  "caribbean": "the Caribbean", "hawaii": "Hawaii", "south-africa": "South Africa", "south-america": "South America", "central-america": "Central America", "japan": "Japan",
};

// Reverse-index: 3-letter airport code → region, built from REGION_HUBS.
// We use this to infer which regions a workaround's legs actually transit
// through, even when the strategy didn't include that region in its tags.
// e.g. a US→UK workaround that goes via "Paris (CDG)" should pick up
// "europe" as a transit region — so France's pet rules show up in the
// generated checklist.
//
// Tokens we look for: parenthesised 3-letter airport codes like "(CDG)" AND
// city names mentioned in the leg routes/notes (Calais, Eurotunnel for the
// UK pivot routes). City detection is for transit-relevant places that
// aren't airports (e.g. "Calais → Eurotunnel" implies europe transit).
const HUB_CODE_TO_REGION = (() => {
  const m = {};
  Object.entries(REGION_HUBS).forEach(([region, hubs]) => {
    hubs.forEach((hub) => {
      const code = (hub.match(/\(([A-Z]{3})\)/) || [])[1];
      if (code) m[code] = region;
    });
  });
  return m;
})();

// City-name → region map, for transit-only places (no airport code).
// Kept narrow on purpose: only places mentioned in our workaround strategies
// that DON'T already match by hub code.
const HUB_CITY_TO_REGION = {
  "calais": "europe",
  "eurotunnel": "europe",
  "folkestone": "uk-out",
};

// Given a route's legs, return the set of region IDs the pet actually
// transits through (excluding origin and destination, which the caller
// handles). Each leg.route is scanned for hub airport codes AND a small
// list of transit-only city names.
function inferTransitRegionsFromLegs(legs, originRegion, destRegion) {
  if (!legs || legs.length === 0) return [];
  const found = new Set();
  legs.forEach((leg) => {
    const text = (leg.route || "") + " " + (leg.airline || "");
    // 3-letter airport codes in parentheses
    const codes = (text.match(/\(([A-Z]{3})\)/g) || []).map((c) => c.replace(/[()]/g, ""));
    codes.forEach((c) => {
      const r = HUB_CODE_TO_REGION[c];
      if (r) found.add(r);
    });
    // Known transit-only city names (lowercased match)
    const lower = text.toLowerCase();
    Object.entries(HUB_CITY_TO_REGION).forEach(([city, region]) => {
      if (lower.includes(city)) found.add(region);
    });
  });
  // Exclude origin & destination — caller already covers those.
  found.delete(originRegion);
  found.delete(destRegion);
  return [...found];
}

// ---------- AIRPORT-LEVEL MASTER LIST ----------
// Every key airport the journey planner offers, with its region and — crucially
// — per-airport cabin facts. This is what makes the planner ACCURATE for the
// specific airport selected, instead of substituting a regional "representative".
//
//   cabinOut: can a pet fly OUT of this airport in the cabin (on at least one
//             airline, to at least one destination)?
//   cabinIn:  can a pet fly INTO this airport in the cabin?
//   note:     airport-specific caveat shown when this airport is selected.
//
// VERIFIED (official sources, May 2026):
// - London Gatwick (LGW): carriers that fly cabin pets out of the UK use
//   Heathrow / Manchester — NOT Gatwick. cabinOut: false.
// - All UK/Ireland airports: cabinIn false (government rule, every airline).
// - Dubai (DXB): cargo-only both directions under UAE law. Abu Dhabi (AUH) is
//   the only UAE cabin airport (Etihad).
// - India: cabin pets may only enter via DEL, BOM, MAA, CCU, BLR, HYD.
const AIRPORTS = [
  // United Kingdom
  { code: "LHR", city: "London Heathrow", region: "uk-out", cabinOut: true, cabinIn: false, note: "Heathrow is the UK's main cabin-pet departure airport — most UK-out cabin carriers operate here.", arrivalNote: "No airline flies cabin pets INTO the UK — Heathrow included. Pets arriving in the UK must come in as manifested cargo, or by ferry or pet-friendly transport via the Channel. Plan the arrival leg around that." },
  { code: "MAN", city: "Manchester", region: "uk-out", cabinOut: true, cabinIn: false,
    note: "Manchester has a couple of direct cabin routes of its own (Etihad to Abu Dhabi, Air Transat to Toronto).",
    arrivalNote: "No airline flies cabin pets INTO the UK — Manchester included. Pets arriving in the UK must come in as manifested cargo, or by ferry or pet-friendly transport via the Channel. Plan the arrival leg around that.",
    // driveTo with conditionalOnNoDirect: Manchester CAN do a few cabin routes,
    // but for any destination it can't reach directly, driving to Heathrow
    // (a normal UK domestic drive) unlocks far more direct options and is the
    // better advice than flying the pet to Europe. The planner only surfaces
    // this when there's no direct route from Manchester to the chosen destination.
    driveTo: { code: "LHR", conditionalOnNoDirect: true, text: "Heathrow is a normal domestic drive from Manchester, and it's the UK's main cabin-pet departure airport — far more direct cabin routes leave from there. For destinations Manchester can't reach directly, driving to Heathrow is simpler than any multi-leg workaround." } },
  { code: "LGW", city: "London Gatwick", region: "uk-out", cabinOut: false, cabinIn: false,
    note: "Gatwick does NOT permit cabin pets on departing flights.",
    arrivalNote: "No airline flies cabin pets INTO the UK — Gatwick included. Pets arriving in the UK must come in as manifested cargo, or by ferry or pet-friendly transport via the Channel. Plan the arrival leg around that.",
    // driveTo: a nearby airport that DOES work — the planner shows this as the
    // top-priority advice (driving an hour beats flying the pet to Europe).
    driveTo: { code: "LHR", text: "Heathrow is roughly an hour away by road — it's the same London area, and it's the UK's main cabin-pet departure airport. Driving there is far simpler than any workaround." } },
  { code: "NCL", city: "Newcastle", region: "uk-out", cabinOut: false, cabinIn: false,
    note: "Newcastle has no cabin-pet flights of its own — the carriers that take pets in the cabin out of the UK fly from Heathrow and Manchester. But Newcastle has something no other UK airport has: the DFDS overnight ferry to Amsterdam, which carries pets. For getting a pet to or from mainland Europe, that ferry is Newcastle's real route.",
    arrivalNote: "No airline flies cabin pets INTO the UK — but Newcastle is the UK port for the DFDS overnight ferry from Amsterdam (docking at North Shields), which DOES carry pets in pet-friendly cabins or onboard kennels. For a pet arriving from mainland Europe, that ferry makes Newcastle one of the most pet-practical ways into the UK — no cargo hold, no Channel drive." },
  // Ireland
  { code: "DUB", city: "Dublin", region: "ireland", cabinOut: true, cabinIn: false, note: "Cabin pets can fly OUT of Dublin on EU carriers, but no airline flies cabin pets INTO Ireland — arrival is by ferry or cargo.", arrivalNote: "No airline flies cabin pets INTO Ireland — Dublin included. Pets arriving in Ireland come in by ferry or as cargo. Plan the arrival leg around that." },
  // United States
  { code: "JFK", city: "New York JFK", region: "us", cabinOut: true, cabinIn: true },
  { code: "EWR", city: "Newark", region: "us", cabinOut: true, cabinIn: true },
  { code: "BOS", city: "Boston", region: "us", cabinOut: true, cabinIn: true },
  { code: "ORD", city: "Chicago O'Hare", region: "us", cabinOut: true, cabinIn: true },
  { code: "MIA", city: "Miami", region: "us", cabinOut: true, cabinIn: true },
  { code: "LAX", city: "Los Angeles", region: "us", cabinOut: true, cabinIn: true },
  { code: "IAD", city: "Washington Dulles", region: "us", cabinOut: true, cabinIn: true },
  { code: "BWI", city: "Baltimore/Washington (BWI)", region: "us", cabinOut: true, cabinIn: true,
    note: "Baltimore/Washington Thurgood Marshall (BWI) is a focus city for Southwest, with mostly domestic and limited international service. For Europe, India or the UK there's no direct cabin pet route — connect via a major gateway (JFK, IAD, BOS) for transatlantic cabin carriers. BWI has four pet relief areas — two pre-security (near Concourse E by the international terminal, and by the Hourly Garage) and two post-security (the B/C Connector and Concourse C)." },
  { code: "SFO", city: "San Francisco", region: "us", cabinOut: true, cabinIn: true },
  { code: "SEA", city: "Seattle", region: "us", cabinOut: true, cabinIn: true,
    note: "Seattle-Tacoma (SEA) is Alaska Airlines' hub. Cabin pets are easy for domestic and limited international (Canada, Mexico, Costa Rica, Bahamas, Japan, Hawaii). For India, Europe, or UK there's no direct cabin pet route — connect via SFO (Air India to/from India), or via FRA/AMS/CDG (Lufthansa/KLM/Air France to Europe and onward to India). The terminal has post-security pet relief areas at Concourse B and the International Arrivals Facility, plus four pre-security pet potty locations." },
  // Canada
  { code: "YYZ", city: "Toronto", region: "canada", cabinOut: true, cabinIn: true },
  { code: "YUL", city: "Montreal", region: "canada", cabinOut: true, cabinIn: true },
  { code: "YVR", city: "Vancouver", region: "canada", cabinOut: true, cabinIn: true },
  // Mexico
  { code: "MEX", city: "Mexico City", region: "mexico", cabinOut: true, cabinIn: true },
  { code: "CUN", city: "Cancún", region: "mexico", cabinOut: true, cabinIn: true },
  { code: "GDL", city: "Guadalajara", region: "mexico", cabinOut: true, cabinIn: true },
  // Europe
  { code: "CDG", city: "Paris CDG", region: "europe", cabinOut: true, cabinIn: true },
  { code: "AMS", city: "Amsterdam", region: "europe", cabinOut: true, cabinIn: true },
  { code: "FRA", city: "Frankfurt", region: "europe", cabinOut: true, cabinIn: true },
  { code: "MUC", city: "Munich", region: "europe", cabinOut: true, cabinIn: true,
    note: "Munich is Lufthansa's second German hub and a strong cabin-pet airport — Lufthansa takes cats and small dogs (under 8 kg including the carrier) in the cabin on eligible routes. Munich has a pet relief area inside security in Terminal 1, Hall C1 West (non-Schengen area), plus green relief spaces outside each terminal. One caveat: pets cannot transit Munich in the cargo HOLD — only Frankfurt allows hold transfers — but this doesn't affect cabin pets, who stay with you throughout." },
  { code: "MAD", city: "Madrid", region: "europe", cabinOut: true, cabinIn: true, note: "Iberia hub — main cabin-pet departure for Spain. Flights to the US, Latin America, Europe and within Spain." },
  { code: "BCN", city: "Barcelona", region: "europe", cabinOut: true, cabinIn: true, note: "Spain's second-busiest airport. Iberia Express, Vueling, and connecting Iberia flights take cabin pets on eligible routes." },
  { code: "VLC", city: "Valencia", region: "europe", cabinOut: true, cabinIn: true, note: "Spain's third city. Iberia and Vueling serve cabin pets on Spanish domestic and EU routes from Valencia." },
  { code: "FCO", city: "Rome", region: "europe", cabinOut: true, cabinIn: true },
  { code: "LIS", city: "Lisbon", region: "europe", cabinOut: true, cabinIn: true },
  { code: "ZRH", city: "Zurich", region: "europe", cabinOut: true, cabinIn: true },
  { code: "OSL", city: "Oslo", region: "europe", cabinOut: true, cabinIn: true, note: "Oslo Gardermoen is Norway's ONLY airport approved for pet entry (the only other pet entry point is the Storskog land border in the north). SAS hub. Norway is in the EEA — follows EU pet passport rules but with extras for dogs: tapeworm treatment 24-120 hours before entry (Echinococcus multilocularis), and seven dog breeds are banned including Pit Bull and wolf hybrids." },
  { code: "CPH", city: "Copenhagen", region: "europe", cabinOut: true, cabinIn: true, note: "SAS hub. Denmark follows EU pet passport rules — no tapeworm requirement (unlike Norway/Finland/Ireland/Malta). Strong cabin pet connectivity across Europe and to the US." },
  { code: "ARN", city: "Stockholm Arlanda", region: "europe", cabinOut: true, cabinIn: true, note: "SAS hub. Sweden follows EU pet passport rules. Pet movement Sweden↔Norway specifically doesn't require a rabies vaccine (bilateral arrangement)." },
  // India
  { code: "DEL", city: "Delhi", region: "india", cabinOut: true, cabinIn: true, note: "Delhi is one of India's six approved pet-entry airports." },
  { code: "BOM", city: "Mumbai", region: "india", cabinOut: true, cabinIn: true, note: "Mumbai is one of India's six approved pet-entry airports." },
  { code: "BLR", city: "Bengaluru", region: "india", cabinOut: true, cabinIn: true, note: "Bengaluru is one of India's six approved pet-entry airports." },
  { code: "MAA", city: "Chennai", region: "india", cabinOut: true, cabinIn: true, note: "Chennai is one of India's six approved pet-entry airports." },
  { code: "CCU", city: "Kolkata", region: "india", cabinOut: true, cabinIn: true, note: "Kolkata is one of India's six approved pet-entry airports." },
  { code: "HYD", city: "Hyderabad", region: "india", cabinOut: true, cabinIn: true, note: "Hyderabad is one of India's six approved pet-entry airports." },
  // UAE
  { code: "AUH", city: "Abu Dhabi", region: "dubai", cabinOut: true, cabinIn: true, note: "Abu Dhabi is the ONLY UAE airport that permits cabin pets (Etihad). It's a 90-minute drive from Dubai." },
  { code: "DXB", city: "Dubai", region: "dubai", cabinOut: false, cabinIn: false,
    note: "Dubai (DXB) is cargo-only for pets under UAE law — no airline flies cabin pets in or out.",
    driveTo: { code: "AUH", text: "Abu Dhabi (AUH) is about a 90-minute drive from Dubai, and it's the only UAE airport that permits cabin pets (Etihad). Starting your journey from Abu Dhabi is far simpler than cargo." } },
  // Caribbean
  { code: "NAS", city: "Nassau, Bahamas", region: "caribbean", cabinOut: true, cabinIn: true, note: "Bahamas requires an import permit — apply 6–8 weeks ahead." },
  { code: "MBJ", city: "Montego Bay, Jamaica", region: "caribbean", cabinOut: true, cabinIn: true, note: "Jamaica has a strict 6+ month import process — start very early." },
  { code: "PUJ", city: "Punta Cana, Dominican Republic", region: "caribbean", cabinOut: true, cabinIn: true, note: "The DR is on the CDC high-risk rabies list — US travellers must prepare the return paperwork BEFORE leaving the US." },
  { code: "SDQ", city: "Santo Domingo, Dominican Republic", region: "caribbean", cabinOut: true, cabinIn: true, note: "The DR is on the CDC high-risk rabies list — US travellers must prepare the return paperwork BEFORE leaving the US." },
  // Hawaii
  { code: "HNL", city: "Honolulu", region: "hawaii", cabinOut: true, cabinIn: true, note: "Honolulu is the only animal port of entry for Hawaii. Hawaii's rabies-free import programme needs 4+ months of prep." },
  // South Africa
  { code: "JNB", city: "Johannesburg", region: "south-africa", cabinOut: false, cabinIn: false, note: "No airline flies cabin pets internationally in or out of South Africa — international travel is cargo-only. Cabin is domestic-only (Lift, small dogs)." },
  { code: "CPT", city: "Cape Town", region: "south-africa", cabinOut: false, cabinIn: false, note: "No airline flies cabin pets internationally in or out of South Africa — international travel is cargo-only. Cabin is domestic-only (Lift, small dogs)." },
  // South America — LATAM and Avianca are the primary cabin pet carriers (both 10kg combined limit, brachycephalic excluded from cargo). Aeromexico provides Mexico ↔ SA connections.
  { code: "GRU", city: "São Paulo Guarulhos", region: "south-america", cabinOut: true, cabinIn: true, note: "São Paulo Guarulhos (GRU) is South America's largest hub. LATAM is the primary cabin pet carrier (10 kg combined). Brazil's entry rules are relatively lenient: rabies vaccine 21+ days old, USDA-endorsed health certificate within 10 days, no microchip or titer required for most origin countries." },
  { code: "EZE", city: "Buenos Aires Ezeiza", region: "south-america", cabinOut: true, cabinIn: true, note: "Buenos Aires Ezeiza (EZE) is Argentina's main international airport. LATAM and Aerolineas Argentinas serve cabin pets. Argentina requires ISO microchip, rabies vaccine, SENASA-endorsed health certificate, and import permit." },
  { code: "SCL", city: "Santiago", region: "south-america", cabinOut: true, cabinIn: true, note: "Santiago Arturo Merino Benítez (SCL) is LATAM's home base — best cabin pet connectivity in South America. Chile's SAG requires advance import authorization, ISO microchip, and rabies vaccine 30+ days old. Strict on documentation." },
  { code: "BOG", city: "Bogotá El Dorado", region: "south-america", cabinOut: true, cabinIn: true, note: "Bogotá El Dorado (BOG) is Avianca's main hub. Avianca cabin pets (10 kg) connect across the Americas. Colombia bans the import of Pit Bull, Staffordshire Terrier, and American Staffordshire Terrier breeds by law (Article 108-E)." },
  { code: "LIM", city: "Lima", region: "south-america", cabinOut: true, cabinIn: true, note: "Lima Jorge Chávez (LIM) is Peru's main international airport. LATAM Peru and Avianca serve cabin pets. Peru requires SENASA import permit and health certificate from origin country's official authority." },
  { code: "MVD", city: "Montevideo", region: "south-america", cabinOut: true, cabinIn: true, note: "Montevideo (MVD) is Uruguay's main airport. No direct US cabin pet route — connect through Panama (Copa), Bogotá (Avianca), or São Paulo (LATAM). Uruguay requires ISO microchip, rabies vaccine 30+ days old, MGAP-recognised health certificate from origin country's official veterinary authority, and an import declaration. Generally treated similarly to Argentina." },
  { code: "PTY", city: "Panama City", region: "central-america", cabinOut: true, cabinIn: true, note: "Panama City Tocumen (PTY) is Copa Airlines' hub and the key cabin pet transit point for deeper South American destinations like Montevideo, Asunción, and La Paz. Copa is the dominant operator; pets transit through the airport on Copa-operated itineraries without needing to enter Panama formally." },
  // Japan — pets can enter at 11 designated ports; we list the major five.
  // Critical note: JAL and ANA do NOT carry cabin pets on any route. Cabin
  // routes in/out of Japan exist on United (US ↔ Japan), Korean carriers
  // (Japan ↔ Korea), and Aeromexico (Japan ↔ Mexico) only.
  { code: "NRT", city: "Tokyo Narita", region: "japan", cabinOut: true, cabinIn: true, note: "Narita is Japan's main international gateway and one of 11 approved pet entry ports. JAL and ANA do not carry cabin pets — for cabin into/out of Japan, use United (US routes), Korean carriers (Korea routes), or Aeromexico (Mexico routes). Other airlines are cargo-only." },
  { code: "HND", city: "Tokyo Haneda", region: "japan", cabinOut: true, cabinIn: true, note: "Haneda is Tokyo's domestic-heavy airport but has growing international cabin pet support via Korean carriers and United. Approved pet entry port." },
  { code: "KIX", city: "Osaka Kansai", region: "japan", cabinOut: true, cabinIn: true, note: "Osaka's main international airport, one of 11 approved pet entry ports. Cabin pets via Korean carriers and select international routes." },
  { code: "NGO", city: "Nagoya Chubu", region: "japan", cabinOut: true, cabinIn: true, note: "Nagoya Chubu Centrair is an approved pet entry port. Limited international cabin options." },
  { code: "FUK", city: "Fukuoka", region: "japan", cabinOut: true, cabinIn: true, note: "Fukuoka is southern Japan's main international gateway. Star Flyer (cabin pets, domestic only) is based here. Approved pet entry port." },
  // Seoul Incheon is technically in Korea, not Japan — but in the context of cabin
  // pet travel its main relevance is as the hub for Korean carriers (Korean Air,
  // T'Way, Air Premia) that fly cabin pets to/from Japan when JAL/ANA won't. Listed
  // under japan region so it surfaces when planning Japan-related cabin routes.
  { code: "ICN", city: "Seoul Incheon", region: "japan", cabinOut: true, cabinIn: true, note: "Seoul Incheon is Korean Air's hub. Listed in the Japan region tag for cabin pet planning purposes — Korea ↔ Japan via Korean carriers (Korean Air, T'Way Air, Air Premia) is one of the main cabin paths to/from Japan, since JAL and ANA don't carry cabin pets. Note T'Way does not permit pet transit in Korea — Japan-Korea must be point-to-point, not a connection." },
];

const airportByCode = (code) => AIRPORTS.find((a) => a.code === code);
const airportLabel = (code) => {
  const a = airportByCode(code);
  return a ? `${a.city} (${a.code})` : code;
};

// Strategy per region-pair. Each strategy is a function of (originHub, destHub)
// that returns the leg structure + note. Only pairs that need a WORKAROUND are
// listed — pairs with good direct cabin routes are handled by DIRECT_ROUTES.
// Where a pair genuinely has no cabin path at all, it's deliberately omitted
// and the planner shows the honest "no mapped route" message.
//
// VERIFIED FACTS THESE STRATEGIES REST ON (official sources, May 2026):
// - No airline flies cabin pets INTO the UK or Ireland (govt rule) — must use
//   a European hub + Eurotunnel/ferry land crossing.
// - Cabin OUT of the UK/Ireland to Europe IS allowed (Air France, KLM, Lufthansa).
// - Etihad: cabin OUT of Abu Dhabi to Europe allowed; cabin INTO the UAE blocked
//   on "flights to" the UAE — Dubai (DXB) is cargo-only for all airlines.
// - Air India: cargo-only to/from the UK; cabin allowed DEPARTING the UAE.
// - Transatlantic cabin works between European hubs and major US cities
//   (Air France, KLM, Lufthansa, Delta, etc.).
const REGION_PAIR_STRATEGIES = {
  // ----- INTO the UK (cabin into UK impossible — via Europe + crossing) -----
  // Three distinct routes, one per European hub, each shown as its own card.
  "us>uk-out": [
    // Via PARIS — Air France, then the Calais Channel crossing.
    (o, d) => ({
      label: "Via Paris",
      legs: [
        { route: `${o} → Paris (CDG)`, time: "7–11h", airline: "Air France / Delta ✓ Cabin" },
        { route: "Layover at Paris CDG", time: "2–3h+ (overnight gentler)", airline: "Pet handover buffer" },
        { route: "Drive + crossing: Paris → Calais → Eurotunnel or DFDS/P&O ferry → UK", time: "5–6h", airline: "Pet stays with you — car + crossing" },
      ],
      note: `Via Paris: fly cabin ${o} → Paris on Air France, then drive to Calais and cross the Channel — the Eurotunnel Le Shuttle (35 min, ~£22 per pet) or a DFDS/P&O ferry to Dover (~1h 30m, ~£15 per pet). Both are UK-government-approved pet routes; your pet stays in the car for the crossing. This is the most-used route into ${d}.`,
    }),
    // Via FRANKFURT — Lufthansa, then the Calais Channel crossing.
    (o, d) => ({
      label: "Via Frankfurt",
      legs: [
        { route: `${o} → Frankfurt (FRA)`, time: "8–10h", airline: "Lufthansa / United ✓ Cabin" },
        { route: "Layover at Frankfurt FRA", time: "2–3h+ (overnight gentler)", airline: "Pet handover buffer" },
        { route: "Drive + crossing: Frankfurt → Calais → Eurotunnel or DFDS/P&O ferry → UK", time: "7–8h", airline: "Pet stays with you — car + crossing" },
      ],
      note: `Via Frankfurt: fly cabin ${o} → Frankfurt on Lufthansa, then drive to Calais and cross — the Eurotunnel Le Shuttle or a DFDS/P&O ferry to Dover, both UK-government-approved pet routes. The Frankfurt→Calais drive is longer than from Paris, so consider an overnight in Frankfurt or along the way. Good if Lufthansa's schedule or pricing from your city beats Air France.`,
    }),
    // Via AMSTERDAM — KLM, then the DFDS overnight ferry direct to Newcastle.
    // No drive through France: the ferry IS the crossing.
    (o, d) => ({
      label: "Via Amsterdam (Newcastle ferry)",
      legs: [
        { route: `${o} → Amsterdam (AMS)`, time: "7–9h", airline: "KLM / Delta ✓ Cabin" },
        { route: "Drive: Amsterdam Schiphol → DFDS ferry terminal, IJmuiden", time: "25m", airline: "Taxi — pet stays with you" },
        { route: "Ferry: DFDS overnight, Amsterdam (IJmuiden) → Newcastle", time: "~16h 45m", airline: "Pet in a pet-friendly cabin or onboard kennel" },
        { route: "Drive or train: Newcastle → onward UK", time: "varies", airline: "Pet stays with you" },
      ],
      note: `Via Amsterdam: fly cabin ${o} → Amsterdam on KLM, then take the DFDS overnight ferry from IJmuiden directly to Newcastle — a UK-government-approved pet route. The advantage: no drive through Belgium and France, and DFDS carries pets in pet-friendly cabins or kennels (~£30 per pet each way; foot-passenger pet bookings are by phone, not online). It lands in the north of England, so it suits Scotland or northern England better than London. Dogs still need tapeworm treatment 24–120h before UK arrival.`,
    }),
  ],
  "europe>uk-out": (o, d) => ({
    legs: [
      { route: `${o} → Calais (drive/train)`, time: "varies", airline: "Pet stays with you" },
      { route: "Eurotunnel Le Shuttle, or DFDS / P&O ferry — Calais → UK", time: "35m–1h 30m", airline: "Pet stays in car" },
      { route: `Folkestone / Dover → ${d}`, time: "1h 30m+", airline: "Pet stays with you" },
    ],
    note: `If you're already in Europe, crossing the Channel by land/sea is the easiest way into the UK — your pet stays with you the whole way. From Calais: the Eurotunnel Le Shuttle (35 min) or a DFDS/P&O ferry to Dover (~1h 30m), both UK-government-approved pet routes. No cabin flight INTO the UK exists on any airline.`,
  }),
  "canada>uk-out": (o, d) => ({
    legs: [
      { route: `${o} → Paris (CDG) or Frankfurt (FRA)`, time: "7–8h", airline: "Air France / Lufthansa ✓ Cabin" },
      { route: "Layover at the European hub", time: "2–3h+ (overnight gentler)", airline: "Pet handover buffer" },
      { route: "Hub → Calais, then Eurotunnel or DFDS/P&O ferry → UK", time: "5–6h", airline: "Pet stays with you" },
    ],
    note: `No cabin flight goes INTO the UK. From ${o}, fly cabin to a European hub, then a land/sea crossing into ${d} — Eurotunnel Le Shuttle or a DFDS/P&O ferry from Calais, both UK-government-approved pet routes.`,
  }),
  "india>uk-out": (o, d) => ({
    legs: [
      { route: `${o} → Frankfurt (FRA) or Paris (CDG)`, time: "8–9h", airline: "Confirm cabin acceptance with the operating airline" },
      { route: "Layover at the European hub", time: "3h+ (overnight gentler)", airline: "Pet handover buffer" },
      { route: "Hub → Calais, then Eurotunnel or DFDS/P&O ferry → UK", time: "5–6h", airline: "Pet stays with you" },
    ],
    note: `Two walls: Air India is cargo-only for the UK, AND no airline flies cabin pets INTO the UK. Route is ${o} → continental Europe, then a land/sea crossing into ${d} — Eurotunnel or a DFDS/P&O ferry from Calais. Confirm the long-haul leg's cabin availability before booking — if it can't be confirmed as cabin, that portion becomes cargo.`,
  }),
  "dubai>uk-out": (o, d) => ({
    legs: [
      { route: `${o} → Paris / Frankfurt / Amsterdam`, time: "7–8h", airline: "Etihad ✓ Cabin out of Abu Dhabi (under 8 kg)" },
      { route: "Layover at the European hub", time: "3h+ (overnight gentler)", airline: "Pet handover buffer" },
      { route: "Hub → Calais, then Eurotunnel or DFDS/P&O ferry → UK", time: "5–6h", airline: "Pet stays with you" },
    ],
    note: `Etihad takes cabin pets OUT of Abu Dhabi to Europe. From a European hub, a land/sea crossing brings your pet into ${d} — Eurotunnel or a DFDS/P&O ferry from Calais. Start at Abu Dhabi (AUH) — Dubai (DXB) is cargo-only for all airlines.`,
  }),

  // ----- INTO Ireland (same wall as UK — via Europe + ferry) -----
  "us>ireland": (o, d) => ({
    legs: [
      { route: `${o} → Paris (CDG)`, time: "7–11h", airline: "Air France / Delta ✓ Cabin" },
      { route: "Drive to Cherbourg or Roscoff", time: "3–5h", airline: "Pet stays with you" },
      { route: `Ferry to Rosslare or ${d}`, time: "14–18h", airline: "Irish Ferries / Brittany Ferries — pet-friendly" },
    ],
    note: `No airline flies cabin pets INTO Ireland. Cleanest route: cabin into Europe, then the direct France→Ireland ferry — skips the UK entirely.`,
  }),
  "europe>ireland": (o, d) => ({
    legs: [
      { route: `${o} → Cherbourg or Roscoff (drive)`, time: "varies", airline: "Pet stays with you" },
      { route: `Ferry to Rosslare or ${d}`, time: "14–18h", airline: "Irish Ferries / Brittany Ferries — pet-friendly" },
    ],
    note: `From Europe, the direct France→Ireland ferry is the easiest way in — your pet stays with you. No cabin flight goes INTO Ireland.`,
  }),
  "uk-out>ireland": (o, d) => ({
    legs: [
      { route: `${o} → Holyhead (drive across to Wales)`, time: "4–6h", airline: "Pet stays with you" },
      { route: `Ferry Holyhead → ${d}`, time: "3h 15m", airline: "Irish Ferries / Stena Line — pet-friendly" },
    ],
    note: `The short hop: drive to Holyhead in Wales, then the ferry to Dublin. Both UK and Ireland pet rules apply.`,
  }),

  // ----- INTO the UAE -----
  // NOTE: there are NO workaround strategies for *>dubai here. The cabin route
  // into the UAE is a DIRECT Etihad flight to Abu Dhabi (AUH) — those live in
  // DIRECT_ROUTES (LHR→AUH, MAN→AUH, JFK→AUH, European hubs→AUH). A "workaround"
  // that's just "fly Etihad to Abu Dhabi" isn't a workaround, it's the direct
  // route restated — including it created duplicate cards. If a specific origin
  // airport has no direct AUH route, the honest answer is the drive-to-a-
  // qualifying-airport logic, not a fake one-leg workaround.
  "india>dubai": (o, d) => ({
    legs: [
      { route: `${o} → Europe (Frankfurt / Paris)`, time: "8–9h", airline: "Confirm cabin acceptance with the operating airline" },
      { route: "Hub → Abu Dhabi (AUH)", time: "6–7h", airline: "Etihad ✓ Cabin" },
    ],
    note: `Air India blocks cabin pets on flights India→UAE, so the workaround routes via Europe. Confirm the India→Europe leg's cabin availability. Alternatively this is a cargo move. Note: UAE→India in cabin IS allowed (the block is one-directional).`,
  }),

  // ----- INTO India (no direct cabin from UK; via Europe) -----
  "uk-out>india": (o, d) => {
    const isHeathrow = o.includes("(LHR)");
    const legs = isHeathrow
      ? [
          { route: `${o} → Frankfurt (FRA) or Paris (CDG)`, time: "1h 30m", airline: "Lufthansa / Air France ✓ Cabin out of the UK" },
          { route: "Layover at the European hub", time: "3h+ (overnight gentler)", airline: "Pet handover buffer" },
          { route: `Hub → ${d}`, time: "8–9h", airline: "Confirm cabin acceptance with the operating airline" },
        ]
      : [
          { route: `${o} → London Heathrow (LHR)`, time: "drive or short hop", airline: "Heathrow is the UK's main cabin-pet departure airport" },
          { route: "LHR → Frankfurt (FRA) or Paris (CDG)", time: "1h 30m", airline: "Lufthansa / Air France ✓ Cabin out of the UK" },
          { route: "Layover at the European hub", time: "3h+ (overnight gentler)", airline: "Pet handover buffer" },
          { route: `Hub → ${d}`, time: "8–9h", airline: "Confirm cabin acceptance with the operating airline" },
        ];
    return {
      legs,
      note: `Air India is cargo-only to/from the UK — no direct UK↔India cabin route exists. ${isHeathrow ? "Fly cabin OUT of Heathrow" : `From ${o.split(" (")[0]}, get to Heathrow first, then fly cabin`} to a European hub, then onward toward India. Confirm the second leg's cabin availability; India also needs the AQCS NOC and entry via one of six approved airports.`,
    };
  },
  "us>india": (o, d) => ({
    legs: [
      { route: `${o} → Frankfurt (FRA) or Paris (CDG)`, time: "7–9h", airline: "Lufthansa / Air France ✓ Cabin" },
      { route: "Layover at the European hub", time: "3h+ (overnight gentler)", airline: "Pet handover buffer" },
      { route: `Hub → ${d}`, time: "8–9h", airline: "Air India 'Paws on Board' / confirm with operating airline" },
    ],
    note: `Route via a European hub: cabin ${o} → Europe, then Europe → India. Air India flies cabin pets from Europe (e.g. CDG → Delhi). India needs the AQCS NOC and entry via Delhi, Mumbai, Chennai, Kolkata, Bengaluru or Hyderabad.`,
  }),

  // ----- INTO the US (from UK/Ireland — no direct cabin out of those into US) -----
  "uk-out>us": [
    (o, d) => {
      // The European-hub cabin route is verified from Heathrow. If the user
      // picked another UK airport (e.g. Manchester), route via Heathrow first
      // rather than asserting a cabin flight we can't verify from that airport.
      const isHeathrow = o.includes("(LHR)");
      const legs = isHeathrow
        ? [
            { route: `${o} → Paris (CDG) or Amsterdam (AMS)`, time: "1h 20m", airline: "Air France / KLM ✓ Cabin out of the UK" },
            { route: "Layover at the European hub", time: "2–3h+ (overnight gentler)", airline: "Pet handover buffer" },
            { route: `Hub → ${d}`, time: "7–11h", airline: "Air France / KLM / Delta ✓ Cabin" },
          ]
        : [
            { route: `${o} → London Heathrow (LHR)`, time: "drive or short hop", airline: "Heathrow is the UK's main cabin-pet departure airport" },
            { route: "LHR → Paris (CDG) or Amsterdam (AMS)", time: "1h 20m", airline: "Air France / KLM ✓ Cabin out of the UK" },
            { route: "Layover at the European hub", time: "2–3h+ (overnight gentler)", airline: "Pet handover buffer" },
            { route: `Hub → ${d}`, time: "7–11h", airline: "Air France / KLM / Delta ✓ Cabin" },
          ];
      return {
        label: "Via a European hub",
        legs,
        note: isHeathrow
          ? `There's no direct cabin route out of the UK to the US — but flying cabin OUT of Heathrow to a European hub works, and the transatlantic carriers take cabin pets onward to ${d}. A longer layover (or overnight in Paris) is gentler than a same-day connection.`
          : `The European-hub cabin route runs from Heathrow — the UK's main cabin-pet departure airport. From ${o.split(" (")[0]}, get to Heathrow first (drive, or the cabin options from your airport are limited), then cabin to a European hub and onward to ${d}.`,
      };
    },
    (o, d) => {
      const isHeathrow = o.includes("(LHR)");
      return {
        label: "Via Montreal (Air Canada)",
        legs: [
          { route: isHeathrow ? `${o} → Montreal (YUL)` : `${o} → London Heathrow (LHR) → Montreal (YUL)`, time: "7h 30m", airline: "Air Canada ✓ Cabin out of the UK (under 10 kg)" },
          { route: "Overnight in Montreal", time: "12+ hours", airline: "Dog-friendly hotel — strongly recommended" },
          { route: `Montreal → ${d}`, time: "2–4h", airline: "Air Canada / American / United ✓ Cabin" },
        ],
        note: isHeathrow
          ? `This is Theo's Mum's actual route. Air Canada flies cabin pets OUT of Heathrow to Montreal, and the overnight stop is what makes it work — pet recovers, you recover, then the short hop onward to ${d} the next morning is easy.`
          : `Air Canada's UK cabin departures run from Heathrow. From ${o.split(" (")[0]}, get to Heathrow first — or, from Manchester specifically, Air Transat flies Manchester→Toronto in cabin and you connect onward from there. The overnight stop in Canada is what makes the long journey gentle.`,
      };
    },
  ],
  "ireland>us": (o, d) => ({
    legs: [
      { route: `${o} → Paris (CDG) or Amsterdam (AMS)`, time: "1h 50m", airline: "Air France / KLM ✓ Cabin out of Ireland" },
      { route: "Layover at the European hub", time: "2–3h+ (overnight gentler)", airline: "Pet handover buffer" },
      { route: `Hub → ${d}`, time: "7–11h", airline: "Air France / KLM / Delta ✓ Cabin" },
    ],
    note: `Cabin OUT of Ireland to a European hub works, then the transatlantic carriers fly cabin pets onward to ${d}.`,
  }),

  // ----- INTO the Caribbean (from UK/Europe — via the US) -----
  "uk-out>caribbean": (o, d) => {
    const isHeathrow = o.includes("(LHR)");
    const legs = isHeathrow
      ? [
          { route: `${o} → Paris (CDG) or Amsterdam (AMS)`, time: "1h 20m", airline: "Air France / KLM ✓ Cabin out of the UK" },
          { route: "European hub → Miami (MIA) or New York (JFK)", time: "7–9h", airline: "Air France / KLM / Delta ✓ Cabin" },
          { route: `US gateway → ${d}`, time: "1–3h", airline: "JetBlue / American / Delta ✓ Cabin" },
        ]
      : [
          { route: `${o} → London Heathrow (LHR)`, time: "drive or short hop", airline: "Heathrow is the UK's main cabin-pet departure airport" },
          { route: "LHR → Paris (CDG) or Amsterdam (AMS)", time: "1h 20m", airline: "Air France / KLM ✓ Cabin out of the UK" },
          { route: "European hub → Miami (MIA) or New York (JFK)", time: "7–9h", airline: "Air France / KLM / Delta ✓ Cabin" },
          { route: `US gateway → ${d}`, time: "1–3h", airline: "JetBlue / American / Delta ✓ Cabin" },
        ];
    return {
      legs,
      note: `There's no cabin route straight from the UK to the Caribbean. The path is ${isHeathrow ? "Heathrow" : `${o.split(" (")[0]} → Heathrow`} → Europe → a US gateway (Miami or New York) → ${d}, all in cabin. Each Caribbean destination has its own import permit — check the specific island. A longer US layover lets your pet rest.`,
    };
  },
  "europe>caribbean": (o, d) => ({
    legs: [
      { route: `${o} → Miami (MIA) or New York (JFK)`, time: "8–10h", airline: "Air France / KLM / Delta ✓ Cabin" },
      { route: `US gateway → ${d}`, time: "1–3h", airline: "JetBlue / American / Delta ✓ Cabin" },
    ],
    note: `From Europe, route via a US gateway (Miami or New York), then a short cabin hop to ${d}. Each Caribbean destination has its own import permit — check the specific island.`,
  }),
  "canada>caribbean": (o, d) => ({
    legs: [
      { route: `${o} → Miami (MIA) or New York (JFK)`, time: "3–4h", airline: "Air Canada / American ✓ Cabin" },
      { route: `US gateway → ${d}`, time: "1–3h", airline: "JetBlue / American / Delta ✓ Cabin" },
    ],
    note: `From Canada, the simplest cabin path to the Caribbean routes through a US gateway. Some Caribbean carriers also fly direct from Toronto — check, but the US-gateway route is the reliable cabin option. Each island has its own import permit.`,
  }),

  // ----- CARIBBEAN outbound -----
  "caribbean>us": (o, d) => ({
    legs: [
      { route: `${o} → ${d}`, time: "1–4h", airline: "JetBlue / American / Delta ✓ Cabin" },
    ],
    note: `Most Caribbean islands have direct cabin routes to major US gateways — this is straightforward. The complexity is on the RETURN: the Dominican Republic is CDC high-risk, so if you're flying dogs back to the US from there, you need the Certification of US-issued Rabies Vaccination prepared BEFORE you left the US. Bahamas is CDC-rabies-free, so re-entry is simple.`,
  }),
  "caribbean>canada": (o, d) => ({
    legs: [
      { route: `${o} → Miami (MIA) or New York (JFK)`, time: "1–4h", airline: "JetBlue / American / Delta ✓ Cabin" },
      { route: `US gateway → ${d}`, time: "3–4h", airline: "Air Canada / American / United ✓ Cabin" },
    ],
    note: `No direct Caribbean→Canada cabin routes — route via a US gateway (Miami or New York). The connection is simple since Canada doesn't have the complex CDC dog-import requirements the US has for Caribbean returns.`,
  }),
  "caribbean>europe": (o, d) => ({
    legs: [
      { route: `${o} → Miami (MIA) or New York (JFK)`, time: "1–4h", airline: "JetBlue / American / Delta ✓ Cabin" },
      { route: `US gateway → ${d}`, time: "7–10h", airline: "Air France / KLM / Lufthansa ✓ Cabin" },
    ],
    note: `Caribbean→Europe routes via a US gateway. The transatlantic leg carries cabin pets. Note: if you're flying a dog that originated in the Dominican Republic, the CDC high-risk rules mean you need the US-issued Rabies Certification prepared before you left for the Caribbean — confirm this with your vet before the trip.`,
  }),
  "caribbean>uk-out": (o, d) => ({
    legs: [
      { route: `${o} → Miami (MIA) or New York (JFK)`, time: "1–4h", airline: "JetBlue / American / Delta ✓ Cabin" },
      { route: `US gateway → Paris (CDG) or Amsterdam (AMS)`, time: "7–9h", airline: "Air France / KLM ✓ Cabin" },
      { route: "Hub → Calais, then Eurotunnel or DFDS/P&O ferry → UK", time: "5–6h", airline: "Pet stays with you" },
    ],
    note: `Caribbean to the UK is a three-leg journey — no airline flies cabin pets INTO the UK directly. The route is Caribbean → US gateway → European hub → a land/sea crossing into the UK (Eurotunnel or a DFDS/P&O ferry from Calais, both UK-government-approved pet routes). Long but fully in cabin and with you at every step. Build in at least one overnight stop.`,
  }),

  // ----- MEXICO outbound -----
  "mexico>us": (o, d) => ({
    legs: [
      { route: `${o} → ${d}`, time: "2–4h", airline: "Aeromexico / American / Delta / United ✓ Cabin" },
    ],
    note: `Mexico→US is one of the easiest cross-border cabin routes. The complication is on return: dogs returning to the US from Mexico need the CDC Dog Import Form (Mexico is not on the high-risk list for dogs, so it's the standard form, no titer required). Cats don't need it.`,
  }),
  "mexico>europe": (o, d) => ({
    legs: [
      { route: `${o} → Miami (MIA) or New York (JFK)`, time: "3–4h", airline: "Aeromexico / American ✓ Cabin" },
      { route: `US gateway → ${d}`, time: "8–10h", airline: "Air France / KLM / Lufthansa ✓ Cabin" },
    ],
    note: `Mexico→Europe via a US gateway. Both legs in cabin. The transatlantic carrier takes cabin pets onward from Miami or New York.`,
  }),
  "mexico>canada": (o, d) => ({
    legs: [
      { route: `${o} → ${d}`, time: "5–6h", airline: "Air Canada / Aeromexico ✓ Cabin" },
    ],
    note: `Mexico→Canada is relatively direct. Air Canada and Aeromexico serve the main pairs in cabin. Canada is one of the easier destinations: current rabies certificate is the core requirement.`,
  }),
  "mexico>uk-out": (o, d) => ({
    legs: [
      { route: `${o} → Miami (MIA) or New York (JFK)`, time: "3–4h", airline: "Aeromexico / American ✓ Cabin" },
      { route: `US gateway → Paris (CDG) or Amsterdam (AMS)`, time: "7–9h", airline: "Air France / KLM ✓ Cabin" },
      { route: "Hub → Calais, then Eurotunnel or DFDS/P&O ferry → UK", time: "5–6h", airline: "Pet stays with you" },
    ],
    note: `Mexico to the UK is three legs — no airline flies cabin pets into the UK. Route via the US, then a European hub, then a land/sea crossing into the UK (Eurotunnel or a DFDS/P&O ferry from Calais). Build in at least one overnight stop. UK paperwork: ISO microchip, rabies ≥21 days, AHC from an accredited vet.`,
  }),

  // ----- IRELAND outbound (cabin OUT of Ireland is fine — Dublin to Europe) -----
  "ireland>europe": (o, d) => ({
    legs: [
      { route: `${o} → ${d}`, time: "1h 30m–3h", airline: "Air France / KLM / Lufthansa ✓ Cabin out of Dublin" },
    ],
    note: `Cabin OUT of Ireland is straightforward — it's only flights INTO Ireland that ban cabin pets. Air France (to Paris), KLM (to Amsterdam) and Lufthansa (to Frankfurt) all take cabin pets out of Dublin. From any of those hubs you can connect onward across Europe in cabin.`,
  }),
  "ireland>uk-out": (o, d) => ({
    legs: [
      { route: `${o} → Cherbourg or Roscoff (ferry)`, time: "~18h", airline: "Irish Ferries / Brittany Ferries — pet-friendly cabin or stays in vehicle" },
      { route: "France → Calais", time: "varies", airline: "Pet stays with you" },
      { route: "Eurotunnel → UK", time: "35m", airline: "Pet stays in car" },
    ],
    note: `The cleanest Ireland→UK pet route avoids flying altogether: the direct Ireland→France ferry, then drive to Calais and Eurotunnel into the UK. Alternatively the short Dublin/Rosslare → Holyhead ferry crosses straight to Wales — pets stay in your vehicle. No cabin flight into the UK exists, but the ferry routes make this an easy land+sea journey.`,
  }),
  "ireland>canada": (o, d) => ({
    legs: [
      { route: `${o} → Paris (CDG) or Frankfurt (FRA)`, time: "1h 30m–2h", airline: "Air France / Lufthansa ✓ Cabin out of Dublin" },
      { route: "Layover at the European hub", time: "2–3h+ (overnight gentler)", airline: "Pet handover buffer" },
      { route: `Hub → ${d}`, time: "7–9h", airline: "Air Canada ✓ Cabin (under 10 kg combined)" },
    ],
    note: `Cabin out of Ireland to a European hub, then Air Canada cabin onward to Canada. Air Canada is one of the more reliable long-haul cabin carriers. Canada is an easy destination paperwork-wise — a current rabies certificate is the core requirement.`,
  }),
  "ireland>india": (o, d) => ({
    legs: [
      { route: `${o} → Frankfurt (FRA) or Paris (CDG)`, time: "1h 30m–2h", airline: "Lufthansa / Air France ✓ Cabin out of Dublin" },
      { route: "Layover at the European hub", time: "3h+ (overnight gentler)", airline: "Pet handover buffer" },
      { route: `Hub → ${d}`, time: "8–9h", airline: "Lufthansa / Air France ✓ Cabin" },
    ],
    note: `Ireland→India via a European hub, cabin all the way. You'll need India's AQCS NOC for the import side, and India only admits pets through six airports (Delhi, Mumbai, Chennai, Kolkata, Bengaluru, Hyderabad). Apply for the NOC 1–2 weeks ahead.`,
  }),
  "ireland>dubai": (o, d) => ({
    legs: [
      { route: `${o} → Paris / Frankfurt / Amsterdam`, time: "1h 30m–2h", airline: "Air France / Lufthansa / KLM ✓ Cabin out of Dublin" },
      { route: "Layover at the European hub", time: "3h+ (overnight gentler)", airline: "Pet handover buffer" },
      { route: "Hub → Abu Dhabi (AUH)", time: "6–7h", airline: "Etihad ✓ Cabin (under 8 kg)" },
    ],
    note: `Ireland→UAE via a European hub, then Etihad cabin into Abu Dhabi — the only UAE airport that accepts cabin pets. From AUH it's a 90-minute taxi to Dubai. Never fly into Dubai (DXB) directly with a pet: UAE law requires cargo into DXB on all airlines. MOCCAE import permit required, valid 30 days.`,
  }),
  "ireland>caribbean": (o, d) => ({
    legs: [
      { route: `${o} → Paris (CDG) or Amsterdam (AMS)`, time: "1h 30m–2h", airline: "Air France / KLM ✓ Cabin out of Dublin" },
      { route: `European hub → Miami (MIA) or New York (JFK)`, time: "8–9h", airline: "Air France / KLM / Delta ✓ Cabin" },
      { route: `US gateway → ${d}`, time: "1–4h", airline: "JetBlue / American / Delta ✓ Cabin" },
    ],
    note: `Ireland→Caribbean is a three-hop cabin journey via a European hub and then a US gateway. Each Caribbean island has its own import permit — check the specific island well ahead, some need 6–8 weeks of lead time.`,
  }),
  "ireland>mexico": (o, d) => ({
    legs: [
      { route: `${o} → Paris (CDG) or Amsterdam (AMS)`, time: "1h 30m–2h", airline: "Air France / KLM ✓ Cabin out of Dublin" },
      { route: "Layover at the European hub", time: "2–3h+ (overnight gentler)", airline: "Pet handover buffer" },
      { route: "European hub → Mexico City (MEX)", time: "11–12h", airline: "Air France / Lufthansa ✓ Cabin" },
    ],
    note: `Cabin out of Ireland to a European hub, then cabin onward to Mexico. A long journey — an overnight in Europe is gentler on your pet. Mexico is an easy-entry destination: a vet health certificate plus current rabies is usually all that's needed.`,
  }),

  // ----- INDIA outbound -----
  "india>us": (o, d) => ({
    legs: [
      { route: `${o} → Frankfurt (FRA) or Paris (CDG)`, time: "8–9h", airline: "Lufthansa / Air France ✓ Cabin" },
      { route: "Layover at the European hub", time: "3h+ (overnight gentler)", airline: "Pet handover buffer" },
      { route: `Hub → ${d}`, time: "8–10h", airline: "Lufthansa / Air France / Delta ✓ Cabin" },
    ],
    note: `India→USA in cabin routes via a European hub — there's no direct cabin route (Air India is cargo-only to the US, and the 'India→Tokyo→US' cabin route is a myth, JAL/ANA don't take cabin pets internationally). For US entry: dogs need the CDC Dog Import Form, and dogs must be 6+ months old.`,
  }),
  "india>mexico": (o, d) => ({
    legs: [
      { route: `${o} → Frankfurt (FRA) or Paris (CDG)`, time: "8–9h", airline: "Lufthansa / Air France ✓ Cabin" },
      { route: "Layover at the European hub", time: "3h+ (overnight gentler)", airline: "Pet handover buffer" },
      { route: "Hub → Mexico City (MEX)", time: "11–12h", airline: "Air France / Lufthansa ✓ Cabin" },
    ],
    note: `India→Mexico via a European hub, cabin throughout. It's a long journey — build in an overnight stop in Europe. Mexico is an easy destination: a vet health certificate plus current rabies is usually all that's needed.`,
  }),
  "india>caribbean": (o, d) => ({
    legs: [
      { route: `${o} → Frankfurt (FRA) or Paris (CDG)`, time: "8–9h", airline: "Lufthansa / Air France ✓ Cabin" },
      { route: `European hub → Miami (MIA) or New York (JFK)`, time: "8–9h", airline: "Air France / KLM / Lufthansa ✓ Cabin" },
      { route: `US gateway → ${d}`, time: "1–4h", airline: "JetBlue / American / Delta ✓ Cabin" },
    ],
    note: `India→Caribbean is a long three-hop cabin journey via Europe and then a US gateway. Plan for at least one overnight. Each island has its own import rules — check the specific destination, some need months of lead time.`,
  }),
  "india>ireland": (o, d) => ({
    legs: [
      { route: `${o} → Frankfurt (FRA) or Paris (CDG)`, time: "8–9h", airline: "Lufthansa / Air France ✓ Cabin" },
      { route: "European hub → France ferry port", time: "varies", airline: "Pet stays with you" },
      { route: "Ferry to Ireland (Cherbourg/Roscoff → Rosslare/Dublin)", time: "~18h", airline: "Irish Ferries / Brittany Ferries — pet-friendly" },
    ],
    note: `No cabin flight goes INTO Ireland — same rule as the UK. Fly India→Europe in cabin, then take the pet-friendly ferry from France to Ireland. Your pet stays with you for the sea crossing. Ireland needs ISO microchip, rabies ≥21 days, EU Health Certificate, and tapeworm treatment for dogs.`,
  }),

  // ----- UAE (Abu Dhabi) outbound -----
  "dubai>ireland": (o, d) => ({
    legs: [
      { route: `Abu Dhabi (AUH) → Paris / Frankfurt / Amsterdam`, time: "7–8h", airline: "Etihad ✓ Cabin out of Abu Dhabi (under 8 kg)" },
      { route: "European hub → France ferry port", time: "varies", airline: "Pet stays with you" },
      { route: "Ferry to Ireland", time: "~18h", airline: "Irish Ferries / Brittany Ferries — pet-friendly" },
    ],
    note: `Etihad cabin out of Abu Dhabi to a European hub, then the pet-friendly ferry from France into Ireland (no cabin flight goes into Ireland). If your pet is in Dubai, it's a short taxi to Abu Dhabi airport — cabin departures are only from AUH, not DXB.`,
  }),
  "dubai>canada": (o, d) => ({
    legs: [
      { route: `Abu Dhabi (AUH) → Paris / Frankfurt`, time: "7–8h", airline: "Etihad ✓ Cabin out of Abu Dhabi (under 8 kg)" },
      { route: "Layover at the European hub", time: "3h+ (overnight gentler)", airline: "Pet handover buffer" },
      { route: `Hub → ${d}`, time: "7–9h", airline: "Air Canada ✓ Cabin (under 10 kg combined)" },
    ],
    note: `Etihad cabin out of Abu Dhabi to a European hub, then Air Canada cabin onward to Canada. If your pet is in Dubai, take the short taxi to Abu Dhabi — cabin departures are AUH only.`,
  }),
  "dubai>mexico": (o, d) => ({
    legs: [
      { route: `Abu Dhabi (AUH) → Paris / Frankfurt`, time: "7–8h", airline: "Etihad ✓ Cabin out of Abu Dhabi (under 8 kg)" },
      { route: "Layover at the European hub", time: "3h+ (overnight gentler)", airline: "Pet handover buffer" },
      { route: "Hub → Mexico City (MEX)", time: "11–12h", airline: "Air France / Lufthansa ✓ Cabin" },
    ],
    note: `Etihad cabin out of Abu Dhabi to a European hub, then cabin onward to Mexico. A long journey — an overnight in Europe is gentler. Mexico is an easy-entry destination.`,
  }),
  "dubai>caribbean": (o, d) => ({
    legs: [
      { route: `Abu Dhabi (AUH) → Paris / Amsterdam`, time: "7–8h", airline: "Etihad ✓ Cabin out of Abu Dhabi (under 8 kg)" },
      { route: `European hub → Miami (MIA) or New York (JFK)`, time: "8–9h", airline: "Air France / KLM ✓ Cabin" },
      { route: `US gateway → ${d}`, time: "1–4h", airline: "JetBlue / American / Delta ✓ Cabin" },
    ],
    note: `Etihad cabin out of Abu Dhabi, then via a European hub and a US gateway to the Caribbean. Long and multi-leg — plan overnight stops. Each island has its own import permit.`,
  }),

  // ----- MEXICO outbound (additional) -----
  "mexico>ireland": (o, d) => ({
    legs: [
      { route: `${o} → Miami (MIA) or New York (JFK)`, time: "3–4h", airline: "Aeromexico / American ✓ Cabin" },
      { route: `US gateway → Paris (CDG) or Amsterdam (AMS)`, time: "7–9h", airline: "Air France / KLM ✓ Cabin" },
      { route: "European hub → Ireland (ferry from France)", time: "~18h", airline: "Irish Ferries / Brittany Ferries — pet-friendly" },
    ],
    note: `No cabin flight goes into Ireland. Route Mexico → US gateway → European hub in cabin, then the pet-friendly ferry from France into Ireland. A long journey — build in overnight stops.`,
  }),
  "mexico>india": (o, d) => ({
    legs: [
      { route: `${o} → Paris (CDG) or Frankfurt (FRA)`, time: "11–12h", airline: "Air France / Lufthansa ✓ Cabin" },
      { route: "Layover at the European hub", time: "3h+ (overnight gentler)", airline: "Pet handover buffer" },
      { route: `Hub → ${d}`, time: "8–9h", airline: "Lufthansa / Air France ✓ Cabin" },
    ],
    note: `Mexico→India via a European hub, cabin throughout. Long-haul — an overnight in Europe is kinder to your pet. India needs the AQCS NOC and only admits pets through six airports.`,
  }),
  "mexico>dubai": (o, d) => ({
    legs: [
      { route: `${o} → Paris / Frankfurt`, time: "11–12h", airline: "Air France / Lufthansa ✓ Cabin" },
      { route: "Layover at the European hub", time: "3h+ (overnight gentler)", airline: "Pet handover buffer" },
      { route: "Hub → Abu Dhabi (AUH)", time: "6–7h", airline: "Etihad ✓ Cabin (under 8 kg)" },
    ],
    note: `Mexico→UAE via a European hub, then Etihad cabin into Abu Dhabi (the only UAE airport that takes cabin pets). From AUH it's a short taxi to Dubai. Never fly a pet into DXB — cargo-only by UAE law. MOCCAE permit required.`,
  }),
  "mexico>caribbean": (o, d) => ({
    legs: [
      { route: `${o} → Miami (MIA)`, time: "1h 50m–3h", airline: "Aeromexico / American ✓ Cabin" },
      { route: `Miami → ${d}`, time: "1–4h", airline: "JetBlue / American / Delta ✓ Cabin" },
    ],
    note: `Mexico→Caribbean routes neatly through Miami — both legs in cabin. Miami is the natural connecting hub. Each Caribbean island sets its own import rules, so check your specific destination.`,
  }),

  // ----- CARIBBEAN outbound (additional) -----
  "caribbean>ireland": (o, d) => ({
    legs: [
      { route: `${o} → Miami (MIA) or New York (JFK)`, time: "1–4h", airline: "JetBlue / American / Delta ✓ Cabin" },
      { route: `US gateway → Paris (CDG) or Amsterdam (AMS)`, time: "7–9h", airline: "Air France / KLM ✓ Cabin" },
      { route: "European hub → Ireland (ferry from France)", time: "~18h", airline: "Irish Ferries / Brittany Ferries — pet-friendly" },
    ],
    note: `No cabin flight goes into Ireland. Caribbean → US gateway → European hub in cabin, then the pet-friendly ferry from France. Long and multi-leg — plan overnight stops.`,
  }),
  "caribbean>mexico": (o, d) => ({
    legs: [
      { route: `${o} → Miami (MIA)`, time: "1–4h", airline: "JetBlue / American / Delta ✓ Cabin" },
      { route: `Miami → ${d}`, time: "1h 50m–3h", airline: "Aeromexico / American ✓ Cabin" },
    ],
    note: `Caribbean→Mexico routes through Miami — both legs in cabin. Mexico is an easy-entry destination: vet health certificate plus current rabies is usually all that's needed.`,
  }),
  "caribbean>india": (o, d) => ({
    legs: [
      { route: `${o} → Miami (MIA) or New York (JFK)`, time: "1–4h", airline: "JetBlue / American / Delta ✓ Cabin" },
      { route: `US gateway → Frankfurt (FRA) or Paris (CDG)`, time: "8–9h", airline: "Air France / KLM / Lufthansa ✓ Cabin" },
      { route: `European hub → ${d}`, time: "8–9h", airline: "Lufthansa / Air France ✓ Cabin" },
    ],
    note: `Caribbean→India is a long three-hop cabin journey via a US gateway and a European hub. Plan overnight stops. India needs the AQCS NOC and only admits pets through six airports.`,
  }),
  "caribbean>dubai": (o, d) => ({
    legs: [
      { route: `${o} → Miami (MIA) or New York (JFK)`, time: "1–4h", airline: "JetBlue / American / Delta ✓ Cabin" },
      { route: `US gateway → Paris / Frankfurt / Amsterdam`, time: "8–9h", airline: "Air France / KLM / Lufthansa ✓ Cabin" },
      { route: "European hub → Abu Dhabi (AUH)", time: "6–7h", airline: "Etihad ✓ Cabin (under 8 kg)" },
    ],
    note: `Caribbean→UAE via a US gateway and a European hub, then Etihad cabin into Abu Dhabi. From AUH it's a short taxi to Dubai. Never fly a pet into DXB — cargo-only by UAE law.`,
  }),

  // ----- CANADA / UK additional -----
  "canada>ireland": (o, d) => ({
    legs: [
      { route: `${o} → Paris (CDG) or Frankfurt (FRA)`, time: "7–8h", airline: "Air Canada ✓ Cabin (under 10 kg combined)" },
      { route: "European hub → France ferry port", time: "varies", airline: "Pet stays with you" },
      { route: "Ferry to Ireland", time: "~18h", airline: "Irish Ferries / Brittany Ferries — pet-friendly" },
    ],
    note: `No cabin flight goes into Ireland. Air Canada cabin to a European hub, then the pet-friendly ferry from France into Ireland. Ireland needs ISO microchip, rabies ≥21 days, EU Health Certificate, tapeworm treatment for dogs.`,
  }),
  "canada>dubai": (o, d) => ({
    legs: [
      { route: `${o} → Paris / Frankfurt`, time: "7–8h", airline: "Air Canada ✓ Cabin (under 10 kg combined)" },
      { route: "Layover at the European hub", time: "3h+ (overnight gentler)", airline: "Pet handover buffer" },
      { route: "Hub → Abu Dhabi (AUH)", time: "6–7h", airline: "Etihad ✓ Cabin (under 8 kg)" },
    ],
    note: `Air Canada cabin to a European hub, then Etihad cabin into Abu Dhabi — the only UAE airport that accepts cabin pets. From AUH it's a short taxi to Dubai. MOCCAE import permit required, valid 30 days.`,
  }),
  "uk-out>mexico": (o, d) => ({
    legs: [
      { route: `${o} → Paris (CDG) or Amsterdam (AMS)`, time: "1h 15m–1h 30m", airline: "Air France / KLM ✓ Cabin out of the UK" },
      { route: "Layover at the European hub", time: "2–3h+ (overnight gentler)", airline: "Pet handover buffer" },
      { route: "European hub → Mexico City (MEX)", time: "11–12h", airline: "Air France / Lufthansa ✓ Cabin" },
    ],
    note: `Cabin out of the UK to a European hub, then cabin onward to Mexico. Remember: cabin pet departures from the UK are Heathrow and Manchester only — not Gatwick. Mexico is an easy-entry destination.`,
  }),

  // ----- SOUTH AFRICA (honest answer: no cabin option exists internationally) -----
  "us>south-africa": () => ({
    legs: [
      { route: "US → Johannesburg (JNB) or Cape Town (CPT)", time: "15–17h", airline: "⚠ Cargo only — no cabin option exists" },
    ],
    note: `There is no cabin pet route into South Africa on any airline — international pets must travel as manifested cargo. Use an IATA-registered pet shipper. South Africa requires a veterinary import permit, and dogs/cats need rabies titre testing. Lift airline offers cabin for small dogs but ONLY on domestic South African flights, never international.`,
  }),
  "uk-out>south-africa": () => ({
    legs: [
      { route: "UK → Johannesburg (JNB) or Cape Town (CPT)", time: "11–12h", airline: "⚠ Cargo only — no cabin option exists" },
    ],
    note: `No airline flies cabin pets into South Africa — it's cargo only, via an IATA-registered pet shipper. South Africa requires an import permit and rabies titre testing. The UK→South Africa cargo route is well-established; British Airways and others handle it via their cargo divisions.`,
  }),
  "europe>south-africa": () => ({
    legs: [
      { route: "Europe → Johannesburg (JNB) or Cape Town (CPT)", time: "10–11h", airline: "⚠ Cargo only — no cabin option exists" },
    ],
    note: `No cabin pet route into South Africa exists on any airline — pets travel as manifested cargo. Lufthansa Cargo and KLM Cargo both handle the Europe→South Africa route. An import permit and rabies titre test are required.`,
  }),

  // ----- HAWAII (US territory — routes via US mainland, plus strict quarantine) -----
  "uk-out>hawaii": (o, d) => ({
    legs: [
      { route: `${o} → Paris (CDG) or Amsterdam (AMS)`, time: "1h 15m–1h 30m", airline: "Air France / KLM ✓ Cabin out of the UK" },
      { route: "European hub → US mainland gateway", time: "8–11h", airline: "Air France / KLM / Delta ✓ Cabin" },
      { route: "US mainland → Honolulu (HNL)", time: "5–6h", airline: "Hawaiian / Delta / United ✓ Cabin" },
    ],
    note: `Hawaii has the strictest pet import rules of any US destination — a 5-day-or-less quarantine program that requires months of pre-planning (rabies titre test, specific microchip, paperwork sent ahead). Start the Hawaii Department of Agriculture process at least 4–5 months early. The flight routing itself is cabin all the way via Europe and the US mainland.`,
  }),
  "europe>hawaii": (o, d) => ({
    legs: [
      { route: `${o} → US mainland gateway`, time: "8–11h", airline: "Air France / KLM / Lufthansa / Delta ✓ Cabin" },
      { route: "Layover at the US gateway", time: "3h+ (overnight gentler)", airline: "Pet handover buffer" },
      { route: "US mainland → Honolulu (HNL)", time: "5–6h", airline: "Hawaiian / Delta / United ✓ Cabin" },
    ],
    note: `Europe→Hawaii is cabin all the way via a US mainland gateway. The hard part isn't the flying — it's Hawaii's strict quarantine program. Start the Hawaii Department of Agriculture "5-Day-Or-Less" process 4–5 months ahead: rabies titre test, ISO microchip, and paperwork submitted in advance.`,
  }),
};

// Airports that are CARGO-ONLY for pets — no airline flies cabin pets in or
// out of them. They stay in REGION_HUBS so routes touching them still match
// the right region, but the generator must NOT use them as a cabin origin or
// a cabin destination (doing so would imply a cabin route that can't exist).
// Dubai (DXB): UAE law requires cargo into DXB for all airlines.
const CARGO_ONLY_AIRPORTS = ["(DXB)"];
const isCargoOnly = (airport) =>
  CARGO_ONLY_AIRPORTS.some((code) => airport.includes(code));

// Catch-all fallbacks for region pairs without an explicit strategy. These
// cover the long-tail routes (mostly Hawaii and South Africa) where the
// honest answer is consistent regardless of exact origin: South Africa is
// always cargo-only internationally, and Hawaii always routes via the US
// mainland with its strict quarantine programme. Hand-writing 30+ near-
// identical functions adds no value — these generic builders give an
// accurate answer for any origin.
const FALLBACK_STRATEGIES = {
  // Any destination = South Africa
  "south-africa": (o, d) => ({
    legs: [
      { route: `${o} → Johannesburg (JNB) or Cape Town (CPT)`, time: "varies — long-haul", airline: "⚠ Cargo only — no cabin option exists on any airline" },
    ],
    note: `There is no cabin pet route into South Africa on any airline — international pets must travel as manifested cargo, arranged through an IATA-registered pet shipper. South Africa requires a veterinary import permit and rabies titre testing done well in advance. (Lift airline offers cabin for small dogs, but ONLY on domestic South African flights — never international.)`,
  }),
  // Any origin = South Africa
  "south-africa-out": (o, d) => ({
    legs: [
      { route: `Johannesburg (JNB) or Cape Town (CPT) → ${d}`, time: "varies — long-haul", airline: "⚠ Cargo only — no cabin option exists on any airline" },
    ],
    note: `No airline flies cabin pets out of South Africa internationally — your pet travels as manifested cargo via an IATA-registered pet shipper. Plan ahead: the destination country's import paperwork (permits, health certificates, sometimes rabies titre tests) must all be in order before travel.`,
  }),
  // Any destination = Hawaii
  "hawaii": (o, d) => ({
    legs: [
      { route: `${o} → US mainland gateway`, time: "varies", airline: "Cabin where a route exists — otherwise route via a hub first" },
      { route: "Layover at the US gateway", time: "3h+ (overnight gentler)", airline: "Pet handover buffer" },
      { route: "US mainland → Honolulu (HNL)", time: "5–6h", airline: "Hawaiian / Delta / United ✓ Cabin" },
    ],
    note: `Hawaii routes through a US mainland gateway. The flying is the easy part — Hawaii has the strictest pet import rules of any US destination, a "5-Day-Or-Less" quarantine programme that needs 4–5 months of preparation: rabies titre test, ISO microchip, and paperwork submitted to the Hawaii Department of Agriculture in advance. Start early.`,
  }),
  // Any origin = Hawaii
  "hawaii-out": (o, d) => ({
    legs: [
      { route: `Honolulu (HNL) → US mainland gateway`, time: "5–6h", airline: "Hawaiian / Delta / United ✓ Cabin" },
      { route: "Layover at the US gateway", time: "3h+ (overnight gentler)", airline: "Pet handover buffer" },
      { route: `US mainland → ${d}`, time: "varies", airline: "Cabin where a route exists — see that region's routes" },
    ],
    note: `Leaving Hawaii is simpler than arriving — fly cabin to a US mainland gateway, then connect onward. From the mainland, follow the normal routing for your destination region. No special Hawaii exit paperwork beyond the standard requirements for your destination country.`,
  }),
  // Any destination = South America
  "south-america": (o, d) => {
    // Determine specific SA destination from the destination string
    const dLower = (d || "").toLowerCase();
    const oLower = (o || "").toLowerCase();
    const isFromUS = /jfk|lax|mia|ord|sfo|bos|iah|dfw|atl|new york|miami|los angeles|chicago|san francisco|boston|houston|dallas|atlanta/i.test(o || "");
    const isFromEurope = /lhr|cdg|fra|ams|mad|fco|zrh|bcn|man|edi|dub|vie|cph|arn|osl|hel|wAW|london|paris|frankfurt|amsterdam|madrid|rome|zurich|barcelona/i.test(o || "");

    let legs = [], hubDescription, importNote;

    if (dLower.includes("bogot") || dLower.includes("bog")) {
      if (isFromUS) {
        legs = [{ route: `${o} → Bogotá El Dorado (BOG)`, time: "5h 30m – 7h", airline: "Avianca ✓ Cabin (under 10 kg)" }];
        hubDescription = "Avianca runs direct cabin pet routes from JFK, MIA, LAX, IAH, BOS, ORD, MCO into Bogotá. American Airlines and LATAM are cargo only on this route — Avianca is your cabin option.";
      } else if (isFromEurope) {
        legs = [{ route: `${o} → Bogotá El Dorado (BOG)`, time: "10h+", airline: "Avianca or Iberia ✓ Cabin (under 10 kg)" }];
        hubDescription = "Avianca direct from Madrid and London. Iberia direct from Madrid. Both carry cabin pets.";
      } else {
        legs = [
          { route: `${o} → US gateway (MIA / JFK / IAH)`, time: "varies", airline: "Avianca ✓ Cabin or position via your own carrier" },
          { route: "US gateway → Bogotá (BOG)", time: "5h 30m – 7h", airline: "Avianca ✓ Cabin (under 10 kg)" },
        ];
        hubDescription = "Best routing is via a US gateway on Avianca cabin.";
      }
      importNote = "Colombia: ISO microchip + rabies 30+ days + USDA-endorsed health certificate. Pit Bull, Staffordshire, and American Staffordshire breeds are BANNED from import by law.";
    } else if (dLower.includes("são paulo") || dLower.includes("sao paulo") || dLower.includes("gru") || dLower.includes("rio") || dLower.includes("gig")) {
      if (isFromUS) {
        legs = [
          { route: `${o} → Madrid (MAD) or Panama City (PTY)`, time: "7-9h or 5-6h", airline: "Iberia cabin to MAD, or Copa cabin to PTY (under 10 kg)" },
          { route: "Hub → São Paulo (GRU)", time: "10h or 7h", airline: "Iberia from MAD, or Copa from PTY ✓ Cabin" },
        ];
        hubDescription = "US ↔ Brazil cabin routes via LATAM are currently SUSPENDED due to CDC dog rules (verify before booking). American Airlines and Delta are cargo only to Brazil. The cabin workaround: via Madrid on Iberia, or via Panama City on Copa.";
      } else if (isFromEurope) {
        legs = [{ route: `${o} → São Paulo (GRU)`, time: "11-12h", airline: "Iberia, Air France, KLM, or Lufthansa ✓ Cabin (under 8 kg)" }];
        hubDescription = "Europe → Brazil direct is well-served by major EU carriers with cabin pets. Madrid (Iberia), Paris (Air France), Amsterdam (KLM), and Frankfurt (Lufthansa) all run direct cabin routes to GRU.";
      } else {
        legs = [{ route: `${o} → São Paulo (GRU)`, time: "varies — long-haul", airline: "LATAM ✓ Cabin (under 7 kg)" }];
        hubDescription = "LATAM is the natural carrier within South America.";
      }
      importNote = "Brazil: the EASIEST South American entry — rabies 21+ days, USDA-endorsed health certificate. Microchip NOT required (but strongly recommended). Pit Bulls restricted in Rio de Janeiro specifically.";
    } else if (dLower.includes("buenos aires") || dLower.includes("eze")) {
      if (isFromUS) {
        legs = [
          { route: `${o} → Panama City (PTY)`, time: "5-6h", airline: "Copa ✓ Cabin (under 10 kg)" },
          { route: "Panama City (PTY) → Buenos Aires (EZE)", time: "8h 30m", airline: "Copa ✓ Cabin (under 10 kg)" },
        ];
        hubDescription = "LATAM cabin US ↔ Argentina is currently suspended. The reliable cabin route is via Panama City on Copa Airlines, end-to-end on the same Copa-operated itinerary.";
      } else if (isFromEurope) {
        legs = [{ route: `${o} → Buenos Aires (EZE)`, time: "13-14h", airline: "Iberia, Air France, or Lufthansa ✓ Cabin (under 8 kg)" }];
        hubDescription = "Madrid (Iberia), Paris (Air France), and Frankfurt (Lufthansa) all run direct cabin routes to EZE.";
      } else {
        legs = [{ route: `${o} → Buenos Aires (EZE)`, time: "varies", airline: "LATAM ✓ Cabin (under 7 kg)" }];
        hubDescription = "LATAM connects most of South America to Buenos Aires in cabin.";
      }
      importNote = "Argentina: ISO microchip + rabies 30+ days + SENASA-accepted health certificate (USDA-endorsed for US origin). No quarantine, no breed bans.";
    } else if (dLower.includes("santiago") || dLower.includes("scl")) {
      if (isFromUS) {
        legs = [{ route: `${o} → Santiago (SCL)`, time: "9-11h", airline: "LATAM ✓ Cabin (under 7 kg)" }];
        hubDescription = "LATAM runs direct cabin pet flights from JFK, MIA, LAX to Santiago. Chile is NOT on the CDC suspension list for LATAM cabin pets.";
      } else if (isFromEurope) {
        legs = [{ route: `${o} → Santiago (SCL)`, time: "14h+", airline: "Iberia or LATAM ✓ Cabin (under 7 kg)" }];
        hubDescription = "Madrid (Iberia, LATAM) and Frankfurt (LATAM) run direct cabin routes to Santiago.";
      } else {
        legs = [{ route: `${o} → Santiago (SCL)`, time: "varies", airline: "LATAM ✓ Cabin (under 7 kg)" }];
        hubDescription = "LATAM is the natural Chilean cabin carrier.";
      }
      importNote = "Chile: ISO microchip + rabies 30+ days + SAG pre-arranged import permit (apply 30+ days ahead) + USDA-endorsed health certificate.";
    } else if (dLower.includes("lima") || dLower.includes("lim")) {
      if (isFromUS) {
        legs = [{ route: `${o} → Lima (LIM)`, time: "6-8h", airline: "LATAM or Avianca via Bogotá ✓ Cabin" }];
        hubDescription = "LATAM direct from MIA (cabin reliable). Avianca cabin via Bogotá from JFK/LAX is the alternative. Copa via Panama also works.";
      } else if (isFromEurope) {
        legs = [
          { route: `${o} → Madrid (MAD)`, time: "varies", airline: "Iberia, Air France, KLM, Lufthansa ✓ Cabin (under 8 kg)" },
          { route: "Madrid (MAD) → Lima (LIM)", time: "12h", airline: "LATAM or Iberia ✓ Cabin" },
        ];
        hubDescription = "Madrid is the European cabin gateway to Lima.";
      } else {
        legs = [{ route: `${o} → Lima (LIM)`, time: "varies", airline: "LATAM or Avianca ✓ Cabin" }];
        hubDescription = "LATAM and Avianca both serve Lima in cabin.";
      }
      importNote = "Peru: ISO microchip + rabies 30+ days + SENASA pre-arranged import permit (apply 30+ days ahead) + USDA-endorsed health certificate.";
    } else if (dLower.includes("montevideo") || dLower.includes("mvd")) {
      if (isFromUS) {
        legs = [
          { route: `${o} → Panama City (PTY)`, time: "5-6h", airline: "Copa ✓ Cabin (under 10 kg)" },
          { route: "Panama City (PTY) → Montevideo (MVD)", time: "7h 30m", airline: "Copa ✓ Cabin (under 10 kg)" },
        ];
        hubDescription = "Copa Airlines via Panama City is the ONLY practical cabin route to Montevideo. Book end-to-end on the same Copa-operated itinerary — no codeshares (Copa won't transit pets through Panama on third-party tickets).";
      } else if (isFromEurope) {
        legs = [
          { route: `${o} → Madrid (MAD)`, time: "varies", airline: "Iberia, Air France, KLM, Lufthansa ✓ Cabin" },
          { route: "Madrid (MAD) → Montevideo (MVD)", time: "13h", airline: "Iberia ✓ Cabin (under 8 kg)" },
        ];
        hubDescription = "Iberia direct Madrid → Montevideo is the European cabin route. Or use Copa via Panama City after reaching the US.";
      } else {
        legs = [
          { route: `${o} → Buenos Aires (EZE) or Panama City (PTY)`, time: "varies", airline: "LATAM or Copa ✓ Cabin" },
          { route: "Hub → Montevideo (MVD)", time: "1h or 7h 30m", airline: "LATAM from EZE, or Copa from PTY ✓ Cabin" },
        ];
        hubDescription = "Buenos Aires is the closest international hub (1-hour hop), Panama City is the broader-reach option.";
      }
      importNote = "Uruguay: ISO microchip + rabies 30+ days + MGAP health certificate (USDA-endorsed for US origin). No quarantine.";
    } else {
      legs = [{ route: `${o} → ${d}`, time: "varies — long-haul", airline: "LATAM (7 kg), Avianca (10 kg), or Copa via Panama (10 kg) ✓ Cabin" }];
      hubDescription = "From the US: LATAM direct (where not suspended), Copa via PTY, or Avianca via BOG. From Europe: Iberia, Air France, KLM, Lufthansa cabin to major SA hubs.";
      importNote = "Each South American country has its own paperwork. Brazil is the most lenient; Argentina, Chile, Peru, Uruguay all need ISO microchips and 30+ day rabies waits.";
    }
    return {
      legs,
      note: `${hubDescription} ${importNote} Brachycephalic dogs cannot fly cargo on LATAM, Avianca, or Copa — cabin only.`,
    };
  },
  // Any origin = South America
  "south-america-out": (o, d) => {
    const oLower = (o || "").toLowerCase();
    const dLower = (d || "").toLowerCase();
    const isToUS = /jfk|lax|mia|ord|sfo|bos|iah|dfw|atl|new york|miami|los angeles|chicago|san francisco|boston|houston|dallas|atlanta/i.test(d || "");
    const isToEurope = /lhr|cdg|fra|ams|mad|fco|zrh|bcn|man|edi|dub|london|paris|frankfurt|amsterdam|madrid|rome|zurich|barcelona/i.test(d || "");
    const isToUK = /lhr|lgw|man|edi|london|manchester|edinburgh|glasgow|birmingham/i.test(d || "");

    let legs = [], note;

    if (isToUK) {
      legs = [
        { route: `${o} → Madrid (MAD) or Paris (CDG)`, time: "10-14h", airline: "Iberia, LATAM, Air France, Avianca ✓ Cabin (under 8-10 kg)" },
        { route: "Hub → Calais (drive/taxi)", time: "2h 30m", airline: "Pet stays with you" },
        { route: "Eurotunnel Folkestone → UK", time: "35 min", airline: "Pet stays in your vehicle ✓" },
      ];
      note = "No commercial airline allows pets in the cabin INTO the UK — this is UK government policy. Cabin all the way to a continental EU hub, then Eurotunnel Le Shuttle is the workaround. Tapeworm treatment 24-120 hours before UK arrival is mandatory for dogs.";
    } else if (isToUS) {
      if (oLower.includes("são paulo") || oLower.includes("sao paulo") || oLower.includes("gru")) {
        legs = [
          { route: `${o} → Madrid (MAD) or Panama City (PTY)`, time: "10h or 7h", airline: "Iberia cabin to MAD, or Copa cabin to PTY" },
          { route: `Hub → ${d}`, time: "7-9h", airline: "Iberia, Air France, KLM, or Copa ✓ Cabin" },
        ];
        note = "Brazil → US cabin via LATAM is currently suspended (CDC dog rules). The cabin workaround: via Madrid on Iberia, or via Panama City on Copa. Brazil → US needs USDA-accepted documentation; check current CDC dog rules.";
      } else if (oLower.includes("bogot") || oLower.includes("bog")) {
        legs = [{ route: `${o} → ${d}`, time: "5-7h", airline: "Avianca ✓ Cabin (under 10 kg)" }];
        note = "Avianca direct from Bogotá to most US gateways (JFK, MIA, LAX, IAH, BOS, ORD, MCO) in cabin. Standard US re-entry: CDC Dog Import Form online (dogs only, cats exempt). Colombia is not on the CDC high-risk list.";
      } else if (oLower.includes("montevideo") || oLower.includes("mvd") || oLower.includes("buenos aires") || oLower.includes("eze")) {
        legs = [
          { route: `${o} → Panama City (PTY)`, time: "7-8h", airline: "Copa ✓ Cabin (under 10 kg)" },
          { route: `Panama City (PTY) → ${d}`, time: "5-6h", airline: "Copa ✓ Cabin (under 10 kg)" },
        ];
        note = "Copa Airlines via Panama City is the cabin workaround for southern South America to the US. Single Copa itinerary end-to-end. Standard US re-entry paperwork.";
      } else {
        legs = [{ route: `${o} → ${d}`, time: "varies", airline: "LATAM, Avianca, or Copa via PTY ✓ Cabin" }];
        note = "Direct cabin routes exist on LATAM (where not suspended), Avianca, or Copa via Panama. Verify current LATAM US suspension status before booking.";
      }
    } else if (isToEurope) {
      legs = [{ route: `${o} → Madrid (MAD) or Paris (CDG) or Frankfurt (FRA)`, time: "11-14h", airline: "Iberia, LATAM, Air France, Lufthansa, or Avianca ✓ Cabin" }];
      note = "South America → Europe is well-served in cabin. Madrid (Iberia, LATAM, Avianca), Paris (Air France), Frankfurt (Lufthansa, LATAM) and Amsterdam (KLM) all run direct cabin pet routes. EU Health Certificate required (issued by accredited vet, valid 10 days).";
    } else {
      legs = [{ route: `${o} → ${d}`, time: "varies — long-haul", airline: "LATAM, Avianca, or Copa via Panama ✓ Cabin" }];
      note = "Leaving South America for the Americas or Europe is cabin-friendly. For Asia: cargo only — no commercial cabin pet routes from South America to Asia.";
    }
    return {
      legs,
      note: `${note} Brachycephalic dogs cannot fly cargo on LATAM, Avianca, or Copa — cabin only.`,
    };
  },
  // Any destination = Central America (Panama)
  "central-america": (o, d) => ({
    legs: [
      { route: `${o} → Panama City (PTY)`, time: "varies", airline: "Copa Airlines is the dominant cabin pet carrier (10 kg combined, $125 international). Also: American, Delta, United and Avianca serve Panama with cabin pets from the US." },
    ],
    note: `Panama is primarily used as a transit hub for cabin pet travel to deeper South America (Uruguay, Paraguay, Bolivia) via Copa Airlines, but it's also a destination in its own right. For entry to Panama: rabies vaccine 30+ days old, ISO microchip recommended, health certificate from origin country's official authority within 10 days. Pets transiting Panama on the same Copa-operated itinerary don't formally enter the country. Panama is not on the CDC high-risk list for rabies (April 2026).`,
  }),
  // Any origin = Central America
  "central-america-out": (o, d) => ({
    legs: [
      { route: `Panama City (PTY) → ${d}`, time: "varies", airline: "Copa Airlines is the main cabin pet carrier from Panama. From PTY: cabin to all major SA hubs, US, Mexico, Canada, Caribbean and Central America." },
    ],
    note: `Leaving Panama with a pet: Copa's network covers nearly all of the Americas with cabin pets under 10 kg. Useful onward connections: PTY → Montevideo (Uruguay), PTY → Buenos Aires, PTY → Santiago, PTY → São Paulo, PTY → Lima, PTY → Bogotá. The destination country's import paperwork applies normally.`,
  }),
  // Any destination = Mexico (generic fallback when not handled by REGION_PAIR_STRATEGIES)
  "mexico": (o, d) => {
    const dLower = (d || "").toLowerCase();
    let leg, hub;
    if (dLower.includes("cancun") || dLower.includes("cancún") || dLower.includes("cun")) {
      leg = { route: `${o} → Cancún (CUN)`, time: "varies", airline: "American, Delta, United, JetBlue, Spirit, Aeromexico, Air Canada ✓ Cabin" };
      hub = "Cancún is one of the easiest Mexican entry points — heavy US carrier service in cabin.";
    } else if (dLower.includes("guadalajara") || dLower.includes("gdl")) {
      leg = { route: `${o} → Guadalajara (GDL)`, time: "varies", airline: "Aeromexico, Volaris, American, United ✓ Cabin" };
      hub = "Guadalajara is well-served from US gateways with cabin pets.";
    } else {
      leg = { route: `${o} → Mexico City (MEX)`, time: "varies", airline: "Aeromexico (9 kg), Volaris (12 kg, no brachy), American, Delta, United, Air Canada, Copa, Iberia ✓ Cabin" };
      hub = "Mexico City is the main international cabin pet hub for Mexico.";
    }
    return {
      legs: [leg],
      note: `${hub} Mexico is one of the easier international destinations for cabin pet travel. SENASICA Health Certificate from an accredited vet within 10 days of travel, rabies vaccine on record. No quarantine, no import permit. SADER/SENASICA inspect pets free of charge on arrival. Pets must be at least 3 months old. No microchip required for entry (though strongly recommended for return travel and identification).`,
    };
  },
  // Any origin = Mexico
  "mexico-out": (o, d) => {
    const dLower = (d || "").toLowerCase();
    const isToUS = /jfk|lax|mia|ord|sfo|bos|iah|dfw|atl|new york|miami|los angeles|chicago|san francisco|boston|houston|dallas|atlanta/i.test(d || "");
    const isToEurope = /lhr|cdg|fra|ams|mad|fco|zrh|bcn|london|paris|frankfurt|amsterdam|madrid|rome|zurich|barcelona/i.test(d || "");
    let leg, note;
    if (isToUS) {
      leg = { route: `${o} → ${d}`, time: "2-6h", airline: "American, Delta, United, Aeromexico, JetBlue, Spirit, Volaris (no brachy) ✓ Cabin" };
      note = "Mexico → US in cabin is one of the easiest cross-border routes. CDC Dog Import Form online (dogs only, cats exempt). Mexico is NOT on the CDC high-risk rabies list.";
    } else if (isToEurope) {
      leg = { route: `${o} → ${d}`, time: "10-12h", airline: "Aeromexico (to MAD), Iberia, Air France, KLM ✓ Cabin" };
      note = "Aeromexico Mexico City → Madrid is the direct cabin route. Iberia, Air France, KLM also run cabin pets MEX → Europe. EU Health Certificate (10 days) plus rabies 21+ days required.";
    } else if (dLower.includes("tokyo") || dLower.includes("nrt") || dLower.includes("hnd")) {
      leg = { route: `${o} → Tokyo (NRT)`, time: "13h", airline: "Aeromexico ✓ Cabin (under 9 kg)" };
      note = "Aeromexico MEX → NRT direct cabin is one of the very few Pacific cabin pet routes. Japan import paperwork (180-day rabies titer wait, ISO microchip before first rabies, FAVN test) is the binding constraint — start preparation 7+ months ahead.";
    } else {
      leg = { route: `${o} → ${d}`, time: "varies", airline: "Aeromexico, Volaris (no brachy), or US carrier connection ✓ Cabin" };
      note = "Aeromexico has the broadest cabin pet network from Mexico. For deeper South America, connect via Panama City on Copa. For Japan, Aeromexico direct.";
    }
    return { legs: [leg], note };
  },
  // Any destination = Japan
  "japan": (o, d) => {
    const dLower = (d || "").toLowerCase();
    const oLower = (o || "").toLowerCase();
    const isFromUS = /jfk|lax|mia|ord|sfo|bos|iah|dfw|atl|sea|new york|miami|los angeles|chicago|san francisco|boston|houston|dallas|atlanta|seattle/i.test(o || "");
    const isFromKorea = /icn|seoul/i.test(o || "");
    const isFromMexico = /mex|mexico city|gdl|guadalajara/i.test(o || "");
    let leg, hub;
    let arrivalPort = "Tokyo Narita (NRT)";
    if (dLower.includes("haneda") || dLower.includes("hnd")) arrivalPort = "Tokyo Haneda (HND)";
    else if (dLower.includes("kansai") || dLower.includes("kix") || dLower.includes("osaka")) arrivalPort = "Osaka Kansai (KIX)";
    else if (dLower.includes("nagoya") || dLower.includes("ngo")) arrivalPort = "Nagoya Chubu (NGO)";
    else if (dLower.includes("fukuoka") || dLower.includes("fuk")) arrivalPort = "Fukuoka (FUK)";

    if (isFromUS) {
      leg = { route: `${o} → ${arrivalPort}`, time: "11-13h", airline: "United ✓ Cabin (no weight limit — pet must fit under seat) — one of very few US ↔ Japan cabin pet airlines" };
      hub = "United is uniquely the only US carrier offering cabin pets to Japan direct (SFO/ORD/IAD ↔ NRT/HND/KIX). JAL and ANA are cargo-only for pets. American, Delta, Hawaiian are not approved for Japan cabin pet routing.";
    } else if (isFromKorea) {
      leg = { route: `${o} → ${arrivalPort}`, time: "2-3h", airline: "Korean Air (7 kg), T'Way (9 kg), or Air Premia ✓ Cabin" };
      hub = "Korea ↔ Japan is one of the best cabin pet paths for Japan entry. Korean Air's max cabin weight is 7 kg, T'Way's is 9 kg.";
    } else if (isFromMexico) {
      leg = { route: `${o} → Tokyo Narita (NRT)`, time: "13h", airline: "Aeromexico ✓ Cabin (under 9 kg)" };
      hub = "Aeromexico Mexico City → NRT direct cabin is one of the very few Pacific cabin pet routes. Snub-nosed breeds welcome in cabin.";
    } else {
      leg = { route: `${o} → ${arrivalPort}`, time: "varies — long-haul", airline: "Most international airlines are CARGO-ONLY into Japan. Cabin: United (from US), Korean Air/T'Way (via Seoul ICN), Aeromexico (from Mexico)" };
      hub = "Route via Korea on Korean Air or via the US on United — most other airlines (JAL, ANA, Lufthansa, BA, Air France, KLM) are cargo-only into Japan.";
    }
    return {
      legs: [leg],
      note: `${hub} The 180-day rabies-titer wait is the binding constraint — start preparation 7+ months before your arrival date. AQS Advance Notification must be submitted ≥40 days before arrival, FAVN titer ≥0.5 IU/ml, two rabies vaccines, ISO microchip implanted before the first vaccine. Get any of this wrong and your pet is detained up to 180 days at your expense.`,
    };
  },
  // Any origin = Japan
  "japan-out": (o, d) => {
    const dLower = (d || "").toLowerCase();
    const isToUS = /jfk|lax|mia|ord|sfo|bos|iah|dfw|atl|sea|new york|miami|los angeles|chicago|san francisco|boston|houston|dallas|atlanta|seattle/i.test(d || "");
    const isToKorea = /icn|seoul/i.test(d || "");
    const isToMexico = /mex|mexico city/i.test(d || "");
    let leg, note;
    if (isToUS) {
      leg = { route: `${o} → ${d}`, time: "10-12h", airline: "United ✓ Cabin (no weight limit, pet under seat) — one of few US-Japan cabin pet routes" };
      note = "United is the cabin pet option from Japan to US. JAL and ANA are cargo-only. CDC Dog Import Form online for US re-entry (dogs only).";
    } else if (isToKorea) {
      leg = { route: `${o} → ${d}`, time: "2-3h", airline: "Korean Air (7 kg), T'Way (9 kg), Air Premia ✓ Cabin" };
      note = "Japan → Korea is a short, well-served cabin route — and from Seoul you can connect onward on Korean Air's 30+ country cabin network.";
    } else if (isToMexico) {
      leg = { route: `${o} → Mexico City (MEX)`, time: "13h", airline: "Aeromexico ✓ Cabin (under 9 kg)" };
      note = "Aeromexico Japan → Mexico City direct cabin route. Mexico is one of the easier entry countries for pets.";
    } else {
      // For UK, EU, other destinations — need a connection via Korea or US
      leg = { route: `${o} → Seoul (ICN) → ${d}`, time: "varies", airline: "Leg 1: Korean Air ✓ Cabin (under 7 kg). Leg 2: Korean Air cabin connection (or other carrier)" };
      note = "Direct cabin pets Japan → UK/EU don't exist (BA, Lufthansa, AF, KLM are all cargo-only out of Japan). The cabin workaround is via Seoul on Korean Air, then onward on Korean Air's cabin network to your destination.";
    }
    return {
      legs: [leg],
      note: `${note} Leaving Japan: apply for AQS export inspection at least 2 weeks before flight. Export Quarantine Certificate is valid 180 days.`,
    };
  },
};

// A region-pair can have ONE strategy (a single function) or SEVERAL (an array
// of functions) — e.g. UK→US has both a European-hub route AND a via-Montreal
// route. This normalises either shape to an array so callers can map over it.
function strategiesFor(originRegion, destRegion) {
  const v = REGION_PAIR_STRATEGIES[`${originRegion}>${destRegion}`];
  if (v) return Array.isArray(v) ? v : [v];
  // No explicit strategy — try the catch-all fallbacks for the long-tail
  // routes (Hawaii, South Africa). Destination match takes priority over
  // origin match, since the destination's rules are usually the binding
  // constraint (e.g. South Africa cargo-only, Hawaii quarantine).
  if (destRegion === "south-africa") return [FALLBACK_STRATEGIES["south-africa"]];
  if (destRegion === "hawaii") return [FALLBACK_STRATEGIES["hawaii"]];
  if (destRegion === "japan") return [FALLBACK_STRATEGIES["japan"]];
  if (destRegion === "south-america") return [FALLBACK_STRATEGIES["south-america"]];
  if (destRegion === "central-america") return [FALLBACK_STRATEGIES["central-america"]];
  if (destRegion === "mexico") return [FALLBACK_STRATEGIES["mexico"]];
  if (originRegion === "south-africa") return [FALLBACK_STRATEGIES["south-africa-out"]];
  if (originRegion === "hawaii") return [FALLBACK_STRATEGIES["hawaii-out"]];
  if (originRegion === "japan") return [FALLBACK_STRATEGIES["japan-out"]];
  if (originRegion === "south-america") return [FALLBACK_STRATEGIES["south-america-out"]];
  if (originRegion === "central-america") return [FALLBACK_STRATEGIES["central-america-out"]];
  if (originRegion === "mexico") return [FALLBACK_STRATEGIES["mexico-out"]];
  return [];
}

// Generate concrete city-level workarounds for a region pair, covering EVERY
// key destination airport AND every strategy for the pair. Returns [] if
// there's no strategy.
function generateWorkarounds(origin, destination) {
  const strategies = strategiesFor(origin, destination);
  if (!strategies.length) return [];
  const originHubs = REGION_HUBS[origin] || [];
  const destHubs = REGION_HUBS[destination] || [];
  if (!originHubs.length || !destHubs.length) return [];

  // Representative origin: the first hub that ISN'T cargo-only. For the UAE
  // this resolves to Abu Dhabi (AUH), never Dubai (DXB).
  const originHub = originHubs.find((h) => !isCargoOnly(h)) || originHubs[0];
  // One workaround per (destination airport × strategy) — skipping cargo-only
  // destination airports.
  const out = [];
  destHubs
    .filter((destHub) => !isCargoOnly(destHub))
    .forEach((destHub) => {
      strategies.forEach((strategy) => {
        const built = strategy(originHub, destHub);
        // Infer transit regions from the leg routes so the per-route
        // checklist picks up transit-country paperwork (e.g. France's EU
        // rules for a US→UK route that pivots through Paris).
        const transitRegions = inferTransitRegionsFromLegs(built.legs, origin, destination);
        out.push({
          from: originHub,
          to: destHub,
          duration: "see legs",
          legs: built.legs,
          note: built.note,
          label: built.label || null,
          generated: true,
          tags: [origin, destination, ...transitRegions],
        });
      });
    });
  return out;
}

// Every generated workaround across all strategy pairs — used by the Routes
// section so its workaround list has the same guaranteed coverage floor as
// the journey planner.
const ALL_GENERATED_WORKAROUNDS = Object.keys(REGION_PAIR_STRATEGIES).flatMap((key) => {
  const [origin, destination] = key.split(">");
  return generateWorkarounds(origin, destination);
});

// AIRPORT-LEVEL workaround generation. Given the EXACT origin and destination
// airport codes the user picked, build EVERY applicable workaround for that
// exact pair — no regional "representative" substitution, and all strategies
// (e.g. UK→US returns both the Europe-hub route and the via-Montreal route).
function generateWorkaroundsForAirportPair(originCode, destCode) {
  const oA = airportByCode(originCode);
  const dA = airportByCode(destCode);
  if (!oA || !dA) return [];
  const strategies = strategiesFor(oA.region, dA.region);
  if (!strategies.length) return [];
  const oLabel = `${oA.city} (${oA.code})`;
  const dLabel = `${dA.city} (${dA.code})`;
  return strategies.map((strategy) => {
    const built = strategy(oLabel, dLabel);
    const transitRegions = inferTransitRegionsFromLegs(built.legs, oA.region, dA.region);
    return {
      from: oLabel,
      to: dLabel,
      duration: "see legs",
      legs: built.legs,
      note: built.note,
      label: built.label || null,
      generated: true,
      tags: [oA.region, dA.region, ...transitRegions],
    };
  });
}

// Find the hand-written direct route(s) for an exact airport pair.
function directRoutesForAirportPair(originCode, destCode) {
  const oA = airportByCode(originCode);
  const dA = airportByCode(destCode);
  if (!oA || !dA) return [];
  return DIRECT_ROUTES.filter((r) => {
    const fromHasCode = r.from.includes(`(${originCode})`);
    const toHasCode = r.to.includes(`(${destCode})`);
    return fromHasCode && toHasCode;
  });
}

// Find hand-written workaround(s) for an exact airport pair.
function handWrittenWorkaroundsForAirportPair(originCode, destCode) {
  return WORKAROUND_ROUTES_TABLE.filter((r) => {
    const fromHasCode = r.from.includes(`(${originCode})`);
    const toHasCode = r.to.includes(`(${destCode})`);
    return fromHasCode && toHasCode;
  });
}

// Find hand-written workarounds that go to the EXACT destination airport but
// depart from a DIFFERENT airport in the same origin country. These are real
// routes worth showing (e.g. a hand-written Heathrow→Montreal→Miami when the
// user picked Manchester→Miami) — but ONLY when the destination matches, and
// ONLY when the origin genuinely differs. This prevents two bugs:
//   1. Suggesting "London→New York" when the user asked for Miami.
//   2. Offering to "adapt the route" when the origin already matches exactly.
function regionLevelHandWrittenWorkarounds(originCode, destCode) {
  const oA = airportByCode(originCode);
  const dA = airportByCode(destCode);
  if (!oA || !dA) return [];
  const originRegionKeywords = {
    "uk-out": ["London", "Manchester", "Newcastle", "(LHR)", "(MAN)", "(LGW)", "(NCL)", "UK"],
    "ireland": ["Dublin", "(DUB)", "Ireland"],
    "us": ["New York", "Miami", "Chicago", "Los Angeles", "Boston", "Newark", "Washington", "Baltimore", "San Francisco", "Seattle", "(JFK)", "(EWR)", "(BOS)", "(ORD)", "(MIA)", "(LAX)", "(IAD)", "(BWI)", "(SFO)", "(SEA)", "USA"],
    "canada": ["Toronto", "Montreal", "Vancouver", "(YYZ)", "(YUL)", "(YVR)", "Canada"],
    "mexico": ["Mexico City", "Cancún", "Guadalajara", "(MEX)", "(CUN)", "(GDL)", "Mexico"],
    "europe": ["Paris", "Amsterdam", "Frankfurt", "Munich", "Madrid", "Barcelona", "Valencia", "Rome", "Lisbon", "Zurich", "Oslo", "(CDG)", "(AMS)", "(FRA)", "(MUC)", "(MAD)", "(BCN)", "(VLC)", "(FCO)", "(LIS)", "(ZRH)", "(OSL)", "Europe", "Norway"],
    "india": ["Delhi", "Mumbai", "Bengaluru", "Chennai", "Kolkata", "Hyderabad", "(DEL)", "(BOM)", "(BLR)", "(MAA)", "(CCU)", "(HYD)", "India"],
    "dubai": ["Dubai", "Abu Dhabi", "(DXB)", "(AUH)", "UAE"],
    "caribbean": ["Nassau", "Montego Bay", "Punta Cana", "Santo Domingo", "(NAS)", "(MBJ)", "(PUJ)", "(SDQ)", "Caribbean", "Bahamas", "Jamaica"],
    "hawaii": ["Honolulu", "(HNL)", "Hawaii"],
    "south-africa": ["Johannesburg", "Cape Town", "(JNB)", "(CPT)", "South Africa"],
    "south-america": ["São Paulo", "Sao Paulo", "Buenos Aires", "Santiago", "Bogotá", "Bogota", "Lima", "Montevideo", "(GRU)", "(EZE)", "(SCL)", "(BOG)", "(LIM)", "(MVD)", "South America", "Brazil", "Argentina", "Chile", "Colombia", "Peru", "Uruguay"],
    "central-america": ["Panama City", "Panama", "(PTY)", "Central America"],
    "japan": ["Tokyo", "Osaka", "Nagoya", "Fukuoka", "Sapporo", "Naha", "Seoul", "(NRT)", "(HND)", "(KIX)", "(NGO)", "(FUK)", "(ITM)", "(CTS)", "(ICN)", "Japan"],
  };
  const fromInOriginRegion = (field) =>
    (originRegionKeywords[oA.region] || []).some((kw) => field.includes(kw));

  return WORKAROUND_ROUTES_TABLE.filter((r) => {
    // Destination MUST be the exact airport the user picked.
    const toMatchesExactDest = r.to.includes(`(${destCode})`);
    if (!toMatchesExactDest) return false;
    // Origin must be in the same country...
    if (!fromInOriginRegion(r.from)) return false;
    // ...but must NOT be the exact same airport (that's already shown as "exact").
    const sameOriginAirport = r.from.includes(`(${originCode})`);
    return !sameOriginAirport;
  });
}

// ---------- DOWNLOADABLE CHECKLISTS ----------

const CHECKLIST_DATA = {
  generic: {
    title: "Universal pet-flight checklist",
    sections: [
      {
        title: "6 weeks before",
        items: [
          "Vet visit — confirm pet is healthy enough to fly",
          "ISO 11784/11785 microchip implanted (if not already)",
          "Rabies vaccine administered (must be AFTER microchip for international)",
          "Research destination country's import requirements (USDA APHIS has a <a href=\"https://www.aphis.usda.gov/pet-travel/by-country\" target=\"_blank\" rel=\"noopener noreferrer\">country-by-country page</a> for US-origin pets)",
          "Book your flight AND call airline to reserve a pet spot — limited per flight",
          "Order your airline-compliant carrier (soft-sided recommended)",
        ],
      },
      {
        title: "2 weeks before",
        items: [
          "Let pet sleep in the carrier at home for 2 weeks beforehand to get used to it — include some full overnights if it's a long-haul flight, so they're properly settled inside it",
          "Practice short car rides in the carrier",
          "Book USDA-accredited vet appointment for health certificate (international) — <a href=\"https://www.aphis.usda.gov/pet-travel\" target=\"_blank\" rel=\"noopener noreferrer\">aphis.usda.gov</a>",
          "Book your vet's 'fit to fly' health certificate appointment — <strong>effectively all international airlines require one</strong>, typically issued within 10 days of travel (some within 72 hours). Check your airline's specific window. For US-, UK-, and EU-origin pets the destination country's required health certificate (USDA, GB AHC, EU AHC, etc.) usually doubles as the airline's fit-to-fly — but always confirm with your specific airline.",
          "Print and complete the <a href=\"https://www.cdc.gov/importation/dogs/index.html\" target=\"_blank\" rel=\"noopener noreferrer\">CDC Dog Import Form</a> (if entering U.S.) — note these <a href=\"https://www.cdc.gov/importation/dogs/index.html\" target=\"_blank\" rel=\"noopener noreferrer\">rules updated in August 2024</a> and again for high-risk countries in 2025",
          "Confirm climate / temperature restrictions for your route",
          "Buy: <strong>collapsible</strong> water bowl, leash, waste bags, calming spray (recommended)",
        ],
      },
      {
        title: "Day before",
        items: [
          "Trim your pet's nails — long nails snag on carrier mesh",
          "Line the carrier with a piece of <strong>unwashed</strong> bedding from home — familiar scent settles pets faster than anything else. Don't wash it; the slightly used smell is the point.",
          "Pack vet records (originals + photocopies in a Ziploc inside the carrier)",
          "Check airline's pet check-in procedure (often a separate counter)",
        ],
      },
      {
        title: "Day of flight",
        items: [
          "Light meal 4 hours before flight — not too much, not none",
          "Walk your dog / let your cat use the box right before leaving the house, and again at the airport if there's a pet-relief area before security",
          "Pad the carrier with absorbent puppy pads",
          "Arrive 2.5–3 hours early (pet check-in is always in person)",
          "Bring: food, <strong>collapsible</strong> water bowl, leash, waste bags, vet records, calming spray, comfort item",
          "Tip: put some of your pet's favourite treats in a small sandwich bag and tuck them into your personal item or outerwear pocket — usually slips past security scans, and you'll be glad of them at boarding when you need to settle a fidgety pet",
          "Use a backpack-style carrier OR a rolling carrier — saves your shoulders with luggage",
        ],
      },
      {
        title: "At security & onboard",
        items: [
          "Security: take pet OUT of carrier, walk/carry through metal detector (most airports worldwide)",
          "Carrier goes through X-ray empty",
          "Window seat preferred — slightly more under-seat depth, away from cart traffic",
          "If airline allows extra-legroom seats with pets, BOOK THIS — life-changing",
          "If pet gets stressed: calming spray works wonders; staff sometimes allow a quick lap visit",
          "On long flights: book overnight/red-eye when pets naturally sleep",
        ],
      },
      {
        title: "If you're flying with a cat — extra notes",
        items: [
          "You can't walk a cat tired — instead give full litter tray access right up until you leave home",
          "Start carrier acclimation WEEKS ahead — leave it out as a normal den, not a thing that appears on travel day",
          "Use Feliway (the cat pheromone spray), not Adaptil (that's for dogs) — spray the carrier 15 min before, never the cat",
          "Line the carrier with a piece of unwashed bedding from home — cats orient by smell more than sight, and familiar scent settles them faster than anything else (skip the freshly laundered blanket; the slightly used one is the point)",
          "Fit a well-adjusted harness and practise it at home — a startled cat loose in an airport is a real risk at the security check",
          "Cats go quiet and still when stressed rather than vocal — check gently, don't assume silence means calm",
          "A carrier with solid sides or a ventilated blanket cover helps a cat settle — they cope better not seeing the chaos",
          "Don't feed within ~4 hours of departure — cats are prone to travel-sickness and accidents",
        ],
      },
    ],
  },
  uk: {
    title: "UK entry / exit checklist",
    sections: [
      {
        title: "First — two documents people mix up",
        items: [
          "<strong>The 'fit to fly' certificate and the Animal Health Certificate are NOT the same thing.</strong> They're separate documents with different jobs — you may need one, the other, or both.",
          "<strong>Animal Health Certificate (AHC)</strong> — an official GOVERNMENT export document, issued by an Official Veterinarian (OV), valid 10 days. It proves your pet meets the <em>destination country's import rules</em> (microchip, rabies, etc.). Required for UK→EU travel. The equivalent for other destinations is the USDA-endorsed certificate (US), EU AHC, and so on.",
          "<strong>'Fit to fly' certificate</strong> — a vet's letter confirming your pet is healthy and physically <em>fit to be on the aircraft</em>. This is an <em>airline</em> requirement, not a government one. Effectively all international airlines want one (Air Canada, KLM, Lufthansa, SWISS, etc.).",
          "<strong>The overlap:</strong> for some routes the AHC (or the destination's health certificate) ALSO satisfies the airline's fit-to-fly requirement, so one document covers both. Other airlines insist on a separate fit-to-fly letter even when you already have an AHC. There's no universal rule — always confirm with your specific airline which documents they need.",
        ],
      },
      {
        title: "6 weeks before",
        items: [
          "ISO 11784/11785 microchip implanted (if not already)",
          "Rabies vaccination (must be ≥21 days before entry to UK)",
          "If outbound from UK: <a href=\"https://www.gov.uk/take-pet-abroad\" target=\"_blank\" rel=\"noopener noreferrer\">GB Animal Health Certificate (AHC)</a> booking with vet — required for EU destinations (this is the GOVERNMENT export document — see the note above on how it differs from the airline's fit-to-fly)",
          "If outbound to a NON-EU country (Canada, USA, UAE, etc.): you do NOT need the GB AHC. Instead, you need (a) your airline's required 'fit to fly' certificate, (b) any destination country paperwork (e.g. <a href=\"https://www.cdc.gov/importation/dogs/index.html\" target=\"_blank\" rel=\"noopener noreferrer\">CDC Dog Import Form</a> for USA), and (c) for some destinations a <a href=\"https://www.gov.uk/export-health-certificates\" target=\"_blank\" rel=\"noopener noreferrer\">DEFRA Export Health Certificate</a> — start the application early as it's processed by an OV (Official Veterinarian)",
          "If inbound to UK: pets cannot fly in cabin — book cargo OR plan Paris pivot. <a href=\"https://petition.parliament.uk/petitions/750817\" target=\"_blank\" rel=\"noopener noreferrer\">Sign the UK petition to change this rule</a>",
          "Book <a href=\"https://www.leshuttle.com/uk-en/travelling-with-us/travelling-with-pets\" target=\"_blank\" rel=\"noopener noreferrer\">LeShuttle (Eurotunnel)</a> / ferry well in advance if doing land crossing",
        ],
      },
      {
        title: "10 days before",
        items: [
          "Get <a href=\"https://www.gov.uk/take-pet-abroad/animal-health-certificate\" target=\"_blank\" rel=\"noopener noreferrer\">GB Animal Health Certificate</a> from official vet (UK→EU)",
          "Or get <a href=\"https://food.ec.europa.eu/animals/movement-pets_en\" target=\"_blank\" rel=\"noopener noreferrer\">EU Animal Health Certificate</a> from USDA-accredited vet (US departing)",
          "Confirm Eurotunnel/ferry booking",
        ],
      },
      {
        title: "72 hours – 10 days before (non-EU destinations)",
        items: [
          "Get your vet's 'fit to fly' health certificate — most international airlines require this regardless of destination (Air Canada, KLM, Lufthansa, SWISS, etc.). Letter must confirm your pet is examined, free from contagious disease, and fit to fly",
          "Air Canada specifically: <a href=\"https://www.aircanada.com/us/en/aco/home/plan/special-assistance/pets.html\" target=\"_blank\" rel=\"noopener noreferrer\">fit-to-fly certificate</a> issued within 10 days of travel (some sources say 72 hours — confirm with your specific vet AND airline)",
          "For dogs flying to the USA from the UK: complete the <a href=\"https://www.cdc.gov/importation/dogs/index.html\" target=\"_blank\" rel=\"noopener noreferrer\">CDC Dog Import Form</a> receipt (UK is on the low-risk list — no extra rabies titer needed)",
        ],
      },
      {
        title: "24–120 hours before UK arrival",
        items: [
          "Tapeworm treatment by a vet — REQUIRED for dogs only",
          "Treatment must be recorded in the health certificate",
          "Without this, your dog can be refused entry to the UK or Ireland",
        ],
      },
      {
        title: "Travel day",
        items: [
          "Have all originals on hand at the border (not just photos on phone)",
          "Allow extra time at Eurotunnel Pet Reception — UK terminal",
          "Bring water, treats, and a familiar blanket for the crossing",
        ],
      },
      {
        title: "If you're flying with a cat",
        items: [
          "Good news: cats do NOT need the tapeworm treatment — that's a dogs-only UK/Ireland requirement",
          "Everything else is the same: ISO microchip, rabies ≥21 days before entry, health certificate",
          "No cabin into the UK applies to cats too — you'll still do the Paris pivot or cargo",
          "On the Eurotunnel crossing the cat stays in its carrier in the car — bring a familiar-smelling blanket",
          "Use Feliway (cat pheromone) in the carrier, never Adaptil — and keep a harness on for the Pet Reception checks",
        ],
      },
    ],
  },
  ireland: {
    title: "Ireland entry / exit checklist",
    sections: [
      {
        title: "6 weeks before",
        items: [
          "ISO 11784/11785 microchip implanted (must be before the rabies vaccine)",
          "Rabies vaccination — must be ≥21 days before entry to Ireland",
          "If inbound to Ireland: pets cannot fly in cabin — plan the France→Ireland ferry, the UK landbridge, or cargo",
          "If outbound from Ireland: book your cabin pet slot with Aer Lingus or an EU carrier",
          "Book your ferry (Irish Ferries / Brittany Ferries) well in advance — pet cabins sell out",
        ],
      },
      {
        title: "10 days before",
        items: [
          "Get the EU Animal Health Certificate from an accredited vet (or EU pet passport if you have one)",
          "If coming from the UK: a GB Animal Health Certificate covers the trip",
          "<strong>Note — two separate documents:</strong> the Animal Health Certificate is the GOVERNMENT document proving your pet meets Ireland's import rules. Your airline separately wants a 'fit to fly' vet letter confirming your pet is healthy enough to travel. Often the AHC also satisfies the airline, but some airlines insist on a separate fit-to-fly letter — confirm with your specific airline.",
          "Confirm ferry or cargo booking",
          "Re-confirm any cabin pet booking for the fly-out or fly-to-Europe leg",
        ],
      },
      {
        title: "24–120 hours before Ireland arrival",
        items: [
          "Tapeworm treatment by a vet — REQUIRED for dogs only (not cats)",
          "Treatment must be recorded in the health certificate or pet passport",
          "Without it, your dog can be refused entry or detained",
        ],
      },
      {
        title: "Travel day",
        items: [
          "Carry all original documents (not just phone photos) for border checks",
          "Allow extra time at the ferry pet check-in",
          "Bring water, a familiar blanket, and comfort items for the long crossing",
        ],
      },
      {
        title: "If you're flying with a cat",
        items: [
          "Cats skip the tapeworm treatment — that's a dogs-only rule for Ireland (same as the UK)",
          "Everything else is identical: ISO microchip, rabies ≥21 days before entry, EU health certificate",
          "The no-cabin-into-Ireland rule applies to cats too — you'll still take the ferry or cargo route in",
          "On the ferry the cat stays in its carrier in the vehicle or a pet-friendly cabin — bring a familiar blanket",
          "Feliway in a covered carrier, harness fitted for the ferry check-in",
        ],
      },
    ],
  },
  india: {
    title: "India entry / exit checklist",
    sections: [
      {
        title: "2 months before",
        items: [
          "Check residency status: import as accompanied baggage (NOC only, no DGFT license) requires 2+ years continuous stay outside India. Less than 2 years means you also need a <a href=\"https://www.dgft.gov.in/\" target=\"_blank\" rel=\"noopener noreferrer\">DGFT</a> import authorization — apply early.",
          "If returning to India (re-import), locate your previous <a href=\"https://aqcsindia.gov.in/\" target=\"_blank\" rel=\"noopener noreferrer\">AQCS</a> export certificate — it's required as proof of identity.",
          "Identify your entry airport — pets can ONLY enter India through six approved airports: Delhi (DEL), Mumbai (BOM), Chennai (MAA), Kolkata (CCU), Bengaluru (BLR), or Hyderabad (HYD).",
        ],
      },
      {
        title: "4 weeks before",
        items: [
          "ISO microchip implanted (if not already) — must be ISO 11784/11785 compliant. Implant the microchip BEFORE the rabies vaccine — if a country en route or your destination needs a rabies titer test, a microchip implanted after the vaccine can invalidate the timeline.",
          "Rabies vaccine 30 days – 12 months before travel (administered AFTER the microchip).",
          "Parvo, distemper, leptospirosis vaccines up to date.",
          "Health certificate from origin country vet — must include vaccination history and microchip number.",
          "If from the USA, get <a href=\"https://www.aphis.usda.gov/pet-travel\" target=\"_blank\" rel=\"noopener noreferrer\">USDA APHIS</a> endorsement of the health certificate.",
          "If from Canada, get <a href=\"https://inspection.canada.ca/animal-health/terrestrial-animals/exports/pets/eng\" target=\"_blank\" rel=\"noopener noreferrer\">CFIA</a> endorsement.",
          "If from the UK, the GB Animal Health Certificate from an accredited vet covers the export side (GB residents can no longer use an EU pet passport). If from the EU, an EU pet passport plus an accredited vet's health certificate works. India sets its own entry requirements either way — see the health certificate and NOC steps.",
        ],
      },
      {
        title: "2 weeks before",
        items: [
          "Apply for <a href=\"https://aqcsindia.gov.in/\" target=\"_blank\" rel=\"noopener noreferrer\">NOC (No Objection Certificate)</a> from AQCS — submit advance copies of all docs (health cert, vaccine records, microchip cert, passport copy, ticket copy, 2 postcard photos of pet) by email or fax to the entry-port AQCS office. Processing fee Rs 1000 per application.",
          "Advance NOC can be issued within 7 days before arrival — don't apply too early, certificate has limited validity.",
          "Book <a href=\"https://www.airindia.com/in/en/travel-information/travelling-with-pets.html\" target=\"_blank\" rel=\"noopener noreferrer\">Air India Paws on Board</a> cabin slot (if eligible route) — pets up to 10 kg combined on most India routes.",
          "Book a representative or agent at the entry airport if you don't have one (highly recommended, especially at Delhi).",
          "Confirm 48 hours before — Air India requires 48 hrs minimum notice for pet bookings.",
        ],
      },
      {
        title: "Travel day",
        items: [
          "Bring printed NOC AND digital copy. A duplicate copy must be fixed to the carrier exterior.",
          "Bring ALL original documents (health certificate, vaccination records, microchip certificate, passport, tickets) plus photocopies.",
          "Arrive 4 hours early for international flights with pet check-in.",
          "Confirm with Air India that cabin slot still applies — pets approved 48 hrs prior can still be denied at gate if paperwork is incomplete.",
          "Owner must be present at AQCS on arrival for clinical examination and Provisional Quarantine Clearance Certificate.",
        ],
      },
      {
        title: "On arrival in India",
        items: [
          "Quarantine officer examines pet and verifies documents at the AQCS station at the entry airport.",
          "If clinically healthy and paperwork in order, pet is released with Provisional Quarantine Clearance Certificate — no 15-day quarantine for accompanied baggage pets with proper docs.",
          "Pets brought for short trips/visits (shows, therapy, tourism with owner) are explicitly exempt from the 15-day quarantine.",
          "If health concerns or paperwork issues, pet may be quarantined for 15 days (extendable) at owner's expense.",
        ],
      },
      {
        title: "Departing FROM India (export)",
        items: [
          "Visit AQCS at your departure port at least 7 days before flight with the pet and pre-appointment.",
          "Bring: completed application form, microchip certificate, vaccination records, rabies titer test results (if destination requires), 2 postcard photos of pet, passport copy, ticket copy.",
          "AQCS export certificate is valid for 10 days from issue.",
          "Destination-specific requirements: USA needs CDC Dog Import Form (India IS on the CDC high-risk list — requires Certification of US-issued Rabies Vaccination OR FAVN titer); UK needs Animal Health Certificate (cabin not allowed — cargo only via continental Europe pivot); EU needs EU Animal Health Certificate + microchip + rabies 21+ days.",
        ],
      },
      {
        title: "If you're flying with a cat",
        items: [
          "The AQCS NOC is required for cats too — same 7-day advance process, same fee.",
          "Same microchip + rabies + vaccination requirements as dogs.",
          "The six-airport entry rule applies to cats as well (Delhi, Mumbai, Chennai, Kolkata, Bengaluru, Hyderabad).",
          "Air India accepts cats in cabin on eligible routes — combined cat+carrier weight under 10 kg.",
          "Long-haul to India is a long time in a carrier for a cat — book a covered carrier, use Feliway, and pick an overnight flight if possible.",
        ],
      },
    ],
  },
  europe: {
    title: "Europe (EU) entry / exit checklist",
    sections: [
      {
        title: "4–6 weeks before",
        items: [
          "ISO microchip implanted FIRST",
          "Rabies vaccine AFTER microchip (≥21 days before EU entry)",
          "Official vet appointment booked for <a href=\"https://food.ec.europa.eu/animals/movement-pets_en\" target=\"_blank\" rel=\"noopener noreferrer\">EU Health Certificate</a> (varies by origin country)",
          "Confirm whether your airline allows cabin pets on this leg",
        ],
      },
      {
        title: "10 days before",
        items: [
          "Get destination-appropriate health certificate (<a href=\"https://food.ec.europa.eu/animals/movement-pets_en\" target=\"_blank\" rel=\"noopener noreferrer\">EU Health Cert</a> from US, <a href=\"https://www.gov.uk/take-pet-abroad\" target=\"_blank\" rel=\"noopener noreferrer\">GB AHC</a> from UK, etc.)",
          "<strong>Note — two separate documents:</strong> the EU Health Certificate / AHC is the GOVERNMENT document proving your pet meets EU import rules. Your airline separately wants a 'fit to fly' vet letter confirming your pet is healthy enough to travel. The health certificate often satisfies both, but some airlines insist on a separate fit-to-fly letter — confirm with your specific airline.",
          "<a href=\"https://www.aphis.usda.gov/pet-travel\" target=\"_blank\" rel=\"noopener noreferrer\">USDA APHIS</a> endorsement (US only) — same day as vet certificate ideally",
          "Re-confirm airline cabin booking by phone",
        ],
      },
      {
        title: "Travel day",
        items: [
          "Originals required at EU border, not photos",
          "Arrive 3 hours early for international",
          "Bring calming spray for long flights",
          "Window seat if possible; extra-legroom if airline allows",
        ],
      },
      {
        title: "If you're flying with a cat",
        items: [
          "Cats follow the same EU rules: ISO microchip first, then rabies ≥21 days before entry, then the EU Health Certificate or EU Pet Passport",
          "No tapeworm treatment needed for cats (that's a dogs-only rule, and only for the UK, Ireland, Malta, Finland, Norway anyway)",
          "EU flag carriers that take cabin dogs take cabin cats too — same 8 kg combined limit",
          "Use Feliway in the carrier (not Adaptil), keep it covered/ventilated, and fit a harness for the security check where the cat must come out",
        ],
      },
    ],
  },
  usa: {
    title: "USA entry / exit checklist",
    sections: [
      {
        title: "8 weeks before",
        items: [
          "Vet appointment for full health check",
          "ISO microchip implanted (if not already)",
          "Rabies vaccine 30 days–12 months old",
          "Check current <a href=\"https://www.cdc.gov/importation/dogs/index.html\" target=\"_blank\" rel=\"noopener noreferrer\">CDC dog import rules</a> — they updated August 2024",
        ],
      },
      {
        title: "4 weeks before",
        items: [
          "<a href=\"https://www.cdc.gov/importation/dogs/index.html\" target=\"_blank\" rel=\"noopener noreferrer\">CDC Dog Import Form</a> completed (online, get the receipt)",
          "<a href=\"https://www.aphis.usda.gov/pet-travel\" target=\"_blank\" rel=\"noopener noreferrer\">USDA-accredited vet</a> appointment booked for health certificate",
          "Confirm airline cabin pet space (limited per flight)",
          "Confirm departure airport allows cabin pet check-in",
        ],
      },
      {
        title: "10 days before",
        items: [
          "Vet visit: get USDA-accredited health certificate signed — this confirms your pet is examined, free from contagious disease, and 'fit to fly'. <strong>Airlines require this even though the US itself doesn't ask for a government health certificate</strong> — the CDC Dog Import Form alone is not enough at airline check-in.",
          "<a href=\"https://www.aphis.usda.gov/aphis/ourfocus/animalwelfare/sa_pet_travel\" target=\"_blank\" rel=\"noopener noreferrer\">USDA APHIS</a> endorsement (varies by state — some same-day, some require mail-in)",
          "Re-confirm airline cabin booking by phone",
        ],
      },
      {
        title: "Travel day",
        items: [
          "Bring CDC Dog Import receipt printout",
          "Originals only at US border, not photos",
          "Arrive 3 hours early for international",
          "Pet relief area available at most major US airports — but walk your dog before you enter the airport too",
        ],
      },
      {
        title: "If you're flying with a cat",
        items: [
          "Cats do NOT need the CDC Dog Import Form — that's dogs only",
          "Under current federal rules cats aren't required to show proof of rabies vaccination to enter the US — but your airline will likely still want a current rabies certificate, and some states (notably Hawaii) have their own rules",
          "Cats are inspected on arrival and must appear healthy",
          "You can't walk a cat before the airport — instead give litter tray access right up until you leave, and don't feed within ~4 hours of departure",
          "At the US security check the cat must come out of the carrier — a harness is essential",
        ],
      },
    ],
  },
  uae: {
    title: "UAE entry / exit checklist",
    sections: [
      {
        title: "8 weeks before",
        items: [
          "Vet appointment for full health check",
          "ISO 15-digit microchip implanted (UAE strictly requires ISO 11784/11785) — implant it BEFORE the rabies vaccine",
          "Rabies vaccine ≥21 days old, ≤12 months (administered AFTER the microchip — order matters because the FAVN titer below depends on a valid vaccination record)",
          "Rabies titer test (FAVN) if from a rabies-controlled country — UAE requires ≥0.5 IU/ml",
        ],
      },
      {
        title: "4 weeks before",
        items: [
          "Apply for <a href=\"https://www.moccae.gov.ae/en/services/registration-pet.aspx\" target=\"_blank\" rel=\"noopener noreferrer\">MOCCAE import permit</a> (Ministry of Climate Change and Environment) — ~AED 200",
          "Book cabin pet space directly with <a href=\"https://www.etihad.com/en-us/plan/travel-companion/travelling-with-pets\" target=\"_blank\" rel=\"noopener noreferrer\">Etihad</a> by phone (cabin for AUH; cargo only for DXB)",
          "If using Dubai cargo: arrange Dubai Kennels & Cattery (DKC) or another customs broker",
          "Confirm departure airport allows your specific carrier and aircraft",
        ],
      },
      {
        title: "5 days before",
        items: [
          "Vet visit: UAE Health Certificate signed and stamped by government-accredited official — this also serves as your airline 'fit to fly' confirmation",
          "Email all documents to airline (Etihad requires docs ≥72 hours before)",
          "If cargo: confirm pickup/drop-off times with broker",
        ],
      },
      {
        title: "Travel day",
        items: [
          "REMEMBER: Cabin entry only into Abu Dhabi (AUH) on Etihad — NOT Dubai",
          "Bring originals of all certificates",
          "Submit Etihad booking form 7+ days before departure if not already",
          "Pet undergoes MOCCAE inspection after immigration at AUH (in Customs clearance)",
          "From AUH to Dubai: 90-minute taxi (around AED 250)",
        ],
      },
      {
        title: "If you're flying with a cat",
        items: [
          "Cats need the same MOCCAE import permit, ISO microchip, rabies vaccine and FAVN titer as dogs — no shortcut",
          "Etihad accepts cats in cabin to/from Abu Dhabi on the same terms as dogs (8 kg combined limit)",
          "The Dubai cargo-only rule applies to cats too — there is no cabin entry to DXB for any pet",
          "Some of the breed-specific bans are dog-only, but the import process itself is identical for cats",
          "Long flight to the Gulf — covered carrier, Feliway, overnight flight, and a harness for the AUH inspection",
        ],
      },
    ],
  },
  canada: {
    title: "Canada entry / exit checklist",
    sections: [
      {
        title: "4–6 weeks before",
        items: [
          "Vet appointment for full health check",
          "ISO microchip implanted (recommended; not strictly required for entry but airlines need it)",
          "Rabies vaccine ≥30 days old (for adult dogs)",
          "Book cabin pet space with airline (Air Canada / Air Transat from UK; AC / AA / Delta / United / WestJet within North America)",
        ],
      },
      {
        title: "10 days before",
        items: [
          "Vet-issued international health certificate (<a href=\"https://inspection.canada.ca/animal-health/terrestrial-animals/imports/pets/eng/1326600389775/1326600500578\" target=\"_blank\" rel=\"noopener noreferrer\">CFIA</a> recommends within 10 days of arrival). Make sure your vet confirms your pet is examined, free from contagious disease, and 'fit to fly' — this same certificate doubles as the airline's fit-to-fly requirement.",
          "If from US: USDA-accredited vet only — APHIS endorsement NOT required for Canada (saves time)",
          "If from UK: a vet 'fit to fly' letter is what you need — there is NO Animal Health Certificate equivalent for Canada (the GB AHC is EU-only). Most airlines (Air Canada, Air Transat) want this letter issued within 10 days of travel.",
          "If from elsewhere: country-specific government health certificate",
          "Re-confirm airline cabin pet booking by phone",
        ],
      },
      {
        title: "Travel day",
        items: [
          "Bring rabies vaccination certificate (original)",
          "Bring vet-issued health certificate (original)",
          "CBSA inspection on arrival — typically quick if paperwork is complete",
          "Most Canadian airports have pet relief areas",
        ],
      },
      {
        title: "Important note",
        items: [
          "Commercial dogs younger than 8 months entering from countries with high risk of dog rabies face additional requirements",
          "Personal pets (not commercial) under 3 months old face no rabies vaccine requirement but limited destinations",
          "Cats face fewer restrictions but still need health certificate",
        ],
      },
      {
        title: "If you're flying with a cat",
        items: [
          "Canada is one of the easier destinations for cats: a rabies certificate from your vet is the core requirement (cats over 3 months)",
          "No CDC-style import form, no APHIS endorsement needed from the US",
          "Air Canada and the US carriers take cabin cats on the same terms as dogs (≤10 kg combined on Air Canada)",
          "Cats can't be walked before the flight — litter tray access until you leave, no food within ~4 hours of departure",
          "Feliway in a covered carrier, harness on for the security check",
        ],
      },
    ],
  },
  mexico: {
    title: "Mexico entry / exit checklist",
    sections: [
      {
        title: "4 weeks before",
        items: [
          "Vet appointment for full health check",
          "ISO microchip recommended (not strictly required)",
          "Rabies vaccine ≥15 days old before travel",
          "Book cabin pet space with airline (Aeromexico, Volaris, Air Canada, AA, Delta, United all offer cabin to Mexico)",
        ],
      },
      {
        title: "10 days before",
        items: [
          "Vet-issued health certificate stating pet is free of parasites and infectious disease — also covers your airline's 'fit to fly' requirement",
          "If from US: USDA APHIS endorsement is optional but recommended",
          "Internal/external deworming and tick treatment (within 6 months for ticks, dewormer date noted)",
          "Re-confirm airline cabin booking by phone",
        ],
      },
      {
        title: "Travel day",
        items: [
          "Bring rabies vaccination certificate (original)",
          "Bring vet health certificate (original)",
          "<a href=\"https://www.gob.mx/senasica\" target=\"_blank\" rel=\"noopener noreferrer\">SADER/SENASICA</a> inspection at Mexican port of entry — free of charge",
          "If paperwork is incomplete: official quarantine at owner's expense until resolved",
        ],
      },
      {
        title: "Returning to home country",
        items: [
          "Returning to US: <a href=\"https://www.cdc.gov/importation/dogs/index.html\" target=\"_blank\" rel=\"noopener noreferrer\">CDC Dog Import Form</a> receipt required for dogs",
          "Returning to Canada: standard rabies + health certificate (<a href=\"https://inspection.canada.ca/animal-health/terrestrial-animals/exports/pets/eng\" target=\"_blank\" rel=\"noopener noreferrer\">CFIA</a>)",
          "Returning to EU: <a href=\"https://food.ec.europa.eu/animals/movement-pets_en\" target=\"_blank\" rel=\"noopener noreferrer\">EU Health Certificate</a> or pet passport — Mexico is an unlisted third country so 3-month wait may apply",
        ],
      },
      {
        title: "If you're flying with a cat",
        items: [
          "Mexico is straightforward for cats: vet health certificate + current rabies vaccine is the core requirement",
          "SADER/SENASICA inspect cats on arrival the same way as dogs — free of charge",
          "Returning to the US with a cat: no CDC Dog Import Form needed (that's dogs only)",
          "Internal/external parasite treatment should still be documented for a cat",
          "Cat travel-day basics: litter tray until you leave, no food within ~4 hours, Feliway, covered carrier, harness for security",
        ],
      },
    ],
  },
  dominican_republic: {
    title: "Dominican Republic entry / exit checklist",
    sections: [
      {
        title: "6–8 weeks before",
        items: [
          "Vet appointment for full health check",
          "ISO 15-digit microchip implanted FIRST (must precede rabies vaccine)",
          "Rabies vaccine 30 days–12 months old (after microchip)",
          "DHPP for dogs (distemper, hepatitis, parainfluenza, parvovirus); FVRCP for cats",
          "IMPORTANT: DR is a CDC high-risk country for dog rabies — this affects your return to the US",
        ],
      },
      {
        title: "If returning to the US: do this BEFORE departure",
        items: [
          "Get Certification of U.S.-issued Rabies Vaccination form from a USDA-accredited vet (NOT a regular rabies certificate)",
          "Form must be USDA-endorsed BEFORE your dog leaves the US — cannot be issued retroactively",
          "USDA-endorsed export health certificates dated after July 31, 2025 are NOT accepted — use the Certification form instead",
          "CDC Dog Import Form receipt (online) for your return entry",
          "Plan: dog must be at least 6 months old at time of US re-entry",
        ],
      },
      {
        title: "10 days before travel to DR",
        items: [
          "USDA-accredited vet issues Health Certificate for export to DR (valid 10 days)",
          "Certificate includes microchip number, rabies info, parasite treatments",
          "Consulate endorsement NOT required for personal pets",
          "Re-confirm cabin pet booking with airline",
        ],
      },
      {
        title: "Travel day",
        items: [
          "Bring original (signed/stamped) Health Certificate",
          "Bring Certification of U.S.-issued Rabies Vaccination (for return)",
          "Bring CDC Dog Import Form receipt (for return)",
          "DR inspection on arrival — typically quick if paperwork complete",
        ],
      },
      {
        title: "If you're flying with a cat",
        items: [
          "Getting a cat INTO the DR is straightforward: microchip, rabies, FVRCP, vet health certificate",
          "The CDC high-risk-rabies complication is about DOGS returning to the US — cats returning from the DR do NOT need the CDC Dog Import Form or the Certification of U.S.-issued Rabies Vaccination",
          "That makes the round trip noticeably simpler for a cat than for a dog",
          "Still bring originals of the cat's microchip, rabies and health certificate",
          "Cat travel-day basics: litter tray until you leave, no food within ~4 hours, Feliway, covered carrier, harness for security",
        ],
      },
    ],
  },
  jamaica: {
    title: "Jamaica entry / exit checklist",
    sections: [
      {
        title: "6+ MONTHS before (this is a long process)",
        items: [
          "ISO 15-digit microchip implanted FIRST (must precede rabies vaccine)",
          "Rabies vaccine administered (after microchip) — primary vaccine needs 3-month wait before entry for dogs over 12 months",
          "FAVN rabies titer test done 30+ days after vaccination at an OIE/WHO-approved lab",
          "Titer result must be valid (≥0.5 IU/ml) and dated 3–12 months before arrival",
          "IMPORTANT: Jamaica only accepts pets directly from Category 1 (rabies-controlled) countries — pets from elsewhere must have lived in a Category 1 country for 6+ months first",
        ],
      },
      {
        title: "Permit application (start ASAP after titer)",
        items: [
          "Submit Preliminary Application Form to vsdpermits@moa.gov.jm",
          "Attach rabies certificate + FAVN titer results",
          "Wait for Pre-Export Treatment Schedule from Jamaica Veterinary Services Division",
          "DO NOT start additional treatments until Preliminary Application is approved",
          "Apply for Veterinary Import Permit (separate from preliminary application)",
        ],
      },
      {
        title: "30 days before — pre-export treatments",
        items: [
          "Two internal parasite treatments, 14 days apart (second within 7 days of travel)",
          "Two external parasite treatments, 14 days apart (second within 48 hours of travel)",
          "Additional vaccinations per Jamaica's schedule: distemper, parvovirus, leptospirosis, hepatitis, parainfluenza",
          "Brucella Canis test for dogs; Leishmaniosis test if required",
        ],
      },
      {
        title: "Travel day",
        items: [
          "Original Veterinary Import Permit (mandatory — no entry without it)",
          "Government-endorsed international health certificate",
          "All vaccination and treatment records (microchip number on every document)",
          "Pit Bull Terriers and hybrid dogs are banned — confirm breed eligibility well in advance",
        ],
      },
      {
        title: "If you're flying with a cat",
        items: [
          "Jamaica's strict process applies to cats too — microchip, rabies, FAVN titer, import permit, the 6+ month timeline. It is not quicker for a cat.",
          "The Category 1 country rule applies to cats as well (must travel from, or have lived 6+ months in, a rabies-controlled country)",
          "The parasite-treatment schedule applies to cats — confirm the exact schedule with Jamaica Veterinary Services",
          "Brucella Canis testing is dog-only; the breed bans are dog-only — but every other step is the same for a cat",
          "Because of the long lead time, a covered carrier and Feliway acclimation over those months is easy to build in — start early",
        ],
      },
    ],
  },
  bahamas: {
    title: "Bahamas entry / exit checklist",
    sections: [
      {
        title: "8+ weeks before",
        items: [
          "ISO 15-digit microchip implanted FIRST",
          "Rabies vaccine: primary doses need at least 30 days before entry; max 10 months for 1-year vaccine or 34 months for 3-year vaccine",
          "Other vaccinations: distemper, hepatitis, leptospirosis, parvovirus, adenovirus (plus coronavirus if from high-risk rabies country)",
          "Pet must be at least 6 months old at entry",
        ],
      },
      {
        title: "4–6 weeks before — Import Permit",
        items: [
          "Apply for Bahamas Import Permit via bahamaspetpermit.com or email minagriculturalmarine@bahamas.gov.bs",
          "Standard processing: 6–8 weeks (expedited service available)",
          "Permit fee: ~$10 USD + 12% VAT",
          "Banned breeds: Pit Bull, Presa Canario, Cane Corso, American Bully, Staffordshire Terrier — confirm eligibility before applying",
        ],
      },
      {
        title: "48 hours before travel",
        items: [
          "Licensed vet completes International Veterinary Certificate (within 48 hours of arrival in Bahamas)",
          "USDA APHIS endorsement NOT required — vet signature alone is enough",
          "Internal parasite test (negative stool sample test) recorded on certificate",
          "Re-confirm cabin pet booking with airline (JetBlue, AA, Delta all do cabin to Nassau)",
        ],
      },
      {
        title: "Travel day & arrival",
        items: [
          "Original Import Permit (mandatory)",
          "Original Veterinary Certificate (signed within 48 hours of arrival)",
          "Microchip and rabies records",
          "On arrival: pet examined by Bahamian veterinary officer within 48 hours",
          "If staying 28+ days: dog must be licensed locally within 48 hours of entry",
        ],
      },
      {
        title: "Returning to US",
        items: [
          "Bahamas is a CDC dog-rabies-FREE country — return is straightforward",
          "Only the CDC Dog Import Form receipt is needed for re-entry",
          "Dog must be 6+ months old, microchipped, healthy",
          "No titer test or quarantine required on return",
        ],
      },
      {
        title: "If you're flying with a cat",
        items: [
          "Cats need the same Bahamas Import Permit — apply via bahamaspetpermit.com 6–8 weeks ahead",
          "Microchip, rabies, and the International Veterinary Certificate (within 48 hours of arrival) all apply to cats",
          "The breed bans are dog-only — but the permit and paperwork process is identical for a cat",
          "Returning to the US with a cat: no CDC Dog Import Form needed (dogs only) — Bahamas being rabies-free makes the cat round trip very simple",
          "Cat travel-day basics: litter tray until you leave, no food within ~4 hours, Feliway, covered carrier, harness for security",
        ],
      },
    ],
  },
  south_africa: {
    title: "South Africa pet travel checklist",
    sections: [
      {
        title: "First — understand the two very different cases",
        items: [
          "DOMESTIC within South Africa: small dogs CAN fly in the cabin — Lift is the only airline that allows it (dogs under 7 kg, no cats). The rest of this checklist's 'domestic' steps cover that.",
          "INTERNATIONAL in or out of South Africa: there is NO cabin option on any airline — international pets travel as manifested cargo. We don't walk through cargo logistics in detail; the international section below tells you what to gather and who to contact.",
          "Work out which case you're in before you do anything else — the prep is completely different.",
        ],
      },
      {
        title: "Domestic cabin travel (Lift) — 2+ weeks before",
        items: [
          "Confirm your dog is under 7 kg and a cat is not involved (Lift cabin is small dogs only)",
          "Confirm your dog is at least 10 weeks old",
          "Rabies vaccination up to date (legally required for all SA dogs over 3 months)",
          "Get a purpose-built soft-sided carrier — max 55 × 35 × 28 cm — and let your dog get used to it",
          "Consult your vet to confirm your dog is fit to fly in cabin",
        ],
      },
      {
        title: "Domestic cabin travel (Lift) — 7+ days before",
        items: [
          "Do NOT book your flight independently first",
          "Submit Lift's Dog-in-Cabin Request Form at least 7 days before travel",
          "Wait for Lift Customer Support to confirm availability (within 24 business hours)",
          "Accept the quote — the dog's booking costs the same as the adult fare (less taxes)",
          "Lift completes the booking for you — window seat blocked for the dog, you in the adjacent middle seat",
        ],
      },
      {
        title: "Domestic cabin travel (Lift) — travel day",
        items: [
          "Arrive at least 2 hours before departure",
          "Go to the LIFT check-in counters with your dog in its carrier",
          "Bring proof of rabies vaccination",
          "Line the carrier with puppy training pads / absorbent sheets",
          "Dog stays inside the carrier at all times — including in the terminal and onboard",
        ],
      },
      {
        title: "International travel (in or out of SA) — the honest version",
        items: [
          "No airline flies cabin pets in or out of South Africa — this will be a cargo move, full stop",
          "Start 4–6 months ahead — international SA pet travel is slow",
          "Into SA: State Veterinary import permit, ISO microchip, rabies vaccine 30 days–1 year old, rabies titer test (most countries), government-vet-endorsed health certificate, plus extra tests depending on origin",
          "Out of SA: rabies titer test, State Vet health certificate, plus whatever the destination country requires (e.g. EU has a 3-month wait after a successful titer)",
          "IMPORTANT: exact crate specs, booking process, timings and costs vary by airline and route — confirm every detail directly with the airline's cargo division or a professional pet relocation company before committing to dates",
          "Don't rely on general guidance for a cargo move — get specifics for your exact route",
        ],
      },
    ],
  },
  hawaii: {
    title: "Hawaii pet travel checklist",
    sections: [
      {
        title: "First — understand what Hawaii is",
        items: [
          "Hawaii is rabies-free and treats every arriving pet like an international entry — even though it's a US state. The official authority is Hawaii's Department of Agriculture & Biosecurity — see their <a href=\"https://dab.hawaii.gov/ai/aqs/aqs-info/\" target=\"_blank\" rel=\"noopener noreferrer\">Animal Quarantine Information page</a> for forms and current requirements.",
          "The goal is the 'Direct Airport Release' (or '5-Day-Or-Less') program — without it, your pet faces up to 120 days of quarantine on arrival",
          "This needs 4–5 MONTHS of preparation — it is the single longest lead time of any US destination",
          "Honolulu (HNL) is the only animal port of entry — you cannot fly a pet directly into Maui, Kona, or any other island from outside Hawaii",
        ],
      },
      {
        title: "5+ months before",
        items: [
          "Confirm your pet has an ISO 11784/11785 compatible microchip — implanted BEFORE the rabies blood test",
          "Ensure two rabies vaccinations are on record (two separate shots in your pet's lifetime, more than 30 days apart)",
          "Have your vet draw blood for the FAVN/OIE rabies antibody test and send it to an approved lab",
          "The waiting period after a successful test result must be observed — this is what drives the long timeline",
        ],
      },
      {
        title: "1–2 months before",
        items: [
          "Most recent rabies vaccine must be current and given at least 30 days before arrival",
          "Submit the completed Dog & Cat Import Form (AQS-279) and the original rabies certificates to the Animal Industry Division",
          "Pay the Direct Airport Release fee",
          "Book your pet's cabin space — Hawaiian Airlines and others carry cabin pets OUT of Hawaii and inter-island, but routes INTO Hawaii are more limited and some are cargo-only",
          "Arrange the flight to arrive during Airport Animal Quarantine Holding Facility inspection hours",
        ],
      },
      {
        title: "10 days before",
        items: [
          "Vet health check — confirm your pet is fit to fly",
          "Treat for ticks within 14 days of arrival (required) and document it",
          "Re-confirm your pet's cabin booking by phone",
          "Print all paperwork: import form confirmation, both rabies certificates, microchip records, FAVN test result",
        ],
      },
      {
        title: "Travel day & arrival",
        items: [
          "Bring ALL original documents — Hawaii inspects paperwork carefully on arrival",
          "Your pet is inspected at the Airport Animal Quarantine Holding Facility at Honolulu (HNL)",
          "If everything is in order, your pet is released the same day — that's the 'Direct Airport Release'",
          "If any document is missing or wrong, your pet goes into quarantine — there is no flexibility, so triple-check everything beforehand",
          "Inter-island onward travel is straightforward once your pet has cleared at Honolulu",
        ],
      },
      {
        title: "If you're flying with a cat",
        items: [
          "Cats follow the exact same Direct Airport Release program as dogs — microchip, two rabies vaccines, FAVN test, the lot",
          "There is no shortcut or lighter process for cats entering Hawaii",
          "At airport security on the mainland the cat must come out of the carrier — fit and practise a harness at home",
          "Give litter tray access up until you leave home; no food within ~4 hours of departure",
        ],
      },
    ],
  },
  japan: {
    title: "Japan entry / exit checklist",
    sections: [
      {
        title: "7 months before",
        items: [
          "Confirm your origin country's category: Japan classifies countries as 'designated' (rabies-free — Iceland, Australia, NZ, Fiji, Hawaii, Guam) or 'non-designated' (everywhere else). Non-designated requires the full 180-day process below; designated countries can skip the titer and waiting period.",
          "Plan backwards from intended arrival date: blood draw for rabies titer must be ≥180 days before arrival in Japan, and that's the hard floor.",
          "Identify your entry airport — Japan has 11 approved animal entry ports: New Chitose (CTS), Narita (NRT), Haneda (HND), Chubu/Nagoya (NGO), Kansai/Osaka (KIX), Itami (ITM), Kobe (UKB), Kitakyushu (KKJ), Fukuoka (FUK), Kagoshima (KOJ), Naha (OKA). Anywhere else, your pet will be refused entry.",
        ],
      },
      {
        title: "6 months before",
        items: [
          "ISO 11784/11785 microchip implanted — and it MUST be implanted BEFORE the first rabies vaccination or the vaccine is invalid. If your pet already has a microchip, verify it's ISO compliant; if it's not, bring a microchip reader with you.",
          "First rabies vaccine — must be administered when the pet is at least 91 days old (12 weeks is 84 days, which is below Japan's minimum and would invalidate the timeline).",
          "Second rabies vaccine — at least 30 days after the first.",
        ],
      },
      {
        title: "5–6 months before",
        items: [
          "Rabies antibody titer test (FAVN or RFFIT) — blood draw at a Japan-approved laboratory (Kansas State University Rabies Lab is the standard US destination).",
          "Result must show antibody level ≥0.5 IU/ml. Keep the ORIGINAL lab report — required on arrival.",
          "If titer fails: re-vaccinate, wait 30 days, re-test. The 180-day waiting clock starts only from a passing test.",
          "180-day wait begins from the blood draw date (Day 0) — pet must arrive in Japan on Day 180 or later. Arriving even one day early triggers detention quarantine for the remaining days, owner pays.",
        ],
      },
      {
        title: "40+ days before arrival",
        items: [
          "Submit <a href=\"https://www.maff.go.jp/aqs/english/animal/dog/import-other.html\" target=\"_blank\" rel=\"noopener noreferrer\">Advance Notification Form</a> to the AQS office at your intended port of arrival — by mail or fax. Forms differ for dogs vs cats.",
          "Notification includes: microchip number, vaccination dates and vaccine details, blood draw date and titer result, pet's physical measurements (length and height), home address, destination address in Japan, copy of passport.",
          "Submissions less than 40 days before arrival are generally not accepted — this can block entry entirely regardless of other paperwork.",
          "AQS reviews and issues 'Approval of Import Inspection' — required for boarding.",
          "If quarantine facility at your chosen port is full on your date, AQS may direct you to change port or date.",
        ],
      },
      {
        title: "10 days before",
        items: [
          "USDA-accredited (or country-equivalent) vet performs final clinical inspection and completes Form A (animal info) and Form C (health certificate). Dogs: confirm free of rabies and leptospirosis symptoms. Cats: confirm free of rabies symptoms.",
          "AQS recommends emailing a draft of the completed form for review BEFORE getting government endorsement — catches errors that would otherwise trigger detention.",
          "USDA APHIS (or country equivalent) endorses Form AC. No erasing, no correction fluid, no pencil. Missing endorsement stamp, missing microchip number, or missing vaccine product/manufacturer details are major detention triggers.",
          "Tick, tapeworm, nematode, and cestode treatment.",
        ],
      },
      {
        title: "Travel day",
        items: [
          "Bring ALL originals: Form AC with USDA endorsement, original titer test result, vaccination records, microchip certificate, AQS Approval of Import Inspection, passport.",
          "Book flights to arrive in Japan BEFORE 5 PM — pets arriving after 5 PM cannot be released from their crate until customs reopens the next day.",
          "Most international flights to Japan are cargo only — JAL and ANA do not carry cabin pets on any flight. Cabin options: United (US ↔ Japan), Korean carriers (Japan ↔ Korea), Aeromexico (Japan ↔ Mexico).",
        ],
      },
      {
        title: "On arrival in Japan",
        items: [
          "Proceed to AQS at the arrival port — pets cleared in under 12 hours if paperwork is perfect (this is what AQS calls 'quarantine' but is really just inspection time).",
          "AQS officer scans microchip, verifies it matches every document exactly, reviews titer result and Form AC.",
          "If anything is missing or wrong, pet is detained at AQS facility for up to 180 days at owner's expense (boarding, feeding, transport, vet visits).",
          "Once cleared, AQS issues Import Quarantine Certificate — keep this permanently.",
          "Within 30 days of arrival, register the dog with your local municipal office and present the Import Quarantine Certificate. Dogs must receive annual rabies booster under Japan's Rabies Prevention Law.",
        ],
      },
      {
        title: "Departing FROM Japan (export)",
        items: [
          "Apply for export inspection from AQS — JAL and ANA recommend at least 2 weeks before flight. Cargo space must be reserved.",
          "AQS issues Export Quarantine Certificate — valid 180 days.",
          "Most international airlines won't carry cabin pets out of Japan. United (US-bound) and Korean carriers (Korea-bound) are the main cabin options. Otherwise cargo.",
          "Destination country may have its own import paperwork — start that process in parallel with the Japan export side.",
        ],
      },
      {
        title: "If you're flying with a cat",
        items: [
          "Cats follow the same AQS process as dogs — microchip, two rabies vaccines, FAVN titer, 180-day wait, Form AC.",
          "Cats don't have the dog-specific leptospirosis check on Form C.",
          "Most international cabin pet options for Japan are dog-policy-led — confirm the carrier accepts cats specifically (most do, but verify).",
          "Cats are exempt from the post-arrival municipal registration that applies to dogs.",
        ],
      },
    ],
  },
  norway: {
    title: "Norway entry / exit checklist",
    sections: [
      {
        title: "First — understand",
        items: [
          "Norway is in the EEA (not the EU) but follows the EU pet passport system — same microchip + rabies vaccine baseline as any EU country. Norway's official authority is the Norwegian Food Safety Authority (Mattilsynet) — see their <a href=\"https://www.mattilsynet.no/en/animals/guide-travelling-with-pets-to-norway\" target=\"_blank\" rel=\"noopener noreferrer\">official guide to travelling with pets to Norway</a>.",
          "Pets enter Norway ONLY via Oslo Airport (OSL) Gardermoen or the Storskog land border in northern Norway. Other airports turn pets away.",
          "Norway BANS seven dog breeds outright: Pit Bull Terrier, American Staffordshire Terrier, Fila Brasileiro, Tosa Inu, Dogo Argentino, Czechoslovakian Wolfdog, and all wolf-dog hybrids. Mixed-breeds resembling these may need documentation.",
          "Pets travelling Norway↔Sweden specifically do not need a rabies vaccine (special bilateral exemption).",
        ],
      },
      {
        title: "4+ weeks before",
        items: [
          "ISO 11784/11785 microchip implanted (if not already). Tattoos are accepted as ID only if applied before 3 July 2011 with continuous rabies vaccine records since.",
          "Rabies vaccine — pet must be at least 12 weeks old when first vaccinated; ≥21 days must have passed before entry to Norway.",
          "If coming from a 'non-listed third country' (most of the world outside EU/EEA/listed countries): rabies antibody titer test (≥0.5 IU/ml), then a 3-month wait before entry. Once passed, the titer is valid indefinitely as long as rabies boosters stay current.",
          "EU pet passport (if you live in the EU/EEA) OR EU Health Certificate for Norway (from elsewhere) — issued by your origin country vet.",
        ],
      },
      {
        title: "10 days before",
        items: [
          "Health certificate completed and signed by an accredited vet (EU Health Certificate template for Norway). The certificate must clearly identify your pet by microchip number.",
          "<strong>Note — two separate documents:</strong> the EU Health Certificate / pet passport is the GOVERNMENT document proving your pet meets Norway's import rules. Your airline (SAS, Norwegian) separately wants a 'fit to fly' vet letter confirming your pet is healthy enough to travel. The health certificate often satisfies both, but some airlines insist on a separate fit-to-fly letter — confirm with your specific airline.",
          "Re-confirm SAS or Norwegian cabin booking by phone.",
        ],
      },
      {
        title: "1–5 days before (dogs only)",
        items: [
          "Tapeworm treatment for Echinococcus multilocularis — administered by a vet 24–120 hours (1–5 days) before arrival in Norway. Active ingredient must be praziquantel.",
          "Treatment date and time MUST be recorded by the vet in the pet passport or health certificate.",
          "Exemption: dogs coming directly from Finland, Malta, or Ireland do NOT need the tapeworm treatment (those countries are already Echinococcus-free).",
          "Failure to deworm: minimum NOK 7,000 fine and 24-hour quarantine at owner's expense.",
        ],
      },
      {
        title: "Travel day",
        items: [
          "Bring originals of: pet passport or EU Health Certificate, vaccination records, microchip certificate, tapeworm treatment record (dogs).",
          "On arrival at Oslo Gardermoen, follow the RED channel in the customs area. Present the animal and documents to Norwegian Customs.",
          "If documents are in order: cleared on the spot — no quarantine.",
          "If anything is missing: pet may be returned to origin, quarantined until conditions are met, or in severe cases destroyed. Owner is financially liable for all rule violations.",
        ],
      },
      {
        title: "If you're flying with a cat",
        items: [
          "Cats do NOT need tapeworm treatment — that requirement is dog-only.",
          "All other rules (microchip, rabies, EU pet passport, ≥21-day wait after vaccine) apply identically to cats.",
          "Kittens under 12 weeks cannot be vaccinated against rabies — they can't enter Norway without the full 21-day post-vaccine wait.",
        ],
      },
    ],
  },
  south_america: {
    title: "South America entry / exit checklist",
    sections: [
      {
        title: "First — understand",
        items: [
          "Each South American country has its own rules. Brazil is the most lenient (no microchip required, no titer, 21-day post-rabies wait). Argentina, Uruguay, Chile, Peru, and Colombia require ISO microchips and import permits.",
          "All major airlines flying cabin pets in South America cap at 10 kg combined (LATAM 7 kg on some aircraft, Avianca 10 kg, Copa 10 kg). Brachycephalic dogs can fly cabin but NOT cargo on LATAM, Avianca, or Copa.",
          "Colombia bans the import of Pit Bull, American Staffordshire Terrier, Staffordshire Terrier, and crosses by law (Article 108-E). These breeds CANNOT enter Colombia regardless of paperwork.",
          "Uruguay has no direct US cabin pet route — connect via Copa (Panama City), Avianca (Bogotá), or LATAM (São Paulo / Buenos Aires).",
          "Brazil → US: dogs must be at least 6 months old at entry, microchipped before rabies vaccine, and on the standard (not high-risk) CDC track. Brazil itself isn't on CDC's high-risk list as of 2026 — but always verify before travel.",
        ],
      },
      {
        title: "4+ weeks before",
        items: [
          "ISO 11784/11785 microchip implanted (required for Argentina, Uruguay, Chile, Peru, Colombia; recommended for Brazil even though not required).",
          "Rabies vaccine: at least 21 days before travel for Brazil; at least 30 days for Argentina, Uruguay, Chile, Peru, Colombia.",
          "Apply for the destination country's import permit if required: Chile (SAG) and Peru (SENASA) need pre-trip permits — apply 30+ days ahead. Argentina (SENASA) and Uruguay (MGAP) verify at the airport but documentation must be in order.",
          "Book your LATAM, Avianca, or Copa cabin pet spot — call the Contact Center, not online. All three airlines require their own metal (no codeshare partners).",
        ],
      },
      {
        title: "10 days before",
        items: [
          "Veterinary health certificate from your origin country's official authority (USDA APHIS for US origins, AHC for UK origins, EU vet for EU origins).",
          "Health certificate must be issued within 10 days of travel and confirm the pet is free of infectious and parasitic diseases.",
          "Internal and external parasite treatment (typically Drontal + Frontline) administered shortly before travel — record on the health certificate.",
          "For Brazil: confirm with your vet that vaccinations are on the standard list (Distemper, Hepatitis, Parvovirus, Leptospirosis, Parainfluenza for dogs; FVRCP for cats).",
          "For Uruguay: MGAP requires the health certificate to be endorsed by the official veterinary authority of the origin country.",
        ],
      },
      {
        title: "Travel day",
        items: [
          "Bring originals of: health certificate (USDA-endorsed or equivalent), rabies vaccine certificate, microchip implant records, import permit (Chile/Peru), and parasite treatment record.",
          "Arrive 3+ hours early for international departures — pet check-in is a separate counter at most South American hubs.",
          "Confirm cabin pet booking by phone with LATAM/Avianca/Copa 24–48 hours before departure (space is limited per flight).",
        ],
      },
      {
        title: "On arrival",
        items: [
          "Brazil: present documents at the customs (Receita Federal) and agriculture (MAPA/VIGIAGRO) counter on arrival. No quarantine if documents are in order.",
          "Argentina: SENASA inspection at EZE — present documentation, inspection typically 15–30 minutes.",
          "Uruguay: MGAP inspection at MVD on arrival. No quarantine if documents are in order.",
          "Chile: SAG inspection mandatory; documentation strict. If your import permit isn't pre-arranged, your pet will be detained.",
          "Colombia: ICA inspection; banned breed verification on arrival.",
          "Peru: SENASA inspection at LIM. Health certificate from origin country must be present.",
        ],
      },
      {
        title: "Returning to the US from South America",
        items: [
          "Standard CDC Dog Import Form (online, valid 6 months for multiple entries to same port).",
          "Certification of US-Issued Rabies Vaccination form (replaces health certificate for US-vaccinated dogs as of 2025).",
          "Dog must be 6+ months old and microchip detectable on arrival.",
          "Cats: no CDC requirements specific to cats.",
        ],
      },
      {
        title: "If you're flying with a cat",
        items: [
          "Same paperwork as dogs (microchip, rabies, health certificate) but no breed restrictions.",
          "Cats are exempt from CDC's US re-entry forms — easier on the return.",
          "Brazil exempts cats under 90 days old from rabies if from a low-risk origin (Brazil itself is medium-risk).",
        ],
      },
    ],
  },
};

// For routes where direction (departing vs arriving) genuinely changes the checklist content,
// these overrides replace the default CHECKLIST_DATA entry for that direction.
// Routes not in this map show the same checklist either direction.
const DIRECTIONAL_CHECKLISTS = {
  uk: {
    departing: {
      title: "Departing the UK — pet cabin checklist",
      sections: [
        {
          title: "6 weeks before",
          items: [
            "ISO 11784/11785 microchip implanted (if not already)",
            "Rabies vaccine ≥21 days old before departure",
            "Book GB Animal Health Certificate (AHC) appointment with an Official Veterinarian (OV)",
            "Book cabin pet space with the airline (Air Canada, Air France/KLM, Lufthansa, SWISS, LOT, TAP, Etihad, Turkish, Iberia, ITA — economy only on most)",
            "Tapeworm treatment timing: 24–120 hrs before arrival if destination is Ireland, Malta, Finland, or Norway (dogs only)",
          ],
        },
        {
          title: "10 days before",
          items: [
            "GB Animal Health Certificate (AHC) signed and stamped by OV",
            "AHC is valid 10 days from signing for outbound EU entry",
            "Re-confirm airline cabin pet booking by phone",
            "Pre-book Heathrow Animal Reception Centre if going cargo route",
          ],
        },
        {
          title: "Travel day",
          items: [
            "Bring AHC originals (not photocopies)",
            "Arrive 3 hours early — pet check-in is in person",
            "Window seat preferred",
            "Walk your dog properly outside before entering the airport (LHR's pet relief area is small)",
          ],
        },
        {
          title: "If you're flying with a cat",
          items: [
            "Cats skip the tapeworm treatment — that's a dogs-only requirement (for UK, Ireland, Malta, Finland, Norway destinations)",
            "AHC, microchip and rabies requirements are identical for cats — same process, same paperwork",
            "You can't walk a cat before the airport — give full litter tray access right up until you leave home, and don't feed within ~4 hours of departure",
            "Use Feliway (cat pheromone spray) in the carrier 15 minutes before, never on the cat",
            "Fit a harness and practise it at home — at security the cat must come out of the carrier",
            "LHR is one of the better airports for cabin cat departures — most UK-out cabin carriers (Air France, KLM, Lufthansa) accept cats on the same terms as dogs",
          ],
        },
      ],
    },
    arriving: {
      title: "Arriving in the UK — important: no cabin pet flights INTO the UK",
      restriction: "⚠ Cabin entry into the UK is not permitted on any commercial airline (UK government rule, all carriers, not the airline's choice). All inbound pets must enter as IATA-compliant cargo OR via the Eurotunnel / ferry pet-friendly land routes from Europe.",
      sections: [
        {
          title: "Option 1 — The cabin workaround (Paris pivot)",
          items: [
            "Fly cabin into a continental EU airport (Paris CDG most common; also Amsterdam, Frankfurt, Lisbon)",
            "Train/drive/taxi to Calais, France",
            "Eurotunnel Le Shuttle (35 min) to Folkestone — pets stay in your car",
            "Drive 1.5 hours to London",
            "Pet stays with you the whole way — this is the standard cabin-pets workaround for UK entry",
          ],
        },
        {
          title: "Option 2 — Cargo via Heathrow",
          items: [
            "Book with an IATA-approved pet shipper (BA, Virgin, Lufthansa Cargo)",
            "Pet enters via Heathrow Animal Reception Centre",
            "Allow 6–8 hours for clearance after landing",
            "Standard UK paperwork still applies: ISO microchip, rabies ≥21 days, AHC, tapeworm treatment (dogs)",
          ],
        },
        {
          title: "Universal UK entry requirements (both routes)",
          items: [
            "ISO 11784/11785 microchip — implanted FIRST, before rabies vaccine",
            "Rabies vaccine ≥21 days old (no upper limit if boosters kept current)",
            "GB Animal Health Certificate or EU Animal Health Certificate (origin-country dependent)",
            "Tapeworm treatment 24–120 hours before UK arrival (dogs only — vet must record in AHC)",
            "Pre-2021 UK pet passports no longer accepted",
          ],
        },
      ],
    },
  },
  usa: {
    departing: {
      title: "Departing the USA — pet cabin checklist",
      sections: [
        {
          title: "6–8 weeks before",
          items: [
            "Vet appointment for full health check",
            "ISO microchip implanted (if not already; required for most destinations)",
            "Rabies vaccine current",
            "Research destination country's import requirements — every country differs",
            "Book cabin pet space directly with airline by phone",
          ],
        },
        {
          title: "2–4 weeks before",
          items: [
            "Identify a USDA-accredited vet for the export health certificate",
            "Confirm whether destination needs an EU Health Certificate, country-specific health cert, or both",
            "If returning to US from CDC high-risk country: get the Certification of U.S.-issued Rabies Vaccination form endorsed by USDA BEFORE leaving (cannot be issued retroactively)",
          ],
        },
        {
          title: "10 days before",
          items: [
            "USDA-accredited vet signs export health certificate (destination-specific)",
            "USDA APHIS endorsement (timing varies by state — some same-day, some mail-in)",
            "Confirm CDC Dog Import Form receipt is ready for your eventual return",
          ],
        },
        {
          title: "Travel day",
          items: [
            "Bring originals (not photos) of all certificates",
            "Bring Certification of U.S.-issued Rabies Vaccination form (for return)",
            "Bring CDC Dog Import Form receipt (for return)",
            "Walk your dog properly outside before entering the airport",
            "Window seat preferred; extra-legroom if airline allows pets there",
          ],
        },
      ],
    },
    arriving: {
      title: "Arriving in the USA — pet cabin checklist",
      sections: [
        {
          title: "8 weeks before",
          items: [
            "Vet appointment for full health check",
            "ISO microchip implanted (if not already)",
            "Rabies vaccine 30 days–12 months old",
            "Check current CDC dog import rules — they updated August 2024 (and again for high-risk countries 2025)",
          ],
        },
        {
          title: "4 weeks before",
          items: [
            "CDC Dog Import Form completed online — get the receipt (valid 6 months, multiple entries)",
            "Confirm whether origin country is on the CDC high-risk rabies list (changes the paperwork)",
            "Book cabin pet space with airline",
            "Confirm dog is at least 6 months old at entry (CDC requirement)",
          ],
        },
        {
          title: "10 days before",
          items: [
            "Vet visit: get origin-country health certificate signed and stamped by official vet",
            "For high-risk countries: get FAVN rabies titer if not done already",
            "Re-confirm cabin booking by phone",
          ],
        },
        {
          title: "Travel day",
          items: [
            "Bring CDC Dog Import receipt printout",
            "All certificates as originals (not photos)",
            "Arrive 3 hours early for international",
            "CBP officer checks paperwork on arrival — typically fast if complete",
          ],
        },
        {
          title: "If you're flying with a cat",
          items: [
            "Cats do NOT need the CDC Dog Import Form — that's dogs only",
            "No federal requirement for cats to show proof of rabies vaccination to enter the US, but your airline will likely want a current rabies certificate",
            "Some US states (notably Hawaii) have their own stricter rules — check your specific destination state",
            "Cats are inspected on arrival and must appear healthy",
            "At US security the cat must come out of the carrier — a harness is essential, practise it at home",
            "You can't walk a cat before the flight — give litter tray access until you leave home, no food within ~4 hours of departure",
          ],
        },
      ],
    },
  },
  uae: {
    departing: {
      title: "Departing the UAE — pet cabin checklist",
      sections: [
        {
          title: "6+ weeks before",
          items: [
            "Vet appointment for full health check",
            "ISO 15-digit microchip verified",
            "Rabies vaccine current (≥21 days old, ≤12 months)",
            "Book cabin pet space (Etihad cabin OUT of AUH to many cities; Air India cabin OUT of UAE to India)",
            "Check destination country's import rules — UAE is a rabies-controlled country but not on every country's 'safe' list",
          ],
        },
        {
          title: "4 weeks before",
          items: [
            "MOCCAE Export Certificate / Health Certificate application",
            "Government-accredited vet stamps the export certificate",
            "Confirm departure terminal at AUH or DXB",
          ],
        },
        {
          title: "5 days before",
          items: [
            "UAE Health Certificate signed and stamped",
            "Email all documents to your airline (Etihad requires docs ≥72 hours before)",
            "Re-confirm cabin booking by phone",
          ],
        },
        {
          title: "Travel day",
          items: [
            "Bring originals of all certificates",
            "MOCCAE inspection at departure",
            "Arrive 3 hours early for international",
            "Pet relief areas at AUH and DXB are limited — walk before arriving",
          ],
        },
      ],
    },
    arriving: {
      title: "Arriving in the UAE — important: cabin entry ONLY into Abu Dhabi",
      restriction: "⚠ No airline allows cabin pets into Dubai (DXB) — UAE law requires all pets entering through DXB to travel as manifested cargo. The ONLY cabin entry to the UAE is via Etihad to Abu Dhabi (AUH), then 90 minutes by road to Dubai.",
      sections: [
        {
          title: "8 weeks before",
          items: [
            "Vet appointment for full health check",
            "ISO 15-digit microchip (UAE strictly requires ISO 11784/11785 compliant)",
            "Rabies vaccine ≥21 days old, ≤12 months",
            "Rabies titer test (FAVN) if from a rabies-controlled country — UAE requires ≥0.5 IU/ml",
          ],
        },
        {
          title: "4 weeks before",
          items: [
            "Apply for MOCCAE import permit via moccae.gov.ae — ~AED 200",
            "Book Etihad cabin space for AUH (only cabin option) — submit Etihad's booking form 7+ days before",
            "If your origin allows cabin Etihad doesn't fly from: you need to pivot via Europe (Paris/Frankfurt/Amsterdam → Etihad to AUH)",
            "If using Dubai cargo (DXB only): arrange Dubai Kennels & Cattery (DKC) or another customs broker",
          ],
        },
        {
          title: "5 days before",
          items: [
            "UAE Health Certificate signed/stamped by government-accredited vet from origin",
            "Email all documents to Etihad ≥72 hours before",
            "If cargo: confirm pickup/drop-off times with broker",
          ],
        },
        {
          title: "Travel day",
          items: [
            "REMEMBER: Cabin entry only into Abu Dhabi (AUH) on Etihad — NOT Dubai",
            "Bring originals of all certificates",
            "Pet undergoes MOCCAE inspection after immigration at AUH (in Customs clearance)",
            "From AUH to Dubai: 90-minute taxi (around AED 250)",
          ],
        },
      ],
    },
  },
  canada: {
    departing: {
      title: "Departing Canada — pet cabin checklist",
      sections: [
        {
          title: "4–6 weeks before",
          items: [
            "Vet appointment for full health check",
            "ISO microchip verified (needed for almost all international destinations)",
            "Rabies vaccine current — confirm validity for destination country",
            "Book cabin pet space (Air Canada has strong cabin reach; AA, Delta, United, WestJet also)",
            "Research destination's import rules — Canada's exit prep is simple but the destination side may need months of work (e.g. Jamaica, Australia)",
          ],
        },
        {
          title: "10 days before",
          items: [
            "CFIA-accredited vet signs international health certificate (within 10 days of arrival)",
            "Most destinations accept Canadian vet certificates without further endorsement",
            "Re-confirm cabin booking by phone",
            "If returning to Canada later: keep your rabies certificate handy for re-entry",
          ],
        },
        {
          title: "Travel day",
          items: [
            "Bring originals (rabies + health certificate)",
            "Arrive 3 hours early for international",
            "Window seat preferred",
            "Most Canadian airports have pet relief areas — but walk before entering",
          ],
        },
        {
          title: "Reminder",
          items: [
            "Departing Canada doesn't require an export permit for personal pets to most countries",
            "BUT your destination's rules (microchip timing, FAVN titer, quarantine permits) often take 6+ months to satisfy",
            "Start with the destination's official Department of Agriculture page",
          ],
        },
      ],
    },
    arriving: {
      title: "Arriving in Canada — pet cabin checklist",
      sections: [
        {
          title: "4–6 weeks before",
          items: [
            "Vet appointment for full health check",
            "ISO microchip implanted (recommended; not strictly required by CFIA but most airlines require it)",
            "Rabies vaccine ≥30 days old for adult dogs",
            "Book cabin pet space with airline",
            "Confirm your origin's exit paperwork requirements (separate from Canada's import rules)",
          ],
        },
        {
          title: "10 days before",
          items: [
            "Vet-issued international health certificate (CFIA recommends within 10 days of arrival)",
            "If from US: USDA-accredited vet only — APHIS endorsement NOT required for Canada (saves time)",
            "If from elsewhere: country-specific government health certificate",
            "Re-confirm airline cabin pet booking by phone",
          ],
        },
        {
          title: "Travel day",
          items: [
            "Bring rabies vaccination certificate (original)",
            "Bring vet-issued health certificate (original)",
            "CBSA inspection on arrival — typically quick if paperwork is complete",
            "Most Canadian airports have pet relief areas",
          ],
        },
        {
          title: "Important notes",
          items: [
            "Commercial dogs younger than 8 months from countries with high risk of dog rabies face additional requirements",
            "Personal pets (not commercial) under 3 months old: no rabies vaccine requirement but limited destinations",
            "Cats face fewer restrictions but still need health certificate",
          ],
        },
      ],
    },
  },
  mexico: {
    departing: {
      title: "Departing Mexico — pet cabin checklist",
      sections: [
        {
          title: "4 weeks before",
          items: [
            "Vet appointment for full health check",
            "Confirm your pet is microchipped (most destinations require ISO)",
            "Rabies vaccine current",
            "Book cabin pet space (Aeromexico, AA, Delta, United, Volaris)",
            "Research destination's import rules — these vary significantly",
          ],
        },
        {
          title: "10 days before",
          items: [
            "SADER/SENASICA endorsed health certificate (if destination requires it)",
            "Most destinations want a Mexican government-vet stamp",
            "Standard internal/external parasite treatments documented",
            "Re-confirm cabin booking by phone",
          ],
        },
        {
          title: "Travel day",
          items: [
            "Bring rabies certificate (original)",
            "Bring health certificate (original)",
            "Arrive 3 hours early for international",
          ],
        },
        {
          title: "Reminder",
          items: [
            "If returning to the US: CDC Dog Import Form receipt needed (online, free)",
            "Mexico isn't on the CDC high-risk rabies list, so US re-entry is straightforward",
            "If returning to EU: 3-month wait may apply (Mexico is unlisted third country)",
          ],
        },
      ],
    },
    arriving: {
      title: "Arriving in Mexico — pet cabin checklist",
      sections: [
        {
          title: "4 weeks before",
          items: [
            "Vet appointment for full health check",
            "ISO microchip recommended (not strictly required by SADER)",
            "Rabies vaccine ≥15 days old before travel",
            "Book cabin pet space (Aeromexico, Volaris, Air Canada, AA, Delta, United)",
            "Confirm origin country's export paperwork requirements",
          ],
        },
        {
          title: "10 days before",
          items: [
            "Vet-issued health certificate stating pet is free of parasites and infectious disease",
            "If from US: USDA APHIS endorsement is optional but recommended",
            "Internal/external deworming and tick treatment (within 6 months for ticks, dewormer date noted)",
            "Re-confirm airline cabin booking by phone",
          ],
        },
        {
          title: "Travel day",
          items: [
            "Bring rabies vaccination certificate (original)",
            "Bring vet health certificate (original)",
            "SADER/SENASICA inspection at Mexican port of entry — free of charge",
            "If paperwork is incomplete: official quarantine at owner's expense until resolved",
          ],
        },
      ],
    },
  },
  europe: {
    departing: {
      title: "Departing Europe — pet cabin checklist",
      sections: [
        {
          title: "4–6 weeks before",
          items: [
            "Vet appointment for full health check",
            "EU pet passport is valid for life if rabies stays current — for EU residents (GB residents can no longer use one; they need a GB AHC)",
            "If returning to EU later: keep the pet passport current (rabies vaccine + microchip)",
            "Book cabin pet space (Air France, KLM, Lufthansa, SWISS, LOT, TAP, Iberia, ITA all support cabin)",
            "Research destination's import rules — especially for UK (Eurotunnel workaround), USA (CDC Dog Import Form), UAE (MOCCAE permit)",
          ],
        },
        {
          title: "10 days before",
          items: [
            "If going to non-EU: EU vet issues international health certificate (destination-specific)",
            "Some destinations require additional vet stamps from your country's agriculture ministry",
            "Re-confirm airline cabin booking by phone",
            "Tapeworm treatment 24–120 hrs before if going to UK or Ireland (dogs only)",
          ],
        },
        {
          title: "Travel day",
          items: [
            "Originals of all certificates",
            "EU pet passport + destination-specific health certificate",
            "Arrive 3 hours early for international",
            "Window seat preferred",
          ],
        },
        {
          title: "Reminder on destinations",
          items: [
            "UK: cabin not allowed INTO UK — see Eurotunnel workaround in UK arriving checklist",
            "USA: CDC Dog Import Form receipt needed in advance",
            "UAE: only cabin entry is via Etihad to Abu Dhabi (AUH), then road to Dubai",
            "Always confirm the destination's specific requirements directly with their official agriculture authority",
          ],
        },
      ],
    },
    arriving: {
      title: "Arriving in Europe — pet cabin checklist",
      sections: [
        {
          title: "4–6 weeks before",
          items: [
            "ISO 11784/11785 microchip implanted FIRST",
            "Rabies vaccine AFTER microchip (≥21 days before EU entry)",
            "Official vet appointment booked for health certificate (varies by origin country)",
            "Confirm whether your airline allows cabin pets on this leg",
          ],
        },
        {
          title: "10 days before",
          items: [
            "Get destination-appropriate health certificate (EU Health Cert from US, GB AHC from UK, etc.)",
            "USDA APHIS endorsement (US only) — same day as vet certificate ideally",
            "Re-confirm airline cabin booking by phone",
          ],
        },
        {
          title: "Travel day",
          items: [
            "Originals required at EU border, not photos",
            "Arrive 3 hours early for international",
            "Bring calming spray for long flights",
            "Window seat if possible; extra-legroom if airline allows",
          ],
        },
        {
          title: "Origin reminders",
          items: [
            "From UK: GB Animal Health Certificate from your UK Official Vet",
            "From US: EU Health Certificate from USDA-accredited vet + APHIS endorsement",
            "From India: Air India Paws on Board direct cabin to Paris; or Etihad/Lufthansa/SWISS via hub",
            "Tapeworm treatment may also be required if you then continue to UK, Ireland, Malta, Finland, or Norway (dogs only)",
          ],
        },
      ],
    },
  },
  india: {
    departing: {
      title: "Departing India — pet cabin checklist",
      sections: [
        {
          title: "4 weeks before",
          items: [
            "Apply for No Objection Certificate (NOC) from AQCS",
            "Confirm pet's ISO microchip + rabies vaccine valid",
            "Parvo, distemper, leptospirosis vaccines up to date",
            "Book cabin pet space (Air India Paws on Board direct to Paris; Lufthansa/KLM/Air France via Europe; Etihad to Abu Dhabi; Turkish via Istanbul)",
            "Confirm departure airport supports your specific airline's cabin pet booking",
          ],
        },
        {
          title: "2 weeks before",
          items: [
            "AQCS-stamped export health certificate from a recognised vet",
            "Government-accredited vet stamps NOC plus health certificate",
            "Re-confirm airline cabin booking by phone (pets approved 48 hrs prior on Air India)",
            "Tapeworm treatment 24–120 hrs before arrival if going to UK or Ireland (dogs only)",
          ],
        },
        {
          title: "Travel day",
          items: [
            "Have NOC printed AND digital copy",
            "Bring all original certificates",
            "Arrive 4 hours early for international",
            "Confirm with airline that cabin slot still applies",
          ],
        },
        {
          title: "Reminder on destinations",
          items: [
            "USA from India: cabin via European hub airline (Lufthansa, KLM, Air France, SWISS, LOT) — no direct India ↔ USA cabin",
            "UK from India: Eurotunnel workaround required (no cabin into UK)",
            "UAE from India: Etihad direct to Abu Dhabi (Delhi/Mumbai/Bangalore/Chennai supported)",
            "Australia from India: cargo only + mandatory quarantine",
          ],
        },
      ],
    },
    arriving: {
      title: "Arriving in India — pet cabin checklist",
      sections: [
        {
          title: "4 weeks before",
          items: [
            "Apply for No Objection Certificate (NOC) from AQCS (Animal Quarantine and Certification Service)",
            "ISO microchip implanted (if not already)",
            "Rabies vaccine 30 days–12 months before travel",
            "Parvo, distemper, leptospirosis vaccines up to date",
            "Confirm entry airport: Delhi, Mumbai, Chennai, Kolkata, Bengaluru, or Hyderabad only",
          ],
        },
        {
          title: "2 weeks before",
          items: [
            "Book Air India cabin slot (if eligible route) OR cabin via Europe (Lufthansa, KLM, Air France, SWISS, LOT)",
            "Get official health certificate from origin country vet",
            "If from UK/EU: confirm tapeworm treatment timing if you'll return to UK",
          ],
        },
        {
          title: "Travel day",
          items: [
            "Have NOC printed AND digital copy",
            "Arrive 4 hours early for international",
            "Confirm with airline that cabin slot still applies — pets approved 48 hrs prior on Air India",
          ],
        },
        {
          title: "Origin reminders",
          items: [
            "From USA: USDA APHIS endorsement on health certificate; CDC Dog Import Form for return",
            "From UK: GB Animal Health Certificate; pre-2021 UK pet passports not accepted",
            "From UAE: MOCCAE export certificate; Etihad/Air India cabin out of UAE allowed",
            "From EU: EU pet passport or country-specific health certificate",
          ],
        },
      ],
    },
  },
  dominican_republic: {
    departing: {
      title: "Departing Dominican Republic — pet cabin checklist",
      sections: [
        {
          title: "4 weeks before",
          items: [
            "Vet appointment for full health check",
            "Confirm ISO microchip + rabies vaccine still valid",
            "Book cabin pet space (JetBlue, AA, Delta all cabin DR routes; Spirit some)",
            "Research destination's import rules",
            "IMPORTANT: if returning to the US, your Certification of U.S.-issued Rabies Vaccination form (obtained before you left) is still valid — bring it",
          ],
        },
        {
          title: "10 days before",
          items: [
            "DR Ministry of Agriculture endorsed health certificate",
            "Government vet stamps export certificate",
            "Re-confirm cabin booking by phone",
          ],
        },
        {
          title: "Travel day",
          items: [
            "Bring originals: rabies + health certificate + (for US return) Certification of US-issued Rabies Vaccination",
            "DR is on CDC high-risk rabies list — US return requires more paperwork than you might expect",
            "Arrive 3 hours early",
          ],
        },
        {
          title: "Reminder for US visitors going home",
          items: [
            "DR → USA: dog must be at least 6 months old at re-entry",
            "Microchipped, healthy, all paperwork in order",
            "Certification of US-issued Rabies Vaccination MUST be from before you left the US — cannot be issued in DR",
            "CDC Dog Import Form receipt is your other key document",
          ],
        },
      ],
    },
    arriving: {
      title: "Arriving in Dominican Republic — pet cabin checklist",
      sections: [
        {
          title: "6–8 weeks before",
          items: [
            "Vet appointment for full health check",
            "ISO 15-digit microchip implanted FIRST (must precede rabies vaccine)",
            "Rabies vaccine 30 days–12 months old (after microchip)",
            "DHPP for dogs (distemper, hepatitis, parainfluenza, parvovirus); FVRCP for cats",
            "IMPORTANT: DR is a CDC high-risk country for dog rabies — this affects your return to the US",
          ],
        },
        {
          title: "If returning to the US: do this BEFORE departure",
          items: [
            "Get Certification of U.S.-issued Rabies Vaccination form from a USDA-accredited vet (NOT a regular rabies certificate)",
            "Form must be USDA-endorsed BEFORE your dog leaves the US — cannot be issued retroactively",
            "USDA-endorsed export health certificates dated after July 31, 2025 are NOT accepted — use the Certification form instead",
            "CDC Dog Import Form receipt (online) for your return entry",
            "Plan: dog must be at least 6 months old at time of US re-entry",
          ],
        },
        {
          title: "10 days before travel to DR",
          items: [
            "USDA-accredited vet issues Health Certificate for export to DR (valid 10 days)",
            "Certificate includes microchip number, rabies info, parasite treatments",
            "Consulate endorsement NOT required for personal pets",
            "Re-confirm cabin pet booking with airline",
          ],
        },
        {
          title: "Travel day",
          items: [
            "Bring original (signed/stamped) Health Certificate",
            "Bring Certification of U.S.-issued Rabies Vaccination (for return)",
            "Bring CDC Dog Import Form receipt (for return)",
            "DR inspection on arrival — typically quick if paperwork complete",
          ],
        },
      ],
    },
  },
  jamaica: {
    departing: {
      title: "Departing Jamaica — pet cabin checklist",
      sections: [
        {
          title: "4 weeks before",
          items: [
            "Vet appointment for full health check",
            "Confirm ISO microchip + rabies vaccine still valid",
            "Book cabin pet space (JetBlue, AA, Delta serve Jamaica)",
            "Research destination's import rules — Jamaica isn't on CDC high-risk rabies list",
          ],
        },
        {
          title: "10 days before",
          items: [
            "Jamaica Veterinary Services Division endorsed health certificate",
            "Government vet stamps export certificate (no parasite treatments needed for short-term return)",
            "Re-confirm cabin booking by phone",
          ],
        },
        {
          title: "Travel day",
          items: [
            "Bring originals: rabies + health certificate",
            "Jamaica isn't on the CDC high-risk list — US return is straightforward",
            "Arrive 3 hours early",
          ],
        },
      ],
    },
    arriving: {
      title: "Arriving in Jamaica — pet cabin checklist",
      restriction: "⚠ Jamaica's pet import process is one of the strictest in the Caribbean. Allow 6+ months from start to travel — there's no fast-track option.",
      sections: [
        {
          title: "6+ MONTHS before (this is a long process)",
          items: [
            "ISO 15-digit microchip implanted FIRST (must precede rabies vaccine)",
            "Rabies vaccine administered (after microchip) — primary vaccine needs 3-month wait before entry for dogs over 12 months",
            "FAVN rabies titer test done 30+ days after vaccination at an OIE/WHO-approved lab",
            "Titer result must be valid (≥0.5 IU/ml) and dated 3–12 months before arrival",
            "IMPORTANT: Jamaica only accepts pets directly from Category 1 (rabies-controlled) countries — pets from elsewhere must have lived in a Category 1 country for 6+ months first",
          ],
        },
        {
          title: "Permit application (start ASAP after titer)",
          items: [
            "Submit Preliminary Application Form to vsdpermits@moa.gov.jm",
            "Attach rabies certificate + FAVN titer results",
            "Wait for Pre-Export Treatment Schedule from Jamaica Veterinary Services Division",
            "DO NOT start additional treatments until Preliminary Application is approved",
            "Apply for Veterinary Import Permit (separate from preliminary application)",
          ],
        },
        {
          title: "30 days before — pre-export treatments",
          items: [
            "Two internal parasite treatments, 14 days apart (second within 7 days of travel)",
            "Two external parasite treatments, 14 days apart (second within 48 hours of travel)",
            "Additional vaccinations per Jamaica's schedule: distemper, parvovirus, leptospirosis, hepatitis, parainfluenza",
            "Brucella Canis test for dogs; Leishmaniosis test if required",
          ],
        },
        {
          title: "Travel day",
          items: [
            "Original Veterinary Import Permit (mandatory — no entry without it)",
            "Government-endorsed international health certificate",
            "All vaccination and treatment records (microchip number on every document)",
            "Pit Bull Terriers and hybrid dogs are banned — confirm breed eligibility well in advance",
          ],
        },
      ],
    },
  },
  bahamas: {
    departing: {
      title: "Departing Bahamas — pet cabin checklist",
      sections: [
        {
          title: "4 weeks before",
          items: [
            "Vet appointment for full health check",
            "Confirm ISO microchip + rabies vaccine still valid",
            "Book cabin pet space (JetBlue, AA, Delta serve Nassau and other Bahamas airports)",
            "Confirm Bahamian export documentation requirements",
          ],
        },
        {
          title: "10 days before",
          items: [
            "Bahamas Ministry of Agriculture endorsed health certificate",
            "Government vet stamps export certificate",
            "Re-confirm cabin booking by phone",
          ],
        },
        {
          title: "Travel day",
          items: [
            "Bring originals: rabies + health certificate",
            "Bahamas is CDC-rabies-FREE — US return is among the simplest (just CDC Dog Import Form)",
            "Arrive 3 hours early",
          ],
        },
      ],
    },
    arriving: {
      title: "Arriving in Bahamas — pet cabin checklist",
      sections: [
        {
          title: "8+ weeks before",
          items: [
            "ISO 15-digit microchip implanted FIRST",
            "Rabies vaccine: primary doses need at least 30 days before entry; max 10 months for 1-year vaccine or 34 months for 3-year vaccine",
            "Other vaccinations: distemper, hepatitis, leptospirosis, parvovirus, adenovirus (plus coronavirus if from high-risk rabies country)",
            "Pet must be at least 6 months old at entry",
          ],
        },
        {
          title: "4–6 weeks before — Import Permit",
          items: [
            "Apply for Bahamas Import Permit via bahamaspetpermit.com or email minagriculturalmarine@bahamas.gov.bs",
            "Standard processing: 6–8 weeks (expedited service available)",
            "Permit fee: ~$10 USD + 12% VAT",
            "Banned breeds: Pit Bull, Presa Canario, Cane Corso, American Bully, Staffordshire Terrier — confirm eligibility before applying",
          ],
        },
        {
          title: "48 hours before travel",
          items: [
            "Licensed vet completes International Veterinary Certificate (within 48 hours of arrival in Bahamas)",
            "USDA APHIS endorsement NOT required — vet signature alone is enough",
            "Internal parasite test (negative stool sample test) recorded on certificate",
            "Re-confirm cabin pet booking with airline (JetBlue, AA, Delta all do cabin to Nassau)",
          ],
        },
        {
          title: "Travel day & arrival",
          items: [
            "Original Import Permit (mandatory)",
            "Original Veterinary Certificate (signed within 48 hours of arrival)",
            "Microchip and rabies records",
            "On arrival: pet examined by Bahamian veterinary officer within 48 hours",
            "If staying 28+ days: dog must be licensed locally within 48 hours of entry",
          ],
        },
        {
          title: "Returning to US",
          items: [
            "Bahamas is a CDC dog-rabies-FREE country — return is straightforward",
            "Only the CDC Dog Import Form receipt is needed for re-entry",
            "Dog must be 6+ months old, microchipped, healthy",
            "No titer test or quarantine required on return",
          ],
        },
      ],
    },
  },
};

// Get the right checklist based on route + direction. Falls back to single CHECKLIST_DATA for routes
// where direction doesn't materially change the prep.
function getChecklist(routeId, direction) {
  if (DIRECTIONAL_CHECKLISTS[routeId] && DIRECTIONAL_CHECKLISTS[routeId][direction]) {
    return DIRECTIONAL_CHECKLISTS[routeId][direction];
  }
  return CHECKLIST_DATA[routeId] || CHECKLIST_DATA.generic;
}

// Map a planner REGION id to its checklist-data id.
const REGION_TO_CHECKLIST_ID = {
  "uk-out": "uk", "ireland": "ireland", "us": "usa", "canada": "canada",
  "mexico": "mexico", "europe": "europe", "india": "india", "dubai": "uae",
  "caribbean": null,        // per-island — handled specially below
  "hawaii": null,           // uses generic + Hawaii note
  "south-africa": "south_africa",
  "south-america": "south_america",
  "central-america": null,  // No dedicated checklist — Panama is mainly used as transit; uses generic
  "japan": "japan",
};

// ----- Item-level classification helpers for the merged route checklist -----

// Per-region facts — used to rewrite generic "research this" / "confirm whether"
// items into concrete answers. Only includes facts we have verified.
const ROUTE_FACTS = {
  "uk-out":      { name: "the UK", cdcHighRisk: false, euMember: false, ukOrIreland: true },
  "ireland":     { name: "Ireland", cdcHighRisk: false, euMember: true, ukOrIreland: true },
  "europe":      { name: "Europe", cdcHighRisk: false, euMember: true, ukOrIreland: false },
  "us":         { name: "the US", cdcHighRisk: false, euMember: false, ukOrIreland: false, isUS: true },
  "canada":      { name: "Canada", cdcHighRisk: false, euMember: false, ukOrIreland: false },
  "mexico":      { name: "Mexico", cdcHighRisk: false, euMember: false, ukOrIreland: false },
  "india":       { name: "India", cdcHighRisk: true,  euMember: false, ukOrIreland: false },
  "dubai":       { name: "the UAE", cdcHighRisk: false, euMember: false, ukOrIreland: false },
  "caribbean":   { name: "the Caribbean", cdcHighRisk: "varies", euMember: false, ukOrIreland: false, perIsland: true },
  "hawaii":      { name: "Hawaii", cdcHighRisk: false, euMember: false, ukOrIreland: false, isUS: true, isRabiesFree: true },
  "south-africa": { name: "South Africa", cdcHighRisk: false, euMember: false, ukOrIreland: false },
  "south-america": { name: "South America", cdcHighRisk: false, euMember: false, ukOrIreland: false, perCountry: true },
  "central-america": { name: "Central America", cdcHighRisk: false, euMember: false, ukOrIreland: false, perCountry: true },
  "japan":       { name: "Japan", cdcHighRisk: false, euMember: false, ukOrIreland: false, isRabiesFree: true, strictImport: true },
};

// Transit-only essentials per region. When a workaround route briefly crosses
// a country en route to the final destination (e.g. France for a UK arrival
// via Paris-pivot, or Schengen Europe for a France→Ireland ferry route), the
// pet legally enters that country before continuing. The full arrival
// checklist for that country is overkill — what the user actually needs is
// the transit-specific essentials. Returns null if we don't have transit
// notes for that region.
function getTransitNotes(region, originRegion, legs = []) {
  const origin = ROUTE_FACTS[originRegion];

  // Detect the specific transit city/country from the legs, so the chapter
  // label can be concrete (e.g. "Transiting through France (Paris)") instead
  // of generic ("Transiting through Europe"). Falls back to generic if we
  // can't determine the hub.
  const legText = legs.map((l) => (l.route || "") + " " + (l.airline || "")).join(" ");
  const TRANSIT_CITY_MAP = {
    "(CDG)": { country: "France", city: "Paris" },
    "Paris": { country: "France", city: "Paris" },
    "(AMS)": { country: "the Netherlands", city: "Amsterdam" },
    "Amsterdam": { country: "the Netherlands", city: "Amsterdam" },
    "(FRA)": { country: "Germany", city: "Frankfurt" },
    "Frankfurt": { country: "Germany", city: "Frankfurt" },
    "(MAD)": { country: "Spain", city: "Madrid" },
    "Madrid": { country: "Spain", city: "Madrid" },
    "(BCN)": { country: "Spain", city: "Barcelona" },
    "(FCO)": { country: "Italy", city: "Rome" },
    "(MXP)": { country: "Italy", city: "Milan" },
    "(LIS)": { country: "Portugal", city: "Lisbon" },
    "(ZRH)": { country: "Switzerland", city: "Zurich" },
    "Calais": { country: "France", city: "Calais" },
    "Eurotunnel": { country: "France", city: "Calais" },
  };
  function specificEUTransit() {
    for (const [key, val] of Object.entries(TRANSIT_CITY_MAP)) {
      if (legText.includes(key)) return val;
    }
    return null;
  }

  if (region === "europe" || region === "ireland") {
    // EU/Schengen transit — the CORE rules ARE uniform across EU member
    // states (microchip + rabies + EU Health Cert or Pet Passport — confirmed
    // by Commission Delegated Regulation EU 2026/131). But some member states
    // have breed restrictions or other gotchas that DON'T generalise, so we
    // surface those specifically when we know which country is involved.
    const fromEU = origin && origin.euMember;
    const specific = specificEUTransit();
    const countryName = specific ? specific.country : "the EU";
    const cityName = specific ? specific.city : null;

    // Per-country gotchas — only added when the relevant country IS in transit.
    // Sources: gov.uk/take-pet-abroad, food.ec.europa.eu, French Ministry of
    // Agriculture (Category 1/2 system), BMLEH Germany.
    const countryGotchas = [];
    if (specific) {
      if (specific.country === "France") {
        countryGotchas.push(
          `⚠️ France-specific: Category 1 breeds (Pit Bull / American Staffordshire Terrier without pedigree, Mastiff/Boerboel, Tosa) are <strong>banned entirely from import and transit</strong> under French law — your dog will not be allowed off the plane. Category 2 breeds (pedigreed Staffordshire Terriers, Rottweilers and lookalikes) need a permit, muzzle, civil liability insurance, and behaviour evaluation. Air France itself refuses Category 1 entirely, so a Paris-pivot route is a non-starter for these breeds.`
        );
      }
      if (specific.country === "Germany") {
        countryGotchas.push(
          `⚠️ Germany-specific: each German state (Bundesland) has its own list of "dangerous dog" (Listenhunde) breeds with restrictions — varies by state. American Staffordshire Terrier, Staffordshire Bull Terrier, Pit Bull and Bull Terrier are restricted or banned in most Länder. <a href="https://www.bmleh.de/EN/topics/animals/pets-and-zoo-animals/pets-entry-regulation.html" target="_blank" rel="noopener noreferrer">Check the BMLEH guidance</a> for your specific transit Land before flying.`
        );
      }
      if (specific.country === "Spain" || specific.country === "Italy" || specific.country === "Portugal" || specific.country === "the Netherlands" || specific.country === "Switzerland") {
        countryGotchas.push(
          `${specific.country} has its own national rules layered on top of EU pet movement (e.g. dangerous-breed registration, leash/muzzle laws in public). Core import paperwork is the same as anywhere in the EU — but check the airline's breed restrictions and the country's national pet rules for your specific dog.`
        );
      }
    }

    return {
      // Smarter label: "France (Paris)" not just "Europe"
      label: specific ? `${specific.country} (${specific.city})` : "Europe",
      items: [
        `Your pet enters ${countryName === "the EU" ? "the EU/Schengen area" : countryName + " (and the EU/Schengen area)"} at this point — <a href="https://food.ec.europa.eu/animals/movement-pets_en" target="_blank" rel="noopener noreferrer">EU pet movement rules</a> apply for the duration of the transit.`,
        fromEU
          ? `If you have a valid EU Pet Passport (from your origin country), no additional paperwork is needed for transit.`
          : `From a non-EU origin, you'll need an <a href="https://food.ec.europa.eu/animals/movement-pets_en" target="_blank" rel="noopener noreferrer">EU Animal Health Certificate</a> from an accredited vet in your origin country, valid within 10 days of EU entry. This single certificate covers transit through ${countryName === "the EU" ? "any EU country" : countryName + " and any other EU country"}.`,
        `ISO microchip + current rabies vaccine (≥21 days old) are required for EU entry — these rules ARE uniform across all EU member states.`,
        `Pet stays with you the whole transit — no separate booking with a transit-country airline or operator.`,
        cityName
          ? `Border control at ${cityName} airport checks your paperwork once on arrival. Once inside the Schengen area, no further checks at other EU borders.`
          : `Border control at the first EU port of entry checks paperwork once. Subsequent EU borders are open under Schengen — no further checks.`,
        ...countryGotchas,
      ],
    };
  }

  if (region === "uk-out") {
    // UK transit is rare but possible (e.g. London → ferry to Ireland).
    return {
      label: "the UK",
      items: [
        `UK transit on the way to Ireland: ISO microchip, rabies vaccine ≥21 days old, <a href="https://www.gov.uk/take-pet-abroad/animal-health-certificate" target="_blank" rel="noopener noreferrer">GB Animal Health Certificate</a> (GB residents need the AHC — an EU pet passport can no longer be used for travel into the EU since April 2026).`,
        `Dogs: tapeworm treatment by a vet 24–120 hours before the UK departure (required for Ireland entry too).`,
        `Pet stays with you for the full UK→Ireland ferry crossing.`,
      ],
    };
  }

  if (region === "us") {
    // US transit (e.g. Caribbean→Canada via US gateway).
    return {
      label: "the US",
      items: [
        `US transit: <a href="https://www.cdc.gov/importation/dogs/index.html" target="_blank" rel="noopener noreferrer">CDC Dog Import Form</a> receipt required even for short layovers if you exit the airside area.`,
        `Origin country's CDC rabies risk status determines whether extra forms are needed (high-risk origins need Certification of US-issued Rabies Vaccination or FAVN titer).`,
        `Pet must be 6+ months old, ISO-microchipped, healthy on arrival.`,
      ],
    };
  }

  if (region === "canada") {
    return {
      label: "Canada",
      items: [
        `Canada transit: current rabies certificate from your vet is usually sufficient for dogs and cats over 3 months (<a href="https://inspection.canada.ca/animal-health/terrestrial-animals/imports/pets/eng/1326600389775/1326600500578" target="_blank" rel="noopener noreferrer">CFIA</a>).`,
        `If you're connecting onwards via the US, you'll also need the <a href="https://www.cdc.gov/importation/dogs/index.html" target="_blank" rel="noopener noreferrer">CDC Dog Import Form</a> receipt for the onward leg.`,
      ],
    };
  }

  // No transit notes for this region — return null so we know to skip a chapter for it.
  return null;
}

// Phrases that mark an item as a "tip" — a suggestion, not a requirement.
// These get demoted out of the timeline into a separate "Travel-day tips" box
// so the timeline stays focused on the things you must do.
const TIP_SIGNALS = [
  "trim your pet's nails",
  "wash the carrier",
  "wash the blanket",
  "charge your phone",
  "use a backpack-style",
  "rolling carrier",
  "pad the carrier",
  "comfort item",
  "calming spray works",
  "if pet gets stressed",
  "book overnight",
  "red-eye",
  "extra-legroom seats",
  "window seat preferred",
  "don't open the carrier mid-flight",
  "saves your shoulders",
  "saves your back",
  "life-changing",
  "feliway",
  "adaptil",
  "let pet sleep in the carrier at home",
  "practice short car rides",
  "get used to it",
  "feel free to bring a familiar",
  "consider a soft",
  "smells familiar",
];

function isTip(itemText) {
  const t = (itemText || "").toLowerCase();
  return TIP_SIGNALS.some((sig) => t.includes(sig));
}

// Phrases that mark an item as a "travel-day operational" instruction —
// what to do at the airport on the day. These belong in the separate
// "What to expect on travel day" guide, NOT in the merged prep checklist
// (which is about paperwork and prep). Stripped from the checklist entirely.
const TRAVEL_DAY_OPS_SIGNALS = [
  "pack vet records",
  "vet records (originals",
  "ziploc inside the carrier",
  "check airline's pet check-in procedure",
  "separate counter",
  "light meal 4 hours",
  "light meal before flight",
  "arrive 2.5",
  "arrive 3 hours early",
  "arrive 2 hours early",
  "pet check-in is always in person",
  "security: take pet out",
  "take pet out of carrier",
  "walk/carry through metal detector",
  "carrier goes through x-ray",
  "carrier through x-ray",
  "walk your dog properly outside before",
  "walk your pet properly outside before",
];

function isTravelDayOp(itemText) {
  const t = (itemText || "").toLowerCase();
  return TRAVEL_DAY_OPS_SIGNALS.some((sig) => t.includes(sig));
}

// Rewrite generic "research / confirm" items into concrete route-specific
// answers. Returns the new text, or null if no rewrite applies (item stays as-is).
// This is the "do the hard work for them" piece — instead of "Check if origin
// is on CDC high-risk list", we look up the answer and state it plainly.
function rewriteItemForRoute(itemText, originRegion, destRegion) {
  const t = (itemText || "").toLowerCase();
  const origin = ROUTE_FACTS[originRegion];
  const dest = ROUTE_FACTS[destRegion];
  if (!origin || !dest) return null;

  // FAVN / rabies-titer advisories — only relevant if origin is high-risk.
  if (t.includes("favn") || (t.includes("rabies titer") && t.includes("high-risk"))) {
    if (origin.cdcHighRisk === true) {
      return `Get the FAVN rabies titer test booked — required because ${origin.name} is CDC high-risk.`;
    }
    // Origin isn't high-risk → this advisory doesn't apply. Return empty
    // string to signal "skip this item entirely".
    if (origin.cdcHighRisk === false) return "";
  }

  // "if entering U.S." style conditional — when we ARE entering US, drop the conditional.
  if (t.includes("if entering u.s") || t.includes("if entering us") || t.includes("(if entering u.s.)") || t.includes("if entering the u.s")) {
    if (dest.isUS) {
      // Strip the conditional clause and return the plain instruction.
      return itemText
        .replace(/\s*\(if entering U\.S\.?\)\s*/gi, "")
        .replace(/\s*if entering the U\.S\.?\s*$/i, "")
        .replace(/\s*if entering U\.S\.?\s*$/i, "")
        .trim();
    }
    // Not entering US → this item doesn't apply at all.
    return "";
  }

  // Going TO the US — resolve CDC high-risk status using the origin.
  if (dest.isUS) {
    if (t.includes("cdc high-risk") || t.includes("high-risk rabies list") || t.includes("high-risk list")) {
      if (origin.cdcHighRisk === true) {
        return `${origin.name.charAt(0).toUpperCase() + origin.name.slice(1)} IS on the CDC high-risk rabies list — you'll need the Certification of US-issued Rabies Vaccination form (filled out by a USDA-accredited vet BEFORE you leave the US) OR a foreign-vet rabies titer (FAVN) plus a reservation at a CDC-registered animal care facility. Plan ahead — these can't be done last-minute.`;
      }
      if (origin.cdcHighRisk === false) {
        return `${origin.name.charAt(0).toUpperCase() + origin.name.slice(1)} is NOT on the CDC high-risk rabies list — the standard CDC Dog Import Form online is sufficient. No titer test, no extra forms required.`;
      }
      if (origin.cdcHighRisk === "varies") {
        return `The Caribbean is mixed for CDC: Bahamas and Jamaica are NOT high-risk (standard CDC Dog Import Form is enough); the Dominican Republic IS high-risk (you'll need the Certification of US-issued Rabies Vaccination form OR a FAVN titer). Confirm against your specific island.`;
      }
    }
  }

  // Generic "research destination's import requirements" — replace with the
  // specific things that matter for this destination.
  if (t.includes("research destination") || t.includes("research the destination") || t.includes("destination country's import")) {
    if (dest.isUS) return `For the US: complete the CDC Dog Import Form online (free, valid 6 months, multi-entry). Dog must be at least 6 months old at entry, ISO-microchipped, healthy on arrival. ${origin.cdcHighRisk === true ? "Plus the high-risk-country extras flagged above." : ""}`;
    if (destRegion === "uk-out") return `The UK doesn't allow cabin pets on any commercial flight — your pet has to fly into mainland Europe and cross by land (Eurotunnel) or sea (ferry). Paperwork: ISO microchip, rabies vaccine ≥21 days old, Animal Health Certificate from accredited vet within 10 days of entry, tapeworm treatment for dogs 24–120 hrs before arrival.`;
    if (destRegion === "ireland") return `Ireland — like the UK — doesn't allow cabin pets on commercial flights. Use the France→Ireland ferry. Paperwork: ISO microchip, rabies vaccine ≥21 days old, EU Health Certificate (or an EU pet passport if you're an EU resident — GB residents now need a GB AHC), tapeworm treatment for dogs 24–120 hrs before arrival.`;
    if (destRegion === "europe") return `For Europe: ISO microchip first, then rabies vaccine, then a 21-day waiting period before entry. EU Health Certificate from an accredited vet within 10 days of travel (or an EU pet passport if you're an EU resident — GB residents now need a GB AHC, not a pet passport).`;
    if (destRegion === "dubai") return `For the UAE: you cannot fly your pet in cabin into Dubai (DXB) under any airline — UAE law. The only cabin entry is via Etihad to Abu Dhabi (AUH), then a 90-minute road transfer. MOCCAE import permit required, plus health certificate and rabies titer test depending on origin.`;
    if (destRegion === "hawaii") return `For Hawaii: the Direct Airport Release programme — ISO microchip, two rabies vaccines, FAVN rabies blood test from an approved lab at least 30 days before arrival, and AQS-279 form submitted to the Animal Industry Division. Plan 4–5 months ahead. Honolulu (HNL) is the only port of entry.`;
    if (destRegion === "canada") return `For Canada: a current rabies certificate from your vet is usually all that's needed for dogs and cats over 3 months old. No USDA endorsement required if coming from the US. Confirm details with the CFIA before travel.`;
    if (destRegion === "mexico") return `For Mexico: SENASICA Health Certificate from an accredited vet within 10 days of travel, rabies vaccine on record. No quarantine. Cats and dogs over 3 months only.`;
    if (destRegion === "india") return `For India: a no-objection certificate (NOC) from the Animal Quarantine Station is required for pet entry. ISO microchip, current rabies vaccine, recent health certificate. Quarantine waived only if all paperwork is in order on arrival.`;
    if (destRegion === "south-africa") return `For South Africa: import permit from the Department of Agriculture, ISO microchip, rabies titer test, health certificate. Pet travels as manifested cargo — no cabin option internationally.`;
  }

  // Generic "Research destination's import rules — especially for UK..." style items.
  // Replace with the actual destination-specific note.
  if (t.includes("import rules") && t.includes("uk") && t.includes("usa")) {
    if (destRegion === "uk-out") return `For the UK: cabin not allowed on any airline — use the Eurotunnel/ferry workaround from mainland Europe.`;
    if (dest.isUS) return `For the US: CDC Dog Import Form receipt is the central requirement. ${origin.cdcHighRisk ? `${origin.name} is high-risk so additional rabies forms apply.` : `${origin.name} is not on the high-risk list — the form is all you need.`}`;
    if (destRegion === "dubai") return `For the UAE: MOCCAE permit required; only Etihad to Abu Dhabi allows cabin entry.`;
  }

  return null; // No rewrite — caller keeps the original item.
}

// Decide whether a checklist item applies to a dog, a cat, or both, based on
// the wording of the item itself plus the parent section title. We auto-detect
// rather than hand-tag every item, so the rule is evidence-based and survives
// new items being added later.
function petAppliesTo(itemText, sectionTitle) {
  const t = (itemText || "").toLowerCase();
  const s = (sectionTitle || "").toLowerCase();

  // Section-level: if the whole section is titled "if you're flying with a cat"
  // or similar, everything in it is cat-only (and vice versa for dog).
  if (s.includes("flying with a cat") || s.includes("with a cat")) return "cat";
  if (s.includes("flying with a dog") || s.includes("with a dog")) return "dog";

  // Item-level keyword detection — only mark cat/dog when the item is
  // explicitly about one or the other. Anything ambiguous defaults to "both".
  const catSignals = ["cat carrier rigid", "litter tray", "litter box", "feliway", "harness", "cats do not", "cats don't", "for a cat", "your cat ", "cats are not", "cats follow"];
  const dogSignals = ["tapeworm", "cdc dog import", "dog import form", "dogs only", "for a dog", "your dog ", "dogs returning", "dog must be 6", "dogs must be 6", "adaptil", "dog must be at least 6"];

  if (catSignals.some((k) => t.includes(k))) return "cat";
  if (dogSignals.some((k) => t.includes(k))) return "dog";

  return "both";
}

// Map a section title to a chronological bucket. Earlier prep first.
// Returns { order, label } so we can sort and re-label consistently.
function timelineBucket(sectionTitle) {
  const t = (sectionTitle || "").toLowerCase();

  // Order is "weeks/months before" → smaller number = further out in time.
  // We pick the most specific match first.
  if (t.includes("6 months") || t.includes("5+ months") || t.includes("4+ months")) return { order: 0, label: "5–6 months before" };
  if (t.includes("3 months") || t.includes("2 months")) return { order: 5, label: "2–3 months before" };
  if (t.includes("8 weeks") || t.includes("6 weeks") || t.includes("6+ weeks") || t.includes("1–2 months")) return { order: 10, label: "6–8 weeks before" };
  if (t.includes("4 weeks") || t.includes("4–6 weeks") || t.includes("2+ weeks")) return { order: 20, label: "4 weeks before" };
  if (t.includes("2 weeks") || t.includes("10 days") || t.includes("7+ days") || t.includes("7 days") || t.includes("1 week")) return { order: 30, label: "1–2 weeks before" };
  if (t.includes("travel day") || t.includes("travel-day") || t.includes("at the airport") || t.includes("arrival")) return { order: 50, label: "Travel day & arrival" };

  // Generic guidance, "first — understand", "if you're flying with a cat" etc.
  // Stuff that doesn't have a clear timing — bucket as "good to know".
  if (t.includes("first") || t.includes("understand") || t.includes("flying with a")) return { order: -10, label: "Good to know" };

  // Anything else gets a safe middle bucket.
  return { order: 25, label: "Anytime / general prep" };
}

// Normalise an item string for duplicate detection across the two countries.
// We don't want "Vet appointment for full health check" appearing twice just
// because both countries' checklists list it. Strip parentheticals (which often
// add technical specs), punctuation, lowercase, collapse whitespace, and also
// strip numbers — so "ISO 11784/11785 microchip" matches "ISO microchip".
function normalizeItem(s) {
  return (s || "")
    .toLowerCase()
    .replace(/\([^)]*\)/g, " ")           // drop parentheticals
    .replace(/\d+[\d.\/–-]*/g, " ")        // drop number specs (11784/11785, 30 days, 4-6 weeks etc)
    .replace(/[^\w\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

// Build a route-specific checklist. Multi-chapter model: "Leaving [origin]"
// → optional "Transiting through [country]" for each transit region (in
// journey order) → "Entering [destination]". Each chapter keeps its own
// internal timeline. Fluffy tips are pulled out into a separate tips
// section at the end. Items duplicating across origin/destination are
// suppressed at destination. The transitRegions argument should be an
// ordered array of region IDs the pet legally enters between origin and
// destination — typically extracted from the chosen workaround's tags.
// Resolve which airlines are used on a route's flight legs, and return their
// carrier specs so the checklist can flag the per-airline size requirements
// (which often DIFFER on multi-leg journeys — one airline might allow more
// length but less height, another might be the opposite. A common gotcha
// that nobody warns about until you're at the check-in desk).
//
// Heuristic match — leg.airline strings include flavor text like
// "Air France / KLM ✓ Cabin out of the UK", and may name 2-3 carriers in
// one slash-separated list. We split on "/", "+", ",", "or", "then" to
// handle compound airline strings, clean each token, then look for any
// AIRLINES.name that appears as a substring (case-insensitive).
//
// Returns a deduplicated array preserving leg order:
//   [{ name, carrier, weight, link, legRouteText }]
function resolveAirlinesFromLegs(legs) {
  if (!Array.isArray(legs) || legs.length === 0) return [];
  const flightLegs = legs.filter(
    (l) => !isTransitLeg(l.route || "")
  );
  const seen = new Set();
  const results = [];

  flightLegs.forEach((leg) => {
    const raw = (leg.airline || "").toString();
    if (!raw) return;
    const tokens = raw.split(/\s*(?:\/|\+|,|\bor\b|\bthen\b)\s*/i);
    tokens.forEach((tok) => {
      const cleaned = tok
        .replace(/[✓✗⚠✅❌⚠️]/g, "")
        .replace(/^\s*[—–-]\s*/, "")
        .replace(/\s+[—–-]\s+.+$/, "")
        .replace(/\s*\([^)]*\)\s*/g, " ")
        .trim();
      if (!cleaned || cleaned.length < 3) return;
      const cleanLower = cleaned.toLowerCase();
      const match = AIRLINES.find((a) => {
        const an = a.name.toLowerCase();
        return cleanLower.includes(an) || an.includes(cleanLower);
      });
      if (match && !seen.has(match.name)) {
        seen.add(match.name);
        results.push({
          name: match.name,
          carrier: match.carrier || null,
          weight: match.weight || null,
          link: match.link || null,
          legRouteText: leg.route || "",
        });
      }
    });
  });
  return results;
}

function buildRouteChecklist(originRegion, destRegion, originLabel, destLabel, petType = "both", transitRegions = [], legs = []) {
  const originId = REGION_TO_CHECKLIST_ID[originRegion];
  const destId = REGION_TO_CHECKLIST_ID[destRegion];

  const originChecklist = originId ? getChecklist(originId, "departing") : null;
  const destChecklist = destId ? getChecklist(destId, "arriving") : null;
  const generic = CHECKLIST_DATA.generic;

  // Resolve airlines from the route's legs so we can flag the carrier-size
  // specs per airline at the top of the checklist. CRITICAL for multi-leg
  // journeys where the carriers DIFFER between airlines — one might allow
  // more length but less height, another might be the opposite. A common
  // gotcha that nobody warns about until you're at the check-in desk.
  const routeAirlines = resolveAirlinesFromLegs(legs);
  const hasMultipleAirlines = routeAirlines.length > 1;

  // Track items seen so we can suppress duplicates as we move from origin → transit → destination.
  const seenAtOrigin = new Set();

  // Tips collected from any source — shown once at the end, regardless of country.
  const tips = new Set();

  // Build one chapter (origin or destination side) into a list of timeline-bucketed sections.
  function buildChapter(checklist, side) {
    if (!checklist) return [];
    const buckets = new Map(); // order -> { label, items, seenKeys }

    checklist.sections.forEach((sec) => {
      const bucket = timelineBucket(sec.title);
      sec.items.forEach((rawItem) => {
        const text = typeof rawItem === "string" ? rawItem : rawItem.text;
        const applies = petAppliesTo(text, sec.title);
        // Pet-type filter.
        if (petType === "dog" && applies === "cat") return;
        if (petType === "cat" && applies === "dog") return;

        // Tip? Demote out of the timeline into the tips box.
        if (isTip(text)) { tips.add(text); return; }

        // Travel-day operational instruction (pack vet records, arrive 2hrs
        // early, security routine)? These belong in the separate
        // "What to expect on travel day" guide, NOT in the prep checklist.
        // Drop entirely.
        if (isTravelDayOp(text)) return;

        // Route-aware rewrite — "research this" → "here's the answer".
        const rewritten = rewriteItemForRoute(text, originRegion, destRegion);
        // Empty string means "this item doesn't apply to this route" — skip.
        if (rewritten === "") return;
        const finalText = rewritten || text;

        // De-dupe based on the FINAL text (post-rewrite). Two different generic
        // items can rewrite to the same concrete answer — keep one copy.
        const key = normalizeItem(finalText);

        // Origin-chapter items get recorded so destination can suppress duplicates.
        if (side === "origin") {
          if (seenAtOrigin.has(key)) return; // intra-origin dupe
          seenAtOrigin.add(key);
        } else if (seenAtOrigin.has(key)) {
          return; // suppressed: already in origin chapter
        }

        if (!buckets.has(bucket.order)) buckets.set(bucket.order, { label: bucket.label, items: [], keys: new Set() });
        const b = buckets.get(bucket.order);
        if (b.keys.has(key)) return; // intra-bucket duplicate
        b.keys.add(key);
        b.items.push(finalText);
      });
    });

    // Emit sections in chronological order.
    return [...buckets.keys()].sort((a, b) => a - b).map((k) => buckets.get(k));
  }

  // Generic prep: bake it into the ORIGIN chapter (it's all pre-travel).
  // We add it to the origin checklist's sections list virtually for the buildChapter call.
  const originWithGeneric = originChecklist
    ? { ...originChecklist, sections: [...generic.sections, ...originChecklist.sections] }
    : generic;

  const originSections = buildChapter(originWithGeneric, "origin");
  const destSections = buildChapter(destChecklist, "destination");

  // Assemble: chapter divider, origin sections, chapter divider, destination sections, tips.
  const sections = [];

  // CARRIERS chapter — at the TOP because the carrier dimensions are
  // airline-specific and you need to know them BEFORE you buy a carrier.
  // On multi-leg journeys with different airlines, you may genuinely need
  // TWO carriers (e.g. a smaller one for Air Canada's first leg, a larger
  // one for United's second leg). This is the single biggest practical
  // gotcha nobody warns you about.
  if (routeAirlines.length > 0) {
    const carrierItems = routeAirlines.map((a) => {
      const linkPart = a.link ? ` · <a href="${a.link}" target="_blank" rel="noopener noreferrer">official policy ↗</a>` : "";
      const weightPart = a.weight ? ` <em>(${a.weight})</em>` : "";
      return `<strong>${a.name}</strong> — ${a.carrier || "see airline policy"}${weightPart}${linkPart}`;
    });
    if (hasMultipleAirlines) {
      carrierItems.unshift(
        `⚠️ <strong>Multi-airline route — carriers can differ.</strong> Buy a carrier that meets the STRICTEST airline's specs and make sure your pet is comfortable in it. If a smaller airline's box would force your pet into something cramped, bring a second carrier for the more generous leg instead. Measure with your pet inside at home before travel day.`
      );
    } else {
      carrierItems.unshift(
        `Buy a carrier that meets ${routeAirlines[0].name}'s specific dimensions — measuring tape your pet inside it at home BEFORE travel day. At check-in, staff will measure both the carrier and watch your pet stand up + turn around inside.`
      );
    }
    sections.push({
      title: "Your carriers — airline-specific",
      divider: true,
      items: [
        `What carrier(s) you need depends on the airline(s) on your route. We've pulled the specs for each airline you'll fly. The strictest dimensions win — pet must fit comfortably in ALL of them.`,
      ],
    });
    sections.push({
      title: "Carrier dimensions & weight limits",
      items: carrierItems,
    });
  }

  // Origin chapter header.
  sections.push({
    title: `Leaving ${originLabel}`,
    divider: true,
    items: [`Prep for departure from ${originLabel}. Time-ordered — earliest prep first.`],
  });
  originSections.forEach((s) => {
    if (s.items.length > 0) sections.push({ title: s.label, items: s.items });
  });

  // Transit chapters — one per region the pet legally enters between origin
  // and destination. Each is briefer than a full arrival chapter (transit-only
  // essentials). Filtered to exclude origin and destination themselves, and
  // de-duplicated so the same transit region only appears once.
  //
  // We pass the route's legs into getTransitNotes so it can tailor the chapter
  // to the SPECIFIC transit country (e.g. "France (Paris)" vs generic "Europe")
  // and surface country-specific gotchas (breed bans, tapeworm requirements).
  const seenTransits = new Set([originRegion, destRegion]);
  const transitChapters = [];
  for (const tr of transitRegions) {
    if (seenTransits.has(tr)) continue;
    seenTransits.add(tr);
    const notes = getTransitNotes(tr, originRegion, legs);
    if (!notes) continue;
    // notes is now an object: { label, items }
    transitChapters.push({
      region: tr,
      label: notes.label || (ROUTE_FACTS[tr] ? ROUTE_FACTS[tr].name : tr),
      items: notes.items,
    });
  }
  transitChapters.forEach((tc) => {
    sections.push({
      title: `Transiting through ${tc.label}`,
      divider: true,
      items: [`Your pet briefly enters ${tc.label} on the way. These are the transit-only essentials — not a full arrival workup.`],
    });
    sections.push({
      title: `${tc.label} · transit essentials`,
      items: tc.items,
    });
  });

  // Destination chapter header.
  if (destSections.length > 0 || destChecklist) {
    sections.push({
      title: `Entering ${destLabel}`,
      divider: true,
      items: [`Prep specific to entering ${destLabel}. Duplicates from earlier chapters are not repeated.`],
    });
    destSections.forEach((s) => {
      if (s.items.length > 0) sections.push({ title: s.label, items: s.items });
    });
  }

  // Tips — at the very end, clearly labelled as optional comfort suggestions.
  if (tips.size > 0) {
    sections.push({
      title: "Travel-day tips & comfort suggestions",
      divider: true,
      items: [`These aren't requirements — just things that make the day easier. Cherry-pick what's useful.`],
    });
    sections.push({
      title: "Tips",
      items: [...tips],
    });
  }

  // Honest fallback note if one side has no dedicated checklist.
  const missing = [];
  if (!originChecklist) missing.push(`departing ${originLabel}`);
  if (!destChecklist) missing.push(`entering ${destLabel}`);
  let restriction = null;
  if (missing.length) {
    restriction = `We don't yet have a dedicated checklist for ${missing.join(" or ")}. The universal prep above still applies — but check the official government / customs site for ${missing.join(" and ")} for the country-specific paperwork.`;
  }

  return {
    title: `${originLabel} → ${destLabel} pet-travel checklist`,
    subtitle: petType === "dog" ? "For a dog" : petType === "cat" ? "For a cat" : "For a dog and a cat",
    sections,
    restriction,
    isRouteChecklist: true,
  };
}

// Open a printable HTML window for any checklist data object.
// Extracted out so both the dedicated Checklist section AND the inline
// planner result can call the same code path — no detour through the UI.
function openChecklistPrintable(data) {
  if (!data) return;
  const restrictionHtml = data.restriction
    ? `<div style="background:#fef3c7;border-left:3px solid #d97706;padding:14px 18px;margin:24px 0;font-family:'Fraunces',serif;font-style:italic;color:#78350f;border-radius:2px;">${data.restriction}</div>`
    : "";
  const subtitleHtml = data.subtitle
    ? `<p class="subtitle">${data.subtitle} · Print this, stick it to the fridge, tick things off as you go. Generated from petsincabin.com.</p>`
    : `<p class="subtitle">Print this, stick it to the fridge, tick things off as you go. Generated from petsincabin.com.</p>`;

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<title>${data.title} — Pets in Cabin</title>
<style>
  @import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,400;0,9..144,600;1,9..144,400&family=Inter:wght@400;500&display=swap');
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body { font-family: 'Inter', sans-serif; background: #faf6ed; color: #1c1917; padding: 60px 40px; line-height: 1.6; }
  .container { max-width: 720px; margin: 0 auto; }
  .brand { display: flex; align-items: center; gap: 12px; margin-bottom: 40px; padding-bottom: 20px; border-bottom: 1px solid #d6d3d1; }
  .brand img { width: 52px; height: 52px; border-radius: 50%; object-fit: cover; }
  .brand .brand-text { font-family: 'Fraunces', serif; font-weight: 600; color: #1c1917; font-size: 18px; letter-spacing: -0.02em; }
  .brand .brand-tag { font-family: 'Fraunces', serif; font-style: italic; color: #a8a29e; font-size: 12px; }
  .brand small { margin-left: auto; font-size: 11px; letter-spacing: 0.25em; text-transform: uppercase; color: #78716c; align-self: flex-start; }
  h1 { font-family: 'Fraunces', serif; font-size: 38px; line-height: 1.1; margin-bottom: 16px; color: #1c1917; }
  h1 em { color: #78716c; }
  .subtitle { font-family: 'Fraunces', serif; font-style: italic; color: #78716c; font-size: 16px; margin-bottom: 30px; }
  h2 { font-family: 'Fraunces', serif; font-size: 22px; color: #1c1917; margin: 36px 0 16px; padding-bottom: 10px; border-bottom: 1px solid #e7e5e4; }
  h2.divider { color: #faf6ed; background: #1c1917; border-bottom: none; font-style: normal; font-size: 24px; padding: 18px 24px; margin: 48px -24px 12px -24px; letter-spacing: -0.01em; }
  ul { list-style: none; }
  li { display: flex; align-items: flex-start; gap: 14px; padding: 10px 0; border-bottom: 1px dashed #e7e5e4; }
  li:last-child { border-bottom: none; }
  li.note-item { border-bottom: none; font-style: italic; color: #78716c; font-family: 'Fraunces', serif; }
  .check { display: inline-block; width: 22px; height: 22px; border: 2px solid #44403c; border-radius: 4px; flex-shrink: 0; margin-top: 2px; }
  .item { flex: 1; }
  .item em { color: #a8a29e; font-style: normal; font-size: 11px; }
  footer { margin-top: 60px; padding-top: 30px; border-top: 1px solid #d6d3d1; font-size: 13px; color: #78716c; font-style: italic; font-family: 'Fraunces', serif; }
  .print-btn { position: fixed; top: 20px; right: 20px; background: #1c1917; color: #faf6ed; padding: 12px 24px; border: none; font-size: 12px; letter-spacing: 0.15em; text-transform: uppercase; cursor: pointer; font-family: 'Inter', sans-serif; }
  .print-btn:hover { background: #b45309; }
  @media print {
    body { padding: 30px; background: white; }
    .print-btn { display: none; }
    li { break-inside: avoid; }
    h2 { break-after: avoid; }
  }
</style>
</head>
<body>
  <button class="print-btn" onclick="window.print()">Print / Save as PDF</button>
  <div class="container">
    <div class="brand">
      <img src="https://petsincabin.com/logo.png" alt="Pets in Cabin" />
      <div>
        <div class="brand-text">Pets in Cabin</div>
        <div class="brand-tag">Travel together, stay together</div>
      </div>
      <small>By Theo's Mum</small>
    </div>
    <h1>${data.title.replace(/checklist/i, '<em>checklist</em>')}</h1>
    ${subtitleHtml}
    ${restrictionHtml}
    ${data.sections.map(s => `
      <h2${s.divider ? ' class="divider"' : ''}>${s.title}</h2>
      <ul>
        ${s.items.map(item => s.divider
          ? `<li class="note-item"><span class="item">${item}</span></li>`
          : `<li><span class="check"></span><span class="item">${item}</span></li>`).join('')}
      </ul>
    `).join('')}
    <footer>This checklist is a starting point, not a substitute for professional advice. Always confirm with your airline, vet, and destination country before flying. Updated ${LAST_UPDATED}.</footer>
  </div>
</body>
</html>`;

  const blob = new Blob([html], { type: "text/html" });
  const url = URL.createObjectURL(blob);
  window.open(url, "_blank");
}

// ---------- INTAKE FLOW ----------
//
// The intake collects answers across two question groups:
//   - SHARED_QUESTIONS (asked once): petCount + destination
//   - PER_PET_QUESTIONS (asked per pet): species, age, weight, breed, vaccine, microchip
//
// answers shape:
//   {
//     petCount: "2",
//     destination: "UK",
//     pets: [
//       { species, age, weight, breed, vaccine, microchip },
//       { species, age, weight, breed, vaccine, microchip },
//     ],
//   }
//
// For petCount > 1, each pet after Pet 1 gets a "Same as Pet 1" shortcut
// (a single tap copies Pet 1's answers and skips that pet's 6 questions).

const SHARED_QUESTIONS = [
  {
    id: "petCount",
    label: "How many pets are you travelling with?",
    type: "choice",
    options: ["1", "2 or more"],
    helper: "Most airlines cap cabin pets per passenger and per flight. We'll flag relevant limits.",
  },
  {
    id: "destination",
    label: "Where are you flying to?",
    type: "dropdown",
    options: ["Within the USA (domestic)", "Into the USA (international arrival)", "Hawaii", "Canada", "Mexico", "Caribbean", "South America", "Central America", "UK", "Ireland", "Europe", "Spain", "India", "UAE / Dubai", "Japan", "Asia / Pacific", "Other international"],
    helper: "Pick where your pet is ARRIVING. Flying Europe → New York? Choose 'Into the USA'.",
  },
];

const PER_PET_QUESTIONS = [
  {
    id: "species",
    label: "What kind of pet is {petLabel}?",
    type: "choice",
    options: ["Dog", "Cat", "Other small pet"],
  },
  {
    id: "age",
    label: "How old is {petLabel}?",
    type: "choice",
    options: ["Under 8 weeks", "8 weeks – 4 months", "4–6 months", "6 months or older"],
  },
  {
    id: "weight",
    label: "Combined weight of {petLabel} plus carrier?",
    type: "choice",
    options: ["Under 15 lb", "15–20 lb", "20–25 lb", "Over 25 lb"],
    helper: "Weigh pet + carrier together at home — airlines weigh combined at the gate.",
  },
  {
    id: "breed",
    label: "Is {petLabel} a snub-nosed (brachycephalic) breed?",
    type: "choice",
    options: ["Yes", "No", "Not sure"],
    helper: "Includes pugs, bulldogs, boxers, Persian cats, Himalayans, shih tzus, Boston terriers.",
  },
  {
    id: "vaccine",
    label: "Is {petLabel} up to date on rabies?",
    type: "choice",
    options: ["Yes, current", "Recently vaccinated (under 28 days)", "Not vaccinated", "Not sure"],
  },
  {
    id: "microchip",
    label: "Does {petLabel} have an ISO-compliant microchip?",
    type: "choice",
    options: ["Yes", "No", "Not sure"],
    helper: "Required for nearly all international travel. Must be ISO 11784/11785 compliant.",
  },
];

// Build the full question flow given a petCount. Returns an ordered array of
// "step" objects, each describing one screen the user moves through.
// Step types: "shared" (one of SHARED_QUESTIONS), "perPet" (one of
// PER_PET_QUESTIONS for a specific pet index), or "petGate" (the "Same as
// Pet 1?" / "Tell me about Pet N" branching screen between pets).
function buildIntakeSteps(petCount) {
  // petCount is "1" → 1 pet, "2 or more" → 2 pets. We cap at 2 because in
  // practice a 3rd pet introduces a passenger-split problem that the 2-pet
  // warning already covers — the assessment doesn't need a 3rd pet card.
  const n = petCount === "2 or more" ? 2 : (parseInt(petCount, 10) || 1);
  const steps = [];

  // Shared questions first
  SHARED_QUESTIONS.forEach((q) => steps.push({ kind: "shared", q }));

  // Per-pet loop
  for (let i = 0; i < n; i++) {
    // For pet 2, prepend a "same as Pet 1?" gate
    if (i > 0) {
      steps.push({ kind: "petGate", petIndex: i });
    }
    PER_PET_QUESTIONS.forEach((q) => steps.push({ kind: "perPet", q, petIndex: i }));
  }

  return steps;
}

// Format a question label by substituting {petLabel} with "Pet 1" / "Pet 2"
// (or just "your pet" if only one pet).
function formatPetLabel(petIndex, petCount) {
  const n = petCount === "2 or more" ? 2 : (parseInt(petCount, 10) || 1);
  if (n === 1) return "your pet";
  return `Pet ${petIndex + 1}`;
}


// ---------- ASSESSMENT LOGIC ----------
//
// Returns:
//   {
//     shared: { flags, warnings, ok },         // route-level (destination, multi-pet logistics)
//     perPet: [ { petLabel, flags, warnings, ok }, ... ]  // one entry per pet
//   }
//
// Backward-compatibility: the old single-pet shape stored species/age/weight/breed/vaccine/microchip
// at the top level. We support both — if answers.pets is missing, we synthesize one from the flat fields.
function assess(answers) {
  // ---------- Normalise pets array ----------
  // New shape: answers.pets = [{species, age, weight, breed, vaccine, microchip}, ...]
  // Legacy shape: flat fields on answers (species may be string or array)
  let pets = [];
  if (Array.isArray(answers.pets) && answers.pets.length > 0) {
    pets = answers.pets;
  } else {
    // Legacy: build a single pet from top-level fields. If species was an array
    // (multi-species case in the old intake), we still create just one pet so
    // logic doesn't crash; the per-pet flow is the new way to handle multiple
    // species properly.
    const species = Array.isArray(answers.species) ? answers.species[0] : answers.species;
    pets = [{
      species,
      age: answers.age,
      weight: answers.weight,
      breed: answers.breed,
      vaccine: answers.vaccine,
      microchip: answers.microchip,
    }];
  }

  const petCount = answers.petCount || (pets.length === 1 ? "1" : "2 or more");
  const totalPetCount = pets.length;
  const allSpecies = pets.map((p) => p.species).filter(Boolean);
  const uniqueSpecies = Array.from(new Set(allSpecies));
  const multiSpecies = uniqueSpecies.length > 1;
  const anyDog = uniqueSpecies.includes("Dog");
  const anyCat = uniqueSpecies.includes("Cat");
  const anyOther = uniqueSpecies.includes("Other small pet");

  // ---------- Route-level cargo workaround helper ----------
  const cargoOption = (() => {
    const d = answers.destination;
    if (d === "UK") return "Cargo into the UK is possible via IAG Cargo (BA), Virgin Cargo, or Lufthansa Cargo through Frankfurt's Animal Lounge. Allow 8+ hours at Heathrow Animal Reception Centre after landing.";
    if (d === "Ireland") return "Cargo into Ireland is possible via Lufthansa Cargo, KLM Cargo, or Aer Lingus Cargo. Pets clear at Dublin Airport. Ireland's rules closely mirror the UK's.";
    if (d === "UAE / Dubai") return "Cargo into Dubai is possible — every pet entering DXB must go cargo regardless of airline. Use Emirates SkyCargo, Qatar Cargo, or Lufthansa via Europe, plus a UAE customs broker (Dubai Kennels & Cattery is the most-used).";
    if (d === "Europe") return "Cargo into the EU is available via Lufthansa Cargo (Frankfurt Animal Lounge — the world's most advanced), KLM Cargo (Amsterdam), or Air France Cargo (Paris). All accept oversize pets that don't qualify for cabin.";
    if (d === "Within the USA (domestic)") return "Domestic US cargo for pets is largely discontinued by major airlines as of 2025. Hawaiian Air Cargo still operates inter-island. For mainland US, consider a ground pet transport service (CitizenShipper, RoyalPaws) or a charter/private operator.";
    if (d === "Into the USA (international arrival)") return "Cargo into the US is available via Lufthansa Cargo, KLM Cargo, and several others. The CDC Dog Import Form is still required, and dogs from high-risk rabies countries face extra paperwork.";
    if (d === "Hawaii") return "Hawaiian Airlines Cargo handles oversize pets to Hawaii — but the strict Direct Airport Release rabies-free programme still applies (FAVN titer, 30+ days notice). Plan 4+ months ahead.";
    if (d === "India") return "Cargo into India is well-established via Air India Cargo, Emirates SkyCargo, Lufthansa Cargo, or KLM Cargo. NOC from AQCS still required regardless of cabin/cargo.";
    if (d === "Canada") return "Cargo into Canada is available via Air Canada Cargo and WestJet Cargo. Major US carriers have largely discontinued general-public pet cargo.";
    if (d === "Mexico") return "Cargo into Mexico is available via Aeromexico Cargo. Major US carriers have largely discontinued general-public pet cargo.";
    if (d === "Caribbean") return "Cargo to the Caribbean varies by island and airline — Bahamasair, Caribbean Airlines, and American Airlines Cargo serve various islands. Check the specific island's import rules first.";
    return "Cargo and pet relocation services exist for most destinations — contact a pet relocation specialist (e.g. CitizenShipper, Starwood Pet Travel) for a quote on your specific route.";
  })();

  const isDomestic = answers.destination === "Within the USA (domestic)";
  const isInternationalArrival = answers.destination === "Into the USA (international arrival)";
  const isInternational = !isDomestic;

  // ---------- Per-pet checks ----------
  // Run the same per-pet logic on each pet and return per-pet result blocks.
  const perPet = pets.map((pet, idx) => {
    const pFlags = [];
    const pWarnings = [];
    const pOk = [];
    const petLabel = formatPetLabel(idx, petCount);
    // Capitalised form for sentence-starts ("your pet" → "Your pet").
    const petLabelCap = petLabel.charAt(0).toUpperCase() + petLabel.slice(1);

    // Age — universal blocker for under 8 weeks; international has stricter rules.
    if (pet.age === "Under 8 weeks") {
      pFlags.push({
        severity: "blocker",
        title: `${petLabelCap} is too young to fly`,
        detail: "Almost every airline requires pets to be at least 8 weeks old for domestic travel and 16 weeks for international. Wait until your pet is older and fully weaned.",
        workaround: "This is a 'wait' situation, not a workaround. Once your pet is 8+ weeks (domestic) or 15+ weeks (international), re-run this assessment.",
      });
    } else if (isInternational && pet.age === "8 weeks – 4 months") {
      pFlags.push({
        severity: "blocker",
        title: `${petLabelCap} is likely too young for international travel`,
        detail: "Most countries require pets to be at least 12–16 weeks old, plus a rabies vaccine that's been in effect for 21–30 days. The EU requires a minimum age of 15 weeks. The US requires dogs (not cats) to be at least 6 months old to enter.",
        workaround: "Wait until your pet is at least 15 weeks (EU minimum), 16 weeks (most other countries), or — for a dog entering the US — 6 months. Use this time to schedule the microchip-then-rabies sequence so the 21-day post-rabies wait is built in.",
      });
    }

    // Weight
    if (pet.weight === "Over 25 lb") {
      pFlags.push({
        severity: "impossible",
        title: `${petLabelCap} is too heavy for cabin on any airline`,
        detail: "Combined pet + carrier weight over 25 lb exceeds every commercial airline's cabin limit. Cabin is genuinely not an option for this pet on any carrier.",
        workaround: `Cabin isn't workable — but cargo is. ${cargoOption}`,
      });
    } else if (pet.weight === "20–25 lb") {
      pWarnings.push({
        title: `${petLabelCap} is on the edge of cabin weight limits`,
        detail: "JetBlue caps at 20 lb combined; Air Canada at 22 lb; Air France/KLM/Lufthansa at 17.6 lb. Domestic U.S. airlines like Delta, United, and American don't publish a strict weight, but your pet must still fit comfortably in the carrier under the seat. Weigh at home with the carrier and food. If you're within a pound or two of the limit — assume you're over.",
      });
    } else if (pet.weight) {
      // Capitalize first letter — petLabel "your pet" lowercases at sentence start
      const cap = petLabel.charAt(0).toUpperCase() + petLabel.slice(1);
      pOk.push(`${cap}'s weight is within typical cabin limits.`);
    }

    // Brachycephalic
    if (pet.breed === "Yes") {
      pWarnings.push({
        title: `${petLabelCap} is a snub-nosed breed — extra care needed`,
        detail: "Brachycephalic pets are at higher risk for breathing issues at altitude. They can usually still fly in the cabin (it's pressurized at sea-level conditions), but airlines often refuse to fly them as cargo. Avoid summer travel, sedatives, and long layovers. Talk to your vet first.",
      });
    }

    // Rabies vaccine
    if (pet.vaccine === "Not vaccinated") {
      pFlags.push({
        severity: "fixable",
        title: `${petLabelCap} needs a rabies vaccination`,
        detail: "Every U.S. state and country requires rabies vaccination for dogs, and most for cats. International destinations typically require the vaccine to have been administered at least 21–30 days before travel. Get this scheduled now.",
        workaround: "Book a vet appointment to vaccinate. For international travel, ensure the microchip is implanted FIRST, then the rabies vaccine, then wait at least 21 days (EU) or 28 days (some countries) before flying.",
      });
    } else if (pet.vaccine === "Recently vaccinated (under 28 days)") {
      pWarnings.push({
        title: `${petLabelCap}'s rabies vaccine may not yet be 'in effect'`,
        detail: "For international travel, most countries (including the EU and the U.S. on re-entry from high-risk countries) require the vaccine to have been administered at least 28 days before arrival, and after the microchip was implanted. Don't book travel until this window has passed.",
      });
    } else if (pet.vaccine === "Yes, current") {
      const cap = petLabel.charAt(0).toUpperCase() + petLabel.slice(1);
      pOk.push(`${cap}'s rabies vaccination is current.`);
    }

    // Microchip — only required for international (Hawaii uses its own DAR programme already flagged)
    if (isInternational && answers.destination !== "Hawaii" && pet.microchip !== "Yes") {
      pFlags.push({
        severity: "fixable",
        title: `${petLabelCap} needs an ISO microchip for international travel`,
        detail: "The EU, UK, Japan, Australia, and most other countries require an ISO 11784/11785 compliant microchip implanted before the rabies vaccine. If your pet was microchipped after their rabies shot, they may need to be re-vaccinated. Confirm with your vet.",
        workaround: "Book a vet appointment to implant an ISO 11784/11785 microchip. If your pet is already rabies-vaccinated, you may need to re-vaccinate AFTER the chip — confirm with your vet.",
      });
    }

    // Species: Other small pet
    if (pet.species === "Other small pet") {
      pWarnings.push({
        title: `${petLabelCap} is not a cat or dog — limited airline acceptance`,
        detail: "Most airlines accept only cats and dogs in cabin. Frontier and a few others allow rabbits, guinea pigs, hamsters, and small household birds. Check directly with your airline before booking — and note that many countries restrict or quarantine non-cat/dog imports.",
      });
    }

    return { petLabel, flags: pFlags, warnings: pWarnings, ok: pOk };
  });

  // ---------- Shared route-level checks ----------
  const flags = [];
  const warnings = [];
  const ok = [];

  if (answers.destination === "Hawaii") {
    warnings.push({
      title: "Hawaii has a strict rabies-free program",
      detail: "Hawaii is rabies-free and treats arriving pets like an international entry. The <a href=\"https://hdoa.hawaii.gov/ai/aqs/aqs-info/\" target=\"_blank\" rel=\"noopener noreferrer\">'Direct Airport Release' program</a> requires: ISO microchip, two rabies vaccines (most recent at least 30 days before arrival), a FAVN/OIE rabies blood test from an approved lab at least 30 days before arrival, and submission of paperwork to the Animal Industry Division. Plan 4+ months ahead.",
    });
  }

  if (answers.destination === "Europe" || answers.destination === "Spain") {
    warnings.push({
      title: answers.destination === "Spain" ? "Spain requires an EU Health Certificate" : "EU requires an EU Health Certificate",
      detail: answers.destination === "Spain"
        ? "Spain follows EU pet import rules: ISO microchip first, then rabies vaccine, then a 21-day waiting period before entry. You'll need an <a href=\"https://food.ec.europa.eu/animals/movement-pets_en\" target=\"_blank\" rel=\"noopener noreferrer\">EU Health Certificate</a> issued by an accredited vet within 10 days of travel. Good news: cabin is straightforward from most origins — Iberia and Vueling both fly cabin pets, and Spain has three solid pet-friendly airports (Madrid, Barcelona, Valencia)."
        : "Issued by a <a href=\"https://www.aphis.usda.gov/pet-travel\" target=\"_blank\" rel=\"noopener noreferrer\">USDA-accredited vet</a> within 10 days of travel, then endorsed by your nearest <a href=\"https://www.aphis.usda.gov/pet-travel\" target=\"_blank\" rel=\"noopener noreferrer\">USDA APHIS</a> office. ISO microchip first, then rabies vaccine, then a 21-day waiting period before entry. Some countries (UK, Ireland, Malta, Finland, Norway) also require a tapeworm treatment for dogs, given 24–120 hours before arrival.",
    });
  }

  if (answers.destination === "Canada") {
    ok.push("Canada is among the easier international destinations: a current rabies certificate from your vet is usually all that's needed for dogs and cats over 3 months old. No APHIS endorsement required from the US. Confirm details with the <a href=\"https://inspection.canada.ca/animal-health/terrestrial-animals/imports/pets/eng/1326600389775/1326600500578\" target=\"_blank\" rel=\"noopener noreferrer\">CFIA</a> before travel.");
  }

  if (answers.destination === "Mexico") {
    ok.push("Mexico is a relatively easy destination: a vet health certificate plus current rabies vaccine is usually all that's required. <a href=\"https://www.gob.mx/senasica\" target=\"_blank\" rel=\"noopener noreferrer\">SADER/SENASICA</a> inspect pets on arrival, free of charge. Internal/external parasite treatment should be documented.");
  }

  if (answers.destination === "Caribbean") {
    warnings.push({
      title: "Caribbean rules vary enormously by island",
      detail: "There's no single 'Caribbean' rule. Puerto Rico and USVI are US territories (no import paperwork). Dominican Republic and Aruba are relatively easy. Bahamas needs a 6–8 week import permit. Jamaica, Cayman, and Barbados are among the strictest — Jamaica needs 6+ months of prep including a FAVN rabies titer. Check your specific island's Department of Agriculture before booking. Note: Dominican Republic is on the CDC high-risk rabies list, which complicates US return.",
    });
  }

  if (answers.destination === "South America") {
    warnings.push({
      title: "South America: cabin-friendly continent, but rules differ by country",
      detail: "LATAM, Avianca, and Copa Airlines all carry cabin pets (7–10 kg combined). Brazil is the easiest entry — no microchip required, rabies 21+ days. Argentina, Uruguay, Chile, Peru, Colombia require ISO microchips and rabies 30+ days. Chile and Peru also need pre-arranged import permits (SAG/SENASA — apply 30+ days ahead). Colombia bans Pit Bull, AmStaff, and Staffordshire imports by law. LATAM cabin pets on US↔Brazil/Bolivia/Ecuador/Peru/Colombia routes are temporarily suspended due to CDC dog rules — verify before booking. Important: American Airlines and Delta do NOT accept cabin pets to most South American destinations (cargo only via PetEmbark / Delta Cargo).",
    });
  }

  if (answers.destination === "Central America") {
    ok.push("Central America (especially Panama) is well-served for cabin pets via Copa Airlines (10 kg combined, hub Panama City). Useful as a transit point to deeper South America. Standard requirements: rabies 30+ days, ISO microchip recommended, vet health certificate within 10 days. Panama is not on the CDC high-risk rabies list.");
  }

  if (answers.destination === "Japan") {
    flags.push({
      severity: "fixable",
      title: "Japan: 180-day rabies titer wait is non-negotiable",
      detail: "Japan requires: ISO microchip implanted FIRST, then two rabies vaccinations 30+ days apart, then a FAVN rabies antibody titer test ≥0.5 IU/ml from an <a href=\"https://www.maff.go.jp/aqs/english/animal/dog/import-other.html\" target=\"_blank\" rel=\"noopener noreferrer\">MAFF-approved lab</a>, then a 180-day waiting period from the titer blood draw date. Plus <a href=\"https://www.maff.go.jp/aqs/english/animal/dog/import-other.html\" target=\"_blank\" rel=\"noopener noreferrer\">AQS Advance Notification</a> submitted at least 40 days before arrival. Get any of this wrong and your pet is detained up to 180 days at your expense. <strong>This applies to every pet on your booking.</strong>",
      workaround: "Start preparation 7+ months before your arrival date. Microchip → wait → rabies #1 → wait 30 days → rabies #2 → wait 30 days → FAVN blood draw → wait 180 days → travel. Then file the <a href=\"https://www.maff.go.jp/aqs/english/animal/dog/import-other.html\" target=\"_blank\" rel=\"noopener noreferrer\">Advance Notification with Japan's Animal Quarantine Service</a> 40+ days before arrival.",
    });
    warnings.push({
      title: "Cabin pet options into Japan are limited",
      detail: "JAL and ANA do NOT carry cabin pets on any flight (cargo only). For cabin into Japan you need: United (US ↔ NRT/HND/KIX), Korean Air / Asiana / T'Way / Air Premia (via Seoul), or Aeromexico (from Mexico City). Other airlines are cargo-only.",
    });
  }

  if (isInternationalArrival) {
    if (anyDog) {
      warnings.push({
        title: "Entering the USA — CDC Dog Import Form required for all dogs",
        detail: "Every dog entering the US (including US dogs returning home) needs a completed <a href=\"https://www.cdc.gov/importation/dogs/index.html\" target=\"_blank\" rel=\"noopener noreferrer\">CDC Dog Import Form</a> — fill it out online and keep the receipt (valid 6 months, multiple entries). Dogs must be at least 6 months old, microchipped, and appear healthy. If arriving from a CDC high-risk rabies country, additional paperwork applies (rabies titer, Certification of US-issued Rabies Vaccination). Confirm whether your origin country is high-risk.",
      });
    }
    if (anyCat) {
      warnings.push({
        title: "Entering the USA — cats have lighter rules than dogs",
        detail: "Cats do NOT need the CDC Dog Import Form (that's dogs only). Cats aren't required to have proof of rabies vaccination for US entry under federal rules — though your airline will likely still want a current rabies certificate, and your origin country and some US states (e.g. Hawaii) have their own requirements. Cats are inspected on arrival and must appear healthy. Always confirm with your airline and your specific origin/destination.",
      });
    }
  }

  if (answers.destination === "UK") {
    flags.push({
      severity: "impossible",
      title: "No commercial airline allows pets in the cabin into the UK",
      detail: "Every flight into the UK requires pets to travel as manifested cargo — never in the cabin. This is UK government policy, not the airlines' choice. (Flying OUT of the UK in cabin is fine — many airlines allow it.)",
      workaround: "The cabin workaround DOES exist: fly cabin into Paris (CDG), Amsterdam (AMS), or Frankfurt (FRA) on Air France, KLM, or Lufthansa, then take Eurotunnel Le Shuttle (35 min, pet stays in your car) from Calais to Folkestone. Or take a pet-friendly ferry. See the Routes section for the USA/Canada/Europe → UK workarounds. Alternatively: cargo via IAG Cargo (BA), Virgin Cargo, or Lufthansa Cargo through Heathrow Animal Reception Centre.",
    });
    if (anyDog) {
      warnings.push({
        title: "Tapeworm treatment is mandatory for dogs",
        detail: "Dogs entering the UK need a tapeworm treatment (praziquantel) administered by a vet 24–120 hours before arrival. Without this, your dog can be refused entry or quarantined. Not required for cats.",
      });
    }
  }

  if (answers.destination === "Ireland") {
    flags.push({
      severity: "impossible",
      title: "No commercial airline allows pets in the cabin into Ireland",
      detail: "Like the UK, every flight into Ireland requires pets to travel as manifested cargo — never in the cabin. This is Irish government policy, and it's why airlines list Ireland alongside the UK in their no-cabin restrictions. (Flying OUT of Ireland in cabin is generally fine.)",
      workaround: "The cabin workaround: fly cabin into a continental EU airport (Paris CDG, Amsterdam AMS, Frankfurt FRA), then either take a pet-friendly ferry from France to Ireland (Cherbourg/Roscoff → Rosslare/Dublin on Irish Ferries or Brittany Ferries — pets stay in your vehicle or a pet-friendly cabin), or cross to the UK via Eurotunnel and take the Ireland ferry from Holyhead. The direct France → Ireland ferry avoids the UK landbridge entirely. Alternatively: cargo into Dublin via Lufthansa Cargo, KLM Cargo, or Aer Lingus Cargo.",
    });
    if (anyDog) {
      warnings.push({
        title: "Tapeworm treatment is mandatory for dogs",
        detail: "Dogs entering Ireland need a tapeworm treatment (praziquantel) administered by a vet 24–120 hours before arrival. Same rule as the UK. Not required for cats.",
      });
    }
    warnings.push({
      title: "Ireland's rules closely mirror the UK's",
      detail: "ISO microchip, rabies vaccine ≥21 days old, and an EU/GB pet health certificate. If you're coming from the UK, the land+ferry route is common. If from outside the EU, you'll need an <a href=\"https://food.ec.europa.eu/animals/movement-pets_en\" target=\"_blank\" rel=\"noopener noreferrer\">EU Health Certificate</a>. Confirm current requirements with <a href=\"https://www.gov.ie/en/organisation/department-of-agriculture-food-and-the-marine/\" target=\"_blank\" rel=\"noopener noreferrer\">Ireland's Department of Agriculture, Food and the Marine</a>.",
    });
  }

  if (answers.destination === "India") {
    warnings.push({
      title: "India requires an NOC (No Objection Certificate)",
      detail: "Apply to the <a href=\"https://aqcsindia.gov.in/\" target=\"_blank\" rel=\"noopener noreferrer\">Animal Quarantine and Certification Service (AQCS)</a> at least 1–2 weeks before arrival. Pets can only enter India through six airports: Delhi, Mumbai, Chennai, Kolkata, Bengaluru, or Hyderabad. Returning Indian residents can bring up to 2 pets without a full import license, but the NOC is still required.",
    });
    warnings.push({
      title: "No direct cabin to USA, Canada, UK, or Australia",
      detail: "Air India is the only major Indian carrier with cabin pets, but they don't allow cabin on direct flights to/from the USA, Canada, UK, or Australia. To fly cabin India ↔ USA or India ↔ Canada, route via a European hub (Lufthansa via Frankfurt, KLM via Amsterdam, Air France via Paris — all accept cabin pets under 8 kg). India ↔ UK is cargo only with no workaround.",
    });
  }

  if (answers.destination === "UAE / Dubai") {
    flags.push({
      severity: "impossible",
      title: "No cabin entry to Dubai — cargo only into DXB",
      detail: "Every pet entering Dubai (DXB) must arrive as manifested cargo, regardless of airline. This is UAE federal law applying to all carriers.",
      workaround: "The cabin workaround DOES exist via Abu Dhabi: Etihad accepts cabin pets under 8 kg into Abu Dhabi (AUH) — the only airline that does. Promo fee currently $399/segment through May 2026 (down from $1,500). From AUH, it's a 90-minute taxi (around AED 250) to Dubai. See the LHR/Mumbai/JFK → Abu Dhabi routes. For larger pets: cargo into DXB via Emirates SkyCargo + Dubai Kennels & Cattery (DKC) as broker.",
    });
    warnings.push({
      title: "MOCCAE permit valid only 30 days",
      detail: "Apply to the <a href=\"https://www.moccae.gov.ae/en/services/registration-pet.aspx\" target=\"_blank\" rel=\"noopener noreferrer\">Ministry of Climate Change and Environment (MOCCAE)</a> for an import permit — it's only valid for 30 days from issue, so time it carefully. Several breeds are banned entirely (Pit Bull, Rottweiler, Dogo Argentino, Tosa, Mastiff types, wolf-dog hybrids).",
    });
  }

  // Multi-species shared warning (covers per-pet differences in species rules).
  if (multiSpecies) {
    warnings.push({
      title: "Different pet types have different rules",
      detail: `You're travelling with more than one type of pet (${uniqueSpecies.join(" + ")}). Each species has its own import paperwork, vaccination requirements, and airline carrier rules — and they don't always match. For example, dogs need tapeworm treatment for the UK/Ireland but cats don't; some countries' rabies rules differ by species. The per-pet results below show each animal's own checks. Also confirm the airline can take all of them on the same booking.`,
    });
  }

  // Multi-pet logistics — the real rule across the industry is "1 pet per
  // passenger" with two well-documented exceptions: (a) buy an extra adjacent
  // seat to bring a second carrier (Alaska, JetBlue, United, Air Canada) and
  // (b) two same-species small pets sharing a single carrier IF their combined
  // weight stays under that airline's per-carrier limit (Delta, United,
  // Lufthansa for puppies/kittens). We surface these honestly without
  // inventing a combined-weight calculation airlines don't actually use.
  //
  // We collapsed the old "3 or more" branch into the 2+ branch because in
  // practice the answer is the same: you split across passengers, with one
  // adjacent-seat option, or fall back to cargo / charter services.
  if (petCount === "2 or more" || totalPetCount >= 2) {
    warnings.push({
      title: "Multiple pets: the real rule is 1 pet per passenger",
      detail: `Most airlines allow only 1 pet per passenger in the cabin. With 2+ pets you'll typically need one of these setups: <strong>(1) Multiple passengers, one pet each in separate carriers.</strong> <strong>(2) Buy an adjacent extra seat</strong> on Alaska, JetBlue, United, or Air Canada to bring 2 carriers yourself — each pet must fit its own carrier under that airline's standard weight limit. <strong>(3) Two same-species small pets in one carrier</strong> (Delta, United, Lufthansa allow this for puppies/kittens) — only works if combined pet+carrier weight stays under the airline's single-carrier limit (~8 kg / 17 lb on most airlines) and they fit comfortably together. For 3+ pets: combine these (e.g. two passengers, one with extra-seat purchase = 3 cabin slots), or send some via cargo / charter. Many international destinations also cap personal pet imports per traveller. These bookings can't be made online — call the airline directly.`,
    });
  }

  // For any multi-pet booking, flag the per-flight cap separately — this is
  // genuinely useful and not the same as the per-passenger rule above.
  if (totalPetCount >= 2) {
    warnings.push({
      title: "Book early — most airlines cap total cabin pets per flight",
      detail: "Beyond the per-passenger limit, airlines also limit total cabin pets per flight — typically 4–8 across the whole plane. With multiple pets on one booking you're using more of that quota, so book as far ahead as possible. Many airlines won't confirm pet slots until they've manually verified availability with the flight crew — expect a phone call, not an instant online confirmation.",
    });
  }

  return {
    shared: { flags, warnings, ok },
    perPet,
  };
}


// ---------- COMPONENTS ----------

function SectionLabel({ children, num }) {
  return (
    <div className="flex items-baseline gap-3 mb-6">
      <span className="font-serif italic text-stone-400 text-lg">{num}</span>
      <span className="uppercase tracking-[0.25em] text-xs font-medium text-stone-600">{children}</span>
      <div className="flex-1 h-px bg-stone-300" />
    </div>
  );
}

const NAV_SECTIONS = [
  { id: "top", label: "Home", num: "" },
  { id: "intake", label: "Can my pet fly?", num: "I" },
  { id: "planner", label: "Journey planner", num: "✦" },
  { id: "airlines", label: "Airlines", num: "II" },
  { id: "routes", label: "Routes", num: "III" },
  { id: "destinations", label: "Difficult destinations", num: "IV" },
  { id: "quarantine", label: "Quarantine", num: "⚠" },
  { id: "timeline", label: "Timeline", num: "V" },
  { id: "checklist", label: "Checklist", num: "✓" },
  { id: "documents", label: "Paperwork", num: "VI" },
  { id: "tips", label: "Tips", num: "VII" },
  { id: "travel-day", label: "Airport day", num: "★" },
  { id: "stories", label: "Stories", num: "✻" },
  { id: "contact", label: "Contact", num: "VIII" },
  { id: "about", label: "About", num: "✦" },
];

function NavBar({ onStartIntake }) {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    function onScroll() { setScrolled(window.scrollY > 60); }
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  function go(id) {
    setOpen(false);

    // GA4: track which section the user navigated to, so we can see
    // homepage engagement per section. Anchor links (/#planner etc.) don't
    // trigger Next.js route changes, so without this event GA can't see
    // them. The 'about' page already counts as a real page_view via
    // routeChangeComplete in _app.js, so we don't double-fire there.
    if (typeof window !== "undefined" && window.gtag && id !== "about") {
      const sectionLabel = (NAV_SECTIONS.find((s) => s.id === id) || {}).label || id;
      window.gtag("event", "section_click", {
        event_category: "navigation",
        section_id: id,
        section_label: sectionLabel,
      });
    }

    if (id === "top") { window.scrollTo({ top: 0, behavior: "smooth" }); return; }
    if (id === "intake") { onStartIntake(); return; }
    if (id === "about") { window.location.href = "/about"; return; }

    // Robust scroll — see scrollToTarget: scrolls, then re-measures and
    // corrects any overshoot once the layout has settled (mobile reflow).
    scrollToTarget(id);
  }

  // Split nav items into two even rows — gives us control over the layout
  // so we never get 11 items on row 1 and 3 stragglers on row 2.
  const navItems = NAV_SECTIONS.slice(1); // exclude "Home"
  const mid = Math.ceil(navItems.length / 2);
  const row1 = navItems.slice(0, mid);
  const row2 = navItems.slice(mid);

  const NavItem = ({ s }) => (
    <button
      onClick={() => go(s.id)}
      className="relative group flex items-baseline gap-1.5 py-2 px-1 transition-colors whitespace-nowrap"
    >
      {s.num && (
        <span className="font-serif italic text-amber-600/60 text-[11px]">{s.num}</span>
      )}
      <span className="font-serif text-[13px] text-stone-700 group-hover:text-amber-700 transition-colors">
        {s.label}
      </span>
      <span className="absolute bottom-0 left-1 right-1 h-px bg-amber-700 scale-x-0 group-hover:scale-x-100 transition-transform origin-left" />
    </button>
  );

  // Country-guides dropdown — the guide pages are separate routes, not page
  // sections, so they get their own hover/focus dropdown rather than sitting
  // in the section nav. Closes on mouse-leave or selection.
  const NavGuidesDropdown = () => {
    const [dropOpen, setDropOpen] = useState(false);
    return (
      <div
        className="relative"
        onMouseEnter={() => setDropOpen(true)}
        onMouseLeave={() => setDropOpen(false)}
      >
        <button
          onClick={() => setDropOpen((v) => !v)}
          className="relative group flex items-baseline gap-1.5 py-2 px-1 transition-colors whitespace-nowrap"
          aria-haspopup="true"
          aria-expanded={dropOpen}
        >
          <span className="font-serif italic text-amber-600/60 text-[11px]">❖</span>
          <span className="font-serif text-[13px] text-stone-700 group-hover:text-amber-700 transition-colors">
            Country pet guides
          </span>
          <span className="font-sans text-[9px] text-stone-400">▾</span>
          <span className="absolute bottom-0 left-1 right-1 h-px bg-amber-700 scale-x-0 group-hover:scale-x-100 transition-transform origin-left" />
        </button>
        {dropOpen && (
          <div
            className="absolute left-0 top-full pt-1 z-50 animate-fadeIn"
            style={{ minWidth: "230px" }}
          >
            <div className="bg-white border border-stone-200 shadow-lg rounded-sm py-1">
              {COUNTRY_GUIDES.map((g) => (
                <a
                  key={g.slug}
                  href={g.slug}
                  className="flex items-baseline gap-2 px-4 py-2 hover:bg-amber-50 transition-colors"
                >
                  <span aria-hidden="true" className="text-sm">{g.flag}</span>
                  <span className="font-serif text-[13px] text-stone-700">{g.name}</span>
                </a>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <nav
      className={`sticky top-0 z-50 transition-all duration-300 ${
        scrolled ? "shadow-md" : ""
      }`}
      style={{
        backgroundColor: scrolled ? "rgba(250, 246, 237, 0.98)" : "rgba(250, 246, 237, 0.94)",
        backdropFilter: "blur(8px)",
        borderBottom: "1px solid rgba(68,64,60,0.15)",
      }}
    >
      <div className="max-w-7xl mx-auto px-6 md:pl-5 md:pr-10">

        {/* MOBILE: logo + menu toggle on one row (desktop hides this) */}
        <div className="flex md:hidden items-center justify-between py-3">
          <button onClick={() => go("top")} className="flex items-center gap-3 group">
            <img
              src="/logo.png"
              alt="Pets in Cabin"
              className="w-14 h-14 rounded-full object-cover flex-shrink-0 group-hover:opacity-85 transition-opacity shadow-sm"
            />
            <div className="flex flex-col items-start gap-1">
              <span
                className="font-serif text-stone-900 group-hover:text-amber-700 transition-colors leading-none"
                style={{ fontSize: "21px", fontWeight: 600, letterSpacing: "-0.02em" }}
              >
                Pets in Cabin
              </span>
              <span
                role="img"
                aria-label="by Theo's Mum"
                className="flex justify-between w-full text-[9px] uppercase text-stone-400 leading-none font-sans"
                style={{ letterSpacing: "0" }}
              >
                {"BY THEO'S MUM".split("").map((ch, i) => (
                  <span key={i} aria-hidden="true">{ch === " " ? "\u00A0" : ch}</span>
                ))}
              </span>
            </div>
          </button>

          <button
            onClick={() => setOpen(!open)}
            className="flex items-center gap-2 px-3 py-2 text-stone-700 hover:text-amber-700 transition-colors border border-stone-300 hover:border-amber-400 rounded-sm"
            aria-label="Menu"
          >
            {open ? <X className="w-4 h-4" strokeWidth={2} /> : <Menu className="w-4 h-4" strokeWidth={2} />}
            <span className="text-[10px] uppercase tracking-widest font-medium">{open ? "Close" : "Menu"}</span>
          </button>
        </div>

        {/* DESKTOP: logo on the left, two nav rows stacked to its right —
            all on the same level. Collapses the old three-row nav into two,
            which gives the hero below more vertical room. */}
        <div className="hidden md:flex items-stretch gap-8 py-3">
          {/* Logo + wordmark — left, vertically centred against the nav rows */}
          <button
            onClick={() => go("top")}
            className="flex items-center gap-3 group flex-shrink-0 self-center"
          >
            <img
              src="/logo.png"
              alt="Pets in Cabin"
              className="w-[72px] h-[72px] rounded-full object-cover flex-shrink-0 group-hover:opacity-85 transition-opacity shadow-sm"
            />
            <div className="flex flex-col items-start gap-1">
              <span
                className="font-serif text-stone-900 group-hover:text-amber-700 transition-colors leading-none"
                style={{ fontSize: "24px", fontWeight: 600, letterSpacing: "-0.02em" }}
              >
                Pets in Cabin
              </span>
              <span
                role="img"
                aria-label="by Theo's Mum"
                className="flex justify-between w-full text-[9px] uppercase text-stone-400 leading-none font-sans"
                style={{ letterSpacing: "0" }}
              >
                {"BY THEO'S MUM".split("").map((ch, i) => (
                  <span key={i} aria-hidden="true">{ch === " " ? "\u00A0" : ch}</span>
                ))}
              </span>
            </div>
          </button>

          {/* Hairline divider between logo and nav rows */}
          <div className="w-px bg-stone-200 self-stretch" />

          {/* Two nav rows, stacked, filling the space to the right of the logo */}
          <div className="flex-1 flex flex-col justify-center">
            <div className="flex items-center justify-between border-b border-stone-100">
              {row1.map((s) => <NavItem key={s.id} s={s} />)}
            </div>
            <div className="flex items-center justify-between">
              {row2.map((s) => <NavItem key={s.id} s={s} />)}
              <NavGuidesDropdown />
            </div>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {open && (
        <div
          className="md:hidden border-t-2 border-stone-900 animate-fadeIn"
          style={{ backgroundColor: "rgba(250, 246, 237, 0.99)" }}
        >
          <div className="max-w-7xl mx-auto px-6 py-5">
            <div className="grid grid-cols-2 gap-x-8">
              {navItems.map((s) => (
                <button
                  key={s.id}
                  onClick={() => go(s.id)}
                  className="flex items-baseline gap-2 py-3 border-b border-stone-200 text-left hover:text-amber-700 transition-colors group"
                >
                  {s.num && (
                    <span className="font-serif italic text-amber-600/60 text-xs w-6 flex-shrink-0">{s.num}</span>
                  )}
                  <span className="font-serif text-base text-stone-900 group-hover:text-amber-700 transition-colors">
                    {s.label}
                  </span>
                </button>
              ))}
            </div>

            {/* Country guide pages — separate routes, shown as their own group */}
            <div className="mt-5 pt-4 border-t-2 border-stone-200">
              <div className="text-xs uppercase tracking-[0.2em] text-amber-700 mb-2">
                Country pet guides
              </div>
              <div className="grid grid-cols-2 gap-x-8">
                {COUNTRY_GUIDES.map((g) => (
                  <a
                    key={g.slug}
                    href={g.slug}
                    className="flex items-baseline gap-2 py-2.5 border-b border-stone-200 hover:text-amber-700 transition-colors"
                  >
                    <span aria-hidden="true" className="text-sm">{g.flag}</span>
                    <span className="font-serif text-sm text-stone-900">{g.name}</span>
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}

function Hero({ onStart }) {
  return (
    <header className="relative pt-6 md:pt-8 pb-24 px-6 md:px-12 overflow-hidden">
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{
        backgroundImage: "radial-gradient(circle at 25% 20%, #1a1a1a 1px, transparent 1px), radial-gradient(circle at 75% 80%, #1a1a1a 1px, transparent 1px)",
        backgroundSize: "32px 32px"
      }} />

      <div className="relative max-w-5xl mx-auto text-center">
        <div className="flex items-center gap-2 mb-7">
          <span className="text-xs uppercase tracking-widest text-stone-500">By Theo's Mum</span>
          <div className="flex-1 h-px bg-stone-300 mx-3" />
          <span className="text-xs uppercase tracking-widest text-stone-500">Vol. I · 2026</span>
        </div>

        <h1 className="font-serif text-6xl md:text-8xl leading-[0.95] text-stone-900 mb-8">
          A field guide to flying<br />
          <span className="italic text-stone-600">with your pet</span>,<br />
          in the cabin.
        </h1>

        <p className="font-serif text-xl md:text-2xl text-stone-700 max-w-2xl mx-auto leading-relaxed mb-10">
          Every airline has different rules. Every country has different paperwork. We sort through it so you and your animal arrive together — calm, prepared, and on the same flight.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 items-stretch justify-center">
          <button
            onClick={onStart}
            className="group flex items-center justify-between gap-4 bg-stone-900 text-cream-50 px-7 py-5 hover:bg-amber-700 transition-colors duration-300 text-left flex-1 sm:max-w-[340px]"
            style={{ color: "#faf6ed" }}
          >
            <div className="flex flex-col gap-1.5">
              <span className="uppercase tracking-widest text-sm font-medium">Can my pet fly? Start here</span>
              <span className="text-sm leading-snug text-cream-200 normal-case tracking-normal" style={{ color: "rgba(250, 246, 237, 0.75)" }}>
                Quick questions about your pet and route — see how tricky your trip will be.
              </span>
            </div>
            <ArrowRight className="w-5 h-5 flex-shrink-0 group-hover:translate-x-1 transition-transform" strokeWidth={2} />
          </button>

          <a
            href="#checklist"
            className="group flex items-center justify-between gap-4 border-2 border-stone-900 text-stone-900 bg-transparent px-7 py-5 hover:bg-stone-900 hover:text-cream-50 transition-colors duration-300 text-left flex-1 sm:max-w-[340px]"
          >
            <div className="flex flex-col gap-1.5">
              <span className="uppercase tracking-widest text-sm font-medium">What paperwork do I need?</span>
              <span className="text-sm leading-snug text-stone-600 group-hover:text-cream-200 normal-case tracking-normal" style={{ }}>
                Pick your origin and destination — download a printable, country-specific checklist.
              </span>
            </div>
            <ArrowRight className="w-5 h-5 flex-shrink-0 group-hover:translate-x-1 transition-transform" strokeWidth={2} />
          </a>
        </div>

        {/* Journey planner — full-width band beneath the two main CTAs.
            It's the most powerful tool on the site, so it gets its own
            emphasis line rather than being squeezed into a third column. */}
        <a
          href="#planner"
          className="group mt-4 flex items-center justify-between gap-4 bg-amber-700 text-cream-50 px-7 py-5 hover:bg-stone-900 transition-colors duration-300 text-left w-full max-w-[696px] mx-auto"
          style={{ color: "#faf6ed" }}
        >
          <div className="flex items-center gap-3">
            <Compass className="w-6 h-6 flex-shrink-0" strokeWidth={1.75} />
            <div className="flex flex-col gap-1.5">
              <span className="uppercase tracking-widest text-sm font-medium">Plan my journey</span>
              <span className="text-sm leading-snug normal-case tracking-normal" style={{ color: "rgba(250, 246, 237, 0.8)" }}>
                The cabin route or workaround for your trip, plus a full prep checklist covering every country your pet touches.
              </span>
            </div>
          </div>
          <ArrowRight className="w-5 h-5 flex-shrink-0 group-hover:translate-x-1 transition-transform" strokeWidth={2} />
        </a>

        <div className="grid grid-cols-3 gap-8 mt-10 pt-8 border-t border-stone-300 max-w-2xl mx-auto">
          {[
            { num: "08", label: "Quick questions" },
            { num: "32", label: "Airlines compared" },
            { num: "14", label: "Tricky destinations" },
          ].map((s, i) => (
            <div key={i} className="text-center">
              <div className="font-serif text-5xl text-stone-800">{s.num}</div>
              <div className="text-xs uppercase tracking-widest text-stone-500 mt-2">{s.label}</div>
            </div>
          ))}
        </div>

        {/* UK petition CTA — visible on every page load, just above the routes
            strip. Active parliament petition to allow small cabin pets into
            the UK. Currently the single most-asked-about issue for our UK
            readers. The petition closes when it hits 6 months OR its goal. */}
        <div className="mt-8 pt-8 border-t border-stone-300">
          <a
            href="https://petition.parliament.uk/petitions/750817"
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => {
              if (typeof window !== "undefined" && window.gtag) {
                window.gtag("event", "petition_link", {
                  event_category: "outbound",
                  event_label: "UK Parliament petition 750817",
                });
              }
            }}
            className="group block max-w-2xl mx-auto bg-stone-50 border-2 border-amber-700 hover:border-amber-600 hover:bg-amber-50 transition-colors duration-200 p-5"
          >
            <div className="flex items-start gap-4">
              <span className="text-3xl flex-shrink-0">🇬🇧</span>
              <div className="flex-1 text-left">
                <div className="text-xs uppercase tracking-widest text-amber-700 mb-1.5 font-medium">UK Parliament petition · active now</div>
                <h3 className="font-serif text-xl text-stone-900 leading-snug mb-1.5">
                  Sign the petition: <span className="italic">let small pets fly cabin into the UK.</span>
                </h3>
                <p className="text-sm text-stone-700 leading-relaxed">
                  The UK is the only major Western country that forces all pets into cargo on arrival — even ones small enough for cabin everywhere else. 100,000 signatures forces a parliamentary debate. Takes 30 seconds, UK residents only.
                </p>
                <span className="inline-flex items-center gap-1.5 mt-2 text-sm font-medium text-amber-700 group-hover:text-amber-800">
                  Sign on petition.parliament.uk
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" strokeWidth={2} />
                </span>
              </div>
            </div>
          </a>
        </div>

        <div className="mt-10 pt-8 border-t border-stone-300">
          <div className="text-xs uppercase tracking-widest text-stone-500 mb-6">Routes Theo and I have actually flown</div>
          <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-4 font-serif text-stone-800">
            <span className="flex items-center gap-2">
              <span className="text-2xl">🇬🇧</span>
              <span className="text-lg">London</span>
            </span>
            <ArrowRight className="w-4 h-4 text-stone-400" strokeWidth={1.5} />
            <span className="flex items-center gap-2">
              <span className="text-2xl">🇨🇦</span>
              <span className="text-lg">Canada</span>
            </span>
            <ArrowRight className="w-4 h-4 text-stone-400" strokeWidth={1.5} />
            <span className="flex items-center gap-2">
              <span className="text-2xl">🇺🇸</span>
              <span className="text-lg">United States</span>
            </span>
            <ArrowRight className="w-4 h-4 text-stone-400" strokeWidth={1.5} />
            <span className="flex items-center gap-2">
              <span className="text-2xl">🇫🇷</span>
              <span className="text-lg">Paris</span>
            </span>
            <ArrowRight className="w-4 h-4 text-stone-400" strokeWidth={1.5} />
            <span className="flex items-center gap-2">
              <span className="text-2xl">🇬🇧</span>
              <span className="text-lg italic">Home again</span>
            </span>
          </div>
          <p className="font-serif italic text-stone-500 text-sm mt-5 max-w-2xl mx-auto leading-relaxed">
            Including the Paris pivot — fly into CDG, drive to Calais, Eurotunnel back to the UK with Theo curled up on the back seat.
          </p>
        </div>
      </div>
    </header>
  );
}

function Intake({ answers, setAnswers, step, setStep, onComplete }) {
  const sectionRef = useRef(null);

  // Build the ordered step list dynamically. petCount drives how many per-pet
  // loops we generate. Before petCount is answered, only the SHARED_QUESTIONS
  // appear — once they pick a count, the per-pet steps are appended.
  const steps = useMemo(() => buildIntakeSteps(answers.petCount), [answers.petCount]);

  // Clamp step in case petCount changes and shrinks the flow (e.g. user goes
  // back, picks "1" instead of "2 or more", and we'd otherwise be past the end).
  const safeStep = Math.min(step, Math.max(0, steps.length - 1));
  const current = steps[safeStep];
  const isFirst = safeStep === 0;
  const isLast = safeStep === steps.length - 1;

  // Scroll to the top of the question whenever the step changes.
  useEffect(() => {
    if (safeStep === 0) return;
    const el = sectionRef.current;
    if (el) {
      const top = el.getBoundingClientRect().top + window.scrollY - 80;
      window.scrollTo({ top, behavior: "smooth" });
    }
  }, [safeStep]);

  // Resolve the current answer for shared vs. per-pet questions.
  function getCurrentAnswer() {
    if (!current) return undefined;
    if (current.kind === "shared") return answers[current.q.id];
    if (current.kind === "perPet") return answers.pets?.[current.petIndex]?.[current.q.id];
    return undefined;
  }
  const currentAnswer = getCurrentAnswer();

  // Pick a value — writes to shared field or to answers.pets[petIndex][q.id].
  function pick(option) {
    if (current.kind === "shared") {
      // If user just picked petCount, also ensure answers.pets is properly
      // sized so per-pet rendering doesn't try to read from undefined slots.
      if (current.q.id === "petCount") {
        const n = option === "2 or more" ? 2 : (parseInt(option, 10) || 1);
        const existing = Array.isArray(answers.pets) ? answers.pets : [];
        const newPets = [];
        for (let i = 0; i < n; i++) newPets.push(existing[i] || {});
        setAnswers({ ...answers, petCount: option, pets: newPets });
      } else {
        setAnswers({ ...answers, [current.q.id]: option });
      }
    } else if (current.kind === "perPet") {
      const existing = Array.isArray(answers.pets) ? [...answers.pets] : [];
      while (existing.length <= current.petIndex) existing.push({});
      existing[current.petIndex] = { ...existing[current.petIndex], [current.q.id]: option };
      setAnswers({ ...answers, pets: existing });
    }
  }

  // Pet gate handlers: "Same as Pet 1" copies all of Pet 1's answers into
  // this pet and skips past this pet's per-pet questions.
  function copyFromPetOne() {
    const existing = Array.isArray(answers.pets) ? [...answers.pets] : [];
    while (existing.length <= current.petIndex) existing.push({});
    existing[current.petIndex] = { ...(existing[0] || {}) };
    setAnswers({ ...answers, pets: existing });
    // Skip past this pet's questions — find the next step that isn't a perPet
    // for this petIndex.
    let nextStep = safeStep + 1;
    while (
      nextStep < steps.length &&
      steps[nextStep].kind === "perPet" &&
      steps[nextStep].petIndex === current.petIndex
    ) {
      nextStep++;
    }
    if (nextStep >= steps.length) onComplete();
    else setStep(nextStep);
  }

  function answerSeparately() {
    // Move to the next step — first per-pet question for this petIndex.
    setStep(safeStep + 1);
  }

  // Whether the current step has a usable answer (for advancing).
  const hasAnswer = current?.kind === "petGate" ? true : !!currentAnswer;

  function next() {
    if (isLast) onComplete();
    else setStep(safeStep + 1);
  }

  // ---------- Render branches ----------
  // Pet gate gets its own screen layout — different from a normal question.
  const renderQuestion = () => {
    if (!current) return null;
    if (current.kind === "petGate") {
      const petLabel = `Pet ${current.petIndex + 1}`;
      return (
        <>
          <h2 className="font-serif text-3xl md:text-4xl text-stone-900 leading-tight mb-2">
            Tell me about {petLabel}.
          </h2>
          <p className="text-stone-600 italic mb-6 text-sm max-w-xl">
            Same situation as Pet 1, or different? If they share the same age, weight, breed type, vaccines, and microchip status, copy Pet 1's answers and skip ahead.
          </p>
          <div className="grid gap-2 mb-6 mt-4">
            <button
              onClick={copyFromPetOne}
              className="text-left px-4 py-3 border border-stone-300 bg-white hover:border-stone-900 hover:-translate-y-0.5 transition-all"
            >
              <div className="font-serif text-base text-stone-900">Same as Pet 1 — copy and skip ahead</div>
              <div className="text-xs text-stone-500 mt-1">Use this if both pets are the same species, age, size, vaccinated together, etc.</div>
            </button>
            <button
              onClick={answerSeparately}
              className="text-left px-4 py-3 border border-stone-300 bg-white hover:border-stone-900 hover:-translate-y-0.5 transition-all"
            >
              <div className="font-serif text-base text-stone-900">Different — let me answer for {petLabel}</div>
              <div className="text-xs text-stone-500 mt-1">Different age, weight, vaccination status, etc.</div>
            </button>
          </div>
        </>
      );
    }

    // Shared or per-pet question
    const q = current.q;
    const petLabel = current.kind === "perPet"
      ? formatPetLabel(current.petIndex, answers.petCount)
      : null;
    const label = petLabel ? q.label.replace("{petLabel}", petLabel) : q.label;

    return (
      <>
        <h2 className="font-serif text-3xl md:text-4xl text-stone-900 leading-tight mb-2">
          {label}
        </h2>

        {q.helper && (
          <p className="text-stone-600 italic mb-3 text-sm max-w-xl">{q.helper}</p>
        )}

        {q.type === "dropdown" ? (
          <div className="mt-4 mb-6">
            <select
              value={currentAnswer || ""}
              onChange={(e) => pick(e.target.value)}
              aria-label={q.label}
              className="w-full bg-white border-2 border-stone-300 focus:border-stone-900 focus:outline-none px-4 py-4 font-serif text-xl text-stone-900 transition-colors"
            >
              <option value="" disabled>Select a destination…</option>
              {q.options.map((opt) => (
                <option key={opt} value={opt}>{opt}</option>
              ))}
            </select>
          </div>
        ) : (
          <div className="grid gap-2 mb-6 mt-4">
            {q.options.map((opt) => {
              const selected = currentAnswer === opt;
              return (
                <button
                  key={opt}
                  onClick={() => pick(opt)}
                  className={`group text-left px-4 py-3 border transition-all duration-200 flex items-center justify-between ${
                    selected
                      ? "border-stone-900 bg-stone-900 text-stone-50"
                      : "border-stone-300 bg-white hover:border-stone-900 hover:-translate-y-0.5"
                  }`}
                >
                  <span className="font-serif text-base">{opt}</span>
                  {selected && <Check className="w-4 h-4 flex-shrink-0" strokeWidth={1.5} />}
                </button>
              );
            })}
          </div>
        )}
      </>
    );
  };

  return (
    <section ref={sectionRef} id="intake" className="py-10 px-6 md:px-12 bg-stone-100 border-y border-stone-300 scroll-mt-24">
      <div id="assessment" className="scroll-mt-24" />
      <div className="max-w-5xl mx-auto">
        <SectionLabel num="I.">Can my pet fly in the cabin?</SectionLabel>

        <div className="flex items-center gap-2 mb-5">
          {steps.map((_, i) => (
            <div
              key={i}
              className={`h-0.5 flex-1 transition-all duration-500 ${
                i < safeStep ? "bg-stone-900" : i === safeStep ? "bg-amber-700" : "bg-stone-300"
              }`}
            />
          ))}
        </div>

        <div className="text-xs uppercase tracking-widest text-stone-500 mb-2">
          {current?.kind === "petGate"
            ? `Pet ${current.petIndex + 1} of ${answers.pets?.length || 0}`
            : `Question ${safeStep + 1} of ${steps.length}`}
        </div>

        {renderQuestion()}

        {/* Show Back + Continue buttons (except for pet gates, which advance themselves). */}
        {current?.kind !== "petGate" && (
          <div className="flex items-center justify-between">
            <button
              onClick={() => setStep(Math.max(0, safeStep - 1))}
              disabled={isFirst}
              className="inline-flex items-center gap-2 text-stone-600 hover:text-stone-900 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span className="uppercase tracking-widest text-xs">Back</span>
            </button>

            <button
              onClick={next}
              disabled={!hasAnswer}
              className="group inline-flex items-center gap-3 bg-stone-900 text-stone-50 px-7 py-3.5 disabled:opacity-30 disabled:cursor-not-allowed hover:bg-amber-700 transition-colors"
            >
              <span className="uppercase tracking-widest text-xs font-medium">
                {isLast ? "See your assessment" : "Continue"}
              </span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        )}

        {/* Pet gate has its own Back button at the bottom, separately. */}
        {current?.kind === "petGate" && (
          <div className="flex items-center justify-between">
            <button
              onClick={() => setStep(Math.max(0, safeStep - 1))}
              disabled={isFirst}
              className="inline-flex items-center gap-2 text-stone-600 hover:text-stone-900 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span className="uppercase tracking-widest text-xs">Back</span>
            </button>
          </div>
        )}
      </div>
    </section>
  );
}

function Assessment({ answers, onReset }) {
  const result = useMemo(() => assess(answers), [answers]);
  const sectionRef = useRef(null);

  // Aggregate counts across shared + every pet for the top-line verdict.
  // The new assess() returns { shared: {flags, warnings, ok}, perPet: [...] }.
  // Defensive: if result is in the old flat shape, normalise it.
  const shared = result.shared || { flags: result.flags || [], warnings: result.warnings || [], ok: result.ok || [] };
  const perPet = Array.isArray(result.perPet) ? result.perPet : [];

  const allFlags = [...shared.flags, ...perPet.flatMap((p) => p.flags)];
  const allWarnings = [...shared.warnings, ...perPet.flatMap((p) => p.warnings)];
  const allOks = [...shared.ok, ...perPet.flatMap((p) => p.ok)];

  const hasFlags = allFlags.length > 0;
  const hasWarnings = allWarnings.length > 0;
  const hasOks = allOks.length > 0;
  const hasImpossible = allFlags.some((f) => f.severity === "impossible");
  const hasOnlyFixableFlags = hasFlags && !hasImpossible;

  // Auto-scroll to the assessment when it renders.
  useEffect(() => {
    let raf1, raf2;
    raf1 = requestAnimationFrame(() => {
      raf2 = requestAnimationFrame(() => {
        const el = sectionRef.current;
        if (el) {
          const top = el.getBoundingClientRect().top + window.scrollY - 80;
          window.scrollTo({ top, behavior: "smooth" });
        }
      });
    });
    return () => {
      cancelAnimationFrame(raf1);
      cancelAnimationFrame(raf2);
    };
  }, []);

  // Determine top-level verdict
  let verdictColor, verdictBg, verdictBorder, verdictIcon, verdictHeadline, verdictSummary;
  if (hasImpossible) {
    verdictColor = "text-red-800";
    verdictBg = "bg-red-50";
    verdictBorder = "border-red-800";
    verdictIcon = <AlertTriangle className="w-7 h-7 text-red-800" strokeWidth={1.75} />;
    verdictHeadline = "This route isn't possible in cabin";
    const impossibleCount = allFlags.filter((f) => f.severity === "impossible").length;
    verdictSummary = `${impossibleCount === 1 ? "There's a fundamental block" : `There are ${impossibleCount} fundamental blocks`} that cabin travel can't resolve on its own — but most have workarounds. Read each blocker below carefully: where a cabin workaround exists (e.g. Paris Pivot for UK, Abu Dhabi for UAE), we've noted it. Where cabin is genuinely off the table, we've suggested cargo or pet-relocation options.`;
  } else if (hasOnlyFixableFlags) {
    verdictColor = "text-orange-700";
    verdictBg = "bg-orange-50";
    verdictBorder = "border-orange-700";
    verdictIcon = <AlertTriangle className="w-7 h-7 text-orange-700" strokeWidth={1.75} />;
    verdictHeadline = "Not yet — but the blockers are fixable";
    verdictSummary = `${allFlags.length === 1 ? "There's 1 item" : `There are ${allFlags.length} items`} blocking cabin travel right now — but ${allFlags.length === 1 ? "it's" : "they're"} all addressable (microchip, vaccine timing, age). Work through them, then come back. ${hasWarnings ? `${allWarnings.length} other thing${allWarnings.length === 1 ? "" : "s"} to plan for too.` : ""}`;
  } else if (hasWarnings) {
    verdictColor = "text-amber-700";
    verdictBg = "bg-amber-50";
    verdictBorder = "border-amber-700";
    verdictIcon = <Info className="w-7 h-7 text-amber-700" strokeWidth={1.75} />;
    verdictHeadline = "Looks workable — with a few things to plan for";
    verdictSummary = `Nothing critical, but there ${allWarnings.length === 1 ? "is 1 thing" : `are ${allWarnings.length} things`} worth knowing before you book. Read them below and plan accordingly.`;
  } else {
    verdictColor = "text-emerald-700";
    verdictBg = "bg-emerald-50";
    verdictBorder = "border-emerald-700";
    verdictIcon = <Check className="w-7 h-7 text-emerald-700" strokeWidth={1.75} />;
    verdictHeadline = "Looks good — no major blockers";
    verdictSummary = "Based on what you've told us, your pet should be eligible to fly cabin. Confirm details directly with your airline and destination country before booking.";
  }

  // Helper to render a single flag (blocker) block — used in both shared and per-pet sections.
  const renderFlag = (f, i) => {
    const isImpossible = f.severity === "impossible";
    return (
      <div
        key={i}
        className={`border-l-2 pl-5 pr-4 py-4 ${
          isImpossible
            ? "bg-red-50/70 border-red-800"
            : "bg-orange-50/70 border-orange-700"
        }`}
      >
        <div className="flex items-baseline gap-2 mb-2 flex-wrap">
          <span
            className={`text-xs uppercase tracking-widest font-medium px-2 py-0.5 ${
              isImpossible ? "bg-red-200 text-red-900" : "bg-orange-200 text-orange-900"
            }`}
          >
            {isImpossible ? "Cabin not possible" : "Fixable"}
          </span>
          <div className="font-serif text-xl text-stone-900">
            {f.title}
          </div>
        </div>
        <p className="text-stone-700 leading-relaxed mb-3 [&_a]:text-amber-700 [&_a]:underline [&_a]:decoration-amber-600/40 [&_a]:underline-offset-2 [&_a:hover]:text-amber-800" dangerouslySetInnerHTML={{ __html: f.detail }} />
        {f.workaround && (
          <div className="mt-3 pt-3 border-t border-stone-200">
            <div className="text-xs uppercase tracking-widest text-stone-500 font-medium mb-1.5">
              {isImpossible ? "Suggested alternative" : "How to fix it"}
            </div>
            <p className="text-stone-700 leading-relaxed text-sm [&_a]:text-amber-700 [&_a]:underline [&_a]:decoration-amber-600/40 [&_a]:underline-offset-2 [&_a:hover]:text-amber-800" dangerouslySetInnerHTML={{ __html: f.workaround }} />
          </div>
        )}
      </div>
    );
  };

  const renderWarning = (w, i) => (
    <div key={i} className="bg-amber-50/50 border-l-2 border-amber-700 pl-5 pr-4 py-4">
      <div className="font-serif text-xl text-stone-900 mb-2">
        <span className="text-amber-700 mr-2">{i + 1}.</span>{w.title}
      </div>
      <p className="text-stone-700 leading-relaxed [&_a]:text-amber-700 [&_a]:underline [&_a]:decoration-amber-600/40 [&_a]:underline-offset-2 [&_a:hover]:text-amber-800" dangerouslySetInnerHTML={{ __html: w.detail }} />
    </div>
  );

  // Renders a per-pet block — only shown when there are multiple pets.
  // For single-pet flow we merge per-pet results into the main sections so
  // the output looks essentially identical to the pre-rebuild version.
  const renderPetBlock = (pet, idx) => {
    const hasContent = pet.flags.length > 0 || pet.warnings.length > 0 || pet.ok.length > 0;
    if (!hasContent) return null;
    return (
      <div key={idx} className="border border-stone-300 bg-white">
        <div className="bg-stone-900 text-stone-50 px-6 py-4">
          <div className="text-xs uppercase tracking-widest text-amber-300 mb-1">{pet.petLabel}</div>
          <div className="font-serif text-xl">
            {pet.flags.length === 0 && pet.warnings.length === 0
              ? "✓ Looking good"
              : pet.flags.some((f) => f.severity === "impossible")
              ? "⚠ Cabin blockers"
              : pet.flags.length > 0
              ? "⚠ Fixable blockers"
              : "ⓘ Things to plan for"}
          </div>
        </div>
        <div className="p-6 space-y-4">
          {pet.flags.length > 0 && (
            <div className="space-y-4">
              {pet.flags.map((f, i) => renderFlag(f, `pet${idx}-flag${i}`))}
            </div>
          )}
          {pet.warnings.length > 0 && (
            <div className="space-y-4">
              {pet.warnings.map((w, i) => renderWarning(w, i))}
            </div>
          )}
          {pet.ok.length > 0 && (
            <ul className="space-y-2 pt-2 border-t border-stone-200">
              {pet.ok.map((o, i) => (
                <li key={i} className="flex items-start gap-2 text-stone-700 text-sm leading-relaxed">
                  <Check className="w-4 h-4 text-emerald-700 flex-shrink-0 mt-1" strokeWidth={2} />
                  <span>{o}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    );
  };

  // For single-pet flow, merge per-pet results into the shared sections so
  // the rendered output is essentially identical to the pre-rebuild version
  // (just one combined list rather than two near-identical lists).
  const isSinglePet = perPet.length <= 1;
  const flagsForMainSection = isSinglePet ? allFlags : shared.flags;
  const warningsForMainSection = isSinglePet ? allWarnings : shared.warnings;
  const okForMainSection = isSinglePet ? allOks : shared.ok;
  const hasMainFlags = flagsForMainSection.length > 0;
  const hasMainWarnings = warningsForMainSection.length > 0;
  const hasMainOks = okForMainSection.length > 0;

  // Trip summary header — supports both new (answers.pets) and legacy shapes.
  function tripSummary() {
    const pets = Array.isArray(answers.pets) ? answers.pets : null;
    const dest = answers.destination || "—";
    if (pets && pets.length > 0) {
      const speciesList = pets.map((p) => p.species).filter(Boolean);
      const uniq = Array.from(new Set(speciesList));
      const speciesText = uniq.length > 0 ? uniq.join(" + ") : "pet";
      if (pets.length === 1) {
        const p = pets[0];
        return `${speciesText}${p.weight ? " · " + p.weight : ""} · ${dest}`;
      }
      return `${pets.length} pets (${speciesText}) · ${dest}`;
    }
    // Legacy fallback
    const sp = Array.isArray(answers.species) ? answers.species.join(" + ") : (answers.species || "pet");
    const countLabel = answers.petCount === "1" || !answers.petCount ? sp : `${answers.petCount} pets (${sp})`;
    return `${countLabel}${answers.weight ? " · " + answers.weight : ""} · ${dest}`;
  }

  return (
    <section ref={sectionRef} id="assessment-result" className="py-20 px-6 md:px-12 scroll-mt-24">
      <div className="max-w-5xl mx-auto">
        <SectionLabel num="II.">Your assessment</SectionLabel>

        <div className="bg-stone-50 border border-stone-300 mb-12">
          {/* TOP: Trip summary + restart */}
          <div className="flex items-start justify-between gap-6 p-8 md:p-10 pb-6 border-b border-stone-300">
            <div>
              <div className="text-xs uppercase tracking-widest text-stone-500 mb-2">Your trip</div>
              <div className="font-serif text-2xl text-stone-900">
                {tripSummary()}
              </div>
            </div>
            <button
              onClick={onReset}
              className="inline-flex items-center gap-2 text-stone-600 hover:text-stone-900 text-sm whitespace-nowrap"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Restart</span>
            </button>
          </div>

          {/* VERDICT: Top-line result */}
          <div className={`${verdictBg} border-l-4 ${verdictBorder} p-8 md:p-10`}>
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 mt-1">{verdictIcon}</div>
              <div className="flex-1">
                <div className={`text-xs uppercase tracking-widest ${verdictColor} font-medium mb-2`}>
                  Verdict
                </div>
                <h3 className="font-serif text-2xl md:text-3xl text-stone-900 mb-3 leading-tight">
                  {verdictHeadline}
                </h3>
                <p className="text-stone-700 leading-relaxed">
                  {verdictSummary}
                </p>
                <div className="flex flex-wrap gap-3 mt-5 text-xs uppercase tracking-widest">
                  {hasImpossible && (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-red-200 text-red-900 font-medium">
                      <AlertTriangle className="w-3 h-3" strokeWidth={2.5} />
                      {allFlags.filter((f) => f.severity === "impossible").length} cabin-impossible
                    </span>
                  )}
                  {hasOnlyFixableFlags && (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-orange-100 text-orange-800 font-medium">
                      <AlertTriangle className="w-3 h-3" strokeWidth={2.5} />
                      {allFlags.length} fixable blocker{allFlags.length === 1 ? "" : "s"}
                    </span>
                  )}
                  {hasWarnings && (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-amber-100 text-amber-800 font-medium">
                      <Info className="w-3 h-3" strokeWidth={2.5} />
                      {allWarnings.length} to plan for
                    </span>
                  )}
                  {hasOks && (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-100 text-emerald-800 font-medium">
                      <Check className="w-3 h-3" strokeWidth={2.5} />
                      {allOks.length} looking good
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* DETAIL SECTIONS */}
          <div className="p-8 md:p-10 space-y-10">

            {/* Per-pet blocks — only render when there are 2+ pets. For
                single-pet flow these are merged into the main sections below. */}
            {!isSinglePet && perPet.some((p) => p.flags.length > 0 || p.warnings.length > 0 || p.ok.length > 0) && (
              <div>
                <div className="flex items-center gap-3 mb-2 pb-3 border-b-2 border-stone-700">
                  <PawPrint className="w-5 h-5 text-stone-700" strokeWidth={1.75} />
                  <h3 className="uppercase tracking-widest text-sm text-stone-700 font-medium">
                    Per-pet checks ({perPet.length} pets)
                  </h3>
                </div>
                <p className="text-sm text-stone-600 italic font-serif mb-5">
                  Each pet's age, weight, breed, vaccine, and microchip status checked individually.
                </p>
                <div className="space-y-4">
                  {perPet.map((p, idx) => renderPetBlock(p, idx))}
                </div>
              </div>
            )}

            {hasMainFlags && (
              <div>
                <div className="flex items-center gap-3 mb-2 pb-3 border-b-2 border-red-700">
                  <AlertTriangle className="w-5 h-5 text-red-700" strokeWidth={1.75} />
                  <h3 className="uppercase tracking-widest text-sm text-red-700 font-medium">
                    {isSinglePet
                      ? (flagsForMainSection.length === 1 ? "Blocker to address" : `${flagsForMainSection.length} blockers to address`)
                      : (flagsForMainSection.length === 1 ? "Shared route blocker" : `${flagsForMainSection.length} shared route blockers`)}
                  </h3>
                </div>
                <p className="text-sm text-stone-600 italic font-serif mb-5">
                  {isSinglePet
                    ? "Where a workaround exists, we've spelled it out under each blocker."
                    : "Route-level blockers that affect every pet on the booking (UK cabin ban, Dubai cargo-only, Japan titer, etc.)."}
                </p>
                <div className="space-y-5">
                  {flagsForMainSection.map((f, i) => renderFlag(f, i))}
                </div>
              </div>
            )}

            {hasMainWarnings && (
              <div>
                <div className="flex items-center gap-3 mb-2 pb-3 border-b-2 border-amber-700">
                  <Info className="w-5 h-5 text-amber-700" strokeWidth={1.75} />
                  <h3 className="uppercase tracking-widest text-sm text-amber-700 font-medium">
                    {isSinglePet
                      ? (warningsForMainSection.length === 1 ? "Thing to plan for" : `${warningsForMainSection.length} things to plan for`)
                      : (warningsForMainSection.length === 1 ? "Shared route note" : `${warningsForMainSection.length} shared route notes`)}
                  </h3>
                </div>
                <p className="text-sm text-stone-600 italic font-serif mb-5">
                  {isSinglePet
                    ? "Not blockers, but you'll want to plan around these before booking."
                    : "Route-level notes that apply to every pet on the booking."}
                </p>
                <div className="space-y-5">
                  {warningsForMainSection.map((w, i) => renderWarning(w, i))}
                </div>
              </div>
            )}

            {hasMainOks && (
              <div>
                <div className="flex items-center gap-3 mb-2 pb-3 border-b-2 border-emerald-700">
                  <Check className="w-5 h-5 text-emerald-700" strokeWidth={1.75} />
                  <h3 className="uppercase tracking-widest text-sm text-emerald-700 font-medium">
                    {okForMainSection.length === 1 ? "Looking good" : `${okForMainSection.length} looking good`}
                  </h3>
                </div>
                <p className="text-sm text-stone-600 italic font-serif mb-5">
                  Already sorted — nothing to worry about here.
                </p>
                <ul className="space-y-3">
                  {okForMainSection.map((o, i) => (
                    <li key={i} className="flex items-start gap-3 text-stone-700 leading-relaxed">
                      <Check className="w-4 h-4 text-emerald-700 flex-shrink-0 mt-1" strokeWidth={2} />
                      <span dangerouslySetInnerHTML={{ __html: o }} />
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* NEXT STEPS FOOTER */}
          <div className="border-t border-stone-300 bg-stone-100 p-8 md:p-10">
            <div className="text-xs uppercase tracking-widest text-stone-500 mb-3">Next steps</div>
            <p className="text-stone-700 leading-relaxed mb-4">
              {hasImpossible
                ? "Read the cabin-not-possible blockers carefully — most have a workaround. The journey planner will show you the exact cabin route or workaround for your specific airports (Paris Pivot for UK, Abu Dhabi for UAE, European hubs for India ↔ USA). If cargo is the only option, the destination tab lists cargo-friendly airlines."
                : hasOnlyFixableFlags
                ? "Work through the fixable blockers above first (microchip, vaccine, age). Once they're resolved, come back and re-run the assessment. In the meantime, use the journey planner to start mapping your route."
                : hasWarnings
                ? "Read the items above carefully and plan around them. Next, use the journey planner to find your exact route, then generate a checklist for it."
                : "You're clear to plan. Use the journey planner to find the exact cabin route for your airports, then generate a combined checklist for the whole journey."}
            </p>
            <div className="flex flex-wrap gap-3">
              <a href="#planner" className="inline-flex items-center gap-2 bg-amber-600 hover:bg-amber-500 text-white px-4 py-2 text-sm font-medium transition-colors">
                ✦ Plan my journey →
              </a>
              <a href="#checklist" className="inline-flex items-center gap-2 text-amber-700 hover:text-amber-800 text-sm font-medium border-b border-amber-300 hover:border-amber-700 transition-colors">
                Get my route checklist →
              </a>
              <a href="#airlines" className="inline-flex items-center gap-2 text-amber-700 hover:text-amber-800 text-sm font-medium border-b border-amber-300 hover:border-amber-700 transition-colors">
                Browse airlines →
              </a>
              <a href="#routes" className="inline-flex items-center gap-2 text-amber-700 hover:text-amber-800 text-sm font-medium border-b border-amber-300 hover:border-amber-700 transition-colors">
                See routes →
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ---------- DIFFICULT DESTINATIONS ----------

const DESTINATIONS = [
  {
    id: "uk",
    flag: "🇬🇧",
    name: "United Kingdom",
    headline: "No pets in cabin. Period.",
    rule: "Every commercial flight into the UK requires pets to travel as manifested cargo (booked separately, in the hold) — never in the cabin. Eurostar also bans pets on all routes through the Channel Tunnel. The only exception is registered assistance dogs.",
    workarounds: [
      {
        title: "The Paris Pivot",
        icon: <Train className="w-4 h-4" strokeWidth={1.75} />,
        body: "Fly into Paris (CDG) in cabin on Air France, KLM, Lufthansa or another EU carrier. Take a pet taxi or rental car from Paris to Calais (~3 hours). Cross the Channel via Eurotunnel Le Shuttle from Calais to Folkestone — your pet stays in the car with you for the 35-minute crossing. Drive on to London. This is the route most savvy owners use.",
        cost: "Eurotunnel: £25–£60 per pet · Pet taxi Paris–Calais: £300–£600 · Total day: 8–10 hours.",
      },
      {
        title: "The Ferry Route",
        icon: <Ship className="w-4 h-4" strokeWidth={1.75} />,
        body: "Brittany Ferries, DFDS, P&O, and Stena Line all run pet-friendly ferries from France/Netherlands/Spain to the UK. Many now have dedicated pet-friendly cabins where your dog or cat can stay with you the whole crossing — far less stressful than the hold. Routes from Caen, Cherbourg, Hoek van Holland, and Bilbao are popular.",
        cost: "£40–£200 per pet depending on route and cabin type.",
      },
      {
        title: "Pet Taxi (Door to Door)",
        icon: <Compass className="w-4 h-4" strokeWidth={1.75} />,
        body: "Companies like PetAir UK, Animal Couriers, and Pet Express will collect your pet from your hotel in mainland Europe and deliver them to your London address — handling all the paperwork and the channel crossing. Pricier, but useful if you can't drive yourself.",
        cost: "£500–£1,200 from Paris to London.",
      },
    ],
    paperwork: "ISO microchip, rabies vaccine (at least 21 days old), Animal Health Certificate from a USDA-accredited vet within 10 days of entry, AND a tapeworm treatment by a vet 24–120 hours before arrival (dogs only). Required no matter how you cross.",
  },
  {
    id: "australia",
    flag: "🇦🇺",
    name: "Australia",
    headline: "Cargo only. Plus 10 days of quarantine.",
    rule: "Australia treats pets as biosecurity risks. All pets must arrive in Melbourne (Tullamarine) as manifested cargo and complete a minimum 10-day quarantine at the Mickleham facility. There is no in-cabin option for any commercial passenger flight. Even pets from the U.S. need an import permit (3–6 month process).",
    workarounds: [
      {
        title: "Plan in months, not weeks",
        icon: <ScrollText className="w-4 h-4" strokeWidth={1.75} />,
        body: "Start the import process at least 6 months before your move. The required rabies blood test (RNATT) must be drawn at least 180 days before arrival. There is no faster path — even from low-risk countries.",
        cost: "Quarantine: ~AUD $2,500–$3,500 · Permit + tests: ~$1,500.",
      },
      {
        title: "Use a registered pet shipper",
        icon: <Plane className="w-4 h-4" strokeWidth={1.75} />,
        body: "Some airlines (notably Qantas) won't accept direct bookings from the public for live animal cargo to Australia. You'll need an IPATA-registered shipper to handle the booking, paperwork, and crate compliance. This is one of the few routes where DIY isn't really an option.",
        cost: "Shipper fees: $1,500–$4,000 on top of cargo.",
      },
      {
        title: "Fly via New Zealand?",
        icon: <MapIcon className="w-4 h-4" strokeWidth={1.75} />,
        body: "Tempting, but no — pets from NZ skip Australian quarantine, but only if they've lived in NZ for at least 6 months first. Not a useful workaround for short trips. There is no shortcut.",
        cost: "—",
      },
    ],
    paperwork: "Import permit (apply via DAFF), ISO microchip, current rabies vaccine, RNATT blood test ≥180 days before arrival, multiple parasite treatments, USDA-endorsed export certificate, quarantine reservation.",
  },
  {
    id: "newzealand",
    flag: "🇳🇿",
    name: "New Zealand",
    headline: "Cargo only. 10 days quarantine (except from Australia).",
    rule: "Like Australia, NZ requires pets to arrive as cargo into Auckland or Christchurch and complete 10 days minimum quarantine at an MPI-approved facility. Pets coming from Australia are exempt from quarantine. Air New Zealand requires bookings to go through approved pet shippers.",
    workarounds: [
      {
        title: "The Australia Stopover",
        icon: <MapIcon className="w-4 h-4" strokeWidth={1.75} />,
        body: "If you're moving long-term, some pet owners route through Australia and let their pet establish residency there for 6+ months before continuing to NZ — bypassing NZ quarantine entirely. Only worth it for permanent moves.",
        cost: "Adds significant cost; not a vacation strategy.",
      },
      {
        title: "Direct from LA on Qantas",
        icon: <Plane className="w-4 h-4" strokeWidth={1.75} />,
        body: "From the U.S., the shortest route is LAX direct via Qantas or Air New Zealand cargo. Skip multi-leg journeys — every connection adds risk and stress for your pet.",
        cost: "Cargo: $2,000–$5,000+ depending on size.",
      },
    ],
    paperwork: "Import permit, ISO microchip, two rabies vaccines, RNATT test, parasite treatments, OVD form, USDA-endorsed health certificate, quarantine booking.",
  },
  {
    id: "hawaii",
    flag: "🌺",
    name: "Hawaii",
    headline: "Technically domestic, practically international.",
    rule: "Hawaii is rabies-free and treats arriving pets like a foreign import. The default is 120 days of quarantine. The good news: the 5-Day-Or-Less and Direct Airport Release programs let qualifying pets skip quarantine entirely — but the prep takes 4+ months.",
    workarounds: [
      {
        title: "Direct Airport Release (DAR)",
        icon: <Sparkles className="w-4 h-4" strokeWidth={1.75} />,
        body: "Meet every requirement and your pet can be released at HNL airport on arrival — no quarantine. You need: ISO microchip, two rabies vaccines (most recent at least 30 days before arrival), an OIE-FAVN rabies blood test from an approved lab with results showing immunity, a 30-day waiting period after the test, and paperwork submitted to HDOA at least 10 days before arrival.",
        cost: "FAVN test: ~$300 · Inspection fee: $185 · Documentation: varies.",
      },
      {
        title: "British Isles / Australia / NZ / Guam exemption",
        icon: <Compass className="w-4 h-4" strokeWidth={1.75} />,
        body: "Pets coming directly from these rabies-free regions skip quarantine entirely if they've lived there 6+ months and meet documentation rules. A useful path if you're already in one of those places.",
        cost: "Standard inspection + paperwork only.",
      },
      {
        title: "Don't fly into anywhere but HNL",
        icon: <Plane className="w-4 h-4" strokeWidth={1.75} />,
        body: "Honolulu is the only port of entry for animals. If your final destination is Maui or Kauai, you still must clear Honolulu first, then fly inter-island. Hawaiian Airlines is the only carrier that takes pets in cabin on the inter-island legs.",
        cost: "Inter-island pet fee: $35 each way.",
      },
    ],
    paperwork: "ISO microchip, two rabies vaccines, OIE-FAVN test (30+ days before arrival), AQS-279 form, vet health certificate within 14 days of travel.",
  },
  {
    id: "japan",
    flag: "🇯🇵",
    name: "Japan",
    headline: "Strict import rules + JAL/ANA cargo-only. Three cabin paths exist.",
    rule: "Japan's two flag carriers — JAL and ANA — DO NOT carry pets in cabin on any flight (international or domestic). Pets are cargo only on both. Cabin pets to/from Japan exist on just three paths: United (US ↔ Japan direct, no weight limit), Korean Air / T'Way / Air Premia (Japan ↔ Korea cabin, then onward via Korean Air's wider cabin network), and Aeromexico (Mexico City ↔ Tokyo direct). Plus: Japan's pet import process is one of the strictest in the world — 180-day wait after a passing rabies titer test, plus a 40-day AQS Advance Notification deadline. Get any step wrong and your pet faces up to 180 days quarantine at your expense. Plan 7+ months ahead.",
    workarounds: [
      {
        title: "US ↔ Japan: United direct (the cleanest cabin path)",
        icon: <Plane className="w-4 h-4" strokeWidth={1.75} />,
        body: "United is one of very few airlines accepting cabin pets US ↔ Japan direct. No weight limit (carrier-size-bound), $150 each way. Routes from SFO to NRT/HND/KIX (new Sept-Oct 2026 schedule), Chicago ORD to NRT (twice weekly from Sept 2026). For Seattle travellers, connect SEA→SFO on Alaska/Delta first, then United SFO→Tokyo.",
        cost: "$150 each way + a $150 layover fee for stopovers >4 hours.",
      },
      {
        title: "Anywhere else ↔ Japan: via Seoul on Korean carriers",
        icon: <Plane className="w-4 h-4" strokeWidth={1.75} />,
        body: "Korean Air, T'Way Air, and Air Premia all fly cabin pets Japan ↔ Korea direct, then onward via Korean Air's 30+ country cabin network (US, Europe, India, SE Asia). Korean Air's max cabin weight is 7 kg; T'Way's is 9 kg. Important: T'Way doesn't permit pet transit through Korea — must be point-to-point. For onward travel through Korea, use Korean Air both legs and book as a single through-ticket.",
        cost: "Japan↔Korea on Korean Air: $100. Korea↔elsewhere: $150–$200.",
      },
      {
        title: "Mexico/Latin America ↔ Japan: Aeromexico direct",
        icon: <Plane className="w-4 h-4" strokeWidth={1.75} />,
        body: "Aeromexico flies cabin pets MEX ↔ NRT direct — one of the few Pacific cabin pet routes. Combined pet+carrier weight 9 kg. Snub-nosed breeds welcome in cabin. Useful for Latin American travellers OR as a routing option for US travellers who can position to Mexico City cheaply.",
        cost: "$200–$250 each way long-haul international.",
      },
      {
        title: "Start the import clock at least 7 months out",
        icon: <ScrollText className="w-4 h-4" strokeWidth={1.75} />,
        body: "The 180-day clock starts the day blood is drawn for the rabies titer test (FAVN ≥0.5 IU/ml). Before that: ISO microchip (must be implanted BEFORE the first rabies vaccine), two rabies vaccines. After the titer passes: wait 180 days. Submit AQS Advance Notification ≥40 days before arrival. Vet exam and Form AC within 10 days of boarding, USDA-endorsed. The single most common mistake is arriving before Day 180 — your pet gets quarantined for the missing days at your expense.",
        cost: "Tests, paperwork, vet visits: $500–$1,500. Detention quarantine: about ¥3,500/day ($25/day) for up to 180 days.",
      },
      {
        title: "Arrive at one of 11 approved pet entry ports",
        icon: <AlertTriangle className="w-4 h-4" strokeWidth={1.75} />,
        body: "Japan's airports approved for pet entry: New Chitose (CTS), Narita (NRT), Haneda (HND), Chubu/Nagoya (NGO), Kansai/Osaka (KIX), Itami (ITM), Kobe (UKB), Kitakyushu (KKJ), Fukuoka (FUK), Kagoshima (KOJ), Naha (OKA). Anywhere else and your pet is refused entry. Land at an approved port before 5 PM — pets arriving after 5 PM can't be released from their crate until customs reopens the next morning.",
        cost: "Domestic onward to non-entry airports is fine after clearance.",
      },
    ],
    paperwork: "ISO 11784/11785 microchip (BEFORE first rabies vaccine), two rabies vaccines, FAVN/RNATT titer test ≥0.5 IU/ml, 180-day waiting period (blood draw date = Day 0), AQS Advance Notification ≥40 days before arrival, vet clinical exam within 10 days of boarding, USDA-endorsed Form A and Form C. Forms must be perfect: no erasing, no correction fluid, microchip number on every document, vaccine product/manufacturer details listed. Most international airlines are cargo-only into Japan (JAL, ANA, Lufthansa, KLM, BA, Singapore) — cabin options are limited to United (from US), Korean carriers (from/via Korea), and Aeromexico (from Mexico).",
  },
  {
    id: "ireland",
    flag: "🇮🇪",
    name: "Ireland",
    headline: "Same cabin ban as the UK — but a cleaner ferry route in.",
    rule: "Ireland follows the same core rule as the UK: no commercial airline allows pets in the cabin on flights INTO Ireland. Pets must arrive as manifested cargo, or via an approved pet-friendly sea route. Flying OUT of Ireland in the cabin is generally fine on the EU carriers. Tapeworm treatment is required for dogs (not cats) 24–120 hours before arrival, the same as the UK. The upside: Ireland has direct France→Ireland ferries, so you can skip the UK landbridge entirely.",
    workarounds: [
      {
        title: "France → Ireland direct ferry (the cleanest route)",
        icon: <Ship className="w-4 h-4" strokeWidth={1.75} />,
        body: "Fly cabin into a continental EU hub (Paris CDG, Amsterdam, Frankfurt), drive to Cherbourg or Roscoff, and take a pet-friendly ferry directly to Rosslare or Dublin. Irish Ferries and Brittany Ferries both run this with pet-friendly cabins or pet-stays-in-vehicle options. This avoids the UK entirely — no UK landbridge, no second border. The crossing is long (14–18h) but your pet is with you or in your vehicle the whole way.",
        cost: "Ferry: €60–€250 per pet depending on route and cabin type.",
      },
      {
        title: "UK landbridge: Eurotunnel + Holyhead ferry",
        icon: <Train className="w-4 h-4" strokeWidth={1.75} />,
        body: "The alternative: fly cabin into Paris, Eurotunnel into the UK, drive across to Holyhead in Wales, then the short ferry (Irish Ferries / Stena Line) to Dublin. More legs than the direct France route, but the individual crossings are shorter and there are more daily sailings. Note you transit the UK, so UK pet rules apply on that leg too.",
        cost: "Eurotunnel £25–£60 + Holyhead–Dublin ferry €40–€120 per pet.",
      },
      {
        title: "Cabin OUT of Ireland is straightforward",
        icon: <Plane className="w-4 h-4" strokeWidth={1.75} />,
        body: "Leaving Ireland is much easier than arriving. Aer Lingus and the EU flag carriers (Lufthansa, Air France, KLM) accept cabin pets on flights departing Dublin to continental Europe — under 8 kg combined. From a European hub you can connect onward. The cabin ban is specifically about flights INTO Ireland.",
        cost: "Cabin pet fee €50–€150 per leg with EU carriers.",
      },
      {
        title: "Cargo into Dublin",
        icon: <Plane className="w-4 h-4" strokeWidth={1.75} />,
        body: "If the ferry routes don't suit, pets can fly into Dublin as manifested cargo. Aer Lingus, Lufthansa Cargo and KLM Cargo all handle this. Less comfortable than the ferry — your pet is in the hold, separate from you — but it's faster than the multi-leg land routes. Use a pet relocation agent if you're not confident handling cargo paperwork.",
        cost: "Cargo: $1,200–$3,000+ depending on origin and pet size.",
      },
      {
        title: "Don't forget: it's a two-country problem",
        icon: <Info className="w-4 h-4" strokeWidth={1.75} />,
        body: "Whatever route you pick, both the country you leave AND Ireland have rules. From the US you'll need an EU Health Certificate (USDA-endorsed). From the UK you'll need a GB Animal Health Certificate — since April 2026 GB residents can no longer use an EU pet passport for travel into the EU (Ireland included). From within the EU, an EU pet passport covers it. Ireland-specific: ISO microchip, rabies ≥21 days old, and tapeworm treatment for dogs 24–120 hours before arrival.",
        cost: "—",
      },
    ],
    paperwork: "ISO microchip (implanted before rabies vaccine), rabies vaccine ≥21 days old, EU Animal Health Certificate or EU pet passport (or GB AHC if coming from the UK), tapeworm treatment by a vet 24–120 hours before arrival (dogs only). Confirm current requirements with Ireland's Department of Agriculture, Food and the Marine before you travel.",
  },
  {
    id: "india",
    flag: "🇮🇳",
    name: "India",
    headline: "Cabin to/from India — easier than ever in 2026.",
    rule: "India is now one of the better destinations for cabin pet travel. Air India's 2026 'Paws on Board' programme accepts cabin pets up to 10 kg on direct flights between India and the USA (DEL/BOM/BLR/HYD ↔ JFK/SFO/IAD/ORD/EWR), Europe, and Canada. The exceptions: cabin NOT allowed to/from the UK (cargo only — UK government embargo) or departing India to UAE. Six approved entry airports for pets only: Delhi, Mumbai, Chennai, Kolkata, Bengaluru, Hyderabad. AQCS NOC is required for every entry.",
    workarounds: [
      {
        title: "India → USA: now direct via Air India",
        icon: <Plane className="w-4 h-4" strokeWidth={1.75} />,
        body: "Air India Paws on Board direct cabin flights to JFK, SFO, IAD, ORD, EWR from Delhi, Mumbai, Bengaluru, and Hyderabad. 10 kg combined weight limit — more generous than the 8 kg on European carriers. Book via Air India customer support 48 hours ahead. For Seattle: connect SFO → SEA on Alaska/Delta after arrival.",
        cost: "$140 short-haul intl / $160 medium-haul / non-refundable",
      },
      {
        title: "India → USA via Europe: 5 alternative cabin paths",
        icon: <Plane className="w-4 h-4" strokeWidth={1.75} />,
        body: "If Air India direct doesn't fit your schedule, cabin via Europe works on Lufthansa (FRA, except BLR — Lufthansa specifically excludes Bangalore), KLM (AMS), Air France (CDG), SWISS (ZRH), and LOT Polish (WAW). Both legs cabin under 8 kg. Book single through-ticket. Allow 3+ hours at the European hub.",
        cost: "Two-leg cabin fees combined: $200–$500. LOT Polish is the cheapest (€70 to USA).",
      },
      {
        title: "India ↔ UK: cargo only (no exceptions)",
        icon: <Ship className="w-4 h-4" strokeWidth={1.75} />,
        body: "Pets between India and the UK must travel as manifested cargo. India is an 'unlisted third country' for the UK — meaning a rabies titer test plus a three-month wait before UK entry. Plan 4–6 months ahead. Use a registered pet relocation specialist (Carry My Pet, PetAir UK, Anvis Pet Relocation) — this isn't a DIY route.",
        cost: "Cargo: ₹80,000–₹4,00,000 depending on size and route.",
      },
      {
        title: "Entering India: the AQCS NOC",
        icon: <ScrollText className="w-4 h-4" strokeWidth={1.75} />,
        body: "To bring a pet INTO India, you need a No Objection Certificate (NOC) from the Animal Quarantine and Certification Service (AQCS) BEFORE arrival. Pets can only enter through six designated airports: Delhi, Mumbai, Chennai, Kolkata, Bengaluru, or Hyderabad. Apply for the NOC at least 1–2 weeks in advance. Returning Indian residents can bring up to 2 pets without an import licence (just the NOC).",
        cost: "NOC: Free. Vet visit + paperwork: ₹3,000–₹10,000.",
      },
      {
        title: "Plan around the heat",
        icon: <AlertTriangle className="w-4 h-4" strokeWidth={1.75} />,
        body: "India's summer (April–June) is brutal for cargo pets — many airlines refuse to fly snub-nosed (brachycephalic) breeds in cargo May–September. Even cabin pets benefit from cooler travel. If you have flexibility, aim for October–February.",
        cost: "—",
      },
      {
        title: "Myth check: 'My cousin did India → LAX direct in cabin'",
        icon: <Info className="w-4 h-4" strokeWidth={1.75} />,
        body: "I get asked this often. The honest answer: as of May 2026, no airline operates a direct India → USA or India → Canada cabin pet route. Air India explicitly excludes those routes (cargo only). Qatar and Emirates don't allow cabin pets at all. Etihad accepts cabin pets only to/from Abu Dhabi — NOT to the USA. JAL and ANA via Tokyo don't allow cabin pets internationally. What most 'direct in cabin' stories actually were: (1) pet flew as checked baggage (same plane, in the hold) and was collected at baggage claim; (2) the trip involved a European stopover that felt direct; or (3) a pre-2021 emotional support animal flight, which isn't allowed any more. Always ask: was the pet under the seat with you, or did you pick them up at a baggage carousel?",
        cost: "—",
      },
    ],
    paperwork: "ISO microchip, rabies vaccine 30 days–12 months old, AQCS NOC for entry, official vet health certificate from origin country, parvo/distemper/leptospirosis vaccines, rabies titer (FAVN/RNATT) if going to/from UK or EU.",
  },
  {
    id: "dubai-uae",
    flag: "🇦🇪",
    name: "Dubai / UAE",
    headline: "The UAE has a back door — and it's not Dubai.",
    rule: "There is NO cabin entry to Dubai (DXB) on any airline — UAE law requires all pets entering Dubai to arrive as manifested cargo. Emirates, Qatar, Turkish, Air India to Dubai: all cargo only. BUT — you CAN fly cabin into Abu Dhabi (AUH) on Etihad under 8 kg combined. Abu Dhabi is 90 minutes from Dubai by road. This is the route most cabin-conscious UAE arrivals use. Outbound flights from the UAE are different and more flexible: Air India accepts cabin pets from UAE to many destinations.",
    workarounds: [
      {
        title: "The Abu Dhabi back door — Etihad cabin (this is THE route)",
        icon: <Plane className="w-4 h-4" strokeWidth={1.75} />,
        body: "Etihad is the only airline accepting cabin pets INTO the UAE — and only into Abu Dhabi (AUH), not Dubai. Combined pet + carrier max 8 kg (17.6 lb). Carrier max 40 × 40 × 22 cm under-seat (or 50 × 43 × 50 cm if you buy the adjacent seat). All other UAE requirements still apply (MOCCAE permit, microchip, rabies, etc.). Abu Dhabi to Dubai is a 90-minute drive — taxis are easy, around AED 250. Note: Etihad cabin is NOT allowed on USA, UK, Australia or Hong Kong routes.",
        cost: "PROMO: $399 per segment (bookings before end of May 2026). Standard: $1,500 per segment.",
      },
      {
        title: "Myth check: 'I heard you can fly cabin to Dubai now'",
        icon: <Info className="w-4 h-4" strokeWidth={1.75} />,
        body: "This is a common claim, often based on rumour. As of May 2026: NO commercial airline accepts cabin pets into Dubai (DXB). UAE federal law requires all live animals entering through Dubai to be manifested cargo. People who say they've done it are usually thinking of: (a) Etihad cabin to Abu Dhabi then road transfer; (b) a charter/private jet (which has different rules); (c) checked baggage in the hold (not in cabin); or (d) a service dog under different rules. If anyone tells you they flew cabin to Dubai International with a regular pet, ask them which airline and which carrier they used — the answer almost always reveals one of the above.",
        cost: "—",
      },
      {
        title: "Going INTO Dubai: cargo with a customs broker",
        icon: <Ship className="w-4 h-4" strokeWidth={1.75} />,
        body: "Pets flying into Dubai (DXB) must travel as manifested cargo and most airlines require a UAE-based customs broker to handle clearance. Dubai Kennels & Cattery (DKC) is the most-used — they collect your pet at the cargo terminal, clear paperwork with MOCCAE, and reunite you within a few hours of landing. Main long-haul cargo options into Dubai: Emirates SkyCargo (direct from many cities), Qatar Cargo via Doha, Turkish Cargo via Istanbul, KLM/Lufthansa via European hubs, Air India cargo from Delhi/Mumbai.",
        cost: "Cargo: $2,000–$5,000+ · Broker fees: $300–$600.",
      },
      {
        title: "Out of UAE: Air India cabin is allowed",
        icon: <Plane className="w-4 h-4" strokeWidth={1.75} />,
        body: "Heading OUT of UAE? Air India accepts cabin pets (under 10 kg combined) on flights departing UAE to many destinations including India and Europe. This is one of the few ways to fly cabin on a long-haul route involving the Middle East. Note: Air India does NOT allow cabin pets on UAE departures to the US, Canada, UK, or Australia (cargo only on those legs).",
        cost: "Standard Air India intl pet fees apply.",
      },
      {
        title: "Breed bans you need to know",
        icon: <AlertTriangle className="w-4 h-4" strokeWidth={1.75} />,
        body: "The UAE bans import of several breeds entirely: Pit Bull Terrier, American Staffordshire Terrier, Rottweiler, Dogo Argentino, Fila Brasileiro, Tosa Inu, Mastiff types, and wolf-dog hybrids. Other 'restricted' breeds (Bull Terrier, Husky, English Bulldog, Shar Pei) need municipal registration and may not be allowed in apartments. Snub-nosed breeds face seasonal cargo restrictions May–September.",
        cost: "—",
      },
      {
        title: "MOCCAE permit — apply 30 days out",
        icon: <ScrollText className="w-4 h-4" strokeWidth={1.75} />,
        body: "Every pet entering the UAE needs an import permit from the Ministry of Climate Change and Environment (MOCCAE). It's valid for only 30 days from issue, so time the application carefully. You'll need: ISO microchip, rabies vaccine (21+ days old, less than 12 months), rabies antibody titer test (for higher-risk origin countries), parasite treatments within 14 days of travel, and vet health certificate.",
        cost: "MOCCAE permit: AED 1,000 (≈$272).",
      },
    ],
    paperwork: "MOCCAE import permit (30-day validity), ISO microchip, rabies vaccine 21+ days old & under 12 months, rabies titer for higher-risk countries, internal/external parasite treatments within 14 days, vet health certificate within 10 days of travel.",
  },
  {
    id: "uk-to-europe",
    flag: "🇪🇺",
    name: "UK & EU travel",
    headline: "Out of the UK, around the EU. Mostly easier than you think.",
    rule: "Once you have the right document — a GB Animal Health Certificate (AHC, from a UK vet within 10 days) if you're a GB resident, or an EU pet passport if you're an EU resident — most internal EU travel is straightforward. Note: since 22 April 2026, GB residents can no longer use an EU pet passport for EU travel and must use the AHC. Pets travel free or cheap on most trains, ferries, and short-haul flights. The friction is mostly at the UK border, not within the EU. IMPORTANT: For flying out of the UK with a pet in cabin, ALWAYS use Heathrow (LHR) — Gatwick (LGW) does NOT permit cabin pets on departing flights.",
    workarounds: [
      {
        title: "Cabin out of Heathrow — the most overlooked UK option",
        icon: <Plane className="w-4 h-4" strokeWidth={1.75} />,
        body: "Most UK pet owners assume they can't fly with their pet in cabin. They can — just not on British Airways or Virgin (cargo only). Several airlines accept cabin pets DEPARTING from London Heathrow (LHR): Air France (to Paris), KLM (to Amsterdam), Lufthansa (to Frankfurt/Munich), SWISS (to Zurich), LOT Polish (to Warsaw), TAP Air Portugal (to Lisbon), Air Canada (to Toronto/Montreal), and Air Transat (Manchester/Glasgow only). All combined max 8–10 kg. From any of these European hubs you can connect onward cabin-friendly to the US, India, or most of the world. CRITICAL: This is Heathrow only — Gatwick (LGW) blocks cabin pet departures on all airlines.",
        cost: "Pet fee per leg: €50–€200. Two-leg long-haul: €100–€400 total.",
      },
      {
        title: "UK → Portugal: TAP cabin from Heathrow",
        icon: <Plane className="w-4 h-4" strokeWidth={1.75} />,
        body: "Portugal is one of the most popular UK relocation destinations and TAP Air Portugal makes it easy: 184 flights per week from Heathrow to Lisbon, cabin pets allowed under 8 kg combined, soft carrier max 45 × 30 × 23 cm. The 2h 45m flight is one of the shortest cabin options for a meaningful European move. Lisbon is also a strong onward hub for cabin flights to the USA, Brazil, and Morocco. Snub-nosed breeds: cabin allowed. Reserve at least 48 hours ahead by phone.",
        cost: "TAP cabin fee: ~€75 for short-haul (LHR-LIS) one-way.",
      },
      {
        title: "Eurotunnel Le Shuttle (the UK exit standard)",
        icon: <Train className="w-4 h-4" strokeWidth={1.75} />,
        body: "The most popular UK ↔ Europe option. Drive your car onto the train at Folkestone, your pet stays in the car with you for the 35-minute crossing, drive off at Calais. Eurotunnel has a dedicated Pet Reception where checks happen before boarding (not on arrival). Around 10% of Eurotunnel passengers travel with pets — it's pet-normal.",
        cost: "£25–£60 per pet (one-way).",
      },
      {
        title: "Pet-friendly ferries (UK ↔ Europe)",
        icon: <Ship className="w-4 h-4" strokeWidth={1.75} />,
        body: "Brittany Ferries, DFDS, and P&O run routes from Portsmouth/Plymouth/Dover to France and Spain. Many offer pet-friendly cabins where your dog or cat stays with you the whole crossing — book early, they sell out months ahead. Some allow pets in the car only (you can't visit them mid-crossing).",
        cost: "£40–£250 per pet depending on cabin type.",
      },
      {
        title: "Within EU: trains are pet-normal",
        icon: <Train className="w-4 h-4" strokeWidth={1.75} />,
        body: "Eurostar continental routes (Paris ↔ Brussels ↔ Amsterdam ↔ Cologne, formerly Thalys) welcome pets: under 6 kg in a carrier free; larger pets €30 per leg. SNCF (France TGV/Intercités): small pet under 6 kg in carrier €7; dogs over 6 kg on a lead with muzzle €30. Deutsche Bahn (Germany ICE): small pets in carrier free, larger dogs travel as a child fare. Trenitalia, Renfe, ÖBB all welcome pets with similar small fees. Eurostar's London routes remain pet-banned — but everything continental is open.",
        cost: "Free under 6 kg on most operators · €7–€30 for larger pets.",
      },
      {
        title: "Within EU: short-haul flights in cabin",
        icon: <Plane className="w-4 h-4" strokeWidth={1.75} />,
        body: "Most EU flag carriers (Lufthansa, Air France/KLM, SWISS, LOT, ITA, Iberia, Brussels, TAP Air Portugal) accept cabin pets under 8 kg combined within the EU. Typical fee €50–€80. Eurowings, Vueling, and easyJet do NOT accept any pets in cabin. Ryanair never accepts pets (assistance dogs only). When returning from EU to UK, cabin pets are not allowed — pets must travel cargo (UK government rule).",
        cost: "€50–€80 per leg with EU flag carriers.",
      },
      {
        title: "Pet taxi door-to-door (UK)",
        icon: <Compass className="w-4 h-4" strokeWidth={1.75} />,
        body: "If you don't drive, services like Le Pet Express and Folkestone Taxi For Dogs run shuttles from London/Ashford to French rail stations, handling the Eurotunnel crossing for you. Pricier than DIY but takes all the stress off.",
        cost: "£200–£600 depending on route.",
      },
    ],
    paperwork: "From UK: ISO microchip, rabies vaccine ≥21 days old, GB Animal Health Certificate (AHC) from a UK vet within 10 days of travel — valid for 4 months of EU travel and 4 months for re-entry. Since 22 April 2026, GB residents can NO LONGER use an EU pet passport for travel into the EU (even an EU-issued one) — the AHC is now required for each outbound trip. EU pet passports are only issued to EU residents. GB residents can still use a pet passport for the return leg into Great Britain. Within EU (for EU residents): an EU pet passport from any EU vet replaces the AHC and is valid for the pet's lifetime (rabies vaccine staying current). Tapeworm treatment 24–120 hrs before returning to the UK or Ireland (dogs only).",
  },
  {
    id: "caribbean",
    flag: "🌴",
    name: "Caribbean (Jamaica especially)",
    headline: "Every island has different rules — don't assume.",
    rule: "The Caribbean is not one destination. Bahamas, Jamaica, Cayman Islands, Barbados, and St. Lucia all have strict import permits and pre-arrival paperwork (often 30+ days). Dominican Republic, Aruba, Curacao, and Bermuda are easier but still require a health certificate. Puerto Rico and USVI are US territories — no import paperwork. Jamaica is the strictest: 6+ months of prep including mandatory FAVN rabies titer. If you're from the US, Dominican Republic is on the CDC's high-risk rabies list — getting your dog BACK is the tricky part. NOTE: we cover the three most-asked-about destinations in detail below (Bahamas, Jamaica, Dominican Republic) — the Caribbean has 25+ destinations with varying rules. If yours isn't covered here, always check the destination's official Department of Agriculture site and confirm with your airline.",
    workarounds: [
      {
        title: "Jamaica: 6+ months prep is mandatory",
        icon: <FileCheck className="w-4 h-4" strokeWidth={1.75} />,
        body: "Two-stage permit process. First submit a Preliminary Application Form (with FAVN rabies titer results 3–12 months old). Once approved, get the actual Veterinary Import Permit. Multiple parasite treatments at specific intervals before travel. Pit Bull Terriers and hybrid dogs are banned. Pets from non-Category-1 (rabies-uncontrolled) countries must reside in a Category-1 country for 6+ months first.",
        cost: "Permit fees + FAVN titer (~$100–200) + vet treatments. Allow 6+ months.",
      },
      {
        title: "Bahamas: 6–8 week import permit",
        icon: <FileCheck className="w-4 h-4" strokeWidth={1.75} />,
        body: "Apply via bahamaspetpermit.com at least 4 weeks before travel. International Veterinary Certificate within 48 hours of arrival. Pet examined by Bahamian vet within 48 hours of landing. Banned breeds: Pit Bull, Presa Canario, Cane Corso, American Bully, Staffordshire Terrier. Good news for returning to the US: Bahamas is CDC-rabies-FREE, so re-entry is just the standard CDC Dog Import Form.",
        cost: "Permit: ~$10 USD + 12% VAT. Vet exam on arrival ~$50–100.",
      },
      {
        title: "Dominican Republic: easy in, harder out (for US visitors)",
        icon: <Info className="w-4 h-4" strokeWidth={1.75} />,
        body: "Getting your pet INTO the DR is straightforward — microchip + rabies + vet health certificate. BUT: DR is on the CDC high-risk rabies list, which means returning to the US requires the Certification of U.S.-issued Rabies Vaccination form (NOT a regular rabies cert). This MUST be obtained from a USDA-accredited vet and USDA-endorsed BEFORE your dog leaves the US — it cannot be issued retroactively. People get caught out by this.",
        cost: "USDA form: $50–150 endorsement fee. Plan ahead.",
      },
      {
        title: "Puerto Rico and USVI: no paperwork needed",
        icon: <Plane className="w-4 h-4" strokeWidth={1.75} />,
        body: "These are US territories. If you're flying from the US mainland, your dog or cat needs no special import paperwork — just standard rabies vaccination and the usual airline cabin booking. JetBlue, Delta, AA, United, Spirit, Frontier all offer cabin pet service. Same return.",
        cost: "Just the airline cabin pet fee ($100–150).",
      },
      {
        title: "Other Caribbean: check the specific country",
        icon: <Compass className="w-4 h-4" strokeWidth={1.75} />,
        body: "Cayman Islands and Barbados both require import permits and rabies titer testing (similar to Jamaica in complexity). Antigua, Aruba, Curacao, Bermuda, St. Lucia, and Turks & Caicos are simpler — typically a health certificate within 10–14 days of arrival. Always check the destination's official Department of Agriculture site (or APHIS country page if departing from the US) before booking.",
        cost: "Varies. Some countries: $0 fee + paperwork only. Others: $50–300 permits.",
      },
    ],
    paperwork: "Universal requirements across Caribbean destinations: ISO 15-digit microchip, valid rabies vaccination, vet-issued international health certificate (usually within 10 days, sometimes 48 hours, of arrival). Jamaica + Cayman + Barbados additionally require FAVN rabies titer test 3–12 months before arrival. US travelers returning from Dominican Republic, Haiti, Cuba (all CDC high-risk) need the Certification of U.S.-issued Rabies Vaccination form endorsed by USDA before they leave the US. Carry originals (not photos) at the border.",
  },
  {
    id: "south-africa",
    flag: "🇿🇦",
    name: "South Africa",
    headline: "No cabin in or out — but it's not as scary as it sounds.",
    rule: "No airline allows pets in the cabin on international flights to or from South Africa. South African Airways, Airlink, and Lift only carry pets as checked baggage (domestic only) or as manifested cargo (international) — and due to infrastructure rules at OR Tambo (Johannesburg), international SAA flights take pets as cargo only. Internationally, every pet entering or leaving South Africa travels as manifested cargo in a temperature- and pressure-controlled hold. The good news: the cargo holds used are climate-controlled, the process is well-trodden, and South Africa has a large, experienced pet-relocation industry.",
    workarounds: [
      {
        title: "Cargo is the route — and it's routine here",
        icon: <Plane className="w-4 h-4" strokeWidth={1.75} />,
        body: "Unlike the UK (where a cabin workaround exists via Eurotunnel), South Africa genuinely has no cabin option in or out — it's an island for pet-cabin purposes. But cargo to/from South Africa is extremely well-established. Lufthansa Cargo (via Frankfurt's Animal Lounge — the world's best pet cargo facility), KLM Cargo (via Amsterdam), Qatar Cargo, and Emirates SkyCargo all run regular pet cargo to Johannesburg (JNB) and Cape Town (CPT). Most South African pet owners use a relocation agent who handles the IATA crate, booking, and customs clearance end to end.",
        cost: "Cargo JNB ↔ London/Europe: £1,500–£3,000. JNB ↔ USA: $3,000–$6,000. Agent fees: £400–£900.",
      },
      {
        title: "Domestic within South Africa: Lift allows small dogs in cabin",
        icon: <Plane className="w-4 h-4" strokeWidth={1.75} />,
        body: "For travel WITHIN South Africa, the low-cost airline Lift accepts small dogs (under 7 kg) in the cabin on select flights — window seats only, limited per flight, pet-friendly carrier required, fill out their Dog-in-cabin Request Form. FlySafair offers a climate-controlled 'PetLounge' cargo service domestically. South African Airways and Airlink take pets as checked baggage on domestic routes only. So your pet CAN be in the cabin with you — just only on domestic Lift flights, never international.",
        cost: "Lift: the blocked-off seat costs the same as a normal adult fare.",
      },
      {
        title: "Use a pet relocation agent — South Africa has great ones",
        icon: <Compass className="w-4 h-4" strokeWidth={1.75} />,
        body: "Because cargo is the only international option, South Africa has a mature pet-relocation industry. Agents like Pet Express, Animal Travel Services, and Global Paws handle the IATA-compliant crate, the cargo booking, the State Vet paperwork, rabies titer timing, and customs at both ends. For a stressful cargo move this is money well spent — they do hundreds of these a year and know exactly what each destination needs.",
        cost: "Full-service relocation: £400–£1,200 on top of the cargo fee.",
      },
      {
        title: "Rabies titer test — start 4+ months ahead",
        icon: <FileCheck className="w-4 h-4" strokeWidth={1.75} />,
        body: "Going to the EU, UK, or other rabies-controlled regions FROM South Africa requires a rabies antibody titer test (RNATT/FAVN) from an approved lab, drawn at least 30 days after vaccination. For the EU there's then a 3-month wait from a successful blood draw before travel. Going TO South Africa, you'll need a State Veterinary import permit plus rabies titer for most origin countries. Either direction: start at least 4–6 months before you want to fly.",
        cost: "Titer test: £80–£200. Import permit: free–R200.",
      },
    ],
    paperwork: "Into South Africa: State Veterinary import permit (apply 2–4 weeks ahead), ISO microchip, rabies vaccine 30 days–1 year old, rabies titer test for most countries, veterinary health certificate endorsed by the origin country's government vet, and additional tests (e.g. for ticks, biliary) depending on origin. Out of South Africa: rabies titer test, State Vet health certificate, plus whatever the destination country requires. All international pets travel as manifested cargo. IMPORTANT: because South Africa is cargo-only internationally, the exact crate specs, booking process, timings, and costs vary by airline and route — confirm every detail directly with the airline's cargo division or a professional pet relocation company before you commit to dates. Don't rely on general guidance for a cargo move; get specifics for your exact route.",
  },
  {
    id: "norway",
    flag: "🇳🇴",
    name: "Norway",
    headline: "EU-style entry — with two extras for dogs.",
    rule: "Norway is in the EEA (not the EU) but follows the EU pet passport system. Microchip + EU-approved rabies vaccine ≥21 days old + EU pet passport or Health Certificate. Two Norway-specific extras: dogs need tapeworm treatment (Echinococcus multilocularis) administered 24–120 hours before arrival, and seven dog breeds are outright banned. Pets enter ONLY via Oslo Airport (OSL) or the Storskog land border. Pets coming from non-listed third countries (most of the world outside EU/EEA) need a rabies titer test with a 3-month wait.",
    workarounds: [
      {
        title: "Cabin to Oslo: SAS, Norwegian, KLM, Lufthansa, Air France",
        icon: <Plane className="w-4 h-4" strokeWidth={1.75} />,
        body: "Oslo has one of Europe's strongest cabin pet airline networks. SAS allows cabin pets on routes across 25+ countries including the US (Newark direct), China, Japan, Morocco, plus all of Europe. Norwegian Air Shuttle allows cabin within Schengen/EU only. KLM (via AMS), Lufthansa (via FRA), and Air France (via CDG) connect Oslo cabin to the rest of the world. All have 8 kg combined weight limit and similar carrier dimensions.",
        cost: "SAS: €55 domestic / €70–149 international. Norwegian: €55–85.",
      },
      {
        title: "The tapeworm treatment is non-negotiable for dogs",
        icon: <FileCheck className="w-4 h-4" strokeWidth={1.75} />,
        body: "Norway is one of just five places (with Finland, Malta, Ireland, and Northern Ireland) that requires Echinococcus multilocularis tapeworm treatment for dogs entering. It must be administered by a vet 24–120 hours before arrival, using praziquantel as the active ingredient. Treatment date and time must be recorded in the pet passport. Exemption: dogs coming directly from Finland, Malta, or Ireland skip this (those countries are already Echinococcus-free).",
        cost: "Vet appointment + treatment: typically £30–£60 / €35–€70. Skip it and the fine is minimum NOK 7,000 plus 24h quarantine.",
      },
      {
        title: "Seven dog breeds are banned in Norway",
        icon: <AlertTriangle className="w-4 h-4" strokeWidth={1.75} />,
        body: "Banned: Pit Bull Terrier, American Staffordshire Terrier, Fila Brasileiro, Tosa Inu, Dogo Argentino, Czechoslovakian Wolfdog, and all wolf-dog hybrids — pure-bred or mixed. If your dog resembles any of these breeds, you may be asked for documentation proving otherwise. The Norwegian Food Safety Authority (Mattilsynet) handles import regulations; check with them directly before booking if there's any doubt.",
        cost: "Verification: free if you have it; rehoming if not.",
      },
      {
        title: "Pets from non-listed countries: rabies titer + 3-month wait",
        icon: <FileCheck className="w-4 h-4" strokeWidth={1.75} />,
        body: "If you're coming from a country that's not on the EU 'listed third countries' list (most of the world outside EU/EEA/US/Canada/UK/Switzerland/Japan/Australia), you need a rabies antibody titer test (≥0.5 IU/ml) drawn at least 30 days after vaccination, then wait 3 months before entry. Once passed, the titer is valid for the pet's life as long as rabies boosters stay current.",
        cost: "Titer test: £80–€200. Then time — the 3-month wait is the constraint.",
      },
    ],
    paperwork: "Required for all entries: ISO 11784/11785 microchip, EU-approved rabies vaccine ≥21 days old (pet must have been ≥12 weeks old when vaccinated), EU pet passport (for EU/EEA residents) or EU Health Certificate for Norway (from elsewhere) issued within 10 days of travel. Dogs: tapeworm treatment 24–120 hours before arrival, recorded in passport by a vet. From non-listed countries: rabies titer test ≥0.5 IU/ml plus 3-month wait. Exception: pets moving Norway↔Sweden specifically don't need the rabies vaccine. Banned breeds: Pit Bull, American Staffordshire Terrier, Fila Brasileiro, Tosa Inu, Dogo Argentino, Czechoslovakian Wolfdog, wolf-hybrids. Entry only at Oslo (OSL) airport or Storskog land border — follow the red customs channel on arrival.",
  },
  {
    id: "south-america",
    flag: "🌎",
    name: "South America",
    headline: "Cabin-friendly continent — different rules per country.",
    rule: "South America is one of the more cabin-pet-friendly continents in the world. LATAM (Chile-based, 7-10 kg cabin), Avianca (Colombia-based, 10 kg cabin), and Copa (Panama-based, 10 kg cabin) cover almost every major city. The catch: each country has its own import paperwork. Brazil is easiest (rabies vaccine + health certificate, no microchip required). Argentina, Uruguay, Chile, Peru, and Colombia all require ISO microchips and rabies vaccine 30+ days old; Chile and Peru also need pre-arranged import permits. Colombia bans Pit Bull, Staffordshire, and American Staffordshire imports by law. Brachycephalic dogs can travel cabin on LATAM/Avianca/Copa but never in cargo.",
    workarounds: [
      {
        title: "LATAM cabin pets — South America's workhorse",
        icon: <Plane className="w-4 h-4" strokeWidth={1.75} />,
        body: "LATAM operates the largest cabin pet network in South America, with hubs in Santiago (SCL), São Paulo (GRU), and Lima (LIM). Cabin weight 7-10 kg combined depending on aircraft (A319/A320/A321 lower, B777/787 higher). Fee: ~USD 200 international long-haul, BRL 200 domestic Brazil. The catch: LATAM-operated flights only — no codeshares, no partner connections. Book through their Contact Center, not online. Brachycephalic breeds welcome in cabin (banned from cargo).",
        cost: "USD 200 international · BRL 200 (~$40) domestic Brazil · LATAM Cargo separate for larger pets.",
      },
      {
        title: "Avianca cabin pets — northern South America specialist",
        icon: <Plane className="w-4 h-4" strokeWidth={1.75} />,
        body: "Avianca's hub is Bogotá (BOG). Cabin weight 10 kg combined — the most generous Latin American limit. Strong network across Colombia, Peru, Ecuador, Costa Rica, plus connections to Brazil, Argentina, Chile, Uruguay (BOG → MVD direct), Mexico, US, and Spain. Cabin NOT allowed to UK (cargo only), Galapagos (live animals prohibited), Aruba/Curaçao (except permanent moves). Brachycephalic dogs cabin-only — never in cargo.",
        cost: "USD 160 to/from North America · USD 180–200 to/from Europe · COP 75,000–115,000 (~$19-29) domestic Colombia.",
      },
      {
        title: "Copa Airlines — Panama hub for deeper South America",
        icon: <Plane className="w-4 h-4" strokeWidth={1.75} />,
        body: "Copa is the essential cabin pet route to deeper South American destinations — Uruguay (Montevideo), Paraguay (Asunción), and Bolivia — that lack direct US cabin connections. Cabin weight 10 kg combined. Hub at Panama City (PTY). Typical routing: US → PTY → Montevideo / Buenos Aires / Santiago / São Paulo. Brachycephalic dogs accepted in cabin (never cargo). Copa-operated itineraries only (no codeshare partners).",
        cost: "USD 125 international · USD 25 domestic Panama.",
      },
      {
        title: "Aeromexico Mexico ↔ South America cabin direct",
        icon: <Plane className="w-4 h-4" strokeWidth={1.75} />,
        body: "Aeromexico links Mexico City to São Paulo, Buenos Aires, Santiago, Bogotá, and Lima with cabin pets (9 kg combined). Useful for travellers connecting through Mexico from the US or Asia. Snub-nosed breeds welcome in cabin.",
        cost: "USD 200–250 long-haul international.",
      },
      {
        title: "Country-specific paperwork timing",
        icon: <FileCheck className="w-4 h-4" strokeWidth={1.75} />,
        body: "Brazil: rabies 21+ days before travel, USDA-endorsed health certificate within 10 days, no microchip required (but recommended). Argentina: ISO microchip, rabies 30+ days, SENASA-endorsed health certificate (no pre-trip permit). Uruguay: ISO microchip, rabies 30+ days, MGAP-recognised health certificate. Chile: most rigorous — SAG import permit must be pre-arranged 30+ days ahead, ISO microchip mandatory. Peru: SENASA import permit + health certificate. Colombia: ICA inspection on arrival, banned breed check (Pit Bull / AmStaff / Staffordshire all refused).",
        cost: "Vet visits + USDA/origin endorsement: $200–$500 depending on country. Import permits: typically free or $20–50.",
      },
    ],
    paperwork: "Brazil: rabies vaccine 21+ days old, USDA-endorsed health certificate within 10 days, parasite treatment, additional vaccines (Distemper/Hepatitis/Parvovirus/Leptospirosis for dogs; FVRCP for cats). No microchip required. Argentina/Uruguay/Chile/Peru: ISO microchip, rabies 30+ days, official veterinary authority health certificate (SENASA-endorsed for Argentina/Peru, MGAP-recognised for Uruguay, SAG import permit pre-arranged 30+ days ahead for Chile). Colombia: ICA inspection on arrival, ISO microchip recommended, banned breeds (Pit Bull, Staffordshire, American Staffordshire) refused entry by law. All countries: pets must be 4+ months old for international cabin travel. Returning to the US: standard CDC Dog Import Form for dogs (Brazil/Argentina/Uruguay/Chile/Peru/Colombia NOT on CDC high-risk list as of 2026).",
  },
];

function DifficultDestinations() {
  const [active, setActive] = useState("uk");
  const dest = DESTINATIONS.find((d) => d.id === active);

  return (
    <section id="destinations" className="py-20 px-6 md:px-12 bg-stone-100 border-t border-stone-300">
      <div className="max-w-5xl mx-auto">
        <SectionLabel num="IV.">Difficult destinations</SectionLabel>

        <h2 className="font-serif text-5xl text-stone-900 mb-4 max-w-3xl">
          Where the rules get strange — and how clever owners get through.
        </h2>
        <p className="font-serif italic text-stone-600 text-lg mb-12 max-w-2xl">
          Some countries don't allow pets in the cabin at all. Others allow it but make the paperwork punishing. Here's the real-world playbook for each.
        </p>

        <div className="flex flex-wrap gap-2 mb-10 pb-4 border-b border-stone-300">
          {DESTINATIONS.map((d) => (
            <button
              key={d.id}
              onClick={() => setActive(d.id)}
              className={`flex items-center gap-2 px-5 py-3 border transition-all ${
                active === d.id
                  ? "border-stone-900 bg-stone-900 text-stone-50"
                  : "border-stone-300 bg-white text-stone-700 hover:border-stone-900 hover:-translate-y-0.5"
              }`}
            >
              <span className="text-lg">{dest && d.id === active ? d.flag : d.flag}</span>
              <span className="font-serif">{d.name}</span>
            </button>
          ))}
        </div>

        {dest && (
          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-1">
              <div className="bg-stone-900 text-stone-50 p-8 sticky top-6">
                <div className="text-6xl mb-4">{dest.flag}</div>
                <h3 className="font-serif text-3xl mb-2">{dest.name}</h3>
                <div className="text-amber-500 font-serif italic mb-6">{dest.headline}</div>
                <p className="text-stone-300 leading-relaxed text-sm mb-6">{dest.rule}</p>
                <div className="pt-6 border-t border-stone-700">
                  <div className="text-xs uppercase tracking-widest text-amber-500/80 mb-2">Required paperwork</div>
                  <p className="text-stone-400 text-sm leading-relaxed">{dest.paperwork}</p>
                </div>
              </div>
            </div>

            <div className="lg:col-span-2">
              <div className="text-xs uppercase tracking-widest text-stone-500 mb-6">The workarounds</div>
              <div className="space-y-6">
                {dest.workarounds.map((w, i) => (
                  <div key={i} className="bg-stone-50 border border-stone-300 p-7 hover:shadow-md transition-shadow">
                    <div className="flex items-baseline gap-3 mb-3">
                      <span className="font-serif italic text-stone-400 text-lg">{String(i + 1).padStart(2, "0")}</span>
                      <div className="w-7 h-7 rounded-full bg-amber-700 text-stone-50 flex items-center justify-center flex-shrink-0">
                        {w.icon}
                      </div>
                      <h4 className="font-serif text-2xl text-stone-900">{w.title}</h4>
                    </div>
                    <p className="text-stone-700 leading-relaxed mb-4 ml-10">{w.body}</p>
                    {w.cost && w.cost !== "—" && (
                      <div className="ml-10 inline-block px-3 py-1.5 bg-stone-900 text-stone-50 text-xs uppercase tracking-widest">
                        {w.cost}
                      </div>
                    )}
                  </div>
                ))}
                {dest.id === "uk" && (
                  <a
                    href="/uk-pet-travel"
                    className="group block bg-amber-700 text-stone-50 p-7 hover:bg-amber-600 transition-colors"
                  >
                    <div className="text-xs uppercase tracking-widest text-amber-200 mb-2">The full guide</div>
                    <h4 className="font-serif text-2xl mb-2 group-hover:underline">
                      Read the complete UK pet travel guide →
                    </h4>
                    <p className="text-amber-50/90 leading-relaxed text-sm">
                      Why pets can't fly cabin into the UK, every workaround route explained in full, what it costs, and the exact paperwork — all on one page.
                    </p>
                  </a>
                )}
                {dest.id === "india" && (
                  <a
                    href="/india-pet-travel"
                    className="group block bg-amber-700 text-stone-50 p-7 hover:bg-amber-600 transition-colors"
                  >
                    <div className="text-xs uppercase tracking-widest text-amber-200 mb-2">The full guide</div>
                    <h4 className="font-serif text-2xl mb-2 group-hover:underline">
                      Read the complete India pet travel guide →
                    </h4>
                    <p className="text-amber-50/90 leading-relaxed text-sm">
                      The AQCS NOC process, the 2-year residency rule, six approved entry airports, Air India Paws on Board cabin routes, and the CDC high-risk paperwork for the US — all on one page.
                    </p>
                  </a>
                )}
                {dest.id === "norway" && (
                  <a
                    href="/oslo-pet-travel"
                    className="group block bg-amber-700 text-stone-50 p-7 hover:bg-amber-600 transition-colors"
                  >
                    <div className="text-xs uppercase tracking-widest text-amber-200 mb-2">The full guide</div>
                    <h4 className="font-serif text-2xl mb-2 group-hover:underline">
                      Read the complete Norway pet travel guide →
                    </h4>
                    <p className="text-amber-50/90 leading-relaxed text-sm">
                      SAS and Norwegian cabin pets, the 24–120 hour tapeworm window, seven banned breeds, Oslo-only entry, and EEA paperwork — all on one page.
                    </p>
                  </a>
                )}
                {dest.id === "japan" && (
                  <a
                    href="/japan-pet-travel"
                    className="group block bg-amber-700 text-stone-50 p-7 hover:bg-amber-600 transition-colors"
                  >
                    <div className="text-xs uppercase tracking-widest text-amber-200 mb-2">The full guide</div>
                    <h4 className="font-serif text-2xl mb-2 group-hover:underline">
                      Read the complete Japan pet travel guide →
                    </h4>
                    <p className="text-amber-50/90 leading-relaxed text-sm">
                      The 7-month timeline, FAVN titer and 180-day wait, AQS Advance Notification, three cabin pet paths (United, Korean carriers, Aeromexico), and 11 approved entry ports — all on one page.
                    </p>
                  </a>
                )}
                {dest.id === "south-america" && (
                  <a
                    href="/south-america-pet-travel"
                    className="group block bg-amber-700 text-stone-50 p-7 hover:bg-amber-600 transition-colors"
                  >
                    <div className="text-xs uppercase tracking-widest text-amber-200 mb-2">The full guide</div>
                    <h4 className="font-serif text-2xl mb-2 group-hover:underline">
                      Read the complete South America pet travel guide →
                    </h4>
                    <p className="text-amber-50/90 leading-relaxed text-sm">
                      Country-by-country import rules for Brazil, Argentina, Chile, Peru, and Colombia. LATAM and Avianca cabin pet networks, banned breeds, and the easy-vs-hard country ranking — all on one page.
                    </p>
                  </a>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

function AirlineGrid() {
  const [expanded, setExpanded] = useState(null);
  const [filter, setFilter] = useState("all");

  // Comparison feature — users can select up to 4 airlines via a checkbox
  // in the card corner; a floating action button reveals a modal with all
  // selected airlines rendered side-by-side. Maintained as a Set of airline
  // names for O(1) lookup; rendering pulls from AIRLINES by name.
  const COMPARE_MAX = 4;
  const [compareSelected, setCompareSelected] = useState(() => new Set());
  const [compareOpen, setCompareOpen] = useState(false);
  // Sort order for the cards inside the compare modal. "picked" keeps the
  // order the user selected them in; the others rank by weight or carrier.
  const [compareSort, setCompareSort] = useState("picked");

  function toggleCompare(name) {
    setCompareSelected((prev) => {
      const next = new Set(prev);
      if (next.has(name)) {
        next.delete(name);
      } else if (next.size < COMPARE_MAX) {
        next.add(name);
      }
      return next;
    });
  }

  function clearCompare() {
    setCompareSelected(new Set());
    setCompareOpen(false);
  }

  // Open the compare modal — also fires a GA4 event so we can see how
  // often visitors use this feature and with how many airlines.
  function openCompare() {
    if (compareSelected.size < 2) return;
    if (typeof window !== "undefined" && window.gtag) {
      window.gtag("event", "airline_comparison_opened", {
        event_category: "engagement",
        airline_count: compareSelected.size,
        airlines: Array.from(compareSelected).join(", "),
      });
    }
    setCompareOpen(true);
  }

  // Resolve selected airlines to full airline objects, preserving the order
  // they were added (Set preserves insertion order in JS).
  const compareAirlines = useMemo(
    () => Array.from(compareSelected).map((name) => AIRLINES.find((a) => a.name === name)).filter(Boolean),
    [compareSelected]
  );

  // --- Sort helpers for the compare modal ---
  // Parse a cabin weight limit (kg) from an airline's free-text weight field.
  // Airlines with no published cap ("must fit carrier") return null and are
  // sorted to the end, since their limit is judged by carrier fit not weight.
  function parseCompareWeightKg(s) {
    if (!s) return null;
    if (/no stated weight|no weight limit|must fit comfortably/i.test(s)) return null;
    const kg = s.match(/(\d+(?:\.\d+)?)\s*kg/i);
    if (kg) return parseFloat(kg[1]);
    const lb = s.match(/(\d+(?:\.\d+)?)\s*lb/i);
    if (lb) return Math.round(parseFloat(lb[1]) * 0.453592 * 10) / 10;
    return null;
  }

  // Parse the largest carrier volume (cm³) from the carrier field. We take
  // the FIRST/standard under-seat dimension set — not buy-an-extra-seat
  // options — by using the smallest-listed set when several appear, except
  // we just take the first cm match which is the standard one in our data.
  function parseCompareCarrierVol(s) {
    if (!s) return 0;
    const cm = s.match(/(\d+(?:\.\d+)?)\s*[×x]\s*(\d+(?:\.\d+)?)\s*[×x]\s*(\d+(?:\.\d+)?)\s*cm/i);
    if (cm) return parseFloat(cm[1]) * parseFloat(cm[2]) * parseFloat(cm[3]);
    const inch = s.match(/(\d+(?:\.\d+)?)\s*[×x]\s*(\d+(?:\.\d+)?)\s*[×x]\s*(\d+(?:\.\d+)?)\s*in/i);
    if (inch) return parseFloat(inch[1]) * 2.54 * parseFloat(inch[2]) * 2.54 * parseFloat(inch[3]) * 2.54;
    return 0;
  }

  // The cards actually rendered in the modal, in the chosen sort order.
  const sortedCompareAirlines = useMemo(() => {
    const list = [...compareAirlines];
    if (compareSort === "weight") {
      list.sort((a, b) => {
        const wa = parseCompareWeightKg(a.weight);
        const wb = parseCompareWeightKg(b.weight);
        // null (no cap) sorts to the end
        if (wa === null && wb === null) return 0;
        if (wa === null) return 1;
        if (wb === null) return -1;
        return wb - wa; // heaviest first
      });
    } else if (compareSort === "carrier") {
      list.sort((a, b) => parseCompareCarrierVol(b.carrier) - parseCompareCarrierVol(a.carrier));
    }
    // "picked" → leave in selection order
    return list;
  }, [compareAirlines, compareSort]);

  // Close compare modal on Escape — basic accessibility.
  useEffect(() => {
    if (!compareOpen) return;
    function onKey(e) {
      if (e.key === "Escape") setCompareOpen(false);
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [compareOpen]);

  // Cabin from/to flag rows — shared between the airline card and the
  // compare modal so visitors get consistent visual cues in both places.
  // CABIN_COUNTRIES is the ordered list of regions we surface; CabinFlags
  // draws one flag per region with a ✓ or ✗ and a tooltip on hover.
  const CABIN_COUNTRIES = [
    { code: "uk", flag: "🇬🇧", label: "UK" },
    { code: "us", flag: "🇺🇸", label: "US" },
    { code: "canada", flag: "🇨🇦", label: "Canada" },
    { code: "eu", flag: "🇪🇺", label: "EU" },
    { code: "mexico", flag: "🇲🇽", label: "Mexico" },
    { code: "south-america", flag: "🇧🇷", label: "South America" },
    { code: "central-america", flag: "🇵🇦", label: "Central America" },
    { code: "caribbean", flag: "🇧🇸", label: "Caribbean" },
    { code: "india", flag: "🇮🇳", label: "India" },
    { code: "uae", flag: "🇦🇪", label: "UAE" },
    { code: "japan", flag: "🇯🇵", label: "Japan" },
    { code: "korea", flag: "🇰🇷", label: "South Korea" },
  ];

  function CabinFlags({ airline, compact = false }) {
    if (!airline.originAllowed || Object.keys(airline.originAllowed).length === 0) return null;
    const labelW = compact ? "w-[60px]" : "w-[72px]";
    const flagSize = compact ? "text-base" : "text-lg";
    const renderFlag = (c, statusObj) => {
      const status = statusObj[c.code];
      if (!status) return null;
      const isYes = status === "yes";
      return (
        <span
          key={c.code}
          className={`relative inline-flex items-center gap-0.5 cursor-help group/flag ${isYes ? "text-emerald-700" : "text-red-600"}`}
        >
          <span className={`${flagSize} leading-none`}>{c.flag}</span>
          <span className="font-bold text-xs">{isYes ? "✓" : "✗"}</span>
          <span className="pointer-events-none absolute -top-7 left-1/2 -translate-x-1/2 bg-stone-900 text-stone-50 text-[10px] font-medium uppercase tracking-wider px-2 py-1 rounded-sm whitespace-nowrap opacity-0 group-hover/flag:opacity-100 transition-opacity duration-75 z-10">
            {c.label}
          </span>
        </span>
      );
    };
    return (
      <div className="space-y-2">
        <div className="flex items-start gap-x-2">
          <span className={`text-[10px] uppercase tracking-widest text-stone-500 font-medium ${labelW} flex-shrink-0 pt-1`}>Cabin from:</span>
          <div className="flex flex-wrap gap-x-2.5 gap-y-1 flex-1">
            {CABIN_COUNTRIES.map((c) => renderFlag(c, airline.originAllowed))}
          </div>
        </div>
        {airline.destinationAllowed && (
          <div className="flex items-start gap-x-2">
            <span className={`text-[10px] uppercase tracking-widest text-stone-500 font-medium ${labelW} flex-shrink-0 pt-1`}>Cabin to:</span>
            <div className="flex flex-wrap gap-x-2.5 gap-y-1 flex-1">
              {CABIN_COUNTRIES.map((c) => renderFlag(c, airline.destinationAllowed))}
            </div>
          </div>
        )}
      </div>
    );
  }

  const FILTERS = [
    { id: "all", label: "All airlines", flag: "" },
    { id: "uk-out", label: "Out of UK", flag: "🇬🇧" },
    { id: "into-uk-ie", label: "Into UK / Ireland", flag: "🇬🇧" },
    { id: "into-au-nz", label: "Into Australia / NZ", flag: "🇦🇺" },
    { id: "us", label: "US", flag: "🇺🇸" },
    { id: "india", label: "India", flag: "🇮🇳" },
    { id: "europe", label: "Europe", flag: "🇪🇺" },
    { id: "canada", label: "Canada", flag: "🇨🇦" },
    { id: "mexico", label: "Mexico", flag: "🇲🇽" },
    { id: "dubai", label: "Dubai / UAE", flag: "🇦🇪" },
    { id: "caribbean", label: "Caribbean", flag: "🇧🇸" },
    { id: "south-america", label: "South America", flag: "🇧🇷" },
    { id: "central-america", label: "Central America", flag: "🇵🇦" },
    { id: "japan", label: "Japan", flag: "🇯🇵" },
    { id: "korea", label: "South Korea", flag: "🇰🇷" },
    { id: "south-africa", label: "South Africa", flag: "🇿🇦" },
  ];

  // The "Into UK / Ireland" and "Into Australia / NZ" filters are special —
  // no airline flies pets in cabin into any of those countries, so instead
  // of an (empty) airline grid we show a dedicated explainer card.
  const isIntoUkIe = filter === "into-uk-ie";
  const isIntoAuNz = filter === "into-au-nz";
  const isSpecialFilter = isIntoUkIe || isIntoAuNz;

  const filteredAirlines = filter === "all"
    ? AIRLINES
    : AIRLINES.filter((a) =>
        (a.tags && a.tags.includes(filter)) || a.scope === filter
      );

  return (
    <section id="airlines" className="py-20 px-6 md:px-12 bg-stone-100 border-y border-stone-300">
      <div className="max-w-5xl mx-auto">
        <SectionLabel num="III.">Airline pet policies</SectionLabel>

        <h2 className="font-serif text-5xl text-stone-900 mb-4 max-w-3xl">
          Pets in cabin: the policy for every major airline.
        </h2>
        <p className="font-serif italic text-stone-600 text-lg mb-8 max-w-2xl">
          Thirty-two airlines, one place. Tap any carrier to see fees, weight rules, carrier dimensions, and the fine print most travellers miss.
        </p>

        <div className="bg-amber-50 border-l-2 border-amber-500 px-5 py-4 mb-4 max-w-3xl">
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" strokeWidth={1.75} />
            <div>
              <div className="font-serif text-stone-900 mb-1">Direction matters more than people realise.</div>
              <p className="text-stone-700 text-sm leading-relaxed">
                Several airlines (especially Air Canada and Air Transat) allow pets in cabin in <strong>one direction but not the other</strong> — usually because of the destination country's rules, not the airline's. For example: pets <em>can</em> fly cabin OUT of the UK on Air Canada, but cannot fly cabin INTO the UK with any airline (UK government rule). Tap any card to see direction-specific rules in the "Direction matters" section.
              </p>
            </div>
          </div>
        </div>

        <p className="text-stone-500 text-xs italic font-serif mb-8 max-w-3xl">
          Airline policies change quietly. Each card shows when I last verified it — confirm with the airline before booking. <a href="#contact" className="underline decoration-rose-400 underline-offset-4 hover:text-rose-600 transition-colors">Tell me</a> if something looks out of date.
        </p>

        {/* Filter chips for the airline grid. */}
        <div className="mb-6">
          <div className="flex items-center justify-between gap-3 mb-3 flex-wrap">
            <div className="text-xs uppercase tracking-widest text-stone-500">Filter by route</div>
            {!isSpecialFilter && (
              <div className="text-stone-500 text-xs italic font-serif">
                Showing {filteredAirlines.length} of {AIRLINES.length}
              </div>
            )}
          </div>
          <div className="flex flex-wrap gap-2">
            {FILTERS.map((f) => {
              const isActive = filter === f.id;
              return (
                <button
                  key={f.id}
                  onClick={() => {
                    setFilter(f.id);
                    // GA4 — track which route filter people pick in the
                    // Airlines section.
                    if (typeof window !== "undefined" && window.gtag) {
                      window.gtag("event", "airline_filter_selected", {
                        event_category: "airlines_section",
                        filter: f.id,
                        filter_label: f.label,
                      });
                    }
                  }}
                  className={`px-4 py-2 text-sm transition-all border ${
                    isActive
                      ? "bg-stone-900 text-stone-50 border-stone-900"
                      : "bg-white text-stone-700 border-stone-300 hover:border-stone-900"
                  }`}
                >
                  {f.flag && <span className="mr-1.5">{f.flag}</span>}
                  <span className="font-serif">{f.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {isSpecialFilter ? (
          isIntoUkIe ? (
          /* Special explainer card — the UK and Ireland both ban cabin pets
             on arrival, so there are genuinely no airlines to list. Instead
             we explain the workaround and signpost the detailed pages. */
          <div className="bg-white border-2 border-amber-300 rounded-sm overflow-hidden">
            <div className="bg-stone-900 text-stone-50 px-6 py-5">
              <div className="text-xs uppercase tracking-[0.25em] text-amber-300 mb-1.5">Into the UK or Ireland</div>
              <h3 className="font-serif text-2xl md:text-3xl leading-tight">
                No airline flies pets in cabin into the UK or Ireland.
              </h3>
            </div>
            <div className="p-6 md:p-8 space-y-5">
              <p className="font-serif text-lg text-stone-800 leading-relaxed">
                This isn't an airline policy you can shop around — it's a UK and Irish government rule. Every pet entering either country by air must travel as <strong>manifested cargo</strong>, never in the cabin. But there's a well-trodden cabin workaround that thousands of people use every year.
              </p>

              <div className="bg-amber-50 border-l-2 border-amber-500 px-5 py-4">
                <div className="font-serif text-xl text-stone-900 mb-2">The cabin workaround — fly to the continent, then cross by land</div>
                <p className="text-stone-700 leading-relaxed text-sm">
                  Fly your pet in cabin into <strong>Paris (CDG)</strong>, <strong>Amsterdam (AMS)</strong>, or <strong>Frankfurt (FRA)</strong> — Air France, KLM, and Lufthansa all take cabin pets on those routes. Then complete the journey overland, with your pet staying with you the whole way.
                </p>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="border border-stone-200 p-4 rounded-sm">
                  <div className="text-[10px] uppercase tracking-widest text-amber-700 mb-1">Into the UK</div>
                  <div className="font-serif text-base text-stone-900 mb-1">
                    <a href="https://www.leshuttle.com/uk-en/travelling-with-us/travelling-with-pets" target="_blank" rel="noopener noreferrer" className="text-amber-700 underline decoration-amber-300 underline-offset-2 hover:text-amber-800 transition-colors">LeShuttle (Eurotunnel)</a>
                  </div>
                  <p className="text-stone-600 text-sm leading-relaxed">
                    Calais → Folkestone in about 35 minutes. Your pet stays in your car for the entire crossing — no carrier, no hold, no separation. Pets travel from around £24 each way; check current fares and the pet check-in process on the official page. Pet-friendly ferries (Dover–Calais) are the alternative.
                  </p>
                </div>
                <div className="border border-stone-200 p-4 rounded-sm">
                  <div className="text-[10px] uppercase tracking-widest text-amber-700 mb-1">Into Ireland</div>
                  <div className="font-serif text-base text-stone-900 mb-1">Direct ferry from France</div>
                  <p className="text-stone-600 text-sm leading-relaxed">
                    Cherbourg or Roscoff → Rosslare or Dublin on <a href="https://www.irishferries.com/uk-en/frequently-asked-questions/pet-travel-all-routes/" target="_blank" rel="noopener noreferrer" className="text-amber-700 underline decoration-amber-300 underline-offset-2 hover:text-amber-800 transition-colors">Irish Ferries</a> or <a href="https://www.brittany-ferries.ie/information/pet-travel/travelling-by-ferry-with-your-pet" target="_blank" rel="noopener noreferrer" className="text-amber-700 underline decoration-amber-300 underline-offset-2 hover:text-amber-800 transition-colors">Brittany Ferries</a>. Pets stay in your vehicle or a pet-friendly cabin. This avoids the UK landbridge entirely.
                  </p>
                </div>
              </div>

              <p className="text-stone-600 text-sm leading-relaxed italic font-serif">
                Realistic timings: a continental flight plus the onward land/sea leg usually means a full travel day, sometimes with an overnight near the port. Crossing fares vary by season and how far ahead you book — check current pricing directly with <a href="https://www.leshuttle.com/uk-en/travelling-with-us/travelling-with-pets" target="_blank" rel="noopener noreferrer" className="text-amber-700 underline decoration-amber-300 underline-offset-2 hover:text-amber-800 transition-colors not-italic">LeShuttle</a> or the ferry operator. The detailed guides below break down the full route, paperwork order, and what to expect.
              </p>

              {/* Signpost CTAs to the detailed pages — the card is the catch,
                  these pages carry the depth. */}
              <div className="flex flex-wrap gap-3 pt-2">
                <a href="/uk-pet-travel" className="inline-flex items-center gap-2 bg-amber-600 hover:bg-amber-500 text-white px-4 py-2.5 text-sm font-medium transition-colors">
                  Full UK guide →
                </a>
                <a href="#destinations" className="inline-flex items-center gap-2 text-amber-700 hover:text-amber-800 text-sm font-medium border-b border-amber-300 hover:border-amber-700 transition-colors">
                  Difficult Destinations: UK →
                </a>
                <a href="#planner" className="inline-flex items-center gap-2 text-amber-700 hover:text-amber-800 text-sm font-medium border-b border-amber-300 hover:border-amber-700 transition-colors">
                  Plan this route in the Journey Planner →
                </a>
              </div>

              <p className="text-stone-500 text-xs leading-relaxed border-t border-stone-200 pt-4">
                Flying <em>out</em> of the UK or Ireland? That's straightforward — many airlines take cabin pets outbound. Switch to the <button onClick={() => setFilter("uk-out")} className="text-amber-700 underline decoration-amber-300 underline-offset-2 hover:text-amber-800 transition-colors">"Out of UK"</button> filter to see them.
              </p>
            </div>
          </div>
          ) : (
          /* Australia / New Zealand — cargo-only with mandatory quarantine.
             Unlike the UK there is genuinely NO cabin workaround, so this
             card is an honest reality-check that signposts the detailed
             Difficult Destinations entries rather than promising a shortcut. */
          <div className="bg-white border-2 border-rose-300 rounded-sm overflow-hidden">
            <div className="bg-stone-900 text-stone-50 px-6 py-5">
              <div className="text-xs uppercase tracking-[0.25em] text-rose-300 mb-1.5">Into Australia or New Zealand</div>
              <h3 className="font-serif text-2xl md:text-3xl leading-tight">
                Cargo only — and there's no cabin workaround.
              </h3>
            </div>
            <div className="p-6 md:p-8 space-y-5">
              <p className="font-serif text-lg text-stone-800 leading-relaxed">
                Australia and New Zealand treat incoming pets as biosecurity risks. Every pet must arrive as <strong>manifested cargo</strong> and complete a <strong>minimum 10-day government quarantine</strong> on arrival. There is no in-cabin option on any commercial flight — and unlike the UK, there's no clever continent-hop that gets around it. This is the hard reality, not a route to optimise.
              </p>

              <div className="bg-rose-50 border-l-2 border-rose-400 px-5 py-4">
                <div className="font-serif text-xl text-stone-900 mb-2">What the journey actually involves</div>
                <p className="text-stone-700 leading-relaxed text-sm">
                  An import permit applied for <strong>months</strong> in advance, a rabies blood test (RNATT) drawn at least 180 days before arrival, multiple parasite treatments, an endorsed export certificate, and a pre-booked quarantine place. Most carriers (Qantas, Air New Zealand) won't even take a live-animal cargo booking directly from the public — you'll need an IPATA-registered pet shipper. Realistically a 6-month project.
                </p>
              </div>

              <p className="text-stone-600 text-sm leading-relaxed italic font-serif">
                One genuine nuance: pets that have lived in New Zealand for 6+ months can enter Australia without quarantine, and vice-versa — but that only helps actual NZ/AU residents, not as a shortcut for a move from elsewhere. The full breakdown — costs, the permit process, approved shippers — is in the Difficult Destinations section.
              </p>

              <div className="flex flex-wrap gap-3 pt-2">
                <a href="#destinations" className="inline-flex items-center gap-2 bg-rose-600 hover:bg-rose-500 text-white px-4 py-2.5 text-sm font-medium transition-colors">
                  Difficult Destinations: Australia & NZ →
                </a>
                <a href="#planner" className="inline-flex items-center gap-2 text-rose-700 hover:text-rose-800 text-sm font-medium border-b border-rose-300 hover:border-rose-700 transition-colors">
                  Plan your route →
                </a>
              </div>

              <p className="text-stone-500 text-xs leading-relaxed border-t border-stone-200 pt-4">
                Flying <em>out</em> of Australia or NZ? That's far simpler — switch to <button onClick={() => setFilter("all")} className="text-rose-700 underline decoration-rose-300 underline-offset-2 hover:text-rose-800 transition-colors">"All airlines"</button> and check your destination's rules instead.
              </p>
            </div>
          </div>
          )
        ) : (
        <div className="grid md:grid-cols-2 gap-px bg-stone-300 border border-stone-300">
          {filteredAirlines.map((a, i) => {
            const open = expanded === a.name;
            const allowsCabin = a.cabinStatus !== "no";
            const badgeStyle = allowsCabin
              ? "bg-emerald-100 text-emerald-800 border-emerald-300"
              : "bg-rose-100 text-rose-800 border-rose-300";
            const badgeText = allowsCabin ? "✓ Cabin allowed" : "✗ No cabin";
            const isCompareSelected = compareSelected.has(a.name);
            const canSelectMore = compareSelected.size < COMPARE_MAX;
            return (
              <div key={a.name} className="bg-stone-50 relative">
                {/* Compare checkbox — positioned absolutely so it doesn't
                    sit inside the expand button. Clicking it toggles the
                    airline in/out of the selection without expanding the
                    card. Disabled state when 4 already selected. */}
                <label
                  className={`absolute top-3 right-3 z-10 flex items-center gap-1.5 px-2.5 py-1 text-[10px] uppercase tracking-widest border transition-colors cursor-pointer select-none ${
                    isCompareSelected
                      ? "bg-amber-700 text-stone-50 border-amber-700"
                      : canSelectMore
                        ? "bg-white text-stone-600 border-stone-300 hover:border-amber-600 hover:text-amber-700"
                        : "bg-stone-100 text-stone-400 border-stone-200 cursor-not-allowed"
                  }`}
                  onClick={(e) => e.stopPropagation()}
                >
                  <input
                    type="checkbox"
                    checked={isCompareSelected}
                    disabled={!isCompareSelected && !canSelectMore}
                    onChange={() => toggleCompare(a.name)}
                    aria-label={`Compare ${a.name}`}
                    className="sr-only"
                  />
                  <span aria-hidden="true">{isCompareSelected ? "✓" : "+"}</span>
                  <span>{isCompareSelected ? "Selected" : "Compare"}</span>
                </label>

                <button
                  onClick={() => setExpanded(open ? null : a.name)}
                  className="w-full text-left p-6 hover:bg-white transition-colors"
                >
                  <div className="flex items-baseline justify-between gap-4 mb-3 pr-24">
                    <h3 className="font-serif text-2xl text-stone-900">
                      {a.name}
                    </h3>
                    <span className="text-xs uppercase tracking-widest text-stone-500">
                      {open ? "Close" : "Details"}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 flex-wrap mb-3">
                    <span className={`inline-block px-2.5 py-1 text-xs uppercase tracking-widest font-medium border ${badgeStyle}`}>
                      {badgeText}
                    </span>
                    {a.scope === "domestic-only" && (
                      <span className="inline-block px-2.5 py-1 text-xs uppercase tracking-widest font-medium border bg-stone-100 text-stone-700 border-stone-300">
                        🇺🇸 US domestic only
                      </span>
                    )}
                    {a.scope === "north-america" && (
                      <span className="inline-block px-2.5 py-1 text-xs uppercase tracking-widest font-medium border bg-stone-100 text-stone-700 border-stone-300">
                        🌎 North America cabin
                      </span>
                    )}
                    {a.scope === "us-caribbean" && (
                      <span className="inline-block px-2.5 py-1 text-xs uppercase tracking-widest font-medium border bg-stone-100 text-stone-700 border-stone-300">
                        🌴 US + Caribbean only
                      </span>
                    )}
                    {a.scope === "hawaii-only" && (
                      <span className="inline-block px-2.5 py-1 text-xs uppercase tracking-widest font-medium border bg-stone-100 text-stone-700 border-stone-300">
                        🌺 Hawaii routes only
                      </span>
                    )}
                    {a.scope === "south-africa" && (
                      <span className="inline-block px-2.5 py-1 text-xs uppercase tracking-widest font-medium border bg-stone-100 text-stone-700 border-stone-300">
                        🇿🇦 South Africa · domestic only
                      </span>
                    )}
                  </div>
                  {/* Cabin from/to flag rows — shared CabinFlags component
                      (also used inside the comparison modal). Wrapped in a
                      div with the same spacing as the previous inline IIFE
                      so the visual cadence stays identical. */}
                  {a.originAllowed && Object.keys(a.originAllowed).length > 0 && (
                    <div className="mb-3 pb-3 border-b border-stone-200">
                      <CabinFlags airline={a} />
                    </div>
                  )}
                  {a.scope === "south-africa" && (
                    <div className="mb-3 pb-3 border-b border-stone-200">
                      <div className="flex items-start gap-2 text-sm text-stone-600">
                        <Info className="w-4 h-4 text-stone-400 flex-shrink-0 mt-0.5" strokeWidth={1.75} />
                        <span>
                          <strong className="text-stone-800">Domestic South Africa only.</strong> Small dogs under 7&nbsp;kg, in cabin, on Lift's dog-friendly routes (JNB · CPT · DUR · GRJ). No cats. There is <strong className="text-stone-800">no cabin option in or out of South Africa internationally</strong> on any airline — international pets travel as cargo.
                        </span>
                      </div>
                    </div>
                  )}
                  <div className="text-stone-600 text-sm">
                    <span className="font-medium text-stone-800">{a.fee}</span>
                  </div>

                  {open && (
                    <div className="mt-6 pt-6 border-t border-stone-300 space-y-4 animate-fadeIn">
                      <div>
                        <div className="text-xs uppercase tracking-widest text-stone-500 mb-1">Weight</div>
                        <div className="text-stone-800">{a.weight}</div>
                      </div>
                      <div>
                        <div className="text-xs uppercase tracking-widest text-stone-500 mb-1">Carrier</div>
                        <div className="text-stone-800">{a.carrier}</div>
                      </div>
                      {a.direction && (
                        <div className="bg-amber-50 border-l-2 border-amber-400 p-4">
                          <div className="text-xs uppercase tracking-widest text-amber-700 mb-2">Direction matters</div>
                          {(() => {
                            const text = a.direction;
                            const notAllowedMatch = text.match(/Cabin NOT allowed[^:]*:/i);
                            if (!notAllowedMatch) {
                              return <div className="text-stone-800 text-sm">{text}</div>;
                            }
                            const splitIdx = notAllowedMatch.index;
                            const allowedPart = text.substring(0, splitIdx).trim().replace(/\.$/, "");
                            const notAllowedPart = text.substring(splitIdx).trim();
                            return (
                              <div className="space-y-2">
                                <div className="flex gap-2 items-start text-sm">
                                  <span className="text-emerald-700 font-medium flex-shrink-0">✓</span>
                                  <span className="text-stone-800">{allowedPart}</span>
                                </div>
                                <div className="flex gap-2 items-start text-sm">
                                  <span className="text-rose-600 font-medium flex-shrink-0">✗</span>
                                  <span className="text-stone-800">{notAllowedPart}</span>
                                </div>
                              </div>
                            );
                          })()}
                        </div>
                      )}
                      <div>
                        <div className="text-xs uppercase tracking-widest text-stone-500 mb-1">Notes</div>
                        <div className="text-stone-800 italic font-serif">{a.notes}</div>
                      </div>
                      <div className="flex items-center justify-between flex-wrap gap-3 pt-3 border-t border-stone-200">
                        <span className="text-xs text-stone-500 italic">
                          Last verified: <span className="text-rose-600 not-italic font-medium">{a.verified}</span>
                        </span>
                        <a
                          href={a.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={(e) => e.stopPropagation()}
                          className="text-xs uppercase tracking-widest text-stone-700 hover:text-rose-600 transition-colors inline-flex items-center gap-1"
                        >
                          Official page
                          <ArrowRight className="w-3 h-3" />
                        </a>
                      </div>
                    </div>
                  )}
                </button>
              </div>
            );
          })}
        </div>
        )}

        {!isSpecialFilter && (
        <div className="mt-14 pt-10 border-t border-stone-300">
          <div className="flex items-baseline gap-3 mb-4">
            <span className="font-serif italic text-stone-400">✗</span>
            <span className="uppercase tracking-[0.25em] text-xs font-medium text-rose-600">Airlines without cabin pets</span>
            <div className="flex-1 h-px bg-stone-300" />
          </div>
          <p className="font-serif italic text-stone-600 mb-6 max-w-2xl">
            These airlines don't allow pets in the cabin — but people search for them all the time, so here's the truth. Cargo or different airline only.
          </p>
          <div className="grid md:grid-cols-2 gap-x-8 gap-y-4">
            {NO_CABIN_AIRLINES.map((a) => (
              <div key={a.name} className="flex items-start gap-3 py-3 border-b border-stone-200">
                <span className="inline-block px-2 py-0.5 text-xs uppercase tracking-widest font-medium bg-rose-100 text-rose-800 border border-rose-300 flex-shrink-0 mt-0.5">✗ No</span>
                <div className="flex-1">
                  <div className="font-serif text-stone-900 mb-1">{a.name}</div>
                  <div className="text-stone-600 text-sm leading-relaxed mb-1">{a.detail}</div>
                  <a
                    href={a.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs uppercase tracking-widest text-stone-500 hover:text-rose-600 transition-colors inline-flex items-center gap-1"
                  >
                    Official page <ArrowRight className="w-3 h-3" />
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
        )}

        <p className="text-stone-500 text-sm mt-6 italic font-serif">
          Policies change. Confirm with the airline before booking. Last full review: May 2026.
        </p>
      </div>

      {/* Floating compare action — sticky bottom-right; appears whenever 1+
          airlines are selected via the checkbox in each card. Mobile-safe:
          uses fixed positioning + safe-area-inset padding so it doesn't
          collide with the iOS home indicator. */}
      {compareSelected.size > 0 && (
        <div
          className="fixed bottom-6 right-6 z-40 flex items-center gap-3"
          style={{ paddingBottom: "env(safe-area-inset-bottom, 0)" }}
        >
          <button
            onClick={clearCompare}
            className="bg-white text-stone-600 border border-stone-300 hover:border-stone-500 hover:text-stone-900 px-3 py-2 text-xs uppercase tracking-widest font-medium transition-colors shadow-md"
            aria-label="Clear compare selection"
          >
            Clear
          </button>
          <button
            onClick={openCompare}
            disabled={compareSelected.size < 2}
            className={`px-5 py-3 text-sm uppercase tracking-widest font-medium shadow-lg transition-colors flex items-center gap-2 ${
              compareSelected.size < 2
                ? "bg-stone-400 text-stone-100 cursor-not-allowed"
                : "bg-amber-700 text-stone-50 hover:bg-amber-800"
            }`}
          >
            <span>
              {compareSelected.size < 2
                ? `Pick 1 more to compare (${compareSelected.size}/${COMPARE_MAX})`
                : `Compare ${compareSelected.size} airline${compareSelected.size === 1 ? "" : "s"}`}
            </span>
            {compareSelected.size >= 2 && <ArrowRight className="w-4 h-4" />}
          </button>
        </div>
      )}

      {/* Comparison modal — full-screen overlay, renders each selected
          airline's expanded card content in a horizontally-scrollable
          row (desktop: side-by-side; mobile: 1-up with horizontal scroll
          across cards). Closes on backdrop click, X button, or Escape. */}
      {compareOpen && compareAirlines.length >= 2 && (
        <div
          className="fixed inset-0 z-50 bg-stone-900/85 flex items-stretch md:items-center justify-center p-4 md:p-8 animate-fadeIn"
          onClick={() => setCompareOpen(false)}
          role="dialog"
          aria-label="Airline comparison"
        >
          <div
            className="bg-stone-50 max-w-7xl w-full max-h-[95vh] flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal header */}
            <div className="flex items-start justify-between gap-4 p-4 md:p-6 border-b border-stone-300 flex-shrink-0 flex-wrap">
              <div>
                <div className="text-xs uppercase tracking-widest text-amber-700 mb-1">Comparing {compareAirlines.length} airlines</div>
                <h3 className="font-serif text-2xl md:text-3xl text-stone-900">Side by side</h3>
              </div>
              <div className="flex items-center gap-3">
                {/* Sort control — re-orders the cards within the modal. Useful
                    for the "is my dog too big?" question: sort by weight limit
                    or carrier size to see which of your picks is roomiest. */}
                <div className="flex items-center gap-1.5">
                  <label htmlFor="compare-sort" className="text-[10px] uppercase tracking-widest text-stone-500">Sort</label>
                  <select
                    id="compare-sort"
                    value={compareSort}
                    onChange={(e) => setCompareSort(e.target.value)}
                    className="text-xs bg-white border border-stone-300 px-2 py-1.5 text-stone-700 focus:border-amber-600 focus:outline-none"
                  >
                    <option value="picked">As selected</option>
                    <option value="weight">Heaviest pet allowed</option>
                    <option value="carrier">Largest carrier</option>
                  </select>
                </div>
                <button
                  onClick={() => setCompareOpen(false)}
                  className="p-2 hover:bg-stone-200 transition-colors"
                  aria-label="Close comparison"
                >
                  <X className="w-5 h-5 text-stone-700" strokeWidth={2} />
                </button>
              </div>
            </div>

            {/* Modal body — horizontal scroll on mobile, grid on desktop */}
            <div className="flex-1 overflow-auto p-4 md:p-6">
              <div
                className="grid gap-4 md:gap-6"
                style={{
                  gridTemplateColumns: `repeat(${sortedCompareAirlines.length}, minmax(280px, 1fr))`,
                }}
              >
                {sortedCompareAirlines.map((a) => {
                  const allowsCabin = a.cabinStatus !== "no";
                  const badgeStyle = allowsCabin
                    ? "bg-emerald-100 text-emerald-800 border-emerald-300"
                    : "bg-rose-100 text-rose-800 border-rose-300";
                  const badgeText = allowsCabin ? "✓ Cabin allowed" : "✗ No cabin";
                  return (
                    <div key={a.name} className="bg-white border border-stone-200 p-4 md:p-5 flex flex-col">
                      <div className="flex items-start justify-between gap-2 mb-3">
                        <h4 className="font-serif text-xl text-stone-900 leading-tight">{a.name}</h4>
                        <button
                          onClick={() => toggleCompare(a.name)}
                          className="text-[10px] uppercase tracking-widest text-stone-400 hover:text-rose-600 transition-colors flex-shrink-0"
                          aria-label={`Remove ${a.name} from comparison`}
                        >
                          Remove
                        </button>
                      </div>

                      <span className={`inline-block px-2.5 py-1 text-[10px] uppercase tracking-widest font-medium border self-start mb-4 ${badgeStyle}`}>
                        {badgeText}
                      </span>

                      <div className="space-y-3 text-sm">
                        {/* Cabin from/to flag rows — same visual as on the
                            homepage airline cards. Compact spacing for the
                            tighter modal column width. */}
                        <CabinFlags airline={a} compact />
                        <div className="border-t border-stone-200 pt-3">
                          <div className="text-[10px] uppercase tracking-widest text-amber-700 mb-1">Weight</div>
                          <div className="text-stone-800">{a.weight || "—"}</div>
                        </div>
                        <div>
                          <div className="text-[10px] uppercase tracking-widest text-amber-700 mb-1">Carrier</div>
                          <div className="text-stone-800">{a.carrier || "—"}</div>
                        </div>
                        <div>
                          <div className="text-[10px] uppercase tracking-widest text-amber-700 mb-1">Fee</div>
                          <div className="text-stone-800">{a.fee || "—"}</div>
                        </div>
                        <div>
                          <div className="text-[10px] uppercase tracking-widest text-amber-700 mb-1">International cabin</div>
                          <div className="text-stone-800">{a.intl || "—"}</div>
                        </div>
                        {a.direction && (
                          <div className="bg-amber-50 border-l-2 border-amber-400 p-3">
                            <div className="text-[10px] uppercase tracking-widest text-amber-700 mb-1">Direction matters</div>
                            <div className="text-stone-800 text-xs leading-relaxed">{a.direction}</div>
                          </div>
                        )}
                        <div>
                          <div className="text-[10px] uppercase tracking-widest text-amber-700 mb-1">Notes</div>
                          <div className="text-stone-700 italic font-serif text-sm leading-relaxed">{a.notes}</div>
                        </div>
                      </div>

                      <div className="mt-4 pt-3 border-t border-stone-200 flex items-center justify-between gap-2">
                        <span className="text-[10px] text-stone-500">Verified {a.verified}</span>
                        <a
                          href={a.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[10px] uppercase tracking-widest text-amber-700 hover:text-amber-800 underline decoration-amber-300 underline-offset-2"
                        >
                          Official ↗
                        </a>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Modal footer */}
            <div className="border-t border-stone-300 p-4 md:p-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 flex-shrink-0">
              <p className="text-xs text-stone-500 italic font-serif">
                Tip: carrier dimensions can differ enough that a carrier accepted by one airline is refused by another. Buy for the strictest spec.
              </p>
              <div className="flex gap-2 flex-shrink-0">
                <button
                  onClick={clearCompare}
                  className="px-4 py-2 text-xs uppercase tracking-widest text-stone-600 border border-stone-300 hover:border-stone-500 hover:text-stone-900 transition-colors"
                >
                  Clear all
                </button>
                <button
                  onClick={() => setCompareOpen(false)}
                  className="px-4 py-2 text-xs uppercase tracking-widest bg-stone-900 text-stone-50 hover:bg-stone-700 transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

/* ============================================================
   TAPEWORM TREATMENT WINDOW CALCULATOR
   ------------------------------------------------------------
   Shared by the Journey Planner and the Checklist tool.
   Rule: dogs entering UK/IE/NO/MT/FI need a vet-administered,
   vet-recorded praziquantel treatment 24–120h before arrival.
   ============================================================ */

const TW_TZ = {
  "UK": { label: "UK time",       std: 0,    dst: 60,   dstZone: "eu" },
  "IE": { label: "Ireland time",  std: 0,    dst: 60,   dstZone: "eu" },
  "NO": { label: "Norway time",   std: 60,   dst: 120,  dstZone: "eu" },
  "MT": { label: "Malta time",    std: 60,   dst: 120,  dstZone: "eu" },
  "FI": { label: "Finland time",  std: 120,  dst: 180,  dstZone: "eu" },
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

function twNthSunday(year, monthIdx, n) {
  if (n === -1) {
    const last = new Date(Date.UTC(year, monthIdx + 1, 0));
    return last.getUTCDate() - last.getUTCDay();
  }
  const first = new Date(Date.UTC(year, monthIdx, 1));
  const offset = (7 - first.getUTCDay()) % 7;
  return 1 + offset + (n - 1) * 7;
}

function twIsDST(utcDate, dstZone) {
  if (dstZone === "none") return false;
  const y = utcDate.getUTCFullYear();
  const t = utcDate.getTime();
  if (dstZone === "eu") {
    const start = Date.UTC(y, 2, twNthSunday(y, 2, -1), 1, 0, 0);
    const end   = Date.UTC(y, 9, twNthSunday(y, 9, -1), 1, 0, 0);
    return t >= start && t < end;
  }
  if (dstZone === "us") {
    const stdOffMin = -300;
    const start = Date.UTC(y, 2, twNthSunday(y, 2, 2), 2, 0, 0) - stdOffMin * 60000;
    const end   = Date.UTC(y, 10, twNthSunday(y, 10, 1), 2, 0, 0) - stdOffMin * 60000;
    return t >= start && t < end;
  }
  if (dstZone === "au") {
    const stdOffMin = 600;
    const start = Date.UTC(y, 9, twNthSunday(y, 9, 1), 2, 0, 0) - stdOffMin * 60000;
    const end   = Date.UTC(y, 3, twNthSunday(y, 3, 1), 3, 0, 0) - stdOffMin * 60000;
    return t >= start || t < end;
  }
  return false;
}

function twOffsetFor(tzKey, utcDate) {
  const z = TW_TZ[tzKey];
  if (!z) return 0;
  return twIsDST(utcDate, z.dstZone) ? z.dst : z.std;
}

function twCalcWindow(arrivalLocal, destTZ) {
  if (!arrivalLocal) return null;
  const naive = new Date(arrivalLocal + ":00Z");
  if (isNaN(naive.getTime())) return null;
  let destOff = twOffsetFor(destTZ, naive);
  let arrivalUTC = new Date(naive.getTime() - destOff * 60000);
  destOff = twOffsetFor(destTZ, arrivalUTC);
  arrivalUTC = new Date(naive.getTime() - destOff * 60000);
  const HOUR = 3600000;
  return {
    arrivalUTC,
    earliestUTC: new Date(arrivalUTC.getTime() - 120 * HOUR),
    latestUTC: new Date(arrivalUTC.getTime() - 24 * HOUR),
  };
}

function twFmtInTZ(utcDate, tzKey) {
  const off = twOffsetFor(tzKey, utcDate);
  const shifted = new Date(utcDate.getTime() + off * 60000);
  const d = shifted.getUTCDate();
  const mon = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"][shifted.getUTCMonth()];
  const y = shifted.getUTCFullYear();
  const hh = String(shifted.getUTCHours()).padStart(2, "0");
  const mm = String(shifted.getUTCMinutes()).padStart(2, "0");
  return `${d} ${mon} ${y}, ${hh}:${mm}`;
}

const TW_DEST_COUNTRIES = [
  { key: "UK", name: "United Kingdom" },
  { key: "IE", name: "Ireland" },
  { key: "NO", name: "Norway" },
  { key: "MT", name: "Malta" },
  { key: "FI", name: "Finland" },
];

const TW_TRIP_COUNTRIES = [
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

function twNameFor(key) {
  return (
    TW_TRIP_COUNTRIES.find((c) => c.key === key)?.name ||
    TW_DEST_COUNTRIES.find((c) => c.key === key)?.name ||
    key
  );
}

// Maps a destination airport CODE to one of the 5 tapeworm countries.
// Returns null if the airport isn't a tapeworm-rule country.
const TW_AIRPORT_TO_COUNTRY = {
  LHR: "UK", LGW: "UK", MAN: "UK", NCL: "UK", EDI: "UK", BHX: "UK", GLA: "UK", BRS: "UK",
  DUB: "IE", ORK: "IE", SNN: "IE",
  OSL: "NO",
  HEL: "FI",
  MLA: "MT",
};
function twCountryForAirport(code) {
  return TW_AIRPORT_TO_COUNTRY[code] || null;
}

function TapewormWindow({ destKey = null, onResult = null, defaultOpen = false, stopoverOptions = null, onAddToChecklist = null, addedToChecklist = false }) {
  const presetDest = TW_DEST_COUNTRIES.find((c) => c.key === destKey);

  const [open, setOpen] = useState(defaultOpen);
  const [dest, setDest] = useState(presetDest ? presetDest.key : "UK");
  const [origin, setOrigin] = useState("US-ET");
  const [stopover, setStopover] = useState("");
  const [arrival, setArrival] = useState("");
  const [treatLoc, setTreatLoc] = useState("US-ET");

  // Follow defaultOpen if the parent flips it (e.g. "Plan & calculate").
  useEffect(() => {
    if (defaultOpen) setOpen(true);
  }, [defaultOpen]);

  // If a preset destination changes (planner re-search), follow it.
  useEffect(() => {
    if (presetDest && presetDest.key !== dest) setDest(presetDest.key);
  }, [presetDest, dest]);

  // The stopover dropdown options. When the parent passes route-specific
  // stopoverOptions (the actual workaround hubs for this route), use those;
  // otherwise fall back to the full country list.
  const stopoverChoices = stopoverOptions && stopoverOptions.length > 0
    ? stopoverOptions
    : TW_TRIP_COUNTRIES;

  // If the available stopover choices change and the current pick is no
  // longer valid, clear it.
  useEffect(() => {
    if (stopover && !stopoverChoices.some((c) => c.key === stopover)) {
      setStopover("");
    }
  }, [stopoverChoices, stopover]);

  // Resolve the currently-selected stopover into a timezone key and a display
  // name. Route-aware options carry their own `tz` and city `name`; the
  // fallback country list uses the key as both. Returns null if no stopover.
  const stopoverResolved = useMemo(() => {
    if (!stopover) return null;
    const opt = stopoverChoices.find((c) => c.key === stopover);
    if (opt) {
      return { tz: opt.tz || opt.key, name: opt.name || twNameFor(opt.key) };
    }
    // stopover set but not in the current choice list — treat key as tz.
    return { tz: stopover, name: twNameFor(stopover) };
  }, [stopover, stopoverChoices]);

  const vetOptions = useMemo(() => {
    // Each entry: { key (selectable id), tz (for maths), name (label) }.
    const list = [{ key: origin, tz: origin, name: twNameFor(origin) }];
    if (stopoverResolved) {
      list.push({ key: stopover, tz: stopoverResolved.tz, name: stopoverResolved.name });
    }
    list.push({ key: dest, tz: dest, name: twNameFor(dest) });
    const seen = new Set();
    return list.filter((o) => (seen.has(o.key) ? false : (seen.add(o.key), true)));
  }, [origin, stopover, stopoverResolved, dest]);

  useEffect(() => {
    if (!vetOptions.some((o) => o.key === treatLoc)) {
      setTreatLoc(vetOptions[0]?.key || origin);
    }
  }, [vetOptions, treatLoc, origin]);

  const result = useMemo(() => {
    const w = twCalcWindow(arrival, dest);
    if (!w) return null;
    // treatLoc is a vetOption key — resolve it to the timezone for the maths
    // and a proper label (a city stopover's key is an airport code, not a tz).
    const treatOpt = vetOptions.find((o) => o.key === treatLoc);
    const treatTZ = treatOpt?.tz || treatLoc;
    const treatName = treatOpt?.name || twNameFor(treatLoc);
    const treatLabel = TW_TZ[treatTZ]?.label || treatName;
    return {
      earliestStr: twFmtInTZ(w.earliestUTC, treatTZ),
      latestStr: twFmtInTZ(w.latestUTC, treatTZ),
      cutoffStr: twFmtInTZ(w.arrivalUTC, dest),
      treatLabel,
      destLabel: TW_TZ[dest]?.label || dest,
      destName: twNameFor(dest),
      treatName,
    };
  }, [arrival, dest, treatLoc, vetOptions]);

  // Hand the result up so the parent (planner / checklist) can auto-fill.
  // Intentionally depends only on `result` — `onResult` is a notify-up
  // callback and including it would loop if the parent passes an inline fn.
  const onResultRef = useRef(onResult);
  onResultRef.current = onResult;
  useEffect(() => {
    if (onResultRef.current) onResultRef.current(result);
  }, [result]);

  // Analytics: fire one GA4 event per real calculation. Debounced so
  // typing into the date field doesn't spam events; a ref guards repeats.
  const lastReportedRef = useRef("");
  useEffect(() => {
    if (!result || !arrival) return;
    const signature = `${dest}|${arrival}`;
    if (signature === lastReportedRef.current) return;
    const timer = setTimeout(() => {
      lastReportedRef.current = signature;
      if (typeof window !== "undefined" && typeof window.gtag === "function") {
        window.gtag("event", "tapeworm_window_calculated", {
          destination: twNameFor(dest),
        });
      }
    }, 1200);
    return () => clearTimeout(timer);
  }, [result, dest, arrival]);

  return (
    <div className="border-2 border-amber-400 bg-amber-100 rounded-sm overflow-hidden shadow-sm">
      <button
        onClick={() => setOpen((o) => !o)}
        className="w-full flex items-center justify-between gap-3 px-5 py-4 text-left hover:bg-amber-200/70 transition-colors"
      >
        <div>
          <div className="font-serif text-stone-900 text-lg">
            Tapeworm treatment timing
          </div>
          <div className="text-sm text-stone-700">
            Dogs entering {presetDest ? presetDest.name : "the UK, Ireland, Norway, Malta or Finland"} need a vet-recorded treatment in a strict time window. Work out yours.
          </div>
        </div>
        <span className="text-amber-800 text-2xl flex-shrink-0 font-medium" aria-hidden="true">
          {open ? "−" : "+"}
        </span>
      </button>

      {open && (
        <div className="px-5 pb-5 pt-1 border-t-2 border-amber-300 space-y-4">
          {!presetDest && (
            <label className="block">
              <span className="text-sm font-medium text-stone-700">Destination country</span>
              <select
                value={dest}
                onChange={(e) => setDest(e.target.value)}
                className="mt-1 w-full border border-stone-300 rounded-sm px-3 py-2 bg-white text-stone-900"
              >
                {TW_DEST_COUNTRIES.map((c) => (
                  <option key={c.key} value={c.key}>{c.name}</option>
                ))}
              </select>
            </label>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <label className="block">
              <span className="text-sm font-medium text-stone-700">Where does your trip start?</span>
              <select
                value={origin}
                onChange={(e) => setOrigin(e.target.value)}
                className="mt-1 w-full border border-stone-300 rounded-sm px-3 py-2 bg-white text-stone-900"
              >
                {TW_TRIP_COUNTRIES.map((c) => (
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
                {stopoverChoices.map((c) => (
                  <option key={c.key} value={c.key}>{c.name}</option>
                ))}
              </select>
              {stopoverOptions && stopoverOptions.length > 0 && (
                <span className="text-xs text-stone-500 mt-1 block">
                  The stopover hubs on your planned route.
                </span>
              )}
            </label>
          </div>

          <label className="block">
            <span className="text-sm font-medium text-stone-700">
              Arrival date &amp; time in {twNameFor(dest)}
            </span>
            <input
              type="datetime-local"
              value={arrival}
              onChange={(e) => setArrival(e.target.value)}
              className="mt-1 w-full border border-stone-300 rounded-sm px-3 py-2 bg-white text-stone-900"
            />
            <span className="text-xs text-stone-500 mt-1 block">
              The scheduled time you land — in {twNameFor(dest)} local time.
            </span>
          </label>

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
              {stopover && stopoverResolved && (
                <div className="border-t border-stone-100 pt-3">
                  <p className="text-stone-600 text-sm leading-relaxed">
                    Your stopover in {stopoverResolved.name} doesn't change this — the
                    window is measured against your arrival in {result.destName}, not
                    when you leave the stopover. If the treatment is done before the
                    stopover, make sure the stopover plus onward travel still lands you
                    inside the window.
                  </p>
                </div>
              )}
            </div>
          ) : (
            <p className="text-sm text-stone-500">
              Enter your arrival date and time above to see the treatment window.
            </p>
          )}

          {/* ADD TO CHECKLIST — only when the parent (planner) supplies the
              callback. Puts the dated tapeworm line into the checklist that
              shows on screen AND the printable PDF. */}
          {result && onAddToChecklist && (
            <div>
              {addedToChecklist ? (
                <div className="flex items-center gap-2 text-sm text-green-800 bg-green-100 border border-green-300 rounded-sm px-4 py-3">
                  <Check className="w-4 h-4 flex-shrink-0" strokeWidth={2.5} />
                  <span>Added to your checklist below — it's in the printable PDF too.</span>
                </div>
              ) : (
                <button
                  onClick={() => onAddToChecklist(result)}
                  className="w-full bg-stone-900 text-amber-50 px-5 py-3 text-sm uppercase tracking-widest font-medium hover:bg-stone-800 transition-colors rounded-sm"
                >
                  Add these dates to my checklist
                </button>
              )}
            </div>
          )}

          <p className="text-xs text-stone-600 leading-relaxed border-t border-amber-300 pt-3">
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

function Checklist() {
  const sections = [
    {
      title: "Six weeks before",
      icon: <Stethoscope className="w-5 h-5" strokeWidth={1.5} />,
      items: [
        "Vet visit: confirm your pet is healthy enough to fly — and ask about breed-specific airline restrictions before you book anything",
        "ISO 11784/11785 microchip implanted (if not already) — must be implanted BEFORE the rabies shot for international, or you may have to start over",
        "Rabies vaccine administered — most countries need a 21-30 day wait after the shot, the UK and EU specifically require 21 days minimum",
        "Research the destination country's rules — every country differs, some need 3-6 months lead time (Japan, Hawaii, Australia, Jamaica)",
        "Book your flight AND phone the airline to reserve a pet spot — most cap at 2-7 pets per cabin, fills fast on popular routes",
        "If snub-nosed (Frenchie, Pug, Bulldog, Persian cat) — start looking at airlines NOW, summer embargoes are wide and many cargo holds are off-limits",
      ],
    },
    {
      title: "Two weeks before",
      icon: <ScrollText className="w-5 h-5" strokeWidth={1.5} />,
      items: [
        "Buy the airline-compliant carrier (soft-sided is usually better) — let your pet sleep in it at home with a familiar blanket so it smells like them",
        "Practice short car rides or trips in the carrier — calm carrier-day is built weeks earlier, not on the morning of",
        "Schedule the government-accredited vet visit for the health certificate — timing varies, usually within 10 days of travel, sometimes 48 hours",
        "Complete destination-specific forms (CDC for US, AHC for UK, EU pet passport, MOCCAE for UAE, MGAP for Uruguay, AQS Form for Japan, etc.)",
        "Confirm climate / temperature embargoes — many airlines refuse pets above 85°F or below 20°F, and brachy breeds face wider seasonal bans",
        "Double-check carrier dimensions against your specific airline AND specific aircraft — the under-seat space varies by plane type, not just airline",
      ],
    },
    {
      title: "The day of",
      icon: <Luggage className="w-5 h-5" strokeWidth={1.5} />,
      items: [
        "Light meal 3–4 hours before flight; water available right up until departure — empty stomachs cause anxiety, full ones cause accidents at altitude",
        "Walk your dog or let your cat use the box right before leaving home — airport pet relief areas are often hidden, dirty, or non-existent",
        "Pad the carrier with absorbent puppy pads — bring 3-4 spares and change them at the gate if needed, no shame in that",
        "Pack: food, collapsible water bowl, leash, waste bags, vet records (originals + photocopies), comfort item, calming spray, treats",
        "Arrive 2.5–3 hours early — pet check-in is in person at the counter, never online, and the turn-around test always takes longer than expected",
        "Charge your phone fully and bring a portable battery — you'll be juggling paperwork, carrier, and luggage with both hands full",
      ],
    },
    {
      title: "At security & onboard",
      icon: <Plane className="w-5 h-5" strokeWidth={1.5} />,
      items: [
        "Security: remove your pet from carrier, carry them through the metal detector — keep a firm grip, this is the single riskiest 30 seconds of the day",
        "Carrier goes through the X-ray machine empty — your pet absolutely does not go through X-ray",
        "Once at the gate, keep your pet in the carrier — most airlines let you take a quick visit on your lap if they're stressed at the gate, but not in flight",
        "Stow the carrier under the seat in front of you — never the overhead bin, never on your lap mid-flight",
        "Don't open the carrier in flight — most airlines and many aviation authorities require this; crew often can't bend the rule even if your pet is whining",
        "Window seat preferred — slightly more under-seat depth, away from cart traffic, and you can control the light through the window",
      ],
    },
    {
      title: "If you're flying with a dog",
      icon: <PawPrint className="w-5 h-5" strokeWidth={1.5} />,
      items: [
        "Walk them properly 2-3 hours before leaving — a tired dog in a carrier is a sleeping dog; a fresh one is an anxious one stuck in a small space",
        "Adaptil pheromone spray on the carrier (never on the dog) 15 minutes before you head out — it actually works, vets aren't selling snake oil here",
        "Brachycephalic breeds (Bulldogs, Pugs, Frenchies, Boston Terriers) — cabin only, never cargo. Avoid summer travel even in cabin if you can",
        "Practice the turn-around test at home: dog must stand up, turn around, lie down inside the carrier without touching walls or ceiling",
        "If your dog is over 20 lb combined with the carrier — most US airlines are out. Lufthansa, Air Canada, and Iberia are your friends",
        "Bring poop bags AND a small bottle of water for cleanup — accidents happen, and you'll want to handle it discreetly without making a scene at the gate",
      ],
    },
    {
      title: "If you're flying with a cat",
      icon: <PawPrint className="w-5 h-5" strokeWidth={1.5} />,
      items: [
        "Start carrier acclimation WEEKS ahead — leave it out as a normal den, never something that appears only on travel day, that ship sails fast with cats",
        "Feliway pheromone spray (the cat version of Adaptil) on the carrier 15 minutes before you leave — never directly on the cat, they'll hate you for it",
        "Line the carrier with unwashed bedding from home — cats orient by smell, and familiar scent settles them faster than literally anything else",
        "Fit a well-adjusted harness BEFORE travel day and practise it — a loose cat in airport security is the scariest moment imaginable, prevent it",
        "Don't feed within 4 hours of departure — cats are particularly prone to travel-sickness, and an empty carrier on landing is a much better outcome",
        "Cats go quiet and still when stressed, not vocal — check on them gently through the carrier mesh, but don't assume silence means everything's fine",
      ],
    },
  ];

  return (
    <section id="timeline" className="py-20 px-6 md:px-12">
      <div className="max-w-5xl mx-auto">
        <SectionLabel num="V.">The timeline</SectionLabel>

        <h2 className="font-serif text-5xl text-stone-900 mb-4 max-w-3xl">
          What to do, and when.
        </h2>

        <p className="font-serif italic text-stone-600 text-lg mb-10 max-w-2xl">
          A general timeline below — or grab the printable checklist tailored to your route.
        </p>

        <div id="checklist" className="scroll-mt-24">
          <ChecklistDownload />
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mt-12">
          {sections.map((s, i) => (
            <div key={i} className="border border-stone-300 p-8 bg-stone-50 hover:shadow-lg transition-shadow">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-full bg-stone-900 text-stone-50 flex items-center justify-center">
                  {s.icon}
                </div>
                <h3 className="font-serif text-2xl text-stone-900">{s.title}</h3>
              </div>
              <ul className="space-y-3">
                {s.items.map((item, j) => (
                  <li key={j} className="flex gap-3 text-stone-700">
                    <span className="font-serif italic text-stone-400 text-sm pt-1">{String(j + 1).padStart(2, "0")}</span>
                    <span className="leading-relaxed [&_a]:text-amber-700 [&_a]:underline [&_a]:decoration-amber-600/40 [&_a]:underline-offset-2 [&_a:hover]:text-amber-800 [&_a:hover]:decoration-amber-700" dangerouslySetInnerHTML={{ __html: item }} />
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function ChecklistDownload() {
  const [mode, setMode] = useState("route"); // "route" or "country"
  const [route, setRoute] = useState("generic");
  const [direction, setDirection] = useState("departing"); // "departing" or "arriving"
  // Route mode: airport-level origin + destination (codes)
  const [originCode, setOriginCode] = useState("");
  const [destCode, setDestCode] = useState("");

  // Universal + South Africa checklists don't have a meaningful departing/arriving split — lock direction
  const isUniversal = route === "generic";
  const noDirectionToggle = isUniversal || route === "south_africa";
  const effectiveDirection = noDirectionToggle ? "departing" : direction;

  // Regions for grouping airports in the route-mode dropdowns.
  const CL_REGIONS = [
    { id: "uk-out", label: "United Kingdom", flag: "🇬🇧" },
    { id: "ireland", label: "Ireland", flag: "🇮🇪" },
    { id: "us", label: "United States", flag: "🇺🇸" },
    { id: "canada", label: "Canada", flag: "🇨🇦" },
    { id: "mexico", label: "Mexico", flag: "🇲🇽" },
    { id: "europe", label: "Europe", flag: "🇪🇺" },
    { id: "india", label: "India", flag: "🇮🇳" },
    { id: "dubai", label: "UAE", flag: "🇦🇪" },
    { id: "caribbean", label: "Caribbean", flag: "🌴" },
    { id: "hawaii", label: "Hawaii", flag: "🌺" },
    { id: "south-america", label: "South America", flag: "🌎" },
    { id: "central-america", label: "Central America", flag: "🌎" },
    { id: "japan", label: "Japan", flag: "🇯🇵" },
    { id: "south-africa", label: "South Africa", flag: "🇿🇦" },
  ];
  const clAirportsByRegion = CL_REGIONS.map((r) => ({
    region: r,
    airports: AIRPORTS.filter((a) => a.region === r.id),
  })).filter((g) => g.airports.length > 0);

  const originAirport = originCode ? airportByCode(originCode) : null;
  const destAirport = destCode ? airportByCode(destCode) : null;

  // GA4 — track when a route-mode checklist is generated (both airports
  // selected). The country-mode dropdown path is intentionally not tracked
  // here since it's a much smaller surface; we mostly want to know how
  // many people are actually USING the route-checklist flow.
  useEffect(() => {
    if (mode === "route" && originCode && destCode && typeof window !== "undefined" && window.gtag) {
      window.gtag("event", "checklist_generated", {
        event_category: "tool_engagement",
        origin: originCode,
        destination: destCode,
        direction: effectiveDirection,
      });
    }
  }, [mode, originCode, destCode, effectiveDirection]);

  // The checklist data shown depends on the mode.
  let data;
  if (mode === "route") {
    if (originAirport && destAirport) {
      data = buildRouteChecklist(
        originAirport.region,
        destAirport.region,
        REGION_LABELS_SHORT[originAirport.region] || originAirport.region,
        REGION_LABELS_SHORT[destAirport.region] || destAirport.region
      );
    } else {
      data = null; // nothing selected yet
    }
  } else {
    data = getChecklist(route, effectiveDirection);
  }

  const hasDirectionalContent = mode === "country" &&
    !!(DIRECTIONAL_CHECKLISTS[route] && DIRECTIONAL_CHECKLISTS[route][effectiveDirection]);

  function openPrintable() {
    // GA4 — track downloads from the standalone Checklist tool ("what
    // paperwork do I need"). Both "Open & print" buttons call this, so one
    // event here covers both. Distinct from journey_checklist_downloaded,
    // which fires for the Journey Planner's own checklist download.
    if (typeof window !== "undefined" && window.gtag) {
      window.gtag("event", "checklist_downloaded", {
        event_category: "tool_engagement",
        checklist_mode: mode,
        origin: mode === "route" ? originCode : "",
        destination: mode === "route" ? destCode : "",
        country: mode === "country" ? route : "",
      });
    }
    openChecklistPrintable(data);
  }

  return (
    <div className="bg-stone-900 text-stone-50 p-8 md:p-10">
      <div className="flex items-start gap-4 mb-6">
        <div className="w-12 h-12 rounded-full bg-amber-600 text-white flex items-center justify-center flex-shrink-0">
          <FileCheck className="w-5 h-5" strokeWidth={1.75} />
        </div>
        <div className="flex-1">
          <h3 className="font-serif text-2xl mb-2">Get a printable checklist</h3>
          <p className="text-stone-300 leading-relaxed">
            Build it from your route — origin and destination — and it combines every country's rules into one document, with a chapter per country. Or pick a single country. Opens in a new tab; use your browser's print or save-as-PDF.
          </p>
        </div>
      </div>

      {/* Mode toggle */}
      <div className="inline-flex border border-stone-700 bg-stone-800 mb-6">
        <button
          onClick={() => setMode("route")}
          className={`px-5 py-2 text-sm transition-all ${
            mode === "route" ? "bg-amber-600 text-white" : "bg-stone-800 text-stone-300 hover:bg-stone-700"
          }`}
        >
          ✦ By route
        </button>
        <button
          onClick={() => setMode("country")}
          className={`px-5 py-2 text-sm transition-all border-l border-stone-700 ${
            mode === "country" ? "bg-amber-600 text-white" : "bg-stone-800 text-stone-300 hover:bg-stone-700"
          }`}
        >
          By single country
        </button>
      </div>

      {mode === "route" ? (
        <div className="space-y-4">
          <p className="text-sm text-stone-400 leading-relaxed max-w-2xl">
            Pick where you're flying <strong className="text-stone-200">from and to</strong>. The checklist combines the universal prep, the rules for leaving your origin country, and the rules for entering your destination — one document for the whole journey.
          </p>
          <div className="grid sm:grid-cols-[1fr_auto_1fr] gap-4 items-end">
            <div>
              <div className="text-xs uppercase tracking-widest text-stone-400 mb-2">Flying from</div>
              <select
                value={originCode}
                onChange={(e) => setOriginCode(e.target.value)}
                aria-label="Flying from (origin airport for checklist)"
                className="w-full bg-stone-800 border border-stone-700 text-stone-100 px-4 py-3 font-serif text-base focus:border-amber-500 focus:outline-none"
              >
                <option value="">Select origin airport…</option>
                {clAirportsByRegion.map((g) => (
                  <optgroup key={g.region.id} label={`${g.region.flag} ${g.region.label}`}>
                    {g.airports.map((a) => (
                      <option key={a.code} value={a.code}>{a.city} ({a.code})</option>
                    ))}
                  </optgroup>
                ))}
              </select>
            </div>
            <div className="hidden sm:flex items-center justify-center pb-3">
              <ArrowRight className="w-5 h-5 text-stone-600" strokeWidth={1.5} />
            </div>
            <div>
              <div className="text-xs uppercase tracking-widest text-stone-400 mb-2">Flying to</div>
              <select
                value={destCode}
                onChange={(e) => setDestCode(e.target.value)}
                aria-label="Flying to (destination airport for checklist)"
                className="w-full bg-stone-800 border border-stone-700 text-stone-100 px-4 py-3 font-serif text-base focus:border-amber-500 focus:outline-none"
              >
                <option value="">Select destination airport…</option>
                {clAirportsByRegion.map((g) => (
                  <optgroup key={g.region.id} label={`${g.region.flag} ${g.region.label}`}>
                    {g.airports.map((a) => (
                      <option key={a.code} value={a.code}>{a.city} ({a.code})</option>
                    ))}
                  </optgroup>
                ))}
              </select>
            </div>
          </div>

          {data && data.restriction && (
            <div className="bg-amber-900/30 border-l-2 border-amber-500 px-4 py-3 text-sm text-amber-100 leading-relaxed">
              <strong className="not-italic">Note:</strong> {data.restriction}
            </div>
          )}

          {originAirport && destAirport && originAirport.region === destAirport.region && (
            <div className="bg-stone-800 border-l-2 border-amber-500 px-4 py-3 text-sm text-stone-300 leading-relaxed">
              Both airports are in the same country/region — you'll get that region's prep plus the universal checklist.
            </div>
          )}

          <div className="flex justify-end">
            <button
              onClick={openPrintable}
              disabled={!data}
              className="inline-flex items-center gap-2 bg-amber-600 hover:bg-amber-500 disabled:opacity-30 disabled:cursor-not-allowed text-white px-5 py-2.5 transition-colors"
            >
              <span className="uppercase tracking-widest text-xs font-medium">Open & print</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          <div>
            <div className="text-xs uppercase tracking-widest text-stone-400 mb-2">1. Pick your country / region</div>
            <div className="flex flex-wrap gap-2">
              {[
                { id: "generic", label: "Universal" },
                { id: "uk", label: "🇬🇧 UK" },
                { id: "ireland", label: "🇮🇪 Ireland" },
                { id: "usa", label: "🇺🇸 USA" },
                { id: "uae", label: "🇦🇪 UAE" },
                { id: "canada", label: "🇨🇦 Canada" },
                { id: "mexico", label: "🇲🇽 Mexico" },
                { id: "dominican_republic", label: "🇩🇴 Dominican Rep." },
                { id: "jamaica", label: "🇯🇲 Jamaica" },
                { id: "bahamas", label: "🇧🇸 Bahamas" },
                { id: "europe", label: "🇪🇺 Europe" },
                { id: "india", label: "🇮🇳 India" },
                { id: "hawaii", label: "🌺 Hawaii" },
                { id: "south_africa", label: "🇿🇦 South Africa" },
              ].map((r) => (
                <button
                  key={r.id}
                  onClick={() => setRoute(r.id)}
                  className={`px-4 py-2 text-sm transition-all ${
                    route === r.id
                      ? "bg-amber-600 text-white"
                      : "bg-stone-800 text-stone-300 hover:bg-stone-700"
                  }`}
                >
                  {r.label}
                </button>
              ))}
            </div>
          </div>

          {!noDirectionToggle && (
            <div>
              <div className="text-xs uppercase tracking-widest text-stone-400 mb-2">2. Direction of travel</div>
              <p className="text-sm text-stone-400 mb-3 leading-relaxed max-w-2xl">
                International travel involves <strong className="text-stone-200">two countries' rules</strong> — the one you leave AND the one you enter. Pick a direction to see that country's side. (Tip: "By route" mode combines both sides automatically.)
              </p>
              <div className="inline-flex border border-stone-700 bg-stone-800">
                <button
                  onClick={() => setDirection("departing")}
                  className={`px-5 py-2 text-sm transition-all ${
                    direction === "departing"
                      ? "bg-amber-600 text-white"
                      : "bg-stone-800 text-stone-300 hover:bg-stone-700"
                  }`}
                >
                  ↗ Departing
                </button>
                <button
                  onClick={() => setDirection("arriving")}
                  className={`px-5 py-2 text-sm transition-all border-l border-stone-700 ${
                    direction === "arriving"
                      ? "bg-amber-600 text-white"
                      : "bg-stone-800 text-stone-300 hover:bg-stone-700"
                  }`}
                >
                  ↘ Arriving
                </button>
              </div>
              {!hasDirectionalContent && (
                <p className="text-xs italic text-stone-400 mt-2">Same prep applies in both directions for this destination.</p>
              )}
            </div>
          )}

          {data && data.restriction && (
            <div className="bg-amber-900/30 border-l-2 border-amber-500 px-4 py-3 text-sm text-amber-100 leading-relaxed">
              <strong className="not-italic">Important:</strong> {data.restriction}
            </div>
          )}

          <div className="flex justify-end">
            <button
              onClick={openPrintable}
              disabled={!data}
              className="inline-flex items-center gap-2 bg-amber-600 hover:bg-amber-500 disabled:opacity-30 disabled:cursor-not-allowed text-white px-5 py-2.5 transition-colors"
            >
              <span className="uppercase tracking-widest text-xs font-medium">Open & print</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {(route === "dominican_republic" || route === "jamaica" || route === "bahamas") && (
            <div className="mt-1 bg-stone-800 border-l-2 border-amber-500 px-4 py-3 text-sm text-stone-300 leading-relaxed">
              <strong className="text-amber-300 not-italic">Note on Caribbean coverage:</strong> we've built checklists for three of the most-asked Caribbean destinations (Bahamas, Jamaica, Dominican Republic). The Caribbean has 25+ countries with varying rules — if yours isn't listed, always check the destination's official Department of Agriculture site and confirm with your airline directly.
            </div>
          )}

          {/* TAPEWORM CALCULATOR — shows when the destination is one of the
              5 countries that require the treatment. Works off the route-mode
              destination airport, or the country-mode destination. */}
          {(() => {
            // Resolve the destination tapeworm-country, if any.
            let twDest = null;
            if (mode === "route" && destCode) {
              twDest = twCountryForAirport(destCode);
            } else if (mode === "country") {
              const COUNTRY_ROUTE_TO_TW = {
                uk: "UK", ireland: "IE", norway: "NO",
              };
              twDest = COUNTRY_ROUTE_TO_TW[route] || null;
            }
            if (!twDest) return null;
            return (
              <div className="mt-2">
                <TapewormWindow destKey={twDest} />
              </div>
            );
          })()}
        </div>
      )}
    </div>
  );
}

function JourneyPlanner() {
  const [origin, setOrigin] = useState("");      // airport CODE, e.g. "LHR"
  const [destination, setDestination] = useState(""); // airport CODE
  const [petType, setPetType] = useState("dog"); // "dog" | "cat" | "both" — filters checklist items
  const [planned, setPlanned] = useState(false);
  // Which route the user has chosen — gates the tailored checklist render.
  // Format: "direct:0", "workaround:2", "altDirect:0", "altWorkaround:1".
  // Reset whenever origin/destination/petType changes so the user
  // re-selects against the new options.
  const [selectedRouteId, setSelectedRouteId] = useState(null);
  // Per-section expanded sections in the inline checklist preview. Each
  // section is collapsed to 2 items by default; clicking the toggle reveals
  // the rest. Stored as a Set of section indices.
  const [expandedSections, setExpandedSections] = useState(() => new Set());
  const sectionRef = useRef(null);

  // --- Tapeworm calculator integration ---
  // wantTapeworm: set true when the user clicks "Plan & calculate tapeworm
  //   treatment" — makes the calculator render auto-expanded and scrolls to it.
  // tapewormResult: the latest result handed up from the TapewormWindow.
  // tapewormAdded: true once the user clicks "Add to my checklist" — this is
  //   what causes the dated line to be injected into the checklist (both the
  //   on-screen preview AND the PDF, since both read the same combined object).
  const [wantTapeworm, setWantTapeworm] = useState(false);
  const [tapewormResult, setTapewormResult] = useState(null);
  const [tapewormAdded, setTapewormAdded] = useState(false);
  const tapewormRef = useRef(null);

  // When results appear, scroll to the START of the results (the route
  // header / "Your routes" area), NOT the top of the entire planner section.
  // The whole-section approach scrolls to above the form the user just
  // filled out, which on mobile means they then have to scroll DOWN through
  // the form again to see the routes. Targeting the results anchor puts the
  // route options at the top of the viewport immediately.
  //
  // Double requestAnimationFrame waits for the results DOM to actually lay
  // out before measuring — without this, getBoundingClientRect reads the
  // pre-render (short) layout and the scroll lands in the wrong place.
  useEffect(() => {
    if (!planned) return;
    // Wait for the results content (route cards / checklist, which use a
    // fadeIn animation) to actually render and settle before scrolling.
    // Measuring getBoundingClientRect() too early — while layout is still
    // shifting — caused the scroll to overshoot, badly so when the result
    // was short (0 or 1 routes). scrollIntoView is recalculated by the
    // browser as layout settles, and a short timeout lets the content mount.
    const t = setTimeout(() => {
      const resultsEl = document.getElementById("planner-results-anchor");
      const el = resultsEl || sectionRef.current;
      if (el) {
        // scrollToTarget re-corrects overshoot as the fadeIn results settle.
        scrollToTarget(el);
      }
    }, 120);
    return () => clearTimeout(t);
  }, [planned]);

  // Reset the route selection (and per-section expansion state) whenever the
  // user changes origin, destination, pet type, or starts a new plan. Without
  // this, the previous selection would carry over and look incoherent against
  // the new route list.
  useEffect(() => {
    setSelectedRouteId(null);
    setExpandedSections(new Set());
  }, [origin, destination, petType, planned]);

  // Regions — used only to GROUP airports in the dropdowns.
  const REGIONS = [
    { id: "uk-out", label: "United Kingdom", flag: "🇬🇧" },
    { id: "ireland", label: "Ireland", flag: "🇮🇪" },
    { id: "us", label: "United States", flag: "🇺🇸" },
    { id: "canada", label: "Canada", flag: "🇨🇦" },
    { id: "mexico", label: "Mexico", flag: "🇲🇽" },
    { id: "europe", label: "Europe", flag: "🇪🇺" },
    { id: "india", label: "India", flag: "🇮🇳" },
    { id: "dubai", label: "UAE", flag: "🇦🇪" },
    { id: "caribbean", label: "Caribbean", flag: "🌴" },
    { id: "hawaii", label: "Hawaii", flag: "🌺" },
    { id: "south-america", label: "South America", flag: "🌎" },
    { id: "central-america", label: "Central America", flag: "🌎" },
    { id: "japan", label: "Japan", flag: "🇯🇵" },
    { id: "south-africa", label: "South Africa", flag: "🇿🇦" },
  ];

  // Map a region to its checklist tab id.
  const REGION_TO_CHECKLIST = {
    "uk-out": "uk", "ireland": "ireland", "us": "usa", "canada": "canada",
    "mexico": "mexico", "europe": "europe", "india": "india", "dubai": "uae",
    "caribbean": null, "hawaii": null, "south-africa": "south_africa",
    "south-america": "south_america", "central-america": null, "japan": "japan",
  };

  // The two selected airport objects (or null until chosen).
  const originAirport = origin ? airportByCode(origin) : null;
  const destAirport = destination ? airportByCode(destination) : null;

  // DRIVE-TO logic: if the chosen origin can't reach the destination as well
  // as a nearby qualifying airport can (Gatwick → Heathrow always; Manchester
  // → Heathrow for destinations Manchester can't fly direct), we surface a
  // "drive to X" option. CRUCIALLY we show BOTH paths — the drive-to option
  // FIRST (it usually saves the pet a flight), and the routes from the
  // originally-chosen airport AFTER, so the owner can still choose to fly from
  // where they are if they'd rather not drive.
  const rawDriveTo = originAirport && originAirport.driveTo ? originAirport.driveTo : null;
  const originHasOwnDirect = origin && destination
    ? directRoutesForAirportPair(origin, destination).length > 0
    : false;
  const driveTo = rawDriveTo && (!rawDriveTo.conditionalOnNoDirect || !originHasOwnDirect)
    ? rawDriveTo
    : null;

  // Helper: assemble direct routes + de-duped workarounds for a given origin.
  function routesFromAirport(originCode) {
    if (!originCode || !destination || originCode === destination) {
      return { direct: [], workarounds: [] };
    }
    const direct = directRoutesForAirportPair(originCode, destination);
    const seen = new Set();
    const workarounds = [];
    // De-dupe by the SEQUENCE OF AIRPORT CODES in the legs — not the exact
    // leg strings. A hand-written "LHR → Montreal YUL" and a generated
    // "London Heathrow (LHR) → Montreal (YUL)" are the SAME route. We match on
    // codes — catching BOTH "(YUL)" and bare "YUL" — so inconsistent data
    // formatting doesn't produce duplicate cards.
    const KNOWN_CODES = AIRPORTS.map((a) => a.code).concat(["YUL", "YYZ", "YVR", "MXP", "CCU", "HYD"]);
    const dedupeKey = (r) => {
      const codes = [];
      (r.legs || []).forEach((l) => {
        // Parenthesised codes first
        const paren = (l.route.match(/\(([A-Z]{3})\)/g) || []).map((c) => c.replace(/[()]/g, ""));
        paren.forEach((c) => codes.push(c));
        // Bare 3-letter codes that are known airports
        const bare = (l.route.match(/\b[A-Z]{3}\b/g) || []).filter((c) => KNOWN_CODES.includes(c));
        bare.forEach((c) => { if (!codes.includes(c)) codes.push(c); });
      });
      if (codes.length === 0) {
        const f = (r.from.match(/\(([A-Z]{3})\)/) || [])[1];
        const t = (r.to.match(/\(([A-Z]{3})\)/) || [])[1];
        return [f, t].filter(Boolean).join(">");
      }
      // Sort-stable: keep order but collapse consecutive dupes
      return codes.join(">");
    };
    // Track airport-pair keys for already-known direct routes so we don't add
    // a "workaround" that's actually the same direct route restated.
    const directKeys = new Set();
    direct.forEach((r) => {
      const fCode = (r.from.match(/\(([A-Z]{3})\)/) || [])[1];
      const tCode = (r.to.match(/\(([A-Z]{3})\)/) || [])[1];
      if (fCode && tCode) directKeys.add(`${fCode}>${tCode}`);
    });
    // Helper to determine if a route is genuinely single-leg (one actual flight,
    // no transit legs). Transit legs include layovers, drives, ferries.
    const isTransit = (legRoute) => isTransitLeg(legRoute);
    const isSingleFlight = (r) => {
      if (!r.legs || r.legs.length === 0) return false;
      const flightLegs = r.legs.filter((l) => !isTransit(l.route));
      return flightLegs.length === 1;
    };
    const push = (r, kind) => {
      const k = dedupeKey(r);
      if (seen.has(k)) return;
      seen.add(k);
      // If this "workaround" is actually a single-flight route from origin
      // to destination AND we don't already have a direct for this airport
      // pair, promote it to the direct list. This prevents the "no direct
      // route" message from showing alongside a 1-flight workaround card.
      const fCode = (r.from.match(/\(([A-Z]{3})\)/) || [])[1] ||
                    (r.legs && r.legs[0] ? (r.legs[0].route.match(/\(([A-Z]{3})\)/) || [])[1] : null);
      const tCode = (r.to.match(/\(([A-Z]{3})\)/) || [])[1];
      const pairKey = fCode && tCode ? `${fCode}>${tCode}` : null;
      if (isSingleFlight(r) && pairKey && !directKeys.has(pairKey)) {
        directKeys.add(pairKey);
        // Convert leg structure into a DIRECT-route shaped object so the
        // direct-routes renderer can show it cleanly.
        const flightLeg = r.legs.find((l) => !isTransit(l.route)) || r.legs[0];
        direct.push({
          from: r.from,
          to: r.to,
          duration: flightLeg.time || r.duration || "",
          note: r.note,
          _airlineFromLeg: flightLeg.airline,
        });
        return;
      }
      workarounds.push({ ...r, _kind: kind });
    };
    handWrittenWorkaroundsForAirportPair(originCode, destination).forEach((r) => push(r, "exact"));
    generateWorkaroundsForAirportPair(originCode, destination).forEach((r) => push(r, "generated"));
    regionLevelHandWrittenWorkarounds(originCode, destination).forEach((r) => push(r, "region"));
    return { direct, workarounds };
  }

  // PATH A — the drive-to airport (shown FIRST when a drive-to applies).
  const driveToRoutes = driveTo ? routesFromAirport(driveTo.code) : { direct: [], workarounds: [] };
  // PATH B — the airport the user actually picked.
  const ownRoutes = routesFromAirport(origin);

  // When there's a drive-to, the "primary" results are the drive-to airport's;
  // otherwise they're the chosen airport's. The chosen airport's routes still
  // render below as the "or fly from where you are" alternative.
  const directMatches = driveTo ? driveToRoutes.direct : ownRoutes.direct;
  const workaroundMatches = driveTo ? driveToRoutes.workarounds : ownRoutes.workarounds;
  // Alternative path (only meaningful when a drive-to is in play AND the
  // chosen airport actually has something of its own to offer).
  const altDirect = driveTo ? ownRoutes.direct : [];
  const altWorkarounds = driveTo ? ownRoutes.workarounds : [];
  const hasAlternative = driveTo && (altDirect.length > 0 || altWorkarounds.length > 0);

  const effectiveOrigin = driveTo ? driveTo.code : origin;
  const effectiveOriginAirport = driveTo ? airportByCode(driveTo.code) : originAirport;

  // Route-aware stopover options for the tapeworm calculator.
  //
  // Every tapeworm route (into the UK/Ireland) pivots through continental
  // Europe — that's structurally true of all the strategies. So the reliable
  // approach is: offer the standard European hubs (Paris, Frankfurt,
  // Amsterdam) as stopover choices. They're all CET, so the maths is
  // identical — the choice just lets the user see their actual hub city.
  //
  // On top of that floor, if a workaround leg names a SPECIFIC hub airport
  // with a clean code, we surface that too (deduplicated). We deliberately do
  // NOT offer pass-through US gateways (Miami, JFK) — nobody schedules a
  // UK-tapeworm vet visit at a US layover — nor the origin/destination
  // themselves. Returns null only if the route doesn't transit Europe at all.
  const tapewormStopovers = useMemo(() => {
    if (!workaroundMatches || workaroundMatches.length === 0) return null;

    // Does any workaround actually transit Europe? (Tags carry transit
    // regions; leg text mentioning Calais/Paris/Frankfurt/Amsterdam counts.)
    const transitsEurope = workaroundMatches.some((r) => {
      const tags = r.tags || (r.route && r.route.tags) || [];
      if (tags.includes("europe")) return true;
      const legs = (r.route && r.route.legs) || r.legs || [];
      return legs.some((leg) =>
        /Calais|Paris|Frankfurt|Amsterdam|Eurotunnel|CDG|FRA|AMS/i.test(leg.route || "")
      );
    });
    if (!transitsEurope) return null;

    // The standard European hub floor — all CET, so `tz` is "FR" for each.
    const out = [
      { key: "CDG", tz: "FR", name: "Paris (CDG)" },
      { key: "FRA", tz: "FR", name: "Frankfurt (FRA)" },
      { key: "AMS", tz: "FR", name: "Amsterdam (AMS)" },
    ];
    const seen = new Set(out.map((o) => o.key));

    // Surface any other specific European hub a leg explicitly names.
    workaroundMatches.forEach((r) => {
      const legs = (r.route && r.route.legs) || r.legs || [];
      legs.forEach((leg) => {
        (leg.route || "").match(/\b[A-Z]{3}\b/g)?.forEach((tok) => {
          if (seen.has(tok) || tok === origin || tok === destination) return;
          const ap = airportByCode(tok);
          if (!ap || ap.region !== "europe") return;
          seen.add(tok);
          out.push({ key: tok, tz: "FR", name: `${ap.city} (${tok})` });
        });
      });
    });
    return out;
  }, [workaroundMatches, origin, destination]);

  const checklistId = destAirport ? REGION_TO_CHECKLIST[destAirport.region] : null;

  // Airport-specific cabin warnings — accurate to the EXACT airport chosen.
  // e.g. picking Gatwick or Dubai tells you precisely why that airport won't work.
  const originCabinWarning = originAirport && !originAirport.cabinOut
    ? originAirport.note
    : null;
  const destCabinWarning = destAirport && !destAirport.cabinIn
    ? (destAirport.arrivalNote || destAirport.note)
    : null;

  const hasResults = directMatches.length > 0 || workaroundMatches.length > 0
    || altDirect.length > 0 || altWorkarounds.length > 0;
  const hasDirect = directMatches.length > 0;

  // Build the unified list of selectable routes.
  // A "selectable route" is either:
  //  - A direct from→to pair (multiple airlines on the same pair are one card)
  //  - A workaround route (each entry is its own option, since the leg sequence varies)
  //  - Same for "altDirect" and "altWorkarounds" — the secondary path used
  //    when a drive-to airport is in play and the user's own airport also
  //    has options. Each gets its own ID prefix so selection can identify
  //    which path it belongs to.
  // Each gets a stable ID we use for selection state and tracking.
  const selectableRoutes = (() => {
    const items = [];
    // Helper: group + push direct routes from a list
    const pushDirects = (routes, prefix) => {
      const groupedDirects = [];
      const groupSeen = new Map();
      routes.forEach((r) => {
        const key = `${r.from}|||${r.to}`;
        if (groupSeen.has(key)) {
          groupSeen.get(key).routes.push(r);
        } else {
          const g = { key, from: r.from, to: r.to, duration: r.duration, routes: [r] };
          groupSeen.set(key, g);
          groupedDirects.push(g);
        }
      });
      groupedDirects.forEach((g, i) => {
        items.push({
          id: `${prefix}:${i}`,
          kind: "direct",
          group: g,
          from: g.from,
          to: g.to,
          tags: [],
        });
      });
    };
    const pushWorkarounds = (routes, prefix) => {
      routes.forEach((r, i) => {
        items.push({
          id: `${prefix}:${i}`,
          kind: "workaround",
          route: r,
          from: r.from,
          to: r.to,
          tags: r.tags || [],
        });
      });
    };
    pushDirects(directMatches, "direct");
    pushWorkarounds(workaroundMatches, "workaround");
    pushDirects(altDirect, "altDirect");
    pushWorkarounds(altWorkarounds, "altWorkaround");
    return items;
  })();

  // Auto-select when there's exactly one option — no friction for simple
  // cases like "JFK → BOG" where only Avianca direct exists.
  useEffect(() => {
    if (!planned) return;
    if (selectedRouteId) return;
    if (selectableRoutes.length === 1) {
      setSelectedRouteId(selectableRoutes[0].id);
    }
  }, [planned, selectableRoutes.length, selectedRouteId]);

  // Resolve the currently-selected route object. Null until the user picks
  // (or until auto-selection fires).
  const selectedRoute = selectedRouteId
    ? selectableRoutes.find((r) => r.id === selectedRouteId) || null
    : null;

  // GA4: track route selection so we know which options people pick most.
  function selectRoute(id) {
    setSelectedRouteId(id);
    setExpandedSections(new Set()); // reset section expansion on new selection
    const route = selectableRoutes.find((r) => r.id === id);
    if (typeof window !== "undefined" && window.gtag && route) {
      window.gtag("event", "journey_opened", {
        event_category: "journey_planner",
        route_kind: route.kind,
        route_from: route.from,
        route_to: route.to,
      });
    }
    // After selecting, scroll smoothly to the checklist anchor (set below).
    // Selecting a route expands a large checklist, so layout shifts a lot —
    // scrollToTarget re-corrects any overshoot once it settles.
    setTimeout(() => {
      scrollToTarget("planner-checklist-anchor");
    }, 100);
  }

  function plan(withTapeworm = false) {
    if (origin && destination) {
      setPlanned(true);
      // When the user chose "Plan & calculate tapeworm treatment", flag the
      // calculator to open auto-expanded; otherwise leave it collapsed.
      setWantTapeworm(withTapeworm && !!twCountryForAirport(destination));
      // A fresh plan clears any previously-added tapeworm checklist line.
      setTapewormAdded(false);
      setTapewormResult(null);
      // GA4 — track journey planner submission. Captures the airport pair
      // the user is researching. (Different from journey_opened, which fires
      // when they pick one specific route from the list of options.)
      if (typeof window !== "undefined" && window.gtag) {
        window.gtag("event", "journey_searched", {
          event_category: "tool_engagement",
          origin,
          destination,
          pet_type: petType,
        });
      }
    }
  }
  function resetPlan() {
    setOrigin("");
    setDestination("");
    setPlanned(false);
    setWantTapeworm(false);
    setTapewormAdded(false);
    setTapewormResult(null);
  }

  // When the user clicked "Plan & calculate", scroll to the calculator once
  // the results have rendered. scrollToTarget re-corrects overshoot as the
  // results DOM settles around it.
  useEffect(() => {
    if (!planned || !wantTapeworm) return;
    const t = setTimeout(() => {
      if (tapewormRef.current) {
        scrollToTarget(tapewormRef.current);
      }
    }, 350);
    return () => clearTimeout(t);
  }, [planned, wantTapeworm]);

  // Airports grouped by region, for the dropdown <optgroup>s.
  const airportsByRegion = REGIONS.map((r) => ({
    region: r,
    airports: AIRPORTS.filter((a) => a.region === r.id),
  })).filter((g) => g.airports.length > 0);

  return (
    <section ref={sectionRef} id="planner" className="py-12 md:py-20 px-6 md:px-12 bg-stone-900 text-stone-100 scroll-mt-24">
      <div className="max-w-5xl mx-auto">
        <div className="flex items-baseline gap-3 mb-4">
          <span className="font-serif italic text-amber-400/70 text-lg">✦</span>
          <span className="uppercase tracking-[0.25em] text-xs font-medium text-amber-400">Journey planner</span>
          <div className="flex-1 h-px bg-stone-700" />
        </div>

        <h2 className="font-serif text-3xl md:text-5xl text-stone-50 mb-3 max-w-3xl leading-tight">
          Where are you <span className="italic text-stone-400">flying from and to?</span>
        </h2>
        <p className="font-serif italic text-stone-400 text-base md:text-lg mb-6 max-w-2xl">
          Pick your start and end points. I'll show the cabin routes, the workarounds, and the checklist you'll need — all in one place.
        </p>

        {/* Pet-type picker — controls which checklist items are shown.
            "Both" shows everything; dog/cat filter out items that don't apply. */}
        <div className="mb-6">
          <label className="block text-xs uppercase tracking-widest text-stone-500 mb-2">Travelling with</label>
          <div className="flex gap-2">
            {[
              { id: "dog", label: "🐕 Dog" },
              { id: "cat", label: "🐈 Cat" },
              { id: "both", label: "Both" },
            ].map((opt) => (
              <button
                key={opt.id}
                onClick={() => { setPetType(opt.id); setPlanned(false); }}
                className={`px-5 py-2.5 text-sm transition-all font-medium ${
                  petType === opt.id
                    ? "bg-amber-600 text-white"
                    : "bg-stone-800 text-stone-300 hover:bg-stone-700 border border-stone-700"
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        {/* Dropdowns — airport-level, grouped by region */}
        <div className="grid sm:grid-cols-[1fr_auto_1fr_auto] gap-4 items-end mb-8">
          <div>
            <label htmlFor="planner-from" className="block text-xs uppercase tracking-widest text-stone-500 mb-2">Flying from</label>
            <select
              id="planner-from"
              value={origin}
              onChange={(e) => { setOrigin(e.target.value); setPlanned(false); }}
              className="w-full bg-stone-800 border border-stone-700 text-stone-100 px-4 py-3.5 font-serif text-lg focus:border-amber-500 focus:outline-none"
            >
              <option value="">Select origin airport…</option>
              {airportsByRegion.map((g) => (
                <optgroup key={g.region.id} label={`${g.region.flag} ${g.region.label}`}>
                  {g.airports.map((a) => (
                    <option key={a.code} value={a.code}>{a.city} ({a.code})</option>
                  ))}
                </optgroup>
              ))}
            </select>
          </div>

          <div className="hidden sm:flex items-center justify-center pb-3.5">
            <ArrowRight className="w-6 h-6 text-stone-600" strokeWidth={1.5} />
          </div>

          <div>
            <label htmlFor="planner-to" className="block text-xs uppercase tracking-widest text-stone-500 mb-2">Flying to</label>
            <select
              id="planner-to"
              value={destination}
              onChange={(e) => { setDestination(e.target.value); setPlanned(false); }}
              className="w-full bg-stone-800 border border-stone-700 text-stone-100 px-4 py-3.5 font-serif text-lg focus:border-amber-500 focus:outline-none"
            >
              <option value="">Select destination airport…</option>
              {airportsByRegion.map((g) => (
                <optgroup key={g.region.id} label={`${g.region.flag} ${g.region.label}`}>
                  {g.airports.map((a) => (
                    <option key={a.code} value={a.code}>{a.city} ({a.code})</option>
                  ))}
                </optgroup>
              ))}
            </select>
          </div>

          <div className="flex flex-col gap-2.5">
            <button
              onClick={() => plan(false)}
              disabled={!origin || !destination}
              className="bg-amber-600 text-white px-7 py-3.5 uppercase tracking-widest text-xs font-medium hover:bg-amber-500 disabled:opacity-30 disabled:cursor-not-allowed transition-colors whitespace-nowrap"
            >
              Plan my journey
            </button>
            {origin && destination && twCountryForAirport(destination) && (
              <button
                onClick={() => plan(true)}
                className="bg-stone-700 text-amber-100 px-7 py-3 uppercase tracking-widest text-[11px] font-medium hover:bg-stone-600 transition-colors whitespace-nowrap border border-amber-700/40"
              >
                Plan &amp; calculate tapeworm treatment
              </button>
            )}
          </div>
        </div>

        {/* Results */}
        {planned && (
          <div id="planner-results-anchor" className="border-t border-stone-700 pt-8 animate-fadeIn scroll-mt-20">
            <div className="flex items-baseline justify-between gap-4 mb-6 flex-wrap">
              <h3 className="font-serif text-2xl text-stone-50">
                {airportLabel(origin)} <span className="text-stone-500">→</span> {airportLabel(destination)}
                {driveTo && (
                  <span className="block text-sm font-sans text-amber-400/90 mt-1 not-italic">
                    Two ways to do this — driving to {airportLabel(driveTo.code)} first (shown first, saves your pet a flight), or flying from {airportLabel(origin)}.
                  </span>
                )}
              </h3>
              <button
                onClick={resetPlan}
                className="text-xs uppercase tracking-widest text-stone-400 hover:text-amber-400 transition-colors"
              >
                Start over
              </button>
            </div>

            {/* TAPEWORM CALCULATOR — shows when the destination is a tapeworm
                country. Route-aware: stopover options come from the actual
                workaround routes. Auto-expands + scrolls when the user chose
                "Plan & calculate tapeworm treatment". */}
            {origin !== destination && twCountryForAirport(destination) && (
              <div ref={tapewormRef} className="mb-6 scroll-mt-20">
                <TapewormWindow
                  destKey={twCountryForAirport(destination)}
                  defaultOpen={wantTapeworm}
                  stopoverOptions={tapewormStopovers}
                  onResult={setTapewormResult}
                  onAddToChecklist={(res) => { setTapewormResult(res); setTapewormAdded(true); }}
                  addedToChecklist={tapewormAdded}
                />
              </div>
            )}

            {/* Same airport selected */}
            {origin === destination && (
              <div className="bg-stone-800 border-l-2 border-amber-500 p-5 mb-6">
                <p className="text-stone-300 text-sm leading-relaxed">
                  You've picked the same airport for both ends. Choose a different origin and destination to plan a journey.
                </p>
              </div>
            )}

            {/* DRIVE-TO card. When the chosen origin can reach the destination
                better via a nearby airport (Gatwick→Heathrow always; Manchester
                →Heathrow for destinations it can't fly direct), we show that
                path FIRST — driving usually saves the pet a flight. But the
                routes from the originally-chosen airport still render below as
                an alternative, so the owner can choose to fly from where they are. */}
            {driveTo && origin !== destination && (
              <div className="bg-amber-950/40 border-l-2 border-amber-500 p-5 mb-6">
                <div className="flex items-start gap-3">
                  <MapIcon className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" strokeWidth={1.75} />
                  <div>
                    <div className="text-xs uppercase tracking-widest text-amber-400 mb-1">Shown first · usually saves a flight</div>
                    <div className="font-serif text-stone-100 mb-1">
                      Option 1 — drive to {airportLabel(driveTo.code)}, then fly
                    </div>
                    <p className="text-stone-300 text-sm leading-relaxed">
                      {originAirport.note} {driveTo.text} {hasAlternative ? `If you'd rather not drive, the routes from ${airportLabel(origin)} are shown lower down as Option 2.` : `We've shown the routes from ${airportLabel(driveTo.code)} below.`}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Section label for the primary (drive-to) path */}
            {driveTo && origin !== destination && (directMatches.length > 0 || workaroundMatches.length > 0) && (
              <div className="text-xs uppercase tracking-[0.2em] text-stone-500 mb-3 pb-2 border-b border-stone-700">
                Option 1 · from {airportLabel(driveTo.code)}
              </div>
            )}

            {/* Origin airport can't do cabin departures AND has no nearby fix —
                a plain warning (e.g. South Africa: it's cargo, no drive-to answer). */}
            {originCabinWarning && !driveTo && origin !== destination && (
              <div className="bg-rose-950/50 border-l-2 border-rose-500 p-5 mb-6">
                <div className="flex items-start gap-3">
                  <AlertTriangle className="w-5 h-5 text-rose-400 flex-shrink-0 mt-0.5" strokeWidth={1.75} />
                  <div>
                    <div className="font-serif text-stone-100 mb-1">About departing from {airportLabel(origin)}</div>
                    <p className="text-stone-300 text-sm leading-relaxed">{originCabinWarning}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Direct routes — grouped by city pair so multiple airlines show together */}
            {directMatches.length > 0 && (() => {
              // Group routes by from→to pair
              const grouped = [];
              const seen = new Map();
              directMatches.forEach((r) => {
                const key = `${r.from}|||${r.to}`;
                if (seen.has(key)) {
                  seen.get(key).routes.push(r);
                } else {
                  const g = { key, from: r.from, to: r.to, duration: r.duration, routes: [r] };
                  seen.set(key, g);
                  grouped.push(g);
                }
              });
              return (
                <div className="mb-8">
                  <div className="flex items-baseline gap-3 mb-2">
                    <span className="text-emerald-400 text-base">✓</span>
                    <h4 className="font-serif text-xl text-stone-100">
                      {(() => {
                        // "Direct cabin route" reads right for flights, but a
                        // train isn't a "cabin" route. If every route in this
                        // section is a non-flight mode (train), drop "cabin".
                        const allTrain = directMatches.length > 0 &&
                          directMatches.every((r) => r.mode === "train");
                        const word = allTrain ? "Direct route" : "Direct cabin route";
                        return grouped.length === 1
                          ? word
                          : `${word.replace("route", "routes")} · ${grouped.length} options`;
                      })()}
                    </h4>
                  </div>
                  {selectableRoutes.length > 1 && (
                    <div className="flex items-center gap-2 mb-4 bg-amber-900/30 border-l-2 border-amber-500 px-3 py-2">
                      <span className="text-amber-400 text-base">👇</span>
                      <p className="text-amber-100 text-sm font-medium">
                        Tap a route below to build your tailored checklist.
                      </p>
                    </div>
                  )}
                  <div className="space-y-3">
                    {grouped.map((g, i) => {
                      const routeId = `direct:${i}`;
                      const isSelected = selectedRouteId === routeId;
                      return (
                        <button
                          key={i}
                          onClick={() => !isSelected && selectRoute(routeId)}
                          disabled={isSelected}
                          aria-pressed={isSelected}
                          className={`w-full text-left p-4 transition-all duration-150 block ${
                            isSelected
                              ? "bg-emerald-950/50 border-2 border-emerald-400 ring-2 ring-emerald-500/30 cursor-default"
                              : "bg-stone-800 border border-stone-700 hover:bg-stone-700/80 hover:border-emerald-500 hover:ring-2 hover:ring-emerald-500/30 cursor-pointer"
                          }`}
                        >
                          <div className="flex items-center gap-2 flex-wrap mb-2">
                            <span className="font-serif text-base text-stone-100">{g.from}</span>
                            <ArrowRight className="w-3.5 h-3.5 text-stone-500" strokeWidth={2} />
                            <span className="font-serif text-base text-stone-100">{g.to}</span>
                            <span className="text-xs text-stone-500 ml-1">· {g.duration}</span>
                            {isSelected && (
                              <span className="ml-auto inline-flex items-center gap-1 text-xs uppercase tracking-widest text-emerald-400 font-bold">
                                <Check className="w-3.5 h-3.5" strokeWidth={3} /> Selected
                              </span>
                            )}
                          </div>
                          {g.routes.length === 1 ? (
                            <>
                              {g.routes[0]._airlineFromLeg && (
                                <p className="text-stone-300 text-sm mb-2 font-medium">{g.routes[0]._airlineFromLeg}</p>
                              )}
                              <p className="text-stone-400 text-sm leading-relaxed">{g.routes[0].note}</p>
                            </>
                          ) : (
                            <div className="space-y-2">
                              {g.routes.map((r, j) => (
                                <div key={j} className="border-l border-stone-600 pl-3">
                                  {r._airlineFromLeg && (
                                    <p className="text-stone-300 text-sm mb-1 font-medium">{r._airlineFromLeg}</p>
                                  )}
                                  <p className="text-stone-400 text-sm leading-relaxed">{r.note}</p>
                                </div>
                              ))}
                            </div>
                          )}
                          {!isSelected && (
                            <span className="mt-3 inline-flex items-center gap-2 text-xs uppercase tracking-widest font-bold text-emerald-300 bg-emerald-900/50 border border-emerald-700 px-3 py-1.5">
                              <Check className="w-3 h-3" strokeWidth={2.5} />
                              Tap to use this route
                            </span>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>
              );
            })()}

            {/* No direct route, but a workaround exists — explain it clearly */}
            {!hasDirect && workaroundMatches.length > 0 && origin !== destination && (
              <div className="bg-stone-800 border-l-2 border-amber-500 p-5 mb-6">
                <p className="text-stone-300 text-sm leading-relaxed">
                  <strong className="text-stone-100">There's no direct cabin route for your pet from {airportLabel(effectiveOrigin)} to {airportLabel(destination)}.</strong> But you're not stuck — here {workaroundMatches.length === 1 ? "is the workaround" : "are the workarounds"} that get you and your pet there together, in the cabin, leg by leg.
                </p>
                {destCabinWarning && (
                  <p className="text-stone-400 text-sm leading-relaxed mt-3 pt-3 border-t border-stone-700">
                    {destCabinWarning}
                  </p>
                )}
              </div>
            )}

            {/* Workaround routes */}
            {workaroundMatches.length > 0 && (
              <div className="mb-8">
                <div className="flex items-baseline gap-3 mb-2">
                  <span className="text-amber-400 text-base">⤳</span>
                  <h4 className="font-serif text-xl text-stone-100">
                    {hasDirect ? "Workaround routes" : "Workaround routes — your way there"}
                  </h4>
                  <span className="text-xs uppercase tracking-widest text-stone-500">{workaroundMatches.length}</span>
                </div>
                {selectableRoutes.length > 1 && !hasDirect && (
                  <div className="flex items-center gap-2 mb-4 bg-amber-900/30 border-l-2 border-amber-500 px-3 py-2">
                    <span className="text-amber-400 text-base">👇</span>
                    <p className="text-amber-100 text-sm font-medium">
                      Tap a route below to build your tailored checklist.
                    </p>
                  </div>
                )}
                <div className="space-y-3">
                  {workaroundMatches.map((r, i) => {
                    const routeId = `workaround:${i}`;
                    const isSelected = selectedRouteId === routeId;
                    return (
                      <button
                        key={i}
                        onClick={() => !isSelected && selectRoute(routeId)}
                        disabled={isSelected}
                        aria-pressed={isSelected}
                        className={`w-full text-left p-4 transition-all duration-150 block ${
                          isSelected
                            ? "bg-amber-950/50 border-2 border-amber-400 ring-2 ring-amber-500/30 cursor-default"
                            : "bg-stone-800 border border-stone-700 hover:bg-stone-700/80 hover:border-amber-500 hover:ring-2 hover:ring-amber-500/30 cursor-pointer"
                        }`}
                      >
                        {/* Strategy label, e.g. "Via Montreal (Air Canada)" */}
                        <div className="flex items-start justify-between gap-2 mb-2">
                          {r.label ? (
                            <div className="text-xs uppercase tracking-widest text-amber-400">{r.label}</div>
                          ) : <span />}
                          {isSelected && (
                            <span className="inline-flex items-center gap-1 text-xs uppercase tracking-widest text-amber-400 font-bold flex-shrink-0">
                              <Check className="w-3.5 h-3.5" strokeWidth={3} /> Selected
                            </span>
                          )}
                        </div>
                        {/* Adapted-route note for same-country, different-airport routes */}
                        {r._kind === "region" && (
                          <div className="text-xs text-amber-300/90 italic mb-2 leading-relaxed">
                            Routed from a different airport in the same country — adapt the first leg to start from {airportLabel(effectiveOrigin)}.
                          </div>
                        )}
                        <div className="flex items-center gap-2 flex-wrap mb-2">
                          <span className="font-serif text-base text-stone-100">{r.from}</span>
                          <ArrowRight className="w-3.5 h-3.5 text-stone-500" strokeWidth={2} />
                          <span className="font-serif text-base text-stone-100">{r.to}</span>
                          {r.duration && r.duration !== "see legs" && (
                            <span className="text-xs text-stone-500 ml-1">· {r.duration}</span>
                          )}
                          {r.legs && r.legs.length > 1 && (
                            <span className="text-xs uppercase tracking-widest text-amber-400/80 ml-1 px-1.5 py-0.5 border border-amber-700/40 rounded-sm">
                              {r.legs.filter(l => !isTransitLeg(l.route)).length}-flight journey
                            </span>
                          )}
                        </div>
                        <div className="space-y-2 mb-2 pl-3 border-l border-stone-600">
                          {r.legs.map((leg, j) => {
                            const isTransit = isTransitLeg(leg.route);
                            const flightLegs = r.legs.filter(l => !isTransitLeg(l.route));
                            const flightIdx = isTransit ? null : flightLegs.indexOf(leg) + 1;
                            return (
                              <div key={j} className="text-sm">
                                <div className="flex items-baseline gap-2">
                                  <span className={`font-serif italic text-xs ${isTransit ? "text-stone-500" : "text-amber-400/70"} flex-shrink-0 w-14`}>
                                    {isTransit ? "transit" : `Leg ${flightIdx}`}
                                  </span>
                                  <div className="flex-1">
                                    <div className="text-stone-100">{leg.route}</div>
                                    <div className="text-stone-500 text-xs">{leg.time} · {leg.airline}</div>
                                  </div>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                        <p className="text-stone-400 text-sm leading-relaxed">{r.note}</p>
                        {!isSelected && (
                          <span className="mt-3 inline-flex items-center gap-2 text-xs uppercase tracking-widest font-bold text-amber-300 bg-amber-900/50 border border-amber-700 px-3 py-1.5">
                            <Check className="w-3 h-3" strokeWidth={2.5} />
                            Tap to use this route
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* OPTION 2 — the routes from the airport the user actually picked.
                Only shown when a drive-to is in play AND the chosen airport has
                something of its own. The owner who'd rather not drive sees their
                option here — it's lower because it usually means an extra flight
                for the pet, but it's a real choice and stays visible. */}
            {hasAlternative && (
              <div className="mb-8 pt-2">
                <div className="text-xs uppercase tracking-[0.2em] text-stone-500 mb-3 pb-2 border-b border-stone-700">
                  Option 2 · from {airportLabel(origin)} — if you'd rather not drive
                </div>
                <p className="text-stone-400 text-sm leading-relaxed mb-4">
                  These routes start from {airportLabel(origin)} directly. They usually involve an extra flight compared with driving to {airportLabel(driveTo.code)} first — gentler on your schedule, a bit more flying for your pet. Your call.
                </p>

                {altDirect.length > 0 && (() => {
                  const grouped = [];
                  const seen = new Map();
                  altDirect.forEach((r) => {
                    const key = `${r.from}|||${r.to}`;
                    if (seen.has(key)) seen.get(key).routes.push(r);
                    else { const g = { key, from: r.from, to: r.to, duration: r.duration, routes: [r] }; seen.set(key, g); grouped.push(g); }
                  });
                  return (
                    <div className="mb-6">
                      <div className="flex items-baseline gap-3 mb-3">
                        <span className="text-emerald-400 text-base">✓</span>
                        <h4 className="font-serif text-lg text-stone-100">Direct cabin {grouped.length === 1 ? "route" : `routes · ${grouped.length} options`}</h4>
                      </div>
                      <div className="space-y-2">
                        {grouped.map((g, i) => {
                          const routeId = `altDirect:${i}`;
                          const isSelected = selectedRouteId === routeId;
                          return (
                            <button
                              key={i}
                              onClick={() => !isSelected && selectRoute(routeId)}
                              disabled={isSelected}
                              aria-pressed={isSelected}
                              className={`w-full text-left p-4 transition-all duration-150 block ${
                                isSelected
                                  ? "bg-emerald-950/50 border-2 border-emerald-400 ring-2 ring-emerald-500/30 cursor-default"
                                  : "bg-stone-800 border border-stone-700 hover:bg-stone-700/80 hover:border-emerald-500 hover:ring-2 hover:ring-emerald-500/30 cursor-pointer"
                              }`}
                            >
                              <div className="flex items-center gap-2 flex-wrap mb-1.5">
                                <span className="font-serif text-base text-stone-100">{g.from}</span>
                                <ArrowRight className="w-3.5 h-3.5 text-stone-500" strokeWidth={2} />
                                <span className="font-serif text-base text-stone-100">{g.to}</span>
                                <span className="text-xs text-stone-500 ml-1">· {g.duration}</span>
                                {isSelected && (
                                  <span className="ml-auto inline-flex items-center gap-1 text-xs uppercase tracking-widest text-emerald-400 font-bold">
                                    <Check className="w-3.5 h-3.5" strokeWidth={3} /> Selected
                                  </span>
                                )}
                              </div>
                              {g.routes.length === 1 ? (
                                <p className="text-stone-400 text-sm leading-relaxed">{g.routes[0].note}</p>
                              ) : (
                                <div className="space-y-2">
                                  {g.routes.map((r, j) => <p key={j} className="text-stone-400 text-sm leading-relaxed border-l border-stone-600 pl-3">{r.note}</p>)}
                                </div>
                              )}
                              {!isSelected && (
                                <span className="mt-3 inline-flex items-center gap-2 text-xs uppercase tracking-widest font-bold text-emerald-300 bg-emerald-900/50 border border-emerald-700 px-3 py-1.5">
                                  <Check className="w-3 h-3" strokeWidth={2.5} />
                                  Tap to use this route
                                </span>
                              )}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  );
                })()}

                {altWorkarounds.length > 0 && (
                  <div>
                    <div className="flex items-baseline gap-3 mb-3">
                      <span className="text-amber-400 text-base">⤳</span>
                      <h4 className="font-serif text-lg text-stone-100">Workaround routes</h4>
                      <span className="text-xs uppercase tracking-widest text-stone-500">{altWorkarounds.length}</span>
                    </div>
                    <div className="space-y-3">
                      {altWorkarounds.map((r, i) => {
                        const routeId = `altWorkaround:${i}`;
                        const isSelected = selectedRouteId === routeId;
                        return (
                          <button
                            key={i}
                            onClick={() => !isSelected && selectRoute(routeId)}
                            disabled={isSelected}
                            aria-pressed={isSelected}
                            className={`w-full text-left p-4 transition-all duration-150 block ${
                              isSelected
                                ? "bg-amber-950/50 border-2 border-amber-400 ring-2 ring-amber-500/30 cursor-default"
                                : "bg-stone-800 border border-stone-700 hover:bg-stone-700/80 hover:border-amber-500 hover:ring-2 hover:ring-amber-500/30 cursor-pointer"
                            }`}
                          >
                            <div className="flex items-start justify-between gap-2 mb-2">
                              {r.label ? (
                                <div className="text-xs uppercase tracking-widest text-amber-400">{r.label}</div>
                              ) : <span />}
                              {isSelected && (
                                <span className="inline-flex items-center gap-1 text-xs uppercase tracking-widest text-amber-400 font-bold flex-shrink-0">
                                  <Check className="w-3.5 h-3.5" strokeWidth={3} /> Selected
                                </span>
                              )}
                            </div>
                            {r._kind === "region" && (
                              <div className="text-xs text-amber-300/90 italic mb-2 leading-relaxed">
                                Routed from a different airport in the same country — adapt the first leg to start from {airportLabel(origin)}.
                              </div>
                            )}
                            <div className="flex items-center gap-2 flex-wrap mb-2">
                              <span className="font-serif text-base text-stone-100">{r.from}</span>
                              <ArrowRight className="w-3.5 h-3.5 text-stone-500" strokeWidth={2} />
                              <span className="font-serif text-base text-stone-100">{r.to}</span>
                              {r.duration && r.duration !== "see legs" && (
                                <span className="text-xs text-stone-500 ml-1">· {r.duration}</span>
                              )}
                              {r.legs && r.legs.length > 1 && (
                                <span className="text-xs uppercase tracking-widest text-amber-400/80 ml-1 px-1.5 py-0.5 border border-amber-700/40 rounded-sm">
                                  {r.legs.filter(l => !isTransitLeg(l.route)).length}-flight journey
                                </span>
                              )}
                            </div>
                            <div className="space-y-2 mb-2 pl-3 border-l border-stone-600">
                              {r.legs.map((leg, j) => {
                                const isTransit = isTransitLeg(leg.route);
                                const flightLegs = r.legs.filter(l => !isTransitLeg(l.route));
                                const flightIdx = isTransit ? null : flightLegs.indexOf(leg) + 1;
                                return (
                                  <div key={j} className="text-sm">
                                    <div className="flex items-baseline gap-2">
                                      <span className={`font-serif italic text-xs ${isTransit ? "text-stone-500" : "text-amber-400/70"} flex-shrink-0 w-14`}>
                                        {isTransit ? "transit" : `Leg ${flightIdx}`}
                                      </span>
                                      <div className="flex-1">
                                        <div className="text-stone-100">{leg.route}</div>
                                        <div className="text-stone-500 text-xs">{leg.time} · {leg.airline}</div>
                                      </div>
                                    </div>
                                  </div>
                                );
                              })}
                            </div>
                            <p className="text-stone-400 text-sm leading-relaxed">{r.note}</p>
                            {!isSelected && (
                              <span className="mt-3 inline-flex items-center gap-2 text-xs uppercase tracking-widest font-bold text-amber-300 bg-amber-900/50 border border-amber-700 px-3 py-1.5">
                                <Check className="w-3 h-3" strokeWidth={2.5} />
                                Tap to use this route
                              </span>
                            )}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* No results */}
            {!hasResults && origin !== destination && (
              <div className="bg-stone-800 border border-stone-700 p-6 mb-8">
                <p className="text-stone-300 text-sm leading-relaxed">
                  I don't have a specific cabin route or workaround mapped for {airportLabel(effectiveOrigin)} → {airportLabel(destination)} yet — this guide is built from routes Theo and I have researched, and it's still growing.
                  {(originCabinWarning || destCabinWarning) ? " The airport note above still applies. " : " "}
                  Check the <a href="#airlines" className="text-amber-400 underline decoration-amber-700 underline-offset-4 hover:text-amber-300">airline policies</a> and <a href="#routes" className="text-amber-400 underline decoration-amber-700 underline-offset-4 hover:text-amber-300">routes</a> sections, or <a href="#contact" className="text-amber-400 underline decoration-amber-700 underline-offset-4 hover:text-amber-300">tell me</a> the route you need and I'll look into it.
                </p>
              </div>
            )}

            {/* Checklist anchor — used for smooth-scroll target after route selection */}
            {origin !== destination && (
              <div id="planner-checklist-anchor" className="scroll-mt-24">
                {/* No route selected yet — gentle prompt */}
                {!selectedRoute && hasResults && (
                  <div className="bg-stone-800 border border-dashed border-stone-600 p-6 text-center">
                    <FileCheck className="w-6 h-6 text-stone-500 mx-auto mb-2" strokeWidth={1.5} />
                    <p className="font-serif text-stone-200 text-lg mb-1">Pick a route above</p>
                    <p className="text-stone-400 text-sm leading-relaxed max-w-md mx-auto">
                      Once you've chosen the route you want to fly, we'll build a tailored prep checklist for just that journey — covering every country your pet legally enters.
                    </p>
                  </div>
                )}

                {/* Selected route → tailored checklist */}
                {selectedRoute && (() => {
                  if (!originAirport || !destAirport) return null;
                  // Transit regions are ONLY those from the chosen route — not
                  // every workaround. This is what makes the checklist properly
                  // tailored: pick "via Paris" and you get France paperwork;
                  // pick a direct route and you skip transit entirely.
                  const transitRegions = (selectedRoute.tags || [])
                    .filter((t) => t !== originAirport.region && t !== destAirport.region);

                  // Pass the route's legs so getTransitNotes can identify the
                  // SPECIFIC transit country (e.g. France via CDG) and surface
                  // country-specific warnings (breed bans, tapeworm reqs).
                  // Direct routes don't have legs — pass [] in that case.
                  const routeLegs = (selectedRoute.route && selectedRoute.route.legs) || [];

                  const combined = buildRouteChecklist(
                    originAirport.region,
                    destAirport.region,
                    REGION_LABELS_SHORT[originAirport.region] || originAirport.region,
                    REGION_LABELS_SHORT[destAirport.region] || destAirport.region,
                    petType,
                    transitRegions,
                    routeLegs
                  );

                  // If the user added tapeworm dates via the calculator, add
                  // them as their OWN clearly-titled section at the top of the
                  // checklist. This mutates the `combined` object that feeds
                  // BOTH the on-screen preview AND the printable PDF, so the
                  // dated section appears in both — as the calculator promises.
                  if (tapewormAdded && tapewormResult && combined.sections && combined.sections.length > 0) {
                    const datedLine =
                      `Tapeworm treatment — vet must treat &amp; record between ` +
                      `<strong>${tapewormResult.earliestStr}</strong> and ` +
                      `<strong>${tapewormResult.latestStr}</strong> (${tapewormResult.treatLabel}). ` +
                      `Valid only if you land in ${tapewormResult.destName} by ` +
                      `${tapewormResult.cutoffStr} ${tapewormResult.destLabel}.`;
                    // Avoid double-insertion on re-render.
                    const alreadyThere = combined.sections.some((s) =>
                      s.title === "Tapeworm treatment — your dates"
                    );
                    if (!alreadyThere) {
                      combined.sections.unshift({
                        title: "Tapeworm treatment — your dates",
                        items: [datedLine],
                      });
                    }
                  }
                  if (!combined.sections || combined.sections.length === 0) {
                    return (
                      <div className="bg-amber-950/40 border border-amber-800/50 p-5">
                        <p className="text-stone-400 text-sm italic">
                          Country-specific prep isn't yet wired for this exact route — use the checklist section below for the closest match.
                        </p>
                      </div>
                    );
                  }

                  // Count total items (excluding divider sections) for the
                  // download-CTA copy.
                  const totalItems = combined.sections
                    .filter((s) => !s.divider)
                    .reduce((sum, s) => sum + s.items.length, 0);
                  const sectionCount = combined.sections.filter((s) => !s.divider).length;
                  const PREVIEW_ITEMS = 2; // items shown per section before "show all"

                  let inTipsBlock = false;
                  return (
                    <div className="bg-amber-950/40 border-2 border-amber-700 p-5 md:p-6">
                      {/* HEADER — explains what this is + download CTA at the TOP */}
                      <div className="flex items-start gap-3 mb-4">
                        <FileCheck className="w-6 h-6 text-amber-400 flex-shrink-0 mt-1" strokeWidth={1.75} />
                        <div className="flex-1">
                          <div className="text-xs uppercase tracking-widest text-amber-400 mb-1">Your tailored checklist</div>
                          <div className="font-serif text-stone-100 text-xl mb-1">
                            {airportLabel(selectedRoute.from || origin)} → {airportLabel(selectedRoute.to || destination)}
                          </div>
                          <p className="text-stone-300 text-sm leading-relaxed">
                            {totalItems} items across {sectionCount} stages, covering every country your pet legally enters on this route.
                          </p>
                        </div>
                      </div>

                      {/* DOWNLOAD CTA — at the top, where people actually look */}
                      <div className="bg-amber-900/40 border border-amber-700/60 p-4 mb-6 flex flex-col sm:flex-row sm:items-center gap-3">
                        <button
                          onClick={() => {
                            if (typeof window !== "undefined" && window.gtag) {
                              window.gtag("event", "journey_checklist_downloaded", {
                                event_category: "journey_planner",
                                route_kind: selectedRoute.kind,
                                route_from: selectedRoute.from,
                                route_to: selectedRoute.to,
                              });
                            }
                            openChecklistPrintable(combined);
                          }}
                          className="inline-flex items-center justify-center gap-2 bg-amber-600 hover:bg-amber-500 text-stone-50 px-5 py-3 text-sm uppercase tracking-widest font-medium transition-colors flex-shrink-0"
                        >
                          <FileCheck className="w-4 h-4" strokeWidth={2} />
                          Download printable PDF
                        </button>
                        <p className="text-stone-300 text-xs leading-relaxed sm:flex-1">
                          Opens in a new tab — use your browser's "Print / Save as PDF" from there. The PDF has everything; what you see below is a preview.
                        </p>
                      </div>

                      {/* CHANGE ROUTE link */}
                      {selectableRoutes.length > 1 && (
                        <button
                          onClick={() => {
                            setSelectedRouteId(null);
                            setExpandedSections(new Set());
                          }}
                          className="text-xs text-stone-400 hover:text-stone-200 mb-4 underline decoration-stone-600 underline-offset-2 hover:decoration-stone-300"
                        >
                          ← Change route
                        </button>
                      )}

                      {/* PREVIEW HEADING — makes clear this is a summary, not
                          the full checklist (the full version is the PDF above). */}
                      <div className="border-t border-amber-800/40 pt-5 mb-4">
                        <div className="text-sm uppercase tracking-widest text-amber-400 font-medium">
                          Checklist preview
                        </div>
                        <p className="text-stone-400 text-xs leading-relaxed mt-1">
                          A shortened summary — each stage shows the first couple of items. Download the full version above for everything, in order, ready to print.
                        </p>
                      </div>

                      {/* PREVIEW — sections truncated to 2 items each */}
                      <div className="space-y-5">
                        {combined.sections.map((s, i) => {
                          // Chapter dividers — render as prominent header bands.
                          if (s.divider) {
                            const isTipsChapter = s.title.toLowerCase().includes("tips");
                            if (isTipsChapter) inTipsBlock = true;
                            return (
                              <div key={i} className={isTipsChapter ? "mt-4 pt-3 border-t border-stone-700 -mb-3" : "mt-6"}>
                                <div className={isTipsChapter
                                  ? "text-xs uppercase tracking-widest text-stone-500 mb-1"
                                  : "font-serif text-stone-50 text-lg bg-stone-900 -mx-5 px-5 py-3 mb-3"}>
                                  {s.title}
                                </div>
                                {s.items[0] && (
                                  <p className={isTipsChapter
                                    ? "text-stone-500 text-xs italic"
                                    : "text-stone-400 text-xs italic mb-3"}>
                                    {s.items[0]}
                                  </p>
                                )}
                              </div>
                            );
                          }
                          const sectionStyle = inTipsBlock
                            ? "text-xs uppercase tracking-widest text-stone-500 mb-2"
                            : "text-xs uppercase tracking-widest text-amber-400 mb-2 pb-1.5 border-b border-amber-800/40";
                          const itemStyle = inTipsBlock
                            ? "flex gap-2 text-stone-400 text-xs leading-snug italic"
                            : "flex gap-2 text-stone-300 text-sm leading-snug";
                          const isExpanded = expandedSections.has(i);
                          const visibleItems = isExpanded ? s.items : s.items.slice(0, PREVIEW_ITEMS);
                          const hiddenCount = s.items.length - PREVIEW_ITEMS;
                          return (
                            <div key={i}>
                              <div className={sectionStyle}>{s.title}</div>
                              <ul className="space-y-1.5">
                                {visibleItems.map((item, j) => (
                                  <li key={j} className={itemStyle}>
                                    <span className={inTipsBlock ? "text-stone-500 flex-shrink-0 mt-0.5" : "text-amber-500 flex-shrink-0 mt-0.5"}>{inTipsBlock ? "·" : "✓"}</span>
                                    <span className="[&_a]:text-amber-400 [&_a]:underline [&_a]:decoration-amber-500/40 [&_a]:underline-offset-2 [&_a:hover]:text-amber-300" dangerouslySetInnerHTML={{ __html: item }} />
                                  </li>
                                ))}
                              </ul>
                              {hiddenCount > 0 && (
                                <button
                                  onClick={() => {
                                    setExpandedSections((prev) => {
                                      const next = new Set(prev);
                                      if (next.has(i)) next.delete(i); else next.add(i);
                                      return next;
                                    });
                                  }}
                                  className="mt-2 ml-5 text-xs uppercase tracking-widest text-amber-400/80 hover:text-amber-300 transition-colors inline-flex items-center gap-1"
                                >
                                  {isExpanded ? `Show less ↑` : `Show all ${s.items.length} items ↓`}
                                </button>
                              )}
                            </div>
                          );
                        })}
                      </div>

                      {/* SECONDARY DOWNLOAD CTA at the bottom too */}
                      <div className="pt-5 mt-6 border-t border-amber-800/40 text-center">
                        <button
                          onClick={() => {
                            if (typeof window !== "undefined" && window.gtag) {
                              window.gtag("event", "journey_checklist_downloaded", {
                                event_category: "journey_planner",
                                route_kind: selectedRoute.kind,
                                route_from: selectedRoute.from,
                                route_to: selectedRoute.to,
                                position: "bottom",
                              });
                            }
                            openChecklistPrintable(combined);
                          }}
                          className="inline-flex items-center gap-2 text-amber-400 hover:text-amber-300 text-sm font-medium underline decoration-amber-700 underline-offset-4 hover:decoration-amber-400"
                        >
                          <FileCheck className="w-4 h-4" strokeWidth={2} />
                          Download the full checklist as a printable PDF
                        </button>
                      </div>
                    </div>
                  );
                })()}
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
}

function Routes() {
  const [filter, setFilter] = useState("all");
  const [direction, setDirection] = useState("from"); // "from" or "to"

  const ROUTE_FILTERS = [
    { id: "all", label: "All routes", flag: "" },
    { id: "uk-out", label: "Out of UK", flag: "🇬🇧" },
    { id: "us", label: "US", flag: "🇺🇸" },
    { id: "india", label: "India", flag: "🇮🇳" },
    { id: "europe", label: "Europe", flag: "🇪🇺" },
    { id: "canada", label: "Canada", flag: "🇨🇦" },
    { id: "mexico", label: "Mexico", flag: "🇲🇽" },
    { id: "dubai", label: "Dubai / UAE", flag: "🇦🇪" },
    { id: "caribbean", label: "Caribbean", flag: "🌴" },
    { id: "hawaii", label: "Hawaii", flag: "🌺" },
    { id: "south-africa", label: "South Africa", flag: "🇿🇦" },
  ];

  // Extract a clean grouping key from "City (CODE)" or "City / City" strings
  const getCityKey = (s) => {
    if (!s) return "";
    // Take first part before paren, slash, or "via"
    return s.split(/\s*\(|\s*\/\s*|\s+via\s+/i)[0].trim();
  };

  // Group an array of routes by city (from or to depending on direction)
  const groupByCity = (routes, dir) => {
    const groups = {};
    routes.forEach((r) => {
      const key = getCityKey(dir === "from" ? r.from : r.to);
      if (!groups[key]) groups[key] = [];
      groups[key].push(r);
    });
    return Object.keys(groups)
      .sort()
      .map((city) => ({ city, routes: groups[city] }));
  };

  // Region → keywords that identify cities/airports in that region.
  // When user picks a region filter, we check whether the FROM (or TO, depending on toggle)
  // contains one of these keywords. This way the filter respects the direction toggle.
  const REGION_CITIES = {
    "uk-out": ["London", "Manchester", "Glasgow", "Edinburgh", "(LHR)", "(MAN)", "(LGW)", "(GLA)", "(EDI)", "UK"],
    "us": ["New York", "Miami", "Chicago", "Los Angeles", "Boston", "San Francisco", "Washington", "Baltimore", "Newark", "Seattle", "(JFK)", "(MIA)", "(ORD)", "(LAX)", "(BOS)", "(SFO)", "(IAD)", "(BWI)", "(EWR)", "(SEA)", "USA"],
    "india": ["Delhi", "Mumbai", "Bangalore", "Bengaluru", "Chennai", "Kolkata", "Hyderabad", "(DEL)", "(BOM)", "(BLR)", "(MAA)", "(CCU)", "(HYD)"],
    "europe": ["Paris", "Amsterdam", "Frankfurt", "Munich", "Zurich", "Warsaw", "Lisbon", "Porto", "Rome", "Milan", "Madrid", "Barcelona", "Istanbul", "Oslo", "(CDG)", "(AMS)", "(FRA)", "(MUC)", "(ZRH)", "(WAW)", "(LIS)", "(OPO)", "(FCO)", "(MXP)", "(MAD)", "(BCN)", "(IST)", "(OSL)", "Norway"],
    "canada": ["Toronto", "Montreal", "Vancouver", "(YYZ)", "(YUL)", "(YVR)"],
    "dubai": ["Dubai", "Abu Dhabi", "(DXB)", "(AUH)", "UAE"],
    "caribbean": ["Nassau", "Punta Cana", "Santo Domingo", "Montego Bay", "Kingston", "Bridgetown", "Cayman", "Aruba", "Curacao", "San Juan", "(NAS)", "(PUJ)", "(SDQ)", "(MBJ)", "(KIN)", "(BGI)", "(GCM)", "(AUA)", "(CUR)", "(SJU)", "Bahamas", "Jamaica", "Dominican Republic", "Cayman Islands"],
    "mexico": ["Mexico City", "Cancún", "Cancun", "Guadalajara", "(MEX)", "(CUN)", "(GDL)", "Mexico"],
    "hawaii": ["Honolulu", "Kahului", "Maui", "Kauai", "(HNL)", "(OGG)", "Hawaii"],
    "south-africa": ["Johannesburg", "Cape Town", "Durban", "George", "(JNB)", "(CPT)", "(DUR)", "(GRJ)", "South Africa"],
    "south-america": ["São Paulo", "Sao Paulo", "Buenos Aires", "Santiago", "Bogotá", "Bogota", "Lima", "Montevideo", "Rio de Janeiro", "Quito", "(GRU)", "(GIG)", "(EZE)", "(SCL)", "(BOG)", "(LIM)", "(MVD)", "(UIO)", "South America", "Brazil", "Argentina", "Chile", "Colombia", "Peru", "Ecuador", "Uruguay"],
    "central-america": ["Panama City", "Panama", "(PTY)", "Central America"],
    "japan": ["Tokyo", "Osaka", "Nagoya", "Fukuoka", "Sapporo", "Naha", "Okinawa", "Seoul", "(NRT)", "(HND)", "(KIX)", "(NGO)", "(FUK)", "(ITM)", "(CTS)", "(OKA)", "(ICN)", "Japan"],
  };

  // Check whether a single field value (e.g. "London (LHR)") belongs to a region
  const fieldMatchesRegion = (fieldValue, regionId) => {
    if (!fieldValue || !REGION_CITIES[regionId]) return false;
    return REGION_CITIES[regionId].some((kw) =>
      fieldValue.toLowerCase().includes(kw.toLowerCase())
    );
  };

  // For workarounds: check the destination of any leg, not just the top-level to/from
  const workaroundMatchesRegion = (route, regionId, dir) => {
    if (dir === "from") {
      return fieldMatchesRegion(route.from, regionId);
    }
    return fieldMatchesRegion(route.to, regionId);
  };

  const applyFilter = (routes, isWorkaround) => {
    if (filter === "all") return routes;
    return routes.filter((r) => {
      if (isWorkaround) {
        return workaroundMatchesRegion(r, filter, direction);
      }
      const fieldToCheck = direction === "from" ? r.from : r.to;
      return fieldMatchesRegion(fieldToCheck, filter);
    });
  };

  const filteredDirect = applyFilter(DIRECT_ROUTES, false);
  // Combine hand-written + generated workarounds so the Routes section has the
  // same coverage floor as the journey planner. De-dupe generated entries
  // whose destination airport is already covered by a hand-written workaround.
  const handWrittenDestCodes = WORKAROUND_ROUTES_TABLE
    .map((r) => (r.to.match(/\(([A-Z]{3})\)/) || [])[1])
    .filter(Boolean);
  const dedupedGenerated = ALL_GENERATED_WORKAROUNDS.filter((r) => {
    const code = (r.to.match(/\(([A-Z]{3})\)/) || [])[1];
    return !code || !handWrittenDestCodes.includes(code);
  });
  const allWorkarounds = [...WORKAROUND_ROUTES_TABLE, ...dedupedGenerated];
  const filteredWorkarounds = applyFilter(allWorkarounds, true);
  const totalFiltered = filteredDirect.length + filteredWorkarounds.length;
  const totalAll = DIRECT_ROUTES.length + allWorkarounds.length;

  const directGrouped = groupByCity(filteredDirect, direction);
  const workaroundsGrouped = groupByCity(filteredWorkarounds, direction);

  return (
    <section id="routes" className="py-20 px-6 md:px-12 bg-white border-y border-stone-300">
      <div className="max-w-5xl mx-auto">
        <div className="flex items-baseline gap-3 mb-6">
          <span className="font-serif italic text-stone-400 text-lg">★</span>
          <span className="uppercase tracking-[0.25em] text-xs font-medium text-stone-600">Routes & journey times</span>
          <div className="flex-1 h-px bg-stone-300" />
        </div>

        <h2 className="font-serif text-5xl text-stone-900 mb-4 max-w-3xl">
          How long is the flight?
        </h2>
        <p className="font-serif italic text-stone-600 text-lg mb-8 max-w-2xl">
          Cabin-friendly routes only. Direct cabin flights below, followed by multi-leg workarounds for journeys with no direct cabin option. Pet travel adds 2–3 hours of airport time for check-in and customs.
        </p>

        <div className="bg-rose-50 border-l-2 border-rose-400 px-5 py-4 mb-8 max-w-3xl">
          <div className="flex items-start gap-3">
            <Info className="w-5 h-5 text-rose-500 flex-shrink-0 mt-0.5" strokeWidth={1.75} />
            <div>
              <div className="font-serif text-stone-900 mb-1">A note from Theo's Mum on long flights.</div>
              <p className="text-stone-700 text-sm leading-relaxed">
                If your route is longer than <strong>7–8 hours</strong>, consider a stopover at a dog-friendly hotel before the next flight. Theo did 7h 30m London→Montreal, slept properly, walked on grass, drank from a real bowl — then the short hop to Miami the next morning felt like nothing. Two short flights with rest in between is genuinely kinder than one long haul, both for your pet and for you.
              </p>
            </div>
          </div>
        </div>

        {/* Filter chips for the routes list. */}
        <div className="mb-6">
          <div className="flex items-center justify-between gap-3 mb-3 flex-wrap">
            <div className="text-xs uppercase tracking-widest text-stone-500">Filter by region</div>
            <div className="text-stone-500 text-xs italic font-serif">
              Showing {totalFiltered} of {totalAll}
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            {ROUTE_FILTERS.map((f) => {
              const isActive = filter === f.id;
              return (
                <button
                  key={f.id}
                  onClick={() => {
                    setFilter(f.id);
                    // GA4 — track which region filter people pick in the
                    // Routes ("How long is the flight?") section.
                    if (typeof window !== "undefined" && window.gtag) {
                      window.gtag("event", "route_filter_selected", {
                        event_category: "routes_section",
                        filter: f.id,
                        filter_label: f.label,
                      });
                    }
                  }}
                  className={`px-4 py-2 text-sm transition-all border ${
                    isActive
                      ? "bg-stone-900 text-stone-50 border-stone-900"
                      : "bg-white text-stone-700 border-stone-300 hover:border-stone-900"
                  }`}
                >
                  {f.flag && <span className="mr-1.5">{f.flag}</span>}
                  <span className="font-serif">{f.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        <div className="mb-10">
          <div className="text-xs uppercase tracking-widest text-stone-500 mb-3">Group by</div>
          <div className="inline-flex border border-stone-300 bg-white">
            <button
              onClick={() => setDirection("from")}
              className={`px-5 py-2 text-sm transition-all ${
                direction === "from"
                  ? "bg-stone-900 text-stone-50"
                  : "bg-white text-stone-700 hover:bg-stone-50"
              }`}
            >
              <span className="font-serif">↗ Departing from</span>
            </button>
            <button
              onClick={() => setDirection("to")}
              className={`px-5 py-2 text-sm transition-all border-l border-stone-300 ${
                direction === "to"
                  ? "bg-stone-900 text-stone-50"
                  : "bg-white text-stone-700 hover:bg-stone-50"
              }`}
            >
              <span className="font-serif">↘ Arriving into</span>
            </button>
          </div>
          <p className="text-stone-500 text-sm mt-2 italic font-serif">
            {filter === "all"
              ? (direction === "from"
                ? "Cities listed alphabetically. Use a region filter above to narrow."
                : "Cities listed alphabetically. Use a region filter above to narrow.")
              : (direction === "from"
                ? "Showing cities people depart FROM within the selected region, alphabetically."
                : "Showing cities people arrive INTO within the selected region, alphabetically.")}
          </p>
        </div>

        {/* DIRECT CABIN ROUTES */}
        <div className="mb-12">
          <div className="flex items-baseline gap-3 mb-4">
            <span className="font-serif italic text-stone-500 text-base">→</span>
            <h3 className="font-serif text-2xl text-stone-900">Direct cabin flights</h3>
            <span className="text-xs uppercase tracking-widest text-stone-400">{filteredDirect.length} routes</span>
          </div>
          <p className="text-stone-600 text-sm italic font-serif mb-5 max-w-2xl">
            Single-leg flights where your pet flies in cabin with you the whole way. Simplest option when available.
          </p>

          {filteredDirect.length === 0 ? (
            <div className="border border-stone-300 px-6 py-10 text-center text-stone-500 font-serif italic">
              {filter === "uk-out" && direction === "to" ? (
                <><strong className="text-stone-800 not-italic">The UK government doesn't allow cabin pets on any inbound flight.</strong> No commercial airline can do it. The workaround route — fly cabin into Paris/Amsterdam, then Eurotunnel — is shown below.</>
              ) : filter === "dubai" && direction === "to" ? (
                <>No direct cabin flights INTO Dubai (DXB) exist on any airline (UAE law — cargo only into DXB). See workaround routes below — fly cabin into Abu Dhabi (AUH) via Etihad, then 90-minute road transfer to Dubai.</>
              ) : (
                <>No direct cabin routes match this combination. Try a workaround below or <a href="#contact" className="text-amber-700 underline decoration-amber-300 underline-offset-4 hover:text-amber-800 transition-colors">ask me</a> to add one.</>
              )}
            </div>
          ) : (
            <div className="space-y-6">
              {directGrouped.map((group) => (
                <div key={group.city} className="border border-stone-300">
                  <div className="bg-stone-900 text-stone-50 px-6 py-3 flex items-baseline justify-between">
                    <div className="font-serif text-base">
                      <span className="text-stone-400 text-xs uppercase tracking-widest mr-3">
                        {direction === "from" ? "Departing from" : "Arriving into"}
                      </span>
                      {group.city}
                    </div>
                    <div className="text-xs text-stone-400 uppercase tracking-widest">
                      {group.routes.length} {group.routes.length === 1 ? "route" : "routes"}
                    </div>
                  </div>
                  <div className="hidden md:grid grid-cols-12 gap-4 bg-stone-100 px-6 py-3 border-b border-stone-300 text-xs uppercase tracking-widest text-stone-600 font-medium text-center">
                    <div className="col-span-3">From</div>
                    <div className="col-span-3">To</div>
                    <div className="col-span-2">Flight time</div>
                    <div className="col-span-4">Notes</div>
                  </div>
                  {group.routes.map((r, i) => (
                    <div key={i} className="grid md:grid-cols-12 gap-2 md:gap-4 px-6 py-5 border-b border-stone-200 last:border-b-0 hover:bg-stone-50 transition-colors items-center text-center">
                      <div className="md:col-span-3 font-serif text-stone-900">{r.from}</div>
                      <div className="md:col-span-3 font-serif text-stone-900 flex md:block items-center gap-2 justify-center">
                        <ArrowRight className="md:hidden w-3 h-3 text-stone-400" />
                        <span className="hidden md:inline mr-2">→</span>
                        <span className="md:hidden text-stone-500 text-xs uppercase tracking-wider">To: </span>
                        {r.to}
                      </div>
                      <div className="md:col-span-2 text-amber-700 font-medium">{r.duration}</div>
                      <div className="md:col-span-4 text-stone-600 text-sm italic font-serif md:text-left">{r.note}</div>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* WORKAROUND ROUTES */}
        <div className="mb-6">
          <div className="flex items-baseline gap-3 mb-4">
            <span className="font-serif italic text-stone-500 text-base">⤳</span>
            <h3 className="font-serif text-2xl text-stone-900">Workaround routes</h3>
            <span className="text-xs uppercase tracking-widest text-stone-400">{filteredWorkarounds.length} routes</span>
          </div>
          <p className="text-stone-600 text-sm italic font-serif mb-5 max-w-2xl">
            Multi-leg journeys where cabin works on each leg via a hub — often the only way to fly cabin on a long-haul route. These are some of the most popular and shortest options for pet comfort; there may be others that suit your specific trip. An overnight stop is recommended for journeys over 7 hours.
          </p>

          {filteredWorkarounds.length === 0 ? (
            <div className="border border-stone-300 px-6 py-10 text-center text-stone-500 font-serif italic">
              No workaround routes match this filter. <a href="#contact" className="text-amber-700 underline decoration-amber-300 underline-offset-4 hover:text-amber-800 transition-colors">Ask me</a> to add one.
            </div>
          ) : (
            <div className="space-y-6">
              {workaroundsGrouped.map((group) => (
                <div key={group.city}>
                  <div className="bg-stone-900 text-stone-50 px-6 py-3 flex items-baseline justify-between mb-4">
                    <div className="font-serif text-base">
                      <span className="text-stone-400 text-xs uppercase tracking-widest mr-3">
                        {direction === "from" ? "Departing from" : "Arriving into"}
                      </span>
                      {group.city}
                    </div>
                    <div className="text-xs text-stone-400 uppercase tracking-widest">
                      {group.routes.length} {group.routes.length === 1 ? "route" : "routes"}
                    </div>
                  </div>
                  <div className="space-y-4">
                    {group.routes.map((r, i) => (
                      <div key={i} className="border border-stone-300 bg-amber-50/30 p-6">
                        <div className="flex flex-wrap items-baseline justify-between gap-3 mb-4 pb-4 border-b border-stone-200">
                          <div className="font-serif text-xl text-stone-900 flex items-baseline gap-3 flex-wrap">
                            <span>{r.from} <span className="text-stone-400 mx-2">→</span> {r.to}</span>
                            {r.legs && r.legs.length > 1 && (
                              <span className="text-xs uppercase tracking-widest text-amber-700 px-2 py-0.5 border border-amber-600/40 rounded-sm font-sans not-italic">
                                {r.legs.filter(l => !isTransitLeg(l.route)).length}-flight journey
                              </span>
                            )}
                          </div>
                          {r.duration && r.duration !== "see legs" && (
                            <div className="text-amber-700 font-medium text-sm uppercase tracking-widest">
                              Total: {r.duration}
                            </div>
                          )}
                        </div>

                        <div className="hidden md:grid grid-cols-12 gap-3 text-[10px] uppercase tracking-widest text-stone-500 font-medium mb-2 pb-1 border-b border-stone-200">
                          <div className="col-span-1">Leg</div>
                          <div className="col-span-4">Route</div>
                          <div className="col-span-2">Time</div>
                          <div className="col-span-5">Airline / notes</div>
                        </div>

                        <div className="space-y-2 mb-4">
                          {r.legs.map((leg, j) => {
                            const isTransit = isTransitLeg(leg.route);
                            const flightLegs = r.legs.filter(l => !isTransitLeg(l.route));
                            const flightIdx = isTransit ? null : flightLegs.indexOf(leg) + 1;
                            return (
                              <div key={j} className={`grid grid-cols-12 gap-3 text-sm items-center ${isTransit ? "bg-stone-50/60 py-1.5 px-2 -mx-2 rounded-sm" : ""}`}>
                                <div className={`col-span-2 md:col-span-1 font-serif italic text-xs ${isTransit ? "text-stone-500" : "text-amber-700"}`}>
                                  {isTransit ? "transit" : `Leg ${flightIdx}`}
                                </div>
                                <div className="col-span-10 md:col-span-4 font-medium text-stone-900">{leg.route}</div>
                                <div className="col-span-5 md:col-span-2 text-stone-600 font-medium">{leg.time}</div>
                                <div className="col-span-7 md:col-span-5 text-stone-700 italic font-serif">{leg.airline}</div>
                              </div>
                            );
                          })}
                        </div>

                        <p className="text-stone-700 text-sm italic font-serif leading-relaxed">{r.note}</p>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <p className="text-stone-500 text-sm mt-6 italic font-serif text-center">
          Don't see your route? <a href="#contact" className="text-amber-700 underline decoration-amber-300 underline-offset-4 hover:text-amber-800 transition-colors">Ask me</a> — I'll add it.
        </p>
      </div>
    </section>
  );
}

const WORKAROUND_ROUTES = [
  {
    title: "London → Paris → USA",
    summary: "Air France cabin both legs",
    legs: [
      { from: "🇬🇧 LHR", to: "🇫🇷 CDG", duration: "1h 20m", airline: "Air France", note: "Cabin" },
      { from: "🇫🇷 CDG", to: "🇺🇸 JFK/MIA/LAX", duration: "7h 45m – 11h", airline: "Air France", note: "Cabin" },
    ],
    fees: "~€100 + €200 = ~€300 total",
    bestFor: "UK pet owners going to the USA who want minimal hassle. Same airline, same booking, smooth connection at Paris.",
    weight: "Combined max 8 kg both legs",
    accent: "amber",
  },
  {
    title: "London → Montreal → Miami (Theo's Mum's route)",
    summary: "Air Canada cabin out, AA / Air Canada / United onward",
    legs: [
      { from: "🇬🇧 LHR", to: "🇨🇦 YUL", duration: "7h 15m", airline: "Air Canada", note: "Cabin" },
      { from: "🇨🇦 YUL", to: "🇺🇸 MIA", duration: "3h 30m", airline: "AC / AA / United", note: "Cabin (next day)" },
    ],
    fees: "~CAD $118 + ~$150 = ~$240 USD total",
    bestFor: "UK pet owners going anywhere in North America. Overnight in dog-friendly Montreal hotel is a real recovery break for both of you.",
    weight: "Max 10 kg combined (Air Canada limit applies)",
    accent: "rose",
  },
  {
    title: "London → Lisbon → onward",
    summary: "TAP cabin from Heathrow, Lisbon onward hub",
    legs: [
      { from: "🇬🇧 LHR", to: "🇵🇹 LIS", duration: "2h 45m", airline: "TAP Air Portugal", note: "Cabin" },
      { from: "🇵🇹 LIS", to: "🇧🇷 / 🇺🇸 / 🇲🇦", duration: "Varies", airline: "TAP", note: "Cabin onward" },
    ],
    fees: "~€75 + €100–€200 onward",
    bestFor: "Moving to Portugal direct, or connecting to Brazil, Morocco, USA via Lisbon. Snub-nosed breeds welcome.",
    weight: "Combined max 8 kg",
    accent: "amber",
  },
  {
    title: "London → Frankfurt → India / USA / Asia",
    summary: "Lufthansa cabin both legs",
    legs: [
      { from: "🇬🇧 LHR", to: "🇩🇪 FRA", duration: "1h 35m", airline: "Lufthansa", note: "Cabin" },
      { from: "🇩🇪 FRA", to: "🇮🇳 DEL / 🇺🇸 / 🇯🇵", duration: "8–14h", airline: "Lufthansa", note: "Cabin" },
    ],
    fees: "~€110 + €110–€300 = ~€220–€410",
    bestFor: "Long-haul UK departures to almost anywhere east. Lufthansa allows the slightly larger 55×40×23 cm carrier.",
    weight: "Combined max 8 kg",
    accent: "rose",
  },
  {
    title: "Delhi → Warsaw → USA",
    summary: "LOT Polish cabin both legs — cheapest long-haul",
    legs: [
      { from: "🇮🇳 DEL", to: "🇵🇱 WAW", duration: "8h", airline: "LOT Polish", note: "Cabin €50" },
      { from: "🇵🇱 WAW", to: "🇺🇸 JFK / ORD / LAX", duration: "10–12h", airline: "LOT Polish", note: "Cabin €70" },
    ],
    fees: "€50 + €70 = €120 total (cheapest cabin to USA from India)",
    bestFor: "Indian families moving to the US who don't want to pay long-haul cabin premiums. Same airline both legs.",
    weight: "Combined max 8 kg",
    accent: "amber",
  },
  {
    title: "Delhi → Zurich → USA",
    summary: "SWISS cabin both legs, snub-nosed welcome",
    legs: [
      { from: "🇮🇳 DEL", to: "🇨🇭 ZRH", duration: "8h 30m", airline: "SWISS", note: "Cabin" },
      { from: "🇨🇭 ZRH", to: "🇺🇸 JFK / LAX / ORD / MIA", duration: "8–13h", airline: "SWISS", note: "Cabin" },
    ],
    fees: "$60–$120 each leg = ~$120–$240",
    bestFor: "Brachycephalic (snub-nosed) dogs and cats — SWISS uniquely allows them in cabin where most airlines force them to cargo.",
    weight: "Combined max 8 kg",
    accent: "rose",
  },
  {
    title: "Mumbai → Amsterdam → USA",
    summary: "KLM cabin both legs",
    legs: [
      { from: "🇮🇳 BOM", to: "🇳🇱 AMS", duration: "9h 15m", airline: "KLM", note: "Cabin" },
      { from: "🇳🇱 AMS", to: "🇺🇸 JFK / ATL / IAH", duration: "8–10h", airline: "KLM", note: "Cabin" },
    ],
    fees: "~€100 + €200 = ~€300",
    bestFor: "Pet owners coming from western India (Mumbai-based). KLM's Amsterdam hub has good onward connections to US east coast.",
    weight: "Combined max 8 kg (46×28×24 cm carrier)",
    accent: "amber",
  },
  {
    title: "Paris → UK via Eurotunnel (the return)",
    summary: "Cabin into Paris, then drive/Eurostar home",
    legs: [
      { from: "🇺🇸 / 🇮🇳", to: "🇫🇷 CDG", duration: "Varies", airline: "Air France / KLM", note: "Cabin" },
      { from: "🇫🇷 CDG", to: "🇬🇧 UK", duration: "5–10h via car + Eurotunnel", airline: "Drive + Eurotunnel", note: "Pet stays in car" },
    ],
    fees: "Airline fee + £25–£60 Eurotunnel",
    bestFor: "Returning to UK from anywhere — UK doesn't allow cabin entry, but Eurotunnel does. Pet stays with you the whole way.",
    weight: "No weight limit on Eurotunnel — any size dog",
    accent: "rose",
  },
];

function Workarounds() {
  return (
    <section id="workarounds" className="py-20 px-6 md:px-12 bg-amber-50/30 border-y border-stone-300">
      <div className="max-w-5xl mx-auto">
        <div className="flex items-baseline gap-3 mb-6">
          <span className="font-serif italic text-stone-400 text-lg">◆</span>
          <span className="uppercase tracking-[0.25em] text-xs font-medium text-amber-700">Popular workarounds</span>
          <div className="flex-1 h-px bg-stone-300" />
        </div>

        <h2 className="font-serif text-5xl text-stone-900 mb-4 max-w-3xl">
          The clever routes,<br /><span className="italic text-stone-600">visualised.</span>
        </h2>
        <p className="font-serif italic text-stone-600 text-lg mb-12 max-w-2xl">
          When direct flights don't allow cabin pets, smart multi-leg routes do. These are some of the most popular and shortest workaround journeys — chosen for pet comfort — but they're not the only ones. There may be other routes that work for you, so treat these as a starting point.
        </p>

        <div className="grid md:grid-cols-2 gap-6">
          {WORKAROUND_ROUTES.map((r, i) => {
            const accentBorder = r.accent === "amber" ? "border-amber-300" : "border-rose-300";
            const accentBg = r.accent === "amber" ? "bg-amber-50" : "bg-rose-50";
            const accentText = r.accent === "amber" ? "text-amber-800" : "text-rose-800";
            return (
              <div key={i} className={`bg-white border ${accentBorder} p-6 hover:shadow-lg transition-shadow`}>
                <div className={`inline-block px-2.5 py-1 text-xs uppercase tracking-widest font-medium ${accentBg} ${accentText} mb-3`}>
                  Route {String(i + 1).padStart(2, "0")}
                </div>
                <h3 className="font-serif text-2xl text-stone-900 mb-2 leading-tight">{r.title}</h3>
                <p className="font-serif italic text-stone-600 text-sm mb-5">{r.summary}</p>

                <div className="space-y-3 mb-5 pb-5 border-b border-stone-200">
                  {r.legs.map((leg, j) => (
                    <div key={j} className="flex flex-col gap-1">
                      <div className="flex items-center gap-2 text-stone-900">
                        <span className="font-serif text-base">{leg.from}</span>
                        <ArrowRight className="w-3 h-3 text-stone-400" strokeWidth={2} />
                        <span className="font-serif text-base">{leg.to}</span>
                      </div>
                      <div className="flex items-center gap-3 text-xs text-stone-600 pl-1">
                        <span className="font-medium">{leg.airline}</span>
                        <span className="text-stone-400">·</span>
                        <span>{leg.duration}</span>
                        <span className="text-stone-400">·</span>
                        <span className="text-emerald-700 font-medium">{leg.note}</span>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="space-y-2 text-sm">
                  <div className="flex gap-2">
                    <span className="text-xs uppercase tracking-widest text-stone-500 min-w-[64px] pt-0.5">Fees</span>
                    <span className="text-stone-800">{r.fees}</span>
                  </div>
                  <div className="flex gap-2">
                    <span className="text-xs uppercase tracking-widest text-stone-500 min-w-[64px] pt-0.5">Weight</span>
                    <span className="text-stone-800">{r.weight}</span>
                  </div>
                  <div className="flex gap-2 pt-2">
                    <span className="text-xs uppercase tracking-widest text-stone-500 min-w-[64px] pt-0.5">Best for</span>
                    <span className="text-stone-700 italic font-serif leading-relaxed">{r.bestFor}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-10 bg-stone-900 text-stone-50 p-8">
          <h3 className="font-serif text-2xl mb-3">A note on connections</h3>
          <p className="text-stone-300 leading-relaxed mb-3">
            When booking a multi-leg cabin journey, always buy both legs on the SAME airline as one through-ticket. If a connecting flight is operated by a different airline (e.g. Air France selling a JFK leg flown by Delta to a UK destination), the operating airline's pet policy applies — and it might not allow cabin where the booking airline does.
          </p>
          <p className="text-stone-400 leading-relaxed text-sm">
            Always confirm by phone with the airline 48 hours before travel. Pet space is limited per flight (2–6 pets typically) and can't always be booked online.
          </p>
        </div>
      </div>
    </section>
  );
}

const QUARANTINE_COUNTRIES = [
  {
    flag: "🇦🇺",
    name: "Australia",
    duration: "10 days minimum",
    severity: "always",
    detail: "No way around it. Every dog and cat entering Australia must complete a minimum 10-day stay at Mickleham quarantine facility near Melbourne. Plus a rabies titer + 180-day wait before travel.",
  },
  {
    flag: "🇳🇿",
    name: "New Zealand",
    duration: "10 days minimum",
    severity: "always",
    detail: "Same as Australia: mandatory 10-day quarantine at an MPI-approved facility, even with perfect paperwork. Pets from Australia (after 6+ months residency) are exempt.",
  },
  {
    flag: "🇸🇬",
    name: "Singapore",
    duration: "0–30 days (depends on origin)",
    severity: "depends",
    detail: "Country is classified into 3 schedules. From UK/Ireland/Australia/NZ (Schedule I): no quarantine. From US/Canada/EU (Schedule II): no quarantine if paperwork is right. From India and Schedule III countries: 30-day mandatory quarantine.",
  },
  {
    flag: "🇯🇵",
    name: "Japan",
    duration: "12 hours – 180 days",
    severity: "depends",
    detail: "If your paperwork is perfect and titer + 180-day wait is complete BEFORE travel, quarantine is a 12-hour airport inspection. If anything is wrong or timing is off: up to 180 days at the airport quarantine facility at your expense.",
  },
  {
    flag: "🌺",
    name: "Hawaii",
    duration: "0–120 days",
    severity: "depends",
    detail: "Default is up to 120 days. The 'Direct Airport Release' programme lets qualifying pets skip quarantine — but the prep takes 4+ months: ISO microchip, two rabies vaccines, FAVN titer test, paperwork submitted to HDOA 10+ days before arrival.",
  },
  {
    flag: "🇹🇼",
    name: "Taiwan",
    duration: "7 days minimum (most origins)",
    severity: "usually",
    detail: "Pets from countries Taiwan classifies as rabies-free (US, Singapore, Sweden, etc.) skip quarantine. Pets from most of Europe and elsewhere face mandatory 7+ days at one of three facilities, sometimes up to 6 months if requirements aren't met.",
  },
  {
    flag: "🇲🇾",
    name: "Malaysia",
    duration: "7–14 days (most origins)",
    severity: "usually",
    detail: "Pets from rabies-free countries (Australia, UK, Singapore, Japan, NZ) face no quarantine. Most other origins, including US, face 7–14 days quarantine on arrival.",
  },
  {
    flag: "🇨🇳",
    name: "China (mainland)",
    duration: "0–30 days (depends on origin)",
    severity: "depends",
    detail: "Recent rule changes: pets from rabies-free regions (NZ, Singapore, UK, plus a few others — not USA) get no quarantine. From most other countries, 7–30 days home quarantine after arrival if paperwork is complete.",
  },
  {
    flag: "🇯🇲",
    name: "Jamaica",
    duration: "No quarantine — but 6+ months prep",
    severity: "always",
    detail: "Not a traditional quarantine country, but Jamaica's pet import process is one of the strictest in the Caribbean. Mandatory FAVN rabies titer 3–12 months before arrival. Two-stage permit process (Preliminary Application + Veterinary Import Permit). Multiple internal/external parasite treatments at specific intervals. Pets from non-Category-1 (rabies-uncontrolled) countries must reside in a Category-1 country for 6+ months before they qualify. Pit Bull Terriers and hybrid dogs are banned outright.",
  },
  {
    flag: "🇧🇸",
    name: "Bahamas",
    duration: "No quarantine — but 6–8 wk permit",
    severity: "depends",
    detail: "Import permit takes 6–8 weeks without expedited service. Microchip + rabies + DHPP plus coronavirus vaccine if from high-rabies country. Vet exam within 48 hours of arrival. Banned breeds: Pit Bull, Presa Canario, Cane Corso, American Bully, Staffordshire Terrier. Good news on return: Bahamas is CDC-rabies-FREE, so re-entry to the US is straightforward (just the CDC Dog Import Form).",
  },
];

function QuarantineWatch() {
  return (
    <section id="quarantine" className="py-20 px-6 md:px-12 bg-stone-50 border-y border-stone-300">
      <div className="max-w-5xl mx-auto">
        <div className="flex items-baseline gap-3 mb-6">
          <span className="font-serif italic text-stone-400 text-lg">⚠</span>
          <span className="uppercase tracking-[0.25em] text-xs font-medium text-rose-600">Quarantine watch</span>
          <div className="flex-1 h-px bg-stone-300" />
        </div>

        <h2 className="font-serif text-5xl text-stone-900 mb-4 max-w-3xl">
          Where your pet may be quarantined on arrival —<br /><span className="italic text-stone-600">even if they flew in cabin.</span>
        </h2>
        <p className="font-serif italic text-stone-600 text-lg mb-12 max-w-2xl">
          Quarantine is decided by the destination country, not the airline. Cabin travel doesn't exempt your pet from these rules.
        </p>

        <div className="grid md:grid-cols-2 gap-px bg-stone-300 border border-stone-300">
          {QUARANTINE_COUNTRIES.map((c, i) => (
            <div key={i} className="bg-white p-6">
              <div className="flex items-start gap-4 mb-3">
                <span className="text-3xl">{c.flag}</span>
                <div className="flex-1">
                  <h3 className="font-serif text-2xl text-stone-900 leading-tight">{c.name}</h3>
                  <div className="flex items-center gap-2 mt-1">
                    <span
                      className={`inline-block px-2 py-0.5 text-xs uppercase tracking-widest font-medium ${
                        c.severity === "always"
                          ? "bg-rose-600 text-white"
                          : c.severity === "usually"
                          ? "bg-amber-600 text-white"
                          : "bg-stone-200 text-stone-700"
                      }`}
                    >
                      {c.severity === "always" ? "Always" : c.severity === "usually" ? "Usually" : "Depends"}
                    </span>
                    <span className="text-stone-700 font-medium text-sm">{c.duration}</span>
                  </div>
                </div>
              </div>
              <p className="text-stone-700 leading-relaxed text-sm font-serif">{c.detail}</p>
            </div>
          ))}
        </div>

        <div className="mt-10 bg-stone-900 text-stone-50 p-8">
          <h3 className="font-serif text-2xl mb-3">A note on the word "quarantine"</h3>
          <p className="text-stone-300 leading-relaxed mb-3">
            Quarantine doesn't always mean a kennel. In some countries it's a 12-hour airport inspection if your paperwork is perfect. In others it's 4 months in a facility. The deciding factors are your pet's origin country, the destination's rabies-free status, and whether every box is ticked in the right order.
          </p>
          <p className="text-stone-400 leading-relaxed text-sm">
            Bottom line: if your destination is on this list, plan months ahead — not weeks — and use a registered pet relocation specialist if you can.
          </p>
        </div>
      </div>
    </section>
  );
}

function Documents() {
  return (
    <section id="documents" className="py-20 px-6 md:px-12 bg-stone-900 text-stone-50">
      <div className="max-w-5xl mx-auto">
        <div className="flex items-baseline gap-3 mb-6">
          <span className="font-serif italic text-stone-500 text-lg">VI.</span>
          <span className="uppercase tracking-[0.25em] text-xs font-medium text-stone-400">Paperwork</span>
          <div className="flex-1 h-px bg-stone-700" />
        </div>

        <h2 className="font-serif text-5xl mb-4 max-w-3xl">
          The documents nobody warned you about.
        </h2>
        <p className="font-serif italic text-stone-400 text-base mb-12 max-w-2xl">
          Every country has its own paperwork. Here are the most commonly required documents — your specific requirements depend on where you're flying FROM and TO.
        </p>

        <div className="grid md:grid-cols-3 gap-px bg-stone-700">
          {[
            {
              title: "Microchip certificate",
              when: "Everywhere",
              detail: "ISO 11784/11785 compliant 15-digit microchip — implanted BEFORE the rabies vaccine. Most countries reject pets with non-ISO chips. Keep the original implantation certificate.",
              link: null,
            },
            {
              title: "Rabies certificate",
              when: "Almost everywhere",
              detail: "Original (not photocopy) signed by your vet. Should include microchip number, vaccine type, manufacturer, lot number, and expiration date. Many countries require the vaccine ≥21 days old and ≤12 months old at travel.",
              link: null,
            },
            {
              title: "GB Animal Health Certificate (AHC)",
              when: "Leaving the UK for EU / many destinations",
              detail: "Issued by a UK-based Official Veterinarian (OV) within 10 days of travel. Valid 4 months for EU travel and 4 months for re-entry. Since 22 April 2026, this is the required document for GB residents travelling to the EU — an EU pet passport can no longer be used for that. A new AHC is needed for each outbound trip.",
              link: { url: "https://www.gov.uk/take-pet-abroad", label: "gov.uk/take-pet-abroad" },
            },
            {
              title: "EU Pet Passport / EU Health Certificate",
              when: "Entering / travelling within the EU",
              detail: "EU pet passport issued by an EU vet, valid for the pet's lifetime — but only available to EU residents. Since 22 April 2026, GB residents can no longer use an EU pet passport for EU travel and must use a GB AHC instead. Non-EU pets need an EU Health Certificate issued by a government-accredited vet within 10 days of entry.",
              link: { url: "https://food.ec.europa.eu/animals/movement-pets_en", label: "EU Commission · pet movement" },
            },
            {
              title: "CDC Dog Import Form",
              when: "All dogs entering the U.S.",
              detail: "Required for every dog entering the United States — including US dogs returning home. Fill out online; the receipt is good for six months and multiple entries.",
              link: { url: "https://www.cdc.gov/importation/dogs/index.html", label: "cdc.gov · dog import" },
            },
            {
              title: "USDA Health Certificate",
              when: "Leaving the U.S. for international travel",
              detail: "An APHIS Form 7001 or country-specific form, completed by a USDA-accredited vet within 10 days of travel and endorsed by your nearest USDA office.",
              link: { url: "https://www.aphis.usda.gov/pet-travel", label: "aphis.usda.gov · pet travel" },
            },
            {
              title: "AQCS NOC (India)",
              when: "Entering India",
              detail: "No Objection Certificate from India's Animal Quarantine and Certification Service. Apply 1–2 weeks before. Pets can enter through Delhi, Mumbai, Chennai, Kolkata, Bengaluru, or Hyderabad only.",
              link: { url: "https://aqcsindia.gov.in/", label: "aqcsindia.gov.in" },
            },
            {
              title: "MOCCAE permit (UAE)",
              when: "Entering UAE (Abu Dhabi or Dubai)",
              detail: "UAE Health Certificate + release permit from the Ministry of Climate Change and Environment. Required regardless of cabin or cargo, regardless of airline. Apply via the MOCCAE portal.",
              link: { url: "https://www.moccae.gov.ae/en/services/registration-pet.aspx", label: "moccae.gov.ae · pet permit" },
            },
            {
              title: "Tapeworm treatment record",
              when: "Entering UK, Ireland, Malta, Finland, Norway",
              detail: "Praziquantel administered by a vet 24–120 hours before arrival, recorded in the health certificate. Required for dogs only.",
              link: { url: "https://www.gov.uk/guidance/pet-travel-to-europe-after-brexit", label: "gov.uk · tapeworm rules" },
            },
            {
              title: "Hawaii AQS-279",
              when: "Any pet entering Hawaii",
              detail: "Submitted with FAVN rabies titer results, two rabies vaccines, and proof of microchip at least 30 days before arrival for the Direct Airport Release program.",
              link: { url: "https://hdoa.hawaii.gov/ai/aqs/aqs-info/", label: "hdoa.hawaii.gov · animal quarantine" },
            },
            {
              title: "Rabies titer test (FAVN / RNATT)",
              when: "Travel between rabies-controlled and rabies-free regions",
              detail: "Blood test measuring rabies antibodies. Required for UK/EU entry from unlisted countries, Australia, Japan, Singapore. Often a 3-month wait period applies after the test.",
              link: { url: "https://www.aphis.usda.gov/pet-travel/by-country", label: "aphis.usda.gov · by country" },
            },
            {
              title: "Australia Import Permit",
              when: "Entering Australia",
              detail: "From the Department of Agriculture. Multi-step process spanning 6+ months including pre-export tests, rabies titer (FAVN), tick treatment, and 10-day post-arrival quarantine at Mickleham.",
              link: { url: "https://www.agriculture.gov.au/biosecurity-trade/cats-dogs", label: "agriculture.gov.au · cats & dogs" },
            },
            {
              title: "Jamaica Veterinary Import Permit",
              when: "Entering Jamaica",
              detail: "Two-stage process: Preliminary Application Form (with FAVN titer results) must be approved BEFORE you start the rest of the prep. Then Veterinary Import Permit issued. Pit Bull Terriers and hybrid dogs banned. Allow 6+ months from start to travel day.",
              link: { url: "https://www.moa.gov.jm/Divisions/Veterinary", label: "moa.gov.jm · veterinary" },
            },
            {
              title: "Bahamas Import Permit",
              when: "Entering Bahamas",
              detail: "Required for every pet. Apply via bahamaspetpermit.com (online) at least 4 weeks before travel — 6–8 weeks for standard processing without expedited service. ~$10 USD + 12% VAT. Banned breeds: Pit Bull, Presa Canario, Cane Corso, American Bully, Staffordshire Terrier.",
              link: { url: "https://bahamaspetpermit.com/", label: "bahamaspetpermit.com" },
            },
            {
              title: "CDC Certification of U.S.-issued Rabies Vaccination",
              when: "Returning to US from high-risk countries",
              detail: "Required when returning to the US from a CDC high-risk rabies country (including Dominican Republic). Must be completed by USDA-accredited vet and endorsed by USDA BEFORE the dog leaves the US — cannot be issued retroactively. Different form from a regular rabies certificate.",
              link: { url: "https://www.cdc.gov/importation/dogs/index.html", label: "cdc.gov · high-risk countries" },
            },
          ].map((d, i) => (
            <div key={i} className="bg-stone-900 p-8">
              <FileCheck className="w-6 h-6 text-amber-500 mb-4" strokeWidth={1.5} />
              <div className="text-xs uppercase tracking-widest text-amber-500/80 mb-2">{d.when}</div>
              <h3 className="font-serif text-xl mb-3">{d.title}</h3>
              <p className="text-stone-400 text-sm leading-relaxed mb-4">{d.detail}</p>
              {d.link ? (
                <a
                  href={d.link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs text-amber-500 hover:text-amber-400 transition-colors font-medium uppercase tracking-widest"
                >
                  {d.link.label}
                  <ArrowRight className="w-3 h-3" />
                </a>
              ) : (
                <div className="text-xs text-stone-500 italic">no central authority — your vet issues this</div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Tips() {
  return (
    <section id="tips" className="py-20 px-6 md:px-12">
      <div className="max-w-5xl mx-auto">
        <SectionLabel num="VII.">Hard-won wisdom</SectionLabel>

        <div className="grid md:grid-cols-3 gap-12">
          {[
            {
              tag: "On sedation",
              title: "Don't.",
              body: "Most vets and the AVMA advise against sedating pets for air travel. At altitude, sedatives can cause respiratory and cardiovascular issues — pressurized cabins still aren't sea level, and a sedated pet can't shift positions, regulate body temperature, or signal distress the way an alert one would. The flying-while-sedated risk is real enough that most major airlines explicitly refuse pets who appear drugged at check-in. If your pet is anxious, talk to your vet about non-sedating calming options like Adaptil/Feliway pheromone sprays (apply to the carrier, never the pet) or a snug-fitting Thundershirt. CBD treats marketed as 'calming' are not the answer — most aren't standardised, and several have failed independent purity testing.",
            },
            {
              tag: "On the carrier",
              title: "Soft, not stiff — and check every airline.",
              body: "Soft-sided carriers compress slightly to fit under tighter seats and feel less cage-like for your pet. Make sure ventilation is on at least three sides. On a multi-airline route, dimensions can differ between airlines — one might allow more length but less height, another the opposite. Check each airline's published specs as soon as your route is booked, and buy for the strictest one IF your pet is genuinely comfortable in it. Otherwise bring a second carrier for the more generous leg. The journey planner pulls each airline's specs into your checklist side by side.",
            },
            {
              tag: "On the seat",
              title: "Pick a window, not an aisle or middle.",
              body: "Window seats give the under-seat space slightly more depth on most aircraft, and prevent your pet being kicked or jostled by passing carts. The middle seat means more disturbance every time the window passenger gets up. Avoid bulkhead and exit rows — pets aren't allowed there. EXTRA-LEGROOM SEATS: where the airline permits pets in extra-legroom rows, book one — it's transformative for long-haul. Where extra-legroom seats are banned for pets (Delta, JetBlue, several others restrict this), consider buying an extra adjacent seat in regular economy if your budget allows. The extra room for the carrier and your own knees can make a long flight bearable.",
            },
            {
              tag: "On food",
              title: "Light meal, 3–4 hours out — and toilet time.",
              body: "Don't fly your pet hungry, but don't fly them full. A small meal 3–4 hours before departure is the sweet spot. Make sure they've pooped and peed properly BEFORE you enter the airport (airport pet relief areas are often tiny patches of fake grass dogs see right through). Freeze a little water in the carrier dish so it melts gradually.",
            },
            {
              tag: "On treats during the flight",
              title: "Less is more.",
              body: "Resist the urge to comfort-feed treats or top up the water bowl during the flight — both can trigger a toilet need you cannot deal with at 38,000 feet. Tiny amounts only, just enough for reassurance during turbulence or take-off. Most well-prepared pets sleep through the entire flight without needing anything. If you must offer water, freeze a small ice cube in the carrier dish before boarding — it melts slowly into a manageable trickle rather than sloshing around. Same logic with treats: a single freeze-dried liver morsel goes further than a handful of biscuits, and won't crumble all over the carrier.",
            },
            {
              tag: "On nerves (yours)",
              title: "Your pet reads you.",
              body: "Dogs and cats are extraordinarily good at reading their owners' stress level — your heart rate, your breathing, the tightness in your voice, the way you handle the carrier. If you're frantic, they're frantic. Pre-flight rituals matter: don't fuss over them at the gate, don't apologize to them through the carrier mesh, don't keep checking on them mid-flight (which signals to them that something IS wrong). A calm handler builds a calm animal. The hour before departure is yours to manage your own nerves — coffee, breathwork, a phone call to someone who'll talk you down, whatever works. Your pet will mirror whatever state you arrive in.",
            },
            {
              tag: "On the unexpected",
              title: "Have a Plan B.",
              body: "Save your destination's nearest 24-hour vet in your phone before you leave — and the one near your origin airport too, in case of a same-day issue at check-in. Pack copies of vaccination records in a clear Ziploc inside the carrier (not buried in your suitcase), and have photos of everything on your phone. If you're connecting, build in at least 90 minutes between flights — pet relief areas are usually a long hike from gates, and pet check-in counters at connection hubs are often unstaffed or shared with oversized baggage. The single most useful thing on a delayed travel day: a pre-packed pouch with two days' worth of pet food in a sealed bag, in case checked baggage is rerouted while you stay with your pet. And for a big, can't-fail move — an international relocation, say — think hard before booking the cheapest non-changeable fare. Pets do occasionally get refused at the gate: a carrier that's a centimetre too tall, a paperwork query, or the flight's pet quota already full. On a rigid fare that's your ticket gone. A changeable fare costs more, but it means that if your pet is turned away you can rebook and try again another day instead of losing everything. It won't re-secure the pet slot itself — that's a separate, often phone-only booking — but it buys you the time and room to regroup. For a once-in-a-lifetime move, treat the fare premium as cheap insurance.",
            },
            {
              tag: "On comfort items",
              title: "Bring a piece of home.",
              body: "Pack a small teddy or favourite toy alongside their blanket — something soft that smells of you and home. A collapsible silicone water bowl (I got mine from Amazon for under £10) takes up almost no space and is invaluable for hotel stops, layovers, and the airport. Skip glass or hard ceramic — they're heavy and ban-prone.",
            },
            {
              tag: "On bringing pet food",
              title: "Most countries restrict pet food at the border.",
              body: "Check your destination's rules before packing pet food. The US, for example, requires commercial pet food to be made in the US — I couldn't bring Theo's food in. A few sealed treats in my handbag came through with no issues. For UK/EU, most commercial sealed dog food is allowed but check the country's APHIS/border-control page. Plan to buy your pet's food on arrival, or research equivalent brands at your destination before you fly.",
            },
            {
              tag: "For cat owners",
              title: "A cat can't be walked tired — plan differently.",
              body: "Most pre-flight advice assumes you can walk a dog to burn off energy and get the toilet trip done. You can't do that with a cat. Instead: give your cat full access to a litter tray right up until you leave for the airport, keep them in a carrier they already see as a safe den (weeks of leaving it out at home, not days), and don't feed within about 4 hours of departure to reduce the chance of an accident. Cats also tend to go quiet and still when stressed rather than vocal — silence isn't always calm, so check on them gently without opening the carrier.",
            },
            {
              tag: "For cat owners",
              title: "Feliway, not Adaptil — and a covered carrier.",
              body: "The calming pheromone products are species-specific: Feliway is the cat one (Adaptil is for dogs) — spray it in the carrier 15 minutes before, not on your cat. Cats settle better when they can't see the chaos around them, so a carrier with solid sides or a light blanket draped over (still ventilated) often works better than a fully mesh one. At security, where you have to take your cat out of the carrier, a well-fitted harness is essential — a startled cat in a busy airport is a genuine flight risk. Practise the harness at home first.",
            },
            {
              tag: "For cat owners",
              title: "Bring a piece of unwashed bedding from home.",
              body: "Cats orient by smell more than sight — familiar scent settles them faster than anything else you can pack. Line the carrier with a piece of bedding that already smells like them and their territory. Resist the urge to wash it fresh before travel day: the slightly used blanket is the point. Pair it with their favourite small toy if they have one. A carrier they've slept in for weeks, lined with their own scent, turns 'unknown box' into 'my known place that happens to be moving today' — and many cats sleep through the entire flight as a result.",
            },
          ].map((t, i) => (
            <div key={i}>
              <div className="text-xs uppercase tracking-widest text-amber-700 mb-3">{t.tag}</div>
              <h3 className="font-serif text-3xl text-stone-900 mb-4 italic">{t.title}</h3>
              <p className="text-stone-700 leading-relaxed">{t.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function TravelDay() {
  // Build a TRAVEL_DAY_GUIDE-shaped object for the printable helper —
  // each stage becomes a section, each point becomes a checklist item.
  function getPrintableData() {
    const sections = [];
    TRAVEL_DAY_GUIDE.stages.forEach((s) => {
      sections.push({ title: `${s.kicker} — ${s.title}`, divider: true, items: [s.summary] });
      sections.push({
        title: s.title,
        items: s.points.map((p) => `<strong>${p.h}.</strong> ${p.p}`),
      });
    });
    return {
      title: TRAVEL_DAY_GUIDE.title,
      subtitle: TRAVEL_DAY_GUIDE.kicker,
      sections,
    };
  }

  return (
    <section id="travel-day" className="py-20 px-6 md:px-12">
      <div className="max-w-5xl mx-auto">
        <div className="flex items-baseline gap-3 mb-6">
          <span className="font-serif italic text-amber-700 text-2xl">★</span>
          <span className="uppercase tracking-[0.25em] text-xs font-medium text-amber-700">Travel day with a pet · airport guide</span>
          <div className="flex-1 h-px bg-stone-300" />
        </div>

        <h2 className="font-serif text-5xl md:text-6xl text-stone-900 mb-6 leading-[1.0]">
          What to expect <span className="italic text-stone-600">at the airport</span><br />
          with your pet.
        </h2>
        <p className="font-serif italic text-stone-600 text-lg mb-12 max-w-3xl">
          {TRAVEL_DAY_GUIDE.kicker}
        </p>

        {/* Eight-stage preview grid — each stage card links to that anchor on the full page */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
          {TRAVEL_DAY_GUIDE.stages.map((s) => (
            <a
              key={s.id}
              href={`/travel-day-with-a-pet#${s.id}`}
              className="group bg-stone-50 border border-stone-300 p-5 hover:border-amber-600 hover:bg-amber-50 transition-colors flex flex-col"
            >
              <div className="text-[10px] uppercase tracking-widest text-amber-700 mb-2">{s.kicker}</div>
              <h3 className="font-serif text-lg text-stone-900 mb-2 leading-tight group-hover:text-amber-800 transition-colors">
                {s.title}
              </h3>
              <p className="text-sm text-stone-600 leading-snug font-serif italic">{s.summary}</p>
            </a>
          ))}
        </div>

        {/* CTA strip — full guide + PDF download */}
        <div className="bg-stone-900 text-stone-100 p-8 md:p-10 flex flex-col md:flex-row items-start md:items-center gap-6 justify-between">
          <div className="flex-1">
            <h3 className="font-serif text-2xl text-stone-50 mb-2">The full walkthrough</h3>
            <p className="text-stone-300 leading-relaxed">
              Eight stages, hour-by-hour, from the morning at home to settling into your seat — plus arrival. Save the PDF and read it the night before you fly.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 flex-shrink-0">
            <a
              href="/travel-day-with-a-pet"
              className="inline-flex items-center gap-2 bg-amber-600 hover:bg-amber-500 text-stone-50 px-5 py-3 text-xs uppercase tracking-widest font-medium transition-colors whitespace-nowrap"
            >
              Read the full guide
              <ArrowRight className="w-3.5 h-3.5" strokeWidth={2} />
            </a>
            <button
              onClick={() => openChecklistPrintable(getPrintableData())}
              className="inline-flex items-center gap-2 border border-stone-600 hover:border-amber-500 hover:text-amber-400 text-stone-200 px-5 py-3 text-xs uppercase tracking-widest font-medium transition-colors whitespace-nowrap"
            >
              <FileCheck className="w-3.5 h-3.5" strokeWidth={2} />
              Download as PDF
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

function Stories() {
  const [open, setOpen] = useState(true);

  return (
    <section id="stories" className="py-20 px-6 md:px-12 bg-amber-50/40 border-y border-stone-300">
      <div className="max-w-3xl mx-auto">
        <div className="flex items-baseline gap-3 mb-6">
          <span className="font-serif italic text-stone-400 text-lg">✻</span>
          <span className="uppercase tracking-[0.25em] text-xs font-medium text-amber-700">From the desk · Stories</span>
          <div className="flex-1 h-px bg-stone-300" />
        </div>

        <article>
          <div className="text-xs uppercase tracking-widest text-stone-500 mb-3">Story 01 · A real trip · May 2026</div>

          <h2 className="font-serif text-5xl md:text-6xl text-stone-900 mb-6 leading-[1.05]">
            London to Miami,<br />
            <span className="italic text-stone-600">via Montreal,</span> with a small dog.
          </h2>

          <p className="font-serif italic text-stone-600 text-lg mb-12 max-w-2xl">
            What I learned flying Theo out of the UK — the route nobody talks about, the moment I nearly cried at Heathrow, and the things I'll always pack now.
          </p>

          <div className="font-serif text-lg text-stone-800 leading-[1.8] space-y-6">

            <p>
              When you live in the UK and want to fly internationally with a small dog in the cabin, the first thing most people assume is that you can't. The hard wall is actually one-way: <strong>no airline allows cabin pets INTO the UK</strong> (UK government rule — that's the inbound restriction). But OUT of the UK is a different story. Several airlines do allow cabin pets on departing flights from Heathrow — Air Canada, Air France, KLM, Lufthansa, SWISS, LOT Polish, TAP, Etihad, Turkish, and Air Transat from Manchester. Most pet owners don't know this. It's the route nobody talks about.
            </p>

            <p>
              I worked out my route: <strong>fly Air Canada from Heathrow to Montreal in cabin (Theo with me the whole way), stay overnight at a dog-friendly hotel, then fly American Airlines from Montreal to Miami in cabin the next morning</strong>. I deliberately chose Montreal over Toronto — the flight was about 30 minutes shorter, and since it was Theo's first time, I wanted every bit of caution I could get to keep us both calm.
            </p>

            <p>
              I'm not going to pretend it was easy. It was a 7h 30m flight, then a hotel, then a 3h 30m flight the next day. But Theo arrived in Miami calm, fed, and walked, and we slept in our own bed that night. Here's what I learned along the way.
            </p>

            {!open && (
              <div className="pt-4">
                <button
                  onClick={() => setOpen(true)}
                  className="group inline-flex items-center gap-3 bg-stone-900 text-stone-50 px-6 py-3 hover:bg-amber-700 transition-colors"
                >
                  <span className="uppercase tracking-widest text-xs font-medium">Continue reading</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            )}

            {open && (
              <>
                <h3 className="font-serif text-3xl text-stone-900 mt-12 mb-4">The Heathrow turn-around test</h3>

                <p>
                  At check-in, the Air Canada staff do a "turn-around test" — your dog has to be able to stand up and turn around inside the carrier. Theo wasn't listening. He just sat there looking pleased with himself while I tried to coax him to swivel. After a few attempts the staff member sighed, looked at the carrier, looked at Theo, decided he was clearly comfortable and within the size limit, and waved us through. <em>It is genuinely down to whoever is on shift.</em> Don't argue, don't make a fuss — be nice, be prepared, and if the carrier is right and the dog looks happy, most check-in staff will use their judgment.
                </p>

                <h3 className="font-serif text-3xl text-stone-900 mt-12 mb-4">The last hour</h3>

                <p>
                  Theo was perfect for the first six hours. Slept, mostly. Then somewhere over Newfoundland he got wingy — restless, fidgety, the start of small whining noises. <em>I was sweating.</em> Theo actually cried for the last hour of the flight. I tried to remain visibly calm because dogs read you instantly, but the people next to me were watching like hawks, and I could feel the social pressure of "please don't be the dog person who ruins our flight."
                </p>

                <p>
                  I asked if I could lift Theo out for a moment to comfort him — the crew staff said no. To be fair, those are the rules: pets must stay in their carrier under the seat for the entire flight. <strong>But I've since heard real stories where crew were kind enough to allow it briefly when the passengers nearby agreed.</strong> It's genuinely down to the crew on shift, the people next to you, the conditions on the day. Worth knowing, never something to count on.
                </p>

                <h3 className="font-serif text-3xl text-stone-900 mt-12 mb-4">Carrier prep — the small thing that mattered most</h3>

                <p>
                  I got Theo used to his carrier in the weeks before the trip. Treats inside, naps inside, the door open at first then closed for longer stretches. By the time we flew, the carrier was familiar — not a scary new thing.
                </p>

                <p>
                  I also put <strong>his usual nighttime blanket in there</strong> so it smelled like home. The blanket was too big and took up too much space — I cut it in half so he had maximum room to move and turn around. A small thing that probably made a real difference.
                </p>

                <h3 className="font-serif text-3xl text-stone-900 mt-12 mb-4">What actually helped</h3>

                <p className="font-medium text-stone-900">
                  Calming spray. Genuinely.
                </p>

                <p>
                  I'd spritzed a bit on the carrier blanket before we left and packed the bottle in my bag. When Theo got fidgety I gave another light spray. I'm not going to claim it was magic — but it took the edge off, and combined with my own composure (faked, mostly), it got us through.
                </p>

                <p className="font-medium text-stone-900">
                  Timing the flight around his sleep.
                </p>

                <p>
                  I picked a late-morning departure — after his breakfast and morning walks, so he'd naturally be ready to nap and wouldn't need a pee until after we landed. <strong>Don't pick a flight where your dog will be wide awake and need a wee.</strong> Match your departure to whenever they naturally sleep, and avoid feeding them too close to take-off.
                </p>

                <p>
                  Heathrow does have a pet relief area, but honestly it was useless for Theo — he could see right through that tiny patch of grass and wasn't going to use it. Luckily he'd had a proper pee just before we entered the airport, so I knew he'd be fine for the flight. <strong>Walk your dog properly outside before you check in.</strong> Don't rely on the airport's pet area.
                </p>

                <p className="font-medium text-stone-900">
                  Window seat, not middle (lesson learned the hard way).
                </p>

                <p>
                  I had booked a middle seat because I'd heard the under-seat space was bigger. In reality the carrier still had to squeeze in, and being in the middle meant constant noise and movement around Theo every time the window passenger needed the loo. <strong>Pick a window seat.</strong> Less disturbance, less distraction, and your dog spends the flight in a calmer corner of the cabin.
                </p>

                <p className="font-medium text-stone-900">
                  Extra-legroom seats — if your airline allows pets there, BOOK THEM.
                </p>

                <p>
                  Some airlines let pet owners sit in extra-legroom seats (others ban it — check carefully before booking). When it's allowed, it's transformative. More space for the carrier, more breathing room for you both, and you're not contorting yourself around the carrier for nine hours.
                </p>

                <p className="font-medium text-stone-900">
                  A backpack as personal item — and a wheeled pet carrier if you can.
                </p>

                <p>
                  Theo in his airline-compliant carrier counts as your cabin luggage allowance — so I used a <strong>backpack as my personal item</strong> rather than a handbag. Backpacks hold more, distribute weight on both shoulders, and leave one hand free since the other is carrying the pet carrier. <strong>If you can find a rolling/wheeled pet carrier, even better.</strong> Most airports are huge; that walk to the gate with a dog and a personal item is no joke.
                </p>

                <h3 className="font-serif text-3xl text-stone-900 mt-12 mb-4">The Montreal stopover</h3>

                <p>
                  A night in a dog-friendly hotel in Montreal was the best decision I made. Theo got to walk on grass, drink real water from a bowl, sleep flat, and decompress. I got to shower, eat properly, and stop being airport-mum for twelve hours. The next morning, the short hop to Miami felt like nothing after the transatlantic. <strong>If your route allows a stopover, take it.</strong> Two short flights with a sleep in between is much kinder than one long haul.
                </p>

                <h3 className="font-serif text-3xl text-stone-900 mt-12 mb-4">What I'd do differently</h3>

                <p>
                  Not much. I'd book the extra-legroom from the start instead of dithering. I'd put the calming spray in my pocket, not buried in the bag. I'd practice the turn-around at home a hundred times so Theo could do it on command. And I'd remember that the staff and the people around you are mostly not scary — they're curious about your dog, and quietly rooting for you.
                </p>

                <p className="italic text-stone-700 pt-4">
                  Theo's now flown London-Montreal-Miami, Miami-Paris, and Paris-London (via Eurotunnel). He's a more experienced traveller than most humans I know. If I can do it, you can too. Just plan early, pack the calming spray, and pick a flight when your dog should be asleep.
                </p>

                <div className="mt-12 pt-8 border-t border-stone-300">
                  <p className="font-serif italic text-stone-600 mb-4">— Theo's Mum</p>
                  <p className="text-stone-600 text-sm">
                    Got a route or a story you want to share? <a href="#contact" className="text-amber-700 underline decoration-amber-300 underline-offset-4 hover:text-amber-800 transition-colors">Get in touch</a>. I'm collecting real-world experiences from other pet mums and dads to add to this section.
                  </p>
                </div>
              </>
            )}
          </div>
        </article>
      </div>
    </section>
  );
}

function ComingSoon() {
  const items = [
    {
      category: "Carriers",
      title: "Soft-sided carrier reviews",
      detail: "Sherpa, Diggs, Away, Wild One, Maxbone — tested in real overhead compartments, on real airlines, with a real anxious dog. Honest takes on which ones survive a transatlantic.",
      eta: "Summer 2026",
    },
    {
      category: "Pet Insurance",
      title: "Travel-friendly insurance compared",
      detail: "Lemonade, Pumpkin, Trupanion, ManyPets — which actually cover you abroad, which exclude pre-existing anxiety, which pay out for in-flight incidents.",
      eta: "Summer 2026",
    },
    {
      category: "Pet Relocation",
      title: "Relocation services I trust",
      detail: "PetRelocation, Starwood Animal Transport, CitizenShipper, PetAir UK — when DIY isn't possible (looking at you, Australia and Japan), here's who I'd call.",
      eta: "Autumn 2026",
    },
    {
      category: "Hotels & Lounges",
      title: "Pet-friendly stays near major airports",
      detail: "The hotels that actually mean it when they say pet-friendly — pee pads in the room, not just a $200 deposit and a stink-eye at check-in.",
      eta: "Autumn 2026",
    },
    {
      category: "Vet Network",
      title: "USDA-accredited vets, by city",
      detail: "Finding a USDA-accredited vet for your health certificate can take weeks. A growing list of trusted ones near major U.S. departure airports.",
      eta: "Late 2026",
    },
    {
      category: "Charters",
      title: "Pet charter & transfer services",
      detail: "When commercial cabin doesn't work — large dogs, snub-nosed breeds, multi-pet families. The private and semi-private options I've personally vetted.",
      eta: "Late 2026",
    },
  ];

  return (
    <section id="coming-soon" className="py-20 px-6 md:px-12 bg-white border-y border-stone-300">
      <div className="max-w-5xl mx-auto">
        <div className="flex items-baseline gap-3 mb-6">
          <span className="font-serif italic text-stone-400 text-lg">∞</span>
          <span className="uppercase tracking-[0.25em] text-xs font-medium text-rose-600">Coming soon</span>
          <div className="flex-1 h-px bg-stone-300" />
        </div>

        <h2 className="font-serif text-5xl text-stone-900 mb-4 max-w-3xl leading-tight">
          What's next on the desk.
        </h2>
        <p className="font-serif italic text-stone-600 text-lg mb-4 max-w-2xl">
          I'm building this guide one section at a time, in the order pet owners ask for help most. Here's what's in progress.
        </p>
        <p className="text-stone-600 text-sm mb-12 max-w-2xl leading-relaxed">
          Are you a brand in one of these spaces? <a href="#contact" className="text-rose-600 underline decoration-rose-300 underline-offset-4 hover:text-rose-700 transition-colors">Get in touch</a> — I only recommend what I'd genuinely use, and I'm always looking to test new gear and services.
        </p>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-px bg-stone-300 border border-stone-300">
          {items.map((it, i) => (
            <div
              key={i}
              className="bg-white p-7 hover:bg-stone-50 transition-colors group relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-20 h-20 -mt-10 -mr-10 bg-rose-100 rounded-full opacity-0 group-hover:opacity-60 transition-opacity duration-500" />

              <div className="relative">
                <div className="flex items-baseline justify-between gap-3 mb-4">
                  <span className="text-xs uppercase tracking-widest text-rose-600 font-medium">
                    {it.category}
                  </span>
                  <span className="font-serif italic text-stone-400 text-xs">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                </div>
                <h3 className="font-serif text-2xl text-stone-900 mb-3 leading-tight">
                  {it.title}
                </h3>
                <p className="text-stone-600 leading-relaxed text-sm mb-6">
                  {it.detail}
                </p>
                <div className="inline-flex items-center gap-2 text-xs uppercase tracking-widest text-stone-500">
                  <Sparkles className="w-3.5 h-3.5 text-rose-500" strokeWidth={2} />
                  <span>{it.eta}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12 p-8 bg-stone-50 border border-stone-300">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-full bg-rose-500 text-white flex items-center justify-center flex-shrink-0">
              <PawPrint className="w-5 h-5" strokeWidth={1.75} />
            </div>
            <div>
              <h3 className="font-serif text-2xl text-stone-900 mb-2">Want to be notified?</h3>
              <p className="text-stone-700 leading-relaxed mb-4">
                I don't have a newsletter (yet). For now, follow along on Instagram <a href="https://instagram.com/petincabinguide" target="_blank" rel="noopener noreferrer" className="text-rose-600 underline decoration-rose-300 underline-offset-4 hover:text-rose-700 transition-colors">@petincabinguide</a> — that's where I post first when a new section goes live.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Contact() {
  const [revealed, setRevealed] = useState(false);
  const [copied, setCopied] = useState(false);

  // Email split into pieces so spam bots scraping the page can't easily reassemble it.
  // Replace the parts below with your real email when you deploy.
  const emailParts = ["petincabinguide", "gmail", "com"];
  const email = `${emailParts[0]}@${emailParts[1]}.${emailParts[2]}`;

  function reveal() {
    setRevealed(true);
  }

  function copyEmail() {
    navigator.clipboard.writeText(email);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <section id="contact" className="py-20 px-6 md:px-12 bg-stone-100 border-y border-stone-300">
      <div className="max-w-3xl mx-auto">
        <SectionLabel num="VIII.">Get in touch</SectionLabel>

        <h2 className="font-serif text-5xl text-stone-900 mb-6 leading-tight">
          Got a question? Ask me anything.
        </h2>

        <div className="font-serif text-lg text-stone-700 leading-relaxed space-y-5 mb-10">
          <p>
            A quick honest note before you write: <em>I am not a vet, a pet travel agent, or a relocation expert</em>. I'm a pet mum who's done this enough times to learn the hard way.
          </p>
          <p>
            What I can do is share what's worked for me, what hasn't, and where I'd start looking if I were in your shoes. I'll always try to point you toward a proper professional when your question needs one — and I'll always tell you when I genuinely don't know.
          </p>
          <p>
            For anything urgent, time-sensitive, or involving complex international paperwork, please speak to a USDA-accredited vet, your airline directly, or a registered pet relocation service. This site is a starting point, not a substitute for expert advice.
          </p>
          <p className="italic text-stone-600">
            That said — if you've got a question I can help with, I'd love to hear from you.
          </p>
        </div>

        <div className="bg-white border border-stone-300 p-8">
          <div className="text-xs uppercase tracking-widest text-stone-500 mb-4">Drop me a line</div>

          {!revealed ? (
            <button
              onClick={reveal}
              className="group inline-flex items-center gap-3 bg-stone-900 text-stone-50 px-7 py-3.5 hover:bg-amber-700 transition-colors"
            >
              <span className="uppercase tracking-widest text-xs font-medium">Reveal email address</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          ) : (
            <div className="space-y-4">
              <div className="font-serif text-2xl text-stone-900 break-all">
                {email}
              </div>
              <div className="flex flex-wrap gap-3">
                <a
                  href={`mailto:${email}?subject=A%20question%20from%20your%20site`}
                  className="inline-flex items-center gap-2 bg-stone-900 text-stone-50 px-5 py-2.5 hover:bg-amber-700 transition-colors"
                >
                  <span className="uppercase tracking-widest text-xs font-medium">Open in mail app</span>
                </a>
                <button
                  onClick={copyEmail}
                  className="inline-flex items-center gap-2 border border-stone-900 text-stone-900 px-5 py-2.5 hover:bg-stone-900 hover:text-stone-50 transition-colors"
                >
                  <span className="uppercase tracking-widest text-xs font-medium">
                    {copied ? "Copied!" : "Copy"}
                  </span>
                </button>
              </div>
              <p className="text-stone-500 text-sm font-serif italic pt-2">
                Be patient — it's just me, replying when Theo isn't sitting on the keyboard.
              </p>
            </div>
          )}
        </div>

        <p className="text-stone-500 text-sm mt-8 italic font-serif">
          By writing in, you understand that any reply is shared as personal experience, not professional advice. For medical, legal, or import questions, please consult a qualified expert.
        </p>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="py-16 px-6 md:px-12 bg-stone-900 text-stone-400 border-t border-stone-800">
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center gap-4 mb-8">
          <img
            src="/logo.png"
            alt="Pets in Cabin logo"
            className="w-16 h-16 rounded-full object-cover flex-shrink-0"
          />
          <div>
            <div className="font-serif text-stone-200 text-xl" style={{ fontWeight: 600, letterSpacing: "-0.02em" }}>Pets in Cabin</div>
            <div className="font-serif italic text-stone-400 text-sm">Travel together, stay together · A guide by Theo's Mum</div>
          </div>
        </div>
        <p className="font-serif text-stone-400 max-w-2xl mb-8 leading-relaxed">
          A reference, not a substitute for veterinary advice or the airline's official policy. Rules change frequently; always confirm directly with your airline and the receiving country before you fly.
        </p>

        {/* Ko-fi tip jar — voluntary support. Deliberately low-key: the copy
            makes clear the guide is free and unchanged either way, so a reader
            never feels content is held back. Fires a kofi_click GA event so we
            can see how many people the site sends to the tip jar. */}
        <div className="mb-8 pb-8 border-b border-stone-800 max-w-2xl">
          <p className="font-serif text-stone-400 text-sm leading-relaxed mb-3">
            Pets in Cabin is free and always will be. If it saved you some stress, you can buy me a coffee — entirely optional, and the guide stays exactly the same either way.
          </p>
          <a
            href="https://ko-fi.com/theosmum"
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => {
              if (typeof window !== "undefined" && window.gtag) {
                window.gtag("event", "kofi_click", { event_category: "support", location: "footer" });
              }
            }}
            className="inline-flex items-center gap-2 bg-amber-600 hover:bg-amber-500 text-white px-4 py-2.5 text-sm font-medium transition-colors rounded-sm"
          >
            <span aria-hidden="true">☕</span>
            Buy me a coffee
          </a>
        </div>

        <div className="flex flex-wrap gap-x-8 gap-y-3 text-xs uppercase tracking-widest text-stone-500">
          <span>Edited by Theo's Mum</span>
          <span>·</span>
          <span className="text-stone-400">Updated on {LAST_UPDATED}</span>
          <span>·</span>
          <span>Sources: CDC, USDA APHIS, IATA, individual airline policies</span>
          <span>·</span>
          <a href="/privacy" className="hover:text-amber-500 transition-colors">Privacy Policy</a>
        </div>
      </div>
    </footer>
  );
}

// ---------- ANALYTICS OPT-OUT (no consent banner) ----------
//
// Petsincabin runs under the UK DUAA 2025 "statistical analytics" exemption
// (in force from 5 February 2026), which allows aggregate analytics without
// upfront consent provided:
//   1. The sole purpose is aggregate stats to improve the site
//   2. We explain it clearly (done in /privacy)
//   3. We offer a simple, free way to opt out (this component listens for
//      the opt-out flag from the privacy page and signals gtag accordingly)
//
// GA4 must be configured to match: Google Signals OFF, data-sharing with
// other Google products OFF, no advertising features. Those are GA-side
// admin settings, not code.
//
// No banner is rendered. If the user has set the opt-out flag in
// localStorage (via the privacy page button), we tell gtag to drop them
// from analytics on every page load.

function AnalyticsOptOutListener() {
  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      const optedOut = localStorage.getItem("pic_analytics_optout") === "true";
      if (optedOut && window.gtag) {
        window.gtag("consent", "update", {
          analytics_storage: "denied",
          ad_storage: "denied",
          ad_user_data: "denied",
          ad_personalization: "denied",
        });
      }
    } catch (e) {
      // localStorage blocked — fall through; default consent state applies
    }
  }, []);
  return null;
}

// ---------- ROOT ----------

// Small floating "back to top" helper. Appears after the user scrolls down
// ~1.5 screens; clicking smooth-scrolls to the top of the page. Positioned
// bottom-LEFT and styled in muted stone tones so it never competes with the
// amber compare-airlines button (which lives bottom-right).
// The standalone country/region guide pages. Used by both the nav dropdown
// and the homepage "Country Pet Guides" section so the two never drift.
const COUNTRY_GUIDES = [
  { slug: "/uk-pet-travel", flag: "🇬🇧", name: "United Kingdom", blurb: "The cabin ban, and the Paris-pivot workaround." },
  { slug: "/india-pet-travel", flag: "🇮🇳", name: "India", blurb: "AQCS paperwork, NOC, and the cabin routes in." },
  { slug: "/canada-pet-travel", flag: "🇨🇦", name: "Canada", blurb: "Gentle rules — no titer, no quarantine." },
  { slug: "/japan-pet-travel", flag: "🇯🇵", name: "Japan", blurb: "The 7-month import process, step by step." },
  { slug: "/oslo-pet-travel", flag: "🇳🇴", name: "Norway", blurb: "EEA rules, the tapeworm treatment, Oslo entry." },
  { slug: "/iceland-pet-travel", flag: "🇮🇸", name: "Iceland", blurb: "One of the strictest — quarantine and permits." },
  { slug: "/seattle-pet-travel", flag: "🇺🇸", name: "Seattle / US Pacific NW", blurb: "Cabin hops including Seattle–Vancouver." },
  { slug: "/south-america-pet-travel", flag: "🌎", name: "South America", blurb: "Country-by-country across the continent." },
  { slug: "/central-america-pet-travel", flag: "🌎", name: "Central America", blurb: "Costa Rica, Panama, and the routes through." },
];

function SiteToolsOverview() {
  // The site's tools, each as name + one line + jump link. Helps a new
  // visitor see everything on offer instead of discovering tools by scrolling.
  const TOOLS = [
    {
      id: "intake",
      label: "Can my pet fly?",
      blurb: "A quick assessment. Answer a few questions about your pet and route, and get an honest read on how tricky your trip will be — and what stands in the way before you commit to booking.",
    },
    {
      id: "planner",
      label: "Journey planner",
      blurb: "Enter your origin and destination and get the cabin airlines that fly it, any connections you'll need, rough journey times, and a checklist matched to your exact route — including the tapeworm calculator when your destination needs one.",
    },
    {
      id: "airlines",
      label: "Airline comparison",
      blurb: "Compare cabin-pet policies across 30+ airlines side by side — weight limits, fees, carrier sizes, breed rules, and which routes each one will actually carry a pet on.",
    },
    {
      id: "checklist",
      label: "Checklist builder",
      blurb: "Build a printable, country-specific checklist of every document, vaccination and step your pet needs — in order, with the timing — so nothing gets missed before travel day.",
    },
    {
      id: "country-guides",
      label: "Country pet guides",
      blurb: "In-depth guides for specific destinations — the paperwork, the airlines that serve them, the quiet catches, and the workarounds — written country by country.",
    },
    {
      id: "documents",
      label: "Paperwork explained",
      blurb: "Plain-English breakdowns of the documents that confuse people most — Animal Health Certificates, pet passports, health certificates, import permits — what each one is and when you need it.",
    },
  ];

  function go(id) {
    scrollToTarget(id);
  }

  return (
    <section className="py-16 px-6 md:px-12 bg-stone-100 border-y border-stone-300">
      <div className="max-w-5xl mx-auto">
        <div className="text-xs uppercase tracking-[0.25em] text-amber-700 mb-3">
          What this site does
        </div>
        <h2 className="font-serif text-3xl md:text-4xl text-stone-900 mb-3 leading-tight">
          Free tools for every step of the trip
        </h2>
        <p className="font-serif text-stone-600 text-lg leading-relaxed mb-10 max-w-2xl">
          Flying with a pet means airline rules, country paperwork, and timing — all different, all easy to get wrong. These tools sort through it. Everything here is free.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {TOOLS.map((t, i) => (
            <button
              key={i}
              onClick={() => go(t.id)}
              className="text-left bg-white border border-stone-200 hover:border-amber-300 hover:bg-amber-50/40 transition-colors p-5 rounded-sm group"
            >
              <div className="font-serif text-lg text-stone-900 group-hover:text-amber-700 transition-colors mb-1.5">
                {t.label}
                <span className="text-amber-600 ml-1.5" aria-hidden="true">→</span>
              </div>
              <p className="text-sm text-stone-600 leading-relaxed">{t.blurb}</p>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}

function CountryGuidesSection() {
  return (
    <section id="country-guides" className="py-20 px-6 md:px-12 bg-white border-y border-stone-300 scroll-mt-24">
      <div className="max-w-5xl mx-auto">
        <div className="text-xs uppercase tracking-[0.25em] text-amber-700 mb-3">
          Country pet guides
        </div>
        <h2 className="font-serif text-3xl md:text-4xl text-stone-900 mb-3 leading-tight">
          In-depth guides, country by country
        </h2>
        <p className="font-serif text-stone-600 text-lg leading-relaxed mb-10 max-w-2xl">
          The tools above cover any route. These are the deeper dives — the paperwork, the airlines, the catches and the workarounds for specific destinations.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {COUNTRY_GUIDES.map((g) => (
            <a
              key={g.slug}
              href={g.slug}
              className="block bg-stone-50 border border-stone-200 hover:border-amber-300 hover:bg-amber-50/40 transition-colors p-5 rounded-sm group"
            >
              <div className="flex items-baseline gap-2 mb-1.5">
                <span aria-hidden="true" className="text-lg">{g.flag}</span>
                <span className="font-serif text-lg text-stone-900 group-hover:text-amber-700 transition-colors">
                  {g.name}
                </span>
              </div>
              <p className="text-sm text-stone-600 leading-relaxed">{g.blurb}</p>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}

function BackToTop() {
  const [visible, setVisible] = useState(false);

  // Section IDs in document order — used to work out which section the user
  // is currently in, so the button scrolls to THAT section's top rather than
  // all the way back to the hero.
  const SECTION_IDS = [
    "intake", "planner", "airlines", "routes", "destinations",
    "quarantine", "timeline", "checklist", "documents", "tips",
    "travel-day", "stories", "contact",
  ];

  useEffect(() => {
    function onScroll() {
      // Show once the user is more than ~1.5 viewport heights down.
      setVisible(window.scrollY > window.innerHeight * 1.5);
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  function scrollToCurrentSection() {
    // Find the section the user is currently inside: the last section whose
    // top edge is at or above a point just below the viewport top (the probe
    // line allows for the sticky nav). Scroll to that section's top.
    const probe = 80; // px below viewport top — clears the sticky nav
    let target = null;
    for (const id of SECTION_IDS) {
      const el = document.getElementById(id);
      if (!el) continue;
      const top = el.getBoundingClientRect().top;
      // Section top is above the probe line => user is in or past this section
      if (top <= probe) {
        target = el;
      } else {
        break; // sections are in order; first one below probe = stop
      }
    }
    if (target) {
      const targetTop = target.getBoundingClientRect().top;
      // If the current section's top is already at the viewport top (within a
      // small tolerance), a second tap escalates to the very top of the page.
      if (Math.abs(targetTop - probe) < 8 || targetTop > probe) {
        window.scrollTo({ top: 0, behavior: "smooth" });
      } else {
        target.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    } else {
      // Above the first section (still in hero) — go to page top.
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }

  if (!visible) return null;

  return (
    <button
      onClick={scrollToCurrentSection}
      aria-label="Scroll to top of this section"
      className="fixed left-5 z-40 w-11 h-11 flex items-center justify-center bg-stone-800 text-stone-100 border border-stone-600 hover:bg-stone-900 hover:border-stone-400 shadow-lg transition-colors rounded-full"
      style={{ bottom: "calc(1.5rem + env(safe-area-inset-bottom, 0px))" }}
    >
      <span className="text-xl leading-none -mt-0.5" aria-hidden="true">↑</span>
    </button>
  );
}

export default function PetTravel() {
  const [phase, setPhase] = useState("hero"); // hero | intake | results
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState({});

  // Handle deep links like /#assessment or /#checklist — AND the query-param
  // form /?go=assessment or /?go=checklist.
  //
  // Why both: in-app browsers (Instagram especially) mangle the URL fragment —
  // they URL-encode the "#" to "%23" or strip everything after it, so a
  // /#checklist link from an Instagram bio just lands on the hero. Query
  // parameters survive that processing intact, so /?go=checklist is the
  // reliable form to put in an Instagram bio or story link. We read whichever
  // one is present and treat them identically.
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const goParam = params.get("go");
    const rawHash = window.location.hash;
    // Hash may arrive as "#checklist" OR url-encoded as "%23checklist" —
    // decode first, then strip a leading "#" or "%23" if present.
    let hashId = "";
    if (rawHash && rawHash.length > 1) {
      hashId = decodeURIComponent(rawHash).replace(/^#/, "");
    } else if (window.location.pathname.includes("%23")) {
      // Some in-app browsers push the fragment into the path as "%23checklist"
      hashId = decodeURIComponent(window.location.pathname).replace(/^.*#/, "");
    }

    const id = (goParam || hashId || "").trim();
    if (!id) return;

    // "assessment" deep link should open the intake flow, not just scroll
    if (id === "assessment") {
      setPhase("intake");
      setStep(0);
    }

    // Wait for layout to settle, then scroll. Retry a couple of times
    // because in-app browsers can be slow to finish first paint.
    let attempts = 0;
    const tryScroll = () => {
      attempts += 1;
      const el = document.getElementById(id) || document.getElementById(id === "assessment" ? "intake-anchor" : id);
      if (el) {
        const top = el.getBoundingClientRect().top + window.scrollY - 80;
        window.scrollTo({ top, behavior: "smooth" });
      } else if (attempts < 5) {
        setTimeout(tryScroll, 200);
      }
    };
    setTimeout(tryScroll, 250);
  }, []);

  function startIntake() {
    setPhase("intake");
    setStep(0);
    // GA4 — track entry into the assessment tool. Fires when the user clicks
    // either the hero "Start" button or the "Can my pet fly?" nav link.
    if (typeof window !== "undefined" && window.gtag) {
      window.gtag("event", "can_my_pet_fly_start", {
        event_category: "tool_engagement",
      });
    }
    setTimeout(() => {
      document.getElementById("intake-anchor")?.scrollIntoView({ behavior: "smooth" });
    }, 50);
  }

  function completeIntake() {
    setPhase("results");
    // GA4 — track completion. Fires when all intake questions are answered
    // and the assessment renders. Includes destination + pet count so we can
    // see which trips people are researching.
    if (typeof window !== "undefined" && window.gtag) {
      window.gtag("event", "can_my_pet_fly_complete", {
        event_category: "tool_engagement",
        destination: answers.destination || "unknown",
        pet_count: answers.petCount || "1",
      });
    }
    // Assessment component handles its own scroll-into-view on mount
  }

  function reset() {
    setAnswers({});
    setStep(0);
    setPhase("hero");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  return (
    <div
      className="min-h-screen text-stone-900"
      style={{
        backgroundColor: "#faf6ed",
        fontFamily: "'Inter', -apple-system, sans-serif",
      }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,400;0,9..144,500;0,9..144,600;1,9..144,400;1,9..144,500&family=Inter:wght@400;500;600&display=swap');
        .font-serif { font-family: 'Fraunces', Georgia, serif; font-optical-sizing: auto; }
        body { font-family: 'Inter', sans-serif; }
        html { scroll-padding-top: 80px; }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-4px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn { animation: fadeIn 0.3s ease-out; }
      `}</style>

      <NavBar onStartIntake={startIntake} />

      <Hero onStart={startIntake} />

      <SiteToolsOverview />

      <div id="intake-anchor" />
      {(phase === "intake" || phase === "results") && (
        <>
          {phase === "intake" ? (
            <Intake
              answers={answers}
              setAnswers={setAnswers}
              step={step}
              setStep={setStep}
              onComplete={completeIntake}
            />
          ) : (
            <>
              <div id="results-anchor" />
              <Assessment answers={answers} onReset={reset} />
            </>
          )}
        </>
      )}

      <JourneyPlanner />
      <AirlineGrid />
      <Routes />
      <DifficultDestinations />
      <CountryGuidesSection />
      <QuarantineWatch />
      <Checklist />
      <Documents />
      <Tips />
      <TravelDay />
      <Stories />
      <Contact />
      <Footer />
      <AnalyticsOptOutListener />
      <BackToTop />
    </div>
  );
}
