import { Router, Application } from "express";
import errorHandler from "../middlewares/errorHandler";

import Users from "_/routes/users";
import Journeys from "_/routes/journeys";

/**
 * Configures api routes
 * @param {import('express').Application} app
 */
export async function configure(app: Application): Promise<void> {
  const router = Router();

  router.use("/users", Users);
  router.use("/journeys", Journeys);

  router.use(errorHandler);
  app.use(router);
}
