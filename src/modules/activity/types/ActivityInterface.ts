import { Journey } from "_/modules/journeys/model";
import { User } from "_/modules/users/models";

import { ActivityKind } from "./ActivityKind";

export interface ActivityInterface {
  id: number;
  created_at: Date;
  kind: ActivityKind;
  user?: User;
  journey?: Journey;
}
