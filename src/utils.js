const chalk = require('chalk');
const ora = require('ora');
const emoji = require('node-emoji');

const likeLinux =  process.env.TERM === 'cygwin' || process.platform !== 'win32';

function calcText(str) {
  if(str.length > 40) {
      return str.slice(0, 15) + '...' + (str.match(/([\/\\][^\/\\]+)$/) || ['', ''])[1];
  }
  return str;
}

function log() {
  console.log.apply(console, arguments);
}

log.error = function(msg, exit) {
  log(chalk.gray(`[dps]:`, chalk.red(msg)));
  exit && process.exit(0);
}

log.info = function(msg) {
  log(chalk.greenBright(msg));
}

exports.log = log;
exports.calcText = calcText;
exports.getAgrType = function(agr) {
  return Object.prototype.toString.call(agr).split(/\s/)[1].slice(0, -1).toLowerCase();
}
exports.Spinner = function(color) {
  let opt = likeLinux? {
    spinner: {
      "interval": 125,
      "frames": [
        "∙∙∙",
        "●∙∙",
        "∙●∙",
        "∙∙●",
        "∙∙∙"
      ]
    }
  }: '';
  const spinner = ora(opt).start();
  spinner.color = color;
  return spinner;
}

const emoji_get = emoji.get.bind(emoji);
emoji.get = function() {
  return !likeLinux? '·': emoji_get.apply(emoji, arguments);
}

exports.emoji = emoji;

exports.toBase64 = function(str) {
  return Buffer.from(str).toString('base64');
}