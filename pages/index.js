import Head from "next/head";
import PetTravel from "../components/PetTravel";

export default function Home() {
  return (
    <>
      <Head>
        <title>Pets in Cabin — A guide by Theo's Mum</title>
      </Head>
      <PetTravel />
    </>
  );
}
