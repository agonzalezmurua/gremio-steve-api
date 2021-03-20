import { Controller, Get, Req, UseGuards } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { ApiTags } from "@nestjs/swagger";
import { Request } from "express";

@ApiTags("auth")
@Controller("auth")
export class AuthController {
  @Get("osu")
  @UseGuards(AuthGuard("osu"))
  async getUserFromOsuLogin(@Req() request: Request): Promise<Express.User> {
    return request.user;
  }
}
