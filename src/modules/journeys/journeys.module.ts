import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { Journey } from "_/modules/journeys/model";
import { CommonModule } from "_/modules/common/common.module";
import { OsuModule } from "_/modules/osu/osu.module";

import { JourneysController } from "./journeys.controller";
import { JourneysService } from "./journeys.service";
import { JourneySubscriber } from "./journey.subscriber";

import { ActivityModule } from "../activity/activity.module";

@Module({
  imports: [
    TypeOrmModule.forFeature([Journey]),
    CommonModule,
    OsuModule,
    ActivityModule,
  ],
  controllers: [JourneysController],
  providers: [JourneysService, JourneySubscriber],
  exports: [JourneysService],
})
export class JourneysModule {}
