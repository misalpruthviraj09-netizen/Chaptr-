import { Request, Response, NextFunction } from "express";
import { ZodError } from "zod";

export interface AppError extends Error {
  statusCode?: number;
  code?: string;
  fields?: Record<string, string>;
}

export function createError(statusCode: number, code: string, message: string, fields?: Record<string, string>): AppError {
  const err = new Error(message) as AppError;
  err.statusCode = statusCode;
  err.code = code;
  err.fields = fields;
  return err;
}

export function errorHandler(
  err: any,
  req: Request,
  res: Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  next: NextFunction
) {
  // Zod validation errors
  if (err instanceof ZodError) {
    const fields: Record<string, string> = {};
    for (const issue of err.issues) {
      const fieldPath = issue.path.join(".");
      fields[fieldPath] = issue.message;
    }
    return res.status(400).json({
      error: {
        code: "VALIDATION_ERROR",
        message: "Invalid request payload or parameters.",
        fields,
      },
    });
  }

  // App specific errors
  if (err.statusCode) {
    return res.status(err.statusCode).json({
      error: {
        code: err.code || "REQUEST_FAILED",
        message: err.message,
        fields: err.fields,
      },
    });
  }

  // Fallback 500
  console.error("Unhandled Server Error:", err);
  return res.status(500).json({
    error: {
      code: "INTERNAL_SERVER_ERROR",
      message: "An unexpected error occurred. Please try again later.",
    },
  });
}
