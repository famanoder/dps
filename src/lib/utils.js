const chalk = require('chalk');

function log() {
  console.log.apply(console, arguments);
}
log.error = function(msg, exit) {
  log(chalk.red(msg));
  exit && process.exit(0);
}
log.info = function(msg) {
  log(chalk.greenBright(msg));
}
exports.log = log;
exports.getAgrType = function(agr) {
  return Object.prototype.toString.call(agr).split(/\s/)[1].slice(0, -1).toLowerCase();
}

