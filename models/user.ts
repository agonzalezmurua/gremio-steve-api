import Swagger from "swagger-express-ts";

import { ModeType } from "../schemas/beatmap";
import { IJourney } from "../schemas/journey";
import { IUser, IUserSchema } from "../schemas/user";

@Swagger.ApiModel({
  name: "User",
  description: "Registered user structure",
})
export default class UserModel implements IUser {
  @Swagger.ApiModelProperty({
    description: "Id of user",
    required: false,
  })
  public _id: string;

  @Swagger.ApiModelProperty()
  public osu_id: string;

  @Swagger.ApiModelProperty()
  public name: string;

  @Swagger.ApiModelProperty()
  public active: boolean;

  @Swagger.ApiModelProperty()
  public avatar_url: string;

  @Swagger.ApiModelProperty()
  public banner_url?: string;

  @Swagger.ApiModelProperty()
  public availability: {
    mods: boolean;
    guest_diffs: boolean;
    playtesting: boolean;
  };

  public journeys: IJourney[];

  @Swagger.ApiModelProperty()
  public community_role: string;

  @Swagger.ApiModelProperty()
  public role: "admin" | "user" | "moderator";

  public preferences: ModeType[];

  @Swagger.ApiModelProperty()
  public status: "available" | "do_not_disturb";

  @Swagger.ApiModelProperty()
  public description: string;

  public queue: IJourney[];

  constructor(schema: IUserSchema) {
    this._id = schema.id;
    this.osu_id = schema.osu_id;
    this.name = schema.name;
    this.active = schema.active;
    this.avatar_url = schema.avatar_url;
    this.banner_url = schema.banner_url;
    this.availability = schema.availability;
    this.journeys = schema.journeys;
    this.community_role = schema.community_role;
    this.role = schema.role;
    this.preferences = schema.preferences;
    this.status = schema.status;
    this.description = schema.description;
    this.queue = schema.queue;
  }
}
