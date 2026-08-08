import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Shop Crystals",
  description:
    "Browse Aurora ZA's crystal shop for natural crystals, healing stones, and crystal gifts in South Africa.",
  alternates: {
    canonical: "/shop",
  },
  openGraph: {
    type: "website",
    title: "Shop Crystals | Aurora ZA",
    description:
      "Browse Aurora ZA's crystal shop for natural crystals, healing stones, and crystal gifts in South Africa.",
    url: "/shop",
  },
  twitter: {
    card: "summary_large_image",
    title: "Shop Crystals | Aurora ZA",
    description:
      "Browse Aurora ZA's crystal shop for natural crystals, healing stones, and crystal gifts in South Africa.",
  },
};

export default function ShopLayout({ children }: { children: React.ReactNode }) {
  return children;
}
