import { ChevronRight } from "lucide-react";
import { notFound } from "next/navigation";

import { AnimatedSection } from "@/app/(private)/(user)/_components/animated-section";
import { getCurrentUser } from "@/data/auth-dal";
import { CodeText } from "@/shared/components/code-text";
import { prisma } from "@/shared/lib/prisma";

import { ProfileForm } from "./_components/profile-form";

export default async function SettingsProfilePage() {
  const user = await getCurrentUser();
  const userDB = await prisma.user.findUnique({
    select: {
      bio: true,
      githubUsername: true,
      location: true,
      name: true,
      position: true,
      techStack: true,
    },
    where: { id: user?.id },
  });

  if (!user) {
    notFound();
  }

  return (
    <section>
      {/* Breadcrumb */}
      <div className="flex items-center gap-2   text-sm text-muted-foreground mb-6 mt-4">
        <span>SETTINGS</span>
        <ChevronRight size={10} />
        <span className="text-foreground">PROFILE</span>
      </div>

      <AnimatedSection>
        <div className="space-y-1 mb-7">
          <CodeText as="p">settings</CodeText>
          <h1 className=" text-2xl text-foreground">PROFILE</h1>
        </div>
      </AnimatedSection>

      <ProfileForm
        initialData={{
          bio: userDB?.bio ?? "",
          githubUsername: userDB?.githubUsername ?? "",
          location: userDB?.location ?? "",
          name: userDB?.name ?? "",
          position: userDB?.position ?? "",
          techStack: userDB?.techStack ?? [],
        }}
      />
    </section>
  );
}
