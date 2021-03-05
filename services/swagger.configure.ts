import express = require("express");
import { Application } from "express";
import * as swagger from "swagger-express-ts";
import { ISwaggerContact } from "swagger-express-ts/i-swagger";

import packageJson = require("_/package.json");

export async function configure(app: Application): Promise<void> {
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
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            description:
              "JWT Authorization header using the Bearer scheme. Example: 'Authorization: Bearer {token}'",
            type: "apiKey",
            in: "header",
            name: "Authorization",
          },
        },
        models: {
          "Authentication.Response": {
            description: "Authentication values for response",
            properties: {
              access_token: {
                type: swagger.SwaggerDefinitionConstant.STRING,
              },
              token_type: {
                type: swagger.SwaggerDefinitionConstant.STRING,
              },
              expires_in: {
                type: swagger.SwaggerDefinitionConstant.NUMBER,
              },
            },
          },
          "FileUpload.Response": {
            description: "Result of a image type",
            properties: {},
          },
        },
      },
    })
  );
}
