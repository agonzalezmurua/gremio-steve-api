import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { CommonModule } from "_/modules/common/common.module";
import { ActivityModule } from "_/modules/activity/activity.module";

import { UsersController } from "./users.controller";
import { UsersService } from "./users.service";
import { User } from "./models";

@Module({
  imports: [TypeOrmModule.forFeature([User]), CommonModule, ActivityModule],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}
