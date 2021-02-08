import * as mongoose from "mongoose";
import mongoose_fuzzy_searching = require("mongoose-fuzzy-searching");

import { IJourney } from "./journey";
import { ModeType, Modes } from "./beatmap";

export const UserRoles = {
  admin: "admin",
  user: "user",
  moderator: "moderator",
};

export interface IAvailability {
  mods: boolean;
  guest_diffs: boolean;
  playtesting: boolean;
}

export interface IUser {
  osu_id: string;
  name: string;
  active: boolean;
  avatar_url: string;
  banner_url?: string;
  availability: IAvailability;
  journeys: IJourney[];
  community_role: string;
  role: "admin" | "user" | "moderator";
  preferences: ModeType[];
  status: "available" | "do_not_disturb";
  description: string;
  queue: IJourney[];
}

export interface IUserDocument extends IUser, mongoose.Document {}

const UserSchema = new mongoose.Schema<IUserDocument>(
  {
    osu_id: { type: String, required: true },
    name: { type: String, required: true },
    active: { type: Boolean, default: true },
    avatar_url: { type: String, required: true },
    banner_url: String,
    availability: {
      mods: Boolean,
      guest_diffs: Boolean,
      playtesting: Boolean,
    },
    journeys: {
      type: [{ type: mongoose.Schema.Types.ObjectId, ref: "Journey" }],
    },
    community_role: String,
    role: {
      type: String,
      enum: [UserRoles.admin, UserRoles.moderator, UserRoles.user],
      default: UserRoles.user,
      select: false,
    },
    preferences: {
      type: String,
      enum: [Modes.ctb, Modes.mania, Modes.std, Modes.taiko],
    },
    description: String,
    queue: { type: [{ type: mongoose.Schema.Types.ObjectId, ref: "Journey" }] },
  },
  {
    timestamps: { createdAt: "created_at", updatedAt: "updated_at" },
  }
);

UserSchema.plugin(mongoose_fuzzy_searching, {
  fields: [
    {
      name: "username",
    },
  ],
});

export default UserSchema;
