import { headers } from "next/headers";
import { notFound, redirect } from "next/navigation";

import { getHackathonById } from "@/lib/actions/hackathons";
import { auth } from "@/lib/auth";

import { EditHackathonForm } from "./_components/edit-form";

export const metadata = {
  description: "Edit hackathon event",
  title: "Edit Hackathon - Hackra",
};

interface EditHackathonPageProps {
  params: Promise<{ id: string }>;
}

export default async function EditHackathonPage({
  params,
}: EditHackathonPageProps) {
  const { id } = await params;

  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    redirect("/login");
  }

  const hackathon = await getHackathonById(id);

  if (!hackathon) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-12">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Edit Hackathon</h1>
          <p className="text-muted-foreground">
            Update your hackathon event details
          </p>
        </div>

        <div className="max-w-2xl">
          <EditHackathonForm hackathon={hackathon} />
        </div>
      </div>
    </main>
  );
}
