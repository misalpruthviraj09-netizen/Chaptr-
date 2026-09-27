import { describe, it, expect, beforeAll, afterAll } from "vitest";
import request from "supertest";
import { createApp } from "../app";
import { prisma } from "../db/client";

const app = createApp();

describe("API Integration: Auth & Missions Flow", () => {
  const testEmail = `testuser_${Date.now()}@example.com`;
  let authToken = "";
  let mission1Id = "";
  let questionIds: string[] = [];

  beforeAll(async () => {
    // Ensure book exists (using book #1 As a Man Thinketh)
    let book = await prisma.book.findFirst({
      where: { slug: "as-a-man-thinketh" },
      include: { missions: { orderBy: { order: "asc" }, include: { questions: true } } },
    });
    if (!book) {
      book = await prisma.book.findFirst({
        include: { missions: { orderBy: { order: "asc" }, include: { questions: true } } },
      });
    }
    if (book && book.missions.length > 0) {
      mission1Id = book.missions[0].id;
      questionIds = book.missions[0].questions.map((q) => q.id);
    }
  });

  afterAll(async () => {
    // Clean up test user to ensure no residue in the database
    const testUser = await prisma.user.findUnique({
      where: { email: testEmail },
    });
    if (testUser) {
      await prisma.xpEvent.deleteMany({ where: { userId: testUser.id } });
      await prisma.attempt.deleteMany({ where: { userId: testUser.id } });
      await prisma.reviewCard.deleteMany({ where: { userId: testUser.id } });
      await prisma.missionProgress.deleteMany({ where: { userId: testUser.id } });
      await prisma.userBadge.deleteMany({ where: { userId: testUser.id } });
      await prisma.user.delete({ where: { id: testUser.id } });
    }
  });

  it("registers a new user and returns JWT token and sanitized user object", async () => {
    const res = await request(app)
      .post("/api/auth/register")
      .send({
        name: "Learner One",
        email: testEmail,
        password: "securePassword123!",
        timezone: "America/New_York",
      });

    expect(res.status).toBe(201);
    expect(res.body.data.user.email).toBe(testEmail);
    expect(res.body.data.user.passwordHash).toBeUndefined(); // Never leak passwordHash
    expect(res.body.data.token).toBeDefined();
    authToken = res.body.data.token;
  });

  it("rejects duplicate registration with 409 EMAIL_EXISTS", async () => {
    const res = await request(app)
      .post("/api/auth/register")
      .send({
        name: "Duplicate User",
        email: testEmail,
        password: "anotherPassword123!",
      });

    expect(res.status).toBe(409);
    expect(res.body.error.code).toBe("EMAIL_EXISTS");
  });

  it("authenticates via login and returns token", async () => {
    const res = await request(app)
      .post("/api/auth/login")
      .send({
        email: testEmail,
        password: "securePassword123!",
      });

    expect(res.status).toBe(200);
    expect(res.body.data.token).toBeDefined();
    expect(res.body.data.user.passwordHash).toBeUndefined();
  });

  it("returns 401 with clear message when user is not found", async () => {
    const res = await request(app)
      .post("/api/auth/login")
      .send({
        email: "nonexistent_scholar_user@example.com",
        password: "anyPassword123!",
      });

    expect(res.status).toBe(401);
    expect(res.body.error.code).toBe("USER_NOT_FOUND");
    expect(res.body.error.message).toContain("No account found");
  });

  it("returns 401 with clear message when password is wrong", async () => {
    const res = await request(app)
      .post("/api/auth/login")
      .send({
        email: testEmail,
        password: "wrongPassword123!",
      });

    expect(res.status).toBe(401);
    expect(res.body.error.code).toBe("INVALID_PASSWORD");
    expect(res.body.error.message).toContain("Incorrect password");
  });

  it("authenticates via Google login endpoint", async () => {
    const googleEmail = `googleuser_${Date.now()}@gmail.com`;
    const res = await request(app)
      .post("/api/auth/google")
      .send({
        email: googleEmail,
        name: "Google Scholar",
      });

    expect(res.status).toBe(200);
    expect(res.body.data.user.email).toBe(googleEmail);
    expect(res.body.data.user.name).toBe("Google Scholar");
    expect(res.body.data.token).toBeDefined();

    // Verify existing user logging in with same Google account gets same ID
    const secondRes = await request(app)
      .post("/api/auth/google")
      .send({
        email: googleEmail,
      });

    expect(secondRes.status).toBe(200);
    expect(secondRes.body.data.user.id).toBe(res.body.data.user.id);
  });

  it("authenticates via 1-click demo login", async () => {
    const res = await request(app).post("/api/auth/demo-login");
    expect(res.status).toBe(200);
    expect(res.body.data.user.email).toBe("demo@chaptr.app");
    expect(res.body.data.token).toBeDefined();
  });

  it("fetches authenticated profile via /api/auth/me", async () => {
    const res = await request(app)
      .get("/api/auth/me")
      .set("Authorization", `Bearer ${authToken}`);

    expect(res.status).toBe(200);
    expect(res.body.data.user.email).toBe(testEmail);
  });

  it("never leaks correct answers or explanations in GET /api/missions/:id", async () => {
    expect(mission1Id).toBeTruthy();

    const res = await request(app)
      .get(`/api/missions/${mission1Id}`)
      .set("Authorization", `Bearer ${authToken}`);

    expect(res.status).toBe(200);
    const questions = res.body.data.mission.questions;
    expect(questions.length).toBeGreaterThan(0);

    for (const q of questions) {
      expect(q.correctIndex).toBeUndefined();
      expect(q.explanation).toBeUndefined();
      expect(q.prompt).toBeDefined();
      expect(Array.isArray(q.options)).toBe(true);
    }
  });

  it("checks a sample question with known-correct answer and returns isCorrect: true", async () => {
    const dbQuestions = await prisma.question.findMany({
      where: { missionId: mission1Id },
      orderBy: { order: "asc" },
    });
    expect(dbQuestions.length).toBeGreaterThan(0);
    const sampleQ = dbQuestions[0];
    const options = JSON.parse(sampleQ.options) as string[];

    // 1. Submit known-correct answer
    const correctRes = await request(app)
      .post(`/api/missions/${mission1Id}/check-question`)
      .set("Authorization", `Bearer ${authToken}`)
      .send({
        questionId: sampleQ.id,
        selectedIndex: sampleQ.correctIndex,
        selectedOptionText: options[sampleQ.correctIndex],
      });

    expect(correctRes.status).toBe(200);
    expect(correctRes.body.data.questionId).toBe(sampleQ.id);
    expect(correctRes.body.data.isCorrect).toBe(true);
    expect(correctRes.body.data.correctIndex).toBe(sampleQ.correctIndex);
    expect(correctRes.body.data.correctOptionText).toBe(options[sampleQ.correctIndex]);
    expect(correctRes.body.data.explanation).toBe(sampleQ.explanation);

    // 2. Deliberately submit wrong answer
    const wrongIndex = (sampleQ.correctIndex + 1) % options.length;
    const wrongRes = await request(app)
      .post(`/api/missions/${mission1Id}/check-question`)
      .set("Authorization", `Bearer ${authToken}`)
      .send({
        questionId: sampleQ.id,
        selectedIndex: wrongIndex,
        selectedOptionText: options[wrongIndex],
      });

    expect(wrongRes.status).toBe(200);
    expect(wrongRes.body.data.isCorrect).toBe(false);
    expect(wrongRes.body.data.correctIndex).toBe(sampleQ.correctIndex);

    // 3. Test string-encoded index and text matching resilience
    const stringRes = await request(app)
      .post(`/api/missions/${mission1Id}/check-question`)
      .set("Authorization", `Bearer ${authToken}`)
      .send({
        questionId: sampleQ.id,
        selectedIndex: String(sampleQ.correctIndex),
        selectedOptionText: options[sampleQ.correctIndex],
      });

    expect(stringRes.status).toBe(200);
    expect(stringRes.body.data.isCorrect).toBe(true);
  });

  it("submits answers to a mission, awards XP, and returns full grading", async () => {
    // Look up questions from DB to simulate correct answers
    const dbQuestions = await prisma.question.findMany({
      where: { missionId: mission1Id },
      orderBy: { order: "asc" },
    });

    const answers = dbQuestions.map((q) => ({
      questionId: q.id,
      selectedIndex: q.correctIndex, // 100% correct
    }));

    const res = await request(app)
      .post(`/api/missions/${mission1Id}/submit`)
      .set("Authorization", `Bearer ${authToken}`)
      .send({ answers });

    expect(res.status).toBe(200);
    expect(res.body.data.score).toBe(dbQuestions.length);
    expect(res.body.data.percentage).toBe(100);
    expect(res.body.data.passed).toBe(true);
    expect(res.body.data.xpEarned).toBeGreaterThan(0);
    expect(res.body.data.level).toBeDefined();
    expect(res.body.data.previousLevel).toBeDefined();
    expect(res.body.data.xpProgress).toBeDefined();
    expect(res.body.data.xpProgress.currentLevel).toBe(res.body.data.level);
    expect(res.body.data.currentStreak).toBeGreaterThanOrEqual(1);

    // Verify next mission is unlocked
    const book = await prisma.book.findFirst({
      where: { slug: "as-a-man-thinketh" },
      include: { missions: { orderBy: { order: "asc" } } },
    });
    const mission2 = book?.missions[1];
    if (mission2) {
      const userProg2 = await prisma.missionProgress.findFirst({
        where: { missionId: mission2.id, userId: res.body.data.userId || undefined },
      });
      // Next mission was unlocked
      expect(res.body.data.nextMissionId).toBe(mission2.id);
    }
  });

  it("allows joining waitlist and returns 409 on duplicate email", async () => {
    const waitlistEmail = `waitlist_${Date.now()}@domain.org`;

    const res1 = await request(app)
      .post("/api/waitlist")
      .send({
        name: "Taylor Future",
        email: waitlistEmail,
        role: "PROFESSIONAL",
      });

    expect(res1.status).toBe(201);
    expect(res1.body.data.success).toBe(true);

    const res2 = await request(app)
      .post("/api/waitlist")
      .send({
        name: "Taylor Duplicate",
        email: waitlistEmail,
        role: "STUDENT",
      });

    expect(res2.status).toBe(409);
    expect(res2.body.error.code).toBe("ALREADY_ON_WAITLIST");
  });

  it("fetches dashboard progression and tracks cumulative mission mastery points", async () => {
    const res = await request(app)
      .get("/api/me/dashboard")
      .set("Authorization", `Bearer ${authToken}`);

    expect(res.status).toBe(200);
    const { progression, todayStats, readingMastery } = res.body.data;
    expect(progression).toBeDefined();
    expect(progression.currentLevel).toBeGreaterThanOrEqual(1);
    expect(progression.cumulativeMissionPoints).toBeGreaterThanOrEqual(0);
    expect(progression.completedMissionsCount).toBeGreaterThanOrEqual(1);
    expect(todayStats).toBeDefined();

    // Verify Reading Mastery 30-day widget data
    expect(readingMastery).toBeDefined();
    expect(readingMastery.history).toBeDefined();
    expect(readingMastery.history.length).toBe(30);
    expect(readingMastery.summary).toBeDefined();
    expect(typeof readingMastery.summary.totalMissionsMastered30d).toBe("number");
    expect(typeof readingMastery.summary.totalBooksCompleted30d).toBe("number");
    expect(readingMastery.summary.totalMissionsMasteredAllTime).toBeGreaterThanOrEqual(1);

    const latestPoint = readingMastery.history[readingMastery.history.length - 1];
    expect(latestPoint).toHaveProperty("date");
    expect(latestPoint).toHaveProperty("label");
    expect(latestPoint).toHaveProperty("cumulativeMissions");
    expect(latestPoint).toHaveProperty("cumulativeBooks");
    expect(latestPoint.cumulativeMissions).toBeGreaterThanOrEqual(1);
  });

  it("retrieves weekly and all-time community leaderboards with active scholars", async () => {
    const weeklyRes = await request(app).get("/api/leaderboard?period=weekly");
    expect(weeklyRes.status).toBe(200);
    expect(weeklyRes.body.data.period).toBe("weekly");
    expect(Array.isArray(weeklyRes.body.data.leaderboard)).toBe(true);
    expect(weeklyRes.body.data.leaderboard.length).toBeGreaterThan(0);

    const allRes = await request(app).get("/api/leaderboard?period=all");
    expect(allRes.status).toBe(200);
    expect(allRes.body.data.period).toBe("all");
    expect(Array.isArray(allRes.body.data.leaderboard)).toBe(true);
    expect(allRes.body.data.leaderboard.length).toBeGreaterThan(0);
  });

  it("resets and re-seeds community leaderboard cleanly via POST /api/leaderboard/reset", async () => {
    const res = await request(app).post("/api/leaderboard/reset");
    expect(res.status).toBe(200);
    expect(res.body.data.success).toBe(true);
    expect(res.body.data.scholarCount).toBeGreaterThanOrEqual(14);
  });

  describe("Pip AI Tutor Integration", () => {
    it("returns active status for Pip AI tutor", async () => {
      const res = await request(app).get("/api/tutor/status");
      expect(res.status).toBe(200);
      expect(res.body.data.enabled).toBe(true);
      expect(res.body.data.mascot).toBe("Pip");
      expect(res.body.data.provider).toBe("gemini");
    });

    it("generates an analogy and explanation for a valid question", async () => {
      if (questionIds.length === 0) return;
      const res = await request(app)
        .post("/api/tutor/explain")
        .set("Authorization", `Bearer ${authToken}`)
        .send({ questionId: questionIds[0] });

      expect(res.status).toBe(200);
      expect(res.body.data.questionId).toBe(questionIds[0]);
      expect(typeof res.body.data.explanation).toBe("string");
      expect(res.body.data.explanation.length).toBeGreaterThan(10);
    }, 15000);

    it("answers general study questions via askPipTutor", async () => {
      const res = await request(app)
        .post("/api/tutor/ask")
        .set("Authorization", `Bearer ${authToken}`)
        .send({
          message: "Can you explain the 2-minute rule in simple words?",
          bookTitle: "Atomic Habits",
          concept: "Friction",
        });

      expect(res.status).toBe(200);
      expect(typeof res.body.data.reply).toBe("string");
      expect(res.body.data.reply.length).toBeGreaterThan(10);
    }, 15000);
  });
});
