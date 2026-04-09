import "./env/server";
import "./env/client";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    unoptimized: true,
  },
  reactCompiler: true,
  // oxlint-disable-next-line require-await
  async redirects() {
    return [
      {
        destination: "/settings/profile",
        permanent: false,
        source: "/settings/notifications",
      },
    ];
  },

  serverExternalPackages: ["@takumi-rs/core"],
  typedRoutes: true,
};

export default nextConfig;
