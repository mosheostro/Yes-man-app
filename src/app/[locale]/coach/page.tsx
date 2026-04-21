"use client";

import { useTranslations } from "next-intl";
import { useParams } from "next/navigation";
import { useState, useRef, useEffect, Fragment } from "react";
import { useAppStore, detectPattern, inferGenderFromText } from "@/stores/appStore";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Send, Bot, User, Sparkles, AlertTriangle, Swords, RefreshCw, ChevronDown, ChevronUp } from "lucide-react";
import type { ChatMessage, CoachMode } from "@/types";
import { PageTransition } from "@/components/ui/PageTransition";
import { Tooltip } from "@/components/ui/Tooltip";
import { pickContextualQuestions } from "@/lib/questions";

// ─── Markdown renderer ────────────────────────────────────────────────────────
// Lightweight inline markdown → React nodes.
// Handles: **bold**, *italic*, preserves line breaks.
// No external dependency needed for this subset.

function renderMarkdown(text: string): React.ReactNode {
  return text.split("\n").map((line, lineIdx) => {
    // Split each line by **bold** or *italic* spans
    const parts = line.split(/(\*\*[^*\n]+\*\*|\*[^*\n]+\*)/g);
    const nodes = parts.map((part, partIdx) => {
      if (part.startsWith("**") && part.endsWith("**") && part.length > 4) {
        return <strong key={partIdx} className="font-semibold">{part.slice(2, -2)}</strong>;
      }
      if (part.startsWith("*") && part.endsWith("*") && part.length > 2) {
        return <em key={partIdx}>{part.slice(1, -1)}</em>;
      }
      return part;
    });
    return (
      <Fragment key={lineIdx}>
        {lineIdx > 0 && <br />}
        {nodes}
      </Fragment>
    );
  });
}

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
        <Tooltip content={names[current]}>
          <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider cursor-help">
            {STEP_ICONS[current]} {names[current]}
          </span>
        </Tooltip>
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
  const { profile, messages, addMessage, clearMessages, addMemory, recordPattern, incrementTrainingSessions, updateProfile } = useAppStore();
  // Profile locale wins: AI responses and chips stay in the user's chosen language
  // even when the URL locale differs (e.g. after a mid-session language switch).
  const locale = profile?.locale || (params.locale as string) || "en";

  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [apiStatus, setApiStatus] = useState<"unknown" | "ok" | "error">("unknown");
  const [mode, setMode] = useState<CoachMode>("coaching");
  const [trainingChar, setTrainingChar] = useState("colleague");
  const [sessionStep, setSessionStep] = useState(1);
  const [showMemories, setShowMemories] = useState(false);
  const [trainingStarted, setTrainingStarted] = useState(false);
  const [sessionVariant, setSessionVariant] = useState(() => Math.floor(Math.random() * 99));
  const bottomRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // ── Dynamic question chips ──────────────────────────────────────────────────
  // Each entry has {id, text}. `usedQIds` tracks which have been sent so they
  // are excluded from future picks, ensuring the user sees fresh questions.
  const [dynamicTopics, setDynamicTopics] = useState<{ id: string; text: string }[]>([]);
  const [usedQIds, setUsedQIds] = useState<string[]>([]);

  /** Pick 5 context-aware chips and update state */
  const refreshTopics = (
    newUsedIds: string[],
    currentStep: number,
    msgCount: number,
    variant: number,
  ) => {
    const patterns = (profile?.insights ?? []).map((ins) => ins.pattern);
    const picked = pickContextualQuestions({
      locale,
      patterns,
      step: currentStep,
      usedIds: newUsedIds,
      seed: variant,
      msgCount,
    });
    setDynamicTopics(picked);
  };

  // Initial chips on mount and whenever insights change
  useEffect(() => {
    refreshTopics(usedQIds, sessionStep, 0, sessionVariant);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [locale, profile?.insights?.length]);

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

  /** Reset the auto-grown textarea back to its natural single row */
  function resetTextareaHeight() {
    if (textareaRef.current) textareaRef.current.style.height = "auto";
  }

  function startNewSession() {
    clearMessages();
    setSessionStep(1);
    setTrainingStarted(false);
    setInput("");
    resetTextareaHeight();
    const newVariant = Math.floor(Math.random() * 99);
    setSessionVariant(newVariant);
    setUsedQIds([]);
    refreshTopics([], 1, 0, newVariant);
  }

  /** Issue 2: auto-grow textarea as the user types */
  function handleInputChange(e: React.ChangeEvent<HTMLTextAreaElement>) {
    setInput(e.target.value);
    const el = e.target;
    el.style.height = "auto";
    el.style.height = `${Math.min(el.scrollHeight, 120)}px`;
  }

  /** Send a quick-topic chip and mark it as used (won't appear again this session) */
  async function sendTopic(id: string, text: string) {
    const newUsedIds = usedQIds.includes(id) ? usedQIds : [...usedQIds, id];
    setUsedQIds(newUsedIds);
    await sendMessage(text);
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
    resetTextareaHeight();
    setLoading(true);

    // Detect pattern in user message and save to store
    const detectedPattern = detectPattern(text);
    if (detectedPattern) {
      recordPattern(detectedPattern, text.slice(0, 100));
    }

    // Soft gender inference — only update if user has NOT set an explicit preference
    if (profile?.gender === "unspecified" && !profile?.inferredGender) {
      const inferred = inferGenderFromText(text);
      if (inferred) {
        updateProfile({ inferredGender: inferred });
      }
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
              gender: profile?.gender ?? "unspecified",
              inferredGender: profile?.inferredGender,
            },
            locale,
            sessionStep,
            mode,
            trainingCharacter: trainingChar,
            memories: memories.slice(0, 5).map((m) => m.text),
            sessionVariant,
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
      // Build memory label in the user's language so the memory panel
      // doesn't show English text during a Russian/Hebrew/German session
      const patternLabels: Record<string, Record<string, string>> = {
        fear_of_rejection:   { en: "fear of rejection",   ru: "страх отвержения",      he: "פחד מדחייה",       de: "Angst vor Ablehnung" },
        conflict_avoidance:  { en: "conflict avoidance",  ru: "избегание конфликта",   he: "הימנעות מעימות",   de: "Konfliktvermeidung" },
        guilt:               { en: "guilt",               ru: "чувство вины",          he: "אשמה",             de: "Schuldgefühl" },
        over_responsibility: { en: "over-responsibility", ru: "гиперответственность",  he: "אחריות יתר",       de: "Überverantwortung" },
        people_pleasing:     { en: "people-pleasing",     ru: "угождение другим",      he: "רצון לרצות",       de: "Gefälligkeit" },
        self_doubt:          { en: "self-doubt",          ru: "неуверенность в себе",  he: "ספק עצמי",         de: "Selbstzweifel" },
      };
      const patternLabel = patternLabels[detectedPattern]?.[locale] ?? patternLabels[detectedPattern]?.en ?? detectedPattern;
      const memoryPrefixes: Record<string, string> = {
        en: `${profile?.name ?? "User"} struggles with`,
        ru: `${profile?.name ?? "Пользователь"} испытывает трудности с`,
        he: `${profile?.name ?? "משתמש"} מתמודד עם`,
        de: `${profile?.name ?? "Nutzer"} kämpft mit`,
      };
      const memoryPrefix = memoryPrefixes[locale] ?? memoryPrefixes.en;
      const memoryText = `${memoryPrefix} ${patternLabel} («${text.slice(0, 60)}»)`;
      addMemory(memoryText, detectedPattern);
    }

    // Count training session completion
    if (mode === "training" && messages.filter((m) => m.role === "user").length === 0) {
      incrementTrainingSessions();
    }

    const newAiCount = messages.filter((m) => m.role === "assistant").length + 1;

    addMessage({
      id: (Date.now() + 1).toString(),
      role: "assistant",
      content: finalReply,
      timestamp: new Date().toISOString(),
      sessionStep,
    });

    // Refresh chips after every AI reply — context-aware, excludes used IDs
    if (mode === "coaching" && !isErrorReply(finalReply)) {
      refreshTopics(usedQIds, sessionStep, newAiCount, sessionVariant);
    }

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

  // dynamicTopics is populated by refreshTopics() — context-aware, updated after each AI reply

  const modeTabs: Record<CoachMode, { label: string; icon: React.ReactNode }> = {
    coaching: { label: t("modeCoaching"), icon: <Sparkles size={14} /> },
    training: { label: t("modeTraining"), icon: <Swords size={14} /> },
  };

  return (
    <PageTransition>
    <div className="flex flex-col h-dynamic-screen">

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
            <Tooltip content={t("memoriesTitle")} position="bottom">
              <button
                onClick={() => setShowMemories(!showMemories)}
                className="ml-auto flex items-center gap-1 text-xs text-indigo-500 hover:text-indigo-700"
              >
                🧠 {memories.length}
                {showMemories ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
              </button>
            </Tooltip>
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
      <div className="flex-1 overflow-y-auto scroll-touch px-4 py-4 space-y-3">

        {/* Empty state */}
        {messages.length === 0 && mode === "coaching" && (
          <div className="space-y-3">
            <p className="text-xs text-slate-400 text-center bg-slate-100 rounded-full px-3 py-1 w-fit mx-auto">
              {t("disclaimer")}
            </p>
            <p className="text-sm text-slate-500 text-center px-4">{t("suggestedTopics")}:</p>
            <div className="space-y-2">
              {dynamicTopics.map(({ id, text }) => (
                <button key={id} onClick={() => sendTopic(id, text)}
                  className="w-full text-left px-4 py-2.5 rounded-xl border transition-colors text-sm border-slate-200 bg-white text-slate-700 hover:border-indigo-400 hover:bg-indigo-50">
                  {text}
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
            <Card variant="default" className={`max-w-[82%] !p-3 text-sm leading-relaxed ${
              msg.role === "user"
                ? "bg-indigo-600 border-indigo-500 text-white whitespace-pre-wrap"
                : isErrorReply(msg.content)
                ? "border-amber-200 bg-amber-50 text-amber-800"
                : "text-slate-700"
            }`}>
              {/* User messages: plain text. AI messages: parsed markdown. */}
              {msg.role === "user" ? msg.content : renderMarkdown(msg.content)}
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

      {/*
        ─── Issue 3 FIX: Persistent quick-topic chips ────────────────────────
        Always visible once a conversation starts — chips act as reusable
        quick-send buttons. Used chips get an indigo tint; they never disappear.
        Horizontal scroll + no-scrollbar to stay compact on small screens.
      */}
      {/* Context-aware chips — refresh after every AI reply */}
      {mode === "coaching" && messages.length > 0 && dynamicTopics.length > 0 && (
        <div className="border-t border-slate-100 bg-white/95 px-4 py-2.5 flex flex-wrap gap-2">
          {dynamicTopics.map(({ id, text }) => (
            <button
              key={id}
              onClick={() => sendTopic(id, text)}
              disabled={loading}
              className="text-xs px-3 py-1.5 rounded-full border transition-all disabled:opacity-40 border-slate-200 bg-white text-slate-500 hover:border-indigo-300 hover:bg-indigo-50 hover:text-indigo-600"
            >
              {text}
            </button>
          ))}
        </div>
      )}

      {/* Input bar */}
      <div className="px-4 py-3 border-t border-slate-100 bg-white flex gap-2 items-end">
        <textarea
          ref={textareaRef}
          value={input}
          onChange={handleInputChange}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              // Issue 1 FIX: training pre-start → Enter launches the scenario
              if (mode === "training" && !trainingStarted) {
                startTraining();
              } else {
                sendMessage(input);
              }
            }
          }}
          placeholder={mode === "training" ? t("trainingPlaceholder") : t("placeholder")}
          rows={1}
          // Issue 2 FIX: text-base (16px) prevents iOS auto-zoom on focus
          className="flex-1 rounded-xl border border-slate-200 px-3 py-2 text-base leading-snug text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-400 resize-none overflow-hidden"
          style={{ minHeight: "40px", maxHeight: "120px" }}
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
