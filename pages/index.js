import Head from "next/head";
import PetTravel from "../components/PetTravel";

export default function Home() {
  return (
    <>
      <Head>
        <title>Travelling with Pets: Flying With Your Dog or Cat in the Cabin | Pets in Cabin</title>
        {/* This page's own canonical — the homepage is canonical to itself. */}
        <link rel="canonical" href="https://petsincabin.com" />
      </Head>
      <PetTravel />
    </>
  );
}
