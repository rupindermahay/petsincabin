import { useState, useMemo, useEffect } from "react";
import { PawPrint, Plane, FileCheck, AlertTriangle, ArrowRight, ArrowLeft, RotateCcw, Check, Info, Luggage, Stethoscope, ScrollText, Sparkles, Ship, Map as MapIcon, Train, Compass, Menu, X } from "lucide-react";

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
    fee: "$150 each way (increased Jan 2, 2026 from $100) · $60 within Hawaii",
    weight: "No stated weight limit; pet must fit comfortably in carrier",
    carrier: "Soft: 17 × 11 × 9.5 in. Hard: 17 × 11 × 7.5 in.",
    notes: "One of the more flexible US carriers. Cabin pets allowed on domestic, some Mexico/Canada/Costa Rica routes. Hawaii routes have strict quarantine paperwork — start prep 4+ months out. Two pets per carrier allowed if same species and small.",
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
    notes: "Another Canadian carrier that allows pets in cabin OUT of the UK — handy if you live closer to Manchester or Glasgow than London. Does NOT work from Gatwick (GLA only). Like Air Canada, pets can't fly cabin into the UK on return.",
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
    tags: ["india", "europe", "longhaul"],
    cabin: "Cabin India ↔ Europe/Asia ✓ — NOT direct to US/Canada/UK/Australia",
    cabinStatus: "conditional",
    direction: "Cabin allowed: domestic India, India ↔ Europe (Frankfurt, Paris, Amsterdam, etc.), India ↔ Asia (Singapore, Hong Kong, Thailand), and outbound flights FROM UAE to many destinations. Cabin NOT allowed: direct flights to/from USA, Canada, UK, or Australia (cargo only on these routes — use a European hub airline for cabin instead). Pets entering UAE must arrive as cargo regardless of airline.",
    originAllowed: { uk: "no", us: "no", eu: "yes", india: "yes", canada: "no", uae: "yes", caribbean: "no" },
    destinationAllowed: { uk: "no", us: "no", eu: "yes", india: "yes", canada: "no", uae: "yes", caribbean: "no" },
    fee: "₹7,500 domestic / $140 short-haul intl / $160 Europe",
    weight: "Pet + carrier max 10 kg (22 lb) for cabin",
    carrier: "Soft-sided, max 18×18×12 in. Cargo hold uses IATA-compliant hard crates",
    notes: "'Paws on Board' programme. Book via customer support 48 hrs before departure. Pet sits in last aisle row, economy only. For India → USA/Canada in cabin, use a European hub airline (Lufthansa, KLM, Air France, SWISS, LOT) for the long-haul leg instead.",
    intl: "Yes (most routes)",
    verified: "May 2026",
    link: "https://www.airindia.com/in/en/travel-information/travelling-with-pets.html",
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
    tags: ["dubai", "india", "europe", "uk-out"],
    cabin: "Cabin OUT of UK/India/Europe ↔ Abu Dhabi ✓ — but NOT cabin INTO the UK",
    cabinStatus: "conditional",
    direction: "Cabin allowed: India ↔ Abu Dhabi (Delhi, Mumbai, Bangalore, Chennai), Europe ↔ Abu Dhabi (most major cities), and OUT of UK to Abu Dhabi (London Heathrow / Manchester). All under 8 kg combined. Cabin NOT allowed: INTO UK from Abu Dhabi (UK government rule — cargo only inbound to UK), into USA, Australia, Hong Kong, Maldives, South Africa, Bali, and several Indian airports (Ahmedabad, Jaipur, Kochi, Kozhikode, Thiruvananthapuram). And NEVER into Dubai (DXB) — UAE law requires cargo into DXB for all airlines.",
    originAllowed: { uk: "yes", us: "no", eu: "yes", india: "yes", canada: "no", uae: "yes", caribbean: "no" },
    destinationAllowed: { uk: "no", us: "no", eu: "yes", india: "yes", canada: "no", uae: "yes", caribbean: "no" },
    fee: "Promo: $399 per segment (bookings before end of May 2026). Standard: $1,500 per segment.",
    weight: "Pet + carrier max 8 kg (17.6 lb) — economy under-seat OR buy adjacent seat for bigger carrier",
    carrier: "Economy under-seat: max 40 × 40 × 22 cm. Adjacent seat: max 50 × 43 × 50 cm. Soft-sided, well-ventilated.",
    notes: "The ONLY airline that allows cabin pets into the UAE — and only into Abu Dhabi (AUH), 90 minutes from Dubai by road. Cabin OUT of UK (LHR, MAN) is allowed (verified on Etihad's country restrictions page). Submit booking form 7+ days before, email all docs 72 hrs before. UAE Health Certificate required. Banned breeds: Pit Bull, Staffies, American Bully, Brazilian/Argentinian Mastiff, Tosa, Doberman, Rottweiler, Boxer, Canario Presa. Snub-nosed breeds restricted seasonally.",
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
];

// ---------- POPULAR ROUTES & TIMES ----------

