import { prisma } from "../server/src/db/client";
import { all100Books } from "../prisma/data/allBooks";

async function cleanLegacyBooks() {
  const allowedSlugs = new Set(all100Books.map((b) => b.slug));
  const allDbBooks = await prisma.book.findMany();

  let removedCount = 0;
  for (const b of allDbBooks) {
    if (!allowedSlugs.has(b.slug)) {
      console.log(`Removing legacy book not in 100-book roster: ${b.slug} (${b.title})`);
      // Delete child relations
      const missions = await prisma.mission.findMany({ where: { bookId: b.id } });
      for (const m of missions) {
        await prisma.attempt.deleteMany({ where: { question: { missionId: m.id } } });
        await prisma.reviewCard.deleteMany({ where: { question: { missionId: m.id } } });
        await prisma.question.deleteMany({ where: { missionId: m.id } });
        await prisma.missionProgress.deleteMany({ where: { missionId: m.id } });
      }
      await prisma.mission.deleteMany({ where: { bookId: b.id } });
      await prisma.book.delete({ where: { id: b.id } });
      removedCount++;
    }
  }

  const finalCount = await prisma.book.count();
  const missionsCount = await prisma.mission.count();
  const questionsCount = await prisma.question.count();
  console.log(`\nLegacy cleanup finished. Removed: ${removedCount}`);
  console.log(`Exact Books count: ${finalCount}`);
  console.log(`Exact Missions count: ${missionsCount}`);
  console.log(`Exact Questions count: ${questionsCount}`);
}

cleanLegacyBooks()
  .then(() => process.exit(0))
  .catch((e) => {
    console.error("Clean failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
