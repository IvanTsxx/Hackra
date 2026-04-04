import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    unoptimized: true,
  },
  reactCompiler: true,
  serverExternalPackages: ["@takumi-rs/core"],
  typedRoutes: true,
};

export default nextConfig;
