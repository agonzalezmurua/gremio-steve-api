import * as mongoose from "mongoose";
import UserSchema from "_/schemas/user";

const name = "User";
const UserMongoose = mongoose.model(name, UserSchema);

export default UserMongoose;
