export type Locale = "en" | "ru" | "he" | "de";

/** Explicit gender preference set by the user in Settings */
export type Gender = "male" | "female" | "unspecified";

export type DiagnosticSeverity = "mild" | "moderate" | "severe";

export interface DiagnosticResult {
  score: number;
  severity: DiagnosticSeverity;
  completedAt: string;
  answers: number[];
}

export type PatternType =
  | "fear_of_rejection"
  | "conflict_avoidance"
  | "guilt"
  | "over_responsibility"
  | "people_pleasing"
  | "self_doubt";

/** A key coaching fact remembered between sessions */
export interface Memory {
  id: string;
  /** Raw user text snippet — locale-agnostic, used for display + AI context */
  text: string;
  /** @deprecated full "Name — pattern: «snippet»" string from older sessions */
  exampleSnippet?: string;
  pattern: PatternType;
  createdAt: string;
  seenCount: number;
}

/** A detected behavioral pattern with frequency */
export interface PatternInsight {
  pattern: PatternType;
  count: number;
  lastSeen: string;
  firstSeen: string;
  example: string;
}

export interface UserProfile {
  name: string;
  contexts: string[];
  goal: string;
  locale: Locale;
  onboardingComplete: boolean;
  diagnosticResult?: DiagnosticResult;
  currentDay: number;
  streak: number;
  completedExercises: number[];
  reflections: Record<number, string>;
  lastActiveDate: string;
  achievements: string[];
  newAchievements: string[];
  // Memory & insights (added in session engine update)
  memories: Memory[];
  insights: PatternInsight[];
  trainingSessions: number;
  // Gender awareness layer
  gender: Gender;
  /** Soft-inferred gender from conversational cues (never overrides user setting) */
  inferredGender?: "male" | "female";
  /** How the AI addresses the user — "informal" (ты/אתה) or "formal" (вы) — RU/HE mainly */
  addressForm?: "informal" | "formal";
}

export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: string;
  sessionStep?: number;
}

export type CoachMode = "coaching" | "training";

export interface Exercise {
  id: number;
  day: number;
  week: number;
  level: "beginner" | "intermediate" | "advanced";
  titleKey: string;
  descriptionKey: string;
  scenarioKey: string;
  badResponseKey: string;
  goodResponseKey: string;
  tipKey: string;
  durationMin: number;
  category: "awareness" | "communication" | "boundaries" | "assertiveness";
}

export interface Achievement {
  id: string;
  icon: string;
  unlocked: boolean;
  unlockedAt?: string;
}
