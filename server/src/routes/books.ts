import { Router } from "express";
import { z } from "zod";
import { prisma } from "../db/client";
import { calculateBookMastery } from "../services/gamification";
import {
  optionalAuth,
  requireAuth,
  AuthenticatedRequest,
} from "../middleware/auth";
import { createError } from "../middleware/errorHandler";

const router = Router();

const BooksQuerySchema = z.object({
  category: z.string().optional(),
  search: z.string().optional(),
});

// GET /api/books
router.get("/", optionalAuth, async (req: AuthenticatedRequest, res, next) => {
  try {
    const { category, search } = BooksQuerySchema.parse(req.query);

    const whereClause: any = { isPublished: true };

    if (category && category.toLowerCase() !== "all") {
      whereClause.category = {
        contains: category,
      };
    }

    if (search && search.trim().length > 0) {
      whereClause.OR = [
        { title: { contains: search } },
        { author: { contains: search } },
        { description: { contains: search } },
      ];
    }

    const books = await prisma.book.findMany({
      where: whereClause,
      include: {
        missions: {
          select: {
            id: true,
            order: true,
            estimatedMinutes: true,
          },
          orderBy: { order: "asc" },
        },
      },
    });

    let userProgressMap: Record<string, { completedCount: number; isStarted: boolean }> = {};

    if (req.user) {
      const userProgress = await prisma.missionProgress.findMany({
        where: {
          userId: req.user.id,
        },
        include: {
          mission: {
            select: { bookId: true },
          },
        },
      });

      for (const p of userProgress) {
        const bookId = p.mission.bookId;
        if (!userProgressMap[bookId]) {
          userProgressMap[bookId] = { completedCount: 0, isStarted: false };
        }
        userProgressMap[bookId].isStarted = true;
        if (p.status === "COMPLETED") {
          userProgressMap[bookId].completedCount += 1;
        }
      }
    }

    const enrichedBooks = books.map((book) => {
      const totalMissions = book.missions.length;
      const progress = userProgressMap[book.id] || { completedCount: 0, isStarted: false };
      const totalMinutes = book.missions.reduce((acc, m) => acc + m.estimatedMinutes, 0);

      return {
        id: book.id,
        slug: book.slug,
        title: book.title,
        author: book.author,
        description: book.description,
        category: book.category,
        coverColor: book.coverColor,
        coverPattern: book.coverPattern,
        isPublicDomain: book.isPublicDomain,
        licenseNote: book.licenseNote,
        totalMissions,
        totalMinutes,
        completedMissions: progress.completedCount,
        progressPercent: totalMissions > 0 ? Math.round((progress.completedCount / totalMissions) * 100) : 0,
        isStarted: progress.isStarted,
      };
    });

    return res.json({
      data: {
        books: enrichedBooks,
      },
    });
  } catch (err) {
    next(err);
  }
});

