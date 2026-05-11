import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        <meta charSet="utf-8" />
        <meta name="google-site-verification" content="1bi6cDCuTHmlc1CJUSk4Z24beCQjICPtH_LlJUwv5Zg" />

        {/* Primary SEO */}
        <meta name="description" content="Pet in cabin guide: airline policies, weight limits, carrier sizes, and country paperwork for flying with your dog or cat. Real workarounds (including the UK pet ban) from a pet mum who's flown London-Canada-US-Paris-home." />
        <meta name="keywords" content="pet in cabin, pets in cabin, fly with dog in cabin, fly with cat in cabin, pet travel guide, airline pet policy, fly pet to UK, pet to Hawaii, pet passport, carry on pet, in-cabin pet, dog flight, cat flight, pet to Europe, pet relocation, EU pet health certificate" />
        <meta name="author" content="Theo's Mum" />
        <meta name="robots" content="index, follow, max-image-preview:large" />
        <link rel="canonical" href="https://petsincabin.com" />

        {/* Fonts */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,400;0,9..144,500;0,9..144,600;1,9..144,400;1,9..144,500&family=Inter:wght@400;500;600&display=swap" rel="stylesheet" />

        {/* Open Graph (for Facebook, LinkedIn, WhatsApp shares) */}
        <meta property="og:site_name" content="Pets in Cabin" />
        <meta property="og:title" content="Pets in Cabin — A field guide to flying with your pet, in the cabin" />
        <meta property="og:description" content="Airline policies, country paperwork, and clever workarounds for flying with your dog or cat in the cabin. By a pet mum who's actually done it." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://petsincabin.com" />
        <meta property="og:locale" content="en_GB" />

        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Pets in Cabin — Flying with your pet, made simple" />
        <meta name="twitter:description" content="Real airline policies, country paperwork, and workarounds (including the UK pet ban). By a pet mum who's flown the routes." />

        {/* Favicon */}
        <link rel="icon" href="/favicon.ico" />

        {/* Structured data for rich snippets in Google */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebSite",
              "name": "Pets in Cabin",
              "alternateName": "Pet in Cabin Guide",
              "url": "https://petsincabin.com",
              "description": "A field guide to flying with your pet in the cabin. Airline policies, country paperwork, and workarounds.",
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
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
