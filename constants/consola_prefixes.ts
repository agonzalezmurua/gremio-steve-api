import colors = require("colors");

/**
 * Prefix labels to ad more clarity to consola outputs
 */
const prefixes = {
  osu: colors.magenta("[OSU]"),
  app: colors.cyan("[APP]"),
  database: colors.green(`[DBM]`),
  oauth: colors.cyan("[OAUTH]"),
  get oauth_osu(): string {
    return `${this.oauth}${this.osu}`;
  },
};

export default prefixes;
