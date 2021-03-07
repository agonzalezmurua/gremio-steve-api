import * as mongoose from "mongoose";
import RefreshTokenSchema, {
  IRefreshTokenDocument,
} from "_/schemas/refresh_token";

const name = "RefreshToken";
const RefreshTokenMongooseModel = mongoose.model<IRefreshTokenDocument>(
  name,
  RefreshTokenSchema
);

export default RefreshTokenMongooseModel;
