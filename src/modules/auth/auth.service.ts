import { Injectable, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { LoggerService } from "../common/services/logger.service";
import { User, UserInput } from "../users/models";

import { UsersService } from "../users/users.service";
import { AuthProviders } from "./types/AuthProviders";
import { AuthResponse } from "./model/AuthResponse";

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private logger: LoggerService
  ) {}

  async findUserFromOsuById(id: number): Promise<User> {
    const user = await this.usersService.findByOsuId(id);
    return user;
  }

  async register(input: UserInput): Promise<User> {
    this.logger.info("Creating", input.name, "with id", input.osu_id);

    return await this.usersService.create(input);
  }

  async issueAuthResponse(
    id: number,
    provider: AuthProviders
  ): Promise<AuthResponse> {
    let user: User;
    switch (provider) {
      case AuthProviders.OSU:
        user = await this.usersService.findByOsuId(id);
        break;
      default:
        break;
    }

    if (!user) {
      throw new UnauthorizedException();
    }

    const authResponse = new AuthResponse();
    authResponse.access_token = this.jwtService.sign(user.build());
    authResponse.expires_in = 1000 * 60 * 60 * 24;
    authResponse.token_type = "Bearer";
    authResponse.refresh_token = "";

    return authResponse;
  }
}
