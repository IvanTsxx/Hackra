import Link from "next/link";

import { Button } from "@/components/ui/button";
import { getCurrentUser } from "@/data/auth-dal";

import { AuthModalDialog } from "./auth";

export const CreateHackatonButton = async () => {
  const user = await getCurrentUser();
  return (
    <>
      {user ? (
        <Button
          size="sm"
          className="uppercase tracking-wider text-xs glow-primary"
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
              size="sm"
              className="uppercase tracking-wider text-xs glow-primary"
            />
          }
        >
          Create Hackathon
        </AuthModalDialog>
      )}
    </>
  );
};
