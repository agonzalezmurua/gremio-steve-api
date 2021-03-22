import {
  EntitySubscriberInterface,
  EventSubscriber,
  UpdateEvent,
} from "typeorm";
import { Journey } from "_/modules/journeys/model";

@EventSubscriber()
export class JourneySubscriber implements EntitySubscriberInterface<Journey> {
  listenTo(): any {
    return Journey;
  }

  afterInsert(event: UpdateEvent<Journey>): Promise<any> | void {
    const organizer = event.entity.organizer;
  }
}
