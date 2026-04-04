import "server-only";
import { ChevronRight, Bell, Mail, Users, Trophy } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { CodeText } from "@/shared/components/code-text";

import { AnimatedSection } from "./_components/animated-section";

const NAV_ITEMS: { active: boolean; href: string; label: string }[] = [
  { active: false, href: "/settings/profile", label: "PROFILE" },
  { active: false, href: "/settings/account", label: "ACCOUNT" },
  { active: true, href: "/settings/notifications", label: "NOTIFICATIONS" },
];

export default function SettingsNotificationsPage() {
  return (
    <main className="max-w-4xl mx-auto px-4 sm:px-6 pt-20 pb-16">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 font-mono text-[11px] text-muted-foreground mb-6 mt-4">
        <Link href="/user/me" className="hover:text-foreground">
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

        {/* Content */}
        <div className="md:col-span-3">
          <AnimatedSection>
            <div className="space-y-1 mb-7">
              <CodeText as="p">settings</CodeText>
              <h1 className="font-pixel text-2xl text-foreground">
                NOTIFICATIONS
              </h1>
            </div>
          </AnimatedSection>

          <div className="space-y-8">
            {/* General notifications */}
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Bell size={14} className="text-brand-green" />
                <h2 className="font-mono text-xs tracking-widest text-foreground">
                  GENERAL
                </h2>
              </div>
              <div className="border border-border/30 bg-secondary/10 divide-y divide-border/20">
                <NotificationRow
                  title="Platform updates"
                  description="Get notified about new features and platform changes."
                  defaultChecked
                />
                <NotificationRow
                  title="Security alerts"
                  description="Important security notifications about your account."
                  defaultChecked
                />
              </div>
            </div>

            {/* Team notifications */}
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Users size={14} className="text-brand-green" />
                <h2 className="font-mono text-xs tracking-widest text-foreground">
                  TEAM
                </h2>
              </div>
              <div className="border border-border/30 bg-secondary/10 divide-y divide-border/20">
                <NotificationRow
                  title="Team invitations"
                  description="When someone invites you to join their team."
                  defaultChecked
                />
                <NotificationRow
                  title="Application updates"
                  description="Status changes on your team applications."
                  defaultChecked
                />
                <NotificationRow
                  title="Team messages"
                  description="New messages from your team members."
                />
              </div>
            </div>

            {/* Hackathon notifications */}
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Trophy size={14} className="text-brand-green" />
                <h2 className="font-mono text-xs tracking-widest text-foreground">
                  HACKATHONS
                </h2>
              </div>
              <div className="border border-border/30 bg-secondary/10 divide-y divide-border/20">
                <NotificationRow
                  title="Hackathon reminders"
                  description="Reminders before your registered hackathons start."
                  defaultChecked
                />
                <NotificationRow
                  title="Results & prizes"
                  description="When hackathon results are announced."
                  defaultChecked
                />
                <NotificationRow
                  title="New hackathons"
                  description="Recommended hackathons based on your interests."
                />
              </div>
            </div>

            {/* Email notifications */}
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Mail size={14} className="text-brand-green" />
                <h2 className="font-mono text-xs tracking-widest text-foreground">
                  EMAIL
                </h2>
              </div>
              <div className="border border-border/30 bg-secondary/10 divide-y divide-border/20">
                <NotificationRow
                  title="Email digest"
                  description="Receive a weekly summary of activity."
                />
                <NotificationRow
                  title="Marketing emails"
                  description="Tips, stories, and updates from the Hackra team."
                />
              </div>
            </div>

            {/* Save button */}
            <div className="pt-2 border-t border-border/30 flex justify-end">
              <Button className="font-pixel text-xs tracking-wider rounded-none bg-foreground text-background hover:bg-foreground/90 h-9 px-6">
                SAVE PREFERENCES
              </Button>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

function NotificationRow({
  title,
  description,
  defaultChecked,
}: {
  title: string;
  description: string;
  defaultChecked?: boolean;
}) {
  return (
    <div className="flex items-center justify-between p-4">
      <div className="flex-1">
        <p className="font-mono text-xs text-foreground">{title}</p>
        <p className="font-mono text-[11px] text-muted-foreground/60 mt-0.5">
          {description}
        </p>
      </div>
      <Switch defaultChecked={defaultChecked} />
    </div>
  );
}
