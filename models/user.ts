import {
  ApiModel,
  ApiModelProperty,
  SwaggerDefinitionConstant,
} from "swagger-express-ts";

import { IJourneyDocument } from "../schemas/journey";
import { IUser, IUserDocument, UserRoles, UserStatus } from "../schemas/user";

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

  @ApiModelProperty()
  public _id: string;

  @ApiModelProperty()
  public osu_id: string;

  @ApiModelProperty()
  public name: string;

  @ApiModelProperty()
  public active: boolean;

  @ApiModelProperty()
  public avatar_url: string;

  @ApiModelProperty()
  public banner_url?: string;

  public availability: UserAvailability;

  @ApiModelProperty({ model: "Journey", type: SwaggerDefinitionConstant.ARRAY })
  public journeys: Journey[];

  @ApiModelProperty()
  public community_role: string;

  @ApiModelProperty({ enum: Object.values(UserRoles) })
  public role: UserRoles;

  @ApiModelProperty({ model: "UserPreferences" })
  public preferences: {
    std: boolean;
    taiko: boolean;
    ctb: boolean;
    mania: boolean;
  };

  @ApiModelProperty()
  public status: UserStatus;

  @ApiModelProperty()
  public description: string;

  @ApiModelProperty({ model: "Journey", type: SwaggerDefinitionConstant.ARRAY })
  public queue: Journey[];
}
