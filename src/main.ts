import "reflect-metadata";
import "dotenv";

import { NestFactory } from "@nestjs/core";
import { SwaggerModule, DocumentBuilder } from "@nestjs/swagger";
import { ConfigService } from "@nestjs/config";

import consola from "consola";
import colors = require("colors");
import cors from "cors";
import bodyParser = require("body-parser");
import cookieParser = require("cookie-parser");

import { AppModule } from "_/app.module";

import prefixes from "./common/constants/consola.prefixes";

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(AppModule);
  const config = app.get(ConfigService);

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
  app.use(bodyParser.json({ limit: "5mb" })); // Add json on body support
  app.use(bodyParser.urlencoded({ extended: true })); // Add support to read x-www-form-urlencoded form data

  const swaggerConfig = new DocumentBuilder()
    .setTitle("Gremio Steve")
    .setVersion("1.0")
    .build();

  const swaggerDocument = SwaggerModule.createDocument(app, swaggerConfig);

  SwaggerModule.setup("api", app, swaggerDocument);

  await app.listen(config.get("web.port"));
}

bootstrap();
