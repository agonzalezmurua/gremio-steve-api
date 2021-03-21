import { Controller, Get, HttpStatus, Param } from "@nestjs/common";

import { UsersService } from "./users.service";
import { ApiResponse, ApiTags } from "@nestjs/swagger";
import { UserData } from "./models/user.data";

@ApiTags("users")
@Controller("users")
export class UsersController {
  constructor(private userService: UsersService) {}

  @Get()
  @ApiResponse({ status: HttpStatus.OK, isArray: true, type: UserData })
  public async findAll(): Promise<UserData[]> {
    const users = await this.userService.findAll();

    return users.map((user) => user.build());
  }

  @Get(":id")
  @ApiResponse({ status: HttpStatus.OK, type: UserData })
  public async getOneUserById(@Param("id") id: number): Promise<UserData> {
    const user = await this.userService.findOneById(id);

    return user.build();
  }

  @Get("@me")
  @ApiResponse({ status: HttpStatus.OK, type: UserData })
  public async getMyUser(): Promise<UserData> {
    const user = await this.userService.findOneById(0);
    return user.build();
  }

  // @Patch(":id")
  // public async updateUserNotificationPreferences(
  //   @Param("id") id: string
  // ) {

  //   user.notification_preferences.app_notification = app_notification;
  //   user.notification_preferences.email = email;

  //   await user.save({ validateBeforeSave: true });

  //   res.json(true);
  // }

  // public async getUserActivityFeed(
  //   req: Request<{ id: string }, unknown, unknown, { limit: number }>,
  //   res: Response
  // ) {
  //   const limit = Math.min(1, 50, req.query.limit || 10);
  //   const user = await UserMongoose.findById(req.user.id);

  //   const activity = await ActivityMongooseModel.find({
  //     who: { $in: user.follows },
  //   })
  //     .limit(limit)
  //     .exec();

  //   res.json(activity.map((document) => new Activity(document)));
  // }
}
