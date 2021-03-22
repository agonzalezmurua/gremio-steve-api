import { ApiProperty } from "@nestjs/swagger";

export class JourneyInput {
  @ApiProperty({ example: "https://osu.ppy.sh/beatmapsets/1347368" })
  public readonly osu_link: string;
}
