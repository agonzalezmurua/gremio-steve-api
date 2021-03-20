import { ApiProperty } from "@nestjs/swagger";

export class JourneyData {
  @ApiProperty({ description: "Journeys unique id" })
  public readonly id: string;
}
