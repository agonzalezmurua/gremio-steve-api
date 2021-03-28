import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import { Journey } from "_/modules/journeys/model";
import { User } from "_/modules/users/models";

import { ActivityKind } from "../types/ActivityKind";
import { ActivityInterface } from "../types/ActivityInterface";
import { ActivityData } from "./activity.data";

@Entity("activity")
export class Activity implements ActivityInterface {
  @PrimaryGeneratedColumn()
  readonly id: number;

  @CreateDateColumn({ name: "created_at" })
  readonly created_at: Date;

  @UpdateDateColumn({ name: "updated_at" })
  readonly updated_at: Date;

  @Column()
  kind: ActivityKind;

  @JoinColumn({ name: "user_id" })
  @ManyToOne(() => User, { eager: true })
  user?: User;

  @JoinColumn({ name: "journey_id" })
  @ManyToOne(() => Journey, { eager: true })
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
