import { ApiProperty } from "@nestjs/swagger";

export class AuthPayload {
  @ApiProperty({ example: "Bearer" })
  token_type: "Bearer";

  @ApiProperty({
    example:
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MX0.fhc3wykrAnRpcKApKhXiahxaOe8PSHatad31NuIZ0Zg",
  })
  access_token: string;

  @ApiProperty({ example: 86400 })
  expires_in: number;
}
