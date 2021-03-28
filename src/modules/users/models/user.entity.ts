import {
  Entity,
  Column,
  OneToMany,
  PrimaryGeneratedColumn,
  Unique,
  JoinTable,
  ManyToMany,
  JoinColumn,
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

  @Column({ type: "boolean", default: true })
  is_available: boolean;

  @Column({ default: UserRole.USER })
  role: UserRole;

  @Column({ default: "" })
  description: string;

  @Column({ default: "" })
  email: string;

  @JoinTable()
  @ManyToMany(() => Journey, (Journey) => Journey.id)
  queue: Journey[];

  @JoinTable()
  @ManyToMany(() => User, (User) => User.followers)
  following: User[];

  @JoinTable()
  @ManyToMany(() => User, (User) => User.following)
  followers: User[];

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
