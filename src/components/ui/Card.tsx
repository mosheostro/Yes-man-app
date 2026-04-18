import { cn } from "@/lib/utils";
import type { HTMLAttributes } from "react";

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "glass" | "elevated";
}

export function Card({ variant = "default", className, children, ...props }: CardProps) {
  return (
    <div
      className={cn(
        "rounded-2xl p-5",
        {
          default: "bg-white border border-slate-200",
          glass: "bg-white/70 backdrop-blur-md border border-white/60 shadow-sm",
          elevated: "bg-white shadow-md border border-slate-100",
        }[variant],
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}
