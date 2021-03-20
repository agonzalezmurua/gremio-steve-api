import { ApiProperty } from "@nestjs/swagger";

export class UserInput {
  @ApiProperty()
  public readonly name: string;
}
