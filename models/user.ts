import {
  ApiModel,
  ApiModelProperty,
  SwaggerDefinitionConstant,
} from "swagger-express-ts";

import { IJourneyDocument } from "_/schemas/journey";
import {
  IUser,
  IUserDocument,
  IUserNotificationPreferences,
  UserRole,
  UserStatus,
} from "_/schemas/user";

import UserPreferences from "_/models/user.preferences";
import { UserAvailability } from "_/models/user.availability";
import Journey from "_/models/journey";
import mongoose = require("mongoose");
import UserNotificationPreferences from "./user.notification_preferences";
import { Utils } from "_/types/mongoose_aux";
import determineReferenceType from "_/utils/determineReferenceType";

@ApiModel()
export default class User implements IUser {
  constructor(document: Utils.ReferencedDocument<IUserDocument>) {
    if (determineReferenceType(document) !== "document") {
      // Object has not been populated, therefore we skip the model mapping
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      return document;
    }
    const user = <IUserDocument>document;

    this.id = user.id;
    this.osu_id = user.osu_id;
    this.name = user.name;
    this.active = user.active;
    this.avatar_url = user.avatar_url;
    this.banner_url = user.banner_url;
    this.availability = new UserAvailability(user.availability);
    this.community_role = user.community_role;
    this.role = user.role;
    this.preferences = new UserPreferences(user.preferences);
    this.status = user.status;
    this.description = user.description;
    // We ignore the union type calcualtion for the callback function
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    this.follows = user.follows.map((user) => new User(user));
    this.notification_preferences = new UserNotificationPreferences(
      user.notification_preferences
    );

    this.journeys = user.journeys?.map((journey) => new Journey(journey));
    this.queue = user.queue?.map(
      (journey) => new Journey(journey as IJourneyDocument)
    );
  }

  //#region Mapped api fields
  @ApiModelProperty({
    description: "User's id (read only)",
  })
  public id: string;

  @ApiModelProperty({ description: "Ous user's id (read only)" })
  public osu_id: string;

  @ApiModelProperty({
    required: true,
  })
  public name: string;

  @ApiModelProperty()
  public active: boolean;

  @ApiModelProperty({
    required: true,
  })
  public avatar_url: string;

  @ApiModelProperty({
    required: true,
  })
  public banner_url?: string;

  @ApiModelProperty({
    model: "User.Availability",
    required: true,
  })
  public availability: UserAvailability;

  @ApiModelProperty({ model: "Journey", type: SwaggerDefinitionConstant.ARRAY })
  public journeys: Journey[];

  @ApiModelProperty({
    required: true,
  })
  public community_role: string;

  @ApiModelProperty({ enum: Object.values(UserRole), required: true })
  public role: UserRole;

  @ApiModelProperty({ model: "User.Preferences", required: true })
  public preferences: {
    std: boolean;
    taiko: boolean;
    ctb: boolean;
    mania: boolean;
  };

  @ApiModelProperty({
    required: true,
    enum: Object.values(UserStatus),
  })
  public status: UserStatus;

  @ApiModelProperty()
  public description?: string;

  @ApiModelProperty({ model: "Journey", type: SwaggerDefinitionConstant.ARRAY })
  public queue: Journey[];

  @ApiModelProperty({
    model: "User",
    type: SwaggerDefinitionConstant.ARRAY,
  })
  public follows: string[] | mongoose.Schema.Types.ObjectId[] | IUser[];

  @ApiModelProperty({ model: "User.NotificationPreferences" })
  notification_preferences: IUserNotificationPreferences;

  //#endregion

  //#region User properties that we are not interested on sharing on the model
  email: string;
  token_version: mongoose.Types.ObjectId;
  //#endregion
}
