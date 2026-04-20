"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTranslations } from "next-intl";
import { MessageCircle, Dumbbell, TrendingUp, Settings, Heart } from "lucide-react";
import { cn } from "@/lib/utils";
import { Tooltip } from "@/components/ui/Tooltip";

const navItems = [
  { key: "coach", icon: MessageCircle, href: "/coach" },
  { key: "exercises", icon: Dumbbell, href: "/exercises" },
  { key: "progress", icon: TrendingUp, href: "/progress" },
  { key: "support", icon: Heart, href: "/support" },
  { key: "settings", icon: Settings, href: "/settings" },
];

export function Navbar({ locale }: { locale: string }) {
  const t = useTranslations("nav");
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-slate-200 safe-bottom">
      <div className="max-w-md mx-auto flex items-center justify-around px-2 py-1">
        {navItems.map(({ key, icon: Icon, href }) => {
          const fullHref = `/${locale}${href}`;
          const active = pathname.includes(href);
          return (
            <Tooltip key={key} content={t(key)} position="top">
              <Link
                href={fullHref}
                className={cn(
                  "flex flex-col items-center gap-0.5 px-3 py-2 rounded-xl transition-colors",
                  active
                    ? "text-indigo-600"
                    : "text-slate-400 hover:text-slate-600"
                )}
              >
                <Icon size={22} strokeWidth={active ? 2.5 : 1.8} />
                <span className="text-[10px] font-medium">{t(key)}</span>
              </Link>
            </Tooltip>
          );
        })}
      </div>
    </nav>
  );
}
