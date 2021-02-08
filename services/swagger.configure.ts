import express = require("express");
import { Application } from "express";
import * as swagger from "swagger-express-ts";

import packageJson = require("../package.json");

export async function configure(app: Application) {
  // Static ref to static swagger website
  app.use("/api-docs/swagger", express.static("static/swagger"));
  // Static ref to static swagger website assets
  app.use(
    "/api-docs/swagger/assets",
    express.static("node_modules/swagger-ui-dist")
  );

  // Output for swagger.json file
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
