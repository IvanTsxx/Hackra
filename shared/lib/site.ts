/**
 * Site configuration constants.
 *
 * TODO: Move SITE_URL to a server-only env var (e.g. SITE_URL or
 * NEXT_PUBLIC_APP_URL) so production always uses the canonical domain
 * regardless of the local NEXT_PUBLIC_URL override.
 */
export const SITE_URL = "https://hackra.bongi.dev";
export const SITE_NAME = "Hackra";
export const SITE_DESCRIPTION =
  "Find and join hackathons worldwide. Build projects, form teams, and compete for prizes at coding events — online and in-person.";

/** Social profiles for structured data sameAs */
export const SITE_SOCIALS = {
  github: "https://github.com/IvanTsxx/hackra",
} as const;
