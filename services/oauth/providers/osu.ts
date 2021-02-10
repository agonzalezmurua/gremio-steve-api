import axios from "axios";
import consola from "consola";
import config from "config";
import { encode } from "querystring";
import { Request, Response } from "express";
import format from "string-format";

import { issueAuthentication } from "../authentication";
import UserController from "../../../controllers/users";
import prefixes from "../../../constants/consola_prefixes";

const redirect_uri = format(
  config.get("web.auth_redirect_url"),
  config.get("web")
);

/** Redirects */
export function requestAuthorization(req: Request, res: Response) {
  const parameters = {
    client_id: config.get("osu.api.client_id"), // The Client ID you received when you registered
    redirect_uri: redirect_uri, // The URL in your application where users will be sent after authorization. This must match the registered Application Callback URL exactly.
    response_type: "code", // This should always be code when requesting authorization.
    scope: ["identify"].join(" "), // A space-delimited string of scopes.
  };

  const url = new URL(format(config.get("osu.auth_url"), config.get("osu")));

  Object.entries(parameters).forEach(([name, value]) => {
    url.searchParams.append(name, value);
  });

  consola.debug("");
  res.redirect(url.toString());
}

/**
 * Request handler that returns a oauth flow response
 */
export async function handleAuthentication(
  req: Request,
  res: Response<{
    token_type: "Bearer";
    expires_in: number;
    access_token: string;
  }>
) {
  const client = axios.create({
    baseURL: config.get("osu.base_url"),
  });
  const { code } = req.body;
  const payload = {
    code: code, //The code you received.
    client_id: config.get("osu.api.client_id"), // The client ID of your application.
    client_secret: process.env.OSU_API_SECRET, //	The client secret of your application.
    grant_type: "authorization_code", //	This must always be authorization_code
    redirect_uri: redirect_uri, //	The URL in your application where users will be sent after authorization.
  };

  try {
    consola.debug(prefixes.oauth_osu, "sending oauth code to api");
    const {
      data: { token_type, access_token },
    } = await client.post("/oauth/token", encode(payload));

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
    const { data: me } = await client.get(`${config.get("osu.api.path")}/me`);
    // Revoke current token to prevent further accidental usage
    consola.debug(prefixes.oauth_osu, "revoking osu token");
    await client.delete(`${config.get("osu.api.path")}/oauth/tokens/current`);

    consola.debug(prefixes.oauth_osu, "retrieving user from database");
    let user = await UserController.model.findOne({ osu_id: me.id }).exec();

    if (!user) {
      consola.debug(prefixes.oauth_osu, "user does not exist, creating");
      user = new UserController.model();
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
  } catch (error) {
    consola.error(error);
    res.status(error.response ? error.response.status : 500);
    res.json(error.response ? error.response.data : null);
  }
}
