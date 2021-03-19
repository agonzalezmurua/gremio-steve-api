import { Controller, Get, Param } from "@nestjs/common";
import { IUser } from "_/modules/users/interfaces/user.interface";
import { UsersService } from "_/modules/users/users.service";
import { User } from "./user.entity";

@Controller("users")
export class UsersController {
  constructor(private userService: UsersService) {}

  @Get()
  public async findAll(): Promise<User[]> {
    return this.userService.findAll();
  }

  @Get(":id")
  public async getOneUserById(@Param("id") id: string): Promise<IUser> {
    return await this.userService.findOneById(id);
  }

  @Get("myself")
  public async getMyUser(): Promise<IUser> {
    return this.userService.findOneById("");
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
