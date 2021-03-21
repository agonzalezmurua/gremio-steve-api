import {
  Entity,
  Column,
  OneToMany,
  PrimaryGeneratedColumn,
  Unique,
} from "typeorm";
import { Journey } from "_/modules/journeys/model";

import { UserRole } from "../types/user-role";
import { UserData } from "./user.data";

@Unique(["osu_id"])
@Entity("users")
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  osu_id: number;

  @Column()
  name: string;

  @Column({ default: true })
  active: boolean;

  @Column({ nullable: true })
  avatar_url?: string;

  @Column({ nullable: true })
  banner_url?: string;

  @OneToMany(() => Journey, (user) => user.organizer)
  journeys: Journey[];

  // @Column()
  // availability: IAvailability;

  // @Column({ default: UserRole.USER })
  // community_role: string;

  @Column({ default: UserRole.USER })
  role: UserRole;

  // @Column()
  // preferences: IUserPreferences;

  // @Column()
  // status: UserStatus;

  @Column({ default: "" })
  description?: string;

  @Column({ default: "" })
  email: string;

  // @Column()
  // notification_preferences: IUserNotificationPreferences;

  @OneToMany(() => User, (user) => user.id)
  follows: string[];

  public build(): UserData {
    return {
      id: this.id,
      name: this.name,
      osu_id: this.osu_id,
      avatar_url: this.avatar_url,
      banner_url: this.banner_url,
    };
  }
}
