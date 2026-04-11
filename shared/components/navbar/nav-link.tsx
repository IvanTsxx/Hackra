"use client";
import type { Route } from "next";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { cn } from "@/shared/lib/utils";

export const NavLink = ({ href, label }: { href: Route; label: string }) => {
  const pathname = usePathname();

  return (
    <Link
      key={href}
      href={href}
      className={cn(
        "text-xs tracking-widest text-muted-foreground hover:text-brand-green transition-colors",
        pathname === href && "text-brand-green"
      )}
    >
      {label}
    </Link>
  );
};
