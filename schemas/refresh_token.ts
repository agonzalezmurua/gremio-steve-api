import mongoose from "_/services/database.configure";
import { Utils } from "_/types/mongoose_aux";
import { IUser, IUserDocument } from "./user";

export interface IRefreshToken {
  /** Version used when created / refreshed token */
  version: string;
  /** Expiration date */
  expires_at: Date;
  /** Whose token belongs to */
  owner: IUser;
  friendly_name: string;
}

export interface IRefreshTokenDocument
  extends IRefreshToken,
    mongoose.Document {
  owner: IUserDocument;
}

const RefreshTokenSchemaFields: Utils.SchemaFields<IRefreshToken> = {
  expires_at: {
    type: Date,
    required: true,
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  friendly_name: {
    type: String,
    required: true,
  },
  version: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
};

export default new mongoose.Schema<IRefreshTokenDocument>(
  RefreshTokenSchemaFields,
  {
    timestamps: { createdAt: "created_at", updatedAt: "updated_at" },
  }
);
