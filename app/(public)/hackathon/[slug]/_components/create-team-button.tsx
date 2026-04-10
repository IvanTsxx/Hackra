import { Plus } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { AuthModalDialog } from "@/shared/components/auth";

export const CreateTeamButton = ({
  isLoggedIn,
  slug,
  isOwner,
}: {
  isLoggedIn: boolean;
  slug: string;
  isOwner: boolean;
}) => {
  // Don't show button if user is the organizer
  if (isOwner) return null;

  return (
    <>
      {isLoggedIn ? (
        <Link href={`/hackathon/${slug}/teams/create`}>
          <Button className="font-pixel text-xs tracking-wider rounded-none bg-foreground text-background hover:bg-foreground/90 h-9 px-4">
            <Plus size={12} className="mr-1.5" /> CREATE TEAM
          </Button>
        </Link>
      ) : (
        <AuthModalDialog
          isRender
          callbackUrl={`/hackathon/${slug}/teams/create`}
          renderComponent={
            <Button className="font-pixel text-xs tracking-wider rounded-none bg-foreground text-background hover:bg-foreground/90 h-9 px-4" />
          }
        >
          <Plus size={12} className="mr-1.5" /> CREATE TEAM
        </AuthModalDialog>
      )}
    </>
  );
};
