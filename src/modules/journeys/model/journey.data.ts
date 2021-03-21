import { ApiProperty } from "@nestjs/swagger";
import { UserData } from "_/modules/users/models";
import { Cover } from "./cover.entity";

export class JourneyData {
  @ApiProperty({ description: "Journeys unique id" })
  public readonly id: number;

  @ApiProperty()
  public readonly title: string;

  @ApiProperty()
  public readonly artist: string;

  @ApiProperty()
  public readonly osu_link: string;

  @ApiProperty()
  public readonly organizer: UserData;

  @ApiProperty()
  public readonly covers: Cover;
}
