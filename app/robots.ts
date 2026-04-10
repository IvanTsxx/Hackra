import type { MetadataRoute } from "next";

const BASE_URL = "https://https://hackra.bongi.dev";

export default function robots(): MetadataRoute.Robots {
  return {
    host: BASE_URL,
    rules: [
      {
        allow: "/",
        disallow: ["/api/", "/admin/", "/private/", "/(user)/"],
        userAgent: "*",
      },
      {
        disallow: ["/"],
        userAgent: "GPTBot",
      },
      {
        disallow: ["/"],
        userAgent: "ChatGPT-User",
      },
      {
        allow: "/",
        userAgent: "Google-Extended",
      },
      {
        allow: "/",
        userAgent: "Bingbot",
      },
    ],
    sitemap: `${BASE_URL}/sitemap.xml`,
  };
}
