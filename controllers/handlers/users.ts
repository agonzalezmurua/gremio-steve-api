import { Request, Response } from "express";
import {
  ApiOperationGet,
  ApiOperationPatch,
  ApiPath,
  SwaggerDefinitionConstant,
} from "swagger-express-ts";

import UserModel from "_/models/user";
import UserMongoose from "_/controllers/mongo/user";
import authenticationResponses from "_/constants/swagger.authenticationResponses";
import { IUserNotificationPreferences } from "_/schemas/user";
import ActivityMongooseModel from "../mongo/activity";
import Activity from "_/models/activity";

@ApiPath({
  path: "/users",
  name: "Users",
})
class UserController {
  @ApiOperationGet({
    summary: "Find users",
    description: "Obtains a list of users, searching based on username",
    parameters: {
      query: {
        search: {
          description: "Can be the username",
          allowEmptyValue: true,
          type: SwaggerDefinitionConstant.STRING,
        },
      },
    },
    responses: {
      200: {
        model: "User",
        type: SwaggerDefinitionConstant.ARRAY,
      },
    },
  })
  public async searchUsers(req: Request, res: Response) {
    const {
      query: { search = "" },
    } = req;

    const users = await UserMongoose.fuzzySearch(search as string)
      .select("-confidenceScore")
      .exec();

    res.json(users.map((user) => new UserModel(user)));
  }

  @ApiOperationGet({
    path: "/:id",
    summary: "Get a user by id",
    parameters: {
      path: {
        id: {
          type: SwaggerDefinitionConstant.STRING,
        },
      },
    },
    description: "Obtains a user by id",
    responses: {
      200: {
        model: "User",
      },
    },
  })
  public async getOneUserById(req: Request<{ id: string }>, res: Response) {
    const user = await UserMongoose.findById(req.params.id)
      .populate([
        { path: "journeys", select: "-organizer" },
        { path: "queues", select: "-organizer" },
      ])
      .exec();

    res.json(new UserModel(user));
  }

  @ApiOperationGet({
    path: "/myself",
    summary: "Get current user",
    description: "Obtains the current logged user",
    responses: {
      200: {
        model: "User",
      },
    },
  })
  public async getMyUser(req: Request, res: Response) {
    const user = await UserMongoose.findById(req.user.id)
      .populate("journeys")
      .exec();

    res.json(new UserModel(user));
  }

  @ApiOperationPatch({
    path: "/:id/activity_feed",
    parameters: {
      body: {
        model: "User.NotificationPreferences",
      },
    },
    responses: {
      200: {},
      ...authenticationResponses,
    },
    security: {
      ensureAuthenticated: [],
    },
  })
  public async updateUserNotificationPreferences(
    req: Request<{ id: string }, unknown, IUserNotificationPreferences>,
    res: Response
  ) {
    const { app_notification, email } = req.body;
    const user = await UserMongoose.findById(req.user.id);

    user.notification_preferences.app_notification = app_notification;
    user.notification_preferences.email = email;

    await user.save({ validateBeforeSave: true });

    res.json(true);
  }

  @ApiOperationGet({
    path: "/:id/activity_feed",
    parameters: {
      query: {
        limit: {
          type: SwaggerDefinitionConstant.NUMBER,
          default: 10,
          maximum: 50,
          minimum: 1,
          allowEmptyValue: true,
        },
      },
    },
    responses: {
      200: {},
      ...authenticationResponses,
    },
    security: {
      ensureAuthenticated: [],
    },
  })
  public async getUserActivityFeed(
    req: Request<{ id: string }, unknown, unknown, { limit: number }>,
    res: Response
  ) {
    const limit = Math.min(1, 50, req.query.limit || 10);
    const user = await UserMongoose.findById(req.user.id);

    const activity = await ActivityMongooseModel.find({
      who: { $in: user.follows },
    })
      .limit(limit)
      .exec();

    res.json(activity.map((document) => new Activity(document)));
  }
}

export default new UserController();
