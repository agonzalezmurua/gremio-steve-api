import { Router, Application } from "express";
import errorHandler from "../middlewares/errorHandler";

import Users from "_/routes/users";
import Journeys from "_/routes/journeys";
import Auth from "_/routes/auth";

/**
 * Configures api routes
 * @param {import('express').Application} app
 */
export async function configure(app: Application): Promise<void> {
  const router = Router();

  router.use("/users", Users);
  router.use("/journeys", Journeys);
  router.use("/auth", Auth);

  router.use(errorHandler);
  app.use(router);
}
