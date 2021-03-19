import "reflect-metadata";

import { NestFactory } from "@nestjs/core";
import { SwaggerModule, DocumentBuilder } from "@nestjs/swagger";

import consola from "consola";
import colors = require("colors");
import cors from "cors";
import bodyParser = require("body-parser");
import cookieParser = require("cookie-parser");
import config = require("config");

import { AppModule } from "_/modules/app/app.module";

import prefixes from "./common/constants/consola.prefixes";
import { configure as configureCloudinary } from "./common/providers/cloudinary.provider";

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(AppModule);
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
    .setTitle("Cats example")
    .setDescription("The cats API description")
    .setVersion("1.0")
    .addTag("cats")
    .build();

  const swaggerDocument = SwaggerModule.createDocument(app, swaggerConfig);

  SwaggerModule.setup("api", app, swaggerDocument);

  await configureCloudinary();
  await app.listen(3000);
}

bootstrap();
