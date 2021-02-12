import { Request, Response, NextFunction } from "express";
import colors = require("colors");
import consola from "consola";
import prefixes from "_/constants/consola.prefixes";

/**
 * Logger that tracks every response sent by express
 */
export default function trafficLogger(
  req: Request,
  res: Response,
  next: NextFunction
): void {
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
    const args = [prefixes.app, method, protocol, code, "-", path];

    consola.info("", ...args);

    if (req.method !== "GET" && req.method !== "DELETE") {
      consola.debug(colors.grey("\n request body:"), req.body);
    }
  });
  next();
}
