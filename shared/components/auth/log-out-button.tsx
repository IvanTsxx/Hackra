"use client";

import { LogOut } from "lucide-react";

import { signOut } from "@/shared/lib/auth-client";

export function LogoutButton() {
  return (
    <button
      type="button"
      onClick={() => signOut()}
      className="flex items-center gap-2.5 font-pixel text-[10px] tracking-wider w-full"
    >
      <LogOut size={14} className="shrink-0" />
      Logout
    </button>
  );
}
