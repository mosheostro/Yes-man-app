"use client";

import { useTranslations } from "next-intl";
import { useParams, useRouter } from "next/navigation";
import { useEffect } from "react";
import Link from "next/link";
import { useAppStore } from "@/stores/appStore";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { Badge } from "@/components/ui/Badge";
import { getExerciseByDay } from "@/lib/exercises";
import { MessageCircle, Flame, Trophy, ArrowRight, CheckCircle } from "lucide-react";
import type { Locale } from "@/types";
import { PageTransition } from "@/components/ui/PageTransition";

export default function DashboardPage() {
  const t = useTranslations("dashboard");
  const tc = useTranslations("common");
  const te = useTranslations("ex");
  const params = useParams();
  const locale = params.locale as Locale;
  const router = useRouter();
  const { profile, touchStreak } = useAppStore();

  useEffect(() => {
    if (!profile?.onboardingComplete) {
      router.replace(`/${locale}`);
      return;
    }
    touchStreak();
  }, []);

  if (!profile) return null;

  const todayExercise = getExerciseByDay(profile.currentDay);
  const progressPct = Math.round((profile.completedExercises.length / 30) * 100);
  const completedToday = todayExercise
    ? profile.completedExercises.includes(todayExercise.id)
    : false;

  const levelBadge = {
    beginner: { label: tc("level") + " 1", color: "emerald" as const },
    intermediate: { label: tc("level") + " 2", color: "amber" as const },
    advanced: { label: tc("level") + " 3", color: "rose" as const },
  };

  return (
    <PageTransition>
    <div className="px-5 py-8 space-y-5">
      {/* Greeting */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-xl font-bold text-slate-800">
            {t("greeting", { name: profile.name })}
          </h1>
          {profile.diagnosticResult && (
            <p className="text-xs text-slate-400 mt-0.5 capitalize">
              {t("diagnosticHint", { severity: profile.diagnosticResult.severity, score: profile.diagnosticResult.score })}
            </p>
          )}
        </div>
        <div className="flex items-center gap-1.5 bg-orange-50 border border-orange-200 rounded-xl px-3 py-1.5">
          <Flame size={16} className="text-orange-500" />
          <span className="text-sm font-bold text-orange-600">{profile.streak}</span>
          <span className="text-xs text-orange-400">{t("streakLabel")}</span>
        </div>
      </div>

      {/* Progress */}
      <Card variant="elevated">
        <div className="flex items-center justify-between mb-3">
          <p className="text-sm font-semibold text-slate-700">{t("progressLabel")}</p>
          <span className="text-sm font-bold text-indigo-600">{progressPct}%</span>
        </div>
        <ProgressBar value={profile.completedExercises.length} max={30} color="indigo" />
        <p className="text-xs text-slate-400 mt-2">
          {profile.completedExercises.length} {tc("of")} 30 {tc("completed")}
        </p>
      </Card>

      {/* Today's Exercise */}
      {todayExercise && (
        <div>
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
            {t("todayTask")}
          </p>
          <Card variant="elevated" className="border border-indigo-100">
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <Badge
                    label={`${tc("day")} ${todayExercise.day}`}
                    variant="indigo"
                  />
                  <Badge
                    label={levelBadge[todayExercise.level].label}
                    variant={levelBadge[todayExercise.level].color}
                  />
                </div>
                <p className="font-semibold text-slate-800">{te(todayExercise.titleKey as never)}</p>
                <p className="text-xs text-slate-500 mt-1 line-clamp-2">
                  {te(todayExercise.descriptionKey as never)}
                </p>
              </div>
              {completedToday && (
                <CheckCircle size={22} className="text-emerald-500 shrink-0 ml-3" />
              )}
            </div>
            <Link href={`/${locale}/exercises`}>
              <Button size="sm" className="w-full" variant={completedToday ? "secondary" : "primary"}>
                {completedToday ? tc("completed") : t("continueProgram")}
                <ArrowRight size={16} />
              </Button>
            </Link>
          </Card>
        </div>
      )}

      {/* AI Coach CTA */}
      <Link href={`/${locale}/coach`}>
        <Card variant="glass" className="bg-indigo-600 border-indigo-500 cursor-pointer hover:bg-indigo-700 transition-colors">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center">
              <MessageCircle size={24} className="text-white" />
            </div>
            <div className="flex-1">
              <p className="font-semibold text-white">{t("coachPrompt")}</p>
              <p className="text-xs text-indigo-200">{t("coachSub")}</p>
            </div>
            <ArrowRight size={20} className="text-white/70" />
          </div>
        </Card>
      </Link>

      {/* Stats */}
      <div>
        <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
          {t("quickStats")}
        </p>
        <div className="grid grid-cols-3 gap-3">
          {[
            {
              label: t("boundaryScore"),
              value: profile.diagnosticResult
                ? `${100 - profile.diagnosticResult.score}%`
                : "—",
              icon: "🛡️",
            },
            {
              label: t("exercisesCompleted"),
              value: profile.completedExercises.length,
              icon: "✅",
            },
            {
              label: t("daysActive"),
              value: profile.streak,
              icon: "🔥",
            },
          ].map(({ label, value, icon }) => (
            <Card key={label} variant="default" className="text-center py-4">
              <div className="text-2xl mb-1">{icon}</div>
              <div className="text-lg font-bold text-slate-800">{value}</div>
              <div className="text-[10px] text-slate-400 mt-0.5 leading-tight">{label}</div>
            </Card>
          ))}
        </div>
      </div>

      {/* Achievements */}
      {profile.achievements.length > 0 && (
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Trophy size={14} className="text-amber-500" />
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              {t("achievements")}
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            {profile.achievements.map((a) => (
              <Badge key={a} label={`🏆 ${a}`} variant="amber" />
            ))}
          </div>
        </div>
      )}
    </div>
    </PageTransition>
  );
}
