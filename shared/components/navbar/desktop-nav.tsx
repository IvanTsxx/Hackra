import { Suspense } from "react";

import { Skeleton } from "../ui/skeleton";
import { NAV_LINKS } from "./constants";
import { NavLink } from "./nav-link";

export const DesktopNav = () => (
  <div className="hidden md:flex items-center gap-8">
    {NAV_LINKS.map((link) => (
      <Suspense key={link.href} fallback={<Skeleton className="w-16 h-8" />}>
        <NavLink href={link.href} label={link.label} />
      </Suspense>
    ))}
  </div>
);
