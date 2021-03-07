import {
  ApiModel,
  ApiModelProperty,
  SwaggerDefinitionConstant,
} from "swagger-express-ts";

import { IBeatmap, IBeatmapDocument } from "../schemas/journey.beatmap";
import {
  ICovers,
  IJourney,
  IJourneyDocument,
  JourneyStatus,
} from "_/schemas/journey";
import { IUser } from "_/schemas/user";

import User from "_/models/user";
import Metadata from "_/models/journey.metadata";
import Beatmap from "_/models/journey.beatmap";
import Covers from "_/models/journey.covers";

@ApiModel()
class Journey implements IJourney {
  constructor(document: IJourneyDocument) {
    this.id = document.id;
    this.title = document.title;
    this.artist = document.artist;
    this.organizer = document.organizer
      ? new User(document.organizer)
      : undefined;
    this.covers = new Covers(document.covers);
    this.metadata = new Metadata(document.metadata);
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

  @ApiModelProperty({ model: "User" })
  public organizer: IUser;

  @ApiModelProperty({ model: "Journey.Covers", required: true })
  public covers: ICovers;

  @ApiModelProperty({ model: "Journey.Metadata" })
  public metadata: Metadata;

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
