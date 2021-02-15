import * as mongoose from "mongoose";
import { NextFunction, Request, Response } from "express";
import {
  ApiOperationGet,
  ApiPath,
  SwaggerDefinitionConstant,
} from "swagger-express-ts";

import User from "_/models/user";
import UserSchema from "_/schemas/user";
import { JourneyMongooseModel } from "./journey";
import { JourneyStatus } from "_/schemas/journey";
import Journey from "_/models/journey";

export const UserMongooseModel = mongoose.model("User", UserSchema);

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

    UserMongooseModel.fuzzySearch(search as string)
      .select("-confidenceScore")
      .then((users) => {
        res.json(users.map((schema) => new User(schema)));
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
    UserMongooseModel.findById(req.params.id).then((user) =>
      res.json(new User(user))
    );
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
    UserMongooseModel.findById(req.user.id).then((user) =>
      res.json(new User(user))
    );
  }
}

export default new UserController();
