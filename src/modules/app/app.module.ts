import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import config = require("config");

import { UsersModule } from "_/modules/users/users.module";
import { TrafficLoggerMiddleware } from "_/common/middlewares/TrafficLogger";

import { User } from "_/modules/users/models";
import { Journey } from "_/modules/journeys/model";

import { JourneysModule } from "_/modules/journeys/journeys.module";

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: "mongodb",
      host: config.get("database.host"),
      port: config.get("database.port"),
      database: config.get("database.database"),
      entities: [User, Journey],
    }),
    UsersModule,
    JourneysModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer): void {
    consumer
      .apply(TrafficLoggerMiddleware)
      .forRoutes({ path: "*", method: RequestMethod.ALL });
  }
}
