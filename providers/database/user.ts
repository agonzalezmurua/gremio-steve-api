import mongoose from "mongoose";
import mongoose_fuzzy_searching from "mongoose-fuzzy-searching";

import { IJourney } from "./journey";
import { ModeType, Modes } from "./beatmap";

export const Roles = {
  admin: "admin",
  user: "user",
  moderator: "moderator",
};

export interface IUser extends mongoose.Document {
  osu_id: string;
  name: string;
  active: boolean;
  avatar_url: string;
  banner_url?: string;
  availability: {
    mods: boolean;
    guest_diifs: boolean;
    playtesting: boolean;
  };
  journeys: IJourney[];
  community_role: string;
  role: "admin" | "user" | "moderator";
  preferences: ModeType[];
  status: "available" | "do_not_disturb";
  description: string;
  queue: IJourney[];
}

const UserSchema = new mongoose.Schema<IUser>(
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
      enum: [Roles.admin, Roles.moderator, Roles.user],
      default: Roles.user,
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

const UserModel = mongoose.model("User", UserSchema);

export default UserModel;
