import type { Metadata } from "next";
import "./globals.css";
import { Google_Sans_Flex } from "next/font/google";
import { NuqsAdapter } from 'nuqs/adapters/next/app';
import { Toaster } from "@/components/ui/toaster";
import Footer from "@/components/footer";

const googleSansFlex = Google_Sans_Flex({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  fallback: ["system-ui", "sans-serif"],
});

export const revalidate = 0;

export const metadata: Metadata = {
  title: {
    template: '%s | Aurora',
    default: 'Aurora',
  },
  description: "Earth's Beauty, Captured in Crystal.",
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