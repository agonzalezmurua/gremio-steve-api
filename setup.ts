import consola from "consola";
import colors from "colors";
import cors from "cors";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import config from "config";

import prefixes from "./constants/consola_prefixes";
import { configure as configureOsuClient } from "./services/osu.configure";
import { configure as configureDatabase } from "./services/database.configure";
import { configure as configureOauth } from "./services/oauth.configure";
import { configure as configureRoutes } from "./services/routes.configure";
import { configure as configureSwagger } from "./services/swagger.configure";

import trafficLogger from "./middlewares/trafficLogger";

const handleError = (service) => (error) => {
  consola.error("failed to configure", service + ":\n", error);
};

/**
 * Initializes main configuration of the app
 * @param {import('express').Application} app
 */
export default async function setup(app) {
  consola.debug(
    prefixes.app,
    "Allowing the following origin (CORS)",
    colors.yellow(config.get("cors.allowed_origin"))
  );

  app.use(
    cors({
      origin: config.get("cors.allowed_origin"),
    })
  );
  app.use(cookieParser());
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: true }));
  app.use(trafficLogger);

  await Promise.all([
    configureSwagger(app).catch(handleError("swagger")),
    configureOauth(app).catch(handleError("oauth")),
    configureRoutes(app).catch(handleError("routes")),
    configureOsuClient().catch(handleError("osu client")),
    configureDatabase().catch(handleError("database")),
  ]);
}
