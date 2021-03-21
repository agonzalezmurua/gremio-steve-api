import {
  Entity,
  Column,
  OneToMany,
  ObjectIdColumn,
  PrimaryColumn,
} from "typeorm";
import { Journey } from "_/modules/journeys/model";

import { UserRole } from "../types/user-role";
import { UserData } from "./user.data";

@Entity("users")
export class User {
  @PrimaryColumn()
  id: number;

  @Column()
  osu_id: string;

  @Column()
  name: string;

  @Column({ default: true })
  active: boolean;

  @Column()
  avatar_url: string;

  @Column()
  banner_url?: string;

  @OneToMany(() => Journey, (user) => user.organizer)
  journeys: Journey[];

  // @Column()
  // availability: IAvailability;

  @Column()
  community_role: string;

  @Column()
  role: UserRole;

  // @Column()
  // preferences: IUserPreferences;

  // @Column()
  // status: UserStatus;

  @Column()
  description?: string;

  @Column()
  email: string;

  @Column()
  token_version: string;

  // @Column()
  // notification_preferences: IUserNotificationPreferences;

  @OneToMany(() => User, (user) => user.id)
  follows: string[];

  public build(): UserData {
    return {
      id: this.id,
      name: this.name,
      osu_id: this.osu_id,
    };
  }
}
