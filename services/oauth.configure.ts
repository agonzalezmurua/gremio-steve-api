import Express from "express";
import {
  requestAuthorization as osuAuthorization,
  handleAuthentication as osuAuthentication,
} from "./oauth/providers/osu";

/**
 * Configures a router with 'oauth' prefix that handles
 * app's authentication
 *
 * @param {import('express').Application} app
 */
export async function configure(app) {
  const router = Express.Router();

  router.get("/osu", osuAuthorization);
  router.post("/osu/token", osuAuthentication);

  app.use("/oauth", router);
}
