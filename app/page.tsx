import { getAnnouncement } from "@/lib/announcement";
import { ReactLenis } from "lenis/react";
import Hero from "@/components/hero";
import SignaturePicks from "@/components/signaturepicks";
import Categories from "@/components/categories";

export default async function Home() {
  const data = await getAnnouncement();

  return (
    <>
      <ReactLenis root />

      <Hero data={data} />
      <SignaturePicks data={data} />
      <Categories data={data} />
    </>
  );
}
