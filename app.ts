import "reflect-metadata";
import colors = require("colors");
import express = require("express");
import config = require("config");

import prefixes from "./constants/consola.prefixes";
import setup from "./setup";
import consola from "consola";

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
