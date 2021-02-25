import { Response } from "express";
import jwt = require("jsonwebtoken");
import { IUserDocument } from "_/schemas/user";
import { Steve } from "_/types/steve-api";

const SECRET = process.env.APP_AUTH_SECRET;
const ALGORITHM = "HS256";
const EXPIRATION = 60 * 60 * 2; // 2 hours

/** Alias to string, used to help understand references to this particular token across the APP */
export type IdentityToken = string;

/**
 * Signs a given object and creates a Json Web Token
 */
function sign(payload: Steve.LoggedUserTokenPayload): IdentityToken {
  return jwt.sign(payload, SECRET, {
    expiresIn: EXPIRATION,
    algorithm: ALGORITHM,
  });
}
/**
 * Attemps to verify JWT signature
 */
export function verifyJwtSignature(
  token: IdentityToken
): Steve.LoggedUserTokenPayload {
  return jwt.verify(token, SECRET) as Steve.LoggedUserTokenPayload;
}

/**
 * Sends a response with a signed token with the corresponding user authentication token
 * @param payload Authentication payload
 */
export const sendAuthenticationToken = (
  response: Response,
  user: IUserDocument
): void => {
  response.json({
    token_type: "Bearer",
    expires_in: EXPIRATION,
    access_token: sign({
      id: user.id,
      osu_id: user.osu_id,
      avatar_url: user.avatar_url,
      name: user.name,
    }),
  });
};
