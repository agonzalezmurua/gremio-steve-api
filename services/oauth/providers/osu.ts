import axios from "axios";
import consola from "consola";
import config from "config";
import { encode } from "querystring";

import prefixes from "../../../constants/consola_prefixes";
import User from "../../../providers/database/user";

import { issueAuthentication } from "../authentication";

const redirect_uri = config.get("web.url") + config.get("web.osu_callback");

/**
 * Redirects
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 */
export function requestAuthorization(req, res) {
  const parameters = {
    client_id: config.get("osu.api.client_id"), // The Client ID you received when you registered
    redirect_uri: redirect_uri, // The URL in your application where users will be sent after authorization. This must match the registered Application Callback URL exactly.
    response_type: "code", // This should always be code when requesting authorization.
    scope: ["identify"].join(" "), // A space-delimited string of scopes.
  };

  const path = "/oauth/authorize";
  const url = new URL(path, config.get("osu.base_url"));

  Object.entries(parameters).forEach(([name, value]) => {
    url.searchParams.append(name, value);
  });

  consola.debug("");
  res.redirect(url.toString());
}

/**
 *
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 */
export async function handleAuthentication(req, res) {
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
    const {
      data: { id, username, avatar_url },
    } = await client.get(`${config.get("osu.api.path")}/me`);

    // Revoke current token to prevent further accidental usage
    consola.debug(prefixes.oauth_osu, "revoking osu token");
    await client.delete(`${config.get("osu.api.path")}/oauth/tokens/current`);

    consola.debug(prefixes.oauth_osu, "retrieving user from database");
    let user = await User.findOne({ osu_id: id });

    if (!user) {
      consola.debug(prefixes.oauth_osu, "user does not exist, creating");
      user = new User();
    }

    user = Object.assign(user, { username, avatar_url, osu_id: id });
    await user.save();

    consola.debug(prefixes.oauth_osu, "issuing authentication token");
    res.json(
      issueAuthentication({
        _id: user._id,
        osu_id: user.osu_id,
        avatar_url: user.avatar_url,
        username: user.name,
      })
    );
  } catch (error) {
    consola.error(error);
    res.status(error.response.status);
    res.json(error.response.data);
  }
}
