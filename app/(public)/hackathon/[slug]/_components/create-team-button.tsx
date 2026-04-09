import { Plus } from "lucide-react";
import Link from "next/link";

import { AuthModalDialog } from "@/shared/components/auth";
import { Button } from "@/shared/components/ui/button";

export const CreateTeamButton = ({
  isLoggedIn,
  slug,
}: {
  isLoggedIn: boolean;
  slug: string;
}) => (
  <>
    {isLoggedIn ? (
      <Link href={`/teams/create/${slug}`}>
        <Button className="font-pixel text-xs tracking-wider rounded-none bg-foreground text-background hover:bg-foreground/90 h-9 px-4">
          <Plus size={12} className="mr-1.5" /> CREATE TEAM
        </Button>
      </Link>
    ) : (
      <AuthModalDialog
        isRender
        callbackUrl={`/teams/create/${slug}`}
        renderComponent={
          <Button className="font-pixel text-xs tracking-wider rounded-none bg-foreground text-background hover:bg-foreground/90 h-9 px-4" />
        }
      >
        <Plus size={12} className="mr-1.5" /> CREATE TEAM
      </AuthModalDialog>
    )}
  </>
);
