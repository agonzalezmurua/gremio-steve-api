import { HttpService, Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PassportStrategy } from "@nestjs/passport";
import { Strategy } from "passport-oauth2";
import querystring = require("querystring");
import { LoggerService } from "../common/services/logger.service";
import { User } from "../users/models";
import { UsersService } from "../users/users.service";

import { AuthService } from "./auth.service";

@Injectable()
export class OsuStrategy extends PassportStrategy(Strategy, "osu") {
  constructor(
    private http: HttpService,
    private config: ConfigService,
    private authService: AuthService,
    private logger: LoggerService,
    private usersService: UsersService
  ) {
    super({
      authorizationURL:
        process.env.OSU_AUTH_AUTHORIZATION_URL +
        "?" +
        querystring.encode({
          client_id: process.env.OSU_CLIENT_ID,
          redirect_uri: process.env.OSU_CALLBACK_URL,
          response_type: "code",
          scope: "public",
        }),
      clientID: process.env.OSU_CLIENT_ID,
      clientSecret: process.env.OSU_CLIENT_SECRET,
      callbackURL: process.env.OSU_AUTH_CALLBACKURL,
      scope: "public",
      tokenURL: process.env.OSU_AUTH_TOKEN_URL,
    });
  }

  async validate(acessToken: string): Promise<unknown> {
    const { data } = await this.http
      .get("/me", {
        baseURL: this.config.get("osu.url"),
        headers: {
          Authorization: `Bearer ${acessToken}`,
        },
      })
      .toPromise();

    let user: User = await this.authService.findUserFromOsuById(data.id);

    if (!user) {
      this.logger.info("Creating", data.username, "with id", data.id);
      user = await this.usersService.create({
        osu_id: data.id,
        name: data.username,
        avatar_url: data.avatar_url,
        banner_url: data.cover_url,
      });
    }

    return user;
  }
}
