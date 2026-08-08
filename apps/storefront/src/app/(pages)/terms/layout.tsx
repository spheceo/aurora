import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Service",
  description: "Read Aurora ZA's terms of service for purchases, shipping, and returns.",
  alternates: {
    canonical: "/terms",
  },
};

export default function TermsLayout({ children }: { children: React.ReactNode }) {
  return children;
}
