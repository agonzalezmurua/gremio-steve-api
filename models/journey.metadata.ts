import {
  ApiModel,
  ApiModelProperty,
  SwaggerDefinitionConstant,
} from "swagger-express-ts";
import { IMetadata } from "../schemas/journey";

@ApiModel({
  name: "JourneyMetadata",
})
export class JourneyMetadata implements IMetadata {
  @ApiModelProperty()
  public genre: string;

  @ApiModelProperty({
    type: SwaggerDefinitionConstant.ARRAY,
    itemType: SwaggerDefinitionConstant.NUMBER,
    description: "Represents a range of BPM that the song has",
  })
  public bpm: number[];

  @ApiModelProperty()
  public closure?: string;

  @ApiModelProperty()
  public duration: number;

  constructor(document: IMetadata) {
    this.genre = document.genre;
    this.bpm = document.bpm;
    this.closure = document.closure;
    this.duration = document.duration;
  }
}
