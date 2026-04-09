import "server-only";
import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";

import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { requireAdminSession } from "@/data/auth-dal";
import { UserMenu } from "@/shared/components/navbar/user-menu";
import { ThemeToggle } from "@/shared/components/theme-toggle";

import { AdminSidebar } from "./_components/admin-sidebar";

export default async function AdminLayout({
  children,
}: {
  children: ReactNode;
}) {
  const user = await requireAdminSession();

  return (
    <SidebarProvider>
      <AdminSidebar />
      <SidebarInset>
        <header className="flex h-12 justify-between shrink-0 items-center gap-2 border-b px-4">
          <div className="flex items-center gap-2">
            <SidebarTrigger />
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
          </div>
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <UserMenu user={user} />
          </div>
        </header>
        <main className="flex-1 p-6">{children}</main>
      </SidebarInset>
    </SidebarProvider>
  );
}
