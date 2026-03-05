import type { z } from "zod";
import type { CollectionsResponseSchema } from "@/lib/collections";
import HeroCarousel from "./carousel";

type Collections = z.infer<typeof CollectionsResponseSchema>;

const categories = ({ collections }: { collections: Collections }) => {
  return (
    <div
      id="categories"
      className="bg-white relative overflow-hidden z-30"
    >
      <div className="mt-8 mb-3 md:mt-10 md:mb-4 lg:mt-[40px] lg:mb-5 px-4 md:px-15">
        <div className="w-full text-left">
          <h1 className="text-2xl md:text-3xl lg:text-4xl font-medium">
            Shop By Intention
          </h1>
        </div>
      </div>
      <HeroCarousel collections={collections} />
    </div>
  );
};

export default categories;
