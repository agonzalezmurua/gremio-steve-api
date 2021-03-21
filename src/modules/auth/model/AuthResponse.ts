import { ApiProperty } from "@nestjs/swagger";

export class AuthResponse {
  @ApiProperty()
  token_type: "Bearer";

  @ApiProperty()
  access_token: string;

  @ApiProperty()
  expires_in: number;

  @ApiProperty({ nullable: true })
  refresh_token: string;
}
