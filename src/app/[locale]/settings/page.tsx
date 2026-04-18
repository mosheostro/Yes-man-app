"use client";

import { useTranslations } from "next-intl";
import { useRouter, useParams } from "next/navigation";
import { useState, useEffect } from "react";
import { useAppStore } from "@/stores/appStore";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { LanguageSwitcher } from "@/components/navigation/LanguageSwitcher";
import { PageTransition } from "@/components/ui/PageTransition";
import { requestNotificationPermission } from "@/components/ui/NotificationManager";
import { Settings, AlertTriangle, Bell, BellOff, UserCircle2 } from "lucide-react";
import type { Gender } from "@/types";

export default function SettingsPage() {
  const t = useTranslations("settings");
  const params = useParams();
  const locale = params.locale as string;
  const router = useRouter();
  const { resetProgress, profile, updateProfile } = useAppStore();
  const gender: Gender = profile?.gender ?? "unspecified";
  const [showConfirm, setShowConfirm] = useState(false);
  const [notifEnabled, setNotifEnabled] = useState(false);
  const [notifSupported, setNotifSupported] = useState(false);

  useEffect(() => {
    setNotifSupported("Notification" in window);
    setNotifEnabled(localStorage.getItem("yesmanNotifications") === "true");
  }, []);

  async function toggleNotifications() {
    if (!notifEnabled) {
      const granted = await requestNotificationPermission(profile?.name ?? "");
      if (granted) {
        localStorage.setItem("yesmanNotifications", "true");
        setNotifEnabled(true);
      }
    } else {
      localStorage.setItem("yesmanNotifications", "false");
      setNotifEnabled(false);
    }
  }

  function handleReset() {
    resetProgress();
    setShowConfirm(false);
    router.push(`/${locale}`);
  }

  return (
    <PageTransition>
    <div className="px-5 py-8 space-y-5">
      <div className="flex items-center gap-3 mb-2">
        <Settings size={22} className="text-slate-600" />
        <h1 className="text-xl font-bold text-slate-800">{t("title")}</h1>
      </div>

      {/* Language */}
      <Card variant="elevated">
        <div className="flex items-center justify-between">
          <p className="text-sm font-semibold text-slate-700">{t("language")}</p>
          <LanguageSwitcher />
        </div>
      </Card>

      {/* Gender */}
      <Card variant="elevated">
        <div className="flex items-center gap-3 mb-3">
          <UserCircle2 size={18} className="text-indigo-500 shrink-0" />
          <div>
            <p className="text-sm font-semibold text-slate-700">{t("genderTitle")}</p>
            <p className="text-xs text-slate-400">{t("genderDesc")}</p>
          </div>
        </div>
        <div className="flex gap-2">
          {(["male", "female", "unspecified"] as Gender[]).map((g) => (
            <button
              key={g}
              onClick={() => updateProfile({ gender: g, inferredGender: undefined })}
              className={`flex-1 py-2 px-1 rounded-xl text-xs font-semibold transition-all border ${
                gender === g
                  ? "bg-indigo-600 border-indigo-600 text-white shadow-sm"
                  : "bg-white border-slate-200 text-slate-500 hover:border-indigo-300 hover:text-indigo-500"
              }`}
            >
              {g === "male" ? t("genderMale")
               : g === "female" ? t("genderFemale")
               : t("genderUnspecified")}
            </button>
          ))}
        </div>
        {gender === "unspecified" && (
          <p className="text-[11px] text-slate-400 mt-2 leading-relaxed">{t("genderNeutralNote")}</p>
        )}
      </Card>

      {/* Notifications */}
      {notifSupported && (
        <Card variant="elevated">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {notifEnabled
                ? <Bell size={18} className="text-indigo-500" />
                : <BellOff size={18} className="text-slate-400" />}
              <div>
                <p className="text-sm font-semibold text-slate-700">{t("notifications")}</p>
                <p className="text-xs text-slate-400">{t("notificationsDesc")}</p>
              </div>
            </div>
            <button
              onClick={toggleNotifications}
              className={`relative w-11 h-6 rounded-full transition-colors ${
                notifEnabled ? "bg-indigo-600" : "bg-slate-200"
              }`}
            >
              <span
                className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform ${
                  notifEnabled ? "translate-x-5" : "translate-x-0"
                }`}
              />
            </button>
          </div>
        </Card>
      )}

      {/* Profile info */}
      {profile && (
        <Card variant="elevated">
          <p className="text-sm font-semibold text-slate-700 mb-2">{t("profile")}</p>
          <div className="space-y-1 text-sm text-slate-500">
            <p>{t("profileName")}: <span className="text-slate-700 font-medium">{profile.name}</span></p>
            <p>{t("profileDay")}: <span className="text-slate-700 font-medium">{profile.currentDay}/30</span></p>
            <p>{t("profileStreak")}: <span className="text-slate-700 font-medium">{profile.streak} {t("days")}</span></p>
          </div>
        </Card>
      )}

      {/* Reset */}
      <Card variant="elevated" className="border-rose-100">
        <div className="flex items-start gap-3">
          <AlertTriangle size={20} className="text-rose-500 shrink-0 mt-0.5" />
          <div className="flex-1">
            <p className="text-sm font-semibold text-slate-700">{t("resetProgress")}</p>
            <p className="text-xs text-slate-400 mt-1">{t("resetWarning")}</p>
            {!showConfirm ? (
              <Button
                variant="danger"
                size="sm"
                className="mt-3"
                onClick={() => setShowConfirm(true)}
              >
                {t("resetProgress")}
              </Button>
            ) : (
              <div className="flex gap-2 mt-3">
                <Button variant="danger" size="sm" onClick={handleReset}>
                  {t("confirm")}
                </Button>
                <Button variant="ghost" size="sm" onClick={() => setShowConfirm(false)}>
                  {t("cancel")}
                </Button>
              </div>
            )}
          </div>
        </div>
      </Card>

      {/* App info */}
      <div className="text-center text-xs text-slate-300 pt-4">
        {t("appVersion")} · Built with Claude AI
      </div>
    </div>
    </PageTransition>
  );
}
