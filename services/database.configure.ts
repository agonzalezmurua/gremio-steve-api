import consola from "consola";
import mongoose = require("mongoose");
import colors = require("colors");
import config = require("config");
import format from "string-format";

import prefixes from "_/constants/consola.prefixes";

/**
 * Creates initial configuration and connects to the database
 */
export async function configure(): Promise<void> {
  const template = config.get("database.connection_string");
  const connectionString = format(template, {
    config: config.get("database"),
    env: {
      username: process.env.DATABASE_USERNAME,
      password: process.env.DATABASE_PASSWORD,
    },
  });
  try {
    consola.debug(
      prefixes.database,
      "Using string connection",
      colors.yellow(connectionString)
    );
    consola.debug(prefixes.database, "Attempting to connect to database");

    await mongoose.connect(connectionString, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useFindAndModify: false,
      useCreateIndex: true,
    });

    if (process.env.MIGRATING) {
      consola.warn(
        prefixes.database,
        "Running mongoose schemas with static set to false!"
      );
    }

    consola.success(prefixes.database, "Database has connected");
  } catch (error) {
    consola.error(prefixes.database, "Database failed to connect", error);
    throw error;
  }
}

export default mongoose;
