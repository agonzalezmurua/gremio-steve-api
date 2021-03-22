import { ApiProperty } from "@nestjs/swagger";
import { UserData } from "_/modules/users/models";

class CoverData {
  @ApiProperty({
    example:
      "https://assets.ppy.sh/beatmaps/982042/covers/cover.jpg?1583175791",
  })
  banner: string;

  @ApiProperty({
    example:
      "https://assets.ppy.sh/beatmaps/982042/covers/cover.jpg?1583175791",
  })
  thumbnail: string;
}

export class JourneyData {
  @ApiProperty({ description: "Journeys unique id", example: 1 })
  public readonly id: number;

  @ApiProperty({ description: "Osu's unique id", example: 982042 })
  public readonly osu_id: number;

  @ApiProperty({ example: "I THINK" })
  public readonly title: string;

  @ApiProperty({ example: "Tyler, The Creator" })
  public readonly artist: string;

  @ApiProperty({ example: "https://osu.ppy.sh/beatmapsets/982042" })
  public readonly osu_link: string;

  @ApiProperty()
  public readonly organizer: UserData;

  @ApiProperty()
  public readonly covers: CoverData;
}
