import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { CommonModule } from "_/modules/common/common.module";

import { Journey } from "./model";
import { JourneysController } from "./journeys.controller";
import { JourneysService } from "./journeys.service";

@Module({
  imports: [TypeOrmModule.forFeature([Journey]), CommonModule],
  controllers: [JourneysController],
  providers: [JourneysService],
  exports: [JourneysService],
})
export class JourneysModule {}
