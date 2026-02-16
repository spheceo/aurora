import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact Aurora ZA",
  description:
    "Contact Aurora ZA for crystal recommendations, custom sourcing, and order support.",
  alternates: {
    canonical: "/contact",
  },
  openGraph: {
    type: "website",
    title: "Contact Aurora ZA",
    description:
      "Contact Aurora ZA for crystal recommendations, custom sourcing, and order support.",
    url: "/contact",
  },
  twitter: {
    card: "summary_large_image",
    title: "Contact Aurora ZA",
    description:
      "Contact Aurora ZA for crystal recommendations, custom sourcing, and order support.",
  },
};

export default function ContactLayout({ children }: { children: React.ReactNode }) {
  return children;
}
