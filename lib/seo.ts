import { env } from "@/lib/env/server";

const fallbackUrl = "https://www.aurora-za.com";
const baseUrl = (env.APP_URL ?? fallbackUrl).replace(/\/$/, "");

export const siteConfig = {
  name: "Aurora ZA",
  legalName: "Aurora ZA Crystals Store",
  description:
    "Shop ethically sourced natural crystals in South Africa. Discover healing crystals, crystal decor, and curated crystal gifts from Aurora ZA.",
  url: baseUrl,
  ogImage: `${baseUrl}/image.png`,
  locale: "en_ZA",
  keywords: [
    "aurora za crystals",
    "aurora crystals",
    "aurora crystal store",
    "crystal store south africa",
    "natural crystals",
    "healing crystals",
    "crystal gifts",
  ],
  // social: {
  //   instagram: "https://www.instagram.com/aurora_crystalss/",
  //   tiktok: "https://www.tiktok.com/@aurora_crystalss",
  // },
};

export const staticRoutes = ["/", "/shop", "/about", "/contact", "/privacy", "/terms"] as const;
