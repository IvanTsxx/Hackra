import "server-only";
import { ChevronRight, Trash2, Mail, Shield } from "lucide-react";
import Link from "next/link";

import { AnimatedSection } from "@/app/(private)/(user)/_components/animated-section";
import { Button } from "@/components/ui/button";
import { CodeText } from "@/shared/components/code-text";

export default function SettingsAccountPage() {
  return (
    <section>
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 font-mono text-[11px] text-muted-foreground mb-6 mt-4">
        <Link href="/user/me" className="hover:text-foreground">
          PROFILE
        </Link>
        <ChevronRight size={10} />
        <span className="text-foreground">SETTINGS</span>
      </div>

      <AnimatedSection>
        <div className="space-y-1 mb-7">
          <CodeText as="p">settings</CodeText>
          <h1 className="font-pixel text-2xl text-foreground">ACCOUNT</h1>
        </div>
      </AnimatedSection>

      <div className="space-y-8">
        {/* Email section */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Mail size={14} className="text-brand-green" />
            <h2 className="font-mono text-xs tracking-widest text-foreground">
              EMAIL
            </h2>
          </div>
          <div className="border border-border/30 bg-secondary/10 p-4 space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-mono text-xs text-muted-foreground">
                  Current email
                </p>
                <p className="font-mono text-sm text-foreground mt-1">
                  user@example.com
                </p>
              </div>
              <Button
                variant="outline"
                className="font-mono text-xs rounded-none border-border/40 hover:border-brand-green/40 hover:text-brand-green"
              >
                CHANGE
              </Button>
            </div>
          </div>
        </div>

        {/* Security section */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Shield size={14} className="text-brand-green" />
            <h2 className="font-mono text-xs tracking-widest text-foreground">
              SECURITY
            </h2>
          </div>
          <div className="border border-border/30 bg-secondary/10 p-4 space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-mono text-xs text-muted-foreground">
                  Connected accounts
                </p>
                <p className="font-mono text-sm text-foreground mt-1">
                  GitHub, Google
                </p>
              </div>
              <Button
                variant="outline"
                className="font-mono text-xs rounded-none border-border/40 hover:border-brand-green/40 hover:text-brand-green"
              >
                MANAGE
              </Button>
            </div>
          </div>
        </div>

        {/* Danger zone */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Trash2 size={14} className="text-red-500" />
            <h2 className="font-mono text-xs tracking-widest text-red-500">
              DANGER ZONE
            </h2>
          </div>
          <div className="border border-red-500/20 bg-red-500/5 p-4 space-y-3">
            <div>
              <p className="font-mono text-xs text-muted-foreground">
                Delete your account
              </p>
              <p className="font-mono text-[11px] text-muted-foreground/60 mt-1">
                This action is irreversible. All your data, teams, and
                hackathons will be permanently removed.
              </p>
            </div>
            <Button
              variant="outline"
              className="font-mono text-xs rounded-none border-red-500/30 text-red-500 hover:bg-red-500/10 hover:border-red-500/50"
            >
              DELETE ACCOUNT
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
