import {
  ApiModel,
  ApiModelProperty,
  SwaggerDefinitionConstant,
} from "swagger-express-ts";

import { IJourneyDocument } from "_/schemas/journey";
import { IUser, IUserDocument, UserRole, UserStatus } from "_/schemas/user";

import UserPreferences from "_/models/user.preferences";
import { UserAvailability } from "_/models/user.availability";
import Journey from "_/models/journey";
import mongoose = require("mongoose");

@ApiModel()
export default class User implements IUser {
  constructor(document: IUserDocument) {
    this.id = document.id;
    this.osu_id = document.osu_id;
    this.name = document.name;
    this.active = document.active;
    this.avatar_url = document.avatar_url;
    this.banner_url = document.banner_url;
    this.availability = new UserAvailability(document.availability);
    this.community_role = document.community_role;
    this.role = document.role;
    this.preferences = new UserPreferences(document.preferences);
    this.status = document.status;
    this.description = document.description;

    this.journeys = document.journeys?.map((journey) => new Journey(journey));
    this.queue = document.queue?.map(
      (journey) => new Journey(journey as IJourneyDocument)
    );
  }

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

  email: string;
  token_version: mongoose.Types.ObjectId;
}
