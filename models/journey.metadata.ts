import {
  ApiModel,
  ApiModelProperty,
  SwaggerDefinitionConstant,
} from "swagger-express-ts";
import { IMetadata } from "_/schemas/journey";

@ApiModel({
  name: "Journey.Metadata",
})
export default class JourneyMetadata implements IMetadata {
  @ApiModelProperty({
    required: true,
  })
  public genre: string;

  @ApiModelProperty({
    type: SwaggerDefinitionConstant.ARRAY,
    itemType: SwaggerDefinitionConstant.NUMBER,
    required: true,
    description: "Represents a range of BPM that the song has",
  })
  public bpm: number[];

  @ApiModelProperty({
    type: SwaggerDefinitionConstant.STRING,
    description: "ISO String of closure date",
  })
  public closure?: Date;

  @ApiModelProperty()
  public duration: number;

  constructor(document: IMetadata) {
    this.genre = document.genre;
    this.bpm = document.bpm;
    this.closure = document.closure;
    this.duration = document.duration;
  }
}
