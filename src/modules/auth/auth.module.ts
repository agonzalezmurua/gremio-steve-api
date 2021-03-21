import { HttpModule, Module } from "@nestjs/common";
import { ConfigService, ConfigModule } from "@nestjs/config";
import { PassportModule } from "@nestjs/passport";

import { CommonModule } from "../common/common.module";
import { UsersModule } from "../users/users.module";
import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";
import { OsuStrategy } from "./osu.strategy";

@Module({
  imports: [
    PassportModule,
    CommonModule,
    UsersModule,
    HttpModule,
    ConfigModule,
  ],
  providers: [AuthService, OsuStrategy, ConfigService],
  exports: [AuthService],
  controllers: [AuthController],
})
export class AuthModule {}
