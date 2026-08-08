import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: ["@aurora/db"],
  devIndicators: false,
  images: {
    qualities: [75, 85],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cdn.shopify.com",
      },
    ],
  },
};

export default nextConfig;
