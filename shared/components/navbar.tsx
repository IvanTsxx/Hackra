"use client";

import { Sun, Moon, Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import type { Route } from "next";
import { useTheme } from "next-themes";
import Link from "next/link";
import { useState, useEffect } from "react";

import { Button } from "@/components/ui/button";
import { useAuth } from "@/shared/lib/auth-context";

import type { User } from "../lib/auth";
import { signOut, useSession } from "../lib/auth-client";
import { AuthModal } from "./auth";
import { ThemeToggle } from "./theme-toggle";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";

const NAV_LINKS: { href: Route; label: string }[] = [
  { href: "/explore", label: "HACKATHONS" },
  { href: "/sponsors", label: "SPONSORS" },
];

export function Navbar() {
  const { data } = useSession();
  const user = data?.user;
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const { openAuth } = useAuth();

  useEffect(() => {
    setMounted(true);
  }, []);

  const openLogin = () => {
    openAuth("login");
  };
  const openSignup = () => {
    openAuth("signup");
  };

  return (
    <>
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
          <div className="hidden md:flex items-center gap-8">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="font-pixel text-xs tracking-widest text-muted-foreground hover:text-foreground transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Desktop actions */}
          <div className="hidden md:flex items-center gap-2">
            <AuthModal>
              <Button
                size="lg"
                className="gap-2 w-full sm:w-auto uppercase tracking-wider text-xs glow-primary"
                render={<Link href="/create" />}
                nativeButton={false}
              >
                Create Hackathon
              </Button>
            </AuthModal>
            {user && <UserMenu user={user} />}
            <ThemeToggle />
          </div>

          {/* Mobile menu toggle */}
          <div className="flex md:hidden items-center gap-2">
            <button
              type="button"
              onClick={() =>
                setTheme(resolvedTheme === "dark" ? "light" : "dark")
              }
              className="p-1.5 text-muted-foreground hover:text-foreground transition-colors"
              aria-label="Toggle theme"
            >
              {mounted &&
                (resolvedTheme === "dark" ? (
                  <Sun size={15} />
                ) : (
                  <Moon size={15} />
                ))}
            </button>
            <button
              type="button"
              onClick={() => setMenuOpen(!menuOpen)}
              className="p-1.5 text-muted-foreground hover:text-foreground transition-colors"
              aria-label="Toggle menu"
            >
              {menuOpen ? <X size={18} /> : <Menu size={18} />}
            </button>
          </div>
        </nav>

        {/* Mobile menu */}
        <AnimatePresence>
          {menuOpen && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.15 }}
              className="md:hidden border-t border-border/50 bg-background/95 backdrop-blur-md px-4 py-4 flex flex-col gap-4"
            >
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMenuOpen(false)}
                  className="font-pixel text-xs tracking-widest text-muted-foreground hover:text-foreground transition-colors"
                >
                  {link.label}
                </Link>
              ))}
              {!user ? (
                <div className="flex items-center gap-3 pt-2 border-t border-border/30">
                  <button
                    type="button"
                    onClick={() => {
                      setMenuOpen(false);
                      openLogin();
                    }}
                    className="font-pixel text-xs tracking-widest text-muted-foreground hover:text-foreground"
                  >
                    LOGIN
                  </button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => {
                      setMenuOpen(false);
                      openSignup();
                    }}
                    className="font-pixel text-xs tracking-widest rounded-none"
                  >
                    SIGN UP
                  </Button>
                </div>
              ) : (
                <div className="pt-2 border-t border-border/30">
                  <UserMenu user={user} />
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </header>
    </>
  );
}

function UserMenu({ user }: { user: User }) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <Button size="sm" variant="outline" className="rounded-full p-0" />
        }
      >
        <Avatar>
          <AvatarImage src={user.image || ""} />
          <AvatarFallback>{user.name?.charAt(0).toUpperCase()}</AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="glass group p-0 border-border/50 bg-transparent backdrop-blur-md">
        <DropdownMenuItem className="glass">
          <Link href={`/user/${user.username}`}>My Profile</Link>
        </DropdownMenuItem>

        <DropdownMenuItem className="glass">
          <Link href="/settings/profile">Settings</Link>
        </DropdownMenuItem>
        <DropdownMenuItem variant="destructive">
          <LogoutButton />
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function LogoutButton() {
  return (
    <Button
      variant="destructive"
      onClick={() => {
        signOut();
      }}
    >
      Logout
    </Button>
  );
}
