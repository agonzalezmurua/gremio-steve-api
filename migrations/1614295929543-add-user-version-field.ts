import * as DB from "../controllers/mongo";

import mongoose, { configure } from "../services/database.configure";

/* Code your update script here! */
export async function up(): Promise<void> {
  await configure();

  return DB.User.updateMany(
    { token_version: undefined },
    { token_version: mongoose.Types.ObjectId() }
  ).exec();
}

/* Code you downgrade script here! (if applicable) */
export const down = async (): Promise<void> => {
  await configure();

  // !! Setting this field to null will invalidate all refresh-tokens
  await DB.User.updateMany({}, { token_version: undefined }).exec();
};
