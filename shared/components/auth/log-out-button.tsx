"use client";

import { LogOut } from "lucide-react";
import { useRouter } from "next/navigation";

import { signOut } from "@/shared/lib/auth-client";

export function LogoutButton() {
  const router = useRouter();

  const handleLogout = () => {
    signOut();
    router.push("/");
    router.refresh();
  };

  return (
    <button
      type="button"
      onClick={handleLogout}
      className="flex items-center gap-2.5 font-pixel text-xs tracking-wider w-full"
    >
      <LogOut size={14} className="shrink-0" />
      Logout
    </button>
  );
}
