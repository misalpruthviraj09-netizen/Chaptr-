import { describe, it, expect } from "vitest";
import {
  calculateLevel,
  getXpProgress,
  calculateStreak,
  calculateSm2,
  calculateBookMastery,
  getDayDifference,
  getDateStringInTimezone,
} from "../services/gamification";

describe("Gamification: XP & Level Formulas", () => {
  it("calculates level correctly using floor(sqrt(xp / 100)) + 1", () => {
    expect(calculateLevel(0)).toBe(1);
    expect(calculateLevel(50)).toBe(1);
    expect(calculateLevel(99)).toBe(1);
    expect(calculateLevel(100)).toBe(2);
    expect(calculateLevel(399)).toBe(2);
    expect(calculateLevel(400)).toBe(3);
    expect(calculateLevel(900)).toBe(4);
    expect(calculateLevel(1600)).toBe(5);
    expect(calculateLevel(2500)).toBe(6);
  });

  it("calculates level progress percent and xp needed for next level", () => {
    const p1 = getXpProgress(0);
    expect(p1.currentLevel).toBe(1);
    expect(p1.xpInCurrentLevel).toBe(0);
    expect(p1.xpForNextLevel).toBe(100);
    expect(p1.progressPercent).toBe(0);

    const p2 = getXpProgress(250); // Level 2: 100..400 (range 300)
    expect(p2.currentLevel).toBe(2);
    expect(p2.xpInCurrentLevel).toBe(150);
    expect(p2.xpForNextLevel).toBe(300);
    expect(p2.progressPercent).toBe(50);
  });
});

describe("Gamification: Streak Edge Cases & Timezones", () => {
  it("initializes streak to 1 on first active day", () => {
    const res = calculateStreak({
      lastActiveDate: null,
      currentStreak: 0,
      longestStreak: 0,
      timezone: "America/New_York",
      now: new Date("2026-09-21T12:00:00Z"),
    });

    expect(res.currentStreak).toBe(1);
    expect(res.longestStreak).toBe(1);
    expect(res.isNewDay).toBe(true);
  });

  it("leaves streak unchanged if activity happens on the same day", () => {
    const today = "2026-09-21";
    const res = calculateStreak({
      lastActiveDate: today,
      currentStreak: 4,
      longestStreak: 5,
      timezone: "UTC",
      now: new Date("2026-09-21T18:00:00Z"),
    });

    expect(res.currentStreak).toBe(4);
    expect(res.longestStreak).toBe(5);
    expect(res.isNewDay).toBe(false);
  });

  it("increments streak by 1 on consecutive day", () => {
    const res = calculateStreak({
      lastActiveDate: "2026-09-20",
      currentStreak: 4,
      longestStreak: 4,
      timezone: "UTC",
      now: new Date("2026-09-21T10:00:00Z"),
    });

    expect(res.currentStreak).toBe(5);
    expect(res.longestStreak).toBe(5);
    expect(res.isNewDay).toBe(true);
  });

  it("resets streak to 1 when gap exceeds one day", () => {
    const res = calculateStreak({
      lastActiveDate: "2026-09-18",
      currentStreak: 12,
      longestStreak: 20,
      timezone: "UTC",
      now: new Date("2026-09-21T10:00:00Z"),
    });

    expect(res.currentStreak).toBe(1);
    expect(res.longestStreak).toBe(20);
    expect(res.isNewDay).toBe(true);
  });

  it("handles timezone shifts properly", () => {
    // 2026-09-21 02:00:00 UTC is still 2026-09-20 in America/Los_Angeles (UTC-7)
    const date = new Date("2026-09-21T02:00:00Z");
    const laDate = getDateStringInTimezone(date, "America/Los_Angeles");
    expect(laDate).toBe("2026-09-20");

    const utcDate = getDateStringInTimezone(date, "UTC");
    expect(utcDate).toBe("2026-09-21");
  });
});

describe("Gamification: SM-2 Spaced Repetition Transitions", () => {
  it("initializes intervals to 1 day on first correct review", () => {
    const res = calculateSm2({
      easeFactor: 2.5,
      repetitions: 0,
      intervalDays: 1,
      isCorrect: true,
    });

    expect(res.repetitions).toBe(1);
    expect(res.intervalDays).toBe(1);
    expect(res.easeFactor).toBeGreaterThanOrEqual(2.5);
  });

  it("sets interval to 3 days on second consecutive correct review", () => {
    const res = calculateSm2({
      easeFactor: 2.5,
      repetitions: 1,
      intervalDays: 1,
      isCorrect: true,
    });

    expect(res.repetitions).toBe(2);
    expect(res.intervalDays).toBe(3);
  });

  it("multiplies interval by ease factor on 3+ consecutive correct reviews", () => {
    const res = calculateSm2({
      easeFactor: 2.5,
      repetitions: 2,
      intervalDays: 3,
      isCorrect: true,
    });

    expect(res.repetitions).toBe(3);
    expect(res.intervalDays).toBe(Math.round(3 * 2.5)); // 8 days
  });

  it("resets repetitions and interval to 1 on incorrect review, clamping ease factor", () => {
    const res = calculateSm2({
      easeFactor: 1.4,
      repetitions: 5,
      intervalDays: 20,
      isCorrect: false,
    });

    expect(res.repetitions).toBe(0);
    expect(res.intervalDays).toBe(1);
    // 1.4 - 0.2 = 1.2, but clamped to min 1.3
    expect(res.easeFactor).toBe(1.3);
  });
});

describe("Gamification: Book Mastery Calculation", () => {
  it("handles completely empty data without division by zero", () => {
    const emptyStats = { correct: 0, total: 0 };
    const res = calculateBookMastery({
      understanding: emptyStats,
      recall: emptyStats,
      application: emptyStats,
      retention: emptyStats,
    });

    expect(res.understanding).toBe(0);
    expect(res.recall).toBe(0);
    expect(res.application).toBe(0);
    expect(res.retention).toBe(0);
    expect(res.mastery).toBe(0);
  });

  it("correctly weights mastery sub-scores: 0.30*U + 0.25*R + 0.25*A + 0.20*Ret", () => {
    const res = calculateBookMastery({
      understanding: { correct: 8, total: 10 }, // 80%
      recall: { correct: 10, total: 10 },       // 100%
      application: { correct: 6, total: 10 },   // 60%
      retention: { correct: 5, total: 10 },     // 50%
    });

    // 0.30 * 80 (24) + 0.25 * 100 (25) + 0.25 * 60 (15) + 0.20 * 50 (10) = 74
    expect(res.understanding).toBe(80);
    expect(res.recall).toBe(100);
    expect(res.application).toBe(60);
    expect(res.retention).toBe(50);
    expect(res.mastery).toBe(74);
  });
});
