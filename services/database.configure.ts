import consola from "consola";
import mongoose from "mongoose";
import colors from "colors";
import config from "config";

import prefixes from "../constants/consola_prefixes";

/**
 * Creates initial configuration and connects to the database
 * @returns {Promise<void>}
 */
export async function configure() {
  const connectionUri = `mongodb://${config.get(
    "database.domain"
  )}/${config.get("database.name")}`;
  try {
    consola.debug(
      prefixes.database,
      "Using string connection",
      colors.yellow(connectionUri)
    );
    consola.debug(prefixes.database, "Attempting to connect to database");

    await mongoose.connect(connectionUri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useFindAndModify: false,
      useCreateIndex: true,
    });

    consola.success(prefixes.database, "Database has connected");
  } catch (error) {
    consola.error(prefixes.database, "Database failed to connect", error);
    throw error;
  }
}

export default mongoose;
