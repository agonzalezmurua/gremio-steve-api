import * as mongoose from "mongoose";
import { Request, Response } from "express";
import {
  ApiOperationGet,
  ApiPath,
  SwaggerDefinitionConstant,
} from "swagger-express-ts";

import BaseController from "./_base";
import Model from "../models/user";
import UserSchema, { IUserDocument } from "../schemas/user";

const User = mongoose.model("User", UserSchema);

@ApiPath({
  path: "/users",
  name: "Users",
})
class UserController extends BaseController<IUserDocument> {
  constructor() {
    super(User);
  }

  @ApiOperationGet({
    parameters: {
      query: {
        search: {
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
  public searchUser(req: Request, res: Response) {
    const {
      query: { search = "" },
    } = req;

    User.fuzzySearch(search as string)
      .select("-confidenceScore")
      .then((users) => {
        res.json(users.map((schema) => new Model(schema)));
      });
  }
}

export default new UserController();
