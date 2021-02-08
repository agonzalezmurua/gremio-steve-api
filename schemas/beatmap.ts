import * as mongoose from "mongoose";
import { Utils } from "../types/mongoose_aux";
import { IUser } from "./user";

export enum BeatmapModes {
  standard = "std",
  taiko = "taiko",
  catch_the_beat = "ctb",
  mania = "mania",
}

export enum Difficulties {
  easy = "easy",
  normal = "normal",
  hard = "hard",
  insane = "insane",
  expert = "expert",
  expert_plus = "expert+",
}

export enum Statuses {
  ready = "ready",
  pending = "pending",
  alert = "alert",
  problem = "problem",
}

export interface IBeatmap {
  name: string;
  mode: BeatmapModes;
  difficulty: "easy" | "normal" | "hard" | "insane" | "expert" | "expert+";
  status: "ready" | "pending" | "alert" | "problem";
  assignee?: IUser;
}

export interface IBeatmapSchema extends mongoose.Document<IBeatmap> {}

const BeatmapSchemaFields: Utils.SchemaFields<IBeatmap> = {
  name: String,
  mode: {
    type: String,
    enum: Object.values(BeatmapModes),
  },
  difficulty: {
    type: String,
    enum: Object.values(Difficulties),
  },
  status: {
    type: String,
    enum: Object.values(Statuses),
  },
  assignee: {
    type: mongoose.Schema.Types.ObjectId,
    required: false,
  },
};

const BeatmapSchema = new mongoose.Schema<IBeatmapSchema>(BeatmapSchemaFields, {
  timestamps: { createdAt: "created_at", updatedAt: "updated_at" },
});

export default BeatmapSchema;
