"use client";

import Image from "next/image";

const products = [
  {
    key: 1,
    label: "Chrysoberyl Cats Eye",
    description: " - Best for Anxiety",
    price: "R450,00",
    previous_price: "",
    image: "/signaturepicks/1.png",
  },
  {
    key: 2,
    label: "Crystal trees",
    description: " - Protection and grounding",
    price: "R350,00",
    previous_price: "R650,00",
    image: "/signaturepicks/2.png",
  },
  {
    key: 3,
    label: "Blue Calcite Stand",
    description: " - For LOVE AND RELATIONSHIPS",
    price: "R250,00",
    previous_price: "",
    image: "/signaturepicks/3.png",
  },
];

export default function SignaturePicks({ data }: { data: string }) {
  return (
    <div
      id="signature-picks"
      className="relative z-20 bg-white "
    >
      <div className="pt-[40px] pb-[40px] flex-col justify-center items-center">
        <div className="flex justify-between items-center mx-[73px]">
          <h1 className="text-black text-[50px] font-semibold w-[340px]">Our Signature Crystal Picks</h1>
          <p className="text-black text-[20px] text-end font-medium">Pieces defined by natural beauty, vibrant<br/> energy, and a refined sense of timeless elegance.</p>
        </div>
        <div className="flex items-center justify-center py-4 mt-[40px] gap-22 w-full">
          {products.map((product, index) => (
            <div className="flex flex-col" key={product.key}>
              <Image
                key={index}
                width={400}
                height={543}
                alt={product.label}
                src={product.image}
                />
                <div className="flex items-center gap-1 uppercase">
                  <h2 className="text-black text-[18px] font-semibold mt-4">{product.label}</h2>
                  <p className="text-black text-[14px] font-regular mt-4 ">{product.description}</p>
                </div>
                <div className="flex items-center gap-3">
                  <h2 className="text-black text-[24px] font-bold mt-4">{product.price}</h2>
                  {product.previous_price && (
                    <h3 className="text-gray-500 text-[16px] font-medium line-through mt-4">{product.previous_price}</h3>
                  )}
                </div>

            </div>
          ))}
        </div>
      </div>
    </div>
  );
}