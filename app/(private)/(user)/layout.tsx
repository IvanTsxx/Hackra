import { headers } from "next/headers";
import { notFound } from "next/navigation";
import type { ReactNode } from "react";

import { auth } from "@/shared/lib/auth";
interface PrivateLayoutFormProps {
  children: ReactNode;
}

const requireUser = async () => {
  const user = await auth.api.getSession({
    headers: await headers(),
  });
  if (!user) notFound();
  return user;
};

const PrivateLayout: React.FC<PrivateLayoutFormProps> = async ({
  children,
}) => {
  await requireUser();

  return (
    <main className="flex h-full w-full items-center justify-center">
      {children}
    </main>
  );
};

export default PrivateLayout;
