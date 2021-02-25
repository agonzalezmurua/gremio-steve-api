import * as mongoose from "mongoose";
import JourneySchema from "_/schemas/journey";

const JourneyMongooseModel = mongoose.model("Journey", JourneySchema);

export default JourneyMongooseModel;
