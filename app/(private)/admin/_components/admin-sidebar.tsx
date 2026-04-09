"use client";

import type { LucideProps } from "lucide-react";
import {
  LayoutDashboardIcon,
  Shield,
  ShieldIcon,
  UploadIcon,
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

const adminNavItems: {
  href: Route;
  icon: ForwardRefExoticComponent<
    Omit<LucideProps, "ref"> & RefAttributes<SVGSVGElement>
  >;
  label: string;
}[] = [
  { href: "/admin", icon: LayoutDashboardIcon, label: "Dashboard" },
  { href: "/admin/import", icon: UploadIcon, label: "Import" },
  { href: "/admin/hackathons", icon: ShieldIcon, label: "Hackathons" },
];

export function AdminSidebar() {
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
                  <div className="flex items-start gap-2">
                    <span className="font-pixel text-sm text-muted-foreground tracking-widest">
                      HACKRA ADMIN
                    </span>
                    <Shield className="w-5 h-5" />
                  </div>
                </Link>
              }
            />
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Administration</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {adminNavItems.map((item) => (
                <SidebarMenuItem key={item.href}>
                  <SidebarMenuButton
                    isActive={pathname === item.href}
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
              ))}
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
                <Link href="/" className="flex items-center gap-2">
                  <LayoutDashboardIcon />
                  <span className="truncate">Back to Hackra</span>
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
