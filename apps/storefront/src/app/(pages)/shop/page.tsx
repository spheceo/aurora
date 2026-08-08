import { getCollections } from "@/lib/collections";
import { getProducts } from "@/lib/products";
import ShopClient from "./ShopClient";

export default async function ShopPage() {
  const [products, collections] = await Promise.all([
    getProducts({ first: 250 }),
    getCollections({ first: 50 }),
  ]);

  return <ShopClient initialProducts={products} initialCollections={collections} />;
}
