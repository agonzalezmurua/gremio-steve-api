import { ApiModel, ApiModelProperty } from "swagger-express-ts";
import {
  IBeatmap,
  IBeatmapDocument,
  BeatmapDifficulty,
  BeatmapModes,
  BeatmapStatus,
} from "_/schemas/journey.beatmap";
import { IUser } from "_/schemas/user";

@ApiModel({
  name: "Journey.Beatmap",
})
export default class Beatmap implements IBeatmap {
  constructor(document: IBeatmapDocument) {
    this.id = document.id;
    this.mode = document.mode;
    this.difficulty = document.difficulty;
    this.status = document.status;
    this.assignee = document.assignee;
  }
  @ApiModelProperty()
  public id: string;

  @ApiModelProperty({ required: true })
  public name: string;

  @ApiModelProperty({
    enum: Object.values(BeatmapModes),
    required: true,
  })
  public mode: BeatmapModes;

  @ApiModelProperty({
    enum: Object.values(BeatmapDifficulty),
    required: true,
  })
  public difficulty: BeatmapDifficulty;

  @ApiModelProperty({
    enum: Object.values(BeatmapStatus),
  })
  public status: BeatmapStatus;

  @ApiModelProperty({
    model: "User",
  })
  public assignee?: IUser;
}
