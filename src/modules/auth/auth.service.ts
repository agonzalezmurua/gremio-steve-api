import { Injectable, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { LoggerService } from "../common/services/logger.service";
import { User, UserCreateInput } from "../users/models";

import { UsersService } from "../users/users.service";
import { AuthProviders } from "./types/AuthProviders";
import { AuthPayload } from "./model/AuthPayload";
import { JwtPayload } from "./types/JwtPayload";

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

  async register(input: UserCreateInput): Promise<User> {
    this.logger.info("Creating", input.name, "with id", input.osu_id);

    return await this.usersService.createOne(input);
  }

  async login(id: number, provider: AuthProviders): Promise<AuthPayload> {
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

    const authResponse = new AuthPayload();

    const payload: JwtPayload = {
      avatar_url: user.avatar_url,
      banner_url: user.banner_url,
      id: user.id,
      name: user.name,
      osu_id: user.osu_id,
    };

    authResponse.access_token = this.jwtService.sign(payload);
    authResponse.expires_in = 1000 * 60 * 60 * 24;
    authResponse.token_type = "Bearer";

    return authResponse;
  }
}
