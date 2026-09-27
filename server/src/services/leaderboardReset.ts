import bcrypt from "bcryptjs";
import { prisma } from "../db/client";

export interface CommunityScholarSeed {
  name: string;
  email: string;
  xp: number;
  weeklyXp: number;
  level: number;
  currentStreak: number;
  longestStreak: number;
}

export const COMMUNITY_SCHOLARS: CommunityScholarSeed[] = [
  {
    name: "Marcus Vance",
    email: "marcus.vance@scholar.chaptr.app",
    xp: 920,
    weeklyXp: 410,
    level: 5,
    currentStreak: 16,
    longestStreak: 21,
  },
  {
    name: "Elena Rostova",
    email: "elena.rostova@scholar.chaptr.app",
    xp: 840,
    weeklyXp: 360,
    level: 5,
    currentStreak: 14,
    longestStreak: 18,
  },
  {
    name: "Amara Okafor",
    email: "amara.okafor@scholar.chaptr.app",
    xp: 760,
    weeklyXp: 310,
    level: 4,
    currentStreak: 12,
    longestStreak: 15,
  },
  {
    name: "Sophia Chen",
    email: "sophia.chen@scholar.chaptr.app",
    xp: 690,
    weeklyXp: 275,
    level: 4,
    currentStreak: 10,
    longestStreak: 14,
  },
  {
    name: "Liam Gallagher",
    email: "liam.gallagher@scholar.chaptr.app",
    xp: 610,
    weeklyXp: 240,
    level: 3,
    currentStreak: 9,
    longestStreak: 11,
  },
  {
    name: "David Kim",
    email: "david.kim@scholar.chaptr.app",
    xp: 540,
    weeklyXp: 215,
    level: 3,
    currentStreak: 8,
    longestStreak: 12,
  },
  {
    name: "Zoe Martinez",
    email: "zoe.martinez@scholar.chaptr.app",
    xp: 480,
    weeklyXp: 190,
    level: 3,
    currentStreak: 7,
    longestStreak: 9,
  },
  {
    name: "Oliver Brooks",
    email: "oliver.brooks@scholar.chaptr.app",
    xp: 420,
    weeklyXp: 165,
    level: 2,
    currentStreak: 6,
    longestStreak: 8,
  },
  {
    name: "Maya Patel",
    email: "maya.patel@scholar.chaptr.app",
    xp: 350,
    weeklyXp: 140,
    level: 2,
    currentStreak: 5,
    longestStreak: 7,
  },
  {
    name: "Julian Torres",
    email: "julian.torres@scholar.chaptr.app",
    xp: 290,
    weeklyXp: 115,
    level: 2,
    currentStreak: 4,
    longestStreak: 6,
  },
  {
    name: "Chloe Bennett",
    email: "chloe.bennett@scholar.chaptr.app",
    xp: 220,
    weeklyXp: 90,
    level: 2,
    currentStreak: 3,
    longestStreak: 5,
  },
  {
    name: "Lucas Wright",
    email: "lucas.wright@scholar.chaptr.app",
    xp: 160,
    weeklyXp: 75,
    level: 1,
    currentStreak: 2,
    longestStreak: 4,
  },
  {
    name: "Aria Thorne",
    email: "aria.thorne@scholar.chaptr.app",
    xp: 120,
    weeklyXp: 50,
    level: 1,
    currentStreak: 2,
    longestStreak: 3,
  },
  {
    name: "Felix Moreau",
    email: "felix.moreau@scholar.chaptr.app",
    xp: 80,
    weeklyXp: 35,
    level: 1,
    currentStreak: 1,
    longestStreak: 2,
  },
];

