#!/usr/bin/env node

const program = require('commander')
const path = require('path')
const fs = require('fs')
const pkg = require('../package.json')

    program
    .version(pkg.version)
    .usage('DPS <command> [options]')
    .option('-v, --version', 'latest version')
    .option('-i, --integer <n>', 'An integer argument', parseInt);

    program
    .command('init')
    .description('create a default drawPageStructure.config.js file')
    .action(function(env, options) {
        fs.writeFile(path.resolve(process.cwd(), ''));
    });

    program.parse(process.argv);
//   console.log('you ordered a pizza', program);
// if (program.integer) console.log('  with sauce');
// else console.log(' without sauce');