"use client";

import { motion, AnimatePresence } from "motion/react";

import { CodeText } from "@/shared/components/code-text";
import { Icons } from "@/shared/components/icons";
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "@/shared/components/ui/dialog";
import { signIn } from "@/shared/lib/auth-client";
import { useAuth } from "@/shared/lib/auth-context";

const FEATURES = [
  "> join 150+ hackathons",
  "> form and manage teams",
  "> track your projects",
  "> earn karma points",
];

export function AuthModalDialog() {
  const { open, tab, setTab, closeAuth } = useAuth();

  const handleOAuth = (provider: "google" | "github") => {
    signIn.social({
      provider,
    });
  };

  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && closeAuth()}>
      <DialogContent className="rounded-none border-border/50 p-0 max-w-md overflow-hidden bg-background gap-0">
        {/* Header */}
        <div className="flex items-center justify-between px-6 pt-5 pb-0">
          <div className="space-y-0.5">
            <CodeText as="p">hackra.auth()</CodeText>
            <DialogTitle className="font-pixel text-base text-foreground tracking-wider">
              {tab === "login" ? "WELCOME_BACK" : "CREATE_ACCOUNT"}
            </DialogTitle>
          </div>
        </div>

        {/* Tab switcher */}
        <div className="flex border-b border-border/40 mt-4 px-6">
          {(["login", "signup"] as const).map((t) => (
            <button
              type="button"
              key={t}
              onClick={() => setTab(t)}
              className={`font-pixel text-[10px] tracking-wider pb-2.5 px-1 mr-5 border-b-2 transition-all ${
                t === tab
                  ? "border-brand-green text-brand-green"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              }`}
            >
              {t === "login" ? "LOG IN" : "SIGN UP"}
            </button>
          ))}
        </div>

        <div className="px-6 py-6 space-y-4">
          <AnimatePresence mode="wait">
            <motion.div
              key={tab}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.15 }}
              className="space-y-3"
            >
              {/* Google */}
              <button
                type="button"
                onClick={() => handleOAuth("google")}
                className="w-full flex items-center gap-3 border border-border/50 bg-secondary/10 px-4 py-3 hover:border-border/80 hover:bg-secondary/20 transition-all group"
              >
                <Icons.Google className="w-4 h-4 shrink-0" />
                <span className="font-pixel text-[11px] tracking-wider text-foreground/80 group-hover:text-foreground transition-colors">
                  CONTINUE WITH GOOGLE
                </span>
              </button>

              {/* GitHub */}
              <button
                type="button"
                onClick={() => handleOAuth("github")}
                className="w-full flex items-center gap-3 border border-border/50 bg-secondary/10 px-4 py-3 hover:border-foreground/40 hover:bg-secondary/20 transition-all group"
              >
                <Icons.Github className="shrink-0 text-foreground/70 group-hover:text-foreground transition-colors" />
                <span className="font-pixel text-[11px] tracking-wider text-foreground/80 group-hover:text-foreground transition-colors">
                  CONTINUE WITH GITHUB
                </span>
              </button>
            </motion.div>
          </AnimatePresence>

          {/* Divider */}
          <div className="flex items-center gap-3">
            <div className="flex-1 border-t border-border/30" />
            <span className="font-mono text-[9px] text-muted-foreground/50 tracking-widest">
              NO PASSWORD REQUIRED
            </span>
            <div className="flex-1 border-t border-border/30" />
          </div>

          {/* Feature list */}
          <div className="border border-border/20 bg-secondary/5 p-4 space-y-1.5">
            {FEATURES.map((f) => (
              <p
                key={f}
                className="font-mono text-[10px] text-muted-foreground/70"
              >
                {f}
              </p>
            ))}
          </div>

          {/* Footer switch */}
          <p className="font-mono text-[10px] text-muted-foreground/60 text-center">
            {tab === "login" ? (
              <>
                {"No account? "}
                <button
                  type="button"
                  onClick={() => setTab("signup")}
                  className="text-brand-green hover:underline cursor-pointer bg-transparent border-0 p-0 font-mono text-[10px]"
                >
                  SIGN UP FREE
                </button>
              </>
            ) : (
              <>
                {"Already have an account? "}
                <button
                  type="button"
                  onClick={() => setTab("login")}
                  className="text-brand-green hover:underline cursor-pointer bg-transparent border-0 p-0 font-mono text-[10px]"
                >
                  LOG IN
                </button>
              </>
            )}
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
