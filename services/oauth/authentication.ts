import jwt from "jsonwebtoken";
import { IUser } from "../../providers/database/user";

const SECRET = process.env.APP_AUTH_SECRET;
const ALGORITHM = "HS256";
const EXPIRATION = 60 * 60 * 24 * 2; // 2 days

/**
 * Signs a given object and creates a Json Web Token
 */
function sign(payload: Partial<IUser>): string {
  return jwt.sign(payload, SECRET, {
    expiresIn: EXPIRATION,
    algorithm: ALGORITHM,
  });
}
/**
 * Attemps to verify JWT signature
 */
export function verifyJwt(token: string): IUser {
  return jwt.verify(token, SECRET);
}

/**
 * Emmits a signed token with the corresponding user information
 * @param payload Authentication payload
 */
export const issueAuthentication = (
  payload: Partial<IUser>
): { token_type: "Bearer"; expires_in: number; access_token: string } => {
  return {
    token_type: "Bearer",
    expires_in: EXPIRATION,
    access_token: sign(payload),
  };
};
