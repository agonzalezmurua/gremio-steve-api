import { ApiModel, ApiModelProperty } from "swagger-express-ts";
import { IUserNotificationPreferences } from "_/schemas/user";

@ApiModel({
  name: "User.NotificationPreferences",
})
export default class UserNotificationPreferences
  implements IUserNotificationPreferences {
  constructor(preferences: IUserNotificationPreferences) {
    this.email = preferences.email;
    this.app_notification = preferences.app_notification;
  }

  @ApiModelProperty()
  email: boolean;
  @ApiModelProperty()
  app_notification: boolean;
}
