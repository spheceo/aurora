import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About Aurora ZA",
  description:
    "Learn about Aurora ZA, our approach to quality, and how we source natural crystals responsibly.",
  alternates: {
    canonical: "/about",
  },
  openGraph: {
    type: "website",
    title: "About Aurora ZA",
    description:
      "Learn about Aurora ZA, our approach to quality, and how we source natural crystals responsibly.",
    url: "/about",
  },
  twitter: {
    card: "summary_large_image",
    title: "About Aurora ZA",
    description:
      "Learn about Aurora ZA, our approach to quality, and how we source natural crystals responsibly.",
  },
};

export default function AboutLayout({ children }: { children: React.ReactNode }) {
  return children;
}