const DIRECT_ROUTES = [
  // ═══════ FROM BOSTON ═══════
  { from: "Boston (BOS)", to: "Paris (CDG)", duration: "7h", note: "Air France. ✓ Cabin (under 8 kg). The shortest US east coast direct cabin to Europe.", tags: ["us", "europe"] },

  // ═══════ FROM CHICAGO ═══════
  { from: "Chicago (ORD)", to: "Frankfurt (FRA)", duration: "8h 45m", note: "Lufthansa. ✓ Cabin (under 8 kg). Frankfurt's Animal Lounge available for cargo connections.", tags: ["us", "europe"] },
  { from: "Chicago (ORD)", to: "Paris (CDG)", duration: "8h 30m", note: "Air France. ✓ Cabin (under 8 kg). Midwest's main direct cabin to Europe.", tags: ["us", "europe"] },

  // ═══════ FROM DELHI ═══════
  { from: "Delhi (DEL)", to: "Istanbul (IST)", duration: "7h 30m", note: "Turkish Airlines. ✓ Cabin (under 8 kg). Connect at IST for onward cabin to Europe / USA.", tags: ["india", "europe"] },
  { from: "Delhi (DEL)", to: "Paris (CDG)", duration: "9h", note: "Air India 'Paws on Board'. ✓ Cabin direct (under 10 kg combined).", tags: ["india", "europe"] },
  { from: "Delhi / Mumbai", to: "Abu Dhabi (AUH)", duration: "3h 30m", note: "Etihad. ✓ Cabin (under 8 kg). Promo $399 per segment through May 2026. The cabin route into the UAE.", tags: ["india", "dubai"] },

  // ═══════ FROM DUBAI ═══════
  { from: "Dubai (DXB)", to: "Delhi / Mumbai", duration: "3h 15m", note: "Air India. ✓ Cabin OUT of UAE (under 10 kg combined). Pets entering UAE must go cargo regardless of airline.", tags: ["dubai", "india"] },

  // ═══════ FROM LONDON ═══════
  { from: "London (LHR)", to: "Abu Dhabi (AUH)", duration: "7h 30m", note: "Etihad. ✓ Cabin OUT of UK (under 8 kg). Promo $399 per segment through May 2026. The cabin route into the UAE — AUH is 90 min from Dubai by road.", tags: ["uk-out", "dubai"] },
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

  // ═══════ FROM MADRID ═══════
  { from: "Madrid (MAD)", to: "Lisbon (LIS)", duration: "1h 15m", note: "Iberia. ✓ Cabin (under 8 kg, €35 within Spain → Portugal).", tags: ["europe"] },
  { from: "Madrid (MAD)", to: "Miami (MIA)", duration: "9h 30m", note: "Iberia. ✓ Cabin (under 8 kg, €150 to Americas). Strong Spain → USA cabin route.", tags: ["us", "europe"] },
  { from: "Madrid (MAD)", to: "New York (JFK)", duration: "8h", note: "Iberia. ✓ Cabin (under 8 kg, €150 to Americas).", tags: ["us", "europe"] },

  // ═══════ FROM MANCHESTER ═══════
  { from: "Manchester (MAN)", to: "Abu Dhabi (AUH)", duration: "7h 45m", note: "Etihad. ✓ Cabin out of UK (under 8 kg). Promo $399 segment through May 2026.", tags: ["uk-out", "dubai"] },
  { from: "Manchester (MAN)", to: "Toronto (YYZ)", duration: "7h 45m", note: "Air Transat. ✓ Cabin out of UK (under 8 kg). Manchester/Glasgow only — not Gatwick.", tags: ["uk-out", "canada"] },

  // ═══════ FROM MIAMI ═══════
  { from: "Miami (MIA)", to: "Nassau (NAS)", duration: "55m", note: "JetBlue, AA, Delta, Bahamasair. ✓ Cabin (under 20 lb on JetBlue). Shortest US-Caribbean route — Bahamas import permit required (apply 6–8 weeks ahead).", tags: ["us", "caribbean"] },
  { from: "Miami (MIA)", to: "New York (JFK)", duration: "3h 15m", note: "Delta, AA, United, JetBlue. ✓ Cabin all four. Domestic-equivalent route, multiple daily.", tags: ["us"] },
  { from: "Miami (MIA)", to: "Paris (CDG)", duration: "9h 30m", note: "Air France. ✓ Cabin (under 8 kg). Southern US direct cabin to Europe.", tags: ["us", "europe"] },
  { from: "Miami (MIA)", to: "Santo Domingo (SDQ)", duration: "2h 30m", note: "JetBlue, AA, Delta. ✓ Cabin (under 20 lb on JetBlue). NOTE: DR is CDC high-risk — get Certification of US-issued Rabies Vaccination form BEFORE departure for return.", tags: ["us", "caribbean"] },

  // ═══════ FROM MONTREAL ═══════
  { from: "Montreal (YUL)", to: "Miami (MIA)", duration: "3h 30m", note: "Air Canada, American, or United. ✓ Cabin all three (22 lb AC / 20 lb US carriers).", tags: ["canada", "us"] },

  // ═══════ FROM NEW YORK ═══════
  { from: "New York (JFK)", to: "Amsterdam (AMS)", duration: "7h 30m", note: "KLM. ✓ Cabin (under 8 kg). Strong onward hub for India / continental Europe.", tags: ["us", "europe"] },
  { from: "New York (JFK)", to: "Frankfurt (FRA)", duration: "7h 45m", note: "Lufthansa. ✓ Cabin (under 8 kg). Larger carrier allowance than most (55×40×23 cm).", tags: ["us", "europe"] },
  { from: "New York (JFK)", to: "Istanbul (IST)", duration: "10h 30m", note: "Turkish Airlines. ✓ Cabin (under 8 kg). Connect at IST for cabin onward to Europe, India, Africa.", tags: ["us", "europe"] },
  { from: "New York (JFK)", to: "Lisbon (LIS)", duration: "7h 15m", note: "TAP Air Portugal. ✓ Cabin (under 8 kg). Snub-nosed breeds welcome.", tags: ["us", "europe"] },
  { from: "New York (JFK)", to: "Madrid (MAD)", duration: "7h 45m", note: "Iberia. ✓ Cabin (under 8 kg, €150). Connect at MAD for cabin onward to Spain / Latin America.", tags: ["us", "europe"] },
  { from: "New York (JFK)", to: "Paris (CDG)", duration: "7h 45m", note: "Delta and Air France. ✓ Cabin (under 8 kg). NOT American Airlines (AA bans transatlantic cabin).", tags: ["us", "europe"] },
  { from: "New York (JFK)", to: "Rome (FCO)", duration: "9h", note: "ITA Airways. ✓ Cabin (under 8 kg, €210 fee). Plus EU pet passport hub access.", tags: ["us", "europe"] },
  { from: "New York (JFK)", to: "Warsaw (WAW)", duration: "9h", note: "LOT Polish. ✓ Cabin (under 8 kg, €70 fee). Cheapest long-haul cabin fee on the market.", tags: ["us", "europe"] },
  { from: "New York (JFK)", to: "Zurich (ZRH)", duration: "8h", note: "SWISS. ✓ Cabin (under 8 kg). Snub-nosed breeds OK in cabin.", tags: ["us", "europe"] },

  // ═══════ FROM PARIS ═══════
  { from: "Paris (CDG)", to: "London (UK)", duration: "5–10h via Eurotunnel", note: "Fly cabin to CDG, drive/taxi to Calais, Eurotunnel (35min), drive to London. Pet stays with you the whole way — the standard cabin pets workaround to get INTO the UK.", tags: ["europe", "uk-out"] },

  // ═══════ FROM ROME ═══════
  { from: "Rome (FCO)", to: "New York (JFK)", duration: "9h 30m", note: "ITA Airways. ✓ Cabin (under 8 kg, €210). Italy's flagship transatlantic cabin route.", tags: ["us", "europe"] },
  { from: "Rome (FCO)", to: "Milan (MXP)", duration: "1h 15m", note: "ITA Airways. ✓ Cabin domestic Italy (up to 12 kg!). One of EU's most generous cabin pet limits.", tags: ["europe"] },

  // ═══════ FROM TORONTO ═══════
  { from: "Toronto (YYZ)", to: "Chicago (ORD)", duration: "1h 30m", note: "Air Canada or United. ✓ Cabin both. Shortest US Midwest cabin from Canada.", tags: ["canada", "us"] },
  { from: "Toronto (YYZ)", to: "Los Angeles (LAX)", duration: "5h 15m", note: "Air Canada. ✓ Cabin (under 22 lb combined). West coast direct.", tags: ["canada", "us"] },
  { from: "Toronto (YYZ)", to: "Miami (MIA)", duration: "3h 22m", note: "Air Canada or American. ✓ Cabin both. Popular cabin route for Canadians wintering in Florida.", tags: ["canada", "us"] },
  { from: "Toronto (YYZ)", to: "Montreal (YUL)", duration: "1h 30m", note: "Air Canada. ✓ Cabin (under 22 lb combined).", tags: ["canada"] },
  { from: "Toronto (YYZ)", to: "New York (JFK)", duration: "1h 45m", note: "Air Canada, Delta, United, American. ✓ Cabin all four. Shortest US cabin from Canada.", tags: ["canada", "us"] },
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
    from: "New York (JFK)",
    to: "London (UK)",
    duration: "~14h total (incl. ground)",
    legs: [
      { route: "JFK → Paris CDG", time: "7h 45m", airline: "Air France ✓ Cabin" },
      { route: "CDG → Calais (drive/taxi)", time: "2h 30m", airline: "Pet stays with you" },
      { route: "Eurotunnel Le Shuttle to Folkestone", time: "35m", airline: "Pet stays in car" },
      { route: "Folkestone → London (drive)", time: "1h 30m", airline: "Pet stays with you" },
    ],
    note: "There's no cabin pet flight INTO the UK from anywhere (UK government rule, all airlines). The standard workaround: fly cabin to Paris, then drive + Eurotunnel + drive. Eurotunnel costs £25–£60 per pet. Most UK pet importers use this exact route.",
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
];

