import type { MetadataRoute } from "next";

import { SITE_URL } from "@/shared/lib/site";

export default function robots(): MetadataRoute.Robots {
  return {
    host: SITE_URL,
    rules: [
      {
        allow: "/",
        disallow: [
          "/api/",
          "/admin/",
          "/create/",
          "/my-hackathons/",
          "/my-teams/",
          "/settings/",
          "/my-applications/",
        ],
        userAgent: "*",
      },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
