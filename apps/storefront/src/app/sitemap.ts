import type { MetadataRoute } from "next";
import { getProducts } from "@/lib/products";
import { siteConfig, staticRoutes } from "@/lib/seo";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();

  const staticEntries: MetadataRoute.Sitemap = staticRoutes.map((route) => ({
    url: `${siteConfig.url}${route}`,
    lastModified: now,
    changeFrequency: route === "/" ? "weekly" : "monthly",
    priority: route === "/" ? 1 : route === "/shop" ? 0.9 : 0.7,
  }));

  try {
    // The sitemap only consumes stable product IDs; it never serializes prices.
    const products = await getProducts({ first: 250, trustedPriceAccess: true });
    const productEntries: MetadataRoute.Sitemap = products.map((product) => ({
      url: `${siteConfig.url}/product/${product.numericId}`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.8,
    }));

    return [...staticEntries, ...productEntries];
  } catch {
    return staticEntries;
  }
}
