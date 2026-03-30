"use client";

import { Menu } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

import { CodeText } from "../code-text";

const navLinks = [
  { href: "/hackathons", label: "Hackathons" },
  { href: "/about", label: "About" },
  { href: "/sponsors", label: "Sponsors" },
];

interface MobileNavProps {
  isAuthenticated: boolean;
}

export function MobileNav({ isAuthenticated }: MobileNavProps) {
  const [open, setOpen] = useState(false);

  return (
    <div className="md:hidden">
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger
          render={<Button variant="ghost" size="icon" className="relative" />}
        >
          <Menu className="h-5 w-5" />
          <span className="sr-only">Toggle menu</span>
        </SheetTrigger>
        <SheetContent
          side="right"
          className="w-full sm:w-80 bg-background border-l border-border"
        >
          <SheetHeader>
            <SheetTitle className="text-left font-mono uppercase tracking-widest text-sm">
              {"<Menu />"}
            </SheetTitle>
          </SheetHeader>

          <nav className="flex flex-col gap-1 mt-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className="flex items-center gap-3 px-4 py-3 text-sm uppercase tracking-wider hover:bg-secondary transition-colors border-b border-border"
              >
                <span className="text-primary font-mono">{">"}</span>
                {link.label}
              </Link>
            ))}

            <div className="border-t border-border mt-4 pt-4 space-y-3 px-4">
              {isAuthenticated ? (
                <Link href="/dashboard" onClick={() => setOpen(false)}>
                  <Button className="w-full uppercase tracking-wider text-xs">
                    Dashboard
                  </Button>
                </Link>
              ) : (
                <>
                  <Link href="/login" onClick={() => setOpen(false)}>
                    <Button
                      variant="outline"
                      className="w-full uppercase tracking-wider text-xs"
                    >
                      Login
                    </Button>
                  </Link>
                  <Link href="/signup" onClick={() => setOpen(false)}>
                    <Button className="w-full uppercase tracking-wider text-xs glow-primary">
                      Sign Up
                    </Button>
                  </Link>
                </>
              )}
            </div>
          </nav>

          <div className="absolute bottom-8 left-4 right-4">
            <CodeText
              as="p"
              className="text-xs text-muted-foreground font-mono"
            >
              hackra v1.0.0
            </CodeText>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}
