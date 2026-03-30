import { eq } from "drizzle-orm";
import { headers } from "next/headers";
import { NextResponse } from "next/server";

import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { users } from "@/lib/db/schema";

export async function POST(request: Request) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const formData = await request.formData();
  const userType = formData.get("userType") as string;

  if (!userType || !["participant", "organizer"].includes(userType)) {
    return NextResponse.json({ error: "Invalid user type" }, { status: 400 });
  }

  // Update the user's userType directly in the database
  await db.update(users).set({ userType }).where(eq(users.id, session.user.id));

  // If organizer, redirect to organizer details page
  if (userType === "organizer") {
    return NextResponse.redirect(
      new URL("/onboarding/organizer", process.env.BETTER_AUTH_URL)
    );
  }

  // If participant, redirect to dashboard
  return NextResponse.redirect(
    new URL("/dashboard", process.env.BETTER_AUTH_URL)
  );
}
