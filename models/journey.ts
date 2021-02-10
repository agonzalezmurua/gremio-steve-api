import {
  ApiModel,
  ApiModelProperty,
  SwaggerDefinitionConstant,
} from "swagger-express-ts";

import {
  IBeatmap,
  IBeatmapDocument,
  BeatmapModes,
} from "../schemas/journey.beatmap";
import { IJourney, IJourneyDocument, JourneyStatus } from "../schemas/journey";
import { IUser } from "../schemas/user";

import { JourneyMetadata } from "./journey.metadata";
import Beatmap from "./journey.beatmap";

@ApiModel()
class Journey implements IJourney {
  constructor(document: IJourneyDocument) {
    this.id = document.id;
    this.title = document.title;
    this.artist = document.artist;
    this.organizer = document.organizer;
    this.thumbnail_url = document.thumbnail_url;
    this.banner_url = document.banner_url;
    this.metadata = new JourneyMetadata(document.metadata);
    this.modes = document.modes;
    this.description = document.description;
    this.status = document.status;
    this.is_private = document.is_private;
    this.beatmaps = document.beatmaps.map(
      (beatmap) => new Beatmap(beatmap as IBeatmapDocument)
    );
    this.osu_link = document.osu_link;
  }

  @ApiModelProperty()
  public id: string;

  @ApiModelProperty({ required: true })
  public title: string;

  @ApiModelProperty({ required: true })
  public artist: string;

  @ApiModelProperty({ model: "User", required: true })
  public organizer: IUser;

  @ApiModelProperty({ required: true })
  public thumbnail_url: string;

  @ApiModelProperty({ required: true })
  public banner_url: string;

  @ApiModelProperty({ model: "Journey.Metadata" })
  public metadata: JourneyMetadata;

  @ApiModelProperty({
    type: SwaggerDefinitionConstant.ARRAY,
    itemType: SwaggerDefinitionConstant.STRING,
    enum: Object.values(BeatmapModes),
  })
  public modes: BeatmapModes[];

  @ApiModelProperty()
  public description?: string;

  @ApiModelProperty({ enum: Object.values(JourneyStatus) })
  public status: JourneyStatus;

  @ApiModelProperty()
  public is_private: boolean;

  @ApiModelProperty({
    type: SwaggerDefinitionConstant.ARRAY,
    itemType: SwaggerDefinitionConstant.OBJECT,
    model: "Journey.Beatmap",
  })
  public beatmaps: IBeatmap[];

  @ApiModelProperty()
  public osu_link?: string;
}

export default Journey;
