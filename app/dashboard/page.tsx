import { headers } from "next/headers";
import Link from "next/link";
import { redirect } from "next/navigation";

import { Button } from "@/components/ui/button";
import { getOrganizerHackathons } from "@/lib/actions/hackathons";
import { auth } from "@/lib/auth";

import { DashboardContent } from "./_components/dashboard-content";

export const metadata = {
  description: "Manage your hackathons",
  title: "Dashboard - Hackra",
};

export default async function DashboardPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    redirect("/login");
  }

  const hackathons = await getOrganizerHackathons();

  return (
    <main className="min-h-screen bg-background relative">
      <div className="absolute inset-0 dot-grid opacity-30" />

      <div className="container mx-auto px-4 py-12 relative z-10">
        <div className="mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-4xl font-bold mb-2">Dashboard</h1>
            <p className="text-muted-foreground">
              Manage your hackathons and connect with participants
            </p>
          </div>
          <Link href="/dashboard/create">
            <Button>Create Hackathon</Button>
          </Link>
        </div>

        <DashboardContent hackathons={hackathons} />
      </div>
    </main>
  );
}
