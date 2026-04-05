"use client";

import {
  Sun,
  Moon,
  Menu,
  X,
  User,
  Settings,
  FileText,
  Users,
  LogOut,
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import type { Route } from "next";
import { useTheme } from "next-themes";
import Link from "next/link";
import { useState, useEffect } from "react";

import { Button } from "@/components/ui/button";
import { useAuth } from "@/shared/lib/auth-context";

import type { User as UserType } from "../lib/auth";
import { signOut, useSession } from "../lib/auth-client";
import { AuthModal } from "./auth";
import { ThemeToggle } from "./theme-toggle";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
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

function UserMenu({ user }: { user: UserType }) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <Button
            size="sm"
            variant="outline"
            className="rounded-full p-0 size-8"
          />
        }
      >
        <Avatar>
          <AvatarImage src={user.image || ""} />
          <AvatarFallback>{user.name?.charAt(0).toUpperCase()}</AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        className="rounded-none border-border/50 bg-background/95 backdrop-blur-md p-0 min-w-56"
      >
        {/* Header with user info */}
        <DropdownMenuGroup>
          <DropdownMenuLabel className="px-3 py-2.5 border-b border-border/40">
            <div className="flex items-center gap-2.5">
              <Avatar size="sm">
                <AvatarImage src={user.image || ""} />
                <AvatarFallback>
                  {user.name?.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="flex flex-col min-w-0">
                <span className="font-pixel text-[10px] tracking-wider text-foreground truncate">
                  {user.name?.toUpperCase()}
                </span>
                <span className="font-mono text-[10px] text-muted-foreground truncate">
                  @{user.username}
                </span>
              </div>
            </div>
          </DropdownMenuLabel>
        </DropdownMenuGroup>

        {/* Menu items */}
        <div className="py-1">
          <DropdownMenuItem className="rounded-none px-1 py-0.5">
            <Link
              href={`/user/${user.username}`}
              className="flex items-center gap-2.5 font-pixel text-[10px] tracking-wider text-foreground w-full"
            >
              <User size={14} className="text-muted-foreground shrink-0" />
              My Profile
            </Link>
          </DropdownMenuItem>

          <DropdownMenuItem className="rounded-none px-1 py-0.5">
            <Link
              href="/my-applications"
              className="flex items-center gap-2.5 font-pixel text-[10px] tracking-wider text-foreground w-full"
            >
              <FileText size={14} className="text-muted-foreground shrink-0" />
              My Applications
            </Link>
          </DropdownMenuItem>

          <DropdownMenuItem className="rounded-none px-1 py-0.5">
            <Link
              href="/my-teams"
              className="flex items-center gap-2.5 font-pixel text-[10px] tracking-wider text-foreground w-full"
            >
              <Users size={14} className="text-muted-foreground shrink-0" />
              My Teams
            </Link>
          </DropdownMenuItem>

          <DropdownMenuSeparator />

          <DropdownMenuItem className="rounded-none px-1 py-0.5">
            <Link
              href="/settings/profile"
              className="flex items-center gap-2.5 font-pixel text-[10px] tracking-wider text-foreground w-full"
            >
              <Settings size={14} className="text-muted-foreground shrink-0" />
              Settings
            </Link>
          </DropdownMenuItem>
        </div>

        <DropdownMenuSeparator />

        <DropdownMenuItem
          variant="destructive"
          className="rounded-none px-1 py-0.5"
        >
          <LogoutButton />
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function LogoutButton() {
  return (
    <button
      type="button"
      onClick={() => signOut()}
      className="flex items-center gap-2.5 font-pixel text-[10px] tracking-wider w-full"
    >
      <LogOut size={14} className="shrink-0" />
      Logout
    </button>
  );
}
