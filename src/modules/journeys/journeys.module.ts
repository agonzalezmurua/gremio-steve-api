import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { Journey } from "_/modules/journeys/model";
import { CommonModule } from "_/modules/common/common.module";
import { OsuModule } from "_/modules/osu/osu.module";

import { JourneysController } from "./journeys.controller";
import { JourneysService } from "./journeys.service";

@Module({
  imports: [TypeOrmModule.forFeature([Journey]), CommonModule, OsuModule],
  controllers: [JourneysController],
  providers: [JourneysService],
  exports: [JourneysService],
})
export class JourneysModule {}
