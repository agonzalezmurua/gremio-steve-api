import axios from "axios";
import * as colors from "config";
import * as consola from "consola";
import * as config from "config";

import prefixes from "../constants/consola_prefixes";
import configureToken from "./osu/token";

export const client = axios.create({
  baseURL: config.get("osu.base_url"),
});

client.interceptors.response.use(
  (response) => response.data,
  (error) => {
    const method = colors.white.bold(error.request.method);
    const path = colors.white(error.request.path);
    const status = colors.white.bold(error.response.status);
    consola.debug(prefixes.osu, `${method} ${status} - ${path}:`, error);
    Promise.reject(error);
  }
);

/**
 * Configures osu's token managment and interceptors
 */
export async function configure() {
  await configureToken();
}
