import ProductClient from "./ProductClient";
import { getProductById, getProducts } from "@/lib/products";

type ProductPageProps = {
  params: Promise<{ id: string }>;
};

export default async function ProductPage({ params }: ProductPageProps) {
  const { id } = await params;
  const numericId = Number.parseInt(id, 10);

  if (!Number.isFinite(numericId)) {
    return <ProductClient product={null} recommendedProducts={[]} />;
  }

  const product = await getProductById(numericId);

  if (!product) {
    return <ProductClient product={null} recommendedProducts={[]} />;
  }

  const allProducts = await getProducts({ first: 250 });
  const recommendedProducts = allProducts
    .filter((candidate) => candidate.numericId !== numericId)
    .slice(0, 6);

  return <ProductClient product={product} recommendedProducts={recommendedProducts} />;
}
