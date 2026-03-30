import { headers } from "next/headers";
import { NextResponse } from "next/server";

import { auth } from "@/lib/auth";

export async function GET() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    return NextResponse.redirect(
      new URL("/login", process.env.BETTER_AUTH_URL)
    );
  }

  // Get user type from the session user object
  const { userType } = session.user as { userType?: string };

  // If user doesn't have a userType, redirect to onboarding
  if (!userType) {
    return NextResponse.redirect(
      new URL("/onboarding", process.env.BETTER_AUTH_URL)
    );
  }

  // If user is organizer but doesn't have company info, redirect to organizer details
  if (userType === "organizer") {
    const hasCompany = (session.user as { company?: string }).company;
    const hasBio = (session.user as { bio?: string }).bio;

    if (!hasCompany && !hasBio) {
      return NextResponse.redirect(
        new URL("/onboarding/organizer", process.env.BETTER_AUTH_URL)
      );
    }
  }

  // User is all set, redirect to dashboard
  return NextResponse.redirect(
    new URL("/dashboard", process.env.BETTER_AUTH_URL)
  );
}
