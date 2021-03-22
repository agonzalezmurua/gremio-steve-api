import {
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  Unique,
} from "typeorm";

import { User } from "_/modules/users/models/user.entity";

import { JourneyData } from "./journey.data";

@Unique(["osu_id"])
@Entity("journeys")
export class Journey {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  osu_id: number;

  @Column()
  title: string;

  @Column()
  artist: string;

  @ManyToOne(() => User, (user) => user.journeys)
  organizer: User;

  @Column()
  covers_thumbnail: string;

  @Column()
  covers_banner: string;

  @Column()
  osu_link?: string;

  public build(): JourneyData {
    return {
      id: this.id,
      osu_id: this.osu_id,
      title: this.title,
      artist: this.artist,
      osu_link: this.osu_link,
      organizer: this.organizer.build(),
      covers: {
        banner: this.covers_banner,
        thumbnail: this.covers_thumbnail,
      },
    };
  }
}
