"use client";

import type { ReactNode } from "react";

import { useSession } from "@/shared/lib/auth-client";
import { useAuth } from "@/shared/lib/auth-context";

interface AuthModalProps {
  children: ReactNode;
}

export function AuthModal({ children }: AuthModalProps) {
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
        openAuth();
      }}
      className="inline-flex cursor-pointer"
    >
      {children}
    </span>
  );
}
