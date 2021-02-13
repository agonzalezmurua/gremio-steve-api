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
}

export default new UserController();
