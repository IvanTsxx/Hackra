"use server";

import { redirect } from "next/navigation";

import { getCurrentUser } from "@/data/auth-dal";
import { prisma } from "@/shared/lib/prisma";

export const deleteAccount = async () => {
  try {
    const currentUser = await getCurrentUser();
    if (!currentUser) {
      throw new Error("Unauthorized");
    }

    await prisma.user.delete({
      where: {
        id: currentUser.id,
      },
    });
    return {
      success: "Account deleted successfully",
    };
  } catch (error) {
    console.error(error);
    return {
      error: "Failed to delete account",
    };
  } finally {
    redirect("/");
  }
};
