import { cn } from "@/lib/utils";

interface ProgressBarProps {
  value: number;
  max?: number;
  color?: "indigo" | "emerald" | "amber" | "rose";
  size?: "sm" | "md";
  showLabel?: boolean;
  className?: string;
}

export function ProgressBar({
  value,
  max = 100,
  color = "indigo",
  size = "md",
  showLabel = false,
  className,
}: ProgressBarProps) {
  const pct = Math.min(100, Math.round((value / max) * 100));
  return (
    <div className={cn("w-full", className)}>
      {showLabel && (
        <div className="flex justify-between text-xs text-slate-500 mb-1">
          <span>{value} / {max}</span>
          <span>{pct}%</span>
        </div>
      )}
      <div
        className={cn("w-full rounded-full bg-slate-100", {
          sm: "h-1.5",
          md: "h-2.5",
        }[size])}
      >
        <div
          className={cn("h-full rounded-full transition-all duration-500", {
            indigo: "bg-indigo-500",
            emerald: "bg-emerald-500",
            amber: "bg-amber-500",
            rose: "bg-rose-500",
          }[color])}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}
