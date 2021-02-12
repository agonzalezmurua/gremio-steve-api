import * as mongoose from "mongoose";
import mongoose_fuzzy_searching = require("mongoose-fuzzy-searching");
import { Utils } from "_/types/mongoose_aux";
import * as _ from "lodash";
import BeatmapSchema, {
  IBeatmap,
  BeatmapModes,
  IBeatmapDocument,
} from "_/schemas/journey.beatmap";
import { IUser, IUserDocument } from "_/schemas/user";

/** Available journy statuses */
export enum JourneyStatus {
  pending = "pending",
  open = "open",
  ready = "ready",
  alert = "alert",
  problem = "problem",
  closed = "closed",
}

/** Journey's metadata information */
export interface IMetadata {
  genre: string;
  bpm: number[];
  closure?: Date;
  duration: number;
}

/** Basic journey interface, with main properties */
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

/** Document interface of journey */
export interface IJourneyDocument extends IJourney, mongoose.Document {
  /* References to the organizers document, dont forget to populate this field */
  organizer: IUserDocument;
  /** Beatmap schema, this one does not need to be populated */
  beatmaps: IBeatmapDocument[];
}

/** Field definitinons of journey */
const JourneySchemaFields: Utils.SchemaFields<IJourney> = {
  title: String,
  artist: String,
  organizer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  thumbnail_url: String,
  banner_url: String,
  metadata: {
    genre: String,
    bpm: [Number],
    closure: {
      type: Date,
      required: false,
      set: (closure) => {
        if (typeof closure === "string") {
          return new Date(closure);
        }
        if (closure instanceof Date) {
          return closure;
        }
        return closure;
      },
    },
    duration: Number,
  },
  modes: {
    type: [String],
    enum: Object.values(BeatmapModes),
    virtual: true,
    get: function () {
      return _.uniq((this as IJourneyDocument).beatmaps.map((b) => b.mode));
    },
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

/** Journey schema instance */
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
