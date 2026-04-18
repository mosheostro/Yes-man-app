import type { Metadata, Viewport } from "next";
import { getLocale } from "next-intl/server";
import "./globals.css";

export const metadata: Metadata = {
  title: "YesMan App — Learn to Say No",
  description: "A personalized program to help you build healthy boundaries and stop people-pleasing.",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "YesMan",
  },
  icons: {
    icon: "/icons/icon-192.svg",
    apple: "/icons/icon-192.svg",
  },
};

export const viewport: Viewport = {
  themeColor: "#4f46e5",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const locale = await getLocale();
  const isRTL = locale === "he";

  return (
    <html lang={locale} dir={isRTL ? "rtl" : "ltr"} className="h-full">
      <body className="min-h-full bg-slate-50">{children}</body>
    </html>
  );
}
