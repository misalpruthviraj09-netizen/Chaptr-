export interface QuestionSeedData {
  order: number;
  type: "MCQ" | "TRUE_FALSE" | "SCENARIO" | "RECALL";
  prompt: string;
  options: string; // JSON string array
  correctIndex: number;
  explanation: string;
  conceptTag: string;
}

export interface MissionSeedData {
  order: number;
  title: string;
  summary: string;
  estimatedMinutes: number;
  lessonContent: string;
  questions: QuestionSeedData[];
}

export interface BookSeedData {
  slug: string;
  title: string;
  author: string;
  description: string;
  category: "Self-improvement" | "Finance" | "Psychology" | "Business" | "Productivity";
  coverColor: string;
  coverPattern: "waves" | "grid" | "dots" | "rings" | "stripes";
  isPublicDomain: boolean;
  licenseNote: string;
  isPublished: boolean;
  missions: MissionSeedData[];
}
