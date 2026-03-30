import { headers } from "next/headers";
import Link from "next/link";

import { auth } from "@/lib/auth";

import { DesktopNav } from "./desktop-menu";
import { MobileNav } from "./mobile-menu";
import { UserMenu } from "./user-menu";

export async function Navbar() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  const isAuthenticated = !!session?.user;

  return (
    <header className="fixed top-0 left-0 right-0 z-50 border-b border-border bg-background/80 backdrop-blur-sm">
      <div className="container mx-auto px-4">
        <div className="flex h-14 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="flex items-center gap-1">
              <span className="text-primary font-mono text-lg">[</span>
              <span className="font-mono text-sm uppercase tracking-widest">
                HH
              </span>
              <span className="text-primary font-mono text-lg">]</span>
            </div>
            <span className="hidden sm:inline-block text-xs text-muted-foreground font-mono uppercase tracking-wider group-hover:text-foreground transition-colors">
              hackathon_hub
            </span>
          </Link>

          {/* Desktop Navigation */}
          <DesktopNav isAuthenticated={isAuthenticated} />

          {/* User Menu (Desktop) or Mobile Nav */}
          <div className="flex items-center gap-3">
            {isAuthenticated && session?.user && (
              <div className="hidden md:block">
                <UserMenu
                  user={{
                    email: session.user.email || "",
                    id: session.user.id,
                    image: session.user.image,
                    name: session.user.name || "User",
                    userType: (session.user as { userType?: string }).userType,
                  }}
                />
              </div>
            )}
            <MobileNav isAuthenticated={isAuthenticated} />
          </div>
        </div>
      </div>
    </header>
  );
}
