import type { Metadata } from "next";
import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import { notFound } from "next/navigation";
import { routing } from "@/i18n/routing";
import { Navbar } from "@/components/navigation/Navbar";
import { TopBar } from "@/components/navigation/TopBar";
import { AchievementToast } from "@/components/ui/AchievementToast";
import { WeekCompleteModal } from "@/components/ui/WeekCompleteModal";
import { NotificationManager } from "@/components/ui/NotificationManager";
import "../globals.css";

export const metadata: Metadata = {
  title: "YesMan App — Learn to Say No",
  description: "Build healthy boundaries. Stop people-pleasing.",
};

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  if (!routing.locales.includes(locale as never)) notFound();

  const messages = await getMessages();

  return (
    <NextIntlClientProvider messages={messages}>
      <div className="max-w-md mx-auto min-h-screen flex flex-col relative">
        {/* Global language switcher — visible on every page */}
        <TopBar />
        {/* pt-11 offsets the fixed TopBar height (44px) */}
        <main className="flex-1 pt-11 pb-20">{children}</main>
        <Navbar locale={locale} />
        <AchievementToast />
        <WeekCompleteModal />
        <NotificationManager />
      </div>
    </NextIntlClientProvider>
  );
}
