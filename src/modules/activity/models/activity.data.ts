import { ApiProperty } from "@nestjs/swagger";
import { JourneyData } from "_/modules/journeys/model";
import { UserData } from "_/modules/users/models";
import { ActivityKind } from "../types/ActivityKind";

export class ActivityData {
  @ApiProperty({ example: 1 })
  id: number;

  @ApiProperty({ example: new Date("2007-09-16") })
  created_at: Date;

  @ApiProperty({ enum: ActivityKind })
  kind: ActivityKind;

  @ApiProperty({ nullable: true })
  user?: UserData;

  @ApiProperty({ nullable: true })
  journey?: JourneyData;
}
