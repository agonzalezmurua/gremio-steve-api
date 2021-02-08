import { ApiModel, ApiModelProperty } from "swagger-express-ts";
import { ModeType, IBeatmap } from "../schemas/beatmap";
import { IJourney, IJourneyDocument, IMetadata } from "../schemas/journey";
import { IUser } from "../schemas/user";

@ApiModel({
  name: "UserMetadata",
})
class Metadata implements IMetadata {
  public genre: string;
  public bpm: number[];
  public closure?: string;
  public duration: number;

  constructor(document: IMetadata) {
    this.genre = document.genre;
    this.bpm = document.bpm;
    this.closure = document.closure;
    this.duration = document.duration;
  }
}
@ApiModel({
  name: "Journey",
})
class Journey implements IJourney {
  @ApiModelProperty()
  public _id: string;

  public title: string;
  public artist: string;
  public organizer: IUser;
  public thumbnail_url: string;
  public banner_url: string;
  public metadata: Metadata;
  public modes: ModeType[];
  public description?: string;
  public status: "pending" | "open" | "ready" | "alert" | "problem" | "closed";
  public private: boolean;
  public beatmaps: IBeatmap[];
  public osu_link?: string;

  constructor(document: IJourneyDocument) {
    this._id = document._id;
    this.title = document.title;
    this.artist = document.artist;
    this.organizer = document.organizer;
    this.thumbnail_url = document.thumbnail_url;
    this.banner_url = document.banner_url;
    this.metadata = new Metadata(document.metadata);
    this.modes = document.modes;
    this.description = document.description;
    this.status = document.status;
    this.private = document.private;
    this.beatmaps = document.beatmaps;
    this.osu_link = document.osu_link;
  }
}

export default Journey;
