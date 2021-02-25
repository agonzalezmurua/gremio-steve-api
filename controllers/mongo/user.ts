import * as mongoose from "mongoose";
import UserSchema from "_/schemas/user";

const UserMongoose = mongoose.model("User", UserSchema);

export default UserMongoose;
