import type { Metadata } from "next";

import "./globals.css";

export const metadata: Metadata = {
  title: "Aurora ZA Crystals Store",
  description: "Aurora dashboard for the Aurora ZA Crystals Store.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
