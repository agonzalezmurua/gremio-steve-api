import * as mongoose from "mongoose";
import { IUser } from "./user";

export type ModeType = "std" | "taiko" | "ctb" | "mania";

export const Modes = {
  std: "std",
  taiko: "taiko",
  ctb: "ctb",
  mania: "mania",
};

export const BeatmapDifficulties = {
  easy: "easy",
  normal: "normal",
  hard: "hard",
  insane: "insane",
  expert: "expert",
  "expert+": "expert+",
};

export const BeatmapStatuses = {
  ready: "ready",
  pending: "pending",
  alert: "alert",
  problem: "problem",
};

export interface IBeatmap {
  _id: string;
  name: string;
  mode: ModeType;
  difficulty: "easy" | "normal" | "hard" | "insane" | "expert" | "expert+";
  status: "ready" | "pending" | "alert" | "problem";
  assignee?: IUser;
}

export interface IBeatmapSchema extends mongoose.Document<IBeatmap> {}

const BeatmapSchema = new mongoose.Schema<IBeatmapSchema>(
  {
    name: String,
    mode: {
      type: String,
      enum: [Modes.ctb, Modes.mania, Modes.std, Modes.taiko],
    },
    difficulty: {
      type: String,
      enum: [
        BeatmapDifficulties["easy"],
        BeatmapDifficulties["normal"],
        BeatmapDifficulties["hard"],
        BeatmapDifficulties["insane"],
        BeatmapDifficulties["expert"],
        BeatmapDifficulties["expert+"],
      ],
    },
    status: {
      type: String,
      enum: [
        BeatmapStatuses["alert"],
        BeatmapStatuses["pending"],
        BeatmapStatuses["problem"],
        BeatmapStatuses["ready"],
      ],
    },
    assignee: {
      type: mongoose.Schema.Types.ObjectId,
      required: false,
    },
  },
  { timestamps: { createdAt: "created_at", updatedAt: "updated_at" } }
);

export default BeatmapSchema;
