import path from "path";
import fs from "fs";
import { PrismaClient } from "@prisma/client";

function getValidSqliteUrl(): string {
  const envUrl = process.env.DATABASE_URL;

  // Check if current envUrl is a valid file: URL
  if (envUrl && typeof envUrl === "string" && envUrl.startsWith("file:")) {
    const rawPath = envUrl.slice(5);
    const resolvedPath = path.isAbsolute(rawPath) ? rawPath : path.resolve(process.cwd(), rawPath);
    if (fs.existsSync(resolvedPath)) {
      return `file:${resolvedPath}`;
    }
  }

  // Look for dev.db in prisma directory or root
  const prismaDb = path.resolve(process.cwd(), "prisma/dev.db");
  const rootDb = path.resolve(process.cwd(), "dev.db");

  if (fs.existsSync(prismaDb)) {
    return `file:${prismaDb}`;
  }
  if (fs.existsSync(rootDb)) {
    return `file:${rootDb}`;
  }

  return `file:${prismaDb}`;
}

const sqliteDatabaseUrl = getValidSqliteUrl();
process.env.DATABASE_URL = sqliteDatabaseUrl;

declare global {
  // eslint-disable-next-line no-var
  var prismaGlobal: PrismaClient | undefined;
}

export const prisma =
  globalThis.prismaGlobal ??
  new PrismaClient({
    datasources: {
      db: {
        url: sqliteDatabaseUrl,
      },
    },
  });

if (process.env.NODE_ENV !== "production") {
  globalThis.prismaGlobal = prisma;
}

