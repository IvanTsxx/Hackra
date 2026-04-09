import "server-only";
import { ChevronRight, Bell, Mail, Users, Trophy } from "lucide-react";
import Link from "next/link";

import { AnimatedSection } from "@/app/(private)/(user)/_components/animated-section";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { CodeText } from "@/shared/components/code-text";

export default function SettingsNotificationsPage() {
  return (
    <section>
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 font-mono text-sm text-muted-foreground mb-6 mt-4">
        <Link href="/user/me" className="hover:text-foreground">
          PROFILE
        </Link>
        <ChevronRight size={10} />
        <span className="text-foreground">SETTINGS</span>
      </div>

      <AnimatedSection>
        <div className="space-y-1 mb-7">
          <CodeText as="p">settings</CodeText>
          <h1 className="font-pixel text-2xl text-foreground">NOTIFICATIONS</h1>
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
    </section>
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
        <p className="font-mono text-sm text-muted-foreground/60 mt-0.5">
          {description}
        </p>
      </div>
      <Switch defaultChecked={defaultChecked} />
    </div>
  );
}
