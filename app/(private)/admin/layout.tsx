import "server-only";
import { Suspense } from "react";
import type { ReactNode } from "react";

import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { UserMenu } from "@/shared/components/navbar/user-menu";
import { ThemeToggle } from "@/shared/components/theme-toggle";
import { Skeleton } from "@/shared/components/ui/skeleton";

import { AdminSidebar } from "./_components/admin-sidebar";

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <SidebarProvider>
      <AdminSidebar />
      <SidebarInset>
        <header className="flex h-12 justify-between shrink-0 items-center gap-2 border-b px-4">
          <SidebarTrigger />
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <Suspense fallback={<Skeleton className="size-8 rounded-full" />}>
              <UserMenu />
            </Suspense>
          </div>
        </header>
        <main className="flex-1 p-6">{children}</main>
      </SidebarInset>
    </SidebarProvider>
  );
}
