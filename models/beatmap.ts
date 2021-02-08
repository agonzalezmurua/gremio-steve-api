import {
  ApiModel,
  ApiModelProperty,
  SwaggerDefinitionConstant,
} from "swagger-express-ts";
import {
  IBeatmap,
  IBeatmapDocument,
  BeatmapDifficulty,
  BeatmapModes,
  BeatmapStatus,
} from "../schemas/beatmap";
import { IUser } from "../schemas/user";

@ApiModel()
export default class Beatmap implements IBeatmap {
  constructor(document: IBeatmapDocument) {
    this.mode = document.mode;
    this.difficulty = document.difficulty;
    this.status = document.status;
    this.assignee = document.assignee;
  }

  @ApiModelProperty({ required: true })
  public name: string;

  @ApiModelProperty({
    enum: Object.values(BeatmapModes),
    required: true,
  })
  public mode: BeatmapModes;

  @ApiModelProperty({
    enum: Object(BeatmapDifficulty),
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
