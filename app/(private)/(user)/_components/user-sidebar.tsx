"use client";

import type { LucideProps } from "lucide-react";
import {
  FileTextIcon,
  LayoutDashboardIcon,
  SettingsIcon,
  TrophyIcon,
  UserIcon,
} from "lucide-react";
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

interface NavItem {
  href: string;
  icon: ForwardRefExoticComponent<
    Omit<LucideProps, "ref"> & RefAttributes<SVGSVGElement>
  >;
  label: string;
}

const mainNavItems: NavItem[] = [
  { href: "/create", icon: SettingsIcon, label: "Create" },
  { href: "/my-applications", icon: UserIcon, label: "My Applications" },
  { href: "/my-certificates", icon: FileTextIcon, label: "My Certificates" },
  { href: "/my-hackathons", icon: TrophyIcon, label: "My Hackathons" },
  { href: "/my-teams", icon: LayoutDashboardIcon, label: "My Teams" },
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
                    src="/hackra-logo-sm.webp"
                    alt="Hackra logo"
                    width={40}
                    height={40}
                    sizes="40px"
                    priority
                    className="w-10 h-10"
                  />
                  <span className=" text-sm text-muted-foreground tracking-widest">
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
                        <a href={item.href} className="flex items-center gap-2">
                          <item.icon />
                          <span>{item.label}</span>
                        </a>
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
                        <a href={item.href} className="flex items-center gap-2">
                          <item.icon />
                          <span>{item.label}</span>
                        </a>
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
