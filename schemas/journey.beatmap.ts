import * as mongoose from "mongoose";
import { Utils } from "../types/mongoose_aux";
import { IUser } from "./user";

/** Available beatmap gameplay modes */
export enum BeatmapModes {
  standard = "std",
  taiko = "taiko",
  catch_the_beat = "ctb",
  mania = "mania",
}

/** Available beatmap difficulties */
export enum BeatmapDifficulty {
  easy = "easy",
  normal = "normal",
  hard = "hard",
  insane = "insane",
  expert = "expert",
  expert_plus = "expert+",
}

/** Available beatmap status modes */
export enum BeatmapStatus {
  ready = "ready",
  pending = "pending",
  alert = "alert",
  problem = "problem",
}

/** Basic beatmap interface, with main properties */
export interface IBeatmap {
  name: string;
  mode: BeatmapModes;
  difficulty: BeatmapDifficulty;
  status: BeatmapStatus;
  assignee?: IUser;
}

/** Document interface of beatmap */
export interface IBeatmapDocument extends IBeatmap, mongoose.Document {}

/** Fields definitions of schema object */
const BeatmapSchemaFields: Utils.SchemaFields<IBeatmap> = {
  name: String,
  mode: {
    type: String,
    enum: Object.values(BeatmapModes),
  },
  difficulty: {
    type: String,
    enum: Object.values(BeatmapDifficulty),
  },
  status: {
    type: String,
    enum: Object.values(BeatmapStatus),
  },
  assignee: {
    type: mongoose.Schema.Types.ObjectId,
    required: false,
  },
};

/** Beatmap schema instance */
const BeatmapSchema = new mongoose.Schema<IBeatmapDocument>(
  BeatmapSchemaFields
);

export default BeatmapSchema;
