import * as mongoose from "mongoose";
import mongoose_fuzzy_searching = require("mongoose-fuzzy-searching");
import { Utils } from "../types/mongoose_aux";

import BeatmapSchema, { IBeatmap, BeatmapModes } from "./journey.beatmap";
import { IUser } from "./user";

export enum JourneyStatus {
  pending = "pending",
  open = "open",
  ready = "ready",
  alert = "alert",
  problem = "problem",
  closed = "closed",
}
export interface IMetadata {
  genre: string;
  bpm: number[];
  closure?: Date;
  duration: number;
}

export interface IJourney {
  title: string;
  artist: string;
  organizer: IUser;
  thumbnail_url: string;
  banner_url: string;
  metadata: IMetadata;
  modes: BeatmapModes[];
  description?: string;
  status: JourneyStatus;
  is_private: boolean;
  beatmaps: IBeatmap[];
  osu_link?: string;
}

export interface IJourneyDocument extends IJourney, mongoose.Document {}

const JourneySchemaFields: Utils.SchemaFields<IJourney> = {
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
    enum: Object.values(BeatmapModes),
    default: [],
  },
  description: String,
  status: {
    type: String,
    enum: Object.values(JourneyStatus),
    default: JourneyStatus.pending,
  },
  is_private: Boolean,
  beatmaps: {
    type: [{ type: BeatmapSchema, required: true }],
  },
  osu_link: {
    type: String,
    required: false,
  },
};

const JourneySchema = new mongoose.Schema<IJourneyDocument>(
  JourneySchemaFields,
  { timestamps: { createdAt: "created_at", updatedAt: "updated_at" } }
);

JourneySchema.plugin(mongoose_fuzzy_searching, {
  fields: [
    { name: "title", prefixOnly: true },
    { name: "artist", prefixOnly: true },
  ],
});

export default JourneySchema;
