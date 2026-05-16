import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        <meta charSet="utf-8" />
        <meta name="google-site-verification" content="1bi6cDCuTHmlc1CJUSk4Z24beCQjICPtH_LlJUwv5Zg" />

        {/* Primary SEO */}
        <meta name="description" content="Travelling with pets? A real-world guide to flying with your dog or cat in the cabin. Pets in cabin policies for every major airline, country paperwork, cabin routes and the workarounds that actually work — for the UK, USA, Europe, India, Canada, the UAE and beyond. By Theo's Mum, who's flown it." />
        <meta name="keywords" content="travelling with pets, travel with pets, pet flight, flying with animals, pets in cabin, pet in cabin, fly with dog in cabin, fly with cat in cabin, airline pet policy, pet travel guide, fly pet to UK, fly pet to USA, fly pet to India, pet to Europe, Dubai pet import, pet to Canada, in-cabin pet, dog flight, cat flight, pet relocation, pet quarantine countries" />
        <meta name="author" content="Theo's Mum" />
        <meta name="robots" content="index, follow, max-image-preview:large" />
        {/* NOTE: canonical tag is intentionally NOT here. _document.js wraps
            every page, so a canonical here would tell Google that /privacy
            (and every other page) is just an alternate of the homepage —
            that triggers the "Alternate page with proper canonical tag"
            flag and stops those pages indexing in their own right. Each
            page sets its own canonical via next/head instead. */}

        {/* Fonts */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,400;0,9..144,500;0,9..144,600;1,9..144,400;1,9..144,500&family=Inter:wght@400;500;600&display=swap" rel="stylesheet" />

        {/* Open Graph (for Facebook, LinkedIn, WhatsApp shares) */}
        <meta property="og:site_name" content="Pets in Cabin" />
        <meta property="og:title" content="Travelling with Pets: Flying With Your Dog or Cat in the Cabin" />
        <meta property="og:description" content="A real-world guide to flying with your dog or cat in the cabin. Pets in cabin policies for every major airline, country paperwork, and the workarounds that actually work — UK, USA, Europe, India, Canada and beyond. By Theo's Mum, who's done it." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://www.petsincabin.com" />
        <meta property="og:locale" content="en_GB" />

        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Travelling with Pets: Flying With Your Dog or Cat in the Cabin" />
        <meta name="twitter:description" content="Airline pet policies, country paperwork, and the workarounds that actually work — by Theo's Mum, who's flown it." />

        {/* Favicon */}
        <link rel="icon" href="/favicon.ico" />

        {/* Google Consent Mode v2 — defaults set BEFORE the Google tag loads.
            We operate under the UK DUAA 2025 statistical analytics exemption
            (5 Feb 2026), so analytics_storage is GRANTED by default — no
            upfront consent banner needed for aggregate site-improvement
            analytics. Ad-related signals are denied by default as a defensive
            posture (we don't run ads, but this confirms it to Google's tag).

            If a visitor has clicked the opt-out button on /privacy, the
            AnalyticsOptOutListener component will flip analytics_storage
            to denied on page load. Until then GA collects normally. */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('consent', 'default', {
                ad_storage: 'denied',
                analytics_storage: 'granted',
                ad_user_data: 'denied',
                ad_personalization: 'denied',
                functionality_storage: 'granted',
                security_storage: 'granted'
              });
              // Honour an existing opt-out BEFORE gtag.js loads.
              try {
                if (localStorage.getItem('pic_analytics_optout') === 'true') {
                  gtag('consent', 'update', {
                    analytics_storage: 'denied'
                  });
                }
              } catch (e) {}
            `,
          }}
        />

        {/* Google Analytics (GA4) — free, unlimited custom events.
            Measurement ID: G-R4NVMW686F (live).
            Pageviews are tracked automatically. Custom events (like the
            "petition_click" event fired from the UK petition CTA in
            PetTravel.jsx) show up under Reports → Engagement → Events.

            Configuration notes (verify in GA4 admin → Data Streams):
            - Google Signals: OFF (required for DUAA statistical exemption)
            - Data sharing with other Google products: OFF
            - No Google Ads linking, no remarketing, no audience export
            - IP anonymisation: ON (anonymize_ip below) */}
        <script async src="https://www.googletagmanager.com/gtag/js?id=G-R4NVMW686F"></script>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              gtag('js', new Date());
              gtag('config', 'G-R4NVMW686F', { anonymize_ip: true });
            `,
          }}
        />

        {/* Structured data for rich snippets in Google */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebSite",
              "name": "Pets in Cabin",
              "alternateName": "Pet in Cabin Guide",
              "url": "https://www.petsincabin.com",
              "description": "A real-world guide to travelling with pets and flying with animals in the cabin. Airline pet policies, country paperwork, cabin routes, and workarounds for the UK, USA, Europe, India, Canada, the UAE and beyond.",
              "author": {
                "@type": "Person",
                "name": "Theo's Mum"
              },
              "publisher": {
                "@type": "Person",
                "name": "Theo's Mum"
              }
            })
          }}
        />

        {/* FAQ structured data — can produce rich-snippet answer boxes in Google search */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "FAQPage",
              "mainEntity": [
                {
                  "@type": "Question",
                  "name": "Can I fly with my dog or cat in the cabin?",
                  "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Yes, on many airlines — if your pet plus its carrier is under the airline's combined weight limit (usually 8–10 kg) and fits in a soft carrier under the seat. Limits, fees and allowed routes vary by airline, so always check the specific carrier and route before booking."
                  }
                },
                {
                  "@type": "Question",
                  "name": "Can I fly with my pet in the cabin to the UK?",
                  "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "No commercial airline allows pets in the cabin on flights INTO the UK — it is a UK government rule, not the airline's choice. Pets must enter as manifested cargo, or you can use the common workaround: fly cabin into continental Europe (Paris, Amsterdam, Frankfurt) then cross to the UK by Eurotunnel or ferry with your pet beside you."
                  }
                },
                {
                  "@type": "Question",
                  "name": "Which airlines allow pets in the cabin?",
                  "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Many do, including Delta, United, American, Alaska, JetBlue, Air Canada, Air France, KLM, Lufthansa, SWISS, TAP Air Portugal, Iberia, ITA Airways, Turkish Airlines, Air India and Etihad (to and from Abu Dhabi). British Airways, Qatar Airways and Emirates do not — they are cargo-only for pets."
                  }
                },
                {
                  "@type": "Question",
                  "name": "How much does it cost to fly with a pet in the cabin?",
                  "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Typically USD 95–150 each way on domestic and short-haul routes, and USD 100–250 on long-haul international routes, depending on the airline. Some carriers charge per flight segment, so connecting journeys cost more."
                  }
                }
              ]
            })
          }}
        />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
