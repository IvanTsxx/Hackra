import type { ElementType, ComponentPropsWithoutRef } from "react";

type CodeTextProps<T extends ElementType> = {
  as?: T;
  children: React.ReactNode;
  className?: string;
} & ComponentPropsWithoutRef<T>;

export function CodeText<T extends ElementType = "p">({
  as,
  children,
  className,
  ...props
}: CodeTextProps<T>) {
  const Component = as || "p";

  return (
    <Component
      className={`font-mono text-muted-foreground ${className ?? ""}`}
      {...props}
    >
      {"// "} {children}
    </Component>
  );
}
