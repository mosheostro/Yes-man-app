"use client";

import { useTranslations } from "next-intl";
import { useParams } from "next/navigation";
import { useState, useRef, useEffect } from "react";
import { useAppStore, detectPattern } from "@/stores/appStore";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Send, Bot, User, Sparkles, AlertTriangle, Swords, RefreshCw, ChevronDown, ChevronUp } from "lucide-react";
import type { ChatMessage, CoachMode } from "@/types";
import { PageTransition } from "@/components/ui/PageTransition";

// ─── Constants ────────────────────────────────────────────────────────────────

const STEP_ICONS = ["📍", "💭", "💙", "🔍", "✨", "🎯"];

const TRAINING_CHARACTERS = [
  { id: "colleague", icon: "👔" },
  { id: "boss",      icon: "💼" },
  { id: "friend",    icon: "🤝" },
  { id: "family",    icon: "🏠" },
];

function isErrorReply(reply: string): boolean {
  return reply.includes("GROQ_API_KEY") || reply.includes("ANTHROPIC_API_KEY") ||
    reply.includes("Invalid API") || reply.includes("Неверный") ||
    reply.includes("temporarily unavailable") || reply.includes("временно недоступен") ||
    reply.includes("זמנית לא זמין") || reply.includes("vorübergehend nicht");
}

// ─── Session step progress bar ────────────────────────────────────────────────

function StepProgress({ step, total, locale }: { step: number; total: number; locale: string }) {
  const stepNames: Record<string, string[]> = {
    en: ["Situation", "Thoughts", "Emotions", "Pattern", "Reframe", "Action"],
    ru: ["Ситуация", "Мысли", "Эмоции", "Паттерн", "Переосмысление", "Действие"],
    he: ["מצב", "מחשבות", "רגשות", "דפוס", "מסגור", "פעולה"],
    de: ["Situation", "Gedanken", "Gefühle", "Muster", "Umdeuten", "Aktion"],
  };
  const names = stepNames[locale] ?? stepNames.en;
  const current = Math.min(step - 1, total - 1);

  return (
    <div className="px-4 py-2 bg-slate-50 border-b border-slate-100">
      <div className="flex items-center justify-between mb-1">
        <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
          {STEP_ICONS[current]} {names[current]}
        </span>
        <span className="text-[10px] text-slate-400">{step}/{total}</span>
      </div>
      <div className="flex gap-1">
        {Array.from({ length: total }).map((_, i) => (
          <div
            key={i}
            className={`h-1 flex-1 rounded-full transition-all ${
              i < step ? "bg-indigo-500" : i === step - 1 ? "bg-indigo-300" : "bg-slate-200"
            }`}
          />
        ))}
      </div>
    </div>
  );
}

// ─── Training character picker ────────────────────────────────────────────────