// Combined for backward compatibility (other components reference ROUTES)
const ROUTES = [...DIRECT_ROUTES, ...WORKAROUND_ROUTES_TABLE];

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
          "TSA: take pet OUT of carrier, walk/carry through metal detector",
          "Carrier goes through X-ray empty",
          "Window seat preferred — slightly more under-seat depth, away from cart traffic",
          "If airline allows extra-legroom seats with pets, BOOK THIS — life-changing",
          "Don't open the carrier mid-flight (FAA rule)",
          "If pet gets stressed: calming spray works wonders; staff sometimes allow a quick lap visit",
          "On long flights: book overnight/red-eye when pets naturally sleep",
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
    ],
  },
  india: {
    title: "India entry / exit checklist",
    sections: [
      {
        title: "4 weeks before",
        items: [
          "Apply for No Objection Certificate (NOC) from AQCS",
          "ISO microchip implanted (if not already)",
          "Rabies vaccine 30 days – 12 months before travel",
          "Parvo, distemper, leptospirosis vaccines up to date",
          "Confirm entry airport: Delhi, Mumbai, Chennai, Kolkata, or Bengaluru only",
        ],
      },
      {
        title: "2 weeks before",
        items: [
          "Book Air India cabin slot (if eligible route) OR pet relocation specialist",
          "Get official health certificate from origin country vet",
          "If from UK/EU: confirm tapeworm treatment timing if also returning",
        ],
      },
      {
        title: "Travel day",
        items: [
          "Have NOC printed AND digital copy",
          "Arrive 4 hours early for international",
          "Confirm with Air India that cabin slot still applies — pets approved 48 hrs prior",
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
    ],
  },
};

// ---------- INTAKE FLOW ----------

const QUESTIONS = [
  {
    id: "species",
    label: "What kind of pet are you flying with?",
    type: "choice",
    options: ["Dog", "Cat", "Other small pet"],
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
    label: "Where are you flying?",
    type: "choice",
    options: ["Domestic (within the U.S.)", "Hawaii", "Canada / Mexico", "UK / Ireland", "Europe", "India", "UAE / Dubai", "Asia / Pacific", "Other international"],
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

  if (answers.age === "Under 8 weeks") {
    flags.push({
      title: "Your pet is too young to fly",
      detail: "Almost every airline requires pets to be at least 8 weeks old for domestic travel and 16 weeks for international. Wait until your pet is older and fully weaned.",
    });
  }

  if (answers.destination === "Europe" || answers.destination === "UK / Ireland" || answers.destination === "India" || answers.destination === "UAE / Dubai" || answers.destination === "Asia / Pacific" || answers.destination === "Other international") {
    if (answers.age === "8 weeks – 4 months") {
      flags.push({
        title: "Likely too young for international travel",
        detail: "Most countries require pets to be at least 12–16 weeks old, plus a rabies vaccine that's been in effect for 21–30 days. The EU requires a minimum age of 15 weeks.",
      });
    }
  }

  if (answers.weight === "Over 25 lb") {
    flags.push({
      title: "Likely too heavy for cabin travel",
      detail: "Combined pet + carrier weight over 25 lb exceeds nearly every airline's cabin limit. Your pet will need to fly cargo — and most U.S. airlines have discontinued general-public cargo service. Consider a pet relocation service like CitizenShipper or specialty carriers like Hawaiian Air Cargo.",
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
      title: "Rabies vaccination required",
      detail: "Every U.S. state and country requires rabies vaccination for dogs, and most for cats. International destinations typically require the vaccine to have been administered at least 21–30 days before travel. Get this scheduled now.",
    });
  } else if (answers.vaccine === "Recently vaccinated (under 28 days)") {
    warnings.push({
      title: "Your rabies vaccine may not yet be 'in effect'",
      detail: "For international travel, most countries (including the EU and the U.S. on re-entry from high-risk countries) require the vaccine to have been administered at least 28 days before arrival, and after the microchip was implanted. Don't book travel until this window has passed.",
    });
  } else if (answers.vaccine === "Yes, current") {
    ok.push("Rabies vaccination is current.");
  }

  if ((answers.destination !== "Domestic (within the U.S.)" && answers.destination !== "Hawaii") && answers.microchip !== "Yes") {
    flags.push({
      title: "ISO microchip required for international travel",
      detail: "The EU, UK, Japan, Australia, and most other countries require an ISO 11784/11785 compliant microchip implanted before the rabies vaccine. If your pet was microchipped after their rabies shot, they may need to be re-vaccinated. Confirm with your vet.",
    });
  }

  if (answers.destination === "Hawaii") {
    warnings.push({
      title: "Hawaii has a strict rabies-free program",
      detail: "Hawaii is rabies-free and treats arriving pets like an international entry. The 'Direct Airport Release' program requires: ISO microchip, two rabies vaccines (most recent at least 30 days before arrival), a FAVN/OIE rabies blood test from an approved lab at least 30 days before arrival, and submission of paperwork to the Animal Industry Division. Plan 4+ months ahead.",
    });
  }

  if (answers.destination === "Europe") {
    warnings.push({
      title: "EU requires an EU Health Certificate",
      detail: "Issued by a USDA-accredited vet within 10 days of travel, then endorsed by your nearest USDA APHIS office. ISO microchip first, then rabies vaccine, then a 21-day waiting period before entry. Some countries (UK, Ireland, Malta, Finland, Norway) also require a tapeworm treatment for dogs, given 24–120 hours before arrival.",
    });
  }

  if (answers.destination === "Canada / Mexico") {
    ok.push("Canada and Mexico are among the easier international destinations: a current rabies certificate from your vet is usually all that's needed for dogs and cats over 3 months old. Confirm details with the receiving country before travel.");
  }

  if (answers.destination === "UK / Ireland") {
    flags.push({
      title: "No commercial airline allows pets in the cabin to the UK or Ireland",
      detail: "Every flight into the UK and Ireland requires pets to travel as manifested cargo — never in the cabin. The most common workaround is the 'Paris pivot': fly cabin into a continental EU airport (CDG, AMS, FRA), then drive or train across via Eurotunnel or ferry. See the UK destination tab for details.",
    });
    warnings.push({
      title: "Tapeworm treatment is mandatory for dogs",
      detail: "Dogs entering the UK or Ireland need a tapeworm treatment (praziquantel) administered by a vet 24–120 hours before arrival. Without this, your dog can be refused entry or quarantined. Not required for cats.",
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
      title: "No cabin entry to Dubai — cargo only",
      detail: "Every pet entering Dubai must arrive as manifested cargo, regardless of airline. The only cabin entry to the UAE is via Etihad to Abu Dhabi (under 8 kg), then ground transport (~90 min) to Dubai. If your trip is one-way to Dubai, plan cargo + a customs broker like Dubai Kennels & Cattery.",
    });
    warnings.push({
      title: "MOCCAE permit valid only 30 days",
      detail: "Apply to the Ministry of Climate Change and Environment (MOCCAE) for an import permit — it's only valid for 30 days from issue, so time it carefully. Several breeds are banned entirely (Pit Bull, Rottweiler, Dogo Argentino, Tosa, Mastiff types, wolf-dog hybrids).",
    });
  }

  if (answers.species === "Other small pet") {
    warnings.push({
      title: "Limited airline acceptance",
      detail: "Most U.S. airlines accept only cats and dogs in cabin. Frontier and a few others allow rabbits, guinea pigs, hamsters, and small household birds. Check directly with your airline before booking — and note that many countries restrict or quarantine non-cat/dog imports.",
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
  { id: "intake", label: "Assessment", num: "I" },
  { id: "airlines", label: "Airlines", num: "II" },
  { id: "routes", label: "Routes", num: "III" },
  { id: "destinations", label: "Difficult destinations", num: "IV" },
  { id: "quarantine", label: "Quarantine", num: "⚠" },
  { id: "timeline", label: "Timeline", num: "V" },
  { id: "documents", label: "Paperwork", num: "VI" },
  { id: "tips", label: "Tips", num: "VII" },
  { id: "stories", label: "Stories", num: "✻" },
  { id: "contact", label: "Contact", num: "VIII" },
];

function NavBar({ onStartIntake }) {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    function onScroll() {
      setScrolled(window.scrollY > 60);
    }
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  function go(id) {
    setOpen(false);
    if (id === "top") {
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }
    if (id === "intake") {
      onStartIntake();
      return;
    }
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }

  return (
    <nav
      className={`sticky top-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-stone-50/95 backdrop-blur-md border-b border-stone-300 shadow-sm"
          : "bg-transparent border-b border-transparent"
      }`}
      style={{ backgroundColor: scrolled ? "rgba(250, 246, 237, 0.95)" : "transparent" }}
    >
      <div className="max-w-7xl mx-auto px-6 md:px-12 py-4 flex items-center justify-between">
        <button
          onClick={() => go("top")}
          className="flex items-center gap-2 group"
        >
          <PawPrint className="w-5 h-5 text-stone-700 group-hover:text-amber-700 transition-colors" strokeWidth={1.5} />
          <span className="font-serif italic text-stone-700 group-hover:text-amber-700 transition-colors">
            Pets in Cabin
          </span>
        </button>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-1">
          {NAV_SECTIONS.slice(1).map((s) => (
            <button
              key={s.id}
              onClick={() => go(s.id)}
              className="px-3 py-2 text-sm text-stone-600 hover:text-stone-900 transition-colors relative group"
            >
              <span className="font-serif italic text-stone-400 text-xs mr-1.5">{s.num}.</span>
              {s.label}
              <span className="absolute bottom-1 left-3 right-3 h-px bg-stone-900 scale-x-0 group-hover:scale-x-100 transition-transform origin-left" />
            </button>
          ))}
        </div>

        {/* Mobile toggle */}
        <button
          onClick={() => setOpen(!open)}
          className="md:hidden p-2 text-stone-700"
          aria-label="Menu"
        >
          {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden bg-stone-50 border-t border-stone-300 animate-fadeIn">
          <div className="px-6 py-4 space-y-1">
            {NAV_SECTIONS.slice(1).map((s) => (
              <button
                key={s.id}
                onClick={() => go(s.id)}
                className="w-full text-left px-3 py-3 hover:bg-stone-100 transition-colors flex items-baseline gap-3 border-b border-stone-200 last:border-0"
              >
                <span className="font-serif italic text-stone-400 text-sm w-8">{s.num}.</span>
                <span className="font-serif text-lg text-stone-900">{s.label}</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
}

function Hero({ onStart }) {
  return (
    <header className="relative pt-20 pb-24 px-6 md:px-12 overflow-hidden">
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{
        backgroundImage: "radial-gradient(circle at 25% 20%, #1a1a1a 1px, transparent 1px), radial-gradient(circle at 75% 80%, #1a1a1a 1px, transparent 1px)",
        backgroundSize: "32px 32px"
      }} />

      <div className="relative max-w-5xl mx-auto">
        <div className="flex items-center gap-2 mb-12">
          <span className="text-xs uppercase tracking-widest text-stone-500">By Theo's Mum</span>
          <div className="flex-1 h-px bg-stone-300 mx-3" />
          <span className="text-xs uppercase tracking-widest text-stone-500">Vol. I · 2026</span>
        </div>

        <h1 className="font-serif text-6xl md:text-8xl leading-[0.95] text-stone-900 mb-8">
          A field guide to flying<br />
          <span className="italic text-stone-600">with your pet</span>,<br />
          in the cabin.
        </h1>

        <p className="font-serif text-xl md:text-2xl text-stone-700 max-w-2xl leading-relaxed mb-10">
          Every airline has different rules. Every country has different paperwork. We sort through it so you and your animal arrive together — calm, prepared, and on the same flight.
        </p>

        <button
          onClick={onStart}
          className="group inline-flex items-center gap-3 bg-stone-900 text-cream-50 px-8 py-4 hover:bg-amber-700 transition-colors duration-300"
          style={{ color: "#faf6ed" }}
        >
          <span className="uppercase tracking-widest text-sm font-medium">Start the assessment</span>
          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" strokeWidth={2} />
        </button>

        <div className="grid grid-cols-3 gap-8 mt-20 pt-10 border-t border-stone-300">
          {[
            { num: "07", label: "Quick questions" },
            { num: "21", label: "Airlines compared" },
            { num: "10", label: "Tricky destinations" },
          ].map((s, i) => (
            <div key={i}>
              <div className="font-serif text-5xl text-stone-800">{s.num}</div>
              <div className="text-xs uppercase tracking-widest text-stone-500 mt-2">{s.label}</div>
            </div>
          ))}
        </div>

        <div className="mt-16 pt-10 border-t border-stone-300">
          <div className="text-xs uppercase tracking-widest text-stone-500 mb-6">Routes Theo and I have actually flown</div>
          <div className="flex flex-wrap items-center gap-x-6 gap-y-4 font-serif text-stone-800">
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
          <p className="font-serif italic text-stone-500 text-sm mt-5 max-w-2xl leading-relaxed">
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

  function pick(option) {
    setAnswers({ ...answers, [q.id]: option });
  }

  function next() {
    if (isLast) onComplete();
    else setStep(step + 1);
  }

  return (
    <section id="intake" className="py-20 px-6 md:px-12 bg-stone-100 border-y border-stone-300">
      <div className="max-w-3xl mx-auto">
        <SectionLabel num="I.">Intake</SectionLabel>

        <div className="flex items-center gap-2 mb-10">
          {QUESTIONS.map((_, i) => (
            <div
              key={i}
              className={`h-0.5 flex-1 transition-all duration-500 ${
                i < step ? "bg-stone-900" : i === step ? "bg-amber-700" : "bg-stone-300"
              }`}
            />
          ))}
        </div>

        <div className="text-xs uppercase tracking-widest text-stone-500 mb-3">
          Question {step + 1} of {QUESTIONS.length}
        </div>

        <h2 className="font-serif text-4xl md:text-5xl text-stone-900 leading-tight mb-4">
          {q.label}
        </h2>

        {q.helper && (
          <p className="text-stone-600 italic mb-8 max-w-xl">{q.helper}</p>
        )}

        <div className="grid gap-3 mb-12 mt-8">
          {q.options.map((opt) => {
            const selected = current === opt;
            return (
              <button
                key={opt}
                onClick={() => pick(opt)}
                className={`group text-left px-6 py-5 border transition-all duration-200 flex items-center justify-between ${
                  selected
                    ? "border-stone-900 bg-stone-900 text-stone-50"
                    : "border-stone-300 bg-white hover:border-stone-900 hover:-translate-y-0.5"
                }`}
              >
                <span className="font-serif text-xl">{opt}</span>
                {selected && <Check className="w-5 h-5" strokeWidth={1.5} />}
              </button>
            );
          })}
        </div>

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
            disabled={!current}
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
  const hasFlags = result.flags.length > 0;

  return (
    <section className="py-20 px-6 md:px-12">
      <div className="max-w-4xl mx-auto">
        <SectionLabel num="II.">Your assessment</SectionLabel>

        <div className="bg-stone-50 border border-stone-300 p-8 md:p-12 mb-12">
          <div className="flex items-start justify-between gap-6 mb-8 pb-8 border-b border-stone-300">
            <div>
              <div className="text-xs uppercase tracking-widest text-stone-500 mb-2">Your trip</div>
              <div className="font-serif text-2xl text-stone-900">
                {answers.species} · {answers.weight} · {answers.destination}
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

          {hasFlags && (
            <div className="mb-8">
              <div className="flex items-center gap-3 mb-5">
                <AlertTriangle className="w-5 h-5 text-red-700" strokeWidth={1.75} />
                <h3 className="uppercase tracking-widest text-xs text-red-700 font-medium">
                  Hold on — address these first
                </h3>
              </div>
              <div className="space-y-5">
                {result.flags.map((f, i) => (
                  <div key={i} className="border-l-2 border-red-700 pl-5 py-1">
                    <div className="font-serif text-xl text-stone-900 mb-1">{f.title}</div>
                    <p className="text-stone-700 leading-relaxed">{f.detail}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {result.warnings.length > 0 && (
            <div className="mb-8">
              <div className="flex items-center gap-3 mb-5">
                <Info className="w-5 h-5 text-amber-700" strokeWidth={1.75} />
                <h3 className="uppercase tracking-widest text-xs text-amber-700 font-medium">
                  Worth knowing
                </h3>
              </div>
              <div className="space-y-5">
                {result.warnings.map((w, i) => (
                  <div key={i} className="border-l-2 border-amber-700 pl-5 py-1">
                    <div className="font-serif text-xl text-stone-900 mb-1">{w.title}</div>
                    <p className="text-stone-700 leading-relaxed">{w.detail}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {result.ok.length > 0 && (
            <div>
              <div className="flex items-center gap-3 mb-5">
                <Check className="w-5 h-5 text-emerald-700" strokeWidth={1.75} />
                <h3 className="uppercase tracking-widest text-xs text-emerald-700 font-medium">
                  Looking good
                </h3>
              </div>
              <ul className="space-y-2">
                {result.ok.map((o, i) => (
                  <li key={i} className="text-stone-700 leading-relaxed">— {o}</li>
                ))}
              </ul>
            </div>
          )}
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
    headline: "Same cabin ban as the UK.",
    rule: "Ireland follows similar rules to the UK — no pets in cabin on commercial flights into the country. Pets must arrive via approved cargo or via approved sea routes. Tapeworm treatment is required for dogs.",
    workarounds: [
      {
        title: "Fly to Paris, ferry from Cherbourg",
        icon: <Ship className="w-4 h-4" strokeWidth={1.75} />,
        body: "Same logic as the UK pivot: fly cabin into a continental EU airport, drive to a French port, and take a pet-friendly ferry directly to Rosslare or Dublin. Brittany Ferries and Irish Ferries both run this route with pet-friendly cabins.",
        cost: "Ferry: €60–€250 per pet.",
      },
      {
        title: "Cargo from a U.S. hub",
        icon: <Plane className="w-4 h-4" strokeWidth={1.75} />,
        body: "Aer Lingus and a few partner airlines accept pets as cargo direct from select U.S. cities. Less comfortable than the ferry route, but faster.",
        cost: "$1,200–$3,000 depending on size.",
      },
    ],
    paperwork: "ISO microchip, rabies vaccine ≥21 days old, EU Animal Health Certificate, tapeworm treatment 24–120 hours pre-arrival.",
  },
  {
    id: "india",
    flag: "🇮🇳",
    name: "India",
    headline: "Cabin to/from India — yes, but route choice matters.",
    rule: "India is one of the few major destinations where you CAN fly your pet in cabin internationally — but not on every route. Air India accepts pets in cabin on domestic India routes and many international routes EXCEPT direct flights to/from the USA, Canada, UK, and Australia (those are cargo-only). To fly India ↔ USA in cabin, you'll need a stopover via a European hub. Permits apply for entering India.",
    workarounds: [
      {
        title: "India → USA in cabin: 5 European-hub options",
        icon: <Plane className="w-4 h-4" strokeWidth={1.75} />,
        body: "Direct India ↔ USA cabin doesn't exist on any airline. But cabin via Europe works on five carriers: Lufthansa via Frankfurt, KLM via Amsterdam, Air France via Paris, SWISS via Zurich, and LOT Polish via Warsaw. ALL of these accept cabin pets under 8 kg combined on BOTH the India leg and the US-bound leg. Book as a single through-ticket so the airline manages the connection. Allow 3+ hours at the European hub.",
        cost: "Two-leg cabin fees combined: $200–$500. LOT Polish is the cheapest (€70 to USA).",
      },
      {
        title: "Air India 'Paws on Board' — the routes it works on",
        icon: <Plane className="w-4 h-4" strokeWidth={1.75} />,
        body: "Air India cabin is allowed on: domestic India, India ↔ Europe (Frankfurt, Paris, Amsterdam, etc.), India ↔ Asia (Singapore, Hong Kong, Thailand), and outbound FROM UAE to many destinations. Combined pet + carrier max 10 kg. Book via customer support 48 hours before, with vaccination certificates ready.",
        cost: "$140 short-haul intl / $160 to Europe / ₹7,500 domestic.",
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
];

function DifficultDestinations() {
  const [active, setActive] = useState("uk");
  const dest = DESTINATIONS.find((d) => d.id === active);

  return (
    <section id="destinations" className="py-20 px-6 md:px-12 bg-stone-100 border-t border-stone-300">
      <div className="max-w-6xl mx-auto">
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
  ];

  const filteredAirlines = filter === "all"
    ? AIRLINES
    : AIRLINES.filter((a) => a.tags && a.tags.includes(filter));

  return (
    <section id="airlines" className="py-20 px-6 md:px-12 bg-stone-100 border-y border-stone-300">
      <div className="max-w-6xl mx-auto">
        <SectionLabel num="III.">Airline policies</SectionLabel>

        <h2 className="font-serif text-5xl text-stone-900 mb-4 max-w-3xl">
          The twenty-one carriers most pet owners book.
        </h2>
        <p className="font-serif italic text-stone-600 text-lg mb-8 max-w-2xl">
          Tap any airline to see fees, weight rules, carrier dimensions, and the fine print most travelers miss.
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
                    <h3 className="font-serif text-2xl text-stone-900">{a.name}</h3>
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
                  </div>
                  {a.originAllowed && (() => {
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
                          className={`inline-flex items-center gap-0.5 ${isYes ? "text-emerald-700" : "text-stone-400 line-through"}`}
                          title={`${isYes ? "Cabin allowed" : "Cabin not allowed"} ${direction} ${c.label}`}
                        >
                          <span className="text-lg leading-none">{c.flag}</span>
                          <span className="font-medium text-xs">{isYes ? "✓" : "✗"}</span>
                        </span>
                      );
                    };
                    return (
                      <div className="space-y-2 mb-3 pb-3 border-b border-stone-200">
                        <div className="flex items-start gap-x-2">
                          <span className="text-[10px] uppercase tracking-widest text-stone-500 font-medium min-w-[56px] flex-shrink-0 pt-1">Cabin from:</span>
                          <div className="flex flex-wrap gap-x-2.5 gap-y-1 flex-1">
                            {COUNTRIES.map((c) => renderFlag(c, a.originAllowed, "from"))}
                          </div>
                        </div>
                        {a.destinationAllowed && (
                          <div className="flex items-start gap-x-2">
                            <span className="text-[10px] uppercase tracking-widest text-stone-500 font-medium min-w-[56px] flex-shrink-0 pt-1">Cabin to:</span>
                            <div className="flex flex-wrap gap-x-2.5 gap-y-1 flex-1">
                              {COUNTRIES.map((c) => renderFlag(c, a.destinationAllowed, "to"))}
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })()}
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

        <ChecklistDownload />

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
  const [route, setRoute] = useState("generic");

  function openPrintable() {
    const data = CHECKLIST_DATA[route];
    if (!data) return;

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
  .brand { display: flex; align-items: center; gap: 8px; margin-bottom: 40px; padding-bottom: 20px; border-bottom: 1px solid #d6d3d1; }
  .brand span { font-family: 'Fraunces', serif; font-style: italic; color: #57534e; }
  .brand small { margin-left: auto; font-size: 11px; letter-spacing: 0.25em; text-transform: uppercase; color: #78716c; }
  h1 { font-family: 'Fraunces', serif; font-size: 42px; line-height: 1.1; margin-bottom: 16px; color: #1c1917; }
  h1 em { color: #78716c; }
  .subtitle { font-family: 'Fraunces', serif; font-style: italic; color: #78716c; font-size: 16px; margin-bottom: 50px; }
  h2 { font-family: 'Fraunces', serif; font-size: 22px; color: #1c1917; margin: 36px 0 16px; padding-bottom: 10px; border-bottom: 1px solid #e7e5e4; }
  ul { list-style: none; }
  li { display: flex; align-items: flex-start; gap: 14px; padding: 10px 0; border-bottom: 1px dashed #e7e5e4; }
  li:last-child { border-bottom: none; }
  .check { display: inline-block; width: 22px; height: 22px; border: 2px solid #44403c; border-radius: 4px; flex-shrink: 0; margin-top: 2px; }
  .item { flex: 1; }
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
      <span>🐾 Pets in Cabin</span>
      <small>By Theo's Mum</small>
    </div>
    <h1>${data.title.replace(/checklist/i, '<em>checklist</em>')}</h1>
    <p class="subtitle">Print this, stick it to the fridge, tick things off as you go. Generated from petsincabin.com.</p>
    ${data.sections.map(s => `
      <h2>${s.title}</h2>
      <ul>
        ${s.items.map(item => `<li><span class="check"></span><span class="item">${item}</span></li>`).join('')}
      </ul>
    `).join('')}
    <footer>This checklist is a starting point, not a substitute for professional advice. Always confirm with your airline, vet, and destination country before flying. Last reviewed May 2026.</footer>
  </div>
</body>
</html>`;

    const blob = new Blob([html], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    window.open(url, "_blank");
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
            Tailored to your route. Print it, tick things off, take it on the plane. Opens in a new tab — use your browser's print or save-as-PDF.
          </p>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <label className="text-xs uppercase tracking-widest text-stone-400 mr-2">Route:</label>
        <div className="flex flex-wrap gap-2">
          {[
            { id: "generic", label: "Universal" },
            { id: "uk", label: "🇬🇧 UK in/out" },
            { id: "usa", label: "🇺🇸 USA in/out" },
            { id: "uae", label: "🇦🇪 UAE in/out" },
            { id: "canada", label: "🇨🇦 Canada in/out" },
            { id: "mexico", label: "🇲🇽 Mexico in/out" },
            { id: "dominican_republic", label: "🇩🇴 Dominican Rep." },
            { id: "jamaica", label: "🇯🇲 Jamaica" },
            { id: "bahamas", label: "🇧🇸 Bahamas" },
            { id: "europe", label: "🇪🇺 Europe in/out" },
            { id: "india", label: "🇮🇳 India in/out" },
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
        <button
          onClick={openPrintable}
          className="ml-auto inline-flex items-center gap-2 bg-amber-600 hover:bg-amber-500 text-white px-5 py-2.5 transition-colors"
        >
          <span className="uppercase tracking-widest text-xs font-medium">Open & print</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      {(route === "dominican_republic" || route === "jamaica" || route === "bahamas") && (
        <div className="mt-5 bg-stone-800 border-l-2 border-amber-500 px-4 py-3 text-sm text-stone-300 leading-relaxed">
          <strong className="text-amber-300 not-italic">Note on Caribbean coverage:</strong> we've built checklists for three of the most-asked Caribbean destinations (Bahamas, Jamaica, Dominican Republic). The Caribbean has 25+ countries with varying rules — if yours isn't listed, always check the destination's official Department of Agriculture site and confirm with your airline directly.
        </div>
      )}
    </div>
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
    { id: "dubai", label: "Dubai / UAE", flag: "🇦🇪" },
    { id: "caribbean", label: "Caribbean", flag: "🌴" },
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
    "us": ["New York", "Miami", "Chicago", "Los Angeles", "Boston", "San Francisco", "Washington", "(JFK)", "(MIA)", "(ORD)", "(LAX)", "(BOS)", "(SFO)", "(IAD)", "(EWR)", "USA"],
    "india": ["Delhi", "Mumbai", "Bangalore", "Chennai", "(DEL)", "(BOM)", "(BLR)", "(MAA)"],
    "europe": ["Paris", "Amsterdam", "Frankfurt", "Zurich", "Warsaw", "Lisbon", "Porto", "Rome", "Milan", "Madrid", "Barcelona", "Istanbul", "(CDG)", "(AMS)", "(FRA)", "(ZRH)", "(WAW)", "(LIS)", "(OPO)", "(FCO)", "(MXP)", "(MAD)", "(BCN)", "(IST)"],
    "canada": ["Toronto", "Montreal", "Vancouver", "(YYZ)", "(YUL)", "(YVR)"],
    "dubai": ["Dubai", "Abu Dhabi", "(DXB)", "(AUH)", "UAE"],
    "caribbean": ["Nassau", "Punta Cana", "Santo Domingo", "Montego Bay", "Kingston", "Bridgetown", "Cayman", "Aruba", "Curacao", "San Juan", "(NAS)", "(PUJ)", "(SDQ)", "(MBJ)", "(KIN)", "(BGI)", "(GCM)", "(AUA)", "(CUR)", "(SJU)", "Bahamas", "Jamaica", "Dominican Republic", "Cayman Islands"],
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
  const filteredWorkarounds = applyFilter(WORKAROUND_ROUTES_TABLE, true);
  const totalFiltered = filteredDirect.length + filteredWorkarounds.length;
  const totalAll = DIRECT_ROUTES.length + WORKAROUND_ROUTES_TABLE.length;

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
                <>No direct cabin flights INTO the UK exist on any airline (UK government rule). See workaround routes below — typically fly cabin into Paris/Amsterdam, then Eurotunnel.</>
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
            Multi-leg journeys where cabin works on each leg via a hub. Often the only way to fly cabin on a long-haul route — and an overnight stop is recommended for journeys over 7 hours.
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
                          <div className="text-amber-700 font-medium text-sm uppercase tracking-widest">
                            Total: {r.duration}
                          </div>
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
          When direct flights don't allow cabin pets, smart multi-leg routes do. Here are the most-used workaround journeys, with airlines, times, and fees.
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
              body: "Window seats give the under-seat space slightly more depth on most aircraft, and prevent your pet being kicked or jostled by passing carts. The middle seat means more disturbance every time the window passenger gets up. Avoid bulkhead and exit rows — pets aren't allowed there.",
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
      <div className="max-w-6xl mx-auto">
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
        <div className="flex items-center gap-2 mb-8">
          <PawPrint className="w-5 h-5 text-amber-500" strokeWidth={1.5} />
          <span className="font-serif italic text-stone-300">Pets in Cabin · A guide by Theo's Mum</span>
        </div>
        <p className="font-serif text-stone-400 max-w-2xl mb-8 leading-relaxed">
          A reference, not a substitute for veterinary advice or the airline's official policy. Rules change frequently; always confirm directly with your airline and the receiving country before you fly.
        </p>
        <div className="flex flex-wrap gap-x-8 gap-y-3 text-xs uppercase tracking-widest text-stone-500">
          <span>Edited by Theo's Mum</span>
          <span>·</span>
          <span>Last reviewed · May 2026</span>
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

  function startIntake() {
    setPhase("intake");
    setStep(0);
    setTimeout(() => {
      document.getElementById("intake-anchor")?.scrollIntoView({ behavior: "smooth" });
    }, 50);
  }

  function completeIntake() {
    setPhase("results");
    setTimeout(() => {
      document.getElementById("results-anchor")?.scrollIntoView({ behavior: "smooth" });
    }, 50);
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

      <AirlineGrid />
      <Routes />
      <DifficultDestinations />
      <QuarantineWatch />
      <Checklist />
      <Documents />
      <Tips />
      <Stories />
      <Contact />
      <Footer />
    </div>
  );
}