// GET /api/books/:slug
router.get("/:slug", optionalAuth, async (req: AuthenticatedRequest, res, next) => {
  try {
    const { slug } = req.params;

    const book = await prisma.book.findUnique({
      where: { slug },
      include: {
        missions: {
          orderBy: { order: "asc" },
          select: {
            id: true,
            order: true,
            title: true,
            summary: true,
            estimatedMinutes: true,
            questions: {
              select: {
                id: true,
                type: true,
              },
            },
          },
        },
      },
    });

    if (!book) {
      throw createError(404, "NOT_FOUND", `Book with slug '${slug}' was not found.`);
    }

    let progressByMissionId: Record<string, { status: string; bestScore: number }> = {};
    let mastery = {
      understanding: 0,
      recall: 0,
      application: 0,
      retention: 0,
      mastery: 0,
    };

    if (req.user) {
      const missionIds = book.missions.map((m) => m.id);
      const userProgress = await prisma.missionProgress.findMany({
        where: {
          userId: req.user.id,
          missionId: { in: missionIds },
        },
      });

      for (const p of userProgress) {
        progressByMissionId[p.missionId] = {
          status: p.status,
          bestScore: p.bestScore,
        };
      }

      // Calculate mastery if user has question attempts
      const questionIdsForBook = new Set<string>();
      const questionTypeMap = new Map<string, string>();
      for (const m of book.missions) {
        for (const q of m.questions) {
          questionIdsForBook.add(q.id);
          questionTypeMap.set(q.id, q.type);
        }
      }

      if (questionIdsForBook.size > 0) {
        const userAttempts = await prisma.attempt.findMany({
          where: {
            userId: req.user.id,
            questionId: { in: Array.from(questionIdsForBook) },
          },
        });

        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

        const mcqAttempts = userAttempts.filter((a: any) => {
          const type = questionTypeMap.get(a.questionId);
          return a.isFirstAttempt && (type === "MCQ" || type === "TRUE_FALSE");
        });
        const understandingStats = {
          correct: mcqAttempts.filter((a: any) => a.isCorrect).length,
          total: mcqAttempts.length,
        };

        const recallAttempts = userAttempts.filter((a: any) => {
          const type = questionTypeMap.get(a.questionId);
          return type === "RECALL" || !a.isFirstAttempt;
        });
        const recallStats = {
          correct: recallAttempts.filter((a: any) => a.isCorrect).length,
          total: recallAttempts.length,
        };

        const scenarioAttempts = userAttempts.filter((a: any) => {
          const type = questionTypeMap.get(a.questionId);
          return type === "SCENARIO";
        });
        const applicationStats = {
          correct: scenarioAttempts.filter((a: any) => a.isCorrect).length,
          total: scenarioAttempts.length,
        };

        const retentionAttempts = userAttempts.filter((a: any) => {
          return !a.isFirstAttempt && a.createdAt >= thirtyDaysAgo;
        });
        const retentionStats = {
          correct: retentionAttempts.filter((a: any) => a.isCorrect).length,
          total: retentionAttempts.length,
        };

        mastery = calculateBookMastery({
          understanding: understandingStats,
          recall: recallStats,
          application: applicationStats,
          retention: retentionStats,
        });
      }
    }

    const missionsWithStatus = book.missions.map((m, idx) => {
      const userP = progressByMissionId[m.id];
      let status = "LOCKED";

      if (userP) {
        status = userP.status;
      } else if (idx === 0) {
        // Mission 1 is unlocked by default so learner can immediately play
        status = "UNLOCKED";
      }

      return {
        id: m.id,
        order: m.order,
        title: m.title,
        summary: m.summary,
        estimatedMinutes: m.estimatedMinutes,
        status,
        bestScore: userP?.bestScore || 0,
      };
    });

    const isStarted = Object.keys(progressByMissionId).length > 0;
    const totalMinutes = book.missions.reduce((sum, m) => sum + (m.estimatedMinutes || 6), 0);

    return res.json({
      data: {
        book: {
          id: book.id,
          slug: book.slug,
          title: book.title,
          author: book.author,
          description: book.description,
          category: book.category,
          coverColor: book.coverColor,
          coverPattern: book.coverPattern,
          isPublicDomain: book.isPublicDomain,
          licenseNote: book.licenseNote,
          isStarted,
          totalMissions: book.missions.length,
          totalMinutes,
          mastery,
          missions: missionsWithStatus,
        },
      },
    });
  } catch (err) {
    next(err);
  }
});

// POST /api/books/:slug/start
router.post("/:slug/start", requireAuth, async (req: AuthenticatedRequest, res, next) => {
  try {
    const { slug } = req.params;
    const userId = req.user!.id;

    const book = await prisma.book.findUnique({
      where: { slug },
      include: {
        missions: {
          orderBy: { order: "asc" },
        },
      },
    });

    if (!book || book.missions.length === 0) {
      throw createError(404, "NOT_FOUND", `Book '${slug}' not found or has no missions.`);
    }

    const firstMission = book.missions[0];

    // Check or upsert progress for the first mission to UNLOCKED if locked
    const existingProgress = await prisma.missionProgress.findUnique({
      where: {
        userId_missionId: {
          userId,
          missionId: firstMission.id,
        },
      },
    });

    if (!existingProgress) {
      await prisma.missionProgress.create({
        data: {
          userId,
          missionId: firstMission.id,
          status: "UNLOCKED",
          bestScore: 0,
        },
      });
    }

    return res.json({
      data: {
        started: true,
        bookSlug: book.slug,
        firstMissionId: firstMission.id,
      },
    });
  } catch (err) {
    next(err);
  }
});

export default router;
