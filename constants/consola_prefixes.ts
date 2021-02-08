import * as colors from "colors";

/**
 * Prefix labels to ad more clarity to consola outputs
 */
const prefixes = {
  osu: colors.magenta("[OSU]"),
  app: colors.cyan("[APP]"),
  database: colors.green(`[DBM]`),
  oauth: colors.cyan("[OAUTH]"),
  get oauth_osu() {
    return `${this.oauth}${this.osu}`;
  },
};

export default prefixes;
