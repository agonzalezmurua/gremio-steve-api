import { Request, Response, NextFunction } from "express";

/**
 * Ensures that the given authorization header contains a valid
 * access token
 *
 * And populates the request object with `req.user` if there is any valid session
 */
export default function ensureAuthenticated(
  req: Request,
  res: Response,
  next: NextFunction
): void {
  if (req.isAuthenticated()) {
    next();
  } else {
    res.status(401).send();
  }
}
