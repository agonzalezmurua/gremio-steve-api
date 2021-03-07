import * as mongoose from "mongoose";
import JourneySchema from "_/schemas/journey";

export const name = "Journey";
const JourneyMongooseModel = mongoose.model(name, JourneySchema);

export default JourneyMongooseModel;
