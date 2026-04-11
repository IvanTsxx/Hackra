import "./env/server";
import "./env/client";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  cacheComponents: true,
  images: {
    remotePatterns: [
      {
        hostname: "cdn.jsdelivr.net",
        protocol: "https",
      },
      {
        hostname: "**.lumacdn.com",
        protocol: "https",
      },
      {
        hostname: "avatars.githubusercontent.com",
        protocol: "https",
      },
      {
        hostname: "lh3.googleusercontent.com",
        protocol: "https",
      },
    ],
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
