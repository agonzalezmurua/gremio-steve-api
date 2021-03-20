import { Entity, Column, OneToMany, ObjectIdColumn } from "typeorm";

import { UserRole } from "../types/user-role";
import { UserData } from "./user.data";

@Entity("users")
export class User {
  @ObjectIdColumn()
  id: string;

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
