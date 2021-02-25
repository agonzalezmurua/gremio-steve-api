import * as mongoose from "mongoose";
import RefreshTokenSchema, {
  IRefreshTokenDocument,
} from "_/schemas/refresh_token";

export const RefreshTokenMongoose = mongoose.model<IRefreshTokenDocument>(
  "RefreshToken",
  RefreshTokenSchema
);
