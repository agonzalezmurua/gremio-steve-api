import config = require("config");
import { client } from "_/services/osu.configure";

export default {
  beatmapset: {
    findById: (id): Promise<unknown> =>
      client.get(`${config.get("osu.api.path")}/beatmapsets/${id}`),
  },
};
