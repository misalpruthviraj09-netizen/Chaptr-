import { Router } from "express";
import { prisma } from "../db/client";
import { requireAuth, AuthenticatedRequest } from "../middleware/auth";
import {
  getXpProgress,
  calculateBookMastery,
  getDateStringInTimezone,
} from "../services/gamification";

const router = Router();

// GET /api/me/dashboard
router.get("/dashboard", requireAuth, async (req: AuthenticatedRequest, res, next) => {
  try {
    const userId = req.user!.id;

    const user = await prisma.user.findUniqueOrThrow({
      where: { id: userId },
      include: {
        userBadges: {
          include: { badge: true },
          orderBy: { earnedAt: "desc" },
        },
      },
    });

    const xpInfo = getXpProgress(user.xp);

    // Due reviews count
    const now = new Date();
    const dueReviewCount = await prisma.reviewCard.count({
      where: {
        userId,
        dueAt: { lte: now },
      },
    });

    // 7-day streak calendar strip
    const last7Days: Array<{ date: string; dayName: string; active: boolean; isToday: boolean }> = [];
    const todayStr = getDateStringInTimezone(now, user.timezone);

    for (let i = 6; i >= 0; i--) {
      const d = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
      const dStr = getDateStringInTimezone(d, user.timezone);
      const dayName = new Intl.DateTimeFormat("en-US", { weekday: "short", timeZone: user.timezone }).format(d);
      
      // Activity occurred if lastActiveDate matches or XpEvent exists on that date
      const startOfDay = new Date(`${dStr}T00:00:00Z`);
      const endOfDay = new Date(`${dStr}T23:59:59.999Z`);
      
      const hasEvents = await prisma.xpEvent.count({
        where: {
          userId,
          createdAt: { gte: startOfDay, lte: endOfDay },
        },
      });

      last7Days.push({
        date: dStr,
        dayName,
        active: hasEvents > 0 || (dStr === user.lastActiveDate),
        isToday: dStr === todayStr,
      });
    }

    // Today's stats for Daily Goal tracking
    const startOfToday = new Date(`${todayStr}T00:00:00Z`);
    const endOfToday = new Date(`${todayStr}T23:59:59.999Z`);

    const todayCompletedMissions = await prisma.missionProgress.findMany({
      where: {
        userId,
        status: "COMPLETED",
        completedAt: { gte: startOfToday, lte: endOfToday },
      },
      include: {
        mission: true,
      },
    });

    const todayMissionsCount = todayCompletedMissions.length;
    const todayMinutesRead = todayCompletedMissions.reduce(
      (acc, curr) => acc + (curr.mission?.estimatedMinutes || 5),
      0
    );

    const todayXpEvents = await prisma.xpEvent.aggregate({
      where: {
        userId,
        createdAt: { gte: startOfToday, lte: endOfToday },
      },
      _sum: { amount: true },
    });
    const todayXpEarned = todayXpEvents._sum?.amount || 0;

    // Cumulative mission mastery points and completed missions
    const completedMissionsAll = await prisma.missionProgress.findMany({
      where: {
        userId,
        status: "COMPLETED",
      },
    });
    const totalCompletedMissionsCount = completedMissionsAll.length;

    const missionXpEvents = await prisma.xpEvent.aggregate({
      where: {
        userId,
        OR: [
          { reason: { contains: "mission" } },
          { reason: { contains: "Mission" } },
          { reason: { contains: "question" } },
          { reason: { contains: "Question" } },
        ],
      },
      _sum: { amount: true },
    });
    // If specific events exist use sum, otherwise fall back to user's total xp
    const cumulativeMissionPoints = Math.max(
      missionXpEvents._sum?.amount || 0,
      user.xp > 0 && totalCompletedMissionsCount > 0 ? user.xp : (missionXpEvents._sum?.amount || 0)
    );

    // Books with progress & mastery
    const books = await prisma.book.findMany({
      where: { isPublished: true },
      include: {
        missions: {
          orderBy: { order: "asc" },
          include: {
            questions: true,
          },
        },
      },
    });

    // Fetch user attempts and mission progress for all books
    const userProgressList = await prisma.missionProgress.findMany({
      where: { userId },
    });
    const progressMap = new Map(userProgressList.map((p) => [p.missionId, p]));

    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    const userAttempts = await prisma.attempt.findMany({
      where: { userId },
    });

    const booksMastery = books.map((book) => {
      const totalMissions = book.missions.length;
      let completedMissions = 0;
      let nextMission: any = null;

      const questionIdsForBook = new Set<string>();
      const questionTypeMap = new Map<string, string>();

      for (const m of book.missions) {
        const prog = progressMap.get(m.id);
        if (prog?.status === "COMPLETED") {
          completedMissions += 1;
        } else if (!nextMission && (prog?.status === "UNLOCKED" || m.order === 1)) {
          nextMission = {
            id: m.id,
            order: m.order,
            title: m.title,
            estimatedMinutes: m.estimatedMinutes,
          };
        }

        for (const q of m.questions) {
          questionIdsForBook.add(q.id);
          questionTypeMap.set(q.id, q.type);
        }
      }

      // Filter attempts belonging to this book
      const bookAttempts = userAttempts.filter((a) => questionIdsForBook.has(a.questionId));

      // Understanding: first-attempt accuracy on MCQ/TRUE_FALSE
      const mcqAttempts = bookAttempts.filter((a) => {
        const type = questionTypeMap.get(a.questionId);
        return a.isFirstAttempt && (type === "MCQ" || type === "TRUE_FALSE");
      });
      const understandingStats = {
        correct: mcqAttempts.filter((a) => a.isCorrect).length,
        total: mcqAttempts.length,
      };

      // Recall: accuracy on RECALL questions + review cards (repeat attempts)
      const recallAttempts = bookAttempts.filter((a) => {
        const type = questionTypeMap.get(a.questionId);
        return type === "RECALL" || !a.isFirstAttempt;
      });
      const recallStats = {
        correct: recallAttempts.filter((a) => a.isCorrect).length,
        total: recallAttempts.length,
      };

      // Application: accuracy on SCENARIO
      const scenarioAttempts = bookAttempts.filter((a) => {
        const type = questionTypeMap.get(a.questionId);
        return type === "SCENARIO";
      });
      const applicationStats = {
        correct: scenarioAttempts.filter((a) => a.isCorrect).length,
        total: scenarioAttempts.length,
      };

      // Retention: reviews answered correctly in last 30 days
      const retentionAttempts = bookAttempts.filter((a) => {
        return !a.isFirstAttempt && a.createdAt >= thirtyDaysAgo;
      });
      const retentionStats = {
        correct: retentionAttempts.filter((a) => a.isCorrect).length,
        total: retentionAttempts.length,
      };

      const mastery = calculateBookMastery({
        understanding: understandingStats,
        recall: recallStats,
        application: applicationStats,
        retention: retentionStats,
      });

      const isStarted = completedMissions > 0 || !!nextMission;

      return {
        id: book.id,
        slug: book.slug,
        title: book.title,
        author: book.author,
        category: book.category,
        coverColor: book.coverColor,
        coverPattern: book.coverPattern,
        totalMissions,
        completedMissions,
        progressPercent: totalMissions > 0 ? Math.round((completedMissions / totalMissions) * 100) : 0,
        isStarted,
        nextMission,
        mastery,
      };
    });

    const booksInProgress = booksMastery.filter((b) => b.isStarted || b.completedMissions > 0);

    // All badges with earned state
    const allBadgesList = await prisma.badge.findMany({
      orderBy: { key: "asc" },
    });
    const earnedBadgeIds = new Map(user.userBadges.map((ub) => [ub.badgeId, ub.earnedAt]));

    const badgesSummary = allBadgesList.map((badge) => ({
      id: badge.id,
      key: badge.key,
      name: badge.name,
      description: badge.description,
      icon: badge.icon,
      tier: badge.tier,
      isEarned: earnedBadgeIds.has(badge.id),
      earnedAt: earnedBadgeIds.get(badge.id) || null,
    }));

    // 30-Day Reading Mastery History (books completed & missions mastered)
    const completedMissionsWithDates = await prisma.missionProgress.findMany({
      where: {
        userId,
        status: "COMPLETED",
      },
      select: {
        missionId: true,
        completedAt: true,
        mission: {
          select: {
            bookId: true,
          },
        },
      },
    });

    // Books completed calculation
    const allPublishedBooks = await prisma.book.findMany({
      where: { isPublished: true },
      select: {
        id: true,
        missions: {
          select: { id: true },
        },
      },
    });

    const userCompletedMissionIds = new Set(
      completedMissionsWithDates.map((m) => m.missionId)
    );
    const missionCompletionDateMap = new Map<string, Date>();
    for (const m of completedMissionsWithDates) {
      if (m.completedAt) {
        missionCompletionDateMap.set(m.missionId, m.completedAt);
      }
    }

    const completedBooksList: Array<{ bookId: string; completedAt: Date }> = [];
    for (const b of allPublishedBooks) {
      if (b.missions.length > 0) {
        const allDone = b.missions.every((m) => userCompletedMissionIds.has(m.id));
        if (allDone) {
          let latestDate = new Date(0);
          for (const m of b.missions) {
            const compDate = missionCompletionDateMap.get(m.id);
            if (compDate && compDate > latestDate) {
              latestDate = compDate;
            }
          }
          if (latestDate.getTime() === 0) {
            latestDate = now;
          }
          completedBooksList.push({ bookId: b.id, completedAt: latestDate });
        }
      }
    }

    // Build 30-day timeline (29 days ago up to today)
    const thirtyDaysHistory: Array<{
      date: string;
      label: string;
      missionsMastered: number;
      cumulativeMissions: number;
      booksCompleted: number;
      cumulativeBooks: number;
    }> = [];

    let totalMissions30d = 0;
    let totalBooks30d = 0;
    let activeDaysCount30d = 0;

    for (let i = 29; i >= 0; i--) {
      const d = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
      const dStr = getDateStringInTimezone(d, user.timezone);
      const endOfDay = new Date(`${dStr}T23:59:59.999Z`);

      const label = new Intl.DateTimeFormat("en-US", {
        month: "short",
        day: "numeric",
        timeZone: user.timezone,
      }).format(d);

      // Missions completed on this day
      const missionsOnDay = completedMissionsWithDates.filter((m) => {
        if (!m.completedAt) return false;
        const mStr = getDateStringInTimezone(m.completedAt, user.timezone);
        return mStr === dStr;
      }).length;

      // Books completed on this day
      const booksOnDay = completedBooksList.filter((b) => {
        const bStr = getDateStringInTimezone(b.completedAt, user.timezone);
        return bStr === dStr;
      }).length;

      // Cumulative up to this day
      const cumulativeMissions = completedMissionsWithDates.filter((m) => {
        if (!m.completedAt) return true;
        return m.completedAt <= endOfDay;
      }).length;

      const cumulativeBooks = completedBooksList.filter((b) => {
        return b.completedAt <= endOfDay;
      }).length;

      if (missionsOnDay > 0 || booksOnDay > 0) {
        activeDaysCount30d += 1;
      }
      totalMissions30d += missionsOnDay;
      totalBooks30d += booksOnDay;

      thirtyDaysHistory.push({
        date: dStr,
        label,
        missionsMastered: missionsOnDay,
        cumulativeMissions,
        booksCompleted: booksOnDay,
        cumulativeBooks,
      });
    }

    const readingMastery = {
      history: thirtyDaysHistory,
      summary: {
        totalMissionsMastered30d: totalMissions30d,
        totalBooksCompleted30d: totalBooks30d,
        totalMissionsMasteredAllTime: completedMissionsWithDates.length,
        totalBooksCompletedAllTime: completedBooksList.length,
        activeDaysCount30d,
        weeklyVelocityMissions: Number((totalMissions30d / 4.28).toFixed(1)),
        completionRatePercent:
          allPublishedBooks.length > 0
            ? Math.round((completedBooksList.length / allPublishedBooks.length) * 100)
            : 0,
      },
    };

    return res.json({
      data: {
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          timezone: user.timezone,
          xp: user.xp,
          level: user.level,
          currentStreak: user.currentStreak,
          longestStreak: user.longestStreak,
          lastActiveDate: user.lastActiveDate,
        },
        progression: {
          currentLevel: xpInfo.currentLevel,
          xpInCurrentLevel: xpInfo.xpInCurrentLevel,
          xpForNextLevel: xpInfo.xpForNextLevel,
          progressPercent: xpInfo.progressPercent,
          xpNeededForNextLevel: Math.max(0, xpInfo.xpForNextLevel - xpInfo.xpInCurrentLevel),
          totalXp: user.xp,
          cumulativeMissionPoints,
          completedMissionsCount: totalCompletedMissionsCount,
        },
        readingMastery,
        streakCalendar: last7Days,
        todayStats: {
          date: todayStr,
          missionsCount: todayMissionsCount,
          minutesRead: todayMinutesRead,
          xpEarned: todayXpEarned,
        },
        dueReviewCount,
        booksInProgress,
        allBooksWithMastery: booksMastery,
        recentBadges: user.userBadges.slice(0, 5).map((ub) => ({
          id: ub.badge.id,
          key: ub.badge.key,
          name: ub.badge.name,
          description: ub.badge.description,
          icon: ub.badge.icon,
          tier: ub.badge.tier,
          earnedAt: ub.earnedAt,
        })),
        allBadges: badgesSummary,
      },
    });
  } catch (err) {
    next(err);
  }
});

export default router;
