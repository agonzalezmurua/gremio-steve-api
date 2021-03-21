import { ApiProperty } from "@nestjs/swagger";

export class UserData {
  @ApiProperty({ description: "User's unique id" })
  public readonly id: number;

  @ApiProperty({ description: "User's osu id" })
  public readonly osu_id: string;

  @ApiProperty()
  public readonly name: string;
}
