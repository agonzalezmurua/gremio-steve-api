import { ApiProperty } from "@nestjs/swagger";
import {
  IsBoolean,
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from "class-validator";

export class UserUpdateInput {
  @ApiProperty({ required: true, minLength: 4, maxLength: 50 })
  @IsNotEmpty()
  @MinLength(4)
  @MaxLength(50)
  public readonly name: string;

  @ApiProperty({ nullable: true, maxLength: 255 })
  @ApiProperty()
  @IsOptional()
  @IsString()
  @MaxLength(255)
  public readonly avatar_url?: string;

  @ApiProperty({ nullable: true, maxLength: 255 })
  @ApiProperty()
  @IsOptional()
  @IsString()
  @MaxLength(255)
  public readonly banner_url?: string;

  @ApiProperty({ nullable: true })
  @ApiProperty()
  @IsOptional()
  @IsEmail()
  public readonly email?: string;

  @ApiProperty({ nullable: true })
  @ApiProperty()
  @IsOptional()
  @IsBoolean()
  public readonly is_available?: boolean;

  @ApiProperty({ nullable: true })
  @IsOptional()
  @IsString()
  @MaxLength(512)
  public readonly description?: string;
}
