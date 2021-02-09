import * as mongoose from "mongoose";
import { Utils } from "../types/mongoose_aux";
import { IUser } from "./user";

export enum BeatmapModes {
  standard = "std",
  taiko = "taiko",
  catch_the_beat = "ctb",
  mania = "mania",
}

export enum BeatmapDifficulty {
  easy = "easy",
  normal = "normal",
  hard = "hard",
  insane = "insane",
  expert = "expert",
  expert_plus = "expert+",
}

export enum BeatmapStatus {
  ready = "ready",
  pending = "pending",
  alert = "alert",
  problem = "problem",
}

export interface IBeatmap {
  name: string;
  mode: BeatmapModes;
  difficulty: BeatmapDifficulty;
  status: BeatmapStatus;
  assignee?: IUser;
}

export interface IBeatmapDocument extends IBeatmap, mongoose.Document {}

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

const BeatmapSchema = new mongoose.Schema<IBeatmapDocument>(
  BeatmapSchemaFields
);

export default BeatmapSchema;
