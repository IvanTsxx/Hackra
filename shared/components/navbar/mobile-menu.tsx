import { Menu } from "lucide-react";
import Link from "next/link";
import { Suspense } from "react";

import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetClose,
  SheetTrigger,
} from "@/components/ui/sheet";
import { getCurrentUser } from "@/data/auth-dal";
import { AuthModalDialog } from "@/shared/components/auth";

import { Skeleton } from "../ui/skeleton";
import { NAV_LINKS } from "./constants";
import { UserMenu } from "./user-menu";

export const MobileMenu = () => (
  <div className="lg:hidden flex items-center gap-2">
    <Suspense fallback={<Skeleton className="w-32 h-10" />}>
      <RenderButton />
    </Suspense>
    <Sheet>
      <SheetTrigger className="md:hidden" aria-label="Abrir menú">
        <Menu />
      </SheetTrigger>

      <SheetContent side="right" className="p-4 max-h-fit">
        <div className="grid flex-1 auto-rows-min gap-3">
          {NAV_LINKS.map((link) => (
            <SheetClose
              nativeButton={false}
              key={link.href}
              render={
                <Link
                  href={link.href}
                  className="  tracking-widest text-muted-foreground hover:text-foreground transition-colors"
                />
              }
            >
              {link.label}
            </SheetClose>
          ))}
        </div>
      </SheetContent>
    </Sheet>
  </div>
);

const RenderButton = async () => {
  const user = await getCurrentUser();

  if (!user) {
    return (
      <AuthModalDialog
        isRender={true}
        renderComponent={
          <Button
            size="sm"
            className="uppercase tracking-wider text-xs glow-primary"
          >
            Create Hackathon
          </Button>
        }
      >
        Create Hackathon
      </AuthModalDialog>
    );
  }
  return <UserMenu />;
};
