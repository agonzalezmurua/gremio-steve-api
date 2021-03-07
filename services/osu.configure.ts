import axios from "axios";
import colors = require("colors");
import consola from "consola";
import config = require("config");

import prefixes from "_/constants/consola.prefixes";
import configureToken from "_/services/external/osu/token";

export const OsuClient = axios.create({
  baseURL: config.get("osu.base_url"),
});

OsuClient.interceptors.response.use(
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
export async function configure(): Promise<void> {
  await configureToken();
}
