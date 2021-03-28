import { Journey } from "_/modules/journeys/model";
import { User } from "_/modules/users/models";
import { ActivityKind } from "./ActivityKind";
import { ActivityInterface } from "./ActivityInterface";

interface UserAddedJourneyToQueue extends ActivityInterface {
  kind: ActivityKind.USER_CREATED_JOURNEY;
  user: User;
  journey: Journey;
}

interface UserRemovedJourneyToQueue extends ActivityInterface {
  kind: ActivityKind.USER_CREATED_JOURNEY;
  journey: Journey;
  user: User;
}

export type ActivityDataType =
  | ActivityInterface
  | UserAddedJourneyToQueue
  | UserRemovedJourneyToQueue;
