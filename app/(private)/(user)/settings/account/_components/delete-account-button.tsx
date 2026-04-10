"use client";

import { useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/shared/components/ui/alert-dialog";

import { deleteAccount } from "../_actions";

export const DeleteAccountButton = () => {
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);

  const onOpenChange = (open: boolean) => {
    setOpen(open);
  };

  const handleDelete = async () => {
    setLoading(true);
    const result = await deleteAccount();
    setLoading(false);
    if (result.error) {
      toast.error(result.error);
    }
    setOpen(false);
  };

  /*   return (
    <Button
      variant="outline"
      className="  text-xs rounded-none border-red-500/30 text-red-500 hover:bg-red-500/10 hover:border-red-500/50"
      onClick={handleDelete}
      disabled={loading}
    >
      {loading ? "Deleting..." : "DELETE ACCOUNT"}
    </Button>
  ); */

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogTrigger
        render={
          <Button
            variant="outline"
            className="  text-xs rounded-none border-red-500/30 text-red-500 hover:bg-red-500/10 hover:border-red-500/50"
          />
        }
      >
        {loading ? "Deleting..." : "DELETE ACCOUNT"}
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete your
            account and remove your data from our servers.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction variant="destructive" onClick={handleDelete}>
            Continue
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
