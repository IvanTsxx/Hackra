"use client";

import { User, Settings, FileText, Users, Trophy } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { LogoutButton } from "@/shared/components/auth/log-out-button";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/shared/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/shared/components/ui/dropdown-menu";
import type { User as UserType } from "@/shared/lib/auth";

export function UserMenu({
  user,
}: {
  user: Pick<UserType, "name" | "username" | "image">;
}) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <Button
            size="sm"
            variant="outline"
            className="rounded-full p-0 size-8"
          />
        }
      >
        <Avatar>
          <AvatarImage src={user.image || ""} />
          <AvatarFallback>{user.name?.charAt(0).toUpperCase()}</AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        className="rounded-none border-border/50 bg-background/95 backdrop-blur-md p-0 min-w-56"
      >
        {/* Header with user info */}
        <DropdownMenuGroup>
          <DropdownMenuLabel className="px-3 py-2.5 border-b border-border/40">
            <div className="flex items-center gap-2.5">
              <Avatar size="sm">
                <AvatarImage src={user.image || ""} />
                <AvatarFallback>
                  {user.name?.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="flex flex-col min-w-0">
                <span className="font-pixel text-xs tracking-wider text-foreground truncate">
                  {user.name?.toUpperCase()}
                </span>
                <span className="  text-xs text-muted-foreground truncate">
                  @{user.username}
                </span>
              </div>
            </div>
          </DropdownMenuLabel>
        </DropdownMenuGroup>

        {/* Menu items */}
        <div className="py-1">
          <DropdownMenuItem
            nativeButton={false}
            className="rounded-none px-1 py-0.5"
          >
            <Link
              href={`/user/${user.username}`}
              className="flex items-center gap-2.5 font-pixel text-xs tracking-wider text-foreground w-full"
            >
              <User size={14} className="text-muted-foreground shrink-0" />
              My Profile
            </Link>
          </DropdownMenuItem>

          <DropdownMenuItem
            nativeButton={false}
            className="rounded-none px-1 py-0.5"
          >
            <Link
              href="/my-applications"
              className="flex items-center gap-2.5 font-pixel text-xs tracking-wider text-foreground w-full"
            >
              <FileText size={14} className="text-muted-foreground shrink-0" />
              My Applications
            </Link>
          </DropdownMenuItem>

          <DropdownMenuItem
            nativeButton={false}
            className="rounded-none px-1 py-0.5"
          >
            <Link
              href="/my-teams"
              className="flex items-center gap-2.5 font-pixel text-xs tracking-wider text-foreground w-full"
            >
              <Users size={14} className="text-muted-foreground shrink-0" />
              My Teams
            </Link>
          </DropdownMenuItem>

          <DropdownMenuItem
            nativeButton={false}
            className="rounded-none px-1 py-0.5"
          >
            <Link
              href="/my-hackathons"
              className="flex items-center gap-2.5 font-pixel text-xs tracking-wider text-foreground w-full"
              suppressHydrationWarning
            >
              <Trophy size={14} className="text-muted-foreground shrink-0" />
              My Hackathons
            </Link>
          </DropdownMenuItem>

          <DropdownMenuSeparator />

          <DropdownMenuItem
            nativeButton={false}
            className="rounded-none px-1 py-0.5"
          >
            <Link
              href="/settings/profile"
              className="flex items-center gap-2.5 font-pixel text-xs tracking-wider text-foreground w-full"
            >
              <Settings size={14} className="text-muted-foreground shrink-0" />
              Settings
            </Link>
          </DropdownMenuItem>
        </div>

        <DropdownMenuSeparator />

        <DropdownMenuItem
          nativeButton={false}
          variant="destructive"
          className="rounded-none px-1 py-0.5"
        >
          <LogoutButton />
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
