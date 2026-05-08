import { useState, useMemo, useEffect } from "react";
import { PawPrint, Plane, FileCheck, AlertTriangle, ArrowRight, ArrowLeft, RotateCcw, Check, Info, Luggage, Stethoscope, ScrollText, Sparkles, Ship, Map as MapIcon, Train, Compass, Menu, X } from "lucide-react";

// ---------- DATA ----------

const AIRLINES = [
  {
    name: "Alaska Airlines",
    fee: "$100 each way",
    weight: "No stated weight limit; pet must fit comfortably in carrier",
    carrier: "Soft: 17 × 11 × 9.5 in. Hard: 17 × 11 × 7.5 in.",
    notes: "One of the more flexible policies. Two pets per carrier allowed if same species and small. Cabin pets allowed on most flights including some international routes.",
    intl: "Yes (limited routes)",
    verified: "May 2026",
    link: "https://www.alaskaair.com/content/travel-info/policies/pets-traveling-with-pets",
  },
  {
    name: "American Airlines",
    fee: "$150 each way",
    weight: "Pet + carrier must fit comfortably under seat (no published weight)",
    carrier: "Soft (recommended): 18 × 11 × 11 in",
    notes: "Cabin only for general public. Not allowed in first/business on some aircraft. Restrictions to/from PHX, TUS, LAS, PSP May–Sept.",
    intl: "Limited",
    verified: "May 2026",
    link: "https://www.aa.com/i18n/travel-info/special-assistance/traveling-with-pets.jsp",
  },
  {
    name: "Delta",
    fee: "$150 domestic / $200 international",
    weight: "No stated weight; must fit under seat",
    carrier: "Soft-sided with 3+ ventilation panels (4 international). ~18 × 11 × 11 in",
    notes: "Pets count as your carry-on. Must be at least 10 weeks old for domestic, 16 weeks for U.S. international.",
    intl: "Yes",
    verified: "May 2026",
    link: "https://www.delta.com/us/en/pet-travel/overview",
  },
  {
    name: "United",
    fee: "$150 each way",
    weight: "Must fit under seat in carrier",
    carrier: "Hard: 17.5 × 12 × 7.5 in. Soft: 18 × 11 × 11 in",
    notes: "Pets in cabin only (PetSafe cargo discontinued for general public). Reserve early — limited spots per flight.",
    intl: "Yes",
    verified: "May 2026",
    link: "https://www.united.com/en-us/travel-information/special-needs/travel-with-pets",
  },
  {
    name: "JetBlue",
    fee: "$125 each way",
    weight: "Pet + carrier max 20 lb (strictly enforced)",
    carrier: "17 × 12.5 × 8.5 in",
    notes: "JetPaws program. Combined weight limit is one of the strictest in the U.S. Two pets per carrier allowed if same species.",
    intl: "Yes (limited)",
    verified: "May 2026",
    link: "https://www.jetblue.com/traveling-together/traveling-with-pets",
  },
  {
    name: "Southwest",
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
    fee: "$125 each way",
    weight: "Pet + carrier max 40 lb",
    carrier: "18 × 14 × 9 in",
    notes: "Domestic and Puerto Rico/USVI. Pets must be at least 8 weeks old.",
    intl: "Limited",
    verified: "May 2026",
    link: "https://customersupport.spirit.com/en-US/category/article/KA-01066",
  },
  {
    name: "Frontier",
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
    fee: "$35 inter-island / $125 mainland–Hawaii",
    weight: "25 lb combined (pet + carrier)",
    carrier: "Soft: 17 × 11 × 9.5 in",
    notes: "No in-cabin pets on international flights. Hawaii has its own quarantine/import program — check separately.",
    intl: "No (in-cabin)",
    verified: "May 2026",
    link: "https://www.hawaiianairlines.com/our-services/special-assistance/traveling-with-pets",
  },
  {
    name: "Air Canada",
    fee: "CAD $50–$59 domestic / $100–$118 intl",
    weight: "Pet + carrier max 22 lb (10 kg)",
    carrier: "Soft: 21.5 × 15.5 × 9 in (varies by aircraft, sometimes smaller)",
    notes: "Aircraft-specific carrier sizes — confirm at booking. Combined weight strictly enforced.",
    intl: "Yes",
    verified: "May 2026",
    link: "https://www.aircanada.com/us/en/aco/home/plan/special-assistance/pets.html",
  },
  {
    name: "Air France / KLM",
    fee: "~€75–€200 depending on route",
    weight: "Pet + carrier max 8 kg (17.6 lb)",
    carrier: "46 × 28 × 24 cm (~18 × 11 × 9 in), soft-sided only",
    notes: "Strict EU rules. Not allowed in business on intercontinental. Snub-nosed breed restrictions apply.",
    intl: "Yes",
    verified: "May 2026",
    link: "https://www.airfrance.us/information/passagers/animaux",
  },
  {
    name: "Lufthansa",
    fee: "€70–€110 in Europe / €110–€300 long-haul",
    weight: "Pet + carrier max 8 kg (17.6 lb)",
    carrier: "55 × 40 × 23 cm (~21.7 × 15.7 × 9 in)",
    notes: "Slightly larger carrier allowance than Air France. No pets in cabin on flights to/from UK.",
    intl: "Yes",
    verified: "May 2026",
    link: "https://www.lufthansa.com/us/en/travelling-with-animals",
  },
  {
    name: "British Airways",
    fee: "—",
    weight: "—",
    carrier: "—",
    notes: "Does NOT allow pets in cabin (assistance dogs only). Pets must travel via IAG Cargo.",
    intl: "Cargo only",
    verified: "May 2026",
    link: "https://www.britishairways.com/en-gb/information/travel-assistance/travelling-with-pets",
  },
];

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
    options: ["Domestic (within the U.S.)", "Hawaii", "Canada / Mexico", "Europe", "Asia / Pacific", "Other international"],
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

  if (answers.destination === "Europe" || answers.destination === "Asia / Pacific" || answers.destination === "Other international") {
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
  { id: "airlines", label: "Airlines", num: "III" },
  { id: "destinations", label: "Destinations", num: "IV" },
  { id: "timeline", label: "Timeline", num: "V" },
  { id: "documents", label: "Paperwork", num: "VI" },
  { id: "tips", label: "Tips", num: "VII" },
  { id: "coming-soon", label: "Coming soon", num: "∞" },
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
            { num: "13", label: "Airlines compared" },
            { num: "06", label: "Tricky destinations" },
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

  return (
    <section id="airlines" className="py-20 px-6 md:px-12 bg-stone-100 border-y border-stone-300">
      <div className="max-w-6xl mx-auto">
        <SectionLabel num="III.">Airline policies</SectionLabel>

        <h2 className="font-serif text-5xl text-stone-900 mb-4 max-w-3xl">
          The thirteen carriers most pet owners book.
        </h2>
        <p className="font-serif italic text-stone-600 text-lg mb-8 max-w-2xl">
          Tap any airline to see fees, weight rules, carrier dimensions, and the fine print most travelers miss.
        </p>

        <div className="bg-white border-l-2 border-rose-400 px-5 py-4 mb-10 max-w-3xl">
          <div className="flex items-start gap-3">
            <Info className="w-5 h-5 text-rose-500 flex-shrink-0 mt-0.5" strokeWidth={1.75} />
            <div>
              <div className="font-serif text-stone-900 mb-1">Each card shows when I last verified it.</div>
              <p className="text-stone-600 text-sm leading-relaxed">
                Airline pet policies change quietly and often. I review every card here once a quarter and link to the official airline page so you can double-check before you book. Spot something out of date? <a href="#contact" className="underline decoration-rose-400 underline-offset-4 hover:text-rose-600 transition-colors">Tell me</a>.
              </p>
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-px bg-stone-300 border border-stone-300">
          {AIRLINES.map((a, i) => {
            const open = expanded === i;
            return (
              <div key={a.name} className="bg-stone-50">
                <button
                  onClick={() => setExpanded(open ? null : i)}
                  className="w-full text-left p-6 hover:bg-white transition-colors"
                >
                  <div className="flex items-baseline justify-between gap-4 mb-2">
                    <h3 className="font-serif text-2xl text-stone-900">{a.name}</h3>
                    <span className="text-xs uppercase tracking-widest text-stone-500">
                      {open ? "Close" : "Read"}
                    </span>
                  </div>
                  <div className="text-stone-600 text-sm">
                    <span className="font-medium text-stone-800">{a.fee}</span>
                    <span className="mx-2 text-stone-400">·</span>
                    <span>{a.intl}</span>
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
        "Research destination country's import requirements",
        "Book your flight and call the airline to reserve a pet spot",
      ],
    },
    {
      title: "Two weeks before",
      icon: <ScrollText className="w-5 h-5" strokeWidth={1.5} />,
      items: [
        "Get your airline-compliant carrier — let your pet sleep in it at home",
        "Practice short car rides in the carrier",
        "Schedule USDA-accredited vet visit for health certificate (if international)",
        "Print and complete the CDC Dog Import Form (for re-entry to U.S.)",
        "Confirm climate / temperature restrictions for your route",
      ],
    },
    {
      title: "The day of",
      icon: <Luggage className="w-5 h-5" strokeWidth={1.5} />,
      items: [
        "Light meal 4 hours before flight; water available until departure",
        "Walk your dog and let your cat use the box right before leaving",
        "Pad the carrier with absorbent puppy pads",
        "Pack: food, collapsible water bowl, leash, waste bags, vet records, comfort item",
        "Arrive 2.5 hours early — pet check-in is in person at the counter",
      ],
    },
    {
      title: "At security & onboard",
      icon: <Plane className="w-5 h-5" strokeWidth={1.5} />,
      items: [
        "TSA: remove your pet from carrier, walk them through (or carry through) the metal detector",
        "Carrier goes through the X-ray machine empty",
        "Once at the gate, keep your pet in the carrier",
        "Stow under the seat in front of you — never the overhead bin",
        "Don't open the carrier mid-flight (FAA rule, not just an airline preference)",
      ],
    },
  ];

  return (
    <section id="timeline" className="py-20 px-6 md:px-12">
      <div className="max-w-5xl mx-auto">
        <SectionLabel num="V.">The timeline</SectionLabel>

        <h2 className="font-serif text-5xl text-stone-900 mb-12 max-w-3xl">
          What to do, and when.
        </h2>

        <div className="grid md:grid-cols-2 gap-8">
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

function Documents() {
  return (
    <section id="documents" className="py-20 px-6 md:px-12 bg-stone-900 text-stone-50">
      <div className="max-w-5xl mx-auto">
        <div className="flex items-baseline gap-3 mb-6">
          <span className="font-serif italic text-stone-500 text-lg">VI.</span>
          <span className="uppercase tracking-[0.25em] text-xs font-medium text-stone-400">Paperwork</span>
          <div className="flex-1 h-px bg-stone-700" />
        </div>

        <h2 className="font-serif text-5xl mb-12 max-w-3xl">
          The documents nobody warned you about.
        </h2>

        <div className="grid md:grid-cols-3 gap-px bg-stone-700">
          {[
            {
              title: "CDC Dog Import Form",
              when: "All dogs entering the U.S.",
              detail: "Required for every dog entering the United States — including U.S. dogs returning home. Fill out online; the receipt is good for six months and multiple entries.",
              link: "cdc.gov/importation/dogs",
            },
            {
              title: "USDA Health Certificate",
              when: "Most international travel",
              detail: "An APHIS Form 7001 or country-specific form, completed by a USDA-accredited vet within 10 days of travel and endorsed by your nearest USDA office.",
              link: "aphis.usda.gov/pet-travel",
            },
            {
              title: "EU Pet Passport / Health Certificate",
              when: "Travel to or through the EU",
              detail: "Requires ISO microchip, rabies vaccine at least 21 days old, completed by USDA vet within 10 days of EU entry. Different from the U.S. health certificate.",
              link: "ec.europa.eu/animals",
            },
            {
              title: "Rabies certificate",
              when: "Almost everywhere",
              detail: "Original (not photocopy) signed by your vet. Should include microchip number, vaccine type, manufacturer, lot number, and expiration date.",
              link: "—",
            },
            {
              title: "Hawaii AQS-279",
              when: "Any pet entering Hawaii",
              detail: "Submitted with FAVN test results, two rabies vaccines, and proof of microchip at least 30 days before arrival for the Direct Airport Release program.",
              link: "hdoa.hawaii.gov",
            },
            {
              title: "Tapeworm treatment record",
              when: "UK, Ireland, Malta, Finland, Norway",
              detail: "Praziquantel administered by a vet 24–120 hours before arrival, recorded in the health certificate. Required for dogs only.",
              link: "—",
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
              body: "Soft-sided carriers compress slightly to fit under tighter seats. Make sure ventilation is on at least three sides. Get one a size smaller than the airline's max — your pet should be able to stand and turn, but a snug carrier travels better.",
            },
            {
              tag: "On the seat",
              title: "Pick a window, not an aisle.",
              body: "Window seats give the under-seat space slightly more depth on most aircraft and prevent your pet from being kicked or rolled-over by passing carts. Avoid bulkhead and exit rows — pets aren't allowed there.",
            },
            {
              tag: "On food",
              title: "Light meal, four hours out.",
              body: "Don't fly your pet hungry, but don't fly them full either. A small meal four hours before departure is the sweet spot. Freeze water in the carrier's water dish so it melts gradually instead of spilling at takeoff.",
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
      <DifficultDestinations />
      <Checklist />
      <Documents />
      <Tips />
      <ComingSoon />
      <Contact />
      <Footer />
    </div>
  );
}
