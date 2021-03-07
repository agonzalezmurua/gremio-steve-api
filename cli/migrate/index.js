/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable no-undef */

const yargs = require("yargs/yargs");
const { hideBin } = require("yargs/helpers");
const { exec, execSync } = require("child_process");
const consola = require("consola");

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
      const command = `npx migrate ${flatArguments} create ${args.name}`;
      execSync(command, { stdio: "inherit" });
    }
  )
  .command(
    "up [name]",
    "Migrate up to a given migration",
    (yargs) =>
      yargs.positional("name", {
        default: "",
        describe: "title of the migration",
        type: "string",
      }),
    (yargs) => {
      const flatArguments = flattenArguments();
      const command = `npx migrate ${flatArguments} up ${yargs.name}`;
      execSync(command, { stdio: "inherit" });
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
    (yargs) => {
      const flatArguments = flattenArguments();
      const command = `npx migrate ${flatArguments} down ${yargs.name}`;
      execSync(command, { stdio: "inherit" });
    }
  ).argv;
