import {
  IsNotEmpty,
  IsString,
  IsOptional,
  MinLength,
  MaxLength,
  IsEmail,
} from "class-validator";

export class UserCreateInput {
  public readonly osu_id: number;

  @IsNotEmpty()
  @MinLength(4)
  @MaxLength(50)
  public readonly name: string;

  @IsOptional()
  @IsString()
  @MaxLength(255)
  public readonly avatar_url?: string;

  @IsOptional()
  @IsString()
  @MaxLength(255)
  public readonly banner_url?: string;

  @IsOptional()
  @IsEmail()
  public readonly email?: string;
}
