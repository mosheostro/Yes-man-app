"use client";

import { cn } from "@/lib/utils";
import type { ButtonHTMLAttributes } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost" | "danger";
  size?: "sm" | "md" | "lg";
  loading?: boolean;
}

export function Button({
  variant = "primary",
  size = "md",
  loading = false,
  className,
  children,
  disabled,
  ...props
}: ButtonProps) {
  return (
    <button
      disabled={disabled || loading}
      className={cn(
        "inline-flex items-center justify-center rounded-xl font-semibold transition-all duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed",
        {
          primary:
            "bg-indigo-600 text-white hover:bg-indigo-700 focus-visible:ring-indigo-500 shadow-sm",
          secondary:
            "bg-white text-indigo-700 border border-indigo-200 hover:bg-indigo-50 focus-visible:ring-indigo-400",
          ghost:
            "bg-transparent text-slate-600 hover:bg-slate-100 focus-visible:ring-slate-400",
          danger:
            "bg-rose-600 text-white hover:bg-rose-700 focus-visible:ring-rose-500",
        }[variant],
        {
          sm: "text-sm px-3 py-1.5 gap-1.5",
          md: "text-sm px-4 py-2.5 gap-2",
          lg: "text-base px-6 py-3 gap-2",
        }[size],
        className
      )}
      {...props}
    >
      {loading ? (
        <span className="h-4 w-4 rounded-full border-2 border-current border-t-transparent animate-spin" />
      ) : null}
      {children}
    </button>
  );
}
