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
  const company = (formData.get("company") as string) || null;
  const bio = (formData.get("bio") as string) || null;
  const organizerRole = formData.get("organizerRole") as string;

  if (
    !organizerRole ||
    !["individual", "company", "community"].includes(organizerRole)
  ) {
    return NextResponse.json(
      { error: "Invalid organizer role" },
      { status: 400 }
    );
  }

  await db
    .update(users)
    .set({
      bio: bio,

      company: company,

      organizerRole: organizerRole,
    })
    .where(eq(users.id, session.user.id));

  return NextResponse.redirect(
    new URL("/dashboard", process.env.BETTER_AUTH_URL)
  );
}
