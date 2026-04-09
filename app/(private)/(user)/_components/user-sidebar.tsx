"use client";

import type { LucideProps } from "lucide-react";
import { LayoutDashboardIcon, SettingsIcon, UserIcon } from "lucide-react";
import type { Route } from "next";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ForwardRefExoticComponent, RefAttributes } from "react";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar";
import { cn } from "@/shared/lib/utils";

const mainNavItems: {
  href: Route;
  icon: ForwardRefExoticComponent<
    Omit<LucideProps, "ref"> & RefAttributes<SVGSVGElement>
  >;
  label: string;
}[] = [
  { href: "/my-teams", icon: LayoutDashboardIcon, label: "My Teams" },
  { href: "/my-applications", icon: UserIcon, label: "My Applications" },
  { href: "/create", icon: SettingsIcon, label: "Create" },
];

const settingsNavItems: {
  href: Route;
  icon: ForwardRefExoticComponent<
    Omit<LucideProps, "ref"> & RefAttributes<SVGSVGElement>
  >;
  label: string;
}[] = [
  { href: "/settings/profile", icon: UserIcon, label: "Profile" },
  /* { href: "/settings/notifications", icon: BellIcon, label: "Notifications" }, */
  { href: "/settings/account", icon: SettingsIcon, label: "Account" },
];

export function UserSidebar() {
  const pathname = usePathname();

  return (
    <Sidebar>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              size="lg"
              render={
                <Link
                  href="/"
                  className="flex items-center gap-2 group"
                  prefetch={false}
                >
                  <Image
                    src="/hackra-logo.webp"
                    alt="Logo"
                    width={1600}
                    height={1600}
                    loading="eager"
                    priority
                    className="w-10 h-10"
                  />
                  <span className="font-pixel text-sm text-muted-foreground tracking-widest">
                    HACKRA
                  </span>
                </Link>
              }
            />
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {mainNavItems.map((item) => {
                const isActive = pathname.includes(item.href);
                return (
                  <SidebarMenuItem key={item.href}>
                    <SidebarMenuButton
                      className={cn(isActive && "text-brand-green")}
                      render={
                        <Link
                          href={item.href}
                          className="flex items-center gap-2"
                        >
                          <item.icon />
                          <span>{item.label}</span>
                        </Link>
                      }
                    />
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel>Settings</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {settingsNavItems.map((item) => {
                const isActive = pathname.includes(item.href);

                return (
                  <SidebarMenuItem key={item.href}>
                    <SidebarMenuButton
                      className={cn(isActive && "text-brand-green")}
                      render={
                        <Link
                          href={item.href}
                          className="flex items-center gap-2"
                        >
                          <item.icon />
                          <span>{item.label}</span>
                        </Link>
                      }
                    />
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              size="sm"
              render={
                <Link
                  href="/settings/profile"
                  className="flex items-center gap-2"
                >
                  <UserIcon />
                  <span className="truncate">My Profile</span>
                </Link>
              }
            />
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>

      <SidebarRail />
    </Sidebar>
  );
}
