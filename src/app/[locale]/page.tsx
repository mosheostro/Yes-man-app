"use client";

import { useTranslations } from "next-intl";
import { useRouter, useParams } from "next/navigation";
import { useState, useEffect } from "react";
import { useAppStore } from "@/stores/appStore";
import { Button } from "@/components/ui/Button";
import type { Locale } from "@/types";
import { ArrowRight, Shield, Brain, Calendar } from "lucide-react";

export default function LandingPage() {
  const t = useTranslations();
  const router = useRouter();
  const params = useParams();
  const locale = params.locale as Locale;
  const profile = useAppStore((s) => s.profile);
  const [step, setStep] = useState<"landing" | "onboarding">(
    profile?.onboardingComplete ? "landing" : "landing"
  );

  useEffect(() => {
    if (profile?.onboardingComplete) {
      router.replace(`/${locale}/dashboard`);
    }
  }, [profile?.onboardingComplete, locale, router]);

  if (profile?.onboardingComplete) {
    return null;
  }

  if (step === "onboarding") {
    return <OnboardingFlow locale={locale} />;
  }

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-indigo-50 to-white">
      {/* Header — language switcher is in the global TopBar */}
      <div className="flex items-center px-5 pt-5">
        <span className="font-bold text-indigo-700 text-lg">
          {t("common.appName")}
        </span>
      </div>

      {/* Hero */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 py-12 text-center">
        <div className="w-16 h-16 rounded-2xl bg-indigo-600 flex items-center justify-center mb-6 shadow-lg">
          <Shield size={32} className="text-white" />
        </div>
        <h1 className="text-3xl font-bold text-slate-800 leading-tight mb-4">
          {t("landing.hero")}
        </h1>
        <p className="text-slate-500 text-base leading-relaxed max-w-sm mb-8">
          {t("landing.heroSub")}
        </p>
        <Button size="lg" onClick={() => setStep("onboarding")} className="w-full max-w-xs">
          {t("landing.cta")} <ArrowRight size={18} />
        </Button>
        <p className="text-xs text-slate-400 mt-4">{t("landing.trust")}</p>
      </div>

      {/* Features */}
      <div className="px-5 pb-10 space-y-3">
        {[
          { title: t("landing.feature1Title"), desc: t("landing.feature1Desc"), icon: Brain },
          { title: t("landing.feature2Title"), desc: t("landing.feature2Desc"), icon: Shield },
          { title: t("landing.feature3Title"), desc: t("landing.feature3Desc"), icon: Calendar },
        ].map(({ title, desc, icon: Icon }) => (
          <div key={title} className="flex gap-4 bg-white rounded-2xl p-4 shadow-sm border border-slate-100">
            <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center shrink-0">
              <Icon size={20} className="text-indigo-600" />
            </div>
            <div>
              <p className="font-semibold text-slate-800 text-sm">{title}</p>
              <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">{desc}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function OnboardingFlow({ locale }: { locale: Locale }) {
  const t = useTranslations("onboarding");
  const tc = useTranslations("common");
  const router = useRouter();
  const { setProfile } = useAppStore();
  const [step, setStep] = useState(1);
  const [name, setName] = useState("");
  const [contexts, setContexts] = useState<string[]>([]);
  const [goal, setGoal] = useState("");

  const contextOptions = [
    { key: "context_work" },
    { key: "context_family" },
    { key: "context_friends" },
    { key: "context_romantic" },
    { key: "context_strangers" },
  ];
  const goalOptions = [
    { key: "goal_boundaries" },
    { key: "goal_confidence" },
    { key: "goal_no" },
    { key: "goal_identity" },
  ];

  function toggleContext(key: string) {
    setContexts((prev) =>
      prev.includes(key) ? prev.filter((c) => c !== key) : [...prev, key]
    );
  }

  function finish() {
    setProfile({
      name: name || "Friend",
      contexts,
      goal,
      locale,
      onboardingComplete: true,
      currentDay: 1,
      streak: 0,
      completedExercises: [],
      reflections: {},
      newAchievements: [],
      lastActiveDate: new Date().toISOString().split("T")[0],
      achievements: ["diagnostic" as never],
    });
    router.push(`/${locale}/diagnostic`);
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-50 to-white flex flex-col px-6 py-10">
      {/* Progress dots */}
      <div className="flex gap-2 justify-center mb-8">
        {[1, 2, 3, 4].map((s) => (
          <div
            key={s}
            className={`h-2 rounded-full transition-all ${
              s <= step ? "bg-indigo-600 w-6" : "bg-slate-200 w-2"
            }`}
          />
        ))}
      </div>

      {step === 1 && (
        <div className="flex-1">
          <h2 className="text-2xl font-bold text-slate-800 mb-2">{t("step1Title")}</h2>
          <p className="text-slate-500 mb-6">{t("step1Sub")}</p>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder={t("namePlaceholder")}
            className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-400 text-base"
          />
          <div className="mt-auto pt-10">
            <Button className="w-full" size="lg" onClick={() => setStep(2)}>
              {tc("next")} <ArrowRight size={18} />
            </Button>
          </div>
        </div>
      )}

      {step === 2 && (
        <div className="flex-1">
          <h2 className="text-2xl font-bold text-slate-800 mb-2">{t("step2Title")}</h2>
          <p className="text-slate-500 mb-6">{t("step2Sub")}</p>
          <div className="space-y-3">
            {contextOptions.map(({ key }) => (
              <button
                key={key}
                onClick={() => toggleContext(key)}
                className={`w-full text-left px-4 py-3 rounded-xl border transition-all font-medium text-sm ${
                  contexts.includes(key)
                    ? "border-indigo-500 bg-indigo-50 text-indigo-700"
                    : "border-slate-200 bg-white text-slate-700"
                }`}
              >
                {t(key as never)}
              </button>
            ))}
          </div>
          <div className="flex gap-3 mt-8">
            <Button variant="ghost" onClick={() => setStep(1)}>{tc("back")}</Button>
            <Button className="flex-1" onClick={() => setStep(3)} disabled={contexts.length === 0}>
              {tc("next")} <ArrowRight size={18} />
            </Button>
          </div>
        </div>
      )}

      {step === 3 && (
        <div className="flex-1">
          <h2 className="text-2xl font-bold text-slate-800 mb-2">{t("step3Title")}</h2>
          <div className="space-y-3 mt-6">
            {goalOptions.map(({ key }) => (
              <button
                key={key}
                onClick={() => setGoal(key)}
                className={`w-full text-left px-4 py-3 rounded-xl border transition-all font-medium text-sm ${
                  goal === key
                    ? "border-indigo-500 bg-indigo-50 text-indigo-700"
                    : "border-slate-200 bg-white text-slate-700"
                }`}
              >
                {t(key as never)}
              </button>
            ))}
          </div>
          <div className="flex gap-3 mt-8">
            <Button variant="ghost" onClick={() => setStep(2)}>{tc("back")}</Button>
            <Button className="flex-1" onClick={() => setStep(4)} disabled={!goal}>
              {tc("next")} <ArrowRight size={18} />
            </Button>
          </div>
        </div>
      )}

      {step === 4 && (
        <div className="flex-1 flex flex-col items-center text-center">
          <div className="w-20 h-20 rounded-2xl bg-indigo-600 flex items-center justify-center mb-6 shadow-lg">
            <span className="text-3xl">🎉</span>
          </div>
          <h2 className="text-2xl font-bold text-slate-800 mb-3">
            {t("step4Title", { name: name || "Friend" })}
          </h2>
          <p className="text-slate-500 mb-8">{t("step4Sub")}</p>
          <Button size="lg" className="w-full max-w-xs" onClick={finish}>
            {t("startDiagnostic")} <ArrowRight size={18} />
          </Button>
        </div>
      )}
    </div>
  );
}
