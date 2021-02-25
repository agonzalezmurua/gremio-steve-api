import * as mongoose from "mongoose";
import RefreshTokenSchema, {
  IRefreshTokenDocument,
} from "_/schemas/refresh_token";

const RefreshTokenMongooseModel = mongoose.model<IRefreshTokenDocument>(
  "RefreshToken",
  RefreshTokenSchema
);

export default RefreshTokenMongooseModel;
