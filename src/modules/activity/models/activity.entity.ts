import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Journey } from "_/modules/journeys/model";
import { User } from "_/modules/users/models";

import { ActivityKind } from "../types/ActivityKind";
import { IActivity } from "../types/IActivity";
import { ActivityData } from "./activity.data";

@Entity("activity")
export class Activity implements IActivity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ default: new Date() })
  created_at: Date;

  @Column()
  kind: ActivityKind;

  @JoinColumn({ name: "user_id" })
  @ManyToOne(() => User)
  user?: User;

  @JoinColumn({ name: "journey_id" })
  @ManyToOne(() => Journey)
  journey?: Journey;

  public build(): ActivityData {
    return {
      created_at: this.created_at,
      id: this.id,
      kind: this.kind,
      journey: this.journey && this.journey.build(),
      user: this.user && this.user.build(),
    };
  }
}
