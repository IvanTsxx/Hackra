import { ChevronRight } from "lucide-react";
import { headers } from "next/headers";
import { notFound, redirect } from "next/navigation";

import { AnimatedSection } from "@/app/(private)/(user)/_components/animated-section";
import { CodeText } from "@/shared/components/code-text";
import { auth } from "@/shared/lib/auth";
import { prisma } from "@/shared/lib/prisma";

import { ProfileForm } from "./profile-form";

export default async function SettingsProfilePage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user?.id) {
    redirect("/");
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
  });

  if (!user) {
    notFound();
  }

  return (
    <section>
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 font-mono text-sm text-muted-foreground mb-6 mt-4">
        <span>SETTINGS</span>
        <ChevronRight size={10} />
        <span className="text-foreground">PROFILE</span>
      </div>

      <AnimatedSection>
        <div className="space-y-1 mb-7">
          <CodeText as="p">settings</CodeText>
          <h1 className="font-pixel text-2xl text-foreground">PROFILE</h1>
        </div>
      </AnimatedSection>

      <ProfileForm
        initialData={{
          bio: user.bio ?? "",
          githubUsername: user.githubUsername ?? "",
          location: user.location ?? "",
          name: user.name,
          position: user.position ?? "",
          techStack: user.techStack,
        }}
      />
    </section>
  );
}
