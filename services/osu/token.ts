import axios from "axios";
import { encode } from "querystring";
import * as config from "config";
import prefixes from "../../constants/consola_prefixes";
import { client } from "../osu.configure";
import * as consola from "consola";

const oauth = axios.create({
  baseURL: config.get("osu.base_url"),
});

/**
 * Does the Grant Code authentication token retrieval from the osu service
 *
 * @returns {Promise<string>}
 */
export async function fetchToken() {
  return oauth
    .post(
      "/oauth/token",
      encode({
        client_id: config.get("osu.api.client_id"),
        client_secret: process.env.OSU_API_SECRET,
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
 * @param {string} authorization Authorization token
 * @returns {number} Interceptor's id
 */
export function setAuthorizationHeaderInterceptor(authorization) {
  return client.interceptors.request.use(function (config) {
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
 * @param {number} previousRequestInterceptor Request interceptor's id
 */
export function setExpiredTokenInterceptor(previousRequestInterceptor) {
  let requestInterceptor = previousRequestInterceptor;
  const responseInterceptor = client.interceptors.response.use(
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

        client.interceptors.request.eject(requestInterceptor);

        consola.debug(prefixes.osu, "Attempting to get new bearer token");

        return fetchToken().then((authorization) => {
          // Ovewrite interceptor with new one
          requestInterceptor = setAuthorizationHeaderInterceptor(authorization);
          error.config.headers.Authorization = authorization;

          consola.debug(prefixes.osu, "retrying request");
          return client.request(error.config);
        });
      }
    }
  );
  consola.debug(prefixes.osu, "Expired token interceptor registered");
  return responseInterceptor;
}

export default async function configure() {
  consola.debug(prefixes.osu, "Starting internal client token configuration");
  const authorization = await fetchToken();
  consola.debug(prefixes.osu, "Bearer token fetched");

  const preRequestInterceptor = setAuthorizationHeaderInterceptor(
    authorization
  );

  consola.success(prefixes.osu, "Oauth succesfully configured");
  setExpiredTokenInterceptor(preRequestInterceptor);
}