function CharacterPicker({
  selected, onSelect, locale
}: { selected: string; onSelect: (id: string) => void; locale: string }) {
  const labels: Record<string, Record<string, string>> = {
    colleague: { en: "Colleague", ru: "Коллега", he: "עמית", de: "Kollege" },
    boss:      { en: "Boss",      ru: "Начальник", he: "בוס",  de: "Chef" },
    friend:    { en: "Friend",    ru: "Друг",      he: "חבר",  de: "Freund" },
    family:    { en: "Family",    ru: "Семья",     he: "משפחה", de: "Familie" },
  };
  return (
    <div className="flex gap-2 px-4 py-2 bg-slate-50 border-b border-slate-100 overflow-x-auto">
      {TRAINING_CHARACTERS.map(({ id, icon }) => (
        <button
          key={id}
          onClick={() => onSelect(id)}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
            selected === id
              ? "bg-indigo-600 text-white"
              : "bg-white border border-slate-200 text-slate-600 hover:border-indigo-300"
          }`}
        >
          <span>{icon}</span>
          <span>{labels[id][locale] ?? labels[id].en}</span>
        </button>
      ))}
    </div>
  );
}

// ─── Main page ────────────────────────────────────────────────────────────────

export default function CoachPage() {
  const t = useTranslations("coach");
  const params = useParams();
  const { profile, messages, addMessage, clearMessages, addMemory, recordPattern, incrementTrainingSessions } = useAppStore();
  const locale = (params.locale as string) || profile?.locale || "en";

  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [apiStatus, setApiStatus] = useState<"unknown" | "ok" | "error">("unknown");
  const [mode, setMode] = useState<CoachMode>("coaching");
  const [trainingChar, setTrainingChar] = useState("colleague");
  const [sessionStep, setSessionStep] = useState(1);
  const [showMemories, setShowMemories] = useState(false);
  const [trainingStarted, setTrainingStarted] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  const memories = profile?.memories ?? [];
  const insights = profile?.insights ?? [];

  // Health check on mount
  useEffect(() => {
    fetch(`/api/coach?locale=${locale}`)
      .then((r) => r.json())
      .then((d) => setApiStatus(d.status === "ok" ? "ok" : "error"))
      .catch(() => setApiStatus("error"));
  }, [locale]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Derive step from assistant message count
  useEffect(() => {
    const aiTurns = messages.filter((m) => m.role === "assistant").length;
    setSessionStep(Math.min(aiTurns + 1, 6));
  }, [messages]);

  function startNewSession() {
    clearMessages();
    setSessionStep(1);
    setTrainingStarted(false);
    setInput("");
  }

  async function sendMessage(text: string) {
    if (!text.trim() || loading) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: "user",
      content: text.trim(),
      timestamp: new Date().toISOString(),
      sessionStep,
    };
    addMessage(userMsg);
    setInput("");
    setLoading(true);

    // Detect pattern in user message and save to store
    const detectedPattern = detectPattern(text);
    if (detectedPattern) {
      recordPattern(detectedPattern, text.slice(0, 100));
    }

    let reply: string | null = null;
    let errorType: string | null = null;

    for (let attempt = 0; attempt < 2; attempt++) {
      try {
        const res = await fetch("/api/coach", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            message: text.trim(),
            history: messages.slice(-12),
            profile: {
              name: profile?.name,
              severity: profile?.diagnosticResult?.severity,
              currentDay: profile?.currentDay,
              goal: profile?.goal,
            },
            locale,
            sessionStep,
            mode,
            trainingCharacter: trainingChar,
            memories: memories.slice(0, 5).map((m) => m.text),
          }),
        });

        const data = await res.json();
        reply = data.reply;
        errorType = data.errorType ?? null;

        if (errorType === "no_key" || errorType === "auth") { setApiStatus("error"); break; }
        if (reply && !isErrorReply(reply)) { setApiStatus("ok"); break; }
        if (attempt === 0) await new Promise((r) => setTimeout(r, 1000));
      } catch {
        if (attempt === 0) await new Promise((r) => setTimeout(r, 1000));
      }
    }

    const finalReply = reply ?? t("errorMsg");

    // After AI response: extract memory if pattern found and session has depth
    if (detectedPattern && messages.length >= 2 && !isErrorReply(finalReply)) {
      const memoryText = `${profile?.name ?? "User"} struggles with ${detectedPattern.replace(/_/g, " ")} (example: "${text.slice(0, 60)}")`;
      addMemory(memoryText, detectedPattern);
    }

    // Count training session completion
    if (mode === "training" && messages.filter((m) => m.role === "user").length === 0) {
      incrementTrainingSessions();
    }

    addMessage({
      id: (Date.now() + 1).toString(),
      role: "assistant",
      content: finalReply,
      timestamp: new Date().toISOString(),
      sessionStep,
    });

    setLoading(false);
  }

  async function startTraining() {
    if (trainingStarted) return;
    setTrainingStarted(true);
    clearMessages();
    setLoading(true);

    const setupMsg = `[START_TRAINING character=${trainingChar}]`;
    try {
      const res = await fetch("/api/coach", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: setupMsg,
          history: [],
          locale,
          mode: "training",
          trainingCharacter: trainingChar,
          memories: memories.slice(0, 3).map((m) => m.text),
        }),
      });
      const data = await res.json();
      addMessage({
        id: Date.now().toString(),
        role: "assistant",
        content: data.reply ?? t("errorMsg"),
        timestamp: new Date().toISOString(),
      });
    } catch {
      addMessage({ id: Date.now().toString(), role: "assistant", content: t("errorMsg"), timestamp: new Date().toISOString() });
    }
    setLoading(false);
  }

  const suggTopics = [t("topic1"), t("topic2"), t("topic3"), t("topic4"), t("topic5")];

  const modeTabs: Record<CoachMode, { label: string; icon: React.ReactNode }> = {
    coaching: { label: t("modeCoaching"), icon: <Sparkles size={14} /> },
    training: { label: t("modeTraining"), icon: <Swords size={14} /> },
  };

  return (
    <PageTransition>
    <div className="flex flex-col h-[calc(100vh-88px)]">

      {/* Header */}
      <div className="px-4 pt-4 pb-2 border-b border-slate-100 bg-white">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-indigo-600 flex items-center justify-center">
              <Sparkles size={18} className="text-white" />
            </div>
            <div>
              <h1 className="font-bold text-slate-800 text-sm">{t("title")}</h1>
              <p className="text-[10px] text-slate-400">{t("subtitle")}</p>
            </div>
          </div>
          <button
            onClick={startNewSession}
            className="flex items-center gap-1 text-xs text-slate-400 hover:text-indigo-500 transition-colors"
            title={t("newSession")}
          >
            <RefreshCw size={13} />
            <span className="hidden sm:inline">{t("newSession")}</span>
          </button>
        </div>

        {/* Mode tabs */}
        <div className="flex gap-1.5">
          {(Object.keys(modeTabs) as CoachMode[]).map((m) => (
            <button
              key={m}
              onClick={() => { setMode(m); startNewSession(); }}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                mode === m ? "bg-indigo-600 text-white" : "bg-slate-100 text-slate-500 hover:bg-slate-200"
              }`}
            >
              {modeTabs[m].icon}
              {modeTabs[m].label}
            </button>
          ))}

          {/* Memory indicator */}
          {memories.length > 0 && (
            <button
              onClick={() => setShowMemories(!showMemories)}
              className="ml-auto flex items-center gap-1 text-xs text-indigo-500 hover:text-indigo-700"
            >
              🧠 {memories.length}
              {showMemories ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
            </button>
          )}
        </div>
      </div>

      {/* Memory panel */}
      {showMemories && memories.length > 0 && (
        <div className="bg-indigo-50 border-b border-indigo-100 px-4 py-2 space-y-1">
          <p className="text-[10px] font-semibold text-indigo-500 uppercase tracking-wider">🧠 {t("memoriesTitle")}</p>
          {memories.slice(0, 4).map((mem) => (
            <p key={mem.id} className="text-xs text-indigo-700">· {mem.text}</p>
          ))}
        </div>
      )}

      {/* API warning */}
      {apiStatus === "error" && (
        <div className="mx-4 mt-2 flex items-start gap-2 bg-amber-50 border border-amber-200 rounded-xl px-3 py-2">
          <AlertTriangle size={14} className="text-amber-500 shrink-0 mt-0.5" />
          <p className="text-xs text-amber-700">
            {locale === "ru" ? "AI Coach не настроен. Получите бесплатный ключ на console.groq.com и добавьте GROQ_API_KEY в .env.local."
             : locale === "he" ? "מאמן ה-AI אינו מוגדר. קבל מפתח חינמי ב-console.groq.com."
             : locale === "de" ? "AI Coach nicht konfiguriert. Kostenlosen Schlüssel auf console.groq.com holen."
             : "AI Coach not configured. Get a free key at console.groq.com and add GROQ_API_KEY to .env.local."}
          </p>
        </div>
      )}

      {/* Session step progress (coaching mode) */}
      {mode === "coaching" && messages.length > 0 && (
        <StepProgress step={sessionStep} total={6} locale={locale} />
      )}

      {/* Training character picker */}
      {mode === "training" && !trainingStarted && (
        <CharacterPicker selected={trainingChar} onSelect={setTrainingChar} locale={locale} />
      )}

      {/* Messages area */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3">

        {/* Empty state */}
        {messages.length === 0 && mode === "coaching" && (
          <div className="space-y-3">
            <p className="text-xs text-slate-400 text-center bg-slate-100 rounded-full px-3 py-1 w-fit mx-auto">
              {t("disclaimer")}
            </p>
            <p className="text-sm text-slate-500 text-center px-4">{t("suggestedTopics")}:</p>
            <div className="space-y-2">
              {suggTopics.map((topic) => (
                <button key={topic} onClick={() => sendMessage(topic)}
                  className="w-full text-left px-4 py-2.5 rounded-xl border border-slate-200 bg-white hover:border-indigo-400 hover:bg-indigo-50 transition-colors text-sm text-slate-700">
                  {topic}
                </button>
              ))}
            </div>

            {/* Pattern insights if available */}
            {insights.length > 0 && (
              <Card variant="default" className="mt-2 bg-indigo-50 border-indigo-100">
                <p className="text-[10px] font-semibold text-indigo-500 uppercase tracking-wider mb-2">🔍 {t("patternHint")}</p>
                {insights.sort((a, b) => b.count - a.count).slice(0, 2).map((ins) => (
                  <p key={ins.pattern} className="text-xs text-indigo-700 mb-1">
                    · {t(`pattern_${ins.pattern}` as never)} — {t("seenTimes", { count: ins.count })}
                  </p>
                ))}
              </Card>
            )}
          </div>
        )}

        {/* Training empty state */}
        {messages.length === 0 && mode === "training" && (
          <div className="flex flex-col items-center gap-4 pt-4">
            <div className="text-4xl">{TRAINING_CHARACTERS.find((c) => c.id === trainingChar)?.icon}</div>
            <p className="text-sm text-slate-600 text-center px-4">{t("trainingDesc")}</p>
            <Button onClick={startTraining} loading={loading} variant="primary" size="md">
              {t("startTraining")}
            </Button>
          </div>
        )}

        {/* Messages */}
        {messages.map((msg) => (
          <div key={msg.id} className={`flex gap-2.5 ${msg.role === "user" ? "flex-row-reverse" : "flex-row"}`}>
            <div className={`w-7 h-7 rounded-xl flex items-center justify-center shrink-0 mt-0.5 ${
              msg.role === "user" ? "bg-indigo-600" : mode === "training" ? "bg-rose-100" : "bg-slate-100"
            }`}>
              {msg.role === "user"
                ? <User size={14} className="text-white" />
                : mode === "training"
                ? <span className="text-sm">{TRAINING_CHARACTERS.find((c) => c.id === trainingChar)?.icon}</span>
                : <Bot size={14} className="text-slate-600" />}
            </div>
            <Card variant="default" className={`max-w-[82%] !p-3 text-sm leading-relaxed whitespace-pre-wrap ${
              msg.role === "user"
                ? "bg-indigo-600 border-indigo-500 text-white"
                : isErrorReply(msg.content)
                ? "border-amber-200 bg-amber-50 text-amber-800"
                : "text-slate-700"
            }`}>
              {msg.content}
            </Card>
          </div>
        ))}

        {/* Typing indicator */}
        {loading && (
          <div className="flex gap-2.5">
            <div className={`w-7 h-7 rounded-xl flex items-center justify-center ${mode === "training" ? "bg-rose-100" : "bg-slate-100"}`}>
              {mode === "training"
                ? <span className="text-sm">{TRAINING_CHARACTERS.find((c) => c.id === trainingChar)?.icon}</span>
                : <Bot size={14} className="text-slate-600" />}
            </div>
            <Card variant="default" className="!p-3">
              <div className="flex gap-1 items-center">
                {[0, 1, 2].map((i) => (
                  <div key={i} className="w-1.5 h-1.5 rounded-full bg-slate-300 animate-bounce" style={{ animationDelay: `${i * 0.15}s` }} />
                ))}
                <span className="text-xs text-slate-400 ml-1">{t("thinking")}</span>
              </div>
            </Card>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Input bar */}
      <div className="px-4 py-3 border-t border-slate-100 bg-white flex gap-2 items-end">
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendMessage(input); } }}
          placeholder={mode === "training" ? t("trainingPlaceholder") : t("placeholder")}
          rows={1}
          className="flex-1 rounded-xl border border-slate-200 px-3 py-2 text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-400 resize-none"
        />
        <Button
          onClick={() => mode === "training" && !trainingStarted ? startTraining() : sendMessage(input)}
          disabled={mode === "training" && !trainingStarted ? false : (!input.trim() || loading)}
          loading={loading}
          size="md"
          className="h-9 w-9 !px-0 shrink-0"
        >
          <Send size={14} />
        </Button>
      </div>
    </div>
    </PageTransition>
  );
}
