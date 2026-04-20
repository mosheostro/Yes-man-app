"use client";

import { useTranslations } from "next-intl";
import { useAppStore } from "@/stores/appStore";
import { Card } from "@/components/ui/Card";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { Badge } from "@/components/ui/Badge";
import { exercises } from "@/lib/exercises";
import { TrendingUp, Award, Target, Flame, Brain, Swords } from "lucide-react";
import { PageTransition } from "@/components/ui/PageTransition";
import type { PatternType } from "@/types";

// ─── Achievements ─────────────────────────────────────────────────────────────

const ACHIEVEMENTS = [
  { id: "first_no",     icon: "🚫", label: "achievement_first_no" },
  { id: "week_streak",  icon: "🔥", label: "achievement_week_streak" },
  { id: "diagnostic",   icon: "🧠", label: "achievement_diagnostic" },
  { id: "halfway",      icon: "⚡", label: "achievement_halfway" },
  { id: "complete",     icon: "🏆", label: "achievement_complete" },
  { id: "supporter",    icon: "💜", label: "achievement_supporter" },
];

// ─── Yes-Man Index calculation ────────────────────────────────────────────────

function calcYesManIndex(
  completedExercises: number[],
  diagnosticScore: number | undefined,
  streak: number,
  trainingSessions: number,
  reflectionCount: number
): { score: number; level: number; dimensions: { key: string; value: number }[] } {
  // Base: invert diagnostic (lower people-pleasing = higher assertiveness)
  const base = diagnosticScore != null ? Math.round(100 - diagnosticScore) : 30;

  // Boosts — each exercise contributes 1 point up to 30 total, so all 30
  // exercises matter and progress is visible throughout the full program.
  const exerciseBoost = Math.min(completedExercises.length, 30);
  const trainingBoost = Math.min(trainingSessions * 3, 15);
  const streakBoost   = Math.min(streak * 0.5, 10);
  const reflectBoost  = Math.min(reflectionCount * 2, 10);

  const score = Math.min(Math.round(base + exerciseBoost + trainingBoost + streakBoost + reflectBoost), 100);

  // Level 0-4
  const level = score < 25 ? 0 : score < 45 ? 1 : score < 65 ? 2 : score < 80 ? 3 : 4;

  // Dimensions (0-100 each) — each dimension now reflects its full range
  const dims = [
    { key: "dim_assertiveness", value: Math.min(base + exerciseBoost * 1.5, 100) },
    { key: "dim_boundaries",    value: Math.min(base + trainingBoost + exerciseBoost, 100) },
    { key: "dim_awareness",     value: Math.min(base + reflectBoost * 4 + exerciseBoost * 0.5, 100) },
    { key: "dim_resilience",    value: Math.min(base * 0.8 + streakBoost * 6 + exerciseBoost * 0.3, 100) },
    { key: "dim_communication", value: Math.min(base * 0.9 + trainingBoost + exerciseBoost * 0.5, 100) },
  ].map((d) => ({ ...d, value: Math.round(d.value) }));

  return { score, level, dimensions: dims };
}

const LEVEL_COLORS = ["slate", "blue", "indigo", "emerald", "amber"] as const;
const LEVEL_EMOJIS = ["🌱", "🌿", "🌳", "⭐", "🏆"];

