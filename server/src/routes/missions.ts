import { Router } from "express";
import { z } from "zod";
import { prisma } from "../db/client";
import { requireAuth, AuthenticatedRequest } from "../middleware/auth";
import { createError } from "../middleware/errorHandler";
import {
  calculateLevel,
  calculateStreak,
  calculateSm2,
  shouldUnlockNextMission,
  getXpProgress,
} from "../services/gamification";

const router = Router();

const CheckQuestionSchema = z.object({
  questionId: z.string(),
  selectedIndex: z.union([z.number(), z.string().regex(/^\d+$/).transform(Number)]),
  selectedOptionText: z.string().optional(),
});

const SubmitMissionSchema = z.object({
  answers: z.array(
    z.object({
      questionId: z.string(),
      selectedIndex: z.union([z.number(), z.string().regex(/^\d+$/).transform(Number)]),
      selectedOptionText: z.string().optional(),
    })
  ).min(1, "At least one answer must be submitted"),
});

// GET /api/missions/:id (WITHOUT correct answers)
router.get("/:id", requireAuth, async (req: AuthenticatedRequest, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.user!.id;

    const mission = await prisma.mission.findUnique({
      where: { id },
      include: {
        book: {
          select: {
            id: true,
            slug: true,
            title: true,
            coverColor: true,
            missions: {
              select: { id: true, order: true },
              orderBy: { order: "asc" },
            },
          },
        },
        questions: {
          orderBy: { order: "asc" },
          select: {
            id: true,
            order: true,
            type: true,
            prompt: true,
            options: true,
            conceptTag: true,
            // DO NOT select correctIndex or explanation here!
          },
        },
      },
    });

    if (!mission) {
      throw createError(404, "NOT_FOUND", "Mission not found.");
    }

    // Check user's progress for this mission
    let userProgress = await prisma.missionProgress.findUnique({
      where: {
        userId_missionId: {
          userId,
          missionId: id,
        },
      },
    });

    // If this is mission 1 and user hasn't unlocked it yet, auto-unlock
    if (!userProgress && mission.order === 1) {
      userProgress = await prisma.missionProgress.create({
        data: {
          userId,
          missionId: id,
          status: "UNLOCKED",
          bestScore: 0,
        },
      });
    }

    const isLocked = !userProgress || userProgress.status === "LOCKED";

    const parsedQuestions = mission.questions.map((q) => ({
      id: q.id,
      order: q.order,
      type: q.type,
      prompt: q.prompt,
      options: JSON.parse(q.options) as string[],
      conceptTag: q.conceptTag,
    }));

    return res.json({
      data: {
        mission: {
          id: mission.id,
          order: mission.order,
          title: mission.title,
          summary: mission.summary,
          lessonContent: mission.lessonContent,
          estimatedMinutes: mission.estimatedMinutes,
          isLocked,
          status: userProgress?.status || "LOCKED",
          bestScore: userProgress?.bestScore || 0,
          book: {
            id: mission.book.id,
            slug: mission.book.slug,
            title: mission.book.title,
            coverColor: mission.book.coverColor,
            totalMissions: mission.book.missions.length,
          },
          questions: parsedQuestions,
        },
      },
    });
  } catch (err) {
    next(err);
  }
});

