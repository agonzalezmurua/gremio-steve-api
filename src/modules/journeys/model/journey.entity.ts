import { Column, Entity, JoinColumn, ObjectIdColumn, OneToOne } from "typeorm";
import { CoversEntity } from "./covers.entity";

import { User } from "_/modules/users/models/user.entity";

import { JourneyData } from "./journey.data";

@Entity("journeys")
export class Journey {
  @ObjectIdColumn()
  id: string;

  @Column()
  title: string;

  @Column()
  artist: string;

  @OneToOne(() => User, (user) => user.id)
  @JoinColumn()
  organizer: User;

  @Column()
  covers: CoversEntity;

  @Column()
  osu_link?: string;

  public build(): JourneyData {
    return {
      id: this.id,
    };
  }
}
