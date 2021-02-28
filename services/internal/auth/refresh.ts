// Encryption library
import CryptoJS = require("crypto-js");
import mongoose = require("mongoose");
import { Request, Response } from "express";

import RefreshTokenMongooseModel from "_/controllers/mongo/refresh_token";
import UserMongoose from "_/controllers/mongo/user";

import { IUserDocument } from "_/schemas/user";
import { IRefreshTokenDocument } from "_/schemas/refresh_token";

const SECRET = process.env.APP_AUTH_REFRESH_SECRET;
const EXPIRATION = 1000 * 60 * 60 * 24 * 7; // 7 days
const COOKIE_NAME = "steve-session";

/** Alias of encrypted id of token */
type RefreshToken = string;

/**
 * Returns a encrypted string, encoded using UTF8
 * @param value Information to encrypt
 */
const encrypt = <T>(value: T): string => {
  return CryptoJS.AES.encrypt(JSON.stringify(value), SECRET).toString();
};

/**
 * Decrypts a given string
 */
const decrypt = <T>(cipher: string): T | null => {
  try {
    const bytes = CryptoJS.AES.decrypt(cipher, SECRET);
    const stringValue = bytes.toString(CryptoJS.enc.Utf8);
    return JSON.parse(stringValue);
  } catch (error) {
    return null;
  }
};

/**
 * Writes into the database a new refresh token
 * @param friendlyName User friendly name
 * @param payload
 * @param payload JWT authentication token
 *
 * @returns encrypted refresh token ID
 */
export const createRefreshToken = async (
  owner: IUserDocument,
  friendlyName = "default"
): Promise<RefreshToken> => {
  const { token_version } = await UserMongoose.findById(owner.id).select(
    "+token_version"
  );
  const document = {
    expires_at: new Date(Date.now() + EXPIRATION),
    owner: owner.id,
    friendly_name: friendlyName,
    version: token_version,
  };

  const refreshToken = await new RefreshTokenMongooseModel(document).save({
    validateBeforeSave: true,
  });

  return encrypt(String(refreshToken.id));
};

/**
 * Updates the user entry so it invalidates
 * any refresh token associated with them by changing the token version
 */
export const revokeAllRefreshTokens = async (userId: string): Promise<void> => {
  await UserMongoose.findByIdAndUpdate(userId, {
    token_version: mongoose.Types.ObjectId(),
  }).exec();
  return;
};

/**
 * Revokes a refresh token session
 * @param token It can be either a encrypted id or an actual id
 */
export const revokeRefreshToken = async (
  token: RefreshToken
): Promise<void> => {
  await RefreshTokenMongooseModel.findByIdAndDelete(
    parseTokenIntoId(token)
  ).exec();
  return;
};

/**
 * Gets the ID string of a given value
 * @param value ObjectID or Plain String
 *
 * @returns Decripted value (if applicable), as token's id
 */
function parseTokenIntoId(value?: RefreshToken | string): RefreshToken | null {
  if (!value) {
    return null;
  }

  if (mongoose.isValidObjectId(value)) {
    return value;
  } else {
    return decrypt<string>(value);
  }
}

/**
 * Validates the refresh token, if exists, and also if it has not expired
 *
 * @param token Encrypted identifier
 *
 * @returns Te token itself
 *
 * @throws Error when refresh is invalid
 */
const validateRefreshToken = async (
  token: RefreshToken
): Promise<RefreshToken> => {
  const id = parseTokenIntoId(token);

  if (typeof id !== "string") {
    throw new Error("Invalid token");
  }

  if (
    (await RefreshTokenMongooseModel.exists({
      id: id,
      expires_at: { $lt: new Date() },
    })) === false
  ) {
    throw new Error("Invalid token");
  }

  return token;
};

/**
 * If valid, extends (if applicable) the life of the refresh_token:
 * - If user has not refreshed their token version value
 * - If the expiration date on the document has not been met
 *
 * @throws Error when the refresh token
 *
 * @param token Either encrypted or decrypted token
 */
export const extendLifeOfRefreshToken = async (
  token: RefreshToken
): Promise<IRefreshTokenDocument> => {
  await validateRefreshToken(token);

  const document = await RefreshTokenMongooseModel.findById(
    parseTokenIntoId(token)
  ).populate("owner", "id +token_version"); // Get the id and version of the associated user

  // INvalid if:
  // - User refreshed their token version ()
  // - Token has expired
  if (
    document.owner.token_version.equals(document.version) === false ||
    document.expires_at < new Date()
  ) {
    // TODO: Consider logging this deletion for audit purposes?
    await document.delete();
    throw new Error("Invalid token");
  }
  // Extend the expiration duration by the requested amount
  document.expires_at = new Date(Date.now() + EXPIRATION);
  await document.save();

  return document;
};

/**
 * Creats and sets a new refresh token on a http cookie
 *
 * @param response Express' response
 * @param user User object
 */
export const setNewRefreshTokenCookie = async (
  response: Response,
  user: IUserDocument
): Promise<void> => {
  const refreshToken = await createRefreshToken(user);

  response.cookie(COOKIE_NAME, refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production" || false,
  });
};

/**
 * Reads the refresh token id on a http cookie
 *
 * @param request Express' request
 */
export const readRefreshTokenCookie = (
  request: Request<unknown, unknown, unknown>
): RefreshToken => {
  return request.cookies[COOKIE_NAME];
};

/**
 * Reads the refresh token id on a http cookie
 *
 * @param response Express' request
 */
export const removeRefreshTokenCookie = (
  response: Response<unknown, unknown>
): void => {
  response.clearCookie(COOKIE_NAME);
};
