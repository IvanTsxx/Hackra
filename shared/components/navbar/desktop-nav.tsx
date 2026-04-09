"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { cn } from "@/shared/lib/utils";

import { NAV_LINKS } from "./constants";

export const DesktopNav = () => {
  const pathname = usePathname();
  return (
    <div className="hidden md:flex items-center gap-8">
      {NAV_LINKS.map((link) => (
        <Link
          key={link.href}
          href={link.href}
          className={cn(
            "text-xs tracking-widest text-muted-foreground hover:text-brand-green transition-colors",
            pathname === link.href && "text-brand-green"
          )}
        >
          {link.label}
        </Link>
      ))}
    </div>
  );
};
