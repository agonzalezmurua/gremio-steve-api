import * as mongoose from "mongoose";
import ActivitySchema from "_/schemas/activity";

export const name = "Activity";
const ActivityMongooseModel = mongoose.model(name, ActivitySchema);

export default ActivityMongooseModel;
