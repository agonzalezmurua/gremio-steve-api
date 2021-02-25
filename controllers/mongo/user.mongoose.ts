import * as mongoose from "mongoose";
import UserSchema from "_/schemas/user";

export const UserMongoose = mongoose.model("User", UserSchema);