// POST /api/missions/:id/check-question
router.post("/:id/check-question", requireAuth, async (req: AuthenticatedRequest, res, next) => {
  try {
    const { id: missionId } = req.params;
    const { questionId, selectedIndex, selectedOptionText } = CheckQuestionSchema.parse(req.body);

    const mission = await prisma.mission.findUnique({
      where: { id: missionId },
      include: {
        questions: {
          orderBy: { order: "asc" },
        },
      },
    });

    if (!mission) {
      throw createError(404, "NOT_FOUND", "Mission not found.");
    }

    const q = mission.questions.find((question) => question.id === questionId);
    if (!q) {
      throw createError(404, "NOT_FOUND", `Question ${questionId} not found in mission ${missionId}.`);
    }

    const optionsList: string[] = JSON.parse(q.options) || [];

    // Safety check: log clear error if correctIndex is missing or invalid in DB
    if (typeof q.correctIndex !== "number" || q.correctIndex < 0 || q.correctIndex >= optionsList.length) {
      console.error(
        `[Safety Error: Invalid correctIndex] Question ID "${q.id}" (Order ${q.order}, Mission "${mission.title}") has invalid correctIndex: ${q.correctIndex}. Total options: ${optionsList.length}. Prompt: "${q.prompt}"`
      );
    }

    const numericSubmitted = Number(selectedIndex);
    const numericExpected = Number(q.correctIndex);

    const expectedOptionText = optionsList[numericExpected] ?? "";
    const submittedOptionText =
      selectedOptionText !== undefined && selectedOptionText !== ""
        ? selectedOptionText
        : (optionsList[numericSubmitted] ?? "");

    // 1. Check array index comparison (with number coercion)
    const isIndexMatch = numericSubmitted >= 0 && numericSubmitted === numericExpected;

    // 2. Check stable option text comparison (protects against option array shuffling)
    const isTextMatch = Boolean(
      submittedOptionText &&
      expectedOptionText &&
      submittedOptionText.trim().toLowerCase() === expectedOptionText.trim().toLowerCase()
    );

    const isCorrect = isIndexMatch || isTextMatch;

    // Dev-only console log to verify answer checking end-to-end
    if (process.env.NODE_ENV !== "production") {
      console.log(
        `[Quiz Check Dev-Log] Question ${q.id} (Order ${q.order}): submittedIndex=${numericSubmitted} ("${submittedOptionText}"), expectedCorrectIndex=${numericExpected} ("${expectedOptionText}") => isCorrect=${isCorrect}`
      );
    }

    return res.json({
      data: {
        questionId: q.id,
        isCorrect,
        correctIndex: q.correctIndex,
        correctOptionText: expectedOptionText,
        explanation: q.explanation,
      },
    });
  } catch (err) {
    next(err);
  }
});

