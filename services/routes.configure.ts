import Express from "express";
import Users from "../routes/users";
import errorHandler from "../middlewares/errorHandler";

/**
 * Configures api routes
 * @param {import('express').Application} app
 */
export async function configure(app) {
  const router = Express.Router();

  router.use(Users);

  router.use(errorHandler);
  app.use(router);
}
