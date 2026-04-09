import { headers } from "next/headers";
import Link from "next/link";

import { CreateHackatonButton } from "@/shared/components/create-hackaton-button";
import { UserMenu } from "@/shared/components/navbar/user-menu";
import { ThemeToggle } from "@/shared/components/theme-toggle";
import { auth } from "@/shared/lib/auth";

import { DesktopNav } from "./desktop-nav";
import { MobileMenu } from "./mobile-menu";

export async function Navbar() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  const user = session?.user;

  return (
    <header className="fixed top-0 left-0 right-0 z-50 border-b border-border/50 bg-background/80 backdrop-blur-md">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 group">
          <span className="font-pixel text-sm border border-border/70 px-2 py-0.5 text-foreground group-hover:border-brand-green/50 transition-colors">
            [HR]
          </span>
          <span className="font-pixel text-sm text-muted-foreground tracking-widest">
            HACKRA
          </span>
        </Link>

        {/* Desktop nav */}
        <DesktopNav />

        {/* Desktop actions */}
        <div className="hidden md:flex items-center gap-2">
          <CreateHackatonButton user={user} />
          {user && <UserMenu user={user} />}
          <ThemeToggle />
        </div>

        {/* Mobile menu toggle */}
        <MobileMenu user={user} />
      </nav>
    </header>
  );
}
