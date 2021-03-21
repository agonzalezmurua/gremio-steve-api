import { ApiProperty } from "@nestjs/swagger";

export class JourneyInput {
  @ApiProperty()
  public readonly title: string;

  @ApiProperty()
  public readonly artist: string;

  @ApiProperty()
  public readonly osu_link: string;

  @ApiProperty()
  public readonly covers: {
    thumbnail: string;
    banner: string;
  };
}
