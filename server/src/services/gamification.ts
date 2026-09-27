/**
 * Gamification Service - Single module for all progression mechanics
 * Unit-tested and pure-functional where possible
 */

export interface DateComparisonInput {
  lastActiveDate: string | null;
  currentStreak: number;
  longestStreak: number;
  timezone?: string;
  now?: Date;
}

export interface StreakResult {
  currentStreak: number;
  longestStreak: number;
  todayStr: string;
  isNewDay: boolean;
}

export interface Sm2Input {
  easeFactor: number;
  repetitions: number;
  intervalDays: number;
  isCorrect: boolean;
}

export interface Sm2Result {
  easeFactor: number;
  repetitions: number;
  intervalDays: number;
  dueAt: Date;
}

export interface AccuracyStat {
  correct: number;
  total: number;
}

export interface MasteryInput {
  understanding: AccuracyStat; // MCQ + TRUE_FALSE first-attempts
  recall: AccuracyStat;        // RECALL questions + review card answers
  application: AccuracyStat;   // SCENARIO questions
  retention: AccuracyStat;     // Due reviews in last 30 days
}

export interface MasteryResult {
  understanding: number; // 0-100
  recall: number;        // 0-100
  application: number;   // 0-100
  retention: number;     // 0-100
  mastery: number;       // 0-100
}

/**
 * Calculates level from total XP:
 * Level = floor(sqrt(xp / 100)) + 1
 */
export function calculateLevel(xp: number): number {
  if (xp <= 0) return 1;
  return Math.floor(Math.sqrt(xp / 100)) + 1;
}

/**
 * Calculates XP required to advance from current level to the next level
 */
export function getXpProgress(xp: number): {
  currentLevel: number;
  xpInCurrentLevel: number;
  xpForNextLevel: number;
  progressPercent: number;
} {
  const currentLevel = calculateLevel(xp);
  const currentLevelBaseXp = Math.pow(currentLevel - 1, 2) * 100;
  const nextLevelBaseXp = Math.pow(currentLevel, 2) * 100;
  const xpInCurrentLevel = Math.max(0, xp - currentLevelBaseXp);
  const xpForNextLevel = nextLevelBaseXp - currentLevelBaseXp;
  const progressPercent = Math.min(
    100,
    Math.round((xpInCurrentLevel / Math.max(1, xpForNextLevel)) * 100)
  );

  return {
    currentLevel,
    xpInCurrentLevel,
    xpForNextLevel,
    progressPercent,
  };
}

/**
 * Computes calendar date string YYYY-MM-DD in user's timezone
 */
export function getDateStringInTimezone(date: Date = new Date(), timezone = "UTC"): string {
  try {
    const formatter = new Intl.DateTimeFormat("en-CA", {
      timeZone: timezone,
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    });
    return formatter.format(date);
  } catch {
    // Fallback to UTC if timezone string is invalid
    return date.toISOString().slice(0, 10);
  }
}

/**
 * Calculate difference in days between two YYYY-MM-DD date strings
 */
export function getDayDifference(prevDateStr: string, currDateStr: string): number {
  const prev = new Date(`${prevDateStr}T00:00:00Z`);
  const curr = new Date(`${currDateStr}T00:00:00Z`);
  const diffMs = curr.getTime() - prev.getTime();
  return Math.round(diffMs / (1000 * 60 * 60 * 24));
}

/**
 * Updates streak based on activity timestamp and user timezone
 * Activity = completing a mission or a review session
 */
export function calculateStreak(input: DateComparisonInput): StreakResult {
  const now = input.now || new Date();
  const timezone = input.timezone || "UTC";
  const todayStr = getDateStringInTimezone(now, timezone);

  let currentStreak = input.currentStreak;
  let longestStreak = input.longestStreak;

  if (!input.lastActiveDate) {
    // First active day
    currentStreak = 1;
    longestStreak = Math.max(longestStreak, 1);
    return { currentStreak, longestStreak, todayStr, isNewDay: true };
  }

  if (input.lastActiveDate === todayStr) {
    // Same day activity, no streak increment
    return { currentStreak, longestStreak, todayStr, isNewDay: false };
  }

  const diffDays = getDayDifference(input.lastActiveDate, todayStr);

  if (diffDays === 1) {
    // Consecutive day
    currentStreak += 1;
  } else if (diffDays > 1) {
    // Gap over one day: reset to 1
    currentStreak = 1;
  } else {
    // Diff is negative (time travel or timezone shift backwards)
    // Keep current streak
    return { currentStreak, longestStreak, todayStr, isNewDay: false };
  }

  longestStreak = Math.max(longestStreak, currentStreak);
  return { currentStreak, longestStreak, todayStr, isNewDay: true };
}

/**
 * Simplified SM-2 Spaced Repetition Algorithm
 * Correct raises repetitions and intervalDays (1, 3, then round(previous * easeFactor))
 * Wrong resets repetitions to 0 and interval to 1
 * EaseFactor clamped to 1.3 - 2.8
 */
export function calculateSm2(input: Sm2Input, fromDate: Date = new Date()): Sm2Result {
  let easeFactor = input.easeFactor || 2.5;
  let repetitions = input.repetitions || 0;
  let intervalDays = input.intervalDays || 1;

  if (input.isCorrect) {
    repetitions += 1;
    if (repetitions === 1) {
      intervalDays = 1;
    } else if (repetitions === 2) {
      intervalDays = 3;
    } else {
      intervalDays = Math.max(1, Math.round(intervalDays * easeFactor));
    }
    // Slight increase in ease for positive reinforcement
    easeFactor = Math.min(2.8, easeFactor + 0.1);
  } else {
    repetitions = 0;
    intervalDays = 1;
    easeFactor = Math.max(1.3, easeFactor - 0.2);
  }

  // Calculate due date (midnight UTC after interval days)
  const dueAt = new Date(fromDate.getTime() + intervalDays * 24 * 60 * 60 * 1000);

  return {
    easeFactor: Number(easeFactor.toFixed(2)),
    repetitions,
    intervalDays,
    dueAt,
  };
}

/**
 * Calculates Book Mastery (0-100):
 * Understanding = first-attempt accuracy on MCQ/TRUE_FALSE
 * Recall = accuracy on RECALL questions and review cards
 * Application = accuracy on SCENARIO
 * Retention = share of due reviews answered correctly in the last 30 days (0 if none)
 * Mastery = 0.30*U + 0.25*R + 0.25*A + 0.20*Ret
 * Handles empty data with no division by zero.
 */
export function calculateBookMastery(input: MasteryInput): MasteryResult {
  const calcAccuracy = (stat: AccuracyStat): number => {
    if (!stat || stat.total <= 0) return 0;
    return Math.min(100, Math.max(0, (stat.correct / stat.total) * 100));
  };

  const understanding = Number(calcAccuracy(input.understanding).toFixed(1));
  const recall = Number(calcAccuracy(input.recall).toFixed(1));
  const application = Number(calcAccuracy(input.application).toFixed(1));
  const retention = Number(calcAccuracy(input.retention).toFixed(1));

  const weighted =
    0.3 * understanding +
    0.25 * recall +
    0.25 * application +
    0.2 * retention;

  const mastery = Math.min(100, Math.max(0, Math.round(weighted)));

  return {
    understanding,
    recall,
    application,
    retention,
    mastery,
  };
}

/**
 * Evaluates whether mission score unlocks next mission
 * Completing mission N (score 60% or more) unlocks N+1
 */
export function shouldUnlockNextMission(scorePercentage: number): boolean {
  return scorePercentage >= 60;
}
