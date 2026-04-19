"use client";

import { useTranslations } from "next-intl";
import { useParams } from "next/navigation";
import { useState } from "react";
import { useAppStore } from "@/stores/appStore";
import { exercises, getExercisesByWeek } from "@/lib/exercises";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { CheckCircle, Lock, Lightbulb, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { PageTransition } from "@/components/ui/PageTransition";
import type { Exercise } from "@/types";
import type { Locale } from "@/types";

const LEVEL_COLORS = {
  beginner: "emerald",
  intermediate: "amber",
  advanced: "rose",
} as const;

const CATEGORY_ICONS = {
  awareness: "🔍",
  communication: "💬",
  boundaries: "🛡️",
  assertiveness: "💪",
};

export default function ExercisesPage() {
  const t = useTranslations("exercises");
  const tc = useTranslations("common");
  const te = useTranslations("ex");
  const params = useParams();
  const locale = params.locale as Locale;
  const { profile, completeExercise } = useAppStore();
  const [activeWeek, setActiveWeek] = useState(1);
  const [activeExercise, setActiveExercise] = useState<Exercise | null>(null);
  const [reflection, setReflection] = useState("");

  const completedIds = profile?.completedExercises ?? [];
  const currentDay = profile?.currentDay ?? 1;

  function isUnlocked(exercise: Exercise): boolean {
    return exercise.day <= currentDay;
  }

  const [completing, setCompleting] = useState(false);
  const [completionMessage, setCompletionMessage] = useState<string | null>(null);

  async function handleComplete(exercise: Exercise) {
    setCompleting(true);
    await new Promise((r) => setTimeout(r, 400));
    completeExercise(exercise.id, reflection);
    setActiveExercise(null);
    setReflection("");
    setCompleting(false);

    // Micro-reward message based on exercise count
    const count = (profile?.completedExercises.length ?? 0) + 1;
    const msgs = locale === "ru"
      ? ["Отлично! Ты укрепляешь свои границы.", "Хороший шаг вперёд! Так держать.", "Ты практикуешь важный навык.", "Граница поставлена. Маленький шаг, большой прогресс."]
      : locale === "he"
      ? ["כל הכבוד! אתה מחזק את הגבולות שלך.", "צעד קדימה! המשך כך.", "אתה מתרגל מיומנות חשובה.", "גבול הוגדר. צעד קטן, התקדמות גדולה."]
      : locale === "de"
      ? ["Gut gemacht! Du stärkst deine Grenzen.", "Ein guter Schritt vorwärts!", "Du übst eine wichtige Fähigkeit.", "Grenze gesetzt. Kleiner Schritt, großer Fortschritt."]
      : ["Great step! You're strengthening your boundaries.", "Nice work. Every small step builds confidence.", "You practiced saying no today.", "Boundary set. Small step, big progress."];
    setCompletionMessage(msgs[count % msgs.length]);
    setTimeout(() => setCompletionMessage(null), 4000);
  }

  const savedReflection = profile?.reflections?.[activeExercise?.id ?? 0] ?? "";

  if (activeExercise) {
    return (
      <motion.div
        initial={{ opacity: 0, x: 30 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -30 }}
        transition={{ duration: 0.2 }}
        className="min-h-screen bg-slate-50 px-5 py-6"
      >
        <div className="flex items-center justify-between mb-6">
          <Badge
            label={`${tc("day")} ${activeExercise.day}`}
            variant={LEVEL_COLORS[activeExercise.level]}
          />
          <button onClick={() => setActiveExercise(null)}>
            <X size={22} className="text-slate-400" />
          </button>
        </div>

        <h2 className="text-xl font-bold text-slate-800 mb-1">{te(activeExercise.titleKey as never)}</h2>
        <p className="text-sm text-slate-500 mb-5">{te(activeExercise.descriptionKey as never)}</p>

        {/* Scenario */}
        <Card variant="elevated" className="mb-4">
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-2">
            {t("scenario")}
          </p>
          <p className="text-sm text-slate-700 italic">"{te(activeExercise.scenarioKey as never)}"</p>
        </Card>

        {/* Responses */}
        <Card variant="elevated" className="mb-4">
          <div className="space-y-3">
            <div>
              <p className="text-xs font-semibold text-rose-500 uppercase tracking-wide mb-1">
                {t("yourResponse")}
              </p>
              <p className="text-sm text-slate-600 italic">"{te(activeExercise.badResponseKey as never)}"</p>
            </div>
            <div className="border-t border-slate-100 pt-3">
              <p className="text-xs font-semibold text-emerald-600 uppercase tracking-wide mb-1">
                {t("goodResponse")}
              </p>
              <p className="text-sm text-slate-700 italic">"{te(activeExercise.goodResponseKey as never)}"</p>
            </div>
          </div>
        </Card>

        {/* Tip */}
        <Card variant="default" className="mb-5 border-amber-200 bg-amber-50">
          <div className="flex gap-3">
            <Lightbulb size={18} className="text-amber-500 shrink-0 mt-0.5" />
            <div>
              <p className="text-xs font-semibold text-amber-700 mb-1">{t("tip")}</p>
              <p className="text-sm text-amber-800">{te(activeExercise.tipKey as never)}</p>
            </div>
          </div>
        </Card>

        {/* Reflection */}
        <div className="mb-6">
          <p className="text-sm font-semibold text-slate-700 mb-2">{t("reflection")}</p>
          <textarea
            value={reflection || savedReflection}
            onChange={(e) => setReflection(e.target.value)}
            placeholder={t("reflectionPrompt")}
            rows={3}
            className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-400 resize-none"
          />
        </div>

        <Button
          size="lg"
          className="w-full"
          loading={completing}
          onClick={() => handleComplete(activeExercise)}
        >
          <CheckCircle size={18} />
          {t("markDone")}
        </Button>
      </motion.div>
    );
  }

  return (
    <PageTransition>
    <div className="px-5 py-8">
      <h1 className="text-xl font-bold text-slate-800 mb-1">{t("title")}</h1>
      <p className="text-sm text-slate-500 mb-4">{t("subtitle")}</p>

      {/* Overall Progress */}
      <Card variant="elevated" className="mb-6">
        <ProgressBar
          value={completedIds.length}
          max={30}
          color="indigo"
          showLabel
          size="md"
        />
      </Card>

      {/* Week tabs */}
      <div className="flex gap-2 mb-5 overflow-x-auto pb-1">
        {[1, 2, 3, 4].map((w) => (
          <button
            key={w}
            onClick={() => setActiveWeek(w)}
            className={`shrink-0 px-4 py-1.5 rounded-full text-sm font-semibold transition-colors ${
              activeWeek === w
                ? "bg-indigo-600 text-white"
                : "bg-slate-100 text-slate-500"
            }`}
          >
            {t("weekLabel", { n: w })}
          </button>
        ))}
      </div>

      {/* Exercises list */}
      <div className="space-y-3">
        {getExercisesByWeek(activeWeek).map((exercise) => {
          const unlocked = isUnlocked(exercise);
          const completed = completedIds.includes(exercise.id);

          return (
            <Card
              key={exercise.id}
              variant="default"
              className={`transition-all ${
                unlocked ? "cursor-pointer hover:border-indigo-300" : "opacity-60"
              }`}
              onClick={() => unlocked && setActiveExercise(exercise)}
            >
              <div className="flex items-start gap-3">
                <div className="text-2xl">{CATEGORY_ICONS[exercise.category]}</div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    <Badge label={`${tc("day")} ${exercise.day}`} variant="slate" />
                    <Badge
                      label={t(`${exercise.level}Label` as never)}
                      variant={LEVEL_COLORS[exercise.level]}
                    />
                    <span className="text-xs text-slate-400">{exercise.durationMin} {tc("minutes")}</span>
                  </div>
                  <p className="font-semibold text-slate-800 text-sm truncate">
                    {te(exercise.titleKey as never)}
                  </p>
                  <p className="text-xs text-slate-500 mt-0.5 line-clamp-1">
                    {te(exercise.descriptionKey as never)}
                  </p>
                </div>
                <div className="shrink-0">
                  {completed ? (
                    <CheckCircle size={22} className="text-emerald-500" />
                  ) : unlocked ? (
                    <div className="w-6 h-6 rounded-full border-2 border-slate-200" />
                  ) : (
                    <Lock size={18} className="text-slate-300" />
                  )}
                </div>
              </div>
            </Card>
          );
        })}
      </div>
    </div>

    {/* Micro-reward toast */}
    {completionMessage && (
      <div className="fixed bottom-24 left-1/2 -translate-x-1/2 z-50 pointer-events-none">
        <div className="flex items-center gap-2 bg-emerald-600 text-white rounded-2xl px-5 py-3 shadow-2xl">
          <span className="text-xl">✨</span>
          <p className="text-sm font-semibold">{completionMessage}</p>
        </div>
      </div>
    )}
    </PageTransition>
  );
}
