import { NextFunction, Request, Response } from "express";
import consola from "consola";

/**
 * Generic error handler for every appended request
 */
export default function errorHandler(
  err: { [key: string]: unknown },
  req: Request,
  res: Response,
  next: NextFunction
): void {
  const error: { [key: string]: string | unknown } = {
    name: err.name,
    message: err.message || "NO.MESSAGE",
  };

  console.trace(error);

  if (err.name === "ValidationError") {
    error.validations = err.errors;
  }

  if (!res.headersSent) {
    switch (err.name) {
      case "CastError":
      case "ValidationError":
        error.name = "Bad request";
        error.message = "Invalid parameters";
        error.validations = err.errors;
        res.status(400);
        break;
      case "UnauthorizedError":
        res.status(403);
        break;
      default:
        res.status(500);
        break;
    }
    res.json({
      error: error,
    });
    return;
  }

  next();
}
