"use client";

import { useTranslations } from "next-intl";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import { useAppStore } from "@/stores/appStore";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { getDiagnosticSeverity, getDiagnosticColor } from "@/lib/utils";
import { CheckCircle, ArrowRight } from "lucide-react";
import type { Locale } from "@/types";

const QUESTION_KEYS = [
  "q1","q2","q3","q4","q5","q6","q7","q8","q9","q10",
  "q11","q12","q13","q14","q15","q16","q17","q18","q19","q20",
] as const;

const SCALE_KEYS = ["never","rarely","sometimes","often","always"] as const;

export default function DiagnosticPage() {
  const t = useTranslations("diagnostic");
  const tc = useTranslations("common");
  const router = useRouter();
  const params = useParams();
  const locale = params.locale as Locale;
  const { completeDiagnostic, updateProfile } = useAppStore();

  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const [done, setDone] = useState(false);
  const [score, setScore] = useState(0);

  function answer(value: number) {
    const newAnswers = [...answers, value];
    setAnswers(newAnswers);
    if (current < QUESTION_KEYS.length - 1) {
      setCurrent(current + 1);
    } else {
      const total = newAnswers.reduce((sum, v) => sum + v, 0);
      const pct = Math.round((total / (QUESTION_KEYS.length * 4)) * 100);
      setScore(pct);
      completeDiagnostic({
        score: pct,
        severity: getDiagnosticSeverity(pct),
        completedAt: new Date().toISOString(),
        answers: newAnswers,
      });
      updateProfile({ achievements: ["diagnostic"] });
      setDone(true);
    }
  }

  if (done) {
    const severity = getDiagnosticSeverity(score);
    const color = getDiagnosticColor(severity);
    const severityLabel = t(`severity${severity.charAt(0).toUpperCase() + severity.slice(1)}` as never);

    return (
      <div className="min-h-screen bg-gradient-to-b from-indigo-50 to-white px-5 py-10 flex flex-col items-center">
        <div className="w-full max-w-sm">
          <div className="text-center mb-8">
            <CheckCircle size={48} className="text-indigo-500 mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-slate-800">{t("resultsTitle")}</h1>
            <p className="text-slate-500 mt-2">{t("resultDesc")}</p>
          </div>

          <Card variant="elevated" className="mb-6">
            <div className="text-center mb-4">
              <span className={`text-xl font-bold ${color}`}>{severityLabel}</span>
            </div>
            <ProgressBar value={score} color={score > 65 ? "rose" : score > 40 ? "amber" : "emerald"} showLabel size="md" />
            <p className="text-xs text-slate-400 text-center mt-2">{tc("score")}: {score}/100</p>
          </Card>

          <div className="space-y-3 mb-8 text-sm text-slate-600">
            <p>{t(severity === "mild" ? "mildDesc" : severity === "moderate" ? "moderateDesc" : "severeDesc")}</p>
          </div>

          <Button
            size="lg"
            className="w-full"
            onClick={() => router.push(`/${locale}/dashboard`)}
          >
            {t("viewProgram")} <ArrowRight size={18} />
          </Button>
        </div>
      </div>
    );
  }

  const questionKey = QUESTION_KEYS[current];
  const progress = (current / QUESTION_KEYS.length) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-50 to-white px-5 py-8 flex flex-col">
      <div className="mb-6">
        <div className="flex items-center justify-between text-sm text-slate-500 mb-2">
          <span>{t("title")}</span>
          <span>{current + 1} {tc("of")} {QUESTION_KEYS.length}</span>
        </div>
        <ProgressBar value={progress} />
      </div>

      <Card variant="elevated" className="flex-1 flex flex-col">
        <p className="text-xs text-slate-400 uppercase tracking-wide mb-4">{t("instruction")}</p>
        <p className="text-slate-800 font-medium text-base leading-relaxed flex-1">
          {t(questionKey as never)}
        </p>
        <div className="mt-8 space-y-2">
          {SCALE_KEYS.map((key, i) => (
            <button
              key={key}
              onClick={() => answer(i)}
              className="w-full text-left px-4 py-3 rounded-xl border border-slate-200 bg-white hover:border-indigo-400 hover:bg-indigo-50 transition-colors text-sm text-slate-700 font-medium"
            >
              {t(key as never)}
            </button>
          ))}
        </div>
      </Card>
    </div>
  );
}
