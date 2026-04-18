"use client";

import { useRouter, usePathname } from "next/navigation";
import { useLocale } from "next-intl";
import { useAppStore } from "@/stores/appStore";
import type { Locale } from "@/types";

const LOCALES: { code: Locale; flag: string; label: string }[] = [
  { code: "en", flag: "🇬🇧", label: "EN" },
  { code: "ru", flag: "🇷🇺", label: "RU" },
  { code: "he", flag: "🇮🇱", label: "HE" },
  { code: "de", flag: "🇩🇪", label: "DE" },
];

export function TopBar() {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const { profile, updateProfile } = useAppStore();

  function switchLocale(newLocale: Locale) {
    if (newLocale === locale) return;
    if (profile) updateProfile({ locale: newLocale });
    const segments = pathname.split("/");
    segments[1] = newLocale;
    router.push(segments.join("/"));
  }

  return (
    <div className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-sm border-b border-slate-100">
      <div className="max-w-md mx-auto flex items-center justify-end px-4 h-11 gap-1">
        {LOCALES.map(({ code, flag, label }) => {
          const active = locale === code;
          return (
            <button
              key={code}
              onClick={() => switchLocale(code)}
              title={label}
              className={`flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-semibold transition-all ${
                active
                  ? "bg-indigo-600 text-white shadow-sm scale-105"
                  : "text-slate-500 hover:bg-slate-100"
              }`}
            >
              <span className="text-sm leading-none">{flag}</span>
              <span className="hidden xs:inline">{label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
