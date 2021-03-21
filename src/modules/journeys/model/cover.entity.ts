import { ApiProperty } from "@nestjs/swagger";
import { Column, Entity } from "typeorm";

@Entity()
export class Cover {
  @ApiProperty()
  @Column()
  thumbnail: string;

  @ApiProperty()
  @Column()
  banner: string;
}
