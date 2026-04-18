export type Locale = "en" | "ru" | "he" | "de";

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
  text: string;
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
