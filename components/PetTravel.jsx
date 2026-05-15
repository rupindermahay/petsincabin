import { useState, useMemo, useEffect, useRef } from "react";
import { TRAVEL_DAY_GUIDE } from "./travelDayGuide";
import { PawPrint, Plane, FileCheck, AlertTriangle, ArrowRight, ArrowLeft, RotateCcw, Check, Info, Luggage, Stethoscope, ScrollText, Sparkles, Ship, Map as MapIcon, Train, Compass, Menu, X } from "lucide-react";

// ---------- SITE META ----------
// Update this date whenever the site content changes — it's shown in the
// footer as "Updated on DD Month YYYY" so visitors know how current the
// guidance is. Format: "DD Month YYYY".
const LAST_UPDATED = "15 May 2026";

// ---------- DATA ----------

const AIRLINES = [
  {
    name: "Alaska Airlines",
    scope: "north-america",
    tags: ["us"],
    cabin: "Cabin US domestic ✓ — limited intl (Mexico, Canada, Costa Rica)",
    cabinStatus: "yes",
    direction: "Cabin allowed: domestic US, Hawaii (with strict prep), some Mexico, Canada, and Costa Rica routes. Cabin NOT allowed: most other international destinations (Alaska's network is mostly North America-focused).",
    originAllowed: { uk: "no", us: "yes", eu: "no", india: "no", canada: "yes", uae: "no", caribbean: "no" },
    destinationAllowed: { uk: "no", us: "yes", eu: "no", india: "no", canada: "yes", uae: "no", caribbean: "no" },
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
    tags: ["us", "caribbean"],
    cabin: "Yes — but NO transatlantic / transpacific cabin",
    cabinStatus: "conditional",
    direction: "Cabin allowed: domestic US, Canada, Mexico, Puerto Rico, Caribbean, Central America (up to 12 hour flights). Cabin NOT allowed (both directions): transatlantic flights (Europe), transpacific flights (Asia), UK, Hawaii.",
    originAllowed: { uk: "no", us: "yes", eu: "no", india: "no", canada: "yes", uae: "no", caribbean: "yes" },
    destinationAllowed: { uk: "no", us: "yes", eu: "no", india: "no", canada: "yes", uae: "no", caribbean: "yes" },
    fee: "$150 each way",
    weight: "Pet + carrier max 20 lb (~9 kg) combined",
    carrier: "Soft (recommended): 18 × 11 × 11 in. Hard: 19 × 13 × 9 in",
    notes: "Cabin only for general public — cargo limited to active U.S. Military and State Dept. NOT a transatlantic option (no cabin pets on Europe/Asia flights). Restrictions to/from PHX, TUS, LAS, PSP May–Sept.",
    intl: "Limited (Americas + Caribbean only)",
    verified: "May 2026",
    link: "https://www.aa.com/i18n/travel-info/special-assistance/traveling-with-pets.jsp",
  },
  {
    name: "Delta",
    tags: ["us", "europe", "longhaul", "caribbean"],
    cabin: "Cabin US/Canada/EU only — long banned list",
    cabinStatus: "conditional",
    direction: "Cabin allowed: domestic US, Canada, Puerto Rico, USVI, continental EU (Paris, Amsterdam, Rome, etc.). Cabin NOT allowed (both directions): UK, Australia, NZ, UAE/Dubai, Hong Kong, Hawaii, Ireland, Brazil, Colombia, South Africa, Jamaica, Iceland, Barbados, Dakar, Dominican Republic.",
    originAllowed: { uk: "no", us: "yes", eu: "yes", india: "no", canada: "yes", uae: "no", caribbean: "yes" },
    destinationAllowed: { uk: "no", us: "yes", eu: "yes", india: "no", canada: "yes", uae: "no", caribbean: "yes" },
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
    tags: ["us", "europe", "longhaul", "caribbean"],
    cabin: "Cabin allowed — but huge banned destination list",
    cabinStatus: "conditional",
    direction: "Cabin allowed: domestic US, Canada, Mexico, continental EU. Cabin NOT allowed (both directions): Australia, Barbados, Cuba, Guam, French Polynesia, Hawaii, Hong Kong, Iceland, India, Ireland, Jamaica, Marshall Islands, Micronesia, NZ, Norway, Palau, Panama, Philippines, Saint Kitts and Nevis, South Africa, Sweden, Trinidad and Tobago, UAE, UK.",
    originAllowed: { uk: "no", us: "yes", eu: "yes", india: "no", canada: "yes", uae: "no", caribbean: "yes" },
    destinationAllowed: { uk: "no", us: "yes", eu: "yes", india: "no", canada: "yes", uae: "no", caribbean: "yes" },
    fee: "$150 each way (plus $150 again for stopovers over 4 hours)",
    weight: "Must fit under seat in carrier",
    carrier: "Hard: 17.5 × 12 × 7.5 in. Soft: 18 × 11 × 11 in",
    notes: "Pets in cabin only — PetSafe cargo program discontinued except for active U.S. Military and State Dept. Long destination ban list — always confirm by phone before booking. Reserve early; limited spots per flight.",
    intl: "Yes (restricted)",
    verified: "May 2026",
    link: "https://www.united.com/en-us/travel-information/special-needs/travel-with-pets",
  },
  {
    name: "JetBlue",
    scope: "us-caribbean",
    tags: ["us", "caribbean"],
    cabin: "Yes — domestic + many Caribbean / Latin America destinations",
    cabinStatus: "conditional",
    direction: "Cabin allowed: domestic US, Puerto Rico, USVI, plus broad Caribbean and Latin America reach via JetBlue's network. Cabin NOT allowed (both directions): UK (service dogs only), Europe (no transatlantic cabin). IMPORTANT: cabin pet eligibility depends on each destination country's own import rules — JetBlue may operate the route but the country's paperwork (and sometimes breed restrictions or rabies titer requirements) determines whether your pet qualifies. Always verify directly with JetBlue for your specific route AND check the destination's official import requirements.",
    originAllowed: { uk: "no", us: "yes", eu: "no", india: "no", canada: "yes", uae: "no", caribbean: "yes" },
    destinationAllowed: { uk: "no", us: "yes", eu: "no", india: "no", canada: "yes", uae: "no", caribbean: "yes" },
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
    tags: ["us"],
    cabin: "Yes — domestic only",
    cabinStatus: "yes",
    direction: "Cabin allowed: domestic US, Puerto Rico, USVI only. Cabin NOT allowed: all other international routes (Southwest is a domestic-only carrier with limited Caribbean reach).",
    originAllowed: { uk: "no", us: "yes", eu: "no", india: "no", canada: "no", uae: "no", caribbean: "no" },
    destinationAllowed: { uk: "no", us: "yes", eu: "no", india: "no", canada: "no", uae: "no", caribbean: "no" },
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
    tags: ["us", "caribbean"],
    cabin: "Yes — domestic only",
    cabinStatus: "yes",
    direction: "Cabin allowed: domestic US, Puerto Rico, USVI, plus a few Caribbean and Latin America routes. Cabin NOT allowed: most international destinations.",
    originAllowed: { uk: "no", us: "yes", eu: "no", india: "no", canada: "no", uae: "no", caribbean: "yes" },
    destinationAllowed: { uk: "no", us: "yes", eu: "no", india: "no", canada: "no", uae: "no", caribbean: "yes" },
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
    tags: ["us"],
    cabin: "Yes — domestic only",
    cabinStatus: "yes",
    direction: "Cabin allowed: domestic US only. Cabin NOT allowed: all international routes (Frontier is a domestic-only carrier).",
    originAllowed: { uk: "no", us: "yes", eu: "no", india: "no", canada: "no", uae: "no", caribbean: "no" },
    destinationAllowed: { uk: "no", us: "yes", eu: "no", india: "no", canada: "no", uae: "no", caribbean: "no" },
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
    tags: ["us"],
    cabin: "Cabin OUT of Hawaii ✓ — but limited routes INTO Hawaii",
    cabinStatus: "conditional",
    direction: "Cabin allowed: inter-island Hawaii flights AND flights LEAVING Hawaii to US mainland. Cabin NOT allowed: flights INTO Hawaii from the mainland (cargo only — Hawaii's strict quarantine rules), AND no cabin to/from JFK, BOS, AUS, SLC, PPG. No international cabin at all.",
    originAllowed: { uk: "no", us: "yes", eu: "no", india: "no", canada: "no", uae: "no", caribbean: "no" },
    destinationAllowed: { uk: "no", us: "no", eu: "no", india: "no", canada: "no", uae: "no", caribbean: "no" },
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
    tags: ["canada", "uk-out", "us", "longhaul", "caribbean"],
    cabin: "Cabin OUT of UK ✓ — but cargo only INTO UK",
    cabinStatus: "conditional",
    direction: "Cabin allowed: domestic, US/Canada, Europe, and OUT of UK (LHR, Edinburgh). Cabin NOT allowed: INTO UK (cargo only), Australia, NZ, Hawaii, Ireland, Hong Kong, South Africa, Jamaica, Barbados.",
    originAllowed: { uk: "yes", us: "yes", eu: "yes", india: "no", canada: "yes", uae: "no", caribbean: "yes" },
    destinationAllowed: { uk: "no", us: "yes", eu: "yes", india: "no", canada: "yes", uae: "no", caribbean: "yes" },
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
    tags: ["canada", "uk-out", "longhaul"],
    cabin: "Cabin OUT of UK ✓ (Manchester / Glasgow only)",
    cabinStatus: "conditional",
    direction: "Cabin allowed: Canada, US, Europe, and OUT of UK from Manchester (MAN) and Glasgow (GLA) — NOT Gatwick. Cabin NOT allowed: into UK (cargo only).",
    originAllowed: { uk: "yes", us: "no", eu: "yes", india: "no", canada: "yes", uae: "no", caribbean: "no" },
    destinationAllowed: { uk: "no", us: "no", eu: "yes", india: "no", canada: "yes", uae: "no", caribbean: "no" },
    fee: "CAD $50–$120 depending on route",
    weight: "Pet + carrier max 17.6 lb (8 kg)",
    carrier: "Soft-sided. Max 16 × 9 × 9 in (40 × 23 × 23 cm)",
    notes: "Another Canadian carrier that allows pets in cabin OUT of the UK — handy if you live closer to Manchester or Glasgow than London. Air Transat operates this from Manchester (MAN) and Glasgow (GLA) only — NOT Gatwick. Like Air Canada, pets can't fly cabin into the UK on return.",
    intl: "Yes (transatlantic)",
    verified: "May 2026",
    link: "https://www.airtransat.com/en/travel-info/baggage/special-baggage/pets",
  },
  {
    name: "Air France / KLM",
    tags: ["uk-out", "europe", "india", "us", "longhaul"],
    cabin: "Cabin OUT of UK ✓ — but cargo only INTO UK",
    cabinStatus: "conditional",
    direction: "Cabin allowed: most international routes including OUT of UK (LHR → Paris/Amsterdam). Cabin NOT allowed: INTO UK or Ireland (cargo only — UK government rule). Bans cabin on connecting US flights operated by Delta/Virgin (operator's rules apply).",
    originAllowed: { uk: "yes", us: "yes", eu: "yes", india: "yes", canada: "yes", uae: "no", caribbean: "no" },
    destinationAllowed: { uk: "no", us: "yes", eu: "yes", india: "yes", canada: "yes", uae: "no", caribbean: "no" },
    fee: "~€75–€200 depending on route",
    weight: "Pet + carrier max 8 kg (17.6 lb)",
    carrier: "46 × 28 × 24 cm (~18 × 11 × 9 in), soft-sided only",
    notes: "One of the most popular cabin options OUT of the UK for travel to Europe or onwards. Combined carrier from LHR (NOT Gatwick — Gatwick blocks cabin pets). Connect at Paris/Amsterdam for cabin-friendly onward flights to USA, India, and most of the world. Not allowed in business class on intercontinental. Snub-nosed breeds: cabin OK; cargo banned for medical reasons.",
    intl: "Yes",
    verified: "May 2026",
    link: "https://www.airfrance.us/information/passagers/animaux",
  },
  {
    name: "Lufthansa",
    tags: ["uk-out", "europe", "india", "us", "longhaul"],
    cabin: "Cabin OUT of UK ✓ — but cargo only INTO UK",
    cabinStatus: "conditional",
    direction: "Cabin allowed: most international routes including OUT of UK (LHR → Frankfurt/Munich). Cabin NOT allowed: INTO UK (cargo only — UK government rule), into Australia, NZ, Hawaii.",
    originAllowed: { uk: "yes", us: "yes", eu: "yes", india: "yes", canada: "yes", uae: "no", caribbean: "no" },
    destinationAllowed: { uk: "no", us: "yes", eu: "yes", india: "yes", canada: "yes", uae: "no", caribbean: "no" },
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
    tags: ["india", "europe", "us", "canada", "longhaul"],
    cabin: "Cabin India ↔ USA / Europe / Asia ✓ — NOT to UK / Australia",
    cabinStatus: "yes",
    direction: "Air India's 2026 'Paws on Board' programme allows cabin pets up to 10 kg (combined with carrier) on 80+ domestic and international routes. Cabin allowed: domestic India, India ↔ USA (direct: DEL/BOM/BLR/HYD/MAA ↔ JFK/SFO/IAD/ORD), India ↔ Europe (Frankfurt, Paris, Amsterdam, London cargo-only), India ↔ Asia. Cabin NOT allowed: India ↔ UK (cargo hold only — UK government embargo), India ↔ UAE (departing India, pets must go cargo; arriving in India from UAE has cabin options).",
    originAllowed: { uk: "no", us: "yes", eu: "yes", india: "yes", canada: "yes", uae: "no", caribbean: "no" },
    destinationAllowed: { uk: "no", us: "yes", eu: "yes", india: "yes", canada: "yes", uae: "no", caribbean: "no" },
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
    tags: ["uk-out", "europe", "india", "us", "longhaul"],
    cabin: "Cabin OUT of UK ✓ — and India ↔ USA via Warsaw",
    cabinStatus: "conditional",
    direction: "Cabin allowed: most international routes including OUT of UK (LHR → Warsaw), India (Delhi) ↔ USA via Warsaw both legs. Cabin NOT allowed: INTO UK (cargo only — UK government rule).",
    originAllowed: { uk: "yes", us: "yes", eu: "yes", india: "yes", canada: "yes", uae: "no", caribbean: "no" },
    destinationAllowed: { uk: "no", us: "yes", eu: "yes", india: "yes", canada: "yes", uae: "no", caribbean: "no" },
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
    tags: ["uk-out", "europe", "india", "us", "longhaul"],
    cabin: "Cabin OUT of UK ✓ — and India ↔ USA via Zurich",
    cabinStatus: "conditional",
    direction: "Cabin allowed: most international routes including OUT of UK (LHR → Zurich), India ↔ USA via Zurich both legs. Cabin NOT allowed: INTO UK (cargo only — UK government rule).",
    originAllowed: { uk: "yes", us: "yes", eu: "yes", india: "yes", canada: "yes", uae: "no", caribbean: "no" },
    destinationAllowed: { uk: "no", us: "yes", eu: "yes", india: "yes", canada: "yes", uae: "no", caribbean: "no" },
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
    originAllowed: { uk: "yes", us: "yes", eu: "yes", india: "no", canada: "yes", uae: "no", caribbean: "no" },
    destinationAllowed: { uk: "no", us: "yes", eu: "yes", india: "no", canada: "yes", uae: "no", caribbean: "no" },
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
    tags: ["dubai", "india", "europe", "uk-out", "us"],
    cabin: "Cabin OUT of UK / US / India / Europe → Abu Dhabi ✓ — but NOT cabin INTO the UK or US",
    cabinStatus: "conditional",
    direction: "Cabin allowed: OUT of the UK (London Heathrow, Manchester) to Abu Dhabi, OUT of the USA to Abu Dhabi, India ↔ Abu Dhabi (Delhi, Mumbai, Bangalore, Chennai), Europe ↔ Abu Dhabi (most major cities), Canada ↔ Abu Dhabi. All under 8 kg combined. Cabin NOT allowed: INTO the UK (London, Manchester) and INTO the USA — Etihad's country-restrictions page lists these as 'flights to' only, meaning the inbound direction is blocked while flying OUT to Abu Dhabi is permitted. Also no cabin to/from Australia (Sydney), Hong Kong, Maldives, South Africa, Bali, and several Indian airports (Ahmedabad, Jaipur, Kochi, Kozhikode, Thiruvananthapuram). And NEVER into Dubai (DXB) — UAE law requires cargo into DXB for all airlines.",
    originAllowed: { uk: "yes", us: "yes", eu: "yes", india: "yes", canada: "yes", uae: "yes", caribbean: "no" },
    destinationAllowed: { uk: "no", us: "no", eu: "yes", india: "yes", canada: "yes", uae: "yes", caribbean: "no" },
    fee: "Promo: $399 per segment (bookings before end of May 2026). Standard: $1,500 per segment.",
    weight: "Pet + carrier max 8 kg (17.6 lb) — economy under-seat OR buy adjacent seat for bigger carrier",
    carrier: "Economy under-seat: max 40 × 40 × 22 cm. Adjacent seat: max 50 × 43 × 50 cm. Soft-sided, well-ventilated.",
    notes: "The ONLY airline that allows cabin pets into the UAE — and only into Abu Dhabi (AUH), 90 minutes from Dubai by road. Per Etihad's official country-restrictions page, the UK and USA are listed as 'flights to' restrictions — meaning cabin pets flying OUT of the UK (LHR, MAN) or OUT of the US to Abu Dhabi are permitted, while the inbound direction is not. Always confirm your specific route directly with Etihad when booking. Submit booking form 7+ days before, email all docs 72 hrs before. UAE Health Certificate required. Banned breeds: Pit Bull, Staffies, American Bully, Brazilian/Argentinian Mastiff, Tosa, Doberman, Rottweiler, Boxer, Canario Presa. Snub-nosed breeds restricted seasonally.",
    intl: "Yes (Abu Dhabi-routed only)",
    verified: "May 2026",
    link: "https://www.etihad.com/en/plan/travel-companion/travelling-with-pets",
  },
  {
    name: "Turkish Airlines",
    tags: ["uk-out", "europe", "india", "us"],
    cabin: "Cabin OUT of UK ✓ via Istanbul — but NOT into Dubai (UAE law)",
    cabinStatus: "conditional",
    direction: "Cabin allowed: most international routes via Istanbul including OUT of UK (LHR/MAN → Istanbul), USA ↔ Istanbul, India ↔ Istanbul (Delhi, Mumbai, Bangalore, Hyderabad), and many Asian/African destinations. Economy class only — business class cabin pets banned from April 21, 2026 (new bookings). Cabin NOT allowed: INTO UK from Istanbul (cargo only — UK government rule), into Dubai DXB (UAE law applies regardless of airline), some Middle East destinations.",
    originAllowed: { uk: "yes", us: "yes", eu: "yes", india: "yes", canada: "yes", uae: "no", caribbean: "no" },
    destinationAllowed: { uk: "no", us: "yes", eu: "yes", india: "yes", canada: "yes", uae: "no", caribbean: "no" },
    fee: "$15 short-haul domestic · $70 starting price international (varies by route)",
    weight: "Pet + carrier max 8 kg (17.6 lb)",
    carrier: "Soft-sided. Max 40 × 30 × 23 cm (L × W × H) under-seat",
    notes: "Strong Istanbul-hub option for Asia-Europe-Americas connections. Pet rooms at Istanbul (IST) airport include a pet toilet — useful for layovers. Frequent IST flights to most Indian cities. Good for India → Europe → USA routings via Istanbul. ECONOMY ONLY (no cabin pets in business since April 2026). Reserve at least 6 hours before, recommended 48+ hours for international.",
    intl: "Yes (most routes)",
    verified: "May 2026",
    link: "https://www.turkishairlines.com/en-int/any-questions/travelling-with-pets/",
  },
  {
    name: "Iberia",
    tags: ["europe", "us", "longhaul"],
    cabin: "Cabin EU/transatlantic ✓ — but NOT to UK",
    cabinStatus: "conditional",
    direction: "Cabin allowed: most international routes including Spain ↔ EU, Spain ↔ USA (JFK/MIA/ORD/BOS via Madrid), Spain ↔ Latin America. Cabin NOT allowed (both directions): UK (LHR, MAN, EDI, LGW — Iberia uses IAG Cargo to/from UK). Snub-nosed breeds allowed cabin only (not hold).",
    originAllowed: { uk: "no", us: "yes", eu: "yes", india: "no", canada: "yes", uae: "no", caribbean: "no" },
    destinationAllowed: { uk: "no", us: "yes", eu: "yes", india: "no", canada: "yes", uae: "no", caribbean: "no" },
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
    originAllowed: { uk: "no", us: "yes", eu: "yes", india: "no", canada: "no", uae: "no", caribbean: "no" },
    destinationAllowed: { uk: "no", us: "yes", eu: "yes", india: "no", canada: "no", uae: "no", caribbean: "no" },
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
    tags: ["caribbean", "us"],
    cabin: "Cabin ✓ — small dogs and cats on LATAM-operated routes",
    cabinStatus: "conditional",
    direction: "Cabin allowed: Economy and Premium Economy on LATAM-operated routes only (no codeshares, no connections with other airlines). Strongest for South America — domestic Brazil (São Paulo, Rio, Brasília), domestic Chile (Santiago and regional), and regional hops between Brazil, Chile, Argentina, Peru, Uruguay, Ecuador and Colombia. Also LATAM's own long-haul routes from South America to Europe (Madrid, Frankfurt, Rome, Lisbon). Cabin TEMPORARILY SUSPENDED on US↔Brazil, Bolivia, Ecuador, Peru and Colombia due to CDC dog import rules. NOT available to/from the UK, Australia, New Zealand, South Africa or the Galapagos.",
    originAllowed: { us: "yes (Brazil/Peru/Ecuador/Colombia routes suspended — verify)", canada: "no", uk: "no", eu: "yes (LATAM-operated long-haul only)", india: "no", caribbean: "yes", uae: "no" },
    destinationAllowed: { us: "yes (some routes suspended — verify)", canada: "no", uk: "no", eu: "yes (LATAM-operated only)", india: "no", caribbean: "yes", uae: "no" },
    fee: "Cabin: BRL 200 domestic Brazil · ~USD 200 regional South America · ~USD 250 long-haul (to Europe). Hold fees are separate and weight-banded.",
    weight: "Pet + carrier combined max 7 kg for cabin. Soft carrier max 40 × 28 × 25 cm. Hard kennel max 36 × 33 × 19 cm. Cabin pets carried on A319/A320/A321/A350 and B777 aircraft.",
    carrier: "Soft-sided carrier (max 40 × 28 × 25 cm) or hard kennel (max 36 × 33 × 19 cm). No wheels. Must be leak-proof and well-ventilated. Pet must be able to stand, turn and move without touching walls or ceiling.",
    notes: "LATAM is THE cabin-pet carrier for South America — if you're moving within Brazil, Chile, or between South American countries, this is the airline. Key restrictions: LATAM-operated flights ONLY — no codeshares, no connections to/from other airlines (a connection on Delta or any partner voids the pet booking). Minimum 16 weeks old (6 months for US travel). Brachycephalic breeds not accepted in the hold but CAN travel in cabin if they meet size requirements. Dangerous breeds banned from both. Book through LATAM's Contact Center or WhatsApp — not online — up to 4 hours before a cabin flight. Arrive 3 hours early for domestic Brazil, 4 hours for international. Within Brazil you need a health certificate (issued within 10 days) and proof of rabies vaccine with the 21-day waiting period observed.",
    intl: "Yes — South America domestic and regional, plus LATAM-operated long-haul to Europe",
    verified: "May 2026",
    link: "https://www.latamairlines.com/us/en/experience/prepare-your-trip/pets-transportation/cabin",
  },
  {
    name: "Aeromexico",
    scope: "north-america",
    tags: ["mexico", "us"],
    cabin: "Cabin ✓ — small dogs and cats, flights 6 hours or less",
    cabinStatus: "conditional",
    direction: "Cabin allowed: small cats and dogs on Aeromexico-operated flights of 6 hours or less — covers domestic Mexico, Mexico↔US, Mexico↔Canada, and Mexico↔Caribbean. Cabin NOT allowed: flights over 6 hours, and no cabin pets to London (UK). Connecting onto another airline means complying with that airline's pet rules separately.",
    originAllowed: { us: "yes", canada: "yes", uk: "no", eu: "no (flights over 6h)", india: "no", caribbean: "yes", uae: "no", mexico: "yes" },
    destinationAllowed: { us: "yes", canada: "yes", uk: "no", eu: "no (flights over 6h)", india: "no", caribbean: "yes", uae: "no", mexico: "yes" },
    fee: "~$162 USD international (~$168 high season) · ~$1,350–1,700 MXN domestic Mexico",
    weight: "Pet + carrier combined max 9 kg. Carrier max 40 × 30 × 20 cm.",
    carrier: "Hard or soft-sided carrier, max 40 × 30 × 20 cm, must fit under the seat. Well-ventilated, with a one-piece absorbent base. Pet must be able to turn around and lie down naturally.",
    notes: "Aeromexico is the natural cabin carrier for Mexico and short cross-border routes. The 6-hour flight limit is the key constraint — it rules out cabin travel on Aeromexico's long-haul routes (Europe, Asia, South America), but covers all the common Mexico↔US and Mexico↔Canada pairs. Brachycephalic breeds CAN fly in cabin (they're only banned from cargo). Minimum 8 weeks old (6 months for US travel). One pet per passenger. Book through Aeromexico's Customer Service — not online — and arrive 2 hours early. A $125 layover fee applies for US connections of 4+ hours.",
    intl: "Yes — Mexico, US, Canada, Caribbean (flights 6h or less)",
    verified: "May 2026",
    link: "https://aeromexico.com/en-us/travel-information/flying-with-pets",
  },
  {
    name: "Vueling",
    tags: ["europe"],
    cabin: "Cabin ✓ — small dogs and cats across Europe",
    cabinStatus: "yes",
    direction: "Cabin allowed: dogs, cats, birds (not birds of prey) and turtles across Vueling's European network — Spain domestics, and routes between Spain and the rest of Europe. Cabin NOT allowed: flights to/from the UK and Iceland (Vueling does not carry pets on those routes at all). Vueling has no hold or cargo option — cabin is the only way, so larger pets can't fly Vueling.",
    originAllowed: { us: "no", canada: "no", uk: "no", eu: "yes", india: "no", caribbean: "no", uae: "no", mexico: "no" },
    destinationAllowed: { us: "no", canada: "no", uk: "no", eu: "yes", india: "no", caribbean: "no", uae: "no", mexico: "no" },
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
    originAllowed: { us: "yes", canada: "no", uk: "no", eu: "no", india: "no", caribbean: "no", uae: "no", mexico: "yes" },
    destinationAllowed: { us: "yes", canada: "no", uk: "no", eu: "no", india: "no", caribbean: "no", uae: "no", mexico: "yes" },
    fee: "Varies by route — typically ~$150 USD per kennel each way · lower for domestic Mexico",
    weight: "Pet + carrier combined max ~12 kg. Carrier max 44 × 30 × 19 cm.",
    carrier: "Max 44 × 30 × 19 cm, must fit under the seat. For dogs the carrier may be soft or rigid; for cats it MUST be rigid plastic. Fully enclosed, no perforated floor, no wheels. Secured with a plastic strap provided at the airport. Pet stays inside the whole flight.",
    notes: "Volaris is Mexico's big low-cost carrier — useful for domestic Mexico and Mexico↔US/Central America cabin travel. The key limitation versus Aeromexico: Volaris bans a long list of breeds entirely (all brachycephalic dogs and cats, plus pit bull types, mastiffs, and others) — neither cabin nor checked. Minimum 4 months old. One pet per passenger. Owner must sit in a window seat, not an exit row. Book through Volaris directly. Arrive 2 hours early domestic, 3 hours international.",
    intl: "Yes — Mexico, US, Central America, Colombia",
    verified: "May 2026",
    link: "https://cms.volaris.com/en/travel-info/optional-services/fly-with-your-pet/",
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
    link: "https://www.emirates.com/english/help/topics/baggage-information/transporting-animals/",
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

  // ═══════ FROM WASHINGTON DULLES ═══════
  { from: "Washington (IAD)", to: "Frankfurt (FRA)", duration: "8h 30m", note: "Lufthansa / United. ✓ Cabin (under 8 kg). Dulles's main direct cabin to Europe.", tags: ["us", "europe"] },
  { from: "Washington (IAD)", to: "Paris (CDG)", duration: "7h 45m", note: "Air France / United. ✓ Cabin (under 8 kg).", tags: ["us", "europe"] },

  // ═══════ FROM SAN FRANCISCO ═══════
  { from: "San Francisco (SFO)", to: "Frankfurt (FRA)", duration: "11h 30m", note: "Lufthansa / United. ✓ Cabin (under 8 kg). West coast to Europe direct — long flight, consider an overnight in Europe before onward connections.", tags: ["us", "europe"] },
  { from: "San Francisco (SFO)", to: "Paris (CDG)", duration: "11h", note: "Air France / United. ✓ Cabin (under 8 kg).", tags: ["us", "europe"] },
  { from: "San Francisco (SFO)", to: "Delhi (DEL)", duration: "16h 30m", note: "Air India 'Paws on Board'. ✓ Cabin direct (under 10 kg combined). The shortest US west coast → India cabin route. Book via Air India customer support 48 hrs ahead; AQCS NOC must be ready before boarding.", tags: ["us", "india"] },
  { from: "San Francisco (SFO)", to: "Mumbai (BOM)", duration: "17h", note: "Air India 'Paws on Board'. ✓ Cabin direct (under 10 kg combined). Direct SFO→Mumbai.", tags: ["us", "india"] },
  { from: "San Francisco (SFO)", to: "Bengaluru (BLR)", duration: "17h", note: "Air India 'Paws on Board'. ✓ Cabin direct (under 10 kg combined). One of the few direct cabin options to South India.", tags: ["us", "india"] },
  { from: "San Francisco (SFO)", to: "Hyderabad (HYD)", duration: "17h", note: "Air India 'Paws on Board'. ✓ Cabin direct (under 10 kg combined). Direct SFO→Hyderabad.", tags: ["us", "india"] },

  // ═══════ FROM SEATTLE ═══════
  { from: "Seattle (SEA)", to: "San Francisco (SFO)", duration: "2h 20m", note: "Alaska Airlines / Delta. ✓ Cabin ($100 each way). The crucial domestic leg for Seattle travellers heading to India — connect at SFO to Air India's direct cabin route to DEL/BOM/BLR/HYD. Same-airline booking preferred to avoid re-check.", tags: ["us"] },
  { from: "Seattle (SEA)", to: "Frankfurt (FRA)", duration: "10h 30m", note: "Lufthansa / Condor. ✓ Cabin (under 8 kg). Seattle's main direct cabin route to Europe — onward to India via Lufthansa (except Bangalore — Lufthansa specifically excludes BLR; use Air India SFO instead).", tags: ["us", "europe"] },
  { from: "Seattle (SEA)", to: "Amsterdam (AMS)", duration: "9h 45m", note: "Delta / KLM. ✓ Cabin (under 8 kg). Seattle's direct to Amsterdam — onward KLM cabin to most major Indian cities.", tags: ["us", "europe"] },
  { from: "Seattle (SEA)", to: "Paris (CDG)", duration: "10h", note: "Delta / Air France. ✓ Cabin (under 8 kg). Direct to Paris — onward Air France cabin to Delhi/Mumbai.", tags: ["us", "europe"] },
  { from: "Seattle (SEA)", to: "Vancouver (YVR)", duration: "1h", note: "Alaska Airlines. ✓ Cabin ($100 each way). Short domestic-style hop to Canada.", tags: ["us", "canada"] },

  // ═══════ FROM JFK ═══════
  { from: "New York (JFK)", to: "Delhi (DEL)", duration: "14h 30m", note: "Air India 'Paws on Board'. ✓ Cabin direct (under 10 kg combined). East coast → India direct.", tags: ["us", "india"] },
  { from: "New York (JFK)", to: "Mumbai (BOM)", duration: "16h", note: "Air India 'Paws on Board'. ✓ Cabin direct (under 10 kg combined). JFK→Mumbai direct cabin.", tags: ["us", "india"] },

  // ═══════ FROM NEWARK ═══════
  { from: "Newark (EWR)", to: "Mumbai (BOM)", duration: "15h", note: "Air India 'Paws on Board'. ✓ Cabin direct (under 10 kg combined). Newark direct to Mumbai.", tags: ["us", "india"] },

  // ═══════ FROM CHICAGO ═══════ (existing routes preserved, India added)
  { from: "Chicago (ORD)", to: "Delhi (DEL)", duration: "14h 30m", note: "Air India 'Paws on Board'. ✓ Cabin direct (under 10 kg combined). Midwest direct to India.", tags: ["us", "india"] },

  // ═══════ FROM WASHINGTON DULLES ═══════ (existing routes preserved, India added)
  { from: "Washington (IAD)", to: "Delhi (DEL)", duration: "14h 30m", note: "Air India 'Paws on Board'. ✓ Cabin direct (under 10 kg combined). Dulles direct to India.", tags: ["us", "india"] },

  // ═══════ FROM CAPE TOWN ═══════
  { from: "Cape Town (CPT)", to: "Johannesburg (JNB)", duration: "2h", note: "Lift. ✓ Cabin — small dogs under 7 kg only, on Lift's dog-friendly flights. Domestic South Africa only. Submit Lift's Dog-in-Cabin form 7+ days ahead. No cats. International SA travel is cargo-only on all airlines.", tags: ["south-africa"] },
  { from: "Cape Town (CPT)", to: "Durban (DUR)", duration: "1h 50m", note: "Lift. ✓ Cabin — small dogs under 7 kg on dog-friendly flights. Domestic only. Cargo-equivalent options: FlySafair's PetLounge service (climate-controlled hold).", tags: ["south-africa"] },

  // ═══════ FROM CHICAGO ═══════
  { from: "Chicago (ORD)", to: "Frankfurt (FRA)", duration: "8h 45m", note: "Lufthansa. ✓ Cabin (under 8 kg). Frankfurt's Animal Lounge available for cargo connections.", tags: ["us", "europe"] },
  { from: "Chicago (ORD)", to: "Paris (CDG)", duration: "8h 30m", note: "Air France. ✓ Cabin (under 8 kg). Midwest's main direct cabin to Europe.", tags: ["us", "europe"] },

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
      { route: "CDG → JFK", time: "7h 45m", airline: "Air France or Delta ✓ Cabin" },
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
      { route: "YUL → MIA", time: "3h 30m", airline: "Air Canada / AA / United ✓ Cabin" },
    ],
    note: "Theo's Mum's actual route. The overnight in Montreal is what made it work — the pet recovers, you recover, then the short hop to Miami the next morning is easy.",
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
      { route: "FRA → LAX", time: "12h", airline: "Lufthansa ✓ Cabin" },
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
      { route: "AMS → JFK", time: "8h", airline: "KLM ✓ Cabin" },
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
      { route: "WAW → ORD", time: "10h", airline: "LOT Polish ✓ Cabin (€70)" },
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
      { route: "Eurotunnel Le Shuttle to Folkestone", time: "35m", airline: "Pet stays in car" },
      { route: "Folkestone → London (drive)", time: "1h 30m", airline: "Pet stays with you" },
    ],
    note: "There's no cabin pet flight INTO the UK from anywhere (UK government rule, all airlines). The standard workaround: fly cabin to Paris, then drive + Eurotunnel + drive. Works from any major US gateway with cabin pets to Paris (JFK, BOS, ORD, MIA, LAX). Eurotunnel costs £25–£60 per pet. Most UK pet importers use this exact route.",
    tags: ["us", "uk-out", "europe"],
  },
  {
    from: "Paris (CDG)",
    to: "London / UK",
    duration: "4–5h total",
    legs: [
      { route: "CDG → Calais (drive/taxi)", time: "2h 30m", airline: "Pet stays with you" },
      { route: "Eurotunnel Le Shuttle to Folkestone", time: "35m", airline: "Pet stays in car" },
      { route: "Folkestone → London (drive)", time: "1h 30m", airline: "Pet stays with you" },
    ],
    note: "If you're already in Europe (Paris, Amsterdam, Brussels) the Eurotunnel is by far the easiest way to bring your pet INTO the UK. Pet stays with you the whole way. The same workflow applies departing from AMS or BRU (just longer drive to Calais).",
    tags: ["europe", "uk-out"],
  },
  // USA → UAE (no direct cabin to UAE — go via Europe to Abu Dhabi)
  {
    from: "New York (JFK)",
    to: "Abu Dhabi (AUH)",
    duration: "20–22h total",
    legs: [
      { route: "JFK → Paris CDG", time: "7h 45m", airline: "Air France ✓ Cabin" },
      { route: "Layover at CDG", time: "3–4h", airline: "Recommended buffer for pet handover" },
      { route: "CDG → AUH", time: "6h 45m", airline: "Etihad ✓ Cabin ($399 promo through May 2026)" },
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
      { route: "FRA → DEL", time: "8h", airline: "Lufthansa ✓ Cabin" },
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
      { route: "AMS → BOM", time: "8h 30m", airline: "KLM ✓ Cabin" },
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
      { route: "Eurotunnel + drive to London", time: "2h 5m", airline: "Pet in car" },
    ],
    note: "There's no cabin pet flight INTO the UK from anywhere. From the Caribbean: route via the US (Miami or JFK), then transatlantic cabin to Paris, then Eurotunnel. Long but workable. For Bahamas + Jamaica (CDC NOT high-risk), no extra US re-entry paperwork. For Dominican Republic (CDC high-risk), the Certification of US-issued Rabies Vaccination form must have been obtained BEFORE you left the US originally.",
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
      { route: "Eurotunnel Le Shuttle to Folkestone", time: "35m", airline: "Pet stays in car" },
      { route: "Folkestone → London (drive)", time: "1h 30m", airline: "Pet stays with you" },
    ],
    note: "Air Canada does NOT allow cabin pets on flights to the UK (UK is on their no-cabin list, like the UK government rule for all airlines). The workaround: fly cabin Canada → Paris on Air Canada, then Eurotunnel into the UK. Pet stays with you from Paris onward. Eurotunnel costs £25–£60 per pet.",
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
      { route: "FRA/CDG → Calais → Eurotunnel → UK", time: "5–6h", airline: "Pet stays with you — car + Eurotunnel" },
    ],
    note: "Two walls here: Air India is cargo-only for the UK, AND no airline flies cabin pets INTO the UK from anywhere (UK government rule). So the route is India → continental Europe, then the Eurotunnel land crossing into the UK. Confirm the India→Europe leg's cabin availability before booking; if it can't be confirmed as cabin, the long-haul portion becomes cargo, but the Europe→UK Eurotunnel leg always keeps your pet with you.",
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
      { route: "Hub → Calais → Eurotunnel → UK", time: "5–6h", airline: "Pet stays with you — car + Eurotunnel" },
    ],
    note: "Etihad accepts cabin pets OUT of Abu Dhabi to Europe (under 8 kg). From a European hub, the Eurotunnel land crossing brings your pet into the UK with you — since no airline flies cabin pets into the UK directly. Start the journey at Abu Dhabi (AUH), not Dubai (DXB), which is cargo-only for all airlines.",
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
  "europe": ["Paris (CDG)", "Amsterdam (AMS)", "Frankfurt (FRA)", "Madrid (MAD)", "Barcelona (BCN)", "Rome (FCO)", "Lisbon (LIS)", "Zurich (ZRH)"],
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
};

