import mongoose from "mongoose";
import { Request, Response } from "express";
import BaseController from "./_base";
import UserModel from "../models/user";
import { IUserSchema, UserSchema } from "../schemas/user";
import Swagger from "swagger-express-ts";

const User = mongoose.model("User", UserSchema);

@Swagger.ApiPath({
  path: "/users",
  name: "Users",
})
class UserController extends BaseController<IUserSchema> {
  constructor() {
    super(User);
  }

  @Swagger.ApiOperationGet({
    description: "Get user objects list based on name",
    summary: "Get user list",
    responses: {
      200: {
        description: "Success",
        type: Swagger.SwaggerDefinitionConstant.Response.Type.ARRAY,
        model: "User",
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
        res.json(users.map((schema) => new UserModel(schema)));
      });
  }
}

export default new UserController();
