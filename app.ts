import "reflect-metadata";
import * as colors from "config";
import consola = require("consola");
import * as express from "express";
import * as config from "config";

import prefixes from "./constants/consola_prefixes";
import setup from "./setup";

const app = express();
const port = config.get("app.port") || 3000;

setup(app)
  .then(() => {
    const server = app.listen(port);
    server.on("listening", () => {
      consola.success(
        prefixes.app,
        "App is ready and listening to port",
        colors.yellow(port)
      );
    });
  })
  .catch((error) => {
    consola.error(prefixes.app, "App startup failed", error);
  });
