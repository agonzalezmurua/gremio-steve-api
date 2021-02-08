import mongoose from "mongoose";
import mongoose_fuzzy_searching from "mongoose-fuzzy-searching";

import { IBeatmap, Modes, ModeType } from "./beatmap";
import { IUser } from "./user";

type JourneyStatus =
  | "pending"
  | "open"
  | "ready"
  | "alert"
  | "problem"
  | "closed";

export const Statuses = {
  pending: "pending",
  open: "open",
  ready: "ready",
  alert: "alert",
  problem: "problem",
  closed: "closed",
};

export interface IJourney extends mongoose.Document {
  _id: string;
  title: string;
  artist: string;
  organizer: IUser;
  thumbnail_url: string;
  banner_url: string;
  metadata: {
    genre: string;
    bpm: number[];
    closure?: string;
    duration: number;
  };
  modes: ModeType[];
  description?: string;
  status: JourneyStatus;
  private: boolean;
  beatmaps: IBeatmap[];
  osu_link?: string;
}

const JourneySchema = new mongoose.Schema<IJourney>(
  {
    title: String,
    artist: String,
    organizer: { type: mongoose.Schema.Types.ObjectId, required: true },
    thumbnail_url: String,
    banner_url: String,
    metadata: {
      genre: String,
      bpm: [Number],
      closure: { type: Date, required: false },
      duration: Number,
    },
    modes: {
      type: [String],
      enum: [Modes.ctb, Modes.mania, Modes.std, Modes.taiko],
    },
    description: String,
    status: {
      type: String,
      enum: [
        Statuses.alert,
        Statuses.closed,
        Statuses.open,
        Statuses.pending,
        Statuses.problem,
        Statuses.ready,
      ],
    },
    private: Boolean,
    beatmaps: {
      type: [{ type: mongoose.Schema.Types.ObjectId, required: true }],
    },
    osu_link: {
      type: String,
      required: false,
    },
  },
  { timestamps: { createdAt: "created_at", updatedAt: "updated_at" } }
);

JourneySchema.plugin(mongoose_fuzzy_searching, {
  fields: [
    { name: "title", prefixOnly: true },
    { name: "artist", prefixOnly: true },
  ],
});

const JourneyModel = mongoose.model("Journey", JourneySchema);

export default JourneyModel;
