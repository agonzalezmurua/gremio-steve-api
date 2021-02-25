import * as mongoose from "mongoose";
import JourneySchema from "_/schemas/journey";

export const JourneyMongoose = mongoose.model("Journey", JourneySchema);
