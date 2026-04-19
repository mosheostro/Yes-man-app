"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAppStore } from "@/stores/appStore";
import { useTranslations } from "next-intl";

const ACHIEVEMENT_META: Record<string, { icon: string; labelKey: string }> = {
  first_no:    { icon: "🚫", labelKey: "achievement_first_no" },
  week_streak: { icon: "🔥", labelKey: "achievement_week_streak" },
  diagnostic:  { icon: "🧠", labelKey: "achievement_diagnostic" },
  halfway:     { icon: "⚡", labelKey: "achievement_halfway" },
  complete:    { icon: "🏆", labelKey: "achievement_complete" },
};

export function AchievementToast() {
  const t = useTranslations("progress");
  const { profile, clearNewAchievements } = useAppStore();
  const [visible, setVisible] = useState<string | null>(null);
  const [queue, setQueue] = useState<string[]>([]);

  useEffect(() => {
    const fresh = profile?.newAchievements ?? [];
    if (fresh.length > 0) {
      setQueue((q) => [...q, ...fresh]);
      clearNewAchievements();
    }
  }, [profile?.newAchievements]);

  // Step 1: Dequeue — show next achievement when nothing is visible.
  // NOTE: No timer here. Putting the timer in the same effect as setVisible()
  // caused the cleanup to cancel the timer the moment visible changed.
  useEffect(() => {
    if (!visible && queue.length > 0) {
      const [next, ...rest] = queue;
      setVisible(next);
      setQueue(rest);
    }
  }, [visible, queue]);

  // Step 2: Auto-dismiss — separate effect so the timer survives the
  // visible state change triggered by Step 1.
  useEffect(() => {
    if (!visible) return;
    const timer = setTimeout(() => setVisible(null), 5000);
    return () => clearTimeout(timer);
  }, [visible]);

  const meta = visible ? ACHIEVEMENT_META[visible] : null;

  return (
    <AnimatePresence>
      {visible && meta && (
        <motion.div
          key={visible}
          initial={{ opacity: 0, y: 80, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 60, scale: 0.85 }}
          transition={{ type: "spring", stiffness: 400, damping: 28 }}
          className="fixed bottom-24 left-1/2 -translate-x-1/2 z-50 pointer-events-none"
        >
          <div className="flex items-center gap-3 bg-slate-900 text-white rounded-2xl px-5 py-3 shadow-2xl border border-slate-700">
            <span className="text-2xl">{meta.icon}</span>
            <div>
              <p className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">
                {t("achievementUnlocked" as never)}
              </p>
              <p className="text-sm font-bold">{t(meta.labelKey as never)}</p>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
