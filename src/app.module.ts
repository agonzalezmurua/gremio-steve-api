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

import { UsersModule } from "_/modules/users/users.module";
import { TrafficLoggerMiddleware } from "_/common/middlewares/TrafficLogger";

import { User } from "_/modules/users/models";
import { Journey } from "_/modules/journeys/model";

import { JourneysModule } from "_/modules/journeys/journeys.module";
import { AuthModule } from "_/modules/auth/auth.module";
import { Activity } from "./modules/activity/models/activity.entity";
import { ActivityModule } from "./modules/activity/activity.module";

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
        password: process.env.DATABASE_PASSWORD,
        database: config.get("database.database"),

        entities: [User, Journey, Activity],
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
