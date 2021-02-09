import { ApiModel, ApiModelProperty } from "swagger-express-ts";
import { IUser, IUserPreferences } from "../schemas/user";

@ApiModel({
  name: "User.Preferences",
})
class UserPreferences implements IUserPreferences {
  constructor(preferences: IUser["preferences"]) {
    this.std = preferences.std;
    this.taiko = preferences.taiko;
    this.ctb = preferences.ctb;
    this.mania = preferences.mania;
  }

  @ApiModelProperty()
  public std: boolean;

  @ApiModelProperty()
  public taiko: boolean;

  @ApiModelProperty()
  public ctb: boolean;

  @ApiModelProperty()
  public mania: boolean;
}

export default UserPreferences;
