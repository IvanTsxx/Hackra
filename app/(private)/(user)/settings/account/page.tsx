import "server-only";
import { ChevronRight, Trash2, Mail, Shield } from "lucide-react";

import { AnimatedSection } from "@/app/(private)/(user)/_components/animated-section";
import { getCurrentUser } from "@/data/auth-dal";
import { CodeText } from "@/shared/components/code-text";
import { prisma } from "@/shared/lib/prisma";

import { DeleteAccountButton } from "./_components/delete-account-button";

export default async function SettingsAccountPage() {
  const currentUser = await getCurrentUser();
  const accounts = await prisma.account.findMany({
    select: {
      id: true,
      providerId: true,
    },
    where: {
      userId: currentUser?.id,
    },
  });

  return (
    <section>
      {/* Breadcrumb */}
      <div className="flex items-center gap-2   text-sm text-muted-foreground mb-6 mt-4">
        <span>SETTINGS</span>
        <ChevronRight size={10} />
        <span className="text-foreground">ACCOUNT</span>
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
            <h2 className="  text-xs tracking-widest text-foreground">EMAIL</h2>
          </div>
          <div className="border border-border/30 bg-secondary/10 p-4 space-y-3">
            <p className="  text-xs text-muted-foreground">Current email</p>
            <p className="  text-sm text-foreground mt-1">
              {currentUser?.email}
            </p>
          </div>
        </div>

        {/* Security section */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Shield size={14} className="text-brand-green" />
            <h2 className="  text-xs tracking-widest text-foreground">
              SECURITY
            </h2>
          </div>
          <div className="border border-border/30 bg-secondary/10 p-4 space-y-3">
            <p className="  text-xs text-muted-foreground">
              Connected accounts
            </p>
            <p className="  text-sm text-foreground mt-1">
              {accounts.map((account) => (
                <span key={account.id}>{account.providerId}</span>
              ))}
            </p>
          </div>
        </div>

        {/* Danger zone */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Trash2 size={14} className="text-red-500" />
            <h2 className="  text-xs tracking-widest text-red-500">
              DANGER ZONE
            </h2>
          </div>
          <div className="border border-red-500/20 bg-red-500/5 p-4 space-y-3">
            <div>
              <p className="  text-xs text-muted-foreground">
                Delete your account
              </p>
              <p className="  text-sm text-muted-foreground/60 mt-1">
                This action is irreversible. All your data, teams, and
                hackathons will be permanently removed.
              </p>
            </div>
            <DeleteAccountButton />
          </div>
        </div>
      </div>
    </section>
  );
}
