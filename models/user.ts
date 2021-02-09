import {
  ApiModel,
  ApiModelProperty,
  SwaggerDefinitionConstant,
} from "swagger-express-ts";

import { IJourneyDocument } from "../schemas/journey";
import { IUser, IUserDocument, UserRole, UserStatus } from "../schemas/user";

import UserPreferences from "./user.preferences";
import { UserAvailability } from "./user.availability";
import Journey from "./journey";

@ApiModel()
export default class User implements IUser {
  constructor(document: IUserDocument) {
    this._id = document._id;
    this.osu_id = document.osu_id;
    this.name = document.name;
    this.active = document.active;
    this.avatar_url = document.avatar_url;
    this.banner_url = document.banner_url;
    this.availability = new UserAvailability(document.availability);
    this.journeys = document.journeys.map(
      (journey) => new Journey(journey as IJourneyDocument)
    );
    this.community_role = document.community_role;
    this.role = document.role;
    this.preferences = new UserPreferences(document.preferences);
    this.status = document.status;
    this.description = document.description;
    this.queue = document.queue.map(
      (journey) => new Journey(journey as IJourneyDocument)
    );
  }

  @ApiModelProperty({
    required: true,
  })
  public _id: string;

  @ApiModelProperty({
    required: true,
  })
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
}
