import { Request, Response } from "express";
import consola from "consola";

/**
 * Generic error handler for every appended request
 */
export default function errorHandler(
  err: { [key: string]: unknown },
  req: Request,
  res: Response
): void {
  const error: { [key: string]: string | unknown } = {
    message: err.message || "NO.MESSAGE",
    name: err.name,
  };

  if (err.name === "ValidationError") {
    error.validations = err.errors;
  }

  if (!res.headersSent) {
    switch (err.name) {
      case "ValidationError":
        error.validations = err.errors;
        res.status(400);
        break;
      case "UnauthenticatedError":
        res.status(401);
        break;
      case "UnauthorizedError":
        res.status(403);
        break;
      default:
        res.status(500);
        break;
    }
  }

  consola.error(error);

  res.json({
    error: error,
  });
}
