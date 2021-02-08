import Express from "express";

import errorHandler from "../middlewares/errorHandler";
import users from "../routes/user";

/**
 * Configures api routes
 * @param {import('express').Application} app
 */
export async function configure(app) {
  const router = Express.Router();

  router.use("/users", users);

  router.use(errorHandler);
  app.use(router);
}
