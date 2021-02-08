import "reflect-metadata";
import express, { Application } from "express";
import swagger from "swagger-express-ts";

import UserModel from "../models/user";

import packageJson from "../package.json";

export async function configure(app: Application) {
  app.use("/api-docs/swagger", express.static("static/swagger"));
  app.use(
    "/api-docs/swagger/assets",
    express.static("node_modules/swagger-ui-dist")
  );
  app.use(
    swagger.express({
      definition: {
        info: {
          title: "Steve Api",
          version: packageJson.version,
        },
      },
    })
  );
}
