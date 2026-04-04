import "server-only";
import { ChevronRight, Trash2, Mail, Shield } from "lucide-react";
import { motion } from "motion/react";
import Link from "next/link";

import { Button } from "@/components/ui/button";

const NAV_ITEMS: { active: boolean; href: string; label: string }[] = [
  { active: false, href: "/settings/profile", label: "PROFILE" },
  { active: true, href: "/settings/account", label: "ACCOUNT" },
  { active: false, href: "/settings/notifications", label: "NOTIFICATIONS" },
];

export default function SettingsAccountPage() {
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
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-1 mb-7"
          >
            <p className="font-mono text-xs text-brand-green tracking-widest">
              {/* settings */}
            </p>
            <h1 className="font-pixel text-2xl text-foreground">ACCOUNT</h1>
          </motion.div>

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
        </div>
      </div>
    </main>
  );
}
