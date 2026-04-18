"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAppStore } from "@/stores/appStore";
import { useTranslations } from "next-intl";
import { exercises } from "@/lib/exercises";
import { Button } from "@/components/ui/Button";
import { Trophy } from "lucide-react";

const WEEK_EMOJIS = ["🌱", "🌿", "🌳", "🏆"];

function getCompletedWeeks(completedIds: number[]): number[] {
  const weeks: number[] = [];
  for (let w = 1; w <= 4; w++) {
    const weekExercises = exercises.filter((e) => e.week === w);
    if (weekExercises.every((e) => completedIds.includes(e.id))) {
      weeks.push(w);
    }
  }
  return weeks;
}

export function WeekCompleteModal() {
  const t = useTranslations("exercises");
  const profile = useAppStore((s) => s.profile);
  const [celebratedWeeks, setCelebratedWeeks] = useState<number[]>([]);
  const [showWeek, setShowWeek] = useState<number | null>(null);

  const seenKey = "yesmanWeeksCelebrated";

  useEffect(() => {
    if (!profile) return;
    const seen: number[] = JSON.parse(localStorage.getItem(seenKey) ?? "[]");
    const completed = getCompletedWeeks(profile.completedExercises);
    const unseen = completed.filter((w) => !seen.includes(w));
    if (unseen.length > 0) {
      const week = unseen[0];
      setShowWeek(week);
      const updated = [...seen, week];
      localStorage.setItem(seenKey, JSON.stringify(updated));
      setCelebratedWeeks(updated);
    }
  }, [profile?.completedExercises?.length]);

  return (
    <AnimatePresence>
      {showWeek !== null && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center px-5"
          onClick={() => setShowWeek(null)}
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0, y: 40 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.85, opacity: 0, y: 20 }}
            transition={{ type: "spring", stiffness: 380, damping: 26 }}
            className="bg-white rounded-3xl p-8 max-w-sm w-full text-center shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.15, type: "spring", stiffness: 500 }}
              className="text-6xl mb-4"
            >
              {WEEK_EMOJIS[(showWeek ?? 1) - 1]}
            </motion.div>

            <h2 className="text-2xl font-bold text-slate-800 mb-2">
              {t("weekComplete", { n: showWeek })}
            </h2>
            <p className="text-sm text-slate-500 mb-6">
              {t("weekCompleteDesc", { n: showWeek })}
            </p>

            <div className="flex justify-center gap-1.5 mb-6">
              {[1, 2, 3, 4].map((w) => (
                <div
                  key={w}
                  className={`h-2 rounded-full transition-all ${
                    w <= (showWeek ?? 0) ? "w-8 bg-indigo-500" : "w-2 bg-slate-200"
                  }`}
                />
              ))}
            </div>

            <Button
              size="lg"
              className="w-full"
              onClick={() => setShowWeek(null)}
            >
              {t("keepGoing")}
            </Button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
