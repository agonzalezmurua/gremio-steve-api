import consola from "consola";
import inquirer from "inquirer";

import * as Db from "../providers/database";
import { configure as configureDatabase } from "../services/database.configure";
import { deleteNgrams, updateNgrams } from "./batch_operations";

async function askForModel() {
  const { model } = await inquirer.prompt({
    name: "model",
    type: "list",
    loop: true,
    choices: Object.keys(Db).map((name) => {
      return {
        name: name,
      };
    }),
  });
  const Model = Db[model];

  return Model;
}

const options = new Map([
  [
    "update model's ngrams",
    async function () {
      const Model = await askForModel();
      const attributes = Object.keys(Model.schema.paths).filter(
        (k) => !k.endsWith("_fuzzy")
      );
      await updateNgrams(Model, attributes);
    },
  ],
  [
    "delete model's ngrams",
    async function () {
      const Model = await askForModel();
      const fuzzyAttributes = Object.keys(Model.schema.paths).filter((k) =>
        k.endsWith("_fuzzy")
      );
      await deleteNgrams(Model, fuzzyAttributes);
    },
  ],
  [
    "quit",
    async function () {
      consola.success("bye bye!");
    },
  ],
]);

async function menu() {
  await configureDatabase();
  let input = null;

  do {
    const output = await inquirer.prompt({
      name: "answer",
      type: "list",
      message: "Choice an option",
      choices: Array.from(options.keys()),
    });

    input = output.answer;

    await options.get(input)();
  } while (input !== "quit");

  process.exit(0);
}

menu();
