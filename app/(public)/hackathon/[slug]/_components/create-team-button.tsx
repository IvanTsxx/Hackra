import { Plus } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { getCurrentUser } from "@/data/auth-dal";
import { AuthModalDialog } from "@/shared/components/auth";

export const CreateTeamButton = async ({
  organizerId,
  slug,
}: {
  slug: string;
  organizerId: string;
}) => {
  const user = await getCurrentUser();

  if (user?.id === organizerId) return null;

  return (
    <>
      {user ? (
        <Link href={`/hackathon/${slug}/teams/create`}>
          <Button className=" text-xs tracking-wider rounded-none bg-foreground text-background hover:bg-foreground/90 h-9 px-4">
            <Plus size={12} className="mr-1.5" /> CREATE TEAM
          </Button>
        </Link>
      ) : (
        <AuthModalDialog
          isRender
          callbackUrl={`/hackathon/${slug}/teams/create`}
          renderComponent={
            <Button className=" text-xs tracking-wider rounded-none bg-foreground text-background hover:bg-foreground/90 h-9 px-4" />
          }
        >
          <Plus size={12} className="mr-1.5" /> CREATE TEAM
        </AuthModalDialog>
      )}
    </>
  );
};
