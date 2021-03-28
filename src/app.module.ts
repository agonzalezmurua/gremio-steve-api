import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ConfigService } from "@nestjs/config";
import { ConfigModule } from "@nestjs/config";

import configuration from "~/config/configuration";

import { TrafficLoggerMiddleware } from "_/common/middlewares/TrafficLogger";

import { UsersModule } from "./modules/users/users.module";
import { JourneysModule } from "./modules/journeys/journeys.module";
import { AuthModule } from "./modules/auth/auth.module";
import { Activity } from "./modules/activity/models/activity.entity";
import { ActivityModule } from "./modules/activity/activity.module";

import { User } from "./modules/users/models";
import { Journey } from "./modules/journeys/model";

import { JourneySubscriber } from "./modules/journeys/journey.subscriber";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
    }),
    TypeOrmModule.forRootAsync({
      useFactory: (config: ConfigService) => ({
        type: "postgres",

        host: config.get("database.host"),
        port: Number(config.get("database.port")),
        username: config.get("database.username"),
        database: config.get("database.database"),
        password: process.env.DATABASE_PASSWORD,

        entities: [User, Journey, Activity],
        subscribers: [JourneySubscriber],
        synchronize: true,
      }),
      inject: [ConfigService],
    }),
    UsersModule,
    JourneysModule,
    AuthModule,
    ActivityModule,
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
