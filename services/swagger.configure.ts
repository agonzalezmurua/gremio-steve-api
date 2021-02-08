import "reflect-metadata";
import Express, { Application } from "express";
import * as swagger from "swagger-express-ts";

import packageJson from "../package.json";

export async function configure(app: Application) {
  app.use("/api-docs/swagger", Express.static("static/swagger"));
  app.use(
    "/api-docs/swagger/assets",
    Express.static("node_modules/swagger-ui-dist")
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
