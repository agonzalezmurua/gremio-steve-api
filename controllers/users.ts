import * as mongoose from "mongoose";
import { Request, Response } from "express";
import {
  ApiOperationGet,
  ApiPath,
  SwaggerDefinitionConstant,
} from "swagger-express-ts";

import BaseController from "_/controllers/_base";

import User from "_/models/user";
import UserSchema, { IUserDocument } from "_/schemas/user";

const MongooseModel = mongoose.model("User", UserSchema);

@ApiPath({
  path: "/users",
  name: "Users",
})
class UserController extends BaseController<IUserDocument> {
  constructor() {
    super(MongooseModel);
  }

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

    MongooseModel.fuzzySearch(search as string)
      .select("-confidenceScore")
      .then((users) => {
        res.json(users.map((schema) => new User(schema)));
      });
  }
}

export default new UserController();
