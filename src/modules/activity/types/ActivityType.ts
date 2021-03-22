import { Journey } from "_/modules/journeys/model";
import { User } from "_/modules/users/models";
import { ActivityKind } from "./ActivityKind";
import { IActivity } from "./IActivity";

interface UserAddedJourneyToQueue extends IActivity {
  kind: ActivityKind.userAddedJourneyToQueue;
  user: User;
  journey: Journey;
}

interface UserRemovedJourneyToQueue extends IActivity {
  kind: ActivityKind.userAddedJourneyToQueue;
  journey: Journey;
  user: User;
}

export type ActivityDataType =
  | IActivity
  | UserAddedJourneyToQueue
  | UserRemovedJourneyToQueue;
