/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable no-undef */

const { exec } = require("child_process");

const argv = [];
// first entry is the executable, second one is the script, we are interested only on the extra aguments
const [, , ...inputArgv] = process.argv;

const staticArgv = Object.entries({
  "migration-dir": "migrations",
  compiler: "ts:./utils/cli/migrate/ts-compiler.js",
}).map(([key, value]) => `--${key}="${value}"`);

argv.push(...staticArgv, ...inputArgv);

exec(`migrate ${argv.join(" ")}`, function (error, stdout, stderr) {
  if (error) {
    console.error(`exec error: ${error}`);
    return;
  }
  console.log(`stdout: ${stdout}`);
  console.error(`stderr: ${stderr}`);
});
