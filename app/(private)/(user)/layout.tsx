import type { ReactNode } from "react";

import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { requireSession } from "@/data/auth-dal";
import { UserMenu } from "@/shared/components/navbar/user-menu";
import { ThemeToggle } from "@/shared/components/theme-toggle";

import { UserSidebar } from "./_components/user-sidebar";

interface PrivateLayoutFormProps {
  children: ReactNode;
}

const PrivateLayout: React.FC<PrivateLayoutFormProps> = async ({
  children,
}) => {
  const user = await requireSession();

  return (
    <SidebarProvider>
      <UserSidebar />
      <SidebarInset>
        <header className="flex h-12 shrink-0 items-center gap-2 border-b px-4 justify-between">
          <SidebarTrigger />

          <div className="flex items-center gap-2">
            <ThemeToggle />
            <UserMenu user={user} />
          </div>
        </header>
        <section className="flex-1 w-full max-w-4xl mx-auto px-4 lg:px-6 py-4">
          {children}
        </section>
      </SidebarInset>
    </SidebarProvider>
  );
};

export default PrivateLayout;
