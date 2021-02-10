import { Request, Response, NextFunction } from "express";
const consola = require("consola");

/**
 * Generic error handler for every appended request
 */
export default function errorHandler(
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) {
  const error: { [key: string]: any } = {
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
