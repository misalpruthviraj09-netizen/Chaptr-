import { Router } from "express";
import { z } from "zod";
import { prisma } from "../db/client";
import { requireAuth, AuthenticatedRequest } from "../middleware/auth";
import { createError } from "../middleware/errorHandler";
import {
  calculateLevel,
  calculateStreak,
  calculateSm2,
} from "../services/gamification";

const router = Router();

const AnswerReviewSchema = z.object({
  cardId: z.string().uuid(),
  isCorrect: z.boolean(),
});

// GET /api/review/due (max 20)
router.get("/due", requireAuth, async (req: AuthenticatedRequest, res, next) => {
  try {
    const userId = req.user!.id;
    const now = new Date();

    const dueCards = await prisma.reviewCard.findMany({
      where: {
        userId,
        dueAt: { lte: now },
      },
      include: {
        question: {
          include: {
            mission: {
              include: {
                book: {
                  select: { title: true, coverColor: true, slug: true },
                },
              },
            },
          },
        },
      },
      orderBy: { dueAt: "asc" },
      take: 20,
    });

    const totalDueCount = await prisma.reviewCard.count({
      where: {
        userId,
        dueAt: { lte: now },
      },
    });

    const formattedCards = dueCards.map((card) => {
      let parsedOptions: string[] = [];
      try {
        parsedOptions = JSON.parse(card.question.options);
      } catch {
        parsedOptions = [];
      }

      return {
        id: card.id,
        questionId: card.question.id,
        prompt: card.question.prompt,
        options: parsedOptions,
        correctIndex: card.question.correctIndex,
        explanation: card.question.explanation,
        conceptTag: card.question.conceptTag,
        type: card.question.type,
        bookTitle: card.question.mission.book.title,
        bookSlug: card.question.mission.book.slug,
        missionTitle: card.question.mission.title,
        intervalDays: card.intervalDays,
        repetitions: card.repetitions,
        dueAt: card.dueAt,
      };
    });

    return res.json({
      data: {
        cards: formattedCards,
        totalDueCount,
      },
    });
  } catch (err) {
    next(err);
  }
});

// POST /api/review/answer
router.post("/answer", requireAuth, async (req: AuthenticatedRequest, res, next) => {
  try {
    const userId = req.user!.id;
    const { cardId, isCorrect } = AnswerReviewSchema.parse(req.body);

    const card = await prisma.reviewCard.findFirst({
      where: {
        id: cardId,
        userId,
      },
    });

    if (!card) {
      throw createError(404, "NOT_FOUND", "Review card not found.");
    }

    const sm2 = calculateSm2({
      easeFactor: card.easeFactor,
      repetitions: card.repetitions,
      intervalDays: card.intervalDays,
      isCorrect,
    });

    await prisma.reviewCard.update({
      where: { id: card.id },
      data: {
        easeFactor: sm2.easeFactor,
        intervalDays: sm2.intervalDays,
        repetitions: sm2.repetitions,
        dueAt: sm2.dueAt,
        lastResult: isCorrect,
      },
    });

    // Record attempt for retention tracking
    await prisma.attempt.create({
      data: {
        userId,
        questionId: card.questionId,
        isCorrect,
        isFirstAttempt: false,
      },
    });

    let xpEarned = 0;
    if (isCorrect) {
      xpEarned = 5; // 5 XP per correct review card
      await prisma.xpEvent.create({
        data: {
          userId,
          amount: xpEarned,
          reason: "Spaced repetition review card completed",
        },
      });
    }

    const user = await prisma.user.findUniqueOrThrow({ where: { id: userId } });
    const oldLevel = user.level;
    const newXp = user.xp + xpEarned;
    const newLevel = calculateLevel(newXp);
    const leveledUp = newLevel > oldLevel;

    // Streak update for activity
    const streakResult = calculateStreak({
      lastActiveDate: user.lastActiveDate,
      currentStreak: user.currentStreak,
      longestStreak: user.longestStreak,
      timezone: user.timezone,
    });

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

    // Evaluate Reviewer (50 reviews) badge
    const totalReviews = await prisma.attempt.count({
      where: {
        userId,
        isFirstAttempt: false,
      },
    });

    const newBadges: Array<{ key: string; name: string; icon: string; tier: string }> = [];

    if (totalReviews >= 50) {
      const badge = await prisma.badge.findUnique({ where: { key: "reviewer_50" } });
      if (badge) {
        const alreadyEarned = await prisma.userBadge.findUnique({
          where: { userId_badgeId: { userId, badgeId: badge.id } },
        });
        if (!alreadyEarned) {
          await prisma.userBadge.create({
            data: { userId, badgeId: badge.id },
          });
          newBadges.push({
            key: badge.key,
            name: badge.name,
            icon: badge.icon,
            tier: badge.tier,
          });
        }
      }
    }

    return res.json({
      data: {
        success: true,
        xpEarned,
        totalXp: newXp,
        level: newLevel,
        leveledUp,
        nextDueAt: sm2.dueAt,
        nextIntervalDays: sm2.intervalDays,
        currentStreak: streakResult.currentStreak,
        newBadges,
      },
    });
  } catch (err) {
    next(err);
  }
});

export default router;
