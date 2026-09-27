import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { prisma } from "../db/client";

export const JWT_SECRET = process.env.JWT_SECRET || "chaptr-dev-secret-key-replace-in-production-12345";
export const TOKEN_COOKIE_NAME = "token";

export interface AuthUserPayload {
  userId: string;
  email: string;
}

export interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    email: string;
    name: string;
    timezone: string;
    xp: number;
    level: number;
    currentStreak: number;
    longestStreak: number;
    lastActiveDate: string | null;
  };
}

export function generateToken(payload: AuthUserPayload): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: "7d" });
}

export function setTokenCookie(res: Response, token: string) {
  res.cookie(TOKEN_COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    path: "/",
  });
}

export function clearTokenCookie(res: Response) {
  res.clearCookie(TOKEN_COOKIE_NAME, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
  });
}

export function extractToken(req: Request): string | null {
  if (req.cookies && req.cookies[TOKEN_COOKIE_NAME]) {
    return req.cookies[TOKEN_COOKIE_NAME];
  }
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith("Bearer ")) {
    return authHeader.substring(7);
  }
  return null;
}

export async function requireAuth(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) {
  const token = extractToken(req);
  if (!token) {
    return res.status(401).json({
      error: {
        code: "UNAUTHORIZED",
        message: "Authentication is required to access this resource.",
      },
    });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as AuthUserPayload;
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      select: {
        id: true,
        email: true,
        name: true,
        timezone: true,
        xp: true,
        level: true,
        currentStreak: true,
        longestStreak: true,
        lastActiveDate: true,
      },
    });

    if (!user) {
      clearTokenCookie(res);
      return res.status(401).json({
        error: {
          code: "UNAUTHORIZED",
          message: "User account no longer exists.",
        },
      });
    }

    req.user = user;
    next();
  } catch {
    clearTokenCookie(res);
    return res.status(401).json({
      error: {
        code: "UNAUTHORIZED",
        message: "Session token is invalid or expired. Please sign in again.",
      },
    });
  }
}

export async function optionalAuth(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) {
  const token = extractToken(req);
  if (!token) {
    return next();
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as AuthUserPayload;
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      select: {
        id: true,
        email: true,
        name: true,
        timezone: true,
        xp: true,
        level: true,
        currentStreak: true,
        longestStreak: true,
        lastActiveDate: true,
      },
    });
    if (user) {
      req.user = user;
    }
  } catch {
    // Ignore error for optional auth
  }
  next();
}
