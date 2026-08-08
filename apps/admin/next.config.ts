import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: ["@aurora/db", "@aurora/email"],
  devIndicators: false,
};

export default nextConfig;
