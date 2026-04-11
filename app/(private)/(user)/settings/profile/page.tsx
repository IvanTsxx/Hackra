import { ChevronRight } from "lucide-react";

import { AnimatedSection } from "@/app/(private)/(user)/_components/animated-section";
import { getCurrentUser } from "@/data/auth-dal";
import { CodeText } from "@/shared/components/code-text";

import { ProfileForm } from "./_components/profile-form";

export default async function SettingsProfilePage() {
  const user = await getCurrentUser();

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
