"use client";

import type { ReactNode } from "react";

import { useSession } from "@/shared/lib/auth-client";
import { useAuth } from "@/shared/lib/auth-context";

interface AuthModalProps {
  children: ReactNode;
  mode?: "login" | "signup";
}

export function AuthModal({ children, mode = "login" }: AuthModalProps) {
  const { data } = useSession();
  const { openAuth } = useAuth();
  const user = data?.user;

  // If logged in, render children normally
  if (user) {
    return children;
  }

  // If not logged in, intercept clicks during capture phase (before children receive them)
  // This works with any children type: buttons, links, custom components
  return (
    <span
      onClickCapture={(e) => {
        e.preventDefault();
        e.stopPropagation();
        openAuth(mode);
      }}
      className="inline-flex cursor-pointer bg-none p-0 m-0 border-none"
    >
      {children}
    </span>
  );
}
