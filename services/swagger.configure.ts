import express = require("express");
import config = require("config");
import { Application } from "express";
import * as swagger from "swagger-express-ts";
import { ISwaggerContact } from "swagger-express-ts/i-swagger";
import format from "string-format";

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
          title: "Gremio Steve Api",
          description: "",
          version: packageJson.version,
          contact: packageJson.author as ISwaggerContact,
        },
        securityDefinitions: {
          ApiKeyAuth: {
            // @ts-ignore
            description:
              "JWT Authorization header using the Bearer scheme. Example: 'Authorization: Bearer {token}'",
            type: "apiKey",
            in: "header",
            name: "Authorization",
          },
        },
      },
    })
  );
}
