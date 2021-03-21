import { HttpModule, Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { JwtModule } from "@nestjs/jwt";
import { PassportModule } from "@nestjs/passport";

import { CommonModule } from "../common/common.module";
import { UsersModule } from "../users/users.module";

import { AuthController } from "./auth.controller";

import { AuthService } from "./auth.service";
import { OsuStrategy } from "./osu.strategy";

@Module({
  imports: [
    JwtModule.registerAsync({
      useFactory: async () => ({
        secret: process.env.APP_AUTH_SECRET,
        signOptions: { expiresIn: "1d" },
      }),
    }),
    PassportModule,
    CommonModule,
    UsersModule,
    HttpModule,
    ConfigModule,
  ],
  providers: [AuthService, OsuStrategy],
  exports: [AuthService, JwtModule],
  controllers: [AuthController],
})
export class AuthModule {}
