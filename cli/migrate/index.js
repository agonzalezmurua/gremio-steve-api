/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable no-undef */

const yargs = require("yargs/yargs");
const { hideBin } = require("yargs/helpers");
const { execSync } = require("child_process");

function flattenArguments(dynamic) {
  return Object.entries(
    Object.assign(
      {},
      {
        "migrations-dir": "migrations",
        compiler: "ts:./cli/migrate/ts-compiler.js",
      },
      dynamic
    )
  )
    .map(([key, value]) => `--${key}="${value}"`)
    .join(" ");
}

yargs(hideBin(process.argv))
  .command(
    "create <name>",
    "Create a new migration",
    (yargs) =>
      yargs.positional("name", {
        describe: "title of the migration",
        type: "string",
      }),
    (args) => {
      const flatArguments = flattenArguments({
        "template-file": "./cli/migrate/template.ts",
      });
      const command = `migrate ${flatArguments} create ${args.name}`;
      execSync(command);
    }
  )
  .command(
    "up [name]",
    "Migrate up to a given migration",
    (yargs) =>
      yargs.positional("name", {
        describe: "title of the migration",
        type: "string",
      }),
    () => {
      const flatArguments = flattenArguments();
      const command = `migrate ${flatArguments} up`;
      execSync(command);
    }
  )
  .command(
    "down [name]",
    "Migrate down to a given migration",
    (yargs) =>
      yargs.positional("name", {
        describe: "title of the migration",
        type: "string",
      }),
    () => {
      const flatArguments = flattenArguments();
      const command = `migrate ${flatArguments} down`;
      execSync(command);
    }
  ).argv;
