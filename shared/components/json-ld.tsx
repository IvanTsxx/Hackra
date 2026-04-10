import {
  SITE_DESCRIPTION,
  SITE_NAME,
  SITE_SOCIALS,
  SITE_URL,
} from "@/shared/lib/site";

interface JsonLdProps {
  type: "homepage" | "webpage";
  url?: string;
  name?: string;
  description?: string;
}

/**
 * Renders JSON-LD structured data as a `<script>` tag.
 *
 * Using dangerouslySetInnerHTML is the standard Next.js pattern for
 * injecting schema.org JSON-LD — the content is server-generated from
 * constants, never user input, so there is no XSS risk.
 */
export function JsonLd({ type, url, name, description }: JsonLdProps) {
  const pageUrl = url ?? SITE_URL;
  const pageName = name ?? `${SITE_NAME} | Build. Compete. Together.`;
  const pageDescription = description ?? SITE_DESCRIPTION;

  if (type === "homepage") {
    const graph = {
      "@context": "https://schema.org",
      "@graph": [
        {
          "@type": "Organization",
          logo: `${SITE_URL}/logo.png`,
          name: SITE_NAME,
          sameAs: [SITE_SOCIALS.github],
          url: SITE_URL,
        },
        {
          "@type": "WebSite",
          name: SITE_NAME,
          potentialAction: {
            "@type": "SearchAction",
            "query-input": "required name=search_term_string",
            target: {
              "@type": "EntryPoint",
              urlTemplate: `${SITE_URL}/explore?q={search_term_string}`,
            },
          },
          url: SITE_URL,
        },
        {
          "@type": "WebPage",
          description: pageDescription,
          isPartOf: {
            "@type": "WebSite",
            url: SITE_URL,
          },
          name: pageName,
          url: pageUrl,
        },
      ],
    };

    return (
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(graph) }}
      />
    );
  }

  // Generic webpage schema
  const webpage = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    description: pageDescription,
    isPartOf: {
      "@type": "WebSite",
      url: SITE_URL,
    },
    name: pageName,
    url: pageUrl,
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(webpage) }}
    />
  );
}
