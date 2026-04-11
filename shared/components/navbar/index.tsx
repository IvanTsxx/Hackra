import Image from "next/image";
import Link from "next/link";
import { Suspense } from "react";

import { CreateHackatonButton } from "@/shared/components/create-hackaton-button";
import { UserMenu } from "@/shared/components/navbar/user-menu";
import { ThemeToggle } from "@/shared/components/theme-toggle";

import { Skeleton } from "../ui/skeleton";
import { DesktopNav } from "./desktop-nav";
import { MobileMenu } from "./mobile-menu";

export function Navbar() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 border-b border-border/50 bg-background/80 backdrop-blur-md max-w-8xl mx-auto">
      <nav className="px-4 sm:px-6 h-14 flex items-center justify-between">
        {/* Logo */}
        <Link
          prefetch={false}
          href="/"
          className="flex items-center gap-2 group"
        >
          <Image
            src="/hackra-logo-sm.webp"
            alt="Hackra logo"
            width={40}
            height={40}
            loading="eager"
            priority
            sizes="40px"
            className="w-10 h-10"
          />
          <span className="font-pixel text-sm text-muted-foreground tracking-widest">
            HACKRA
          </span>
        </Link>

        {/* Desktop nav */}
        <DesktopNav />

        {/* Desktop actions */}
        <div className="hidden md:flex items-center gap-2">
          <Suspense fallback={<Skeleton className="w-32 h-10" />}>
            <CreateHackatonButton />
          </Suspense>
          <Suspense fallback={<Skeleton className="w-32 h-10" />}>
            <UserMenu />
          </Suspense>
          <ThemeToggle />
        </div>

        {/* Mobile menu toggle */}
        <MobileMenu />
      </nav>
    </header>
  );
}
