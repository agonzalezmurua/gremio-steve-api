const consola = require("consola");
import colors = require("colors");
import prefixes from "../constants/consola_prefixes";

/**
 * Logger that tracks every response sent by express
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * @param {import('express').NextFunction} next
 */
export default function trafficLogger(req, res, next) {
  res.on("finish", function () {
    let method = req.method;
    const path = req.originalUrl;
    const code = colors.yellow(this.statusCode);
    const protocol = colors.grey(req.protocol);

    switch (method) {
      case "GET":
        method = colors.green(method);
        break;
      case "PUT":
      case "PATCH":
        method = colors.yellow(method);
        break;
      case "DELETE":
        method = colors.red(method);
        break;
      case "POST":
        method = colors.magenta(method);
        break;
      default:
        method = colors.grey(method);
        break;
    }
    let args = [prefixes.app, method, protocol, code, "-", path];

    consola.info("", ...args);

    if (req.method !== "GET") {
      consola.debug(colors.grey("\n request body:"), req.body);
    }
  });
  next();
}
