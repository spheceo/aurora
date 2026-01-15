import { api } from "@/lib/orpc";
import { ReactLenis } from "lenis/react";
import SignaturePicks from "@/components/signaturepicks";
import Categories from "@/components/categories";

export default async function Home() {
  const data = await api.announcement();

  return (
    <>
      <ReactLenis root />

      <SignaturePicks data={data} />
      <Categories data={data} />
    </>
  );
}
