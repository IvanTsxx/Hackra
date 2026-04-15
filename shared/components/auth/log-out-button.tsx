"use client";

import { LogOut } from "lucide-react";
import { useRouter } from "next/navigation";
import { useTransition } from "react";

import { Button } from "@/shared/components/ui/button";
import { signOut } from "@/shared/lib/auth-client";

export function LogoutButton() {
  const router = useRouter();

  const [isPending, startTransition] = useTransition();

  const handleLogout = () => {
    startTransition(async () => {
      await signOut();
      router.refresh();
    });
  };

  return (
    <Button
      variant="destructive"
      type="button"
      onClick={handleLogout}
      disabled={isPending}
      className="flex items-center gap-2.5  text-xs tracking-wider w-full"
    >
      <LogOut size={14} className="shrink-0" />
      Logout
    </Button>
  );
}
