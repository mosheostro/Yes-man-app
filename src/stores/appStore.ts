"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { UserProfile, ChatMessage, DiagnosticResult, Memory, PatternInsight, PatternType } from "@/types";
import { today, calculateStreak } from "@/lib/utils";

// ─── Pattern detection ────────────────────────────────────────────────────────

const PATTERN_KEYWORDS: Record<PatternType, string[]> = {
  fear_of_rejection:   ["reject", "judg", "think less", "upset", "disappoint", "hate me", "отверг", "осудят", "подумают", "разочарую", "обидеть"],
  conflict_avoidance:  ["conflict", "fight", "argue", "tension", "uncomfortable", "awkward", "конфликт", "ссора", "спор", "неловко", "неудобно"],
  guilt:               ["guilty", "bad person", "selfish", "fault", "blame", "виноват", "эгоист", "плохой", "моя вина", "виновата"],
  over_responsibility: ["responsible", "my job", "have to", "must", "should", "obligat", "ответствен", "должен", "обязан", "моя работа"],
  people_pleasing:     ["please", "make happy", "let down", "expectations", "нравиться", "угодить", "подвести", "ожидания", "расстроить"],
  self_doubt:          ["can't", "not good enough", "weak", "fail", "wrong", "не могу", "недостаточно", "слабый", "провалюсь", "неправильно"],
};

export function detectPattern(text: string): PatternType | null {
  const lower = text.toLowerCase();
  for (const [pattern, keywords] of Object.entries(PATTERN_KEYWORDS)) {
    if (keywords.some((k) => lower.includes(k))) {
      return pattern as PatternType;
    }
  }
  return null;
}

// ─── State interface ──────────────────────────────────────────────────────────

interface AppState {
  profile: UserProfile | null;
  messages: ChatMessage[];
  setProfile: (profile: UserProfile) => void;
  updateProfile: (partial: Partial<UserProfile>) => void;
  completeDiagnostic: (result: DiagnosticResult) => void;
  completeExercise: (exerciseId: number, reflection?: string) => void;
  saveReflection: (exerciseId: number, text: string) => void;
  clearNewAchievements: () => void;
  addMessage: (msg: ChatMessage) => void;
  clearMessages: () => void;
  resetProgress: () => void;
  touchStreak: () => void;
  // Memory & insights
  addMemory: (text: string, pattern: PatternType) => void;
  recordPattern: (pattern: PatternType, example: string) => void;
  incrementTrainingSessions: () => void;
}

const defaultProfile: Omit<UserProfile, "name"> = {
  contexts: [],
  goal: "",
  locale: "en",
  onboardingComplete: false,
  currentDay: 1,
  streak: 0,
  completedExercises: [],
  reflections: {},
  lastActiveDate: today(),
  achievements: [],
  newAchievements: [],
  memories: [],
  insights: [],
  trainingSessions: 0,
};

// ─── Store ────────────────────────────────────────────────────────────────────

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      profile: null,
      messages: [],

      setProfile: (profile) => set({ profile }),

      updateProfile: (partial) =>
        set((state) => ({
          profile: state.profile ? { ...state.profile, ...partial } : null,
        })),

      completeDiagnostic: (result) =>
        set((state) => ({
          profile: state.profile
            ? { ...state.profile, diagnosticResult: result }
            : null,
        })),

      completeExercise: (exerciseId, reflection) =>
        set((state) => {
          if (!state.profile) return {};
          const completed = state.profile.completedExercises.includes(exerciseId)
            ? state.profile.completedExercises
            : [...state.profile.completedExercises, exerciseId];

          const achievements = [...state.profile.achievements];
          const earned: string[] = [];
          function earn(id: string) {
            if (!achievements.includes(id)) { achievements.push(id); earned.push(id); }
          }
          if (completed.length === 1) earn("first_no");
          if (completed.length >= 15) earn("halfway");
          if (completed.length >= 30) earn("complete");

          const nextDay = Math.min(Math.max(...completed) + 1, 30);
          const reflections = reflection?.trim()
            ? { ...state.profile.reflections, [exerciseId]: reflection.trim() }
            : state.profile.reflections;

          return {
            profile: {
              ...state.profile,
              completedExercises: completed,
              currentDay: nextDay,
              achievements,
              newAchievements: [...(state.profile.newAchievements ?? []), ...earned],
              reflections,
            },
          };
        }),

      saveReflection: (exerciseId, text) =>
        set((state) => ({
          profile: state.profile
            ? { ...state.profile, reflections: { ...state.profile.reflections, [exerciseId]: text } }
            : null,
        })),

      clearNewAchievements: () =>
        set((state) => ({
          profile: state.profile ? { ...state.profile, newAchievements: [] } : null,
        })),

      addMessage: (msg) =>
        set((state) => ({ messages: [...state.messages, msg] })),

      clearMessages: () => set({ messages: [] }),

      resetProgress: () =>
        set((state) => ({
          profile: state.profile
            ? {
                ...state.profile,
                ...defaultProfile,
                name: state.profile.name,
                locale: state.profile.locale,
                reflections: {},
                newAchievements: [],
                memories: [],
                insights: [],
                trainingSessions: 0,
              }
            : null,
          messages: [],
        })),

      touchStreak: () =>
        set((state) => {
          if (!state.profile) return {};
          const newStreak = calculateStreak(
            state.profile.lastActiveDate,
            state.profile.streak
          );
          const achievements = [...state.profile.achievements];
          if (newStreak >= 7 && !achievements.includes("week_streak")) {
            achievements.push("week_streak");
          }
          return {
            profile: {
              ...state.profile,
              streak: newStreak,
              lastActiveDate: today(),
              achievements,
            },
          };
        }),

      addMemory: (text, pattern) =>
        set((state) => {
          if (!state.profile) return {};
          const memories = state.profile.memories ?? [];
          // Deduplicate by similarity (simple: check if same pattern already has recent entry)
          const existing = memories.find(
            (m) => m.pattern === pattern && m.text.slice(0, 30) === text.slice(0, 30)
          );
          if (existing) {
            return {
              profile: {
                ...state.profile,
                memories: memories.map((m) =>
                  m.id === existing.id ? { ...m, seenCount: m.seenCount + 1 } : m
                ),
              },
            };
          }
          const newMemory: Memory = {
            id: Date.now().toString(),
            text,
            pattern,
            createdAt: today(),
            seenCount: 1,
          };
          // Keep only last 8 memories
          const updated = [newMemory, ...memories].slice(0, 8);
          return { profile: { ...state.profile, memories: updated } };
        }),

      recordPattern: (pattern, example) =>
        set((state) => {
          if (!state.profile) return {};
          const insights = state.profile.insights ?? [];
          const existing = insights.find((i) => i.pattern === pattern);
          if (existing) {
            return {
              profile: {
                ...state.profile,
                insights: insights.map((i) =>
                  i.pattern === pattern
                    ? { ...i, count: i.count + 1, lastSeen: today() }
                    : i
                ),
              },
            };
          }
          const newInsight: PatternInsight = {
            pattern,
            count: 1,
            firstSeen: today(),
            lastSeen: today(),
            example: example.slice(0, 100),
          };
          return { profile: { ...state.profile, insights: [...insights, newInsight] } };
        }),

      incrementTrainingSessions: () =>
        set((state) => ({
          profile: state.profile
            ? { ...state.profile, trainingSessions: (state.profile.trainingSessions ?? 0) + 1 }
            : null,
        })),
    }),
    {
      name: "yes-man-app-storage",
      partialize: (state) => ({
        profile: state.profile,
        messages: state.messages.slice(-50),
      }),
    }
  )
);
