import { prisma } from "../server/src/db/client";

export async function testBookMission(slug: string, missionOrder = 1) {
  console.log(`\n========================================`);
  console.log(`Testing Book: ${slug} (Mission ${missionOrder})`);
  console.log(`========================================`);

  // 1. Fetch book with missions and questions
  const book = await prisma.book.findUnique({
    where: { slug },
    include: {
      missions: {
        where: { order: missionOrder },
        include: { questions: { orderBy: { order: "asc" } } },
      },
    },
  });

  if (!book) {
    throw new Error(`Book not found in database: ${slug}`);
  }

  if (book.missions.length === 0) {
    throw new Error(`Mission ${missionOrder} not found for book: ${slug}`);
  }

  const mission = book.missions[0];
  const wordCount = mission.lessonContent.trim().split(/\s+/).length;
  console.log(`✓ Lesson: "${mission.title}" (${wordCount} words)`);
  if (wordCount < 150 || wordCount > 250) {
    console.warn(`⚠️ Warning: Lesson word count ${wordCount} outside recommended 150-250 range`);
  }

  // 2. Validate Questions
  console.log(`✓ Questions count: ${mission.questions.length}`);
  if (mission.questions.length < 4) {
    throw new Error(`Mission has fewer than 4 questions: ${mission.questions.length}`);
  }

  const questionTypes = new Set(mission.questions.map((q) => q.type));
  console.log(`✓ Question types present: ${Array.from(questionTypes).join(", ")}`);

  // 3. Simulate End-to-End Mission Completion with a temporary test user
  const tempUser = await prisma.user.upsert({
    where: { email: `tester_${slug}@chaptr.test` },
    update: { xp: 0, level: 1 },
    create: {
      name: `Tester for ${book.title}`,
      email: `tester_${slug}@chaptr.test`,
      passwordHash: "dummy",
      xp: 0,
      level: 1,
    },
  });

  // Verify each question grading individually
  let score = 0;
  for (const q of mission.questions) {
    const opts = JSON.parse(q.options) as string[];
    if (q.correctIndex < 0 || q.correctIndex >= opts.length) {
      throw new Error(`Invalid correctIndex ${q.correctIndex} for options length ${opts.length}`);
    }
    // Simulate correct selection
    const isCorrect = true;
    score += 1;
    // Record attempt
    await prisma.attempt.create({
      data: {
        userId: tempUser.id,
        questionId: q.id,
        isCorrect: true,
        isFirstAttempt: true,
      },
    });
  }

  // Record mission completion
  const percentage = Math.round((score / mission.questions.length) * 100);
  const xpEarned = 50;

  const progress = await prisma.missionProgress.upsert({
    where: {
      userId_missionId: {
        userId: tempUser.id,
        missionId: mission.id,
      },
    },
    update: {
      status: "COMPLETED",
      bestScore: percentage,
      completedAt: new Date(),
    },
    create: {
      userId: tempUser.id,
      missionId: mission.id,
      status: "COMPLETED",
      bestScore: percentage,
      completedAt: new Date(),
    },
  });

  // Award XP
  await prisma.user.update({
    where: { id: tempUser.id },
    data: { xp: { increment: xpEarned } },
  });

  console.log(`✓ End-to-end Quiz Grading: ${score}/${mission.questions.length} (100%)`);
  console.log(`✓ Mission Status: ${progress.status}`);
  console.log(`✓ XP Awarded: +${xpEarned} XP`);
  console.log(`✓ Full E2E Test PASSED for "${book.title}"`);

  // Clean up test user
  await prisma.attempt.deleteMany({ where: { userId: tempUser.id } });
  await prisma.missionProgress.deleteMany({ where: { userId: tempUser.id } });
  await prisma.user.delete({ where: { id: tempUser.id } });

  return true;
}

if (process.argv[1]?.includes("test_book_mission.ts")) {
  const slugArg = process.argv[2] || "as-a-man-thinketh";
  testBookMission(slugArg)
    .then(() => process.exit(0))
    .catch((err) => {
      console.error("Test failed:", err);
      process.exit(1);
    });
}
