import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  turbopack: {
    root: __dirname,
  },
  // Photos are served locally from /public/images — no remote allow-list needed.
};

export default nextConfig;
