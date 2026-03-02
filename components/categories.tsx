import type { z } from "zod";
import type { CollectionsResponseSchema } from "@/lib/collections";
import HeroCarousel from "./carousel";

type Collections = z.infer<typeof CollectionsResponseSchema>;

const categories = ({ collections }: { collections: Collections }) => {
  return (
    <div
      id="categories"
      className="bg-white relative overflow-hidden min-h-[600px] md:min-h-[800px] lg:h-[900px] z-30"
    >
      <div className="flex flex-col justify-center items-end my-8 md:my-10 lg:my-[40px] px-4 md:px-15">
        <p className="text-[10px] font-medium text-[#9A9A9A] tracking-widest uppercase text-right">
          [Shop By Intention]
        </p>
        <h1 className="text-2xl md:text-3xl lg:text-4xl font-medium w-full max-w-2xl text-right mt-4">
          Shop By Intention
        </h1>
        <p className="text-base md:text-lg text-[#9A9A9A] w-full max-w-[34rem] text-right mt-4">
          Pieces defined by natural beauty, vibrant energy, and a refined sense
          of timeless elegance.
        </p>
      </div>
      <HeroCarousel collections={collections} />
    </div>
  );
};

export default categories;
