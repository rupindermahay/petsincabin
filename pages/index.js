import Head from "next/head";
import PetTravel from "../components/PetTravel";

export default function Home() {
  return (
    <>
      <Head>
        <title>Flying With a Dog or Cat in the Cabin: Airline Policies &amp; Route Planner | Pets in Cabin</title>
        <meta
          name="description"
          content="Which airlines let pets fly in the cabin? Check cabin policies for 30+ airlines, plan your route, build a vet checklist and time the tapeworm window — free, no sign-up."
        />
        {/* This page's own canonical — the homepage is canonical to itself. */}
        <link rel="canonical" href="https://www.petsincabin.com" />
        {/* Per-page Open Graph. _document.js supplies site-wide defaults;
            next/head dedupes by property, so these override them for this
            page only. Without these every page shared the homepage's
            OG identity — which Google was substituting for the page's own
            meta description in search results. */}
        <meta property="og:title" content="Flying With a Dog or Cat in the Cabin" />
        <meta property="og:description" content="Which airlines let pets fly in the cabin? Check cabin policies for 30+ airlines, plan your route, build a vet checklist and time the tapeworm window — free, no sign-up." />
        <meta property="og:url" content="https://www.petsincabin.com" />
        <meta property="og:type" content="website" />
        <meta name="twitter:title" content="Flying With a Dog or Cat in the Cabin" />
        <meta name="twitter:description" content="Which airlines let pets fly in the cabin? Check cabin policies for 30+ airlines, plan your route, build a vet checklist and time the tapeworm window — free, no sign-up." />
      </Head>
      <PetTravel />
    </>
  );
}
