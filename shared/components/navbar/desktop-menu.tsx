import Link from "next/link";

import { Button } from "@/components/ui/button";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";

const navLinks = [
  { href: "/hackathons", label: "Hackathons" },
  { href: "/about", label: "About" },
  { href: "/sponsors", label: "Sponsors" },
];

interface DesktopNavProps {
  isAuthenticated: boolean;
}

export function DesktopNav({ isAuthenticated }: DesktopNavProps) {
  return (
    <div className="hidden md:flex items-center gap-6">
      <NavigationMenu>
        <NavigationMenuList>
          {navLinks.map((link) => (
            <NavigationMenuItem key={link.href}>
              <NavigationMenuLink
                className={navigationMenuTriggerStyle()}
                href={link.href}
              >
                <span className="text-sm uppercase tracking-wider">
                  {link.label}
                </span>
              </NavigationMenuLink>
            </NavigationMenuItem>
          ))}
        </NavigationMenuList>
      </NavigationMenu>

      <div className="flex items-center gap-3">
        {isAuthenticated ? (
          <Link href="/dashboard">
            <Button
              variant="outline"
              size="sm"
              className="uppercase tracking-wider text-xs"
            >
              Dashboard
            </Button>
          </Link>
        ) : (
          <>
            <Link href="/login">
              <Button
                variant="ghost"
                size="sm"
                className="uppercase tracking-wider text-xs"
              >
                Login
              </Button>
            </Link>
            <Link href="/signup">
              <Button
                size="sm"
                className="uppercase tracking-wider text-xs glow-primary"
              >
                Sign Up
              </Button>
            </Link>
          </>
        )}
      </div>
    </div>
  );
}
