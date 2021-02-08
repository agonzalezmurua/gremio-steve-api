import jwt from "jsonwebtoken";

const SECRET = process.env.APP_AUTH_SECRET;
const ALGORITHM = "HS256";
const EXPIRATION = 60 * 60 * 24 * 2; // 2 days

/**
 * @typedef {Object} User
 * @prop {String} User.id User's own ID
 * @prop {String} User.osu_id User's osu ID
 */

/**
 * Signs a given object and creates a Json Web Token
 * @param {Object} payload
 */
function sign(payload) {
  return jwt.sign(payload, SECRET, {
    expiresIn: EXPIRATION,
    algorithm: ALGORITHM,
  });
}
/**
 * Attemps to verify JWT signature
 * @param {string} token
 * @returns {User}
 */
export function verifyJwt(token) {
  return jwt.verify(token, SECRET);
}

/**
 * Emmits a signed token with the corresponding user information
 * @param {User} payload Authentication payload
 */
export const issueAuthentication = (payload) => {
  return {
    token_type: "Bearer",
    expires_in: EXPIRATION,
    access_token: sign(payload),
  };
};
