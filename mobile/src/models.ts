export type Level = "A1" | "A2" | "B1" | "B2" | "C1";
export type Exercise = { question: string; options: string[]; answer: number; note: string };
export type Lesson = {
  id: string;
  level: Level;
  title: string;
  subtitle: string;
  minutes: number;
  phrases: Array<{ de: string; en: string }>;
  note: string;
  question: string;
  options: string[];
  answer: number;
  sections?: Array<{ type: string; text: string }>;
  exercises?: Exercise[];
};
export type Vocab = { id: string; level: Level; de: string; en: string; example: string; category?: string; exampleEn?: string };
export type WordReview = { due: number; interval: number; correct: number };
export type LocalProgress = { completed: string[]; xp: number; streak: number; lastStudyDay: string | null; selectedLevel: Level; dailyGoal: number; dailyCount: number; reviews: Record<string, WordReview> };
