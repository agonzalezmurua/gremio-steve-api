//
// The purpose of this module is to let migrate utilize typescript as a compiler
//

/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable no-undef */

const tsNode = require("ts-node");
require("tsconfig-paths/register");

module.exports = tsNode.register;
