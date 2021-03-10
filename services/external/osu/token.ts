import axios from "axios";
import { encode } from "querystring";
import config = require("config");
import prefixes from "_/constants/consola.prefixes";
import { OsuClient } from "_/services/osu.configure";
import consola from "consola";

const oauth = axios.create({
  baseURL: config.get("osu.base_url"),
});

let headerInterceptor;

/**
 * Does the Grant Code authentication token retrieval from the osu service
 */
export async function fetchToken(): Promise<string> {
  return oauth
    .post(
      "/oauth/token",
      encode({
        client_id: process.env.OSU_API_CLIENTID,
        client_secret: process.env.OSU_API_CLIENT_SECRET,
        grant_type: "client_credentials",
        scope: "public",
      })
    )
    .then((response) => {
      const {
        data: { token_type, access_token },
      } = response;
      const bearerToken = `${token_type} ${access_token}`;
      return bearerToken;
    })
    .catch((error) => {
      consola.error(prefixes.osu, "Failed to fetch new bearer token", error);
      throw error;
    });
}

/**
 * Sets an interceptor for osu axios client instance that maps the
 * Authorization header to every request
 *
 * @param authorization Authorization token
 * @returns Interceptor's id
 */
export function setAuthorizationHeaderInterceptor(
  authorization: string
): number {
  return OsuClient.interceptors.request.use(function (config) {
    config.headers = {
      common: {
        Authorization: authorization,
      },
    };
    return config;
  });
}

/**
 * Sets a respone interceptor that evaluates when the given token has expired
 * and retrieves a new interceptor / token
 *
 * @param previousRequestInterceptor Request interceptor's id
 * @returns Interceptor's id
 */
export function setExpiredTokenInterceptor(): void {
  headerInterceptor = OsuClient.interceptors.response.use(
    (response) => response,
    (error) => {
      if (error.response.status === 401) {
        consola.debug(
          prefixes.osu,
          "Request's headers: ",
          error.request.headers
        );
        consola.debug(
          prefixes.osu,
          "Request errored with status",
          error.response.status
        );
        consola.debug(prefixes.osu, "Discarding original request interceptor");

        OsuClient.interceptors.request.eject(headerInterceptor);

        consola.debug(prefixes.osu, "Attempting to get new bearer token");

        return fetchToken().then((authorization) => {
          // Ovewrite interceptor with new one
          headerInterceptor = setAuthorizationHeaderInterceptor(
            headerInterceptor
          );
          error.config.headers.Authorization = authorization;

          consola.debug(prefixes.osu, "retrying request");
          return OsuClient.request(error.config);
        });
      }
    }
  );
  consola.debug(prefixes.osu, "Expired token interceptor registered");
}

export default async function configure(): Promise<void> {
  consola.success(prefixes.osu, "Oauth succesfully configured");
  setExpiredTokenInterceptor();
}
