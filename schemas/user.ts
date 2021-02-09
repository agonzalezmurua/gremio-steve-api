import * as mongoose from "mongoose";
import mongoose_fuzzy_searching = require("mongoose-fuzzy-searching");

import { IJourney } from "./journey";
import { Utils } from "../types/mongoose_aux";

export enum UserRole {
  admin = "admin",
  user = "user",
  moderator = "moderator",
}

export enum UserStatus {
  available = "available",
  do_not_disturb = "do_not_disturb",
}

export interface IAvailability {
  mods: boolean;
  guest_diffs: boolean;
  playtesting: boolean;
}

export interface IUserPreferences {
  std: boolean;
  taiko: boolean;
  ctb: boolean;
  mania: boolean;
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
  role: UserRole;
  preferences: IUserPreferences;
  status: UserStatus;
  description?: string;
  queue: IJourney[];
}

export interface IUserDocument extends IUser, mongoose.Document {}

const UserSchemaFields: Utils.SchemaFields<IUser> = {
  osu_id: { type: String, required: true },
  name: { type: String, required: true },
  active: { type: Boolean, default: true },
  avatar_url: { type: String, required: true },
  banner_url: String,
  availability: {
    mods: { type: Boolean, default: false },
    guest_diffs: { type: Boolean, default: false },
    playtesting: { type: Boolean, default: false },
  },
  journeys: {
    type: [{ type: mongoose.Schema.Types.ObjectId, ref: "Journey" }],
  },
  community_role: String,
  role: {
    type: String,
    enum: Object.values(UserRole),
    default: UserRole.user,
  },
  preferences: {
    std: { type: Boolean, default: false },
    taiko: { type: Boolean, default: false },
    ctb: { type: Boolean, default: false },
    mania: { type: Boolean, default: false },
  },
  description: String,
  queue: {
    type: [{ type: mongoose.Schema.Types.ObjectId, ref: "Journey" }],
  },
  status: {
    type: String,
    enum: Object.values(UserStatus),
    default: UserStatus.available,
  },
};

const UserSchema = new mongoose.Schema<IUserDocument>(UserSchemaFields, {
  timestamps: { createdAt: "created_at", updatedAt: "updated_at" },
});

UserSchema.plugin(mongoose_fuzzy_searching, {
  fields: [
    {
      name: "name",
    },
  ],
});

export default UserSchema;
