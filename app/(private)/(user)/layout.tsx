import Image from "next/image";
import Link from "next/link";
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
        <section className="flex-1 w-full max-w-4xl mx-auto px-4 lg:px-6">
          {children}
        </section>
      </SidebarInset>
    </SidebarProvider>
  );
};

export default PrivateLayout;
