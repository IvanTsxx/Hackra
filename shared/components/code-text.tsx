import type { ReactNode } from "react";

import { cn } from "../lib/utils";

type ElementType =
  | "p"
  | "span"
  | "div"
  | "h1"
  | "h2"
  | "h3"
  | "h4"
  | "h5"
  | "h6"
  | "label"
  | "li"
  | "td"
  | "th";

interface CodeTextProps {
  as?: ElementType;
  children: ReactNode;
  className?: string;
}

export function CodeText({
  as: Component = "p",
  children,
  className,
}: CodeTextProps) {
  return (
    <Component
      className={cn("text-muted-foreground lowercase text-xs", className)}
    >
      {"// "} {children}
    </Component>
  );
}
