import * as express from "express";
import Users from "../routes/users";
import Journeys from "../routes/journeys";
import errorHandler from "../middlewares/errorHandler";

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
