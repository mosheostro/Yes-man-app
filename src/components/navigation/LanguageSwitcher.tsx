"use client";

import { useRouter, usePathname } from "next/navigation";
import { useLocale } from "next-intl";
import { useAppStore } from "@/stores/appStore";
import type { Locale } from "@/types";

const LOCALES: { code: Locale; label: string }[] = [
  { code: "en", label: "EN" },
  { code: "ru", label: "RU" },
  { code: "he", label: "HE" },
  { code: "de", label: "DE" },
];

export function LanguageSwitcher() {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const { profile, updateProfile } = useAppStore();

  function switchLocale(newLocale: Locale) {
    if (newLocale === locale) return;

    // Persist locale to profile store (single source of truth)
    if (profile) {
      updateProfile({ locale: newLocale });
    }

    // Navigate to new locale URL
    const segments = pathname.split("/");
    segments[1] = newLocale;
    router.push(segments.join("/"));
  }

  return (
    <div className="flex gap-1">
      {LOCALES.map(({ code, label }) => (
        <button
          key={code}
          onClick={() => switchLocale(code)}
          className={`px-2 py-1 rounded-lg text-xs font-semibold transition-colors ${
            locale === code
              ? "bg-indigo-600 text-white"
              : "bg-slate-100 text-slate-500 hover:bg-slate-200"
          }`}
        >
          {label}
        </button>
      ))}
    </div>
  );
}
