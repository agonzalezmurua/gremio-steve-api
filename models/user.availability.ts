import { ApiModel, ApiModelProperty } from "swagger-express-ts";
import { IAvailability } from "../schemas/user";

@ApiModel({
  name: "User.Availability",
})
export class UserAvailability implements IAvailability {
  constructor(document: IAvailability) {
    this.mods = document.mods;
    this.guest_diffs = document.guest_diffs;
    this.playtesting = document.playtesting;
  }

  @ApiModelProperty()
  public mods: boolean;

  @ApiModelProperty()
  public guest_diffs: boolean;

  @ApiModelProperty()
  public playtesting: boolean;
}
