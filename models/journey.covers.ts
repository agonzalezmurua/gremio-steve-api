import { ApiModel, ApiModelProperty } from "swagger-express-ts";
import { ICovers } from "_/schemas/journey";

@ApiModel({
  name: "Journey.Covers",
})
export default class JourneyCovers implements ICovers {
  constructor(covers: ICovers) {
    this.banner = covers.banner;
    this.thumbnail = covers.thumbnail;
  }

  @ApiModelProperty()
  thumbnail: string;

  @ApiModelProperty()
  banner: string;
}