const DIM_COLORS: Record<string, "indigo" | "emerald" | "amber" | "rose"> = {
  dim_assertiveness: "indigo",
  dim_boundaries:    "emerald",
  dim_awareness:     "amber",
  dim_resilience:    "rose",
  dim_communication: "indigo",
};

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function ProgressPage() {
  const t = useTranslations("progress");
  const { profile } = useAppStore();

  if (!profile) return null;

  const completedIds   = profile.completedExercises;
  const insights       = profile.insights ?? [];
  const memories       = profile.memories ?? [];
  const trainingSess   = profile.trainingSessions ?? 0;
  const reflectCount   = Object.keys(profile.reflections ?? {}).length;

  // Category breakdown
  const completedByCategory = exercises.reduce((acc, e) => {
    if (completedIds.includes(e.id)) acc[e.category] = (acc[e.category] ?? 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const totalByCategory = exercises.reduce((acc, e) => {
    acc[e.category] = (acc[e.category] ?? 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const categoryInfo = [
    { key: "awareness",     icon: "🔍", label: t("cat_awareness") },
    { key: "communication", icon: "💬", label: t("cat_communication") },
    { key: "boundaries",    icon: "🛡️", label: t("cat_boundaries") },
    { key: "assertiveness", icon: "💪", label: t("cat_assertiveness") },
  ];

  // Yes-Man Index
  const yesMan = calcYesManIndex(
    completedIds,
    profile.diagnosticResult?.score,
    profile.streak,
    trainingSess,
    reflectCount
  );

  const boundaryScore = Math.min(
    profile.diagnosticResult
      ? Math.round(100 - profile.diagnosticResult.score + completedIds.length * 2)
      : 0,
    100
  );

  // Top patterns sorted by frequency
  const topPatterns = [...insights].sort((a, b) => b.count - a.count).slice(0, 3);

  return (
    <PageTransition>
    <div className="px-5 py-8 space-y-6">
      <div>
        <h1 className="text-xl font-bold text-slate-800">{t("title")}</h1>
        <p className="text-sm text-slate-500">{t("subtitle")}</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 gap-3">
        <Card variant="elevated" className="text-center py-5">
          <TrendingUp size={20} className="text-indigo-500 mx-auto mb-2" />
          <div className="text-2xl font-bold text-slate-800">{completedIds.length}/30</div>
          <div className="text-xs text-slate-400">{t("exercisesDone")}</div>
        </Card>
        <Card variant="elevated" className="text-center py-5">
          <Flame size={20} className="text-orange-500 mx-auto mb-2" />
          <div className="text-2xl font-bold text-slate-800">{profile.streak}</div>
          <div className="text-xs text-slate-400">{t("dayStreak")}</div>
        </Card>
        <Card variant="elevated" className="text-center py-5">
          <Target size={20} className="text-emerald-500 mx-auto mb-2" />
          <div className="text-2xl font-bold text-slate-800">{boundaryScore}%</div>
          <div className="text-xs text-slate-400">{t("boundaryScore")}</div>
        </Card>
        <Card variant="elevated" className="text-center py-5">
          <Swords size={20} className="text-rose-500 mx-auto mb-2" />
          <div className="text-2xl font-bold text-slate-800">{trainingSess}</div>
          <div className="text-xs text-slate-400">{t("trainingSessions")}</div>
        </Card>
      </div>

      {/* ─── YES-MAN INDEX ─── */}
      <Card variant="elevated" className="overflow-hidden">
        <div className="flex items-center justify-between mb-1">
          <p className="text-sm font-bold text-slate-800">{t("yesManIndex")}</p>
          <span className="text-2xl">{LEVEL_EMOJIS[yesMan.level]}</span>
        </div>
        <p className="text-xs text-slate-400 mb-3">{t("yesManIndexDesc")}</p>

        {/* Big score */}
        <div className="flex items-end gap-2 mb-3">
          <span className="text-4xl font-black text-indigo-600">{yesMan.score}</span>
          <span className="text-slate-400 text-sm mb-1">/100</span>
          <Badge
            label={t(`level_${yesMan.level}` as never)}
            variant={LEVEL_COLORS[yesMan.level] as never}
            className="mb-1"
          />
        </div>

        {/* Dimension bars */}
        <div className="space-y-2.5">
          {yesMan.dimensions.map(({ key, value }) => (
            <div key={key}>
              <div className="flex justify-between text-xs mb-0.5">
                <span className="text-slate-600 font-medium">{t(key as never)}</span>
                <span className="text-slate-400">{value}%</span>
              </div>
              <ProgressBar value={value} max={100} color={DIM_COLORS[key]} size="sm" />
            </div>
          ))}
        </div>
      </Card>

      {/* ─── BEHAVIORAL INSIGHTS ─── */}
      <Card variant="elevated">
        <div className="flex items-center gap-2 mb-3">
          <Brain size={16} className="text-indigo-500" />
          <p className="text-sm font-semibold text-slate-700">{t("insightsTitle")}</p>
          {memories.length > 0 && (
            <span className="ml-auto text-[10px] text-slate-400">
              🧠 {memories.length} {t("memoriesStored")}
            </span>
          )}
        </div>

        {topPatterns.length === 0 ? (
          <p className="text-xs text-slate-400">{t("noInsights")}</p>
        ) : (
          <div className="space-y-3">
            {topPatterns.map((ins) => (
              <div key={ins.pattern} className="flex items-start gap-3 p-3 rounded-xl bg-indigo-50 border border-indigo-100">
                <div className="text-lg shrink-0">
                  {ins.pattern === "fear_of_rejection" ? "😰"
                   : ins.pattern === "conflict_avoidance" ? "🕊️"
                   : ins.pattern === "guilt" ? "💔"
                   : ins.pattern === "over_responsibility" ? "⚖️"
                   : ins.pattern === "people_pleasing" ? "🤝"
                   : "🤔"}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-0.5">
                    <p className="text-xs font-semibold text-indigo-700">
                      {t(`pattern_${ins.pattern}` as never)}
                    </p>
                    <span className="text-[10px] text-indigo-400">
                      {t("patternDetected", { count: ins.count })}
                    </span>
                  </div>
                  <p className="text-xs text-slate-600">
                    {t(`insightMsg_${ins.pattern}` as never)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>

      {/* Program Progress */}
      <Card variant="elevated">
        <p className="text-sm font-semibold text-slate-700 mb-3">{t("programProgress")}</p>
        <ProgressBar value={completedIds.length} max={30} color="indigo" showLabel />
      </Card>

      {/* Category Breakdown */}
      <Card variant="elevated">
        <p className="text-sm font-semibold text-slate-700 mb-4">{t("categoryBreakdown")}</p>
        <div className="space-y-4">
          {categoryInfo.map(({ key, icon, label }) => {
            const done  = completedByCategory[key] ?? 0;
            const total = totalByCategory[key] ?? 1;
            return (
              <div key={key}>
                <div className="flex items-center justify-between text-sm mb-1">
                  <span className="font-medium text-slate-700">{icon} {label}</span>
                  <span className="text-slate-400">{done}/{total}</span>
                </div>
                <ProgressBar
                  value={done} max={total}
                  color={key === "awareness" ? "indigo" : key === "communication" ? "emerald" : key === "boundaries" ? "amber" : "rose"}
                  size="sm"
                />
              </div>
            );
          })}
        </div>
      </Card>

      {/* Achievements */}
      <Card variant="elevated">
        <div className="flex items-center gap-2 mb-4">
          <Award size={16} className="text-amber-500" />
          <p className="text-sm font-semibold text-slate-700">{t("achievements")}</p>
        </div>
        <div className="space-y-2.5">
          {ACHIEVEMENTS.map(({ id, icon, label }) => {
            const unlocked = profile.achievements.includes(id);
            return (
              <div key={id} className={`flex items-center gap-3 p-3 rounded-xl border transition-all ${
                unlocked ? "border-amber-200 bg-amber-50" : "border-slate-100 opacity-40"
              }`}>
                <span className="text-2xl">{unlocked ? icon : "🔒"}</span>
                <div>
                  <p className="text-sm font-semibold text-slate-800">{t(label as never)}</p>
                  <Badge label={unlocked ? t("unlocked") : t("locked")} variant={unlocked ? "amber" : "slate"} />
                </div>
              </div>
            );
          })}
        </div>
      </Card>

      {completedIds.length === 0 && insights.length === 0 && (
        <p className="text-center text-sm text-slate-400 py-4">{t("noData")}</p>
      )}
    </div>
    </PageTransition>
  );
}
