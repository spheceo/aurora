import type { Metadata } from "next";
import "./globals.css";
import { Google_Sans_Flex } from "next/font/google";
import { NuqsAdapter } from 'nuqs/adapters/next/app';
import { Toaster } from "@/components/ui/toaster";
import Footer from "@/components/footer";
import { siteConfig } from "@/lib/seo";

const googleSansFlex = Google_Sans_Flex({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  fallback: ["system-ui", "sans-serif"],
});

// ! never remove this line:
export const revalidate = 0;

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    template: "%s | Aurora ZA",
    default: "Aurora ZA Crystals Store",
  },
  description: siteConfig.description,
  keywords: siteConfig.keywords,
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: siteConfig.locale,
    url: siteConfig.url,
    title: "Aurora ZA Crystals Store",
    description: siteConfig.description,
    siteName: siteConfig.legalName,
    images: [
      {
        url: siteConfig.ogImage,
        width: 1200,
        height: 630,
        alt: "Aurora ZA crystals collection",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Aurora ZA Crystals Store",
    description: siteConfig.description,
    images: [siteConfig.ogImage],
  },
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/icon-32.png", type: "image/png", sizes: "32x32" },
      { url: "/icon-16.png", type: "image/png", sizes: "16x16" },
      { url: "/icon.png", type: "image/png", sizes: "512x512" },
      { url: "/icon-192.png", type: "image/png", sizes: "192x192" },
    ],
    shortcut: [{ url: "/favicon.ico" }],
    apple: [{ url: "/apple-touch-icon.png", sizes: "180x180" }],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning className={googleSansFlex.className}>
      <body>
        <NuqsAdapter>
          {children}
        </NuqsAdapter>
        <Footer />
        <Toaster />
      </body>
    </html>
  );
}
