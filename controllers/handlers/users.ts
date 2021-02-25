import { Request, Response } from "express";
import {
  ApiOperationGet,
  ApiPath,
  SwaggerDefinitionConstant,
} from "swagger-express-ts";

import UserModel from "_/models/user";
import UserMongoose from "_/controllers/mongo/user";

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
  public searchUsers(req: Request, res: Response) {
    const {
      query: { search = "" },
    } = req;

    UserMongoose.fuzzySearch(search as string)
      .select("-confidenceScore")
      .then((users) => {
        res.json(users.map((schema) => new UserModel(schema)));
      });
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
  public getOneUserById(req: Request<{ id: string }>, res: Response) {
    UserMongoose.findById(req.params.id)
      .populate([
        { path: "journeys", select: "-organizer" },
        { path: "queues", select: "-organizer" },
      ])
      .exec()
      .then((user) => res.json(new UserModel(user)));
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
  public getMyUser(req: Request, res: Response) {
    UserMongoose.findById(req.user.id)
      .populate("journeys")
      .exec()
      .then((user) => res.json(new UserModel(user)));
  }
}

export default new UserController();
