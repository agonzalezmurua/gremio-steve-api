import { HttpService, Inject, Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PassportStrategy } from "@nestjs/passport";
import { Strategy } from "passport-oauth2";
import querystring = require("querystring");

import { AuthService } from "./auth.service";

@Injectable()
export class OsuStrategy extends PassportStrategy(Strategy, "osu") {
  constructor(
    @Inject() private http: HttpService,
    @Inject() private config: ConfigService,
    @Inject() private authService: AuthService
  ) {
    super({
      authorizationURL:
        process.env.OSU_AUTH_AUTHORIZATION_URL +
        querystring.encode({
          client_id: process.env.OSU_CLIENT_ID,
          client_secret: process.env.OSU_CLIENT_SECRET,
          grant_type: "client_credentials",
          scope: "public",
        }),
      clientID: process.env.OSU_CLIENT_ID,
      clientSecret: process.env.OSU_CLIENT_SECRET,
      callbackURL: null,
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

    return this.authService.findUserFromOsuById(data.id);
  }
}
