import type { Metadata } from "next";
import { getAnnouncement } from "@/lib/announcement";
import { ReactLenis } from "lenis/react";
import Hero from "@/components/hero";
import SignaturePicks from "@/components/signaturepicks";
import Categories from "@/components/categories";
import Reviews from "@/components/reviews";
import FAQs from "@/components/faqs";
import CTA from "@/components/cta";
import { getCollections } from "@/lib/collections";
import { siteConfig } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Aura Crystals and Crystal Store in South Africa",
  description:
    "Aurora ZA is your crystal store for natural crystals, crystal decor, and crystal gifts across South Africa.",
  alternates: {
    canonical: "/",
  },
};

export default async function Home() {
  const data = await getAnnouncement();
  const collections = await getCollections();
  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: siteConfig.legalName,
    alternateName: "Aurora ZA",
    url: siteConfig.url,
    potentialAction: {
      "@type": "SearchAction",
      target: `${siteConfig.url}/shop?q={search_term_string}`,
      "query-input": "required name=search_term_string",
    },
  };

  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "OnlineStore",
    name: siteConfig.legalName,
    url: siteConfig.url,
    logo: `${siteConfig.url}/logo.png`,
    sameAs: [siteConfig.social.instagram, siteConfig.social.tiktok],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
      />
      <ReactLenis root /> 

      <Hero data={data} />
      <SignaturePicks />
      <Categories collections={collections} />
      <Reviews />
      <FAQs />
      <CTA />
    </>
  );
}
