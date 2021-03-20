import { Column } from "typeorm";

export class CoversEntity {
  @Column()
  thumbnail: string;

  @Column()
  banner: string;
}