const REGION_LABELS_SHORT = {
  "uk-out": "the UK", "ireland": "Ireland", "us": "the US", "canada": "Canada",
  "mexico": "Mexico", "europe": "Europe", "india": "India", "dubai": "the UAE",
  "caribbean": "the Caribbean", "hawaii": "Hawaii", "south-africa": "South Africa",
};

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
  { code: "LHR", city: "London Heathrow", region: "uk-out", cabinOut: true, cabinIn: false, note: "Heathrow is the UK's main cabin-pet departure airport — most UK-out cabin carriers operate here." },
  { code: "MAN", city: "Manchester", region: "uk-out", cabinOut: true, cabinIn: false,
    note: "Manchester has a couple of direct cabin routes of its own (Etihad to Abu Dhabi, Air Transat to Toronto).",
    // driveTo with conditionalOnNoDirect: Manchester CAN do a few cabin routes,
    // but for any destination it can't reach directly, driving to Heathrow
    // (a normal UK domestic drive) unlocks far more direct options and is the
    // better advice than flying the pet to Europe. The planner only surfaces
    // this when there's no direct route from Manchester to the chosen destination.
    driveTo: { code: "LHR", conditionalOnNoDirect: true, text: "Heathrow is a normal domestic drive from Manchester, and it's the UK's main cabin-pet departure airport — far more direct cabin routes leave from there. For destinations Manchester can't reach directly, driving to Heathrow is simpler than any multi-leg workaround." } },
  { code: "LGW", city: "London Gatwick", region: "uk-out", cabinOut: false, cabinIn: false,
    note: "Gatwick does NOT permit cabin pets on departing flights.",
    // driveTo: a nearby airport that DOES work — the planner shows this as the
    // top-priority advice (driving an hour beats flying the pet to Europe).
    driveTo: { code: "LHR", text: "Heathrow is roughly an hour away by road — it's the same London area, and it's the UK's main cabin-pet departure airport. Driving there is far simpler than any workaround." } },
  // Ireland
  { code: "DUB", city: "Dublin", region: "ireland", cabinOut: true, cabinIn: false, note: "Cabin pets can fly OUT of Dublin on EU carriers, but no airline flies cabin pets INTO Ireland — arrival is by ferry or cargo." },
  // United States
  { code: "JFK", city: "New York JFK", region: "us", cabinOut: true, cabinIn: true },
  { code: "EWR", city: "Newark", region: "us", cabinOut: true, cabinIn: true },
  { code: "BOS", city: "Boston", region: "us", cabinOut: true, cabinIn: true },
  { code: "ORD", city: "Chicago O'Hare", region: "us", cabinOut: true, cabinIn: true },
  { code: "MIA", city: "Miami", region: "us", cabinOut: true, cabinIn: true },
  { code: "LAX", city: "Los Angeles", region: "us", cabinOut: true, cabinIn: true },
  { code: "IAD", city: "Washington Dulles", region: "us", cabinOut: true, cabinIn: true },
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
  { code: "MAD", city: "Madrid", region: "europe", cabinOut: true, cabinIn: true, note: "Iberia hub — main cabin-pet departure for Spain. Flights to the US, Latin America, Europe and within Spain." },
  { code: "BCN", city: "Barcelona", region: "europe", cabinOut: true, cabinIn: true, note: "Spain's second-busiest airport. Iberia Express, Vueling, and connecting Iberia flights take cabin pets on eligible routes." },
  { code: "VLC", city: "Valencia", region: "europe", cabinOut: true, cabinIn: true, note: "Spain's third city. Iberia and Vueling serve cabin pets on Spanish domestic and EU routes from Valencia." },
  { code: "FCO", city: "Rome", region: "europe", cabinOut: true, cabinIn: true },
  { code: "LIS", city: "Lisbon", region: "europe", cabinOut: true, cabinIn: true },
  { code: "ZRH", city: "Zurich", region: "europe", cabinOut: true, cabinIn: true },
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
  // ----- INTO the UK (cabin into UK impossible — via Europe + Eurotunnel) -----
  "us>uk-out": (o, d) => ({
    legs: [
      { route: `${o} → Paris (CDG)`, time: "7–11h", airline: "Air France / Delta ✓ Cabin" },
      { route: "Layover at CDG", time: "2–3h+ (overnight gentler)", airline: "Pet handover buffer" },
      { route: "CDG → Calais → Eurotunnel → UK", time: "5–6h", airline: "Pet stays with you — car + Eurotunnel" },
    ],
    note: `No airline flies cabin pets INTO the UK, so the route is ${o} → Paris by cabin, then the Eurotunnel land crossing to ${d}. Works from any major US gateway with a cabin route to Paris.`,
  }),
  "europe>uk-out": (o, d) => ({
    legs: [
      { route: `${o} → Calais (drive/train)`, time: "varies", airline: "Pet stays with you" },
      { route: "Eurotunnel Le Shuttle to Folkestone", time: "35m", airline: "Pet stays in car" },
      { route: `Folkestone → ${d}`, time: "1h 30m+", airline: "Pet stays with you" },
    ],
    note: `If you're already in Europe, the Eurotunnel is the easiest way into the UK — your pet stays with you the whole way. No cabin flight INTO the UK exists on any airline.`,
  }),
  "canada>uk-out": (o, d) => ({
    legs: [
      { route: `${o} → Paris (CDG) or Frankfurt (FRA)`, time: "7–8h", airline: "Air France / Lufthansa ✓ Cabin" },
      { route: "Layover at the European hub", time: "2–3h+ (overnight gentler)", airline: "Pet handover buffer" },
      { route: "Hub → Calais → Eurotunnel → UK", time: "5–6h", airline: "Pet stays with you" },
    ],
    note: `No cabin flight goes INTO the UK. From ${o}, fly cabin to a European hub, then the Eurotunnel land crossing into ${d}.`,
  }),
  "india>uk-out": (o, d) => ({
    legs: [
      { route: `${o} → Frankfurt (FRA) or Paris (CDG)`, time: "8–9h", airline: "Confirm cabin acceptance with the operating airline" },
      { route: "Layover at the European hub", time: "3h+ (overnight gentler)", airline: "Pet handover buffer" },
      { route: "Hub → Calais → Eurotunnel → UK", time: "5–6h", airline: "Pet stays with you" },
    ],
    note: `Two walls: Air India is cargo-only for the UK, AND no airline flies cabin pets INTO the UK. Route is ${o} → continental Europe, then Eurotunnel into ${d}. Confirm the long-haul leg's cabin availability before booking — if it can't be confirmed as cabin, that portion becomes cargo.`,
  }),
  "dubai>uk-out": (o, d) => ({
    legs: [
      { route: `${o} → Paris / Frankfurt / Amsterdam`, time: "7–8h", airline: "Etihad ✓ Cabin out of Abu Dhabi (under 8 kg)" },
      { route: "Layover at the European hub", time: "3h+ (overnight gentler)", airline: "Pet handover buffer" },
      { route: "Hub → Calais → Eurotunnel → UK", time: "5–6h", airline: "Pet stays with you" },
    ],
    note: `Etihad takes cabin pets OUT of Abu Dhabi to Europe. From a European hub, the Eurotunnel brings your pet into ${d}. Start at Abu Dhabi (AUH) — Dubai (DXB) is cargo-only for all airlines.`,
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
      { route: "Hub → Calais → Eurotunnel → UK", time: "5–6h", airline: "Pet stays with you" },
    ],
    note: `Caribbean to the UK is a three-leg journey — no airline flies cabin pets INTO the UK directly. The route is Caribbean → US gateway → European hub → Eurotunnel land crossing into the UK. Long but fully in cabin and with you at every step. Build in at least one overnight stop.`,
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
      { route: "Hub → Calais → Eurotunnel → UK", time: "5–6h", airline: "Pet stays with you" },
    ],
    note: `Mexico to the UK is three legs — no airline flies cabin pets into the UK. Route via the US, then a European hub, then the Eurotunnel land crossing. Build in at least one overnight stop. UK paperwork: ISO microchip, rabies ≥21 days, AHC from an accredited vet.`,
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
  if (originRegion === "south-africa") return [FALLBACK_STRATEGIES["south-africa-out"]];
  if (originRegion === "hawaii") return [FALLBACK_STRATEGIES["hawaii-out"]];
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
        out.push({
          from: originHub,
          to: destHub,
          duration: "see legs",
          legs: built.legs,
          note: built.note,
          label: built.label || null,
          generated: true,
          tags: [origin, destination],
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
    return {
      from: oLabel,
      to: dLabel,
      duration: "see legs",
      legs: built.legs,
      note: built.note,
      label: built.label || null,
      generated: true,
      tags: [oA.region, dA.region],
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
    "uk-out": ["London", "Manchester", "(LHR)", "(MAN)", "(LGW)", "UK"],
    "ireland": ["Dublin", "(DUB)", "Ireland"],
    "us": ["New York", "Miami", "Chicago", "Los Angeles", "Boston", "Newark", "Washington", "San Francisco", "Seattle", "(JFK)", "(EWR)", "(BOS)", "(ORD)", "(MIA)", "(LAX)", "(IAD)", "(SFO)", "(SEA)", "USA"],
    "canada": ["Toronto", "Montreal", "Vancouver", "(YYZ)", "(YUL)", "(YVR)", "Canada"],
    "mexico": ["Mexico City", "Cancún", "Guadalajara", "(MEX)", "(CUN)", "(GDL)", "Mexico"],
    "europe": ["Paris", "Amsterdam", "Frankfurt", "Madrid", "Barcelona", "Valencia", "Rome", "Lisbon", "Zurich", "(CDG)", "(AMS)", "(FRA)", "(MAD)", "(BCN)", "(VLC)", "(FCO)", "(LIS)", "(ZRH)", "Europe"],
    "india": ["Delhi", "Mumbai", "Bengaluru", "Chennai", "Kolkata", "Hyderabad", "(DEL)", "(BOM)", "(BLR)", "(MAA)", "(CCU)", "(HYD)", "India"],
    "dubai": ["Dubai", "Abu Dhabi", "(DXB)", "(AUH)", "UAE"],
    "caribbean": ["Nassau", "Montego Bay", "Punta Cana", "Santo Domingo", "(NAS)", "(MBJ)", "(PUJ)", "(SDQ)", "Caribbean", "Bahamas", "Jamaica"],
    "hawaii": ["Honolulu", "(HNL)", "Hawaii"],
    "south-africa": ["Johannesburg", "Cape Town", "(JNB)", "(CPT)", "South Africa"],
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
          "Research destination country's import requirements",
          "Book your flight AND call airline to reserve a pet spot — limited per flight",
          "Order your airline-compliant carrier (soft-sided recommended)",
        ],
      },
      {
        title: "2 weeks before",
        items: [
          "Let pet sleep in the carrier at home to get used to it",
          "Practice short car rides in the carrier",
          "Book USDA-accredited vet appointment for health certificate (international)",
          "Print and complete the CDC Dog Import Form (if entering U.S.)",
          "Confirm climate / temperature restrictions for your route",
          "Buy: collapsible water bowl, leash, waste bags, calming spray (recommended)",
        ],
      },
      {
        title: "Day before",
        items: [
          "Trim your pet's nails — long nails snag on carrier mesh",
          "Wash the carrier blanket so it smells familiar",
          "Pack vet records (originals + photocopies in a Ziploc inside the carrier)",
          "Charge your phone — you'll be juggling a lot at security",
          "Check airline's pet check-in procedure (often a separate counter)",
        ],
      },
      {
        title: "Day of flight",
        items: [
          "Light meal 4 hours before flight — not too much, not none",
          "Walk your dog / let your cat use the box right before leaving",
          "Pad the carrier with absorbent puppy pads",
          "Arrive 2.5–3 hours early (pet check-in is always in person)",
          "Bring: food, water bowl, leash, waste bags, vet records, calming spray, comfort item",
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
          "Don't open the carrier mid-flight (most airlines + many aviation authorities require this)",
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
        title: "6 weeks before",
        items: [
          "ISO 11784/11785 microchip implanted (if not already)",
          "Rabies vaccination (must be ≥21 days before entry to UK)",
          "If outbound from UK: GB Animal Health Certificate (AHC) booking with vet",
          "If inbound to UK: pets cannot fly in cabin — book cargo OR plan Paris pivot",
          "Book Eurotunnel / ferry well in advance if doing land crossing",
        ],
      },
      {
        title: "10 days before",
        items: [
          "Get GB Animal Health Certificate from official vet (UK departing)",
          "Or get EU Animal Health Certificate from USDA-accredited vet (US departing)",
          "Confirm Eurotunnel/ferry booking",
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
          "Check residency status: import as accompanied baggage (NOC only, no DGFT license) requires 2+ years continuous stay outside India. Less than 2 years means you also need a DGFT import authorization — apply early.",
          "If returning to India (re-import), locate your previous AQCS export certificate — it's required as proof of identity.",
          "Identify your entry airport — pets can ONLY enter India through six approved airports: Delhi (DEL), Mumbai (BOM), Chennai (MAA), Kolkata (CCU), Bengaluru (BLR), or Hyderabad (HYD).",
        ],
      },
      {
        title: "4 weeks before",
        items: [
          "ISO microchip implanted (if not already) — must be ISO 11784/11785 compliant.",
          "Rabies vaccine 30 days – 12 months before travel.",
          "Parvo, distemper, leptospirosis vaccines up to date.",
          "Health certificate from origin country vet — must include vaccination history and microchip number.",
          "If from the USA, get USDA APHIS endorsement of the health certificate.",
          "If from Canada, get CFIA endorsement.",
          "If from the UK/EU, the EU pet passport plus accredited vet certificate works.",
        ],
      },
      {
        title: "2 weeks before",
        items: [
          "Apply for NOC (No Objection Certificate) from AQCS — submit advance copies of all docs (health cert, vaccine records, microchip cert, passport copy, ticket copy, 2 postcard photos of pet) by email or fax to the entry-port AQCS office. Processing fee Rs 1000 per application.",
          "Advance NOC can be issued within 7 days before arrival — don't apply too early, certificate has limited validity.",
          "Book Air India cabin slot (if eligible route) — Air India Paws on Board allows pets up to 10 kg combined on most India routes.",
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
          "Check current CDC dog import rules — they updated August 2024",
        ],
      },
      {
        title: "4 weeks before",
        items: [
          "CDC Dog Import Form completed (online, get the receipt)",
          "USDA-accredited vet appointment booked for health certificate",
          "Confirm airline cabin pet space (limited per flight)",
          "Confirm departure airport allows cabin pet check-in",
        ],
      },
      {
        title: "10 days before",
        items: [
          "Vet visit: get USDA-accredited health certificate signed",
          "USDA APHIS endorsement (varies by state — some same-day, some require mail-in)",
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
          "ISO 15-digit microchip implanted (UAE strictly requires ISO 11784/11785)",
          "Rabies vaccine ≥21 days old, ≤12 months",
          "Rabies titer test (FAVN) if from a rabies-controlled country — UAE requires ≥0.5 IU/ml",
        ],
      },
      {
        title: "4 weeks before",
        items: [
          "Apply for MOCCAE import permit (Ministry of Climate Change and Environment) via moccae.gov.ae — ~AED 200",
          "Book cabin pet space directly with airline by phone (Etihad cabin for AUH; cargo only for DXB)",
          "If using Dubai cargo: arrange Dubai Kennels & Cattery (DKC) or another customs broker",
          "Confirm departure airport allows your specific carrier and aircraft",
        ],
      },
      {
        title: "5 days before",
        items: [
          "Vet visit: UAE Health Certificate signed and stamped by government-accredited official",
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
      {
        title: "Returning to home country",
        items: [
          "Returning to US: CDC Dog Import Form receipt required for dogs",
          "Returning to Canada: standard rabies + health certificate",
          "Returning to EU: EU Health Certificate or pet passport — Mexico is an unlisted third country so 3-month wait may apply",
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
          "Hawaii is rabies-free and treats every arriving pet like an international entry — even though it's a US state",
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
            "EU pet passport is valid for life if rabies stays current",
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
  "caribbean":   { name: "the Caribbean", cdcHighRisk: "varies", euMember: false, ukOrIreland: false, perIsland: true }, // DR is high-risk; Bahamas/Jamaica are not
  "hawaii":      { name: "Hawaii", cdcHighRisk: false, euMember: false, ukOrIreland: false, isUS: true, isRabiesFree: true },
  "south-africa": { name: "South Africa", cdcHighRisk: false, euMember: false, ukOrIreland: false },
};

// Transit-only essentials per region. When a workaround route briefly crosses
// a country en route to the final destination (e.g. France for a UK arrival
// via Paris-pivot, or Schengen Europe for a France→Ireland ferry route), the
// pet legally enters that country before continuing. The full arrival
// checklist for that country is overkill — what the user actually needs is
// the transit-specific essentials. Returns null if we don't have transit
// notes for that region.
function getTransitNotes(region, originRegion) {
  const origin = ROUTE_FACTS[originRegion];

  if (region === "europe" || region === "ireland") {
    // EU/Schengen transit — covered by EU pet movement rules.
    const fromEU = origin && origin.euMember;
    return [
      `Pet enters the EU/Schengen area at this point — EU pet movement rules apply for the duration of the transit.`,
      fromEU
        ? `If you have a valid EU Pet Passport (from your origin country), no additional paperwork is needed for transit.`
        : `If your origin isn't in the EU, you'll need an EU Animal Health Certificate from an accredited vet in your origin country, valid within 10 days of EU entry. This single certificate covers transit through any EU country.`,
      `ISO microchip + current rabies vaccine (≥21 days old) are required for EU entry.`,
      `Pet stays with you the whole transit — no separate booking with a transit-country airline or operator.`,
      `Border control at first EU port of entry checks paperwork once. Subsequent EU borders are open under Schengen — no further checks.`,
    ];
  }

  if (region === "uk-out") {
    // UK transit is rare but possible (e.g. London → ferry to Ireland).
    return [
      `UK transit on the way to Ireland: ISO microchip, rabies vaccine ≥21 days old, GB Animal Health Certificate or pet passport.`,
      `Dogs: tapeworm treatment by a vet 24–120 hours before the UK departure (required for Ireland entry too).`,
      `Pet stays with you for the full UK→Ireland ferry crossing.`,
    ];
  }

  if (region === "us") {
    // US transit (e.g. Caribbean→Canada via US gateway).
    return [
      `US transit: CDC Dog Import Form receipt required even for short layovers if you exit the airside area.`,
      `Origin country's CDC rabies risk status determines whether extra forms are needed (high-risk origins need Certification of US-issued Rabies Vaccination or FAVN titer).`,
      `Pet must be 6+ months old, ISO-microchipped, healthy on arrival.`,
    ];
  }

  if (region === "canada") {
    return [
      `Canada transit: current rabies certificate from your vet is usually sufficient for dogs and cats over 3 months.`,
      `If you're connecting onwards via the US, you'll also need the CDC Dog Import Form receipt for the onward leg.`,
    ];
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
    if (destRegion === "ireland") return `Ireland — like the UK — doesn't allow cabin pets on commercial flights. Use the France→Ireland ferry. Paperwork: ISO microchip, rabies vaccine ≥21 days old, EU Health Certificate (or pet passport), tapeworm treatment for dogs 24–120 hrs before arrival.`;
    if (destRegion === "europe") return `For Europe: ISO microchip first, then rabies vaccine, then a 21-day waiting period before entry. EU Health Certificate from an accredited vet within 10 days of travel (or valid EU pet passport).`;
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
function buildRouteChecklist(originRegion, destRegion, originLabel, destLabel, petType = "both", transitRegions = []) {
  const originId = REGION_TO_CHECKLIST_ID[originRegion];
  const destId = REGION_TO_CHECKLIST_ID[destRegion];

  const originChecklist = originId ? getChecklist(originId, "departing") : null;
  const destChecklist = destId ? getChecklist(destId, "arriving") : null;
  const generic = CHECKLIST_DATA.generic;

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
  const seenTransits = new Set([originRegion, destRegion]);
  const transitChapters = [];
  for (const tr of transitRegions) {
    if (seenTransits.has(tr)) continue;
    seenTransits.add(tr);
    const notes = getTransitNotes(tr, originRegion);
    if (!notes) continue;
    const transitLabel = ROUTE_FACTS[tr] ? ROUTE_FACTS[tr].name : tr;
    transitChapters.push({ region: tr, label: transitLabel, notes });
  }
  transitChapters.forEach((tc) => {
    sections.push({
      title: `Transiting through ${tc.label}`,
      divider: true,
      items: [`Your pet briefly enters ${tc.label} on the way. These are the transit-only essentials — not a full arrival workup.`],
    });
    sections.push({
      title: `${tc.label} · transit essentials`,
      items: tc.notes,
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

const QUESTIONS = [
  {
    id: "petCount",
    label: "How many pets are you travelling with?",
    type: "choice",
    options: ["1", "2", "3 or more"],
    helper: "Most airlines cap cabin pets per passenger and per flight. We'll flag relevant limits.",
  },
  {
    id: "species",
    label: "What kind of pet are you flying with?",
    type: "choice",
    multiWhen: { field: "petCount", notEquals: "1" },
    options: ["Dog", "Cat", "Other small pet"],
    helper: "Travelling with one pet? Pick one. Travelling with more than one — say a dog AND a cat — select every type that applies, since the rules can differ.",
  },
  {
    id: "age",
    label: "How old is your pet?",
    type: "choice",
    options: ["Under 8 weeks", "8 weeks – 4 months", "4–6 months", "6 months or older"],
  },
  {
    id: "weight",
    label: "Combined weight of your pet plus carrier?",
    type: "choice",
    options: ["Under 15 lb", "15–20 lb", "20–25 lb", "Over 25 lb"],
    helper: "Weigh both together at home — airlines weigh combined at the gate.",
  },
  {
    id: "destination",
    label: "Where are you flying to?",
    type: "dropdown",
    options: ["Within the USA (domestic)", "Into the USA (international arrival)", "Hawaii", "Canada", "Mexico", "Caribbean", "UK", "Ireland", "Europe", "Spain", "India", "UAE / Dubai", "Asia / Pacific", "Other international"],
    helper: "Pick where your pet is ARRIVING. Flying Europe → New York? Choose 'Into the USA'.",
  },
  {
    id: "breed",
    label: "Is your pet a snub-nosed (brachycephalic) breed?",
    type: "choice",
    options: ["Yes", "No", "Not sure"],
    helper: "Includes pugs, bulldogs, boxers, Persian cats, Himalayans, shih tzus, Boston terriers.",
  },
  {
    id: "vaccine",
    label: "Is your pet up to date on rabies?",
    type: "choice",
    options: ["Yes, current", "Recently vaccinated (under 28 days)", "Not vaccinated", "Not sure"],
  },
  {
    id: "microchip",
    label: "Does your pet have an ISO-compliant microchip?",
    type: "choice",
    options: ["Yes", "No", "Not sure"],
    helper: "Required for nearly all international travel. Must be ISO 11784/11785 compliant.",
  },
];

// ---------- ASSESSMENT LOGIC ----------

function assess(answers) {
  const flags = [];
  const warnings = [];
  const ok = [];

  // species can be a string (1 pet) or an array (multiple pets of different types)
  const speciesList = Array.isArray(answers.species)
    ? answers.species
    : answers.species ? [answers.species] : [];
  const hasSpecies = (s) => speciesList.includes(s);
  const multiSpecies = speciesList.length > 1;

  // Helper: derive a contextual workaround based on destination
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

  if (answers.age === "Under 8 weeks") {
    flags.push({
      severity: "blocker",
      title: "Your pet is too young to fly",
      detail: "Almost every airline requires pets to be at least 8 weeks old for domestic travel and 16 weeks for international. Wait until your pet is older and fully weaned.",
      workaround: "This is a 'wait' situation, not a workaround. Once your pet is 8+ weeks (domestic) or 15+ weeks (international), re-run this assessment.",
    });
  }

  const isDomestic = answers.destination === "Within the USA (domestic)";
  const isInternationalArrival = answers.destination === "Into the USA (international arrival)";

  if (answers.destination === "Europe" || answers.destination === "Spain" || answers.destination === "UK" || answers.destination === "Ireland" || answers.destination === "India" || answers.destination === "UAE / Dubai" || answers.destination === "Asia / Pacific" || answers.destination === "Other international" || answers.destination === "Caribbean" || isInternationalArrival) {
    if (answers.age === "8 weeks – 4 months") {
      flags.push({
        severity: "blocker",
        title: "Likely too young for international travel",
        detail: "Most countries require pets to be at least 12–16 weeks old, plus a rabies vaccine that's been in effect for 21–30 days. The EU requires a minimum age of 15 weeks. The US requires dogs (not cats) to be at least 6 months old to enter.",
        workaround: "Wait until your pet is at least 15 weeks (EU minimum), 16 weeks (most other countries), or — for a dog entering the US — 6 months. Use this time to schedule the microchip-then-rabies sequence so the 21-day post-rabies wait is built in.",
      });
    }
  }

  if (answers.weight === "Over 25 lb") {
    flags.push({
      severity: "impossible",
      title: "Too heavy for cabin on any airline",
      detail: "Combined pet + carrier weight over 25 lb exceeds every commercial airline's cabin limit. Cabin is genuinely not an option for your pet on any carrier.",
      workaround: `Cabin isn't workable — but cargo is. ${cargoOption}`,
    });
  } else if (answers.weight === "20–25 lb") {
    warnings.push({
      title: "On the edge of cabin weight limits",
      detail: "JetBlue caps at 20 lb combined; Air Canada at 22 lb; Air France/KLM/Lufthansa at 17.6 lb. Domestic U.S. airlines like Delta, United, and American don't publish a strict weight, but your pet must still fit comfortably in the carrier under the seat. Weigh at home with the carrier and food. If you're within a pound or two of the limit — assume you're over.",
    });
  } else {
    ok.push("Your pet's weight is within typical cabin limits.");
  }

  if (answers.breed === "Yes") {
    warnings.push({
      title: "Snub-nosed breeds need extra care",
      detail: "Brachycephalic pets are at higher risk for breathing issues at altitude. They can usually still fly in the cabin (it's pressurized at sea-level conditions), but airlines often refuse to fly them as cargo. Avoid summer travel, sedatives, and long layovers. Talk to your vet first.",
    });
  }

  if (answers.vaccine === "Not vaccinated") {
    flags.push({
      severity: "fixable",
      title: "Rabies vaccination required",
      detail: "Every U.S. state and country requires rabies vaccination for dogs, and most for cats. International destinations typically require the vaccine to have been administered at least 21–30 days before travel. Get this scheduled now.",
      workaround: "Book a vet appointment to vaccinate. For international travel, ensure the microchip is implanted FIRST, then the rabies vaccine, then wait at least 21 days (EU) or 28 days (some countries) before flying.",
    });
  } else if (answers.vaccine === "Recently vaccinated (under 28 days)") {
    warnings.push({
      title: "Your rabies vaccine may not yet be 'in effect'",
      detail: "For international travel, most countries (including the EU and the U.S. on re-entry from high-risk countries) require the vaccine to have been administered at least 28 days before arrival, and after the microchip was implanted. Don't book travel until this window has passed.",
    });
  } else if (answers.vaccine === "Yes, current") {
    ok.push("Rabies vaccination is current.");
  }

  if (!isDomestic && answers.destination !== "Hawaii" && answers.microchip !== "Yes") {
    flags.push({
      severity: "fixable",
      title: "ISO microchip required for international travel",
      detail: "The EU, UK, Japan, Australia, and most other countries require an ISO 11784/11785 compliant microchip implanted before the rabies vaccine. If your pet was microchipped after their rabies shot, they may need to be re-vaccinated. Confirm with your vet.",
      workaround: "Book a vet appointment to implant an ISO 11784/11785 microchip. If your pet is already rabies-vaccinated, you may need to re-vaccinate AFTER the chip — confirm with your vet.",
    });
  }

  if (answers.destination === "Hawaii") {
    warnings.push({
      title: "Hawaii has a strict rabies-free program",
      detail: "Hawaii is rabies-free and treats arriving pets like an international entry. The 'Direct Airport Release' program requires: ISO microchip, two rabies vaccines (most recent at least 30 days before arrival), a FAVN/OIE rabies blood test from an approved lab at least 30 days before arrival, and submission of paperwork to the Animal Industry Division. Plan 4+ months ahead.",
    });
  }

  if (answers.destination === "Europe" || answers.destination === "Spain") {
    warnings.push({
      title: answers.destination === "Spain" ? "Spain requires an EU Health Certificate" : "EU requires an EU Health Certificate",
      detail: answers.destination === "Spain"
        ? "Spain follows EU pet import rules: ISO microchip first, then rabies vaccine, then a 21-day waiting period before entry. You'll need an EU Health Certificate issued by an accredited vet within 10 days of travel. Good news: cabin is straightforward from most origins — Iberia and Vueling both fly cabin pets, and Spain has three solid pet-friendly airports (Madrid, Barcelona, Valencia)."
        : "Issued by a USDA-accredited vet within 10 days of travel, then endorsed by your nearest USDA APHIS office. ISO microchip first, then rabies vaccine, then a 21-day waiting period before entry. Some countries (UK, Ireland, Malta, Finland, Norway) also require a tapeworm treatment for dogs, given 24–120 hours before arrival.",
    });
  }

  if (answers.destination === "Canada") {
    ok.push("Canada is among the easier international destinations: a current rabies certificate from your vet is usually all that's needed for dogs and cats over 3 months old. No APHIS endorsement required from the US. Confirm details with the CFIA before travel.");
  }

  if (answers.destination === "Mexico") {
    ok.push("Mexico is a relatively easy destination: a vet health certificate plus current rabies vaccine is usually all that's required. SADER/SENASICA inspect pets on arrival, free of charge. Internal/external parasite treatment should be documented.");
  }

  if (answers.destination === "Caribbean") {
    warnings.push({
      title: "Caribbean rules vary enormously by island",
      detail: "There's no single 'Caribbean' rule. Puerto Rico and USVI are US territories (no import paperwork). Dominican Republic and Aruba are relatively easy. Bahamas needs a 6–8 week import permit. Jamaica, Cayman, and Barbados are among the strictest — Jamaica needs 6+ months of prep including a FAVN rabies titer. Check your specific island's Department of Agriculture before booking. Note: Dominican Republic is on the CDC high-risk rabies list, which complicates US return.",
    });
  }

  if (isInternationalArrival) {
    if (hasSpecies("Dog")) {
      warnings.push({
        title: "Entering the USA — CDC Dog Import Form required for all dogs",
        detail: "Every dog entering the US (including US dogs returning home) needs a completed CDC Dog Import Form — fill it out online and keep the receipt (valid 6 months, multiple entries). Dogs must be at least 6 months old, microchipped, and appear healthy. If arriving from a CDC high-risk rabies country, additional paperwork applies (rabies titer, Certification of US-issued Rabies Vaccination). Confirm whether your origin country is high-risk.",
      });
    }
    if (hasSpecies("Cat")) {
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
    warnings.push({
      title: "Tapeworm treatment is mandatory for dogs",
      detail: "Dogs entering the UK need a tapeworm treatment (praziquantel) administered by a vet 24–120 hours before arrival. Without this, your dog can be refused entry or quarantined. Not required for cats.",
    });
  }

  if (answers.destination === "Ireland") {
    flags.push({
      severity: "impossible",
      title: "No commercial airline allows pets in the cabin into Ireland",
      detail: "Like the UK, every flight into Ireland requires pets to travel as manifested cargo — never in the cabin. This is Irish government policy, and it's why airlines list Ireland alongside the UK in their no-cabin restrictions. (Flying OUT of Ireland in cabin is generally fine.)",
      workaround: "The cabin workaround: fly cabin into a continental EU airport (Paris CDG, Amsterdam AMS, Frankfurt FRA), then either take a pet-friendly ferry from France to Ireland (Cherbourg/Roscoff → Rosslare/Dublin on Irish Ferries or Brittany Ferries — pets stay in your vehicle or a pet-friendly cabin), or cross to the UK via Eurotunnel and take the Ireland ferry from Holyhead. The direct France → Ireland ferry avoids the UK landbridge entirely. Alternatively: cargo into Dublin via Lufthansa Cargo, KLM Cargo, or Aer Lingus Cargo.",
    });
    warnings.push({
      title: "Tapeworm treatment is mandatory for dogs",
      detail: "Dogs entering Ireland need a tapeworm treatment (praziquantel) administered by a vet 24–120 hours before arrival. Same rule as the UK. Not required for cats.",
    });
    warnings.push({
      title: "Ireland's rules closely mirror the UK's",
      detail: "ISO microchip, rabies vaccine ≥21 days old, and an EU/GB pet health certificate. If you're coming from the UK, the land+ferry route is common. If from outside the EU, you'll need an EU Health Certificate. Confirm current requirements with Ireland's Department of Agriculture, Food and the Marine.",
    });
  }

  if (answers.destination === "India") {
    warnings.push({
      title: "India requires an NOC (No Objection Certificate)",
      detail: "Apply to the Animal Quarantine and Certification Service (AQCS) at least 1–2 weeks before arrival. Pets can only enter India through six airports: Delhi, Mumbai, Chennai, Kolkata, Bengaluru, or Hyderabad. Returning Indian residents can bring up to 2 pets without a full import license, but the NOC is still required.",
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
      detail: "Apply to the Ministry of Climate Change and Environment (MOCCAE) for an import permit — it's only valid for 30 days from issue, so time it carefully. Several breeds are banned entirely (Pit Bull, Rottweiler, Dogo Argentino, Tosa, Mastiff types, wolf-dog hybrids).",
    });
  }

  if (hasSpecies("Other small pet")) {
    warnings.push({
      title: "Limited airline acceptance for non-cat/dog pets",
      detail: "Most airlines accept only cats and dogs in cabin. Frontier and a few others allow rabbits, guinea pigs, hamsters, and small household birds. Check directly with your airline before booking — and note that many countries restrict or quarantine non-cat/dog imports.",
    });
  }

  if (multiSpecies) {
    warnings.push({
      title: "Different pet types have different rules",
      detail: `You're travelling with more than one type of pet (${speciesList.join(" + ")}). Each species has its own import paperwork, vaccination requirements, and airline carrier rules — and they don't always match. For example, dogs need tapeworm treatment for the UK/Ireland but cats don't; some countries' rabies rules differ by species. Check requirements separately for each pet, and confirm the airline can take all of them on the same booking.`,
    });
  }

  // Multi-pet considerations
  if (answers.petCount === "2") {
    warnings.push({
      title: "Travelling with two pets needs careful planning",
      detail: "Most airlines allow only 1 pet per passenger in the cabin — so 2 pets typically means 2 passengers, or one passenger travelling with 2 carriers (rarely permitted). A few airlines (Delta, United, Lufthansa) allow 2 puppies/kittens of the same species in 1 carrier IF combined weight is under the airline limit AND they're young enough to fit comfortably. Most international destinations also have per-passenger pet import caps. Call your airline directly — these bookings cannot be made online.",
    });
  } else if (answers.petCount === "3 or more") {
    flags.push({
      severity: "fixable",
      title: "3+ pets exceeds most airlines' cabin limits per passenger",
      detail: "No major airline allows more than 1 pet per passenger in the cabin (rare exception: 2 young same-species pets in 1 carrier on Delta/United/Lufthansa). Carrying 3+ pets typically requires 3 passengers, multiple bookings, OR sending some via cargo. Many destinations also cap personal pet imports at 2 per traveller — beyond that you need commercial import permits.",
      workaround: "Options: split across multiple passengers each carrying 1 pet (most realistic for families), use cargo for some pets (Lufthansa Animal Lounge handles multi-pet cargo well), or contact a pet relocation specialist for a coordinated multi-pet move. Call airlines directly — these bookings need phone arrangement.",
    });
  }

  return { flags, warnings, ok };
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
    if (id === "top") { window.scrollTo({ top: 0, behavior: "smooth" }); return; }
    if (id === "intake") { onStartIntake(); return; }
    if (id === "about") { window.location.href = "/about"; return; }
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
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
            { num: "26", label: "Airlines compared" },
            { num: "10", label: "Tricky destinations" },
          ].map((s, i) => (
            <div key={i} className="text-center">
              <div className="font-serif text-5xl text-stone-800">{s.num}</div>
              <div className="text-xs uppercase tracking-widest text-stone-500 mt-2">{s.label}</div>
            </div>
          ))}
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
  const q = QUESTIONS[step];
  const isFirst = step === 0;
  const isLast = step === QUESTIONS.length - 1;
  const current = answers[q.id];
  const sectionRef = useRef(null);

  // Scroll to the top of the question whenever the step changes.
  // Questions have very different heights (destination has 12 options,
  // breed has 3) — without this, advancing from a tall question to a
  // short one leaves the user scrolled into dead space below the section.
  // We skip step 0 because entering the intake is handled separately.
  useEffect(() => {
    if (step === 0) return;
    const el = sectionRef.current;
    if (el) {
      const top = el.getBoundingClientRect().top + window.scrollY - 80;
      window.scrollTo({ top, behavior: "smooth" });
    }
  }, [step]);

  // A question is multiselect if it declares multiWhen and that condition is met
  const isMulti = q.multiWhen && answers[q.multiWhen.field] &&
    (q.multiWhen.notEquals
      ? answers[q.multiWhen.field] !== q.multiWhen.notEquals
      : answers[q.multiWhen.field] === q.multiWhen.equals);

  const selectedValues = isMulti ? (Array.isArray(current) ? current : current ? [current] : []) : [];

  function pick(option) {
    if (isMulti) {
      const has = selectedValues.includes(option);
      const updated = has
        ? selectedValues.filter((v) => v !== option)
        : [...selectedValues, option];
      setAnswers({ ...answers, [q.id]: updated });
    } else {
      setAnswers({ ...answers, [q.id]: option });
    }
  }

  // Whether the current question has a usable answer
  const hasAnswer = isMulti ? selectedValues.length > 0 : !!current;

  function next() {
    if (isLast) onComplete();
    else setStep(step + 1);
  }

  return (
    <section ref={sectionRef} id="intake" className="py-10 px-6 md:px-12 bg-stone-100 border-y border-stone-300 scroll-mt-24">
      <div id="assessment" className="scroll-mt-24" />
      <div className="max-w-5xl mx-auto">
        <SectionLabel num="I.">Can my pet fly in the cabin?</SectionLabel>

        <div className="flex items-center gap-2 mb-5">
          {QUESTIONS.map((_, i) => (
            <div
              key={i}
              className={`h-0.5 flex-1 transition-all duration-500 ${
                i < step ? "bg-stone-900" : i === step ? "bg-amber-700" : "bg-stone-300"
              }`}
            />
          ))}
        </div>

        <div className="text-xs uppercase tracking-widest text-stone-500 mb-2">
          Question {step + 1} of {QUESTIONS.length}
        </div>

        <h2 className="font-serif text-3xl md:text-4xl text-stone-900 leading-tight mb-2">
          {q.label}
        </h2>

        {q.helper && (
          <p className="text-stone-600 italic mb-3 text-sm max-w-xl">{q.helper}</p>
        )}

        {isMulti && (
          <div className="text-xs uppercase tracking-widest text-amber-700 mb-2">
            Select all that apply
          </div>
        )}

        {q.type === "dropdown" ? (
          /* Dropdown for questions with many options (e.g. destination — 14 options) */
          <div className="mt-4 mb-6">
            <select
              value={current || ""}
              onChange={(e) => pick(e.target.value)}
              className="w-full bg-white border-2 border-stone-300 focus:border-stone-900 focus:outline-none px-4 py-4 font-serif text-xl text-stone-900 transition-colors"
            >
              <option value="" disabled>Select a destination…</option>
              {q.options.map((opt) => (
                <option key={opt} value={opt}>{opt}</option>
              ))}
            </select>
          </div>
        ) : (
          /* Button grid for standard choice questions */
          <div className="grid gap-2 mb-6 mt-4">
            {q.options.map((opt) => {
              const selected = isMulti ? selectedValues.includes(opt) : current === opt;
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

        <div className="flex items-center justify-between">
          <button
            onClick={() => setStep(Math.max(0, step - 1))}
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
      </div>
    </section>
  );
}

function Assessment({ answers, onReset }) {
  const result = useMemo(() => assess(answers), [answers]);
  const sectionRef = useRef(null);
  const hasFlags = result.flags.length > 0;
  const hasWarnings = result.warnings.length > 0;
  const hasOks = result.ok.length > 0;
  const hasImpossible = result.flags.some((f) => f.severity === "impossible");
  const hasOnlyFixableFlags = hasFlags && !hasImpossible;

  // Auto-scroll to the assessment when it renders.
  // Double requestAnimationFrame ensures the browser has painted the new
  // section before we measure its position — getElementById/timeout alone
  // races against layout and can land on the wrong section.
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
    const impossibleCount = result.flags.filter((f) => f.severity === "impossible").length;
    verdictSummary = `${impossibleCount === 1 ? "There's a fundamental block" : `There are ${impossibleCount} fundamental blocks`} that cabin travel can't resolve on its own — but most have workarounds. Read each blocker below carefully: where a cabin workaround exists (e.g. Paris Pivot for UK, Abu Dhabi for UAE), we've noted it. Where cabin is genuinely off the table, we've suggested cargo or pet-relocation options.`;
  } else if (hasOnlyFixableFlags) {
    verdictColor = "text-orange-700";
    verdictBg = "bg-orange-50";
    verdictBorder = "border-orange-700";
    verdictIcon = <AlertTriangle className="w-7 h-7 text-orange-700" strokeWidth={1.75} />;
    verdictHeadline = "Not yet — but the blockers are fixable";
    verdictSummary = `${result.flags.length === 1 ? "There's 1 item" : `There are ${result.flags.length} items`} blocking cabin travel right now — but ${result.flags.length === 1 ? "it's" : "they're"} all addressable (microchip, vaccine timing, age). Work through them, then come back. ${hasWarnings ? `${result.warnings.length} other thing${result.warnings.length === 1 ? "" : "s"} to plan for too.` : ""}`;
  } else if (hasWarnings) {
    verdictColor = "text-amber-700";
    verdictBg = "bg-amber-50";
    verdictBorder = "border-amber-700";
    verdictIcon = <Info className="w-7 h-7 text-amber-700" strokeWidth={1.75} />;
    verdictHeadline = "Looks workable — with a few things to plan for";
    verdictSummary = `Nothing critical, but there ${result.warnings.length === 1 ? "is 1 thing" : `are ${result.warnings.length} things`} worth knowing before you book. Read them below and plan accordingly.`;
  } else {
    verdictColor = "text-emerald-700";
    verdictBg = "bg-emerald-50";
    verdictBorder = "border-emerald-700";
    verdictIcon = <Check className="w-7 h-7 text-emerald-700" strokeWidth={1.75} />;
    verdictHeadline = "Looks good — no major blockers";
    verdictSummary = "Based on what you've told us, your pet should be eligible to fly cabin. Confirm details directly with your airline and destination country before booking.";
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
                {(() => {
                  const sp = Array.isArray(answers.species) ? answers.species.join(" + ") : answers.species;
                  const countLabel = answers.petCount === "1" ? sp : `${answers.petCount} pets (${sp})`;
                  return `${countLabel} · ${answers.weight} · ${answers.destination}`;
                })()}
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
                      {result.flags.filter((f) => f.severity === "impossible").length} cabin-impossible
                    </span>
                  )}
                  {hasOnlyFixableFlags && (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-orange-100 text-orange-800 font-medium">
                      <AlertTriangle className="w-3 h-3" strokeWidth={2.5} />
                      {result.flags.length} fixable blocker{result.flags.length === 1 ? "" : "s"}
                    </span>
                  )}
                  {hasWarnings && (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-amber-100 text-amber-800 font-medium">
                      <Info className="w-3 h-3" strokeWidth={2.5} />
                      {result.warnings.length} to plan for
                    </span>
                  )}
                  {hasOks && (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-100 text-emerald-800 font-medium">
                      <Check className="w-3 h-3" strokeWidth={2.5} />
                      {result.ok.length} looking good
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* DETAIL SECTIONS */}
          <div className="p-8 md:p-10 space-y-10">
            {hasFlags && (
              <div>
                <div className="flex items-center gap-3 mb-2 pb-3 border-b-2 border-red-700">
                  <AlertTriangle className="w-5 h-5 text-red-700" strokeWidth={1.75} />
                  <h3 className="uppercase tracking-widest text-sm text-red-700 font-medium">
                    {result.flags.length === 1 ? "Blocker to address" : `${result.flags.length} blockers to address`}
                  </h3>
                </div>
                <p className="text-sm text-stone-600 italic font-serif mb-5">
                  Where a workaround exists, we've spelled it out under each blocker.
                </p>
                <div className="space-y-5">
                  {result.flags.map((f, i) => {
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
                        <div className="flex items-baseline gap-2 mb-2">
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
                        <p className="text-stone-700 leading-relaxed mb-3">{f.detail}</p>
                        {f.workaround && (
                          <div className="mt-3 pt-3 border-t border-stone-200">
                            <div className="text-xs uppercase tracking-widest text-stone-500 font-medium mb-1.5">
                              {isImpossible ? "Suggested alternative" : "How to fix it"}
                            </div>
                            <p className="text-stone-700 leading-relaxed text-sm">{f.workaround}</p>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {hasWarnings && (
              <div>
                <div className="flex items-center gap-3 mb-2 pb-3 border-b-2 border-amber-700">
                  <Info className="w-5 h-5 text-amber-700" strokeWidth={1.75} />
                  <h3 className="uppercase tracking-widest text-sm text-amber-700 font-medium">
                    {result.warnings.length === 1 ? "Thing to plan for" : `${result.warnings.length} things to plan for`}
                  </h3>
                </div>
                <p className="text-sm text-stone-600 italic font-serif mb-5">
                  Not blockers, but you'll want to plan around these before booking.
                </p>
                <div className="space-y-5">
                  {result.warnings.map((w, i) => (
                    <div key={i} className="bg-amber-50/50 border-l-2 border-amber-700 pl-5 pr-4 py-4">
                      <div className="font-serif text-xl text-stone-900 mb-2">
                        <span className="text-amber-700 mr-2">{i + 1}.</span>{w.title}
                      </div>
                      <p className="text-stone-700 leading-relaxed">{w.detail}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {hasOks && (
              <div>
                <div className="flex items-center gap-3 mb-2 pb-3 border-b-2 border-emerald-700">
                  <Check className="w-5 h-5 text-emerald-700" strokeWidth={1.75} />
                  <h3 className="uppercase tracking-widest text-sm text-emerald-700 font-medium">
                    {result.ok.length === 1 ? "Looking good" : `${result.ok.length} looking good`}
                  </h3>
                </div>
                <p className="text-sm text-stone-600 italic font-serif mb-5">
                  Already sorted — nothing to worry about here.
                </p>
                <ul className="space-y-3">
                  {result.ok.map((o, i) => (
                    <li key={i} className="flex items-start gap-3 text-stone-700 leading-relaxed">
                      <Check className="w-4 h-4 text-emerald-700 flex-shrink-0 mt-1" strokeWidth={2} />
                      <span>{o}</span>
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
    headline: "In-cabin allowed. 180-day rabies wait is the killer.",
    rule: "Japan does allow pets in cabin on some carriers (ANA, JAL accept them on certain routes), but the import process is brutal: you need a 180-day waiting period after a rabies titer test before your pet can enter. Plan a year ahead for a permanent move.",
    workarounds: [
      {
        title: "Start the clock at least 7 months out",
        icon: <ScrollText className="w-4 h-4" strokeWidth={1.75} />,
        body: "The 180-day clock starts the day blood is drawn for the rabies titer. Two rabies vaccines must come before the test. Notify Japan's Animal Quarantine Service (AQS) at least 40 days before arrival. There is no expedited path.",
        cost: "Tests, paperwork, vet visits: $500–$1,500.",
      },
      {
        title: "If you arrive without the wait",
        icon: <AlertTriangle className="w-4 h-4" strokeWidth={1.75} />,
        body: "Your pet will be quarantined for up to 180 days at the airport quarantine facility — at your expense. This is the single most common mistake people make with Japan. Don't book until your paperwork is bulletproof.",
        cost: "Quarantine: ~¥3,500/day = up to ¥630,000 ($4,000+).",
      },
    ],
    paperwork: "ISO microchip, two rabies vaccines, FAVN/RNATT titer test, 180-day waiting period, AQS advance notification, USDA-endorsed Form A/C.",
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
        body: "Whatever route you pick, both the country you leave AND Ireland have rules. From the US you'll need an EU Health Certificate (USDA-endorsed). From the UK you'll need a GB Animal Health Certificate or pet passport. From within the EU, an EU pet passport covers it. Ireland-specific: ISO microchip, rabies ≥21 days old, and tapeworm treatment for dogs 24–120 hours before arrival.",
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
    rule: "Once you have an EU pet passport (issued by an EU vet) or a GB Animal Health Certificate (AHC, from a UK vet within 10 days), most internal EU travel is straightforward. Pets travel free or cheap on most trains, ferries, and short-haul flights. The friction is mostly at the UK border, not within the EU. IMPORTANT: For flying out of the UK with a pet in cabin, ALWAYS use Heathrow (LHR) — Gatwick (LGW) does NOT permit cabin pets on departing flights.",
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
    paperwork: "From UK: ISO microchip, rabies vaccine ≥21 days old, GB Animal Health Certificate (AHC) from a UK vet within 10 days of travel — valid for 4 months of EU travel and 4 months for re-entry. UK pet passports issued pre-2021 are no longer valid for outbound travel. Within EU: an EU pet passport from any EU vet replaces the AHC and is valid for the pet's lifetime (rabies vaccine staying current). Tapeworm treatment 24–120 hrs before returning to the UK or Ireland (dogs only).",
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

  const FILTERS = [
    { id: "all", label: "All airlines", flag: "" },
    { id: "uk-out", label: "Out of UK", flag: "🇬🇧" },
    { id: "us", label: "US routes", flag: "🇺🇸" },
    { id: "india", label: "India routes", flag: "🇮🇳" },
    { id: "europe", label: "Europe routes", flag: "🇪🇺" },
    { id: "canada", label: "Canada routes", flag: "🇨🇦" },
    { id: "dubai", label: "Dubai / UAE", flag: "🇦🇪" },
    { id: "caribbean", label: "Caribbean", flag: "🌴" },
    { id: "south-africa", label: "South Africa", flag: "🇿🇦" },
  ];

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
          Twenty-six airlines, one place. Tap any carrier to see fees, weight rules, carrier dimensions, and the fine print most travellers miss.
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

        <div className="mb-6">
          <div className="text-xs uppercase tracking-widest text-stone-500 mb-3">Filter by route</div>
          <div className="flex flex-wrap gap-2">
            {FILTERS.map((f) => {
              const isActive = filter === f.id;
              return (
                <button
                  key={f.id}
                  onClick={() => setFilter(f.id)}
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
          <p className="text-stone-500 text-sm mt-3 italic font-serif">
            Showing {filteredAirlines.length} of {AIRLINES.length} airlines.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-px bg-stone-300 border border-stone-300">
          {filteredAirlines.map((a, i) => {
            const open = expanded === a.name;
            const allowsCabin = a.cabinStatus !== "no";
            const badgeStyle = allowsCabin
              ? "bg-emerald-100 text-emerald-800 border-emerald-300"
              : "bg-rose-100 text-rose-800 border-rose-300";
            const badgeText = allowsCabin ? "✓ Cabin allowed" : "✗ No cabin";
            return (
              <div key={a.name} className="bg-stone-50">
                <button
                  onClick={() => setExpanded(open ? null : a.name)}
                  className="w-full text-left p-6 hover:bg-white transition-colors"
                >
                  <div className="flex items-baseline justify-between gap-4 mb-3">
                    <h3 className="font-serif text-2xl text-stone-900">
                      {a.name}<span className="text-stone-400 text-lg"> — pets in cabin</span>
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
                  {a.originAllowed && Object.keys(a.originAllowed).length > 0 && (() => {
                    const COUNTRIES = [
                      { code: "uk", flag: "🇬🇧", label: "UK" },
                      { code: "us", flag: "🇺🇸", label: "US" },
                      { code: "eu", flag: "🇪🇺", label: "EU" },
                      { code: "india", flag: "🇮🇳", label: "India" },
                      { code: "canada", flag: "🇨🇦", label: "Canada" },
                      { code: "uae", flag: "🇦🇪", label: "UAE" },
                      { code: "caribbean", flag: "🌴", label: "Caribbean" },
                    ];
                    const renderFlag = (c, statusObj, direction) => {
                      const status = statusObj[c.code];
                      if (!status) return null;
                      const isYes = status === "yes";
                      return (
                        <span
                          key={c.code}
                          className={`inline-flex items-center gap-0.5 ${isYes ? "text-emerald-700" : "text-red-600"}`}
                          title={`${isYes ? "Cabin allowed" : "Cabin NOT allowed"} ${direction} ${c.label}`}
                        >
                          <span className="text-lg leading-none">{c.flag}</span>
                          <span className="font-bold text-xs">{isYes ? "✓" : "✗"}</span>
                        </span>
                      );
                    };
                    return (
                      <div className="space-y-2 mb-3 pb-3 border-b border-stone-200">
                        <div className="flex items-start gap-x-2">
                          <span className="text-[10px] uppercase tracking-widest text-stone-500 font-medium min-w-[64px] flex-shrink-0 pt-1">Cabin from:</span>
                          <div className="flex flex-wrap gap-x-2.5 gap-y-1 flex-1">
                            {COUNTRIES.map((c) => renderFlag(c, a.originAllowed, "from"))}
                          </div>
                        </div>
                        {a.destinationAllowed && (
                          <div className="flex items-start gap-x-2">
                            <span className="text-[10px] uppercase tracking-widest text-stone-500 font-medium min-w-[64px] flex-shrink-0 pt-1">Cabin to:</span>
                            <div className="flex flex-wrap gap-x-2.5 gap-y-1 flex-1">
                              {COUNTRIES.map((c) => renderFlag(c, a.destinationAllowed, "to"))}
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })()}
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

        <p className="text-stone-500 text-sm mt-6 italic font-serif">
          Policies change. Confirm with the airline before booking. Last full review: May 2026.
        </p>
      </div>
    </section>
  );
}

function Checklist() {
  const sections = [
    {
      title: "Six weeks before",
      icon: <Stethoscope className="w-5 h-5" strokeWidth={1.5} />,
      items: [
        "Vet visit: confirm your pet is healthy enough to fly",
        "ISO 11784/11785 microchip implanted (if not already)",
        "Rabies vaccine administered (after microchip, if international)",
        "Research destination country's import requirements — every country differs",
        "Book your flight and call the airline to reserve a pet spot (limited per flight)",
      ],
    },
    {
      title: "Two weeks before",
      icon: <ScrollText className="w-5 h-5" strokeWidth={1.5} />,
      items: [
        "Get your airline-compliant carrier — let your pet sleep in it at home with a familiar blanket",
        "Practice short car rides or trips in the carrier",
        "Schedule government-accredited vet visit for health certificate (timing varies by destination — often within 10 days of travel)",
        "Complete any destination-specific forms (CDC for US, AHC for UK, EU pet passport, MOCCAE for UAE, etc.)",
        "Confirm climate / temperature restrictions and any seasonal breed restrictions",
      ],
    },
    {
      title: "The day of",
      icon: <Luggage className="w-5 h-5" strokeWidth={1.5} />,
      items: [
        "Light meal 3–4 hours before flight; water available until departure",
        "Walk your dog (or let your cat use the box) right before leaving home — airport pet relief areas are often useless",
        "Pad the carrier with absorbent puppy pads",
        "Pack: food, collapsible water bowl, leash, waste bags, vet records, comfort item, calming spray",
        "Arrive 2.5–3 hours early — pet check-in is in person at the counter, not online",
      ],
    },
    {
      title: "At security & onboard",
      icon: <Plane className="w-5 h-5" strokeWidth={1.5} />,
      items: [
        "Security: remove your pet from carrier, walk or carry them through the metal detector",
        "Carrier goes through the X-ray machine empty",
        "Once at the gate, keep your pet in the carrier",
        "Stow under the seat in front of you — never the overhead bin",
        "Don't open the carrier mid-flight (most airlines and many aviation authorities require this — crew may not allow exceptions)",
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

        <div className="grid md:grid-cols-2 gap-8 mt-12">
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
                    <span className="leading-relaxed">{item}</span>
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
    { id: "south-africa", label: "South Africa", flag: "🇿🇦" },
  ];
  const clAirportsByRegion = CL_REGIONS.map((r) => ({
    region: r,
    airports: AIRPORTS.filter((a) => a.region === r.id),
  })).filter((g) => g.airports.length > 0);

  const originAirport = originCode ? airportByCode(originCode) : null;
  const destAirport = destCode ? airportByCode(destCode) : null;

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
  const sectionRef = useRef(null);

  // When results appear, scroll back to the top of the planner section.
  // Double requestAnimationFrame waits for the results DOM to actually lay
  // out before measuring — without this, getBoundingClientRect reads the
  // pre-render (short) layout and the scroll lands in the wrong place.
  useEffect(() => {
    if (!planned) return;
    let raf1, raf2;
    raf1 = requestAnimationFrame(() => {
      raf2 = requestAnimationFrame(() => {
        const el = sectionRef.current;
        if (el) {
          const top = el.getBoundingClientRect().top + window.scrollY - 8;
          window.scrollTo({ top, behavior: "smooth" });
        }
      });
    });
    return () => {
      cancelAnimationFrame(raf1);
      cancelAnimationFrame(raf2);
    };
  }, [planned]);

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
    { id: "south-africa", label: "South Africa", flag: "🇿🇦" },
  ];

  // Map a region to its checklist tab id.
  const REGION_TO_CHECKLIST = {
    "uk-out": "uk", "ireland": "ireland", "us": "usa", "canada": "canada",
    "mexico": "mexico", "europe": "europe", "india": "india", "dubai": "uae",
    "caribbean": null, "hawaii": null, "south-africa": "south_africa",
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
    const push = (r, kind) => {
      const k = dedupeKey(r);
      if (seen.has(k)) return;
      seen.add(k);
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

  const checklistId = destAirport ? REGION_TO_CHECKLIST[destAirport.region] : null;

  // Airport-specific cabin warnings — accurate to the EXACT airport chosen.
  // e.g. picking Gatwick or Dubai tells you precisely why that airport won't work.
  const originCabinWarning = originAirport && !originAirport.cabinOut
    ? originAirport.note
    : null;
  const destCabinWarning = destAirport && !destAirport.cabinIn
    ? destAirport.note
    : null;

  const hasResults = directMatches.length > 0 || workaroundMatches.length > 0
    || altDirect.length > 0 || altWorkarounds.length > 0;
  const hasDirect = directMatches.length > 0;

  function plan() {
    if (origin && destination) setPlanned(true);
  }
  function resetPlan() {
    setOrigin("");
    setDestination("");
    setPlanned(false);
  }

  // Airports grouped by region, for the dropdown <optgroup>s.
  const airportsByRegion = REGIONS.map((r) => ({
    region: r,
    airports: AIRPORTS.filter((a) => a.region === r.id),
  })).filter((g) => g.airports.length > 0);

  return (
    <section ref={sectionRef} id="planner" className="py-20 px-6 md:px-12 bg-stone-900 text-stone-100 scroll-mt-24">
      <div className="max-w-5xl mx-auto">
        <div className="flex items-baseline gap-3 mb-6">
          <span className="font-serif italic text-amber-400/70 text-lg">✦</span>
          <span className="uppercase tracking-[0.25em] text-xs font-medium text-amber-400">Journey planner</span>
          <div className="flex-1 h-px bg-stone-700" />
        </div>

        <h2 className="font-serif text-5xl text-stone-50 mb-4 max-w-3xl">
          Where are you<br /><span className="italic text-stone-400">flying from and to?</span>
        </h2>
        <p className="font-serif italic text-stone-400 text-lg mb-10 max-w-2xl">
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
            <label className="block text-xs uppercase tracking-widest text-stone-500 mb-2">Flying from</label>
            <select
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
            <label className="block text-xs uppercase tracking-widest text-stone-500 mb-2">Flying to</label>
            <select
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

          <button
            onClick={plan}
            disabled={!origin || !destination}
            className="bg-amber-600 text-white px-7 py-3.5 uppercase tracking-widest text-xs font-medium hover:bg-amber-500 disabled:opacity-30 disabled:cursor-not-allowed transition-colors whitespace-nowrap"
          >
            Plan my journey
          </button>
        </div>

        {/* Results */}
        {planned && (
          <div className="border-t border-stone-700 pt-8 animate-fadeIn">
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

            {/* Destination airport can't receive cabin pets — accurate to the EXACT airport picked */}
            {destCabinWarning && origin !== destination && (
              <div className="bg-rose-950/50 border-l-2 border-rose-500 p-5 mb-6">
                <div className="flex items-start gap-3">
                  <AlertTriangle className="w-5 h-5 text-rose-400 flex-shrink-0 mt-0.5" strokeWidth={1.75} />
                  <div>
                    <div className="font-serif text-stone-100 mb-1">About arriving into {airportLabel(destination)}</div>
                    <p className="text-stone-300 text-sm leading-relaxed">{destCabinWarning}</p>
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
                  <div className="flex items-baseline gap-3 mb-4">
                    <span className="text-emerald-400 text-base">✓</span>
                    <h4 className="font-serif text-xl text-stone-100">
                      Direct cabin {grouped.length === 1 ? "route" : `routes · ${grouped.length} options`}
                    </h4>
                  </div>
                  <div className="space-y-3">
                    {grouped.map((g, i) => (
                      <div key={i} className="bg-stone-800 border border-stone-700 p-4">
                        <div className="flex items-center gap-2 flex-wrap mb-2">
                          <span className="font-serif text-base text-stone-100">{g.from}</span>
                          <ArrowRight className="w-3.5 h-3.5 text-stone-500" strokeWidth={2} />
                          <span className="font-serif text-base text-stone-100">{g.to}</span>
                          <span className="text-xs text-stone-500 ml-1">· {g.duration}</span>
                        </div>
                        {g.routes.length === 1 ? (
                          <p className="text-stone-400 text-sm leading-relaxed">{g.routes[0].note}</p>
                        ) : (
                          <div className="space-y-2">
                            {g.routes.map((r, j) => (
                              <p key={j} className="text-stone-400 text-sm leading-relaxed border-l border-stone-600 pl-3">{r.note}</p>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
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
              </div>
            )}

            {/* Workaround routes */}
            {workaroundMatches.length > 0 && (
              <div className="mb-8">
                <div className="flex items-baseline gap-3 mb-4">
                  <span className="text-amber-400 text-base">⤳</span>
                  <h4 className="font-serif text-xl text-stone-100">
                    {hasDirect ? "Workaround routes" : "Workaround routes — your way there"}
                  </h4>
                  <span className="text-xs uppercase tracking-widest text-stone-500">{workaroundMatches.length}</span>
                </div>
                <div className="space-y-3">
                  {workaroundMatches.map((r, i) => (
                    <div key={i} className="bg-stone-800 border border-stone-700 p-4">
                      {/* Strategy label, e.g. "Via Montreal (Air Canada)" */}
                      {r.label && (
                        <div className="text-xs uppercase tracking-widest text-amber-400 mb-2">{r.label}</div>
                      )}
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
                      </div>
                      <div className="space-y-1 mb-2 pl-3 border-l border-stone-600">
                        {r.legs.map((leg, j) => (
                          <div key={j} className="text-sm text-stone-300">
                            <span className="text-stone-100">{leg.route}</span>
                            <span className="text-stone-500"> — {leg.time} · {leg.airline}</span>
                          </div>
                        ))}
                      </div>
                      <p className="text-stone-400 text-sm leading-relaxed">{r.note}</p>
                    </div>
                  ))}
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
                        {grouped.map((g, i) => (
                          <div key={i} className="bg-stone-800 border border-stone-700 p-4">
                            <div className="flex items-center gap-2 flex-wrap mb-1.5">
                              <span className="font-serif text-base text-stone-100">{g.from}</span>
                              <ArrowRight className="w-3.5 h-3.5 text-stone-500" strokeWidth={2} />
                              <span className="font-serif text-base text-stone-100">{g.to}</span>
                              <span className="text-xs text-stone-500 ml-1">· {g.duration}</span>
                            </div>
                            {g.routes.length === 1 ? (
                              <p className="text-stone-400 text-sm leading-relaxed">{g.routes[0].note}</p>
                            ) : (
                              <div className="space-y-2">
                                {g.routes.map((r, j) => <p key={j} className="text-stone-400 text-sm leading-relaxed border-l border-stone-600 pl-3">{r.note}</p>)}
                              </div>
                            )}
                          </div>
                        ))}
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
                      {altWorkarounds.map((r, i) => (
                        <div key={i} className="bg-stone-800 border border-stone-700 p-4">
                          {r.label && (
                            <div className="text-xs uppercase tracking-widest text-amber-400 mb-2">{r.label}</div>
                          )}
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
                          </div>
                          <div className="space-y-1 mb-2 pl-3 border-l border-stone-600">
                            {r.legs.map((leg, j) => (
                              <div key={j} className="text-sm text-stone-300">
                                <span className="text-stone-100">{leg.route}</span>
                                <span className="text-stone-500"> — {leg.time} · {leg.airline}</span>
                              </div>
                            ))}
                          </div>
                          <p className="text-stone-400 text-sm leading-relaxed">{r.note}</p>
                        </div>
                      ))}
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

            {/* Checklist link */}
            {origin !== destination && (
              <div className="bg-amber-950/40 border border-amber-800/50 p-5">
                <div className="flex items-start gap-3 mb-4">
                  <FileCheck className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" strokeWidth={1.75} />
                  <div className="flex-1">
                    <div className="font-serif text-stone-100 mb-1">Your combined prep checklist</div>
                    <p className="text-stone-300 text-sm leading-relaxed">
                      Every country your pet legally enters — origin, any transit countries, destination — with its own chapter. Each chapter keeps its own timeline. We've worked out the specific paperwork for your exact route, so there's no "research this" guesswork.
                    </p>
                  </div>
                </div>

                {/* Inline combined checklist — two chapters (origin departure +
                    destination arrival), each with its own timeline, plus
                    a separate tips section at the end. */}
                {(() => {
                  if (!originAirport || !destAirport) return null;
                  // Extract transit regions from any workaround routes for this
                  // journey. Tags on a workaround entry are the regions the
                  // route touches — origin and destination are filtered out so
                  // we only keep genuine transit countries.
                  const allWorkarounds = [...workaroundMatches, ...altWorkarounds];
                  const transitRegions = [...new Set(
                    allWorkarounds.flatMap((w) => w.tags || [])
                  )].filter((t) => t !== originAirport.region && t !== destAirport.region);

                  const combined = buildRouteChecklist(
                    originAirport.region,
                    destAirport.region,
                    REGION_LABELS_SHORT[originAirport.region] || originAirport.region,
                    REGION_LABELS_SHORT[destAirport.region] || destAirport.region,
                    petType,
                    transitRegions
                  );
                  if (!combined.sections || combined.sections.length === 0) {
                    return (
                      <p className="text-stone-400 text-sm italic">
                        Country-specific prep isn't yet wired for this exact route — use the checklist section below for the closest match.
                      </p>
                    );
                  }
                  // Detect when we cross into the tips block — render that one
                  // visually demoted (smaller, less prominent).
                  let inTipsBlock = false;
                  return (
                    <div className="space-y-5 mt-2">
                      {combined.sections.map((s, i) => {
                        // Chapter dividers — render as prominent header bands.
                        if (s.divider) {
                          // Detect the tips divider — switch to demoted styling.
                          const isTipsChapter = s.title.toLowerCase().includes("tips");
                          if (isTipsChapter) inTipsBlock = true;
                          return (
                            <div key={i} className={isTipsChapter ? "mt-6 pt-4 border-t border-stone-700" : "mt-6"}>
                              <div className={isTipsChapter
                                ? "text-xs uppercase tracking-widest text-stone-500 mb-1"
                                : "font-serif text-stone-50 text-lg bg-stone-900 -mx-5 px-5 py-3 mb-3"}>
                                {s.title}
                              </div>
                              {s.items[0] && (
                                <p className={isTipsChapter
                                  ? "text-stone-500 text-xs italic mb-2"
                                  : "text-stone-400 text-xs italic mb-3"}>
                                  {s.items[0]}
                                </p>
                              )}
                            </div>
                          );
                        }
                        // Regular timeline section.
                        const sectionStyle = inTipsBlock
                          ? "text-xs uppercase tracking-widest text-stone-500 mb-2"
                          : "text-xs uppercase tracking-widest text-amber-400 mb-2 pb-1.5 border-b border-amber-800/40";
                        const itemStyle = inTipsBlock
                          ? "flex gap-2 text-stone-400 text-xs leading-snug italic"
                          : "flex gap-2 text-stone-300 text-sm leading-snug";
                        return (
                          <div key={i}>
                            <div className={sectionStyle}>{s.title}</div>
                            <ul className="space-y-1.5">
                              {s.items.slice(0, inTipsBlock ? 8 : 8).map((item, j) => (
                                <li key={j} className={itemStyle}>
                                  <span className={inTipsBlock ? "text-stone-500 flex-shrink-0 mt-0.5" : "text-amber-500 flex-shrink-0 mt-0.5"}>{inTipsBlock ? "·" : "✓"}</span>
                                  <span dangerouslySetInnerHTML={{ __html: item }} />
                                </li>
                              ))}
                              {s.items.length > 8 && (
                                <li className="text-stone-500 text-xs italic ml-5">
                                  + {s.items.length - 8} more in this stage
                                </li>
                              )}
                            </ul>
                          </div>
                        );
                      })}
                      <div className="pt-4 mt-4 border-t border-amber-800/40">
                        <button
                          onClick={() => openChecklistPrintable(combined)}
                          className="inline-flex items-center gap-2 bg-amber-600 hover:bg-amber-500 text-stone-50 px-4 py-2.5 text-xs uppercase tracking-widest font-medium transition-colors"
                        >
                          <FileCheck className="w-3.5 h-3.5" strokeWidth={2} />
                          Download printable PDF
                        </button>
                        <p className="text-stone-500 text-xs mt-2">
                          Opens in a new tab. Use your browser's "Print / Save as PDF" from there.
                        </p>
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
    { id: "us", label: "US routes", flag: "🇺🇸" },
    { id: "india", label: "India routes", flag: "🇮🇳" },
    { id: "europe", label: "Europe routes", flag: "🇪🇺" },
    { id: "canada", label: "Canada routes", flag: "🇨🇦" },
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
    "us": ["New York", "Miami", "Chicago", "Los Angeles", "Boston", "San Francisco", "Washington", "Newark", "Seattle", "(JFK)", "(MIA)", "(ORD)", "(LAX)", "(BOS)", "(SFO)", "(IAD)", "(EWR)", "(SEA)", "USA"],
    "india": ["Delhi", "Mumbai", "Bangalore", "Bengaluru", "Chennai", "Kolkata", "Hyderabad", "(DEL)", "(BOM)", "(BLR)", "(MAA)", "(CCU)", "(HYD)"],
    "europe": ["Paris", "Amsterdam", "Frankfurt", "Zurich", "Warsaw", "Lisbon", "Porto", "Rome", "Milan", "Madrid", "Barcelona", "Istanbul", "(CDG)", "(AMS)", "(FRA)", "(ZRH)", "(WAW)", "(LIS)", "(OPO)", "(FCO)", "(MXP)", "(MAD)", "(BCN)", "(IST)"],
    "canada": ["Toronto", "Montreal", "Vancouver", "(YYZ)", "(YUL)", "(YVR)"],
    "dubai": ["Dubai", "Abu Dhabi", "(DXB)", "(AUH)", "UAE"],
    "caribbean": ["Nassau", "Punta Cana", "Santo Domingo", "Montego Bay", "Kingston", "Bridgetown", "Cayman", "Aruba", "Curacao", "San Juan", "(NAS)", "(PUJ)", "(SDQ)", "(MBJ)", "(KIN)", "(BGI)", "(GCM)", "(AUA)", "(CUR)", "(SJU)", "Bahamas", "Jamaica", "Dominican Republic", "Cayman Islands"],
    "mexico": ["Mexico City", "Cancún", "Cancun", "Guadalajara", "(MEX)", "(CUN)", "(GDL)", "Mexico"],
    "hawaii": ["Honolulu", "Kahului", "Maui", "Kauai", "(HNL)", "(OGG)", "Hawaii"],
    "south-africa": ["Johannesburg", "Cape Town", "Durban", "George", "(JNB)", "(CPT)", "(DUR)", "(GRJ)", "South Africa"],
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

        <div className="mb-10">
          <div className="text-xs uppercase tracking-widest text-stone-500 mb-3">Filter by region</div>
          <div className="flex flex-wrap gap-2">
            {ROUTE_FILTERS.map((f) => {
              const isActive = filter === f.id;
              return (
                <button
                  key={f.id}
                  onClick={() => setFilter(f.id)}
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
          <p className="text-stone-500 text-sm mt-3 italic font-serif">
            Showing {totalFiltered} of {totalAll} routes.
          </p>
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
                          <div className="font-serif text-xl text-stone-900">
                            {r.from} <span className="text-stone-400 mx-2">→</span> {r.to}
                          </div>
                          {r.duration && r.duration !== "see legs" && (
                            <div className="text-amber-700 font-medium text-sm uppercase tracking-widest">
                              Total: {r.duration}
                            </div>
                          )}
                        </div>

                        <div className="space-y-2 mb-4">
                          {r.legs.map((leg, j) => (
                            <div key={j} className="grid grid-cols-12 gap-3 text-sm items-center">
                              <div className="col-span-12 md:col-span-5 font-medium text-stone-900">{leg.route}</div>
                              <div className="col-span-5 md:col-span-2 text-stone-600 font-medium">{leg.time}</div>
                              <div className="col-span-7 md:col-span-5 text-stone-700 italic font-serif">{leg.airline}</div>
                            </div>
                          ))}
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
              link: "—",
            },
            {
              title: "Rabies certificate",
              when: "Almost everywhere",
              detail: "Original (not photocopy) signed by your vet. Should include microchip number, vaccine type, manufacturer, lot number, and expiration date. Many countries require the vaccine ≥21 days old and ≤12 months old at travel.",
              link: "—",
            },
            {
              title: "GB Animal Health Certificate (AHC)",
              when: "Leaving the UK for EU / many destinations",
              detail: "Issued by a UK-based Official Veterinarian (OV) within 10 days of travel. Valid 4 months for EU travel and 4 months for re-entry. Pre-2021 UK pet passports are no longer valid.",
              link: "gov.uk/pet-travel",
            },
            {
              title: "EU Pet Passport / EU Health Certificate",
              when: "Entering / travelling within the EU",
              detail: "EU pet passport issued by an EU vet (valid for lifetime). Non-EU pets need an EU Health Certificate issued by a government-accredited vet within 10 days of entry.",
              link: "ec.europa.eu/animals",
            },
            {
              title: "CDC Dog Import Form",
              when: "All dogs entering the U.S.",
              detail: "Required for every dog entering the United States — including US dogs returning home. Fill out online; the receipt is good for six months and multiple entries.",
              link: "cdc.gov/importation/dogs",
            },
            {
              title: "USDA Health Certificate",
              when: "Leaving the U.S. for international travel",
              detail: "An APHIS Form 7001 or country-specific form, completed by a USDA-accredited vet within 10 days of travel and endorsed by your nearest USDA office.",
              link: "aphis.usda.gov/pet-travel",
            },
            {
              title: "AQCS NOC (India)",
              when: "Entering India",
              detail: "No Objection Certificate from India's Animal Quarantine and Certification Service. Apply 1–2 weeks before. Pets can enter through Delhi, Mumbai, Chennai, Kolkata, Bengaluru, or Hyderabad only.",
              link: "aqcs.gov.in",
            },
            {
              title: "MOCCAE permit (UAE)",
              when: "Entering UAE (Abu Dhabi or Dubai)",
              detail: "UAE Health Certificate + release permit from the Ministry of Climate Change and Environment. Required regardless of cabin or cargo, regardless of airline. Apply via the MOCCAE portal.",
              link: "moccae.gov.ae",
            },
            {
              title: "Tapeworm treatment record",
              when: "Entering UK, Ireland, Malta, Finland, Norway",
              detail: "Praziquantel administered by a vet 24–120 hours before arrival, recorded in the health certificate. Required for dogs only.",
              link: "—",
            },
            {
              title: "Hawaii AQS-279",
              when: "Any pet entering Hawaii",
              detail: "Submitted with FAVN rabies titer results, two rabies vaccines, and proof of microchip at least 30 days before arrival for the Direct Airport Release program.",
              link: "hdoa.hawaii.gov",
            },
            {
              title: "Rabies titer test (FAVN / RNATT)",
              when: "Travel between rabies-controlled and rabies-free regions",
              detail: "Blood test measuring rabies antibodies. Required for UK/EU entry from unlisted countries, Australia, Japan, Singapore. Often a 3-month wait period applies after the test.",
              link: "—",
            },
            {
              title: "Australia Import Permit",
              when: "Entering Australia",
              detail: "From the Department of Agriculture. Multi-step process spanning 6+ months including pre-export tests, rabies titer (FAVN), tick treatment, and 10-day post-arrival quarantine at Mickleham.",
              link: "agriculture.gov.au",
            },
            {
              title: "Jamaica Veterinary Import Permit",
              when: "Entering Jamaica",
              detail: "Two-stage process: Preliminary Application Form (with FAVN titer results) must be approved BEFORE you start the rest of the prep. Then Veterinary Import Permit issued. Pit Bull Terriers and hybrid dogs banned. Allow 6+ months from start to travel day.",
              link: "moa.gov.jm",
            },
            {
              title: "Bahamas Import Permit",
              when: "Entering Bahamas",
              detail: "Required for every pet. Apply via bahamaspetpermit.com (online) at least 4 weeks before travel — 6–8 weeks for standard processing without expedited service. ~$10 USD + 12% VAT. Banned breeds: Pit Bull, Presa Canario, Cane Corso, American Bully, Staffordshire Terrier.",
              link: "bahamaspetpermit.com",
            },
            {
              title: "CDC Certification of U.S.-issued Rabies Vaccination",
              when: "Returning to US from high-risk countries",
              detail: "Required when returning to the US from a CDC high-risk rabies country (including Dominican Republic). Must be completed by USDA-accredited vet and endorsed by USDA BEFORE the dog leaves the US — cannot be issued retroactively. Different form from a regular rabies certificate.",
              link: "cdc.gov/importation",
            },
          ].map((d, i) => (
            <div key={i} className="bg-stone-900 p-8">
              <FileCheck className="w-6 h-6 text-amber-500 mb-4" strokeWidth={1.5} />
              <div className="text-xs uppercase tracking-widest text-amber-500/80 mb-2">{d.when}</div>
              <h3 className="font-serif text-xl mb-3">{d.title}</h3>
              <p className="text-stone-400 text-sm leading-relaxed mb-4">{d.detail}</p>
              <div className="text-xs text-stone-500 italic font-serif">{d.link}</div>
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
              body: "Most vets and the AVMA advise against sedating pets for air travel. At altitude, sedatives can cause respiratory and cardiovascular issues. If your pet is anxious, talk to your vet about non-sedating calming options like Adaptil/Feliway or a thunder shirt.",
            },
            {
              tag: "On the carrier",
              title: "Buy soft, not stiff.",
              body: "Soft-sided carriers compress slightly to fit under tighter seats and feel less cage-like for your pet. Make sure ventilation is on at least three sides. IMPORTANT: each airline AND each aircraft type can have different under-seat dimensions — Air Canada in particular varies by aircraft. Always check the specific aircraft listed on your booking, not just the airline.",
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
              body: "Resist the urge to comfort-feed treats or top up water during the flight — both can trigger a toilet need you cannot deal with at 38,000 feet. Tiny amounts only, just enough for reassurance. Most well-prepared pets sleep through the flight without needing anything.",
            },
            {
              tag: "On nerves (yours)",
              title: "Your pet reads you.",
              body: "Dogs and cats track your stress level closely. Pre-flight rituals matter: don't fuss, don't apologize to them, don't keep checking the carrier mid-flight. Calm handler, calm animal.",
            },
            {
              tag: "On the unexpected",
              title: "Have a Plan B.",
              body: "Save your destination's nearest 24-hour vet in your phone before you leave. Pack copies of vaccination records in a Ziploc inside the carrier. If you connect, build in at least 90 minutes — pet relief areas are a hike.",
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

// ---------- ROOT ----------

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
    setTimeout(() => {
      document.getElementById("intake-anchor")?.scrollIntoView({ behavior: "smooth" });
    }, 50);
  }

  function completeIntake() {
    setPhase("results");
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
      <QuarantineWatch />
      <Checklist />
      <Documents />
      <Tips />
      <TravelDay />
      <Stories />
      <Contact />
      <Footer />
    </div>
  );
}
