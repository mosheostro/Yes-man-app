"use client";

import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { useLocale } from "next-intl";
import { useAppStore } from "@/stores/appStore";
import { Home } from "lucide-react";
import { Tooltip } from "@/components/ui/Tooltip";
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
      <div className="max-w-md mx-auto flex items-center px-4 h-11 gap-1">
        {/* Home link — only shown after onboarding is complete */}
        {profile?.onboardingComplete && (
          <Tooltip content="Dashboard" position="bottom">
            <Link
              href={`/${locale}/dashboard`}
              className="flex items-center justify-center w-8 h-8 rounded-lg text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 transition-colors mr-1"
            >
              <Home size={17} />
            </Link>
          </Tooltip>
        )}
        <div className="flex items-center gap-1 ml-auto">
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
    </div>
  );
}
