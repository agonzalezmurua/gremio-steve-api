import { Application } from "express";
import colors = require("colors");
import cors from "cors";
import bodyParser = require("body-parser");
import cookieParser = require("cookie-parser");
import config = require("config");

import prefixes from "./constants/consola.prefixes";
import { configure as configureOsuClient } from "./services/osu.configure";
import { configure as configureDatabase } from "./services/database.configure";
import { configure as configureOauth } from "./services/auth.configure";
import { configure as configureRoutes } from "./services/routes.configure";
import { configure as configureSwagger } from "./services/swagger.configure";
import { configure as configureCloudinary } from "./services/cloudinary.configure";

import trafficLogger from "./middlewares/trafficLogger";
import consola from "consola";

const handleError = (service) => (error) => {
  consola.error("failed to configure", service + ":\n", error);
};

/**
 * Initializes main configuration of the app
 * @param {import('express').Application} app
 */
export default async function setup(app: Application): Promise<void> {
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
  app.use(cookieParser()); // Add cookies suport
  app.use(bodyParser.json()); // Add json on body support
  app.use(bodyParser.raw()); // Add raw body support
  app.use(bodyParser.urlencoded({ extended: true })); // Add support to read x-www-form-urlencoded form data
  app.use(trafficLogger);

  await Promise.all([
    configureSwagger(app).catch(handleError("swagger")),
    configureOauth(app).catch(handleError("oauth")),
    configureRoutes(app).catch(handleError("routes")),
    configureOsuClient().catch(handleError("osu client")),
    configureDatabase().catch(handleError("database")),
    configureCloudinary().catch(handleError("hosting")),
  ]);
}
