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
import { AuthResponse } from "./model/AuthResponse";
import { AuthProviders } from "./types/AuthProviders";

@ApiTags("auth")
@Controller("auth")
export class AuthController {
  constructor(private authService: AuthService) {}

  @Get("osu")
  @UseGuards(AuthGuard("osu"))
  @ApiResponse({ status: HttpStatus.TEMPORARY_REDIRECT })
  async osuLogin(): Promise<void> {
    // initiates the Osu OAuth2 login flow
  }

  @Get("osu/callback")
  @UseGuards(AuthGuard("osu"))
  @ApiResponse({ status: HttpStatus.OK, type: AuthResponse })
  async osuLoginCallback(
    @Query("code") code: string,
    @Req() req
  ): Promise<AuthResponse> {
    return await this.authService.issueAuthResponse(
      req.user.osu_id,
      AuthProviders.OSU
    );
  }
}
