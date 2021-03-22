import {
  Controller,
  Get,
  HttpService,
  HttpStatus,
  Query,
  Req,
  Res,
  UseGuards,
} from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { ApiResponse, ApiTags } from "@nestjs/swagger";
import { AuthService } from "./auth.service";
import { AuthPayload } from "./model/AuthPayload";
import { OsuAuthGuard } from "./osu-auth.guard";
import { AuthProviders } from "./types/AuthProviders";

@ApiTags("auth")
@Controller("auth")
export class AuthController {
  constructor(private authService: AuthService) {}

  @UseGuards(OsuAuthGuard)
  @Get("osu")
  @ApiResponse({ status: HttpStatus.TEMPORARY_REDIRECT })
  async osuLogin(): Promise<void> {
    // initiates the Osu OAuth2 login flow
  }

  @UseGuards(OsuAuthGuard)
  @Get("osu/callback")
  @ApiResponse({ status: HttpStatus.OK, type: AuthPayload })
  async osuLoginCallback(
    @Query("code") code: string,
    @Req() req
  ): Promise<AuthPayload> {
    return await this.authService.login(req.user.osu_id, AuthProviders.OSU);
  }
}
