import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* other config options here */
  eslint: {
    ignoreDuringBuilds: true, // ✅ allows build even with lint errors
  },
};

export default nextConfig;
