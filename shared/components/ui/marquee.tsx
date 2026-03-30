"use client";

import { cn } from "@/lib/utils";

interface MarqueeProps {
  children: React.ReactNode;
  className?: string;
  reverse?: boolean;
  pauseOnHover?: boolean;
  speed?: "slow" | "normal" | "fast";
}

export function Marquee({
  children,
  className,
  reverse = false,
  pauseOnHover = true,
  speed = "normal",
}: MarqueeProps) {
  const speedMap = {
    fast: "15s",
    normal: "30s",
    slow: "60s",
  };

  return (
    <div
      className={cn(
        "flex overflow-hidden mask-[linear-gradient(to_right,transparent,white_10%,white_90%,transparent)]",
        className
      )}
    >
      <div
        className={cn("flex shrink-0 gap-8", pauseOnHover && "hover:paused")}
        style={{
          animation: `marquee ${speedMap[speed]} linear infinite ${reverse ? "reverse" : ""}`,
        }}
      >
        {children}
        {children}
      </div>
    </div>
  );
}
