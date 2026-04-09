"use client";

import { Menu, Moon, Sun, X } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { useTheme } from "next-themes";
import Link from "next/link";
import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import { AuthModalDialog } from "@/shared/components/auth";
import type { User } from "@/shared/lib/auth";

import { NAV_LINKS } from "./constants";
import { UserMenu } from "./user-menu";

export const MobileMenu = ({ user }: { user?: User | null }) => {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <>
      <div className="flex md:hidden items-center gap-2">
        <button
          type="button"
          onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
          className="p-1.5 text-muted-foreground hover:text-foreground transition-colors"
          aria-label="Toggle theme"
        >
          {mounted &&
            (resolvedTheme === "dark" ? <Sun size={15} /> : <Moon size={15} />)}
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
                <AuthModalDialog
                  isRender
                  renderComponent={
                    <Button
                      size="lg"
                      className="gap-2 w-full sm:w-auto uppercase tracking-wider text-xs glow-primary"
                      render={<Link href="/create" />}
                      nativeButton={false}
                    />
                  }
                >
                  Create Hackathon
                </AuthModalDialog>
              </div>
            ) : (
              <div className="pt-2 border-t border-border/30">
                <UserMenu user={user} />
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
