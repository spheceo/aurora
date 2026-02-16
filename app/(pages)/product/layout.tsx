import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Crystal Product",
  description: "Product details for Aurora ZA crystals.",
};

export default function ProductLayout({ children }: { children: React.ReactNode }) {
  return children;
}
