// oxlint-disable typescript/no-non-null-assertion
import "server-only";
import { headers } from "next/headers";
import { notFound, redirect } from "next/navigation";
import { cache } from "react";

import { auth } from "@/shared/lib/auth";

export interface SessionDTO {
  id: string;
  username: string;
  email: string;
  role: string;
}

export const requireSession = cache(async (): Promise<SessionDTO> => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user?.id) {
    notFound();
  }

  return {
    email: session.user.email!,
    id: session.user.id,
    role: session.user.role!,
    username: session.user.username!,
  };
});

export const requireAdminSession = cache(async (): Promise<SessionDTO> => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user?.id) {
    redirect("/");
  }

  if (session.user.role !== "ADMIN") {
    redirect("/");
  }

  return {
    email: session.user.email!,
    id: session.user.id,
    role: session.user.role!,
    username: session.user.username!,
  };
});
