import { ModeType } from "../schemas/beatmap";
import { IJourney } from "../schemas/journey";
import { IUser, IUserDocument, IAvailability } from "../schemas/user";

class UserAvailability implements IAvailability {
  mods: boolean;
  guest_diffs: boolean;
  playtesting: boolean;

  constructor(document: IAvailability) {
    this.mods = document.mods;
    this.guest_diffs = document.guest_diffs;
    this.playtesting = document.playtesting;
  }
}

export default class UserModel implements IUser {
  public _id: string;
  public osu_id: string;
  public name: string;
  public active: boolean;
  public avatar_url: string;
  public banner_url?: string;
  public availability: UserAvailability;
  public journeys: IJourney[];
  public community_role: string;
  public role: "admin" | "user" | "moderator";
  public preferences: ModeType[];
  public status: "available" | "do_not_disturb";
  public description: string;
  public queue: IJourney[];

  constructor(document: IUserDocument) {
    this._id = document.id;
    this.osu_id = document.osu_id;
    this.name = document.name;
    this.active = document.active;
    this.avatar_url = document.avatar_url;
    this.banner_url = document.banner_url;
    this.availability = new UserAvailability(document.availability);
    this.journeys = document.journeys;
    this.community_role = document.community_role;
    this.role = document.role;
    this.preferences = document.preferences;
    this.status = document.status;
    this.description = document.description;
    this.queue = document.queue;
  }
}
