import { Entity, Column, OneToMany, ObjectIdColumn } from "typeorm";
import {
  IAvailability,
  IUser,
  IUserNotificationPreferences,
  IUserPreferences,
  UserRole,
  UserStatus,
} from "./interfaces/user.interface";

@Entity("users")
export class User implements IUser {
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

  @Column()
  availability: IAvailability;

  @Column()
  community_role: string;

  @Column()
  role: UserRole;

  @Column()
  preferences: IUserPreferences;

  @Column()
  status: UserStatus;

  @Column()
  description?: string;

  @Column()
  email: string;

  @Column()
  token_version: string;

  @Column()
  notification_preferences: IUserNotificationPreferences;

  @OneToMany(() => User, (user) => user.id)
  follows: string[];
}
