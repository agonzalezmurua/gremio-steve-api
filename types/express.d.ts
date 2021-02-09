import { IUserDocument } from "../schemas/user";

declare module "express" {
  export interface Request {
    user?: IUserDocument;
  }
}
