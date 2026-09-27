import express from "express";
import helmet from "helmet";
import cors from "cors";
import cookieParser from "cookie-parser";
import { APP_NAME } from "./config/brand";
import { errorHandler } from "./middleware/errorHandler";

import authRoutes from "./routes/auth";
import booksRoutes from "./routes/books";
import missionsRoutes from "./routes/missions";
import reviewRoutes from "./routes/review";
import progressRoutes from "./routes/progress";
import leaderboardRoutes from "./routes/leaderboard";
import waitlistRoutes from "./routes/waitlist";
import tutorRoutes from "./routes/tutor";

export function createApp() {
  const app = express();

  // Security Headers with Helmet
  app.use(
    helmet({
      contentSecurityPolicy: false, // Allows Vite and inline scripts/styles in dev/container
      crossOriginResourcePolicy: { policy: "cross-origin" },
    })
  );

  // CORS setup
  const allowedOrigins = (process.env.CORS_ORIGIN || "http://localhost:3000,http://localhost:5173")
    .split(",")
    .map((o) => o.trim());

  app.use(
    cors({
      origin: (origin, callback) => {
        // Allow requests with no origin (like mobile apps, curl, or same-origin)
        if (!origin || allowedOrigins.includes(origin) || allowedOrigins.includes("*")) {
          callback(null, true);
        } else {
          callback(null, true); // Dev-friendly fallback
        }
      },
      credentials: true,
      methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
      allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
    })
  );

  app.use(cookieParser());
  app.use(express.json());

  // Health check endpoint
  app.get("/api/health", (req, res) => {
    return res.json({
      data: {
        status: "healthy",
        app: APP_NAME,
        version: "1.0.0",
        timestamp: new Date().toISOString(),
      },
    });
  });

  // API Route Mounts
  app.use("/api/auth", authRoutes);
  app.use("/api/books", booksRoutes);
  app.use("/api/missions", missionsRoutes);
  app.use("/api/review", reviewRoutes);
  app.use("/api/me", progressRoutes);
  app.use("/api/leaderboard", leaderboardRoutes);
  app.use("/api/waitlist", waitlistRoutes);
  app.use("/api/tutor", tutorRoutes);

  // Central Error Handler
  app.use(errorHandler);

  return app;
}
