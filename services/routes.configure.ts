import * as express from "express";
import errorHandler from "../middlewares/errorHandler";

import Users from "../routes/users";
import Journeys from "../routes/journeys";

/**
 * Configures api routes
 * @param {import('express').Application} app
 */
export async function configure(app) {
  const router = express.Router();

  router.use("/users", Users);
  router.use("/journeys", Journeys);

  router.use(errorHandler);
  app.use(router);
}
