import type { Route } from "next";

export const NAV_LINKS: { href: Route; label: string }[] = [
  { href: "/", label: "HOME" },
  { href: "/explore", label: "HACKATHONS" },
  { href: "/sponsors", label: "SPONSORS" },
];
