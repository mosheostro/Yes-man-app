import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import type { DiagnosticSeverity } from "@/types";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getDiagnosticSeverity(score: number): DiagnosticSeverity {
  if (score <= 40) return "mild";
  if (score <= 65) return "moderate";
  return "severe";
}

export function getDiagnosticColor(severity: DiagnosticSeverity): string {
  return {
    mild: "text-emerald-600",
    moderate: "text-amber-600",
    severe: "text-rose-600",
  }[severity];
}

export function formatDate(iso: string, locale: string): string {
  return new Date(iso).toLocaleDateString(locale, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export function today(): string {
  return new Date().toISOString().split("T")[0];
}

export function calculateStreak(lastActive: string, currentStreak: number): number {
  const last = new Date(lastActive);
  const now = new Date();
  const diffDays = Math.floor((now.getTime() - last.getTime()) / 86400000);
  if (diffDays === 0) return currentStreak;
  if (diffDays === 1) return currentStreak + 1;
  return 0;
}
