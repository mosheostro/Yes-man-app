import { cn } from "@/lib/utils";

interface BadgeProps {
  label: string;
  variant?: "indigo" | "emerald" | "amber" | "rose" | "slate";
  className?: string;
}

export function Badge({ label, variant = "indigo", className }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold",
        {
          indigo: "bg-indigo-100 text-indigo-700",
          emerald: "bg-emerald-100 text-emerald-700",
          amber: "bg-amber-100 text-amber-700",
          rose: "bg-rose-100 text-rose-700",
          slate: "bg-slate-100 text-slate-600",
        }[variant],
        className
      )}
    >
      {label}
    </span>
  );
}
