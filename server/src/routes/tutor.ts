import { Router } from "express";
import { z } from "zod";
import rateLimit from "express-rate-limit";
import { prisma } from "../db/client";
import { optionalAuth, AuthenticatedRequest } from "../middleware/auth";
import { createError } from "../middleware/errorHandler";
import { generateQuestionAnalogy, askPipTutor } from "../services/gemini";

const router = Router();

const tutorLimiter = rateLimit({
  windowMs: 5 * 60 * 1000,
  max: 60,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    error: {
      code: "RATE_LIMITED",
      message: "Pip is processing a lot of questions right now! Please wait a moment before asking again.",
    },
  },
});

const ExplainSchema = z.object({
  questionId: z.string().uuid(),
  userSelectedOption: z.string().optional(),
});

const AskSchema = z.object({
  message: z.string().min(1, "Message cannot be empty").max(2000, "Message too long"),
  bookTitle: z.string().optional(),
  missionTitle: z.string().optional(),
  concept: z.string().optional(),
  history: z
    .array(
      z.object({
        role: z.string(),
        text: z.string(),
      })
    )
    .optional(),
});

// GET /api/tutor/status - Check AI tutor status
router.get("/status", (req, res) => {
  return res.json({
    data: {
      enabled: true,
      mascot: "Pip",
      provider: "gemini",
      model: "gemini-3.6-flash",
      fallbackModels: ["gemini-3.5-flash-lite", "gemini-3.8-flash"],
    },
  });
});

// POST /api/tutor/explain - Get personalized Pip analogy for a question
router.post("/explain", optionalAuth, tutorLimiter, async (req: AuthenticatedRequest, res, next) => {
  try {
    const { questionId, userSelectedOption } = ExplainSchema.parse(req.body);

    const question = await prisma.question.findUnique({
      where: { id: questionId },
      include: {
        mission: {
          include: { book: true },
        },
      },
    });

    if (!question) {
      throw createError(404, "NOT_FOUND", "Question not found.");
    }

    let parsedOptions: string[] = [];
    try {
      parsedOptions = JSON.parse(question.options);
    } catch {
      parsedOptions = [];
    }

    const correctAnswer =
      parsedOptions.length > question.correctIndex
        ? parsedOptions[question.correctIndex]
        : undefined;

    const explanation = await generateQuestionAnalogy({
      bookTitle: question.mission.book.title,
      missionTitle: question.mission.title,
      questionPrompt: question.prompt,
      conceptTag: question.conceptTag,
      standardExplanation: question.explanation,
      options: parsedOptions,
      correctAnswer,
      userSelectedOption,
    });

    return res.json({
      data: {
        questionId,
        explanation,
      },
    });
  } catch (err) {
    next(err);
  }
});

// POST /api/tutor/ask - Ask Pip AI any question about learning or concepts
router.post("/ask", optionalAuth, tutorLimiter, async (req: AuthenticatedRequest, res, next) => {
  try {
    const { message, bookTitle, missionTitle, concept, history } = AskSchema.parse(req.body);

    const reply = await askPipTutor(message, {
      bookTitle,
      missionTitle,
      currentConcept: concept,
      history,
    });

    return res.json({
      data: {
        reply,
      },
    });
  } catch (err) {
    next(err);
  }
});

export default router;
