import { HttpModule, Module } from "@nestjs/common";
import { PassportModule } from "@nestjs/passport";

import { CommonModule } from "../common/common.module";
import { UsersModule } from "../users/users.module";
import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";
import { OsuStrategy } from "./osu.strategy";

@Module({
  imports: [UsersModule, PassportModule, HttpModule, CommonModule],
  providers: [AuthService, OsuStrategy],
  controllers: [AuthController],
})
export class AuthModule {}
