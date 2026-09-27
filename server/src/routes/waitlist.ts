import { Router } from "express";
import { z } from "zod";
import rateLimit from "express-rate-limit";
import { prisma } from "../db/client";
import { createError } from "../middleware/errorHandler";

const router = Router();

const waitlistLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10, // max 10 submissions per IP
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    error: {
      code: "RATE_LIMITED",
      message: "Too many requests. Please wait a few minutes before trying again.",
    },
  },
});

const WaitlistSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").max(60),
  email: z.string().email("Please provide a valid email address"),
  role: z.enum(["STUDENT", "PROFESSIONAL", "LIFELONG_LEARNER", "EDUCATOR", "OTHER"]),
});

// POST /api/waitlist
router.post("/", waitlistLimiter, async (req, res, next) => {
  try {
    const { name, email, role } = WaitlistSchema.parse(req.body);

    const existing = await prisma.waitlistEntry.findUnique({
      where: { email: email.toLowerCase() },
    });

    if (existing) {
      throw createError(
        409,
        "ALREADY_ON_WAITLIST",
        "You are already on the priority access waitlist! We will notify you as soon as new spots open."
      );
    }

    const entry = await prisma.waitlistEntry.create({
      data: {
        name,
        email: email.toLowerCase(),
        role,
      },
    });

    const totalCount = await prisma.waitlistEntry.count();

    return res.status(201).json({
      data: {
        success: true,
        message: "You're on the list! Welcome to the priority waitlist.",
        entry: {
          id: entry.id,
          name: entry.name,
          email: entry.email,
          role: entry.role,
        },
        queuePosition: totalCount,
      },
    });
  } catch (err) {
    next(err);
  }
});

export default router;
