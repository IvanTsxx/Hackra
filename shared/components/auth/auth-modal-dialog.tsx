// oxlint-disable typescript/no-explicit-any
"use client";

import type {
  ComponentRenderFn,
  DialogTriggerState,
  HTMLProps,
} from "@base-ui/react";
import { motion } from "motion/react";
import type { JSXElementConstructor, ReactElement } from "react";

import { CodeText } from "@/shared/components/code-text";
import { Icons } from "@/shared/components/icons";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@/shared/components/ui/dialog";
import { signIn } from "@/shared/lib/auth-client";

const FEATURES = [
  "> join 150+ hackathons",
  "> form and manage teams",
  "> track your projects",
  "> earn karma points",
];

export function AuthModalDialog({
  children,
  isRender = false,
  renderComponent,
  callbackUrl,
}: {
  children?: React.ReactNode;
  isRender?: boolean;
  renderComponent?:
    | ReactElement<unknown, string | JSXElementConstructor<any>>
    | ComponentRenderFn<HTMLProps, DialogTriggerState>
    | undefined;
  callbackUrl?: string;
}) {
  const handleOAuth = (provider: "github") => {
    signIn.social({
      callbackURL: callbackUrl,
      provider,
    });
  };

  return (
    <Dialog>
      {children ? (
        isRender ? (
          <DialogTrigger render={renderComponent}>{children}</DialogTrigger>
        ) : (
          <DialogTrigger>{children}</DialogTrigger>
        )
      ) : null}
      <DialogContent className="rounded-none border-border/50 p-0 max-w-md overflow-hidden bg-background gap-0">
        {/* Header */}
        <div className="flex items-center justify-between px-6 pt-5 pb-0">
          <div className="space-y-0.5">
            <CodeText as="p">hackra.auth()</CodeText>
            <DialogTitle className=" text-base text-foreground tracking-wider">
              WELCOME
            </DialogTitle>
          </div>
        </div>

        <div className="px-6 py-6 space-y-4">
          <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.15 }}
            className="space-y-3"
          >
            {/* GitHub */}
            <button
              type="button"
              onClick={() => handleOAuth("github")}
              className="w-full flex items-center gap-3 border border-border/50 bg-secondary/10 px-4 py-3 hover:border-foreground/40 hover:bg-secondary/20 transition-all group"
            >
              <Icons.Github className="shrink-0 text-foreground/70 group-hover:text-foreground transition-colors" />
              <span className=" text-sm tracking-wider text-foreground/80 group-hover:text-foreground transition-colors">
                CONTINUE WITH GITHUB
              </span>
            </button>
          </motion.div>

          {/* Divider */}
          <div className="flex items-center gap-3">
            <div className="flex-1 border-t border-border/30" />
            <span className="  text-xs text-muted-foreground/50 tracking-widest">
              NO PASSWORD REQUIRED
            </span>
            <div className="flex-1 border-t border-border/30" />
          </div>

          {/* Feature list */}
          <div className="border border-border/20 bg-secondary/5 p-4 space-y-1.5">
            {FEATURES.map((f) => (
              <p key={f} className="  text-xs text-muted-foreground/70">
                {f}
              </p>
            ))}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
