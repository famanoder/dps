const path = require('path');
const fs = require('fs');
const chalk = require('chalk');

function log() {
  console.log.apply(console, arguments);
}
log.error = function(msg) {
  log(chalk.red(msg));
  process.exit(0);
}
log.info = function(msg) {
  log(chalk.blue(msg));
}
exports.log = log;

exports.formatUrl = function(url) {
  if(!/^https?:\/\//.test(url)) {
    let locUrl = path.resolve(process.cwd(), url);
    console.log(process.cwd());
    if(!fs.existsSync(locUrl)) {
      log.error(`Protocol error: invalid entry("${ url }")`);
    }else{
      return `file://${ locUrl }`;
    }
  }
  return url;
}