import { ApiProperty } from "@nestjs/swagger";

export class UserData {
  @ApiProperty({ description: "User's unique id", example: 1 })
  public readonly id: number;

  @ApiProperty({ description: "User's osu id", example: 1869277 })
  public readonly osu_id: number;

  @ApiProperty({ example: "Ferret" })
  public readonly name: string;

  @ApiProperty({ example: "https://a.ppy.sh/1869277?1462143398.jpg" })
  public readonly avatar_url: string;

  @ApiProperty({
    example: "https://osu.ppy.sh/images/headers/profile-covers/c8.jpg",
  })
  public readonly banner_url: string;
}
