import { Request, Response, NextFunction } from "express";
import { verifyJwt } from "../services/oauth/authentication";
import { UnauthenticatedError, UnauthorizedError } from "../utils/errors";

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
  const authorization = req.header("authorization");

  if (!authorization) {
    throw new UnauthenticatedError();
  }

  const [token_type, access_token] = authorization.split(" ");

  if (token_type !== "Bearer") {
    throw new UnauthenticatedError();
  }

  try {
    const payload = verifyJwt(access_token);
    req.user = payload;
  } catch (err) {
    throw new UnauthorizedError();
  }

  next();
}
