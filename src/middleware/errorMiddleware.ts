import { Request, Response, NextFunction } from "express";

// Centralized error handler
export const errorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  console.error("Error:", err.message || err);

  const statusCode = err.statusCode || 500;

  res.status(statusCode).json({
    message: err.message || "Internal Server Error",
    // optionally include stack trace in dev
    stack: process.env.NODE_ENV === "production" ? undefined : err.stack,
  });
};
