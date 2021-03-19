import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import config = require("config");

import { AppController } from "./app.controller";
import { AppService } from "./app.service";

import { UsersModule } from "_/modules/users/users.module";
import { TrafficLoggerMiddleware } from "_/common/middlewares/TrafficLogger";
import { User } from "_/modules/users/user.entity";

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: "mongodb",
      host: config.get("database.host"),
      port: config.get("database.port"),
      database: config.get("database.database"),
      entities: [User],
    }),
    UsersModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer): void {
    consumer
      .apply(TrafficLoggerMiddleware)
      .forRoutes({ path: "*", method: RequestMethod.ALL });
  }
}
