import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Cover } from "./cover.entity";

import { User } from "_/modules/users/models/user.entity";

import { JourneyData } from "./journey.data";

@Entity("journeys")
export class Journey {
  @PrimaryGeneratedColumn()
  readonly id: number;

  @Column()
  title: string;

  @Column()
  artist: string;

  @ManyToOne(() => User, (user) => user.journeys)
  organizer: User;

  @Column(() => Cover)
  covers: Cover;

  @Column()
  osu_link?: string;

  public build(): JourneyData {
    return {
      id: this.id,
      title: this.title,
      artist: this.artist,
      osu_link: this.osu_link,
      organizer: this.organizer.build(),
      covers: this.covers,
    };
  }
}
