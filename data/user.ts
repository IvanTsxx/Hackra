import "server-only";
import { prisma } from "@/shared/lib/prisma";

export const getUserById = async (id: string) =>
  await prisma.user.findUnique({
    where: { id },
  });
