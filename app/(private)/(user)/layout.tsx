import type { ReactNode } from "react";

import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { requireSession } from "@/data/auth-dal";

import { UserSidebar } from "./_components/user-sidebar";

interface PrivateLayoutFormProps {
  children: ReactNode;
}

const PrivateLayout: React.FC<PrivateLayoutFormProps> = async ({
  children,
}) => {
  await requireSession();

  return (
    <SidebarProvider>
      <UserSidebar />
      <SidebarInset>
        <header className="flex h-12 shrink-0 items-center gap-2 border-b px-4">
          <SidebarTrigger />
        </header>
        <section className="flex-1 w-full max-w-4xl mx-auto px-4 lg:px-6">
          {children}
        </section>
      </SidebarInset>
    </SidebarProvider>
  );
};

export default PrivateLayout;
