import * as mongoose from "mongoose";
import { Utils } from "_/types/mongoose_aux";
import { IJourney, IJourneyDocument } from "./journey";
import { IUser, IUserDocument } from "./user";

export enum Action {
  "mention" = "mention",
  "add" = "add",
  "remove" = "remove",
  "edit" = "edit",
  "create" = "create",
}

export enum Target {
  "journey" = "journey",
  "user" = "user",
  "edit" = "edit",
}

export interface IActivityPayload {
  user?: Utils.ReferencedDocument<IUser>;
  journey?: Utils.ReferencedDocument<IJourney>;
}

/** Basic Activity interface, with main properties */
export interface IActivity {
  /** When was this activity registered */
  when: Date;
  /** Who triggered this activity */
  who: Utils.ReferencedDocument<IUser>;
  /** What did they do */
  what: Action;
  /** Against what did they did it */
  to: Target;

  /** Additional information to parse the message */
  payload: IActivityPayload;
  read: boolean;
}

/** Activity interface of beatmap */
export interface IActivityDocument extends IActivity, mongoose.Document {
  who: Utils.ReferencedDocument<IUserDocument>;
  payload: {
    user?: Utils.ReferencedDocument<IUserDocument>;
    journey?: Utils.ReferencedDocument<IJourneyDocument>;
  };
}

const ActivitySchemaFields: Utils.SchemaFields<IActivity> = {
  read: Boolean,
  when: {
    type: Date,
    default: new Date(),
    required: false,
  },
  who: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  what: {
    type: String,
    enum: Object.values(Action),
    required: true,
  },
  to: {
    type: String,
    enum: Object.values(Target),
    required: true,
  },
  payload: {
    journey: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Journey",
      required: false,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: false,
    },
  },
};

const ActivitySchema = new mongoose.Schema<IActivityDocument>(
  ActivitySchemaFields,
  {
    strict: !!process.env.MIGRATING,
  }
);

export default ActivitySchema;
