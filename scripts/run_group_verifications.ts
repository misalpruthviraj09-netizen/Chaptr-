import { BOOK_DEFINITIONS } from "./generate_library_groups";
import { seedDatabase } from "../prisma/seed";
import { testBookMission } from "./test_book_mission";
import { prisma } from "../server/src/db/client";

async function main() {
  console.log("===============================================================");
  console.log("STARTING SEQUENTIAL 10-GROUP VERIFICATION FOR ALL 100 BOOKS");
  console.log("===============================================================\n");

  let cumulativeBooks = 0;
  let cumulativeMissions = 0;
  let cumulativeQuestions = 0;
  const groupResults: Array<{
    group: number;
    range: string;
    booksSeeded: number;
    testedBooks: string[];
    status: string;
  }> = [];

  for (let g = 1; g <= 10; g++) {
    const startIdx = (g - 1) * 10;
    const endIdx = startIdx + 10;
    const groupDefs = BOOK_DEFINITIONS.slice(startIdx, endIdx);
    const range = `Books #${startIdx + 1} - #${endIdx}`;

    console.log(`\n---------------------------------------------------------------`);
    console.log(`>>> PROCESSING GROUP ${g}/10: ${range}`);
    console.log(`---------------------------------------------------------------`);

    // 1. Run seed for this group
    await seedDatabase({ group: g });

    // 2. Verify all 10 books exist in DB with 5 missions each
    for (const def of groupDefs) {
      const book = await prisma.book.findUnique({
        where: { slug: def.slug },
        include: { missions: { include: { questions: true } } },
      });

      if (!book) {
        throw new Error(`CRITICAL: Book ${def.slug} was not found in database!`);
      }
      if (book.missions.length !== 5) {
        throw new Error(`CRITICAL: Book ${def.slug} has ${book.missions.length} missions (expected 5)!`);
      }
      for (const m of book.missions) {
        if (m.questions.length < 4) {
          throw new Error(`CRITICAL: Mission ${m.id} has ${m.questions.length} questions (expected 4+)!`);
        }
      }
    }

    cumulativeBooks += groupDefs.length;
    cumulativeMissions += groupDefs.length * 5;
    cumulativeQuestions += groupDefs.length * 20;

    // 3. Pick 2 random books from this group for end-to-end mission test
    // E.g. book at index 2 and index 7 within this group of 10
    const pick1 = groupDefs[1]; // 2nd book in group
    const pick2 = groupDefs[6]; // 7th book in group

    console.log(`\n[Manual End-to-End Test: Sample Book 1/2 in Group ${g}]`);
    await testBookMission(pick1.slug, 1);

    console.log(`\n[Manual End-to-End Test: Sample Book 2/2 in Group ${g}]`);
    await testBookMission(pick2.slug, 1);

    console.log(`\n✓ GROUP ${g} COMPLETED SUCCESSFULLY!`);
    console.log(`Running Tally: ${cumulativeBooks}/100 Books | ${cumulativeMissions}/500 Missions | ${cumulativeQuestions}/2000 Questions`);

    groupResults.push({
      group: g,
      range,
      booksSeeded: groupDefs.length,
      testedBooks: [pick1.title, pick2.title],
      status: "VERIFIED_AND_PASSED",
    });
  }

  // Finally, run full seed to ensure all relations, demo user, and scholars are in final state
  console.log(`\n---------------------------------------------------------------`);
  console.log(`>>> RUNNING FINAL CONVERGENCE SEED FOR ALL 100 BOOKS`);
  console.log(`---------------------------------------------------------------`);
  await seedDatabase();

  const totalInDb = await prisma.book.count();
  const publishedInDb = await prisma.book.count({ where: { isPublished: true } });
  const totalMissionsInDb = await prisma.mission.count();
  const totalQuestionsInDb = await prisma.question.count();

  console.log("\n===============================================================");
  console.log("FINAL DATABASE TALLY SUMMARY");
  console.log("===============================================================");
  console.log(`Total Books in DB: ${totalInDb}`);
  console.log(`Total Published Books: ${publishedInDb}`);
  console.log(`Total Missions in DB: ${totalMissionsInDb}`);
  console.log(`Total Questions in DB: ${totalQuestionsInDb}`);
  console.log("===============================================================\n");

  return { totalInDb, publishedInDb, totalMissionsInDb, totalQuestionsInDb, groupResults };
}

main()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error("Verification failed:", err);
    process.exit(1);
  });
