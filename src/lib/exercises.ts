import type { Exercise } from "@/types";

// All content fields are i18n keys looked up in the "ex" namespace of messages/*.json
// e.g. titleKey: "1_title" → messages/ru.json → ex["1_title"]
export const exercises: Exercise[] = [
  { id: 1,  day: 1,  week: 1, level: "beginner",     category: "awareness",      titleKey: "1_title",  descriptionKey: "1_desc",  scenarioKey: "1_scenario",  badResponseKey: "1_bad",  goodResponseKey: "1_good",  tipKey: "1_tip",  durationMin: 10 },
  { id: 2,  day: 2,  week: 1, level: "beginner",     category: "awareness",      titleKey: "2_title",  descriptionKey: "2_desc",  scenarioKey: "2_scenario",  badResponseKey: "2_bad",  goodResponseKey: "2_good",  tipKey: "2_tip",  durationMin: 10 },
  { id: 3,  day: 3,  week: 1, level: "beginner",     category: "awareness",      titleKey: "3_title",  descriptionKey: "3_desc",  scenarioKey: "3_scenario",  badResponseKey: "3_bad",  goodResponseKey: "3_good",  tipKey: "3_tip",  durationMin: 15 },
  { id: 4,  day: 4,  week: 1, level: "beginner",     category: "awareness",      titleKey: "4_title",  descriptionKey: "4_desc",  scenarioKey: "4_scenario",  badResponseKey: "4_bad",  goodResponseKey: "4_good",  tipKey: "4_tip",  durationMin: 15 },
  { id: 5,  day: 5,  week: 1, level: "beginner",     category: "awareness",      titleKey: "5_title",  descriptionKey: "5_desc",  scenarioKey: "5_scenario",  badResponseKey: "5_bad",  goodResponseKey: "5_good",  tipKey: "5_tip",  durationMin: 20 },
  { id: 6,  day: 6,  week: 1, level: "beginner",     category: "awareness",      titleKey: "6_title",  descriptionKey: "6_desc",  scenarioKey: "6_scenario",  badResponseKey: "6_bad",  goodResponseKey: "6_good",  tipKey: "6_tip",  durationMin: 20 },
  { id: 7,  day: 7,  week: 1, level: "beginner",     category: "awareness",      titleKey: "7_title",  descriptionKey: "7_desc",  scenarioKey: "7_scenario",  badResponseKey: "7_bad",  goodResponseKey: "7_good",  tipKey: "7_tip",  durationMin: 25 },
  { id: 8,  day: 8,  week: 2, level: "beginner",     category: "communication",  titleKey: "8_title",  descriptionKey: "8_desc",  scenarioKey: "8_scenario",  badResponseKey: "8_bad",  goodResponseKey: "8_good",  tipKey: "8_tip",  durationMin: 10 },
  { id: 9,  day: 9,  week: 2, level: "beginner",     category: "communication",  titleKey: "9_title",  descriptionKey: "9_desc",  scenarioKey: "9_scenario",  badResponseKey: "9_bad",  goodResponseKey: "9_good",  tipKey: "9_tip",  durationMin: 15 },
  { id: 10, day: 10, week: 2, level: "beginner",     category: "communication",  titleKey: "10_title", descriptionKey: "10_desc", scenarioKey: "10_scenario", badResponseKey: "10_bad", goodResponseKey: "10_good", tipKey: "10_tip", durationMin: 10 },
  { id: 11, day: 11, week: 2, level: "beginner",     category: "communication",  titleKey: "11_title", descriptionKey: "11_desc", scenarioKey: "11_scenario", badResponseKey: "11_bad", goodResponseKey: "11_good", tipKey: "11_tip", durationMin: 15 },
  { id: 12, day: 12, week: 2, level: "beginner",     category: "communication",  titleKey: "12_title", descriptionKey: "12_desc", scenarioKey: "12_scenario", badResponseKey: "12_bad", goodResponseKey: "12_good", tipKey: "12_tip", durationMin: 10 },
  { id: 13, day: 13, week: 2, level: "beginner",     category: "communication",  titleKey: "13_title", descriptionKey: "13_desc", scenarioKey: "13_scenario", badResponseKey: "13_bad", goodResponseKey: "13_good", tipKey: "13_tip", durationMin: 20 },
  { id: 14, day: 14, week: 2, level: "beginner",     category: "communication",  titleKey: "14_title", descriptionKey: "14_desc", scenarioKey: "14_scenario", badResponseKey: "14_bad", goodResponseKey: "14_good", tipKey: "14_tip", durationMin: 20 },
  { id: 15, day: 15, week: 3, level: "intermediate", category: "boundaries",     titleKey: "15_title", descriptionKey: "15_desc", scenarioKey: "15_scenario", badResponseKey: "15_bad", goodResponseKey: "15_good", tipKey: "15_tip", durationMin: 25 },
  { id: 16, day: 16, week: 3, level: "intermediate", category: "boundaries",     titleKey: "16_title", descriptionKey: "16_desc", scenarioKey: "16_scenario", badResponseKey: "16_bad", goodResponseKey: "16_good", tipKey: "16_tip", durationMin: 20 },
  { id: 17, day: 17, week: 3, level: "intermediate", category: "boundaries",     titleKey: "17_title", descriptionKey: "17_desc", scenarioKey: "17_scenario", badResponseKey: "17_bad", goodResponseKey: "17_good", tipKey: "17_tip", durationMin: 25 },
  { id: 18, day: 18, week: 3, level: "intermediate", category: "boundaries",     titleKey: "18_title", descriptionKey: "18_desc", scenarioKey: "18_scenario", badResponseKey: "18_bad", goodResponseKey: "18_good", tipKey: "18_tip", durationMin: 15 },
  { id: 19, day: 19, week: 3, level: "intermediate", category: "boundaries",     titleKey: "19_title", descriptionKey: "19_desc", scenarioKey: "19_scenario", badResponseKey: "19_bad", goodResponseKey: "19_good", tipKey: "19_tip", durationMin: 15 },
  { id: 20, day: 20, week: 3, level: "intermediate", category: "boundaries",     titleKey: "20_title", descriptionKey: "20_desc", scenarioKey: "20_scenario", badResponseKey: "20_bad", goodResponseKey: "20_good", tipKey: "20_tip", durationMin: 20 },
  { id: 21, day: 21, week: 3, level: "intermediate", category: "boundaries",     titleKey: "21_title", descriptionKey: "21_desc", scenarioKey: "21_scenario", badResponseKey: "21_bad", goodResponseKey: "21_good", tipKey: "21_tip", durationMin: 25 },
  { id: 22, day: 22, week: 4, level: "advanced",     category: "assertiveness",  titleKey: "22_title", descriptionKey: "22_desc", scenarioKey: "22_scenario", badResponseKey: "22_bad", goodResponseKey: "22_good", tipKey: "22_tip", durationMin: 20 },
  { id: 23, day: 23, week: 4, level: "advanced",     category: "assertiveness",  titleKey: "23_title", descriptionKey: "23_desc", scenarioKey: "23_scenario", badResponseKey: "23_bad", goodResponseKey: "23_good", tipKey: "23_tip", durationMin: 15 },
  { id: 24, day: 24, week: 4, level: "advanced",     category: "assertiveness",  titleKey: "24_title", descriptionKey: "24_desc", scenarioKey: "24_scenario", badResponseKey: "24_bad", goodResponseKey: "24_good", tipKey: "24_tip", durationMin: 15 },
  { id: 25, day: 25, week: 4, level: "advanced",     category: "assertiveness",  titleKey: "25_title", descriptionKey: "25_desc", scenarioKey: "25_scenario", badResponseKey: "25_bad", goodResponseKey: "25_good", tipKey: "25_tip", durationMin: 20 },
  { id: 26, day: 26, week: 4, level: "advanced",     category: "assertiveness",  titleKey: "26_title", descriptionKey: "26_desc", scenarioKey: "26_scenario", badResponseKey: "26_bad", goodResponseKey: "26_good", tipKey: "26_tip", durationMin: 15 },
  { id: 27, day: 27, week: 4, level: "advanced",     category: "assertiveness",  titleKey: "27_title", descriptionKey: "27_desc", scenarioKey: "27_scenario", badResponseKey: "27_bad", goodResponseKey: "27_good", tipKey: "27_tip", durationMin: 25 },
  { id: 28, day: 28, week: 4, level: "advanced",     category: "assertiveness",  titleKey: "28_title", descriptionKey: "28_desc", scenarioKey: "28_scenario", badResponseKey: "28_bad", goodResponseKey: "28_good", tipKey: "28_tip", durationMin: 30 },
  { id: 29, day: 29, week: 4, level: "advanced",     category: "assertiveness",  titleKey: "29_title", descriptionKey: "29_desc", scenarioKey: "29_scenario", badResponseKey: "29_bad", goodResponseKey: "29_good", tipKey: "29_tip", durationMin: 30 },
  { id: 30, day: 30, week: 4, level: "advanced",     category: "assertiveness",  titleKey: "30_title", descriptionKey: "30_desc", scenarioKey: "30_scenario", badResponseKey: "30_bad", goodResponseKey: "30_good", tipKey: "30_tip", durationMin: 30 },
];

export function getExerciseByDay(day: number): Exercise | undefined {
  return exercises.find((e) => e.day === day);
}

export function getExercisesByWeek(week: number): Exercise[] {
  return exercises.filter((e) => e.week === week);
}
