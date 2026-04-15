"use client";

import type { LucideProps } from "lucide-react";
import { LayoutDashboardIcon, Shield, ShieldIcon } from "lucide-react";
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

const adminNavItems: {
  href: Route;
  icon: ForwardRefExoticComponent<
    Omit<LucideProps, "ref"> & RefAttributes<SVGSVGElement>
  >;
  label: string;
}[] = [
  { href: "/admin", icon: LayoutDashboardIcon, label: "Dashboard" },
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
                    src="/hackra-logo-sm.webp"
                    alt="Hackra logo"
                    width={40}
                    height={40}
                    sizes="40px"
                    priority
                    className="w-10 h-10"
                  />
                  <div className="flex items-start gap-2">
                    <span className=" text-sm text-muted-foreground tracking-widest">
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
              {adminNavItems.map((item) => {
                const isActive = pathname.includes(item.href);
                return (
                  <SidebarMenuItem key={item.href}>
                    <SidebarMenuButton
                      className={cn(isActive && "text-brand-green")}
                      render={
                        <Link
                          href={item.href}
                          className="flex items-center gap-2 hover:text-brand-green"
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
