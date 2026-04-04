"use client";

import type { Route } from "next";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

import { useSession } from "@/shared/lib/auth-client";
import { useAuth } from "@/shared/lib/auth-context";

interface AuthGateProps {
  children?: React.ReactNode;
  redirectTo?: Route;
}

export function AuthGate({ children, redirectTo }: AuthGateProps) {
  const { data, isPending } = useSession();
  const { openAuth } = useAuth();
  const router = useRouter();

  const user = data?.user;

  useEffect(() => {
    if (!isPending && !user && redirectTo) {
      openAuth();
    }
    if (!isPending && user && redirectTo) {
      router.push(redirectTo);
    }
  }, [isPending, user, redirectTo, openAuth, router]);

  if (isPending) {
    return null;
  }

  if (!user) {
    return (
      <button
        type="button"
        onClick={() => openAuth()}
        className="bg-transparent border-0 p-0 cursor-pointer"
      >
        {children}
      </button>
    );
  }

  return children;
}