// POST /api/missions/:id/submit
router.post("/:id/submit", requireAuth, async (req: AuthenticatedRequest, res, next) => {
  try {
    const { id: missionId } = req.params;
    const userId = req.user!.id;
    const { answers } = SubmitMissionSchema.parse(req.body);

    const mission = await prisma.mission.findUnique({
      where: { id: missionId },
      include: {
        book: {
          include: {
            missions: {
              orderBy: { order: "asc" },
            },
          },
        },
        questions: {
          orderBy: { order: "asc" },
        },
      },
    });

    if (!mission) {
      throw createError(404, "NOT_FOUND", "Mission not found.");
    }

    const questionMap = new Map(mission.questions.map((q) => [q.id, q]));
    let correctCount = 0;
    const totalQuestions = mission.questions.length;
    const perQuestionResults: Array<{
      questionId: string;
      order: number;
      type: string;
      selectedIndex: number;
      correctIndex: number;
      isCorrect: boolean;
      explanation: string;
      conceptTag: string;
      xpAwarded: number;
    }> = [];

    // Check existing attempts for this user to ensure XP is awarded once per question
    const questionIds = mission.questions.map((q) => q.id);
    const existingAttempts = await prisma.attempt.findMany({
      where: {
        userId,
        questionId: { in: questionIds },
      },
    });

    const attemptedQuestionIds = new Set(existingAttempts.map((a) => a.questionId));

    let questionXpGained = 0;
    const newAttemptsToCreate: Array<{
      userId: string;
      questionId: string;
      isCorrect: boolean;
      isFirstAttempt: boolean;
    }> = [];

    for (const ans of answers) {
      const q = questionMap.get(ans.questionId);
      if (!q) {
        console.warn(`[Submit Warning] Question "${ans.questionId}" not found in mission "${missionId}"`);
        continue;
      }

      const optionsList: string[] = JSON.parse(q.options) || [];

      // Safety check: verify correctIndex is valid in DB
      if (typeof q.correctIndex !== "number" || q.correctIndex < 0 || q.correctIndex >= optionsList.length) {
        console.error(
          `[Submit Safety Error: Invalid correctIndex] Question ID "${q.id}" (Order ${q.order}, Mission "${mission.title}") has invalid correctIndex: ${q.correctIndex}. Total options: ${optionsList.length}. Prompt: "${q.prompt}"`
        );
      }

      const numericSubmitted = Number(ans.selectedIndex);
      const numericExpected = Number(q.correctIndex);

      const expectedOptionText = optionsList[numericExpected] ?? "";
      const submittedOptionText =
        ans.selectedOptionText !== undefined && ans.selectedOptionText !== ""
          ? ans.selectedOptionText
          : (optionsList[numericSubmitted] ?? "");

      // 1. Index match (with numeric coercion)
      const isIndexMatch = numericSubmitted >= 0 && numericSubmitted === numericExpected;

      // 2. Stable text match (handles shuffled options)
      const isTextMatch = Boolean(
        submittedOptionText &&
        expectedOptionText &&
        submittedOptionText.trim().toLowerCase() === expectedOptionText.trim().toLowerCase()
      );

      const isCorrect = isIndexMatch || isTextMatch;
      if (isCorrect) correctCount += 1;

      // Dev-only console log
      if (process.env.NODE_ENV !== "production") {
        console.log(
          `[Mission Submit Dev-Log] Question ${q.id} (Order ${q.order}): submittedIndex=${numericSubmitted} ("${submittedOptionText}"), expectedCorrectIndex=${numericExpected} ("${expectedOptionText}") => isCorrect=${isCorrect}`
        );
      }

      const isFirst = !attemptedQuestionIds.has(q.id);
      let xpForThisQuestion = 0;

      if (isCorrect && isFirst) {
        // 10 XP per question correct on first attempt
        xpForThisQuestion = 10;
        questionXpGained += 10;
      }

      newAttemptsToCreate.push({
        userId,
        questionId: q.id,
        isCorrect,
        isFirstAttempt: isFirst,
      });

      perQuestionResults.push({
        questionId: q.id,
        order: q.order,
        type: q.type,
        selectedIndex: numericSubmitted,
        correctIndex: q.correctIndex,
        isCorrect,
        explanation: q.explanation,
        conceptTag: q.conceptTag,
        xpAwarded: xpForThisQuestion,
      });
    }

    // Save attempts
    if (newAttemptsToCreate.length > 0) {
      await prisma.attempt.createMany({
        data: newAttemptsToCreate,
      });
    }

    const scorePercentage = totalQuestions > 0 ? Math.round((correctCount / totalQuestions) * 100) : 0;
    const passed = shouldUnlockNextMission(scorePercentage);

    // Calculate XP
    let missionCompletionXp = 0;
    let perfectScoreXp = 0;

    if (passed) {
      missionCompletionXp = 20; // 20 for completing a mission
      if (scorePercentage === 100) {
        perfectScoreXp = 15; // +15 bonus for 100% mission
      }
    }

    const totalXpEarned = questionXpGained + missionCompletionXp + perfectScoreXp;

    // Record XP events
    const xpEventsData: Array<{ userId: string; amount: number; reason: string }> = [];
    if (questionXpGained > 0) {
      xpEventsData.push({
        userId,
        amount: questionXpGained,
        reason: `Questions answered correctly (${questionXpGained / 10} questions)`,
      });
    }
    if (missionCompletionXp > 0) {
      xpEventsData.push({
        userId,
        amount: missionCompletionXp,
        reason: `Completed mission: ${mission.title}`,
      });
    }
    if (perfectScoreXp > 0) {
      xpEventsData.push({
        userId,
        amount: perfectScoreXp,
        reason: `Perfect 100% score bonus on: ${mission.title}`,
      });
    }

    if (xpEventsData.length > 0) {
      await prisma.xpEvent.createMany({ data: xpEventsData });
    }

    // Fetch user for updates
    const user = await prisma.user.findUniqueOrThrow({ where: { id: userId } });
    const oldLevel = user.level;
    const newXp = user.xp + totalXpEarned;
    const newLevel = calculateLevel(newXp);
    const leveledUp = newLevel > oldLevel;

    // Calculate Streak
    const streakResult = calculateStreak({
      lastActiveDate: user.lastActiveDate,
      currentStreak: user.currentStreak,
      longestStreak: user.longestStreak,
      timezone: user.timezone,
    });

    // Update User
    await prisma.user.update({
      where: { id: userId },
      data: {
        xp: newXp,
        level: newLevel,
        currentStreak: streakResult.currentStreak,
        longestStreak: streakResult.longestStreak,
        lastActiveDate: streakResult.todayStr,
      },
    });

    // Update Mission Progress
    const existingProgress = await prisma.missionProgress.findUnique({
      where: {
        userId_missionId: {
          userId,
          missionId,
        },
      },
    });

    const newStatus = passed ? "COMPLETED" : (existingProgress?.status || "UNLOCKED");
    const bestScore = Math.max(existingProgress?.bestScore || 0, scorePercentage);

    await prisma.missionProgress.upsert({
      where: {
        userId_missionId: {
          userId,
          missionId,
        },
      },
      update: {
        status: newStatus,
        bestScore,
        completedAt: passed ? new Date() : existingProgress?.completedAt,
      },
      create: {
        userId,
        missionId,
        status: newStatus,
        bestScore,
        completedAt: passed ? new Date() : null,
      },
    });

    // Unlock next mission if passed
    let nextMissionId: string | null = null;
    if (passed) {
      const allMissions = mission.book.missions;
      const currentIndex = allMissions.findIndex((m) => m.id === missionId);
      if (currentIndex >= 0 && currentIndex < allMissions.length - 1) {
        const nextMission = allMissions[currentIndex + 1];
        nextMissionId = nextMission.id;

        await prisma.missionProgress.upsert({
          where: {
            userId_missionId: {
              userId,
              missionId: nextMission.id,
            },
          },
          update: {
            // Keep status if already unlocked/completed
          },
          create: {
            userId,
            missionId: nextMission.id,
            status: "UNLOCKED",
            bestScore: 0,
          },
        });
      }
    }

    // Initialize or update Spaced Repetition ReviewCards for these questions
    for (const resItem of perQuestionResults) {
      const existingCard = await prisma.reviewCard.findUnique({
        where: {
          userId_questionId: {
            userId,
            questionId: resItem.questionId,
          },
        },
      });

      if (!existingCard) {
        // Create initial review card
        const sm2 = calculateSm2({
          easeFactor: 2.5,
          repetitions: 0,
          intervalDays: 1,
          isCorrect: resItem.isCorrect,
        });

        await prisma.reviewCard.create({
          data: {
            userId,
            questionId: resItem.questionId,
            easeFactor: sm2.easeFactor,
            intervalDays: sm2.intervalDays,
            repetitions: sm2.repetitions,
            dueAt: sm2.dueAt,
            lastResult: resItem.isCorrect,
          },
        });
      }
    }

    // Evaluate Badges
    const newBadges: Array<{ key: string; name: string; icon: string; tier: string }> = [];

    // Helper to award badge safely
    const awardBadge = async (badgeKey: string) => {
      const badge = await prisma.badge.findUnique({ where: { key: badgeKey } });
      if (!badge) return;

      const alreadyEarned = await prisma.userBadge.findUnique({
        where: {
          userId_badgeId: {
            userId,
            badgeId: badge.id,
          },
        },
      });

      if (!alreadyEarned) {
        await prisma.userBadge.create({
          data: {
            userId,
            badgeId: badge.id,
          },
        });
        newBadges.push({
          key: badge.key,
          name: badge.name,
          icon: badge.icon,
          tier: badge.tier,
        });
      }
    };

    // 1. First Mission badge
    const completedCount = await prisma.missionProgress.count({
      where: { userId, status: "COMPLETED" },
    });
    if (completedCount >= 1) {
      await awardBadge("first_mission");
    }

    // 2. Perfect Score badge
    if (scorePercentage === 100) {
      await awardBadge("perfect_score");
    }

    // 3. Streaks
    if (streakResult.currentStreak >= 3) {
      await awardBadge("streak_3");
    }
    if (streakResult.currentStreak >= 7) {
      await awardBadge("streak_7");
    }

    // 4. Level 5 badge
    if (newLevel >= 5) {
      await awardBadge("level_5");
    }

    // 5. Book Finished badge
    const bookMissionIds = mission.book.missions.map((m) => m.id);
    const bookCompletedCount = await prisma.missionProgress.count({
      where: {
        userId,
        missionId: { in: bookMissionIds },
        status: "COMPLETED",
      },
    });
    if (bookCompletedCount === bookMissionIds.length) {
      await awardBadge("book_finished");
    }

    return res.json({
      data: {
        score: correctCount,
        totalQuestions,
        percentage: scorePercentage,
        passed,
        perQuestionResults,
        xpEarned: totalXpEarned,
        totalXp: newXp,
        level: newLevel,
        previousLevel: oldLevel,
        leveledUp,
        xpProgress: getXpProgress(newXp),
        currentStreak: streakResult.currentStreak,
        longestStreak: streakResult.longestStreak,
        newBadges,
        nextMissionId,
      },
    });
  } catch (err) {
    next(err);
  }
});

export default router;
