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
      </Head>
      <PetTravel />
    </>
  );
}
