import config = require("config");
import { OsuClient } from "_/services/osu.configure";

export default {
  beatmapset: {
    findById: (id): Promise<unknown> =>
      OsuClient.get(`${config.get("osu.api.path")}/beatmapsets/${id}`),
  },
};
