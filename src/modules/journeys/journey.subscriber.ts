import {
  EntitySubscriberInterface,
  EventSubscriber,
  UpdateEvent,
} from "typeorm";

import { Journey } from "_/modules/journeys/model";

import { Activity } from "_/modules/activity/models/activity.entity";
import { ActivityKind } from "../activity/types/ActivityKind";

@EventSubscriber()
export class JourneySubscriber implements EntitySubscriberInterface<Journey> {
  listenTo(): any {
    return Journey;
  }

  async afterInsert(event: UpdateEvent<Journey>): Promise<void> {
    const activity = new Activity();

    activity.journey = event.entity;
    activity.user = event.entity.organizer;
    activity.kind = ActivityKind.USER_CREATED_JOURNEY;

    await event.manager.save<Activity>(activity);
  }
}
