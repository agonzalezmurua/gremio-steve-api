import mongoose from "mongoose";
import { Request, Response } from "express";
import BaseController from "./_base";
import UserModel from "../models/user";
import UserSchema, { IUserDocument } from "../schemas/user";

const User = mongoose.model("User", UserSchema);

class UserController extends BaseController<IUserDocument> {
  constructor() {
    super(User);
  }

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
