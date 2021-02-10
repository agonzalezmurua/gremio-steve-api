import { Steve } from "./steve-api";

declare module "express" {
  export interface Request {
    user?: Steve.LoggedUser;
  }
}
