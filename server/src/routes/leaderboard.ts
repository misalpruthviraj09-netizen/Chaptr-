import { Router } from "express";
import { z } from "zod";
import { prisma } from "../db/client";
import { optionalAuth, AuthenticatedRequest } from "../middleware/auth";
import { resetAndSeedLeaderboard } from "../services/leaderboardReset";

const router = Router();

const LeaderboardQuerySchema = z.object({
  period: z.enum(["weekly", "all"]).optional().default("weekly"),
});

// POST /api/leaderboard/reset
router.post("/reset", async (req, res, next) => {
  try {
    const result = await resetAndSeedLeaderboard();
    return res.json({ data: result });
  } catch (err) {
    next(err);
  }
});

// GET /api/leaderboard?period=weekly|all
router.get("/", optionalAuth, async (req: AuthenticatedRequest, res, next) => {
  try {
    const { period } = LeaderboardQuerySchema.parse(req.query);
    const currentUserId = req.user?.id;

    const nonTestFilter = {
      NOT: [
        { email: { contains: "example.com" } },
        { email: { startsWith: "testuser_" } },
        { email: { startsWith: "googleuser_" } },
        { email: { startsWith: "thinker_" } },
        { email: { startsWith: "wattles_" } },
        { email: { startsWith: "focused_" } },
        { email: { startsWith: "barnum_" } },
      ],
    };

    if (period === "all") {
      const topUsers = await prisma.user.findMany({
        where: nonTestFilter,
        select: {
          id: true,
          name: true,
          level: true,
          xp: true,
          currentStreak: true,
        },
        orderBy: [{ xp: "desc" }, { createdAt: "asc" }],
        take: 20,
      });

      const leaderboard = topUsers.map((u, index) => ({
        rank: index + 1,
        id: u.id,
        name: u.name,
        level: u.level,
        xp: u.xp,
        currentStreak: u.currentStreak,
        isCurrentUser: u.id === currentUserId,
      }));

      let currentUserRank: any = null;
      if (currentUserId) {
        const userInTop = leaderboard.find((u) => u.id === currentUserId);
        if (userInTop) {
          currentUserRank = userInTop;
        } else {
          const user = await prisma.user.findUnique({
            where: { id: currentUserId },
            select: { id: true, name: true, level: true, xp: true, currentStreak: true },
          });
          if (user) {
            const countAbove = await prisma.user.count({
              where: {
                AND: [
                  nonTestFilter,
                  { xp: { gt: user.xp } },
                ],
              },
            });
            currentUserRank = {
              rank: countAbove + 1,
              id: user.id,
              name: user.name,
              level: user.level,
              xp: user.xp,
              currentStreak: user.currentStreak,
              isCurrentUser: true,
            };
          }
        }
      }

      return res.json({
        data: {
          period: "all",
          leaderboard,
          currentUserRank,
        },
      });
    } else {
      // Weekly from XpEvent (last 7 days)
      const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);

      // Group by userId for weekly xp, excluding test accounts
      const weeklyEvents = await prisma.xpEvent.groupBy({
        by: ["userId"],
        where: {
          createdAt: { gte: sevenDaysAgo },
          user: nonTestFilter,
        },
        _sum: {
          amount: true,
        },
        orderBy: {
          _sum: {
            amount: "desc",
          },
        },
      });

      // Fetch user details for these weekly leaders
      const userIds = weeklyEvents.map((e) => e.userId);
      const users = await prisma.user.findMany({
        where: { id: { in: userIds } },
        select: {
          id: true,
          name: true,
          level: true,
          currentStreak: true,
        },
      });
      const userMap = new Map(users.map((u) => [u.id, u]));

      const weeklyLeaderboard = weeklyEvents
        .slice(0, 20)
        .map((item, index) => {
          const u = userMap.get(item.userId);
          return {
            rank: index + 1,
            id: item.userId,
            name: u?.name || "Scholar",
            level: u?.level || 1,
            xp: item._sum.amount || 0,
            currentStreak: u?.currentStreak || 0,
            isCurrentUser: item.userId === currentUserId,
          };
        });

      // If user has no weekly xp events or is not in top 20
      let currentUserRank: any = null;
      if (currentUserId) {
        const inTop = weeklyLeaderboard.find((u) => u.id === currentUserId);
        if (inTop) {
          currentUserRank = inTop;
        } else {
          const userWeeklySum = await prisma.xpEvent.aggregate({
            where: {
              userId: currentUserId,
              createdAt: { gte: sevenDaysAgo },
            },
            _sum: { amount: true },
          });
          const myWeeklyXp = userWeeklySum._sum.amount || 0;
          const user = await prisma.user.findUnique({
            where: { id: currentUserId },
            select: { id: true, name: true, level: true, currentStreak: true },
          });

          // Compute rank by checking how many users had more weekly xp
          const higherCount = weeklyEvents.filter(
            (e) => (e._sum.amount || 0) > myWeeklyXp
          ).length;

          currentUserRank = {
            rank: higherCount + 1,
            id: currentUserId,
            name: user?.name || "You",
            level: user?.level || 1,
            xp: myWeeklyXp,
            currentStreak: user?.currentStreak || 0,
            isCurrentUser: true,
          };
        }
      }

      return res.json({
        data: {
          period: "weekly",
          leaderboard: weeklyLeaderboard,
          currentUserRank,
        },
      });
    }
  } catch (err) {
    next(err);
  }
});

export default router;
