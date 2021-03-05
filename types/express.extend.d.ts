import { Steve } from "./steve-api";

declare module "express" {
  export interface Request {
    isAuthenticated: () => boolean;
    user?: Steve.LoggedUserTokenPayload;
    rawBody: Buffer;
  }
}
