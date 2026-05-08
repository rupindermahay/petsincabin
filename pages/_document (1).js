import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        <meta charSet="utf-8" />
        <meta name="google-site-verification" content="1bi6cDCuTHmlc1CJUSk4Z24beCQjICPtH_LlJUwv5Zg" />
        <meta name="description" content="A field guide to flying with your pet in the cabin. Real airline policies, country-by-country paperwork, and the workarounds savvy pet owners use — written by a pet mum who's done it." />
        <meta name="keywords" content="pet in cabin, fly with dog, fly with cat, pet travel, airline pet policy, pet to UK, pet to Hawaii, pet passport, in-cabin pet" />

        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,400;0,9..144,500;0,9..144,600;1,9..144,400;1,9..144,500&family=Inter:wght@400;500;600&display=swap" rel="stylesheet" />

        <meta property="og:title" content="Pets in Cabin — A guide by Theo's Mum" />
        <meta property="og:description" content="Everything you need to know about flying with your pet in the cabin. Airline policies, paperwork, and clever workarounds." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://petsincabin.com" />

        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Pets in Cabin — A guide by Theo's Mum" />
        <meta name="twitter:description" content="Flying with your pet, made simple." />

        <link rel="icon" href="/favicon.ico" />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