export async function resetAndSeedLeaderboard() {
  // 1. Purge automated test accounts and artifacts
  const testUsers = await prisma.user.findMany({
    where: {
      OR: [
        { email: { endsWith: "@example.com" } },
        { email: { startsWith: "testuser_" } },
        { email: { startsWith: "googleuser_" } },
        { email: { startsWith: "thinker_" } },
        { email: { startsWith: "wattles_" } },
        { email: { startsWith: "focused_" } },
        { email: { startsWith: "barnum_" } },
      ],
    },
    select: { id: true },
  });

  if (testUsers.length > 0) {
    const testUserIds = testUsers.map((u) => u.id);
    await prisma.xpEvent.deleteMany({
      where: { userId: { in: testUserIds } },
    });
    await prisma.attempt.deleteMany({
      where: { userId: { in: testUserIds } },
    });
    await prisma.reviewCard.deleteMany({
      where: { userId: { in: testUserIds } },
    });
    await prisma.missionProgress.deleteMany({
      where: { userId: { in: testUserIds } },
    });
    await prisma.userBadge.deleteMany({
      where: { userId: { in: testUserIds } },
    });
    await prisma.user.deleteMany({
      where: { id: { in: testUserIds } },
    });
  }

  // 2. Upsert community scholars and populate their weekly XP events
  const defaultPasswordHash = await bcrypt.hash("scholarPass123!", 10);
  const now = new Date();

  for (const scholar of COMMUNITY_SCHOLARS) {
    const user = await prisma.user.upsert({
      where: { email: scholar.email },
      update: {
        name: scholar.name,
        xp: scholar.xp,
        level: scholar.level,
        currentStreak: scholar.currentStreak,
        longestStreak: scholar.longestStreak,
      },
      create: {
        name: scholar.name,
        email: scholar.email,
        passwordHash: defaultPasswordHash,
        xp: scholar.xp,
        level: scholar.level,
        currentStreak: scholar.currentStreak,
        longestStreak: scholar.longestStreak,
        timezone: "UTC",
      },
    });

    // Delete prior simulated weekly events for this scholar
    await prisma.xpEvent.deleteMany({
      where: { userId: user.id },
    });

    // Spread weeklyXp across realistic recent events (1-5 days ago)
    const portion1 = Math.round(scholar.weeklyXp * 0.55);
    const portion2 = scholar.weeklyXp - portion1;

    await prisma.xpEvent.createMany({
      data: [
        {
          userId: user.id,
          amount: portion1,
          reason: "Mission Completion & Perfect Recall",
          createdAt: new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000),
        },
        {
          userId: user.id,
          amount: portion2,
          reason: "Daily Spaced Repetition Review",
          createdAt: new Date(now.getTime() - 4 * 24 * 60 * 60 * 1000),
        },
      ],
    });
  }

  // 3. Ensure Demo Scholar user exists and has active progress
  const demoEmail = "demo@chaptr.app";
  const demoHash = await bcrypt.hash("password123", 10);
  const demoUser = await prisma.user.upsert({
    where: { email: demoEmail },
    update: {
      name: "Demo Scholar",
      xp: 390,
      level: 2,
      currentStreak: 4,
      longestStreak: 8,
    },
    create: {
      name: "Demo Scholar",
      email: demoEmail,
      passwordHash: demoHash,
      timezone: "UTC",
      xp: 390,
      level: 2,
      currentStreak: 4,
      longestStreak: 8,
    },
  });

  // Ensure Demo Scholar has a weekly event if none exists
  const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
  const demoWeeklyCount = await prisma.xpEvent.count({
    where: {
      userId: demoUser.id,
      createdAt: { gte: sevenDaysAgo },
    },
  });

  if (demoWeeklyCount === 0) {
    await prisma.xpEvent.create({
      data: {
        userId: demoUser.id,
        amount: 185,
        reason: "Mission Mastery: Habit Building Basics",
        createdAt: new Date(now.getTime() - 1 * 24 * 60 * 60 * 1000),
      },
    });
  }

  return {
    success: true,
    message: "Leaderboard reset successfully with clean community scholars and active weekly standings.",
    scholarCount: COMMUNITY_SCHOLARS.length + 1,
  };
}
