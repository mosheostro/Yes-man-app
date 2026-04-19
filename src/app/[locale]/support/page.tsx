"use client";

import { useTranslations } from "next-intl";
import { useParams } from "next/navigation";
import { useAppStore } from "@/stores/appStore";
import { Card } from "@/components/ui/Card";
import { PageTransition } from "@/components/ui/PageTransition";
import { Badge } from "@/components/ui/Badge";
import { Heart, Star, Coffee, Sparkles, ExternalLink } from "lucide-react";

export default function SupportPage() {
  const t = useTranslations("support");
  const params = useParams();
  const { profile, updateProfile } = useAppStore();
  const locale = profile?.locale ?? (params.locale as string) ?? "en";

  function handleSupport(url: string) {
    if (profile && !profile.achievements.includes("supporter")) {
      updateProfile({ achievements: [...profile.achievements, "supporter"] });
    }
    window.open(url, "_blank", "noopener,noreferrer");
  }

  const isSupporter = profile?.achievements?.includes("supporter") ?? false;

  return (
    <PageTransition>
      <div className="px-5 py-8 space-y-6">

        {/* Header */}
        <div className="text-center space-y-2">
          <div className="text-5xl">💜</div>
          <h1 className="text-xl font-bold text-slate-800">{t("title")}</h1>
          <p className="text-sm text-slate-500 leading-relaxed">{t("subtitle")}</p>
        </div>

        {/* Supporter badge section */}
        <Card variant="elevated">
          {isSupporter ? (
            <div className="flex items-center gap-3">
              <span className="text-2xl">🌟</span>
              <Badge label={t("supporterBadge")} variant="amber" className="text-sm font-semibold px-3 py-1" />
            </div>
          ) : (
            <p className="text-sm text-slate-500 text-center">{t("badgeTeaser")}</p>
          )}
        </Card>

        {/* Support methods */}
        <div className="space-y-3">

          {/* PayPal */}
          <a
            href="#"
            onClick={(e) => { e.preventDefault(); handleSupport("https://www.paypal.com/ncp/payment/X7V2TXE6VA95L"); }}
            rel="noopener noreferrer"
            className="block transition-all cursor-pointer"
          >
            <Card className="border border-blue-100 bg-blue-50 hover:border-blue-300 transition-all">
              <div className="flex items-center gap-3 p-1">
                <Coffee size={20} className="text-blue-500 shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-slate-700">{t("paypalTitle")}</p>
                  <p className="text-xs text-slate-500">Energy Exchange, Dana</p>
                </div>
                <img
                  src={`https://api.qrserver.com/v1/create-qr-code/?size=56x56&margin=2&data=${encodeURIComponent("https://www.paypal.com/ncp/payment/X7V2TXE6VA95L")}`}
                  alt="QR"
                  width={56}
                  height={56}
                  className="rounded shrink-0"
                />
              </div>
            </Card>
          </a>

          {/* Bit — Israel only */}
          <Card className="border border-pink-100 bg-pink-50">
            <div className="flex items-center gap-3 p-1">
              <Heart size={20} className="text-pink-500 shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-slate-700 mb-0.5">Bit</p>
                {locale === "ru" && (
                  <p className="text-xs text-slate-500">только для Израиля · <span className="font-semibold text-pink-700">+972-54-998-9627</span><br />Имя: Островский Моше</p>
                )}
                {locale === "he" && (
                  <p className="text-xs text-slate-500" dir="rtl">לישראל בלבד · <span className="font-semibold text-pink-700" dir="ltr">+972-54-998-9627</span><br />שם: משה אוסטרובסקי</p>
                )}
                {locale === "de" && (
                  <p className="text-xs text-slate-500">nur für Israel · <span className="font-semibold text-pink-700">+972-54-998-9627</span><br />Name: Moshe Ostrovsky</p>
                )}
                {(locale === "en" || (locale !== "ru" && locale !== "he" && locale !== "de")) && (
                  <p className="text-xs text-slate-500">Israel only · <span className="font-semibold text-pink-700">+972-54-998-9627</span><br />Name: Moshe Ostrovsky</p>
                )}
              </div>
              {/* QR encodes the phone number — scan to open Bit and pay */}
              <img
                src={`https://api.qrserver.com/v1/create-qr-code/?size=56x56&margin=2&data=${encodeURIComponent("+972549989627")}`}
                alt="Bit QR"
                width={56}
                height={56}
                className="rounded shrink-0"
              />
            </div>
          </Card>

          {/* Paybox — Israel only */}
          <Card className="border border-rose-100 bg-rose-50">
            <div className="flex items-center gap-3 p-1">
              <Heart size={20} className="text-rose-500 shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-slate-700 mb-0.5">Paybox</p>
                {locale === "ru" && (
                  <p className="text-xs text-slate-500">только для Израиля · <span className="font-semibold text-rose-700">+972-54-998-9627</span><br />Имя: Островский Моше</p>
                )}
                {locale === "he" && (
                  <p className="text-xs text-slate-500" dir="rtl">לישראל בלבד · <span className="font-semibold text-rose-700" dir="ltr">+972-54-998-9627</span><br />שם: משה אוסטרובסקי</p>
                )}
                {locale === "de" && (
                  <p className="text-xs text-slate-500">nur für Israel · <span className="font-semibold text-rose-700">+972-54-998-9627</span><br />Name: Moshe Ostrovsky</p>
                )}
                {(locale === "en" || (locale !== "ru" && locale !== "he" && locale !== "de")) && (
                  <p className="text-xs text-slate-500">Israel only · <span className="font-semibold text-rose-700">+972-54-998-9627</span><br />Name: Moshe Ostrovsky</p>
                )}
              </div>
              {/* vCard QR — scan to save contact, then open Paybox */}
              <img
                src={`https://api.qrserver.com/v1/create-qr-code/?size=56x56&margin=2&data=${encodeURIComponent("BEGIN:VCARD\nVERSION:3.0\nFN:Moshe Ostrovsky\nTEL:+972549989627\nEND:VCARD")}`}
                alt="Paybox contact QR"
                width={56}
                height={56}
                className="rounded shrink-0"
              />
            </div>
          </Card>

          {/* Credit card via Grow */}
          <a
            href="#"
            onClick={(e) => { e.preventDefault(); handleSupport("https://pay.grow.link/278bc2b07613f3d945d91696825ff5cc-MzMwMTIzOQ"); }}
            rel="noopener noreferrer"
            className="block transition-all cursor-pointer"
          >
            <Card className="border border-amber-100 bg-amber-50 hover:border-amber-300 transition-all">
              <div className="flex items-center gap-3 p-1">
                <Star size={20} className="text-amber-500 shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-slate-700">{t("stripeTitle")}</p>
                  <p className="text-xs text-slate-500">{t("stripeDesc")}</p>
                </div>
                {/* QR code — scan to pay directly on mobile */}
                <img
                  src={`https://api.qrserver.com/v1/create-qr-code/?size=56x56&margin=2&data=${encodeURIComponent("https://pay.grow.link/278bc2b07613f3d945d91696825ff5cc-MzMwMTIzOQ")}`}
                  alt="QR"
                  width={56}
                  height={56}
                  className="rounded shrink-0"
                />
              </div>
            </Card>
          </a>
        </div>

        {/* Why support */}
        <Card variant="elevated">
          <div className="flex items-center gap-2 mb-3">
            <Sparkles size={18} className="text-indigo-500" />
            <p className="text-sm font-semibold text-slate-700">{t("whyTitle")}</p>
          </div>
          <ul className="space-y-1.5 text-sm text-slate-600">
            <li>{t("why1")}</li>
            <li>{t("why2")}</li>
            <li>{t("why3")}</li>
          </ul>
        </Card>

        {/* Footer */}
        <p className="text-center text-xs text-slate-400 leading-relaxed pb-4">
          {t("footerMsg")}
        </p>

      </div>
    </PageTransition>
  );
}
