import { ChevronRight } from "lucide-react";
import { headers } from "next/headers";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";

import { auth } from "@/shared/lib/auth";
import { prisma } from "@/shared/lib/prisma";

import { Title } from "./_components/title";
import { ProfileForm } from "./profile-form";

const NAV_ITEMS: { active: boolean; href: string; label: string }[] = [
  { active: true, href: "/settings/profile", label: "PROFILE" },
  { active: false, href: "/settings/account", label: "ACCOUNT" },
  { active: false, href: "/settings/notifications", label: "NOTIFICATIONS" },
];

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
    <main className="max-w-4xl mx-auto px-4 sm:px-6 pt-20 pb-16">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 font-mono text-[11px] text-muted-foreground mb-6 mt-4">
        <Link href={`/user/${user.username}`} className="hover:text-foreground">
          PROFILE
        </Link>
        <ChevronRight size={10} />
        <span className="text-foreground">SETTINGS</span>
      </div>

      <div className="grid md:grid-cols-4 gap-8">
        {/* Sidebar nav */}
        <nav className="md:col-span-1">
          <div className="space-y-0.5">
            {NAV_ITEMS.map((item) => (
              <a
                key={item.label}
                href={item.href}
                className={`flex items-center px-3 py-2 font-pixel text-[10px] tracking-wider transition-colors border-l-2 ${
                  item.active
                    ? "border-brand-green text-brand-green bg-brand-green/5"
                    : "border-transparent text-muted-foreground hover:text-foreground hover:border-border/50"
                }`}
              >
                {item.label}
              </a>
            ))}
          </div>
        </nav>

        {/* Form */}
        <div className="md:col-span-3">
          <Title />

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
        </div>
      </div>
    </main>
  );
}
