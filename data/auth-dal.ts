// oxlint-disable typescript/no-non-null-assertion
import "server-only";
import { headers } from "next/headers";
import { notFound, redirect } from "next/navigation";

import { auth } from "@/shared/lib/auth";

export interface SessionDTO {
  id: string;
  username: string;
  email: string;
  role: string;
  image: string;
}

export const requireSession = async (): Promise<SessionDTO> => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user?.id) {
    notFound();
  }

  return {
    email: session.user.email!,
    id: session.user.id,
    image: session.user.image!,
    role: session.user.role!,
    username: session.user.username!,
  };
};

export const requireAdminSession = async (): Promise<SessionDTO> => {
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
    image: session.user.image!,
    role: session.user.role!,
    username: session.user.username!,
  };
};

export const getCurrentUser = async () => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  return session?.user;
};
