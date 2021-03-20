import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { CommonModule } from "_/modules/common/common.module";

import { UsersController } from "./users.controller";
import { UsersService } from "./users.service";
import { User } from "./models/user.entity";

@Module({
  imports: [TypeOrmModule.forFeature([User]), CommonModule],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}
