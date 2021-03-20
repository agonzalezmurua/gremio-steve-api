import config from "config";

type Configuration = typeof import("~/config/default.json");

export class ConfigProvider {
  public get config(): Configuration {
    return config.get("");
  }
}
