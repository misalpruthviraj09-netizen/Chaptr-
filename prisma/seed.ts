import path from "path";
import fs from "fs";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import { APP_NAME } from "../src/config/brand";
import { all100Books } from "./data/allBooks";
import { BookSeedData } from "./data/types";

if (!process.env.DATABASE_URL || !process.env.DATABASE_URL.startsWith("file:")) {
  const prismaDb = path.resolve(process.cwd(), "prisma/dev.db");
  const rootDb = path.resolve(process.cwd(), "dev.db");
  const targetDb = fs.existsSync(prismaDb) ? prismaDb : rootDb;
  process.env.DATABASE_URL = `file:${targetDb}`;
}

const prisma = new PrismaClient();

export async function seedDatabase(options?: { group?: number }) {
  console.log(`Starting seed for ${APP_NAME}...`);

  // 1. Seed Badges
  const badges = [
    {
      key: "first_mission",
      name: "First Mission",
      description: "Completed your first learning mission.",
      icon: "rocket",
      tier: "BRONZE",
    },
    {
      key: "streak_3",
      name: "3-Day Streak",
      description: "Maintained a learning habit for 3 consecutive days.",
      icon: "flame",
      tier: "BRONZE",
    },
    {
      key: "streak_7",
      name: "7-Day Streak",
      description: "Achieved a full week of consistent learning.",
      icon: "zap",
      tier: "SILVER",
    },
    {
      key: "perfect_score",
      name: "Perfect Score",
      description: "Scored 100% on any interactive book mission.",
      icon: "award",
      tier: "SILVER",
    },
    {
      key: "book_finished",
      name: "Book Finished",
      description: "Mastered all missions in a complete book.",
      icon: "book-check",
      tier: "GOLD",
    },
    {
      key: "level_5",
      name: "Level 5",
      description: "Reached knowledge player level 5.",
      icon: "shield",
      tier: "SILVER",
    },
    {
      key: "reviewer_50",
      name: "Reviewer",
      description: "Answered 50 spaced repetition review cards.",
      icon: "sparkles",
      tier: "GOLD",
    },
  ];

  for (const badge of badges) {
    await prisma.badge.upsert({
      where: { key: badge.key },
      update: badge,
      create: badge,
    });
  }
  console.log(`Seeded ${badges.length} badges.`);

  // 2. Filter Books if group is specified
  let booksToSeed: BookSeedData[] = all100Books;
  if (options?.group && options.group >= 1 && options.group <= 10) {
    const start = (options.group - 1) * 10;
    booksToSeed = all100Books.slice(start, start + 10);
    console.log(`Seeding specifically Group ${options.group} (Books ${start + 1} to ${start + booksToSeed.length})...`);
  } else {
    console.log(`Seeding all ${all100Books.length} books in library...`);
  }

  // 3. Upsert Books, Missions, and Questions
  let bookCount = 0;
  let missionCount = 0;
  let questionCount = 0;

  for (const bookData of booksToSeed) {
    const { missions, ...bookMeta } = bookData;

    const book = await prisma.book.upsert({
      where: { slug: bookMeta.slug },
      update: bookMeta,
      create: bookMeta,
    });
    bookCount++;

    for (const missionData of missions) {
      const { questions, ...missionMeta } = missionData;

      const existingMission = await prisma.mission.findFirst({
        where: { bookId: book.id, order: missionMeta.order },
      });

      let missionId: string;
      if (existingMission) {
        await prisma.mission.update({
          where: { id: existingMission.id },
          data: missionMeta,
        });
        missionId = existingMission.id;
      } else {
        const created = await prisma.mission.create({
          data: {
            ...missionMeta,
            bookId: book.id,
          },
        });
        missionId = created.id;
      }
      missionCount++;

      for (const q of questions) {
        const existingQ = await prisma.question.findFirst({
          where: { missionId, order: q.order },
        });

        if (existingQ) {
          await prisma.question.update({
            where: { id: existingQ.id },
            data: q,
          });
        } else {
          await prisma.question.create({
            data: {
              ...q,
              missionId,
            },
          });
        }
        questionCount++;
      }
    }
  }

  console.log(`✓ Upserted ${bookCount} books, ${missionCount} missions, and ${questionCount} questions.`);

  // 4. Seed Demo Scholar User
  const demoHash = await bcrypt.hash("password123", 10);
  const demoUser = await prisma.user.upsert({
    where: { email: "demo@chaptr.app" },
    update: {
      xp: 390,
      level: 4,
      currentStreak: 5,
      longestStreak: 8,
    },
    create: {
      name: "Demo Scholar",
      email: "demo@chaptr.app",
      passwordHash: demoHash,
      timezone: "UTC",
      xp: 390,
      level: 4,
      currentStreak: 5,
      longestStreak: 8,
    },
  });

  // Seed sample completed missions for demo user on Book #1 (As a Man Thinketh)
  const firstBook = await prisma.book.findUnique({
    where: { slug: "as-a-man-thinketh" },
    include: { missions: { orderBy: { order: "asc" } } },
  });

  const now = new Date();
  if (firstBook && firstBook.missions.length >= 5) {
    const dates = [
      new Date(now.getTime() - 10 * 24 * 60 * 60 * 1000),
      new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000),
      new Date(now.getTime() - 5 * 24 * 60 * 60 * 1000),
      new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000),
      new Date(now.getTime() - 1 * 24 * 60 * 60 * 1000),
    ];
    for (let i = 0; i < 5; i++) {
      await prisma.missionProgress.upsert({
        where: {
          userId_missionId: {
            userId: demoUser.id,
            missionId: firstBook.missions[i].id,
          },
        },
        update: {
          status: "COMPLETED",
          bestScore: 100,
          completedAt: dates[i],
        },
        create: {
          userId: demoUser.id,
          missionId: firstBook.missions[i].id,
          status: "COMPLETED",
          bestScore: 100,
          completedAt: dates[i],
        },
      });
    }
  }

  // 5. Seed Community Scholars Leaderboard
  const { resetAndSeedLeaderboard } = await import("../server/src/services/leaderboardReset");
  await resetAndSeedLeaderboard();

  console.log(`Database seeded successfully for ${bookCount} books!`);
  return { bookCount, missionCount, questionCount };
}

// Run directly if executed as main script
if (process.argv[1]?.includes("seed.ts")) {
  let groupArg: number | undefined;
  const groupMatch = process.argv.find((a) => a.startsWith("--group="));
  if (groupMatch) {
    groupArg = parseInt(groupMatch.split("=")[1], 10);
  }

  seedDatabase(groupArg ? { group: groupArg } : undefined)
    .catch((e) => {
      console.error("Seed failed:", e);
      process.exit(1);
    })
    .finally(async () => {
      await prisma.$disconnect();
    });
}
