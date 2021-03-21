import { Controller, Get, HttpStatus, Req, UseGuards } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { ApiResponse, ApiTags } from "@nestjs/swagger";
import { Request } from "express";

@ApiTags("auth")
@Controller("auth")
export class AuthController {
  @UseGuards(AuthGuard("osu"))
  @Get("osu")
  @ApiResponse({ status: HttpStatus.TEMPORARY_REDIRECT })
  async loginWithOsu(@Req() request: Request): Promise<Express.User> {
    return request.user;
  }
}
