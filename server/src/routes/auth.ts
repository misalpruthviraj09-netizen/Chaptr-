import { Router } from "express";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { prisma } from "../db/client";
import {
  generateToken,
  setTokenCookie,
  clearTokenCookie,
  requireAuth,
  AuthenticatedRequest,
} from "../middleware/auth";
import { createError } from "../middleware/errorHandler";

const router = Router();

const RegisterSchema = z.object({
  name: z.string().trim().min(2, "Name must be at least 2 characters").max(60),
  email: z.string().trim().email("Please provide a valid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  timezone: z.string().optional().default("UTC"),
});

const LoginSchema = z.object({
  email: z.string().trim().email("Please provide a valid email address"),
  password: z.string().min(1, "Password is required"),
});

const GoogleAuthSchema = z.object({
  accessToken: z.string().optional(),
  idToken: z.string().optional(),
  email: z.string().email().optional(),
  name: z.string().optional(),
  picture: z.string().optional(),
});

// GET /api/auth/config
router.get("/config", (req, res) => {
  const googleClientId =
    process.env.VITE_GOOGLE_CLIENT_ID ||
    "1042202591261-3k4aqc9fm6s9nin1ke5vnttus7nvtlem.apps.googleusercontent.com";
  return res.json({
    data: {
      googleClientId,
    },
  });
});

// POST /api/auth/google
router.post("/google", async (req, res, next) => {
  try {
    const { accessToken, email, name } = GoogleAuthSchema.parse(req.body);

    let verifiedEmail = email ? email.trim().toLowerCase() : "";
    let verifiedName = name ? name.trim() : "";

    // If an accessToken is provided, verify it directly with Google's UserInfo API
    if (accessToken) {
      try {
        const googleRes = await fetch("https://www.googleapis.com/oauth2/v3/userinfo", {
          headers: { Authorization: `Bearer ${accessToken}` },
        });
        if (googleRes.ok) {
          const googleUser = (await googleRes.json()) as { email?: string; name?: string };
          if (googleUser.email) {
            verifiedEmail = googleUser.email.trim().toLowerCase();
          }
          if (googleUser.name) {
            verifiedName = googleUser.name.trim();
          }
        }
      } catch (err) {
        console.warn("Failed to contact Google userinfo endpoint:", err);
      }
    }

    if (!verifiedEmail) {
      throw createError(
        400,
        "INVALID_GOOGLE_AUTH",
        "Could not verify Google account information. Please try again."
      );
    }

    // Look for existing user
    let user = await prisma.user.findUnique({
      where: { email: verifiedEmail },
    });

    if (!user) {
      // Create user for Google account
      const randomSecret = Math.random().toString(36).slice(2) + Date.now().toString(36);
      const passwordHash = await bcrypt.hash(randomSecret, 10);
      const displayName = verifiedName || verifiedEmail.split("@")[0] || "Scholar";

      user = await prisma.user.create({
        data: {
          name: displayName,
          email: verifiedEmail,
          passwordHash,
          timezone: "UTC",
          xp: 0,
          level: 1,
          currentStreak: 0,
          longestStreak: 0,
        },
      });
    }

    const token = generateToken({ userId: user.id, email: user.email });
    setTokenCookie(res, token);

    const safeUser = {
      id: user.id,
      name: user.name,
      email: user.email,
      timezone: user.timezone,
      xp: user.xp,
      level: user.level,
      currentStreak: user.currentStreak,
      longestStreak: user.longestStreak,
      createdAt: user.createdAt,
    };

    return res.json({
      data: {
        user: safeUser,
        token,
      },
    });
  } catch (err) {
    next(err);
  }
});

// POST /api/auth/register
router.post("/register", async (req, res, next) => {
  try {
    const { name, email, password, timezone } = RegisterSchema.parse(req.body);
    const normalizedEmail = email.trim().toLowerCase();

    const existingUser = await prisma.user.findUnique({
      where: { email: normalizedEmail },
    });

    if (existingUser) {
      throw createError(409, "EMAIL_EXISTS", "An account with this email already exists.");
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        name,
        email: normalizedEmail,
        passwordHash,
        timezone,
        xp: 0,
        level: 1,
        currentStreak: 0,
        longestStreak: 0,
      },
      select: {
        id: true,
        name: true,
        email: true,
        timezone: true,
        xp: true,
        level: true,
        currentStreak: true,
        longestStreak: true,
        createdAt: true,
      },
    });

    const token = generateToken({ userId: user.id, email: user.email });
    setTokenCookie(res, token);

    return res.status(201).json({
      data: {
        user,
        token,
      },
    });
  } catch (err) {
    next(err);
  }
});

// POST /api/auth/login
router.post("/login", async (req, res, next) => {
  try {
    const { email, password } = LoginSchema.parse(req.body);
    const normalizedEmail = email.trim().toLowerCase();

    const user = await prisma.user.findUnique({
      where: { email: normalizedEmail },
    });

    if (!user) {
      throw createError(
        401,
        "USER_NOT_FOUND",
        "No account found with this email. Please check your spelling or register."
      );
    }

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      throw createError(
        401,
        "INVALID_PASSWORD",
        "Incorrect password. Please try again."
      );
    }

    const token = generateToken({ userId: user.id, email: user.email });
    setTokenCookie(res, token);

    const safeUser = {
      id: user.id,
      name: user.name,
      email: user.email,
      timezone: user.timezone,
      xp: user.xp,
      level: user.level,
      currentStreak: user.currentStreak,
      longestStreak: user.longestStreak,
      createdAt: user.createdAt,
    };

    return res.json({
      data: {
        user: safeUser,
        token,
      },
    });
  } catch (err) {
    next(err);
  }
});

// POST /api/auth/demo-login
router.post("/demo-login", async (req, res, next) => {
  try {
    const demoEmail = "demo@chaptr.app";
    let user = await prisma.user.findUnique({
      where: { email: demoEmail },
    });

    if (!user) {
      const demoHash = await bcrypt.hash("password123", 10);
      user = await prisma.user.create({
        data: {
          name: "Demo Scholar",
          email: demoEmail,
          passwordHash: demoHash,
          timezone: "UTC",
          xp: 140,
          level: 2,
          currentStreak: 4,
          longestStreak: 7,
        },
      });
    }

    const token = generateToken({ userId: user.id, email: user.email });
    setTokenCookie(res, token);

    const safeUser = {
      id: user.id,
      name: user.name,
      email: user.email,
      timezone: user.timezone,
      xp: user.xp,
      level: user.level,
      currentStreak: user.currentStreak,
      longestStreak: user.longestStreak,
      createdAt: user.createdAt,
    };

    return res.json({
      data: {
        user: safeUser,
        token,
      },
    });
  } catch (err) {
    next(err);
  }
});

// POST /api/auth/logout
router.post("/logout", (req, res) => {
  clearTokenCookie(res);
  return res.json({
    data: {
      success: true,
      message: "Logged out successfully.",
    },
  });
});

// GET /api/auth/me
router.get("/me", requireAuth, (req: AuthenticatedRequest, res) => {
  return res.json({
    data: {
      user: req.user,
    },
  });
});

export default router;
