import Image from "next/image";
import Link from "next/link";
import { formatProductPrice } from "@/lib/currency";
import { getProducts } from "@/lib/products";

export default async function SignaturePicks() {
  // Fetch all products
  const allProducts = await getProducts();

  // Filter: has images, not sold out
  const availableProducts = allProducts.filter(
    (product) => product.assets.length > 0 && !product.soldOut,
  );

  // Get 4 random products
  const getRandomProducts = (
    products: typeof availableProducts,
    count: number,
  ) => {
    const shuffled = [...products].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, Math.min(count, shuffled.length));
  };

  const signatureProducts = getRandomProducts(availableProducts, 4);

  return (
    <div
      id="signature-picks"
      className="bg-white py-12 md:py-16 px-4 md:px-15 relative z-20"
    >
      <div className="space-y-12">
        {/* Header */}
        <div className="space-y-4">
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-medium">
            Our Signature Picks
          </h2>
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {signatureProducts.map((product) => (
            <Link
              key={product.id}
              href={`/product/${product.numericId}`}
              className="group cursor-pointer"
            >
              <div className="relative aspect-square overflow-hidden bg-secondary/30 mb-4">
                {product.assets[0]?.url ? (
                  <Image
                    src={product.assets[0].url}
                    alt={product.assets[0].altText || product.title}
                    fill
                    className="object-cover transition-opacity duration-300 group-hover:opacity-90"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <div className="w-16 h-16 bg-border/50" />
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <h3 className="font-medium leading-tight group-hover:opacity-80 transition-opacity">
                  {product.title}
                </h3>
                <p className="text-sm font-medium">
                  {formatProductPrice(product.price)}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
