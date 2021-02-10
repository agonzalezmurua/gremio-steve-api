import { Router, Application } from "express";
import {
  requestAuthorization as osuAuthorization,
  handleAuthentication as osuAuthentication,
} from "./oauth/providers/osu";

/**
 * Configures a router with 'oauth' prefix that handles
 * app's authentication
 */
export async function configure(app: Application): Promise<void> {
  const router = Router();

  router.get("/osu", osuAuthorization);
  router.post("/osu/token", osuAuthentication);

  app.use("/oauth", router);
}
