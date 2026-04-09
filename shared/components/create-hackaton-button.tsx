"use client";

import Link from "next/link";

import { Button } from "@/components/ui/button";

import type { User } from "../lib/auth";
import { AuthModalDialog } from "./auth";

export const CreateHackatonButton = ({ user }: { user?: User | null }) => (
  <>
    {user ? (
      <Button
        size="lg"
        className="gap-2 w-full sm:w-auto uppercase tracking-wider text-xs glow-primary"
        render={<Link href="/create" />}
        nativeButton={false}
      >
        Create Hackathon
      </Button>
    ) : (
      <AuthModalDialog
        isRender
        renderComponent={
          <Button
            size="lg"
            className="gap-2 w-full sm:w-auto uppercase tracking-wider text-xs glow-primary"
            nativeButton={false}
          />
        }
      >
        Create Hackathon
      </AuthModalDialog>
    )}
  </>
);
