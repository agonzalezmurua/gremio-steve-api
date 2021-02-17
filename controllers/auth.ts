import axios from "axios";
import consola from "consola";
import config from "config";
import { encode } from "querystring";
import { Request, Response } from "express";
import format from "string-format";
import {
  ApiOperationGet,
  ApiOperationPost,
  ApiPath,
  SwaggerDefinitionConstant,
} from "swagger-express-ts";

import prefixes from "_/constants/consola.prefixes";
import { UserMongooseModel } from "./users";
import { issueAuthentication } from "_/services/oauth/authentication";
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
    const client = axios.create({
      baseURL: config.get("osu.base_url"),
    });
    const {
      authentication: { code },
    } = req.body;
    const payload = {
      code: code, //The code you received.
      client_id: process.env.OSU_API_CLIENTID, // The client ID of your application.
      client_secret: process.env.OSU_API_CLIENT_SECRET, //	The client secret of your application.
      grant_type: "authorization_code", //	This must always be authorization_code
      redirect_uri: redirect_uri, //	The URL in your application where users will be sent after authorization.
    };
    consola.debug(prefixes.oauth_osu, "sending oauth code to api");
    client
      .post("/oauth/token", encode(payload))
      .then(async ({ data: { token_type, access_token } }) => {
        consola.debug(
          prefixes.oauth_osu,
          "adding interceptor for further requests"
        );
        // Add interceptor for further requests
        client.interceptors.request.use((config) => {
          config.headers = {
            common: { Authorization: `${token_type} ${access_token}` },
          };
          return config;
        });
        consola.debug(prefixes.oauth_osu, "obtaining user information");
        const { data: me } = await client.get(
          `${config.get("osu.api.path")}/me`
        );
        // Revoke current token to prevent further accidental usage
        consola.debug(prefixes.oauth_osu, "revoking osu token");
        await client.delete(
          `${config.get("osu.api.path")}/oauth/tokens/current`
        );
        consola.debug(prefixes.oauth_osu, "retrieving user from database");
        let user = await UserMongooseModel.findOne({ osu_id: me.id }).exec();
        if (!user) {
          consola.debug(prefixes.oauth_osu, "user does not exist, creating");
          user = new UserMongooseModel();
        }
        user = Object.assign(user, {
          osu_id: me.id,
          name: me.username,
          avatar_url: me.avatar_url,
          banner_url: me.custom_url || me.cover.url,
        });
        await user.save();
        consola.debug(prefixes.oauth_osu, "issuing authentication token");
        res.json(
          issueAuthentication({
            id: user.id,
            osu_id: user.osu_id,
            avatar_url: user.avatar_url,
            name: user.name,
          })
        );
      })
      .catch((error) => {
        consola.error(error);
        res.status(error.response ? error.response.status : 500);
        res.json(error.response ? error.response.data : null);
      });
  }
}

export default new AuthController();
