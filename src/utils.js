const chalk = require('chalk');
const ora = require('ora');
const emoji = require('node-emoji');

const {app} = require('../package.json');
const appName = app.alias;

const likeLinux =  process.env.TERM === 'cygwin' || process.platform !== 'win32';

const genArgs = {
  // {name: {type, value}}
  // appName-name-type:value
  prefixName: `${appName}-`,
  create(args) {
    if(getAgrType(args) !== 'object') return;
    return Object.keys(args).map(item => {
      const {type, value} = args[item];
      return `${this.prefixName + item }-${type}:${value}`;
    });
  }
}

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
  log(chalk.gray(`[${appName}]:`, chalk.red(msg)));
  exit && process.exit(0);
}

log.warn = function(msg) {
  log(chalk.yellow(msg));
}

log.info = function(msg) {
  log(chalk.greenBright(msg));
}

function getAgrType(agr) {
  return Object.prototype.toString.call(agr).split(/\s/)[1].slice(0, -1).toLowerCase();
}

function Spinner(color) {
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

exports.log = log;
exports.calcText = calcText;
exports.getAgrType = getAgrType;
exports.Spinner = Spinner;
exports.emoji = emoji;
exports.genArgs = genArgs;

