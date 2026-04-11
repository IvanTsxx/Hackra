import Image from "next/image";

import type { User } from "@/app/generated/prisma/client";
import { cn } from "@/lib/utils";

interface AvatarGroupProps {
  users: User[];
  max?: number;
  size?: "sm" | "md";
  className?: string;
}

export function AvatarGroup({
  users,
  max = 5,
  size = "sm",
  className,
}: AvatarGroupProps) {
  const visible = users.slice(0, max);
  const overflow = users.length - max;

  const sizeClass = size === "sm" ? "w-6 h-6 text-xs" : "w-8 h-8 text-xs";
  const borderClass = "border-2 border-background";

  return (
    <div className={cn("flex items-center", className)}>
      <div className="flex -space-x-1.5">
        {visible.map((user) => (
          <div
            key={user?.id}
            className={cn(
              sizeClass,
              borderClass,
              "rounded-full overflow-hidden bg-secondary shrink-0"
            )}
          >
            <Image
              src={user?.image || ""}
              alt={user?.name || ""}
              width={32}
              height={32}
              sizes="24px"
              className="w-full h-full object-cover"
            />
          </div>
        ))}
        {overflow > 0 && (
          <div
            className={cn(
              sizeClass,
              borderClass,
              "rounded-full bg-secondary text-muted-foreground flex items-center justify-center   shrink-0"
            )}
          >
            +{overflow}
          </div>
        )}
      </div>
    </div>
  );
}
