import "dotenv/config";
import path from "path";
import fs from "fs";

// Ensure DATABASE_URL is properly formatted for SQLite
if (!process.env.DATABASE_URL || !process.env.DATABASE_URL.startsWith("file:")) {
  const prismaDb = path.resolve(process.cwd(), "prisma/dev.db");
  const rootDb = path.resolve(process.cwd(), "dev.db");
  const targetDb = fs.existsSync(prismaDb) ? prismaDb : rootDb;
  process.env.DATABASE_URL = `file:${targetDb}`;
}

import express from "express";
import { createServer as createViteServer } from "vite";
import { createApp } from "./server/src/app";

async function startServer() {
  const app = createApp();
  const PORT = 3000;

  // In development, mount Vite middleware for instant live-reload preview on port 3000
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  const server = app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });

  return server;
}

startServer();
