import axios from "axios";
import consola from "consola";
import config from "config";
import { encode } from "querystring";
import { NextFunction, Request, Response } from "express";
import format from "string-format";
import {
  ApiOperationGet,
  ApiOperationPost,
  ApiPath,
  SwaggerDefinitionConstant,
} from "swagger-express-ts";

import prefixes from "_/constants/consola.prefixes";
import UserMongoose from "_/controllers/mongo/user";
import { UnauthorizedError } from "_/utils/errors";

import { sendAuthenticationToken } from "_/services/internal/auth/identity";
import {
  sendRefreshTokenCookie,
  validateRefreshToken,
  getRefreshTokenCookie,
} from "_/services/internal/auth/refresh";

import { Steve } from "_/types/steve-api";

const redirect_uri = format(
  config.get("web.auth_redirect_url"),
  config.get("web")
);

@ApiPath({
  name: "Authentication",
  path: "/auth",
})
class AuthController {
  @ApiOperationGet({
    path: "/osu",
    description: "Redirects to osu oauth flow",
    responses: {
      301: {
        description: "Redirects to oauth service",
      },
    },
  })
  public requestAuthorization(
    req: Request<unknown, unknown, unknown, { state?: string }>,
    res: Response
  ) {
    const parameters: { [key: string]: string } = {
      client_id: process.env.OSU_API_CLIENTID, // The Client ID you received when you registered
      redirect_uri: redirect_uri, // The URL in your application where users will be sent after authorization. This must match the registered Application Callback URL exactly.
      response_type: "code", // This should always be code when requesting authorization.
      scope: ["identify"].join(" "), // A space-delimited string of scopes.
    };

    if (req.query.state) {
      parameters.state = req.query.state;
    }

    const url = new URL(format(config.get("osu.auth_url"), config.get("osu")));

    Object.entries(parameters).forEach(([name, value]) => {
      url.searchParams.append(name, value);
    });
    res.redirect(url.toString());
  }

  /**
   * Send request to osu in order to retrieve some the osu user's information,
   * creating the user document if not present or updating it
   *
   * @param req
   * @param res
   */
  @ApiOperationPost({
    path: "/osu/callback",
    parameters: {
      body: {
        name: "authentication",
        type: SwaggerDefinitionConstant.OBJECT,
        properties: {
          code: {
            type: SwaggerDefinitionConstant.STRING,
          },
        },
      },
    },
    responses: {
      200: {
        description: "Bearer token response",
        model: "Authentication.Response",
      },
    },
  })
  public authenticateUser(
    req: Request<unknown, unknown, { authentication: { code: string } }>,
    res: Response<Steve.AuthenticationResponse>
  ) {
    /** Isolated axios instance, for this request only */
    const client = axios.create({
      baseURL: config.get("osu.base_url"),
    });

    consola.debug(prefixes.oauth_osu, "sending oauth code to api");

    // Request to external osu service to attempt to authenticate and retrieve
    // - osu id
    // - user email
    client
      .post(
        "/oauth/token",
        // Auth request payload
        encode({
          code: req.body.authentication.code, //The code you received.
          client_id: process.env.OSU_API_CLIENTID, // The client ID of the application.
          client_secret: process.env.OSU_API_CLIENT_SECRET, //	The client secret of the application.
          grant_type: "authorization_code", //	This must always be "authorization_code"
          redirect_uri: redirect_uri, //	The configured URL where users will be sent after authorization.
        })
      )
      .then(async ({ data: { token_type, access_token } }) => {
        consola.debug(
          prefixes.oauth_osu,
          "adding interceptor for further requests"
        );
        // Add interceptor for further requests that uses the provided access token
        client.interceptors.request.use((config) => {
          config.headers = {
            common: { Authorization: `${token_type} ${access_token}` },
          };
          return config;
        });

        consola.debug(prefixes.oauth_osu, "obtaining user information");

        // osu's user information
        const { data: me } = await client.get(
          `${config.get("osu.api.path")}/me`
        );

        consola.debug(prefixes.oauth_osu, "revoking osu token");

        // Since we are only using the token to obtain the user's info\
        // We revoke the token to prevent further accidental actions
        await client.delete(
          `${config.get("osu.api.path")}/oauth/tokens/current`
        );

        consola.debug(prefixes.oauth_osu, "retrieving user from database");

        let user = await UserMongoose.findOne({ osu_id: me.id }).exec();

        // Create user document if it doesn't exist
        if (!user) {
          consola.debug(prefixes.oauth_osu, "user does not exist, creating");
          user = new UserMongoose();
        }

        // Update the user
        user = Object.assign(user, {
          osu_id: me.id,
          name: me.username,
          avatar_url: me.avatar_url,
          banner_url: me.custom_url || me.cover.url,
        });
        await user.save();

        consola.debug(
          prefixes.oauth_osu,
          "issuing authentication and refresh tokens"
        );

        await sendRefreshTokenCookie(res, user).catch((error) =>
          consola.error(prefixes.oauth, "failed to send refresh token", error)
        );

        sendAuthenticationToken(res, user);
      })
      .catch((error) => {
        consola.error(prefixes.oauth, "failed to authenticate", error);
        res.status(error.response ? error.response.status : 500);
        res.json(error.response ? error.response.data : null);
      });
  }

  @ApiOperationGet({
    path: "/refresh",
    responses: {
      200: {
        description:
          "Given a refresh token, as valid refresh_token, emits a new access token",
        model: "Authentication.Response",
      },
    },
  })
  public refresh(req: Request, res: Response, next: NextFunction) {
    const token_id = getRefreshTokenCookie(req);

    validateRefreshToken(token_id)
      .then((user) => {
        sendAuthenticationToken(res, user);
      })
      .catch((error) => {
        consola.error(prefixes.oauth, error);
        res.status(401);
        next(new UnauthorizedError());
      });
  }
}

export default new AuthController();
