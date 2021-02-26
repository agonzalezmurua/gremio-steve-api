// Encryption library
import CryptoJS = require("crypto-js");
import mongoose = require("mongoose");
import { Request, Response } from "express";

import RefreshTokenMongooseModel from "_/controllers/mongo/refresh_token";
import UserMongoose from "_/controllers/mongo/user";

import { IUserDocument } from "_/schemas/user";

const SECRET = process.env.APP_AUTH_REFRESH_SECRET;
const EXPIRATION = 60 * 60 * 24 * 30; // 30 days
const COOKIE_NAME = "steve-session";

type UnencryptedRefreshToken = {
  version: string;
};

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
export const createNewRefreshTokenDocument = async (
  friendlyName: string,
  owner: IUserDocument
): Promise<string> => {
  const { token_version } = await UserMongoose.findById(owner.id).select(
    "+token_version"
  );
  const payload: UnencryptedRefreshToken = {
    version: String(token_version),
  };

  const document = {
    expires_at: new Date(Date.now() + EXPIRATION),
    owner: owner.id,
    friendly_name: friendlyName,
    encrypted_value: encrypt(payload),
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
 * @param id It can be either a encrypted id or an actual id
 */
export const revokeRefreshToken = async (id: string): Promise<void> => {
  await RefreshTokenMongooseModel.findByIdAndDelete(parseId(id)).exec();
  return;
};

/**
 * Gets the ID string of a given value
 * @param value ObjectID or Plain String
 */
function parseId(value?: string): string | null {
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
 * Receives an encrypted id of a refresh token entry and
 * validates its status.
 *
 * If valid then extends it's expiration date
 *
 * Else delete it from the database
 *
 * @param identifier Encrypted identifier
 *
 * @returns User in order to create new access token
 *
 * @throws Error when refresh is invalid
 */
export const validateRefreshToken = async (
  identifier: string
): Promise<IUserDocument> => {
  const id = parseId(identifier);

  if (!id) {
    throw new Error("Invalid token");
  }

  const document = await RefreshTokenMongooseModel.findById(id).populate(
    "owner",
    "id +token_version"
  );

  if (!document) {
    throw new Error("Invalid token");
  }

  const decryptedToken = decrypt<UnencryptedRefreshToken>(
    document.encrypted_value
  );

  // The token is not valid if:
  // - User refreshed their token version
  // - Token has expired
  if (
    String(document.owner.token_version) !== decryptedToken.version ||
    document.expires_at >= new Date()
  ) {
    // TODO: Consider logging this deletion for audit purposes?
    await document.delete().exec();
    throw new Error("Invalid token");
  } else {
    // If valid, then extend its duration
    await document
      .update({ expires_at: new Date(Date.now() + EXPIRATION) })
      .exec();
  }

  return await UserMongoose.findById(document.owner.id).exec();
};

/**
 * Sets the refresh token id on a http cookie
 *
 * @param response Express' response
 * @param user User object
 */
export const sendRefreshTokenCookie = async (
  response: Response,
  user: IUserDocument
): Promise<void> => {
  const id = await createNewRefreshTokenDocument("placeholder", user);

  response.cookie(COOKIE_NAME, id, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production" || false,
  });
};

export const getRefreshTokenCookie = (request: Request): string => {
  return request.cookies(COOKIE_NAME) as string;
};
