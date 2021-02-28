import { Response } from "express";
import jwt = require("jsonwebtoken");
import { IUserDocument } from "_/schemas/user";
import { Steve } from "_/types/steve-api";

const SECRET = process.env.APP_AUTH_SECRET;
const ALGORITHM = "HS256";
export const ACCESS_TOKEN_EXPIRATION = 60 * 60 * 1; // 1 hour

/** Alias to string, used to help understand references to this particular token across the APP */
export type AcessToken = string;

/**
 * Signs a given object and creates a Json Web Token
 */
function sign(payload: Steve.LoggedUserTokenPayload): AcessToken {
  return jwt.sign(payload, SECRET, {
    expiresIn: ACCESS_TOKEN_EXPIRATION,
    algorithm: ALGORITHM,
  });
}
/**
 * Attemps to verify JWT signature
 */
export function verifyJwtSignature(
  token: AcessToken
): Steve.LoggedUserTokenPayload {
  return jwt.verify(token, SECRET) as Steve.LoggedUserTokenPayload;
}

/**
 * Sends a response with a signed token with the corresponding user authentication token
 *
 * Ending the given request
 *
 * @param payload Authentication payload
 */
export const createAuthenticationToken = (user: IUserDocument): AcessToken => {
  return sign({
    id: user.id,
    osu_id: user.osu_id,
    avatar_url: user.avatar_url,
    name: user.name,
  });
};
