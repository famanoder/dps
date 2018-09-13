#!/usr/bin/env node

const program = require('commander')
const prompts = require('prompts')
const path = require('path')
const fs = require('fs')
const pkg = require('../package.json')
const defConf = require('./default.config')
const DrawPageStructure = require('../src')
const utils = require('../src/utils')

    program
    .version(pkg.version)
    .usage('DPS <command> [options]')
    .option('-v, --version', 'latest version');

    program
    .command('init')
    .description('create a default drawPageStructure.config.js file')
    .action(function(env, options) {
        askForConfig().then(ans => {
            const outputPath = path.resolve(process.cwd(), ans.filepath)
            prompts({
                type: 'toggle',
                name: 'value',
                message: `Are you sure to create skeleton screen base on ${ans.url}. \n and will output to ${utils.calcText(outputPath)}`,
                initial: true,
                active: 'Yes',
                inactive: 'no'
            }).then(res => {
                if(res.value) {
                    fs.writeFile(
                        path.resolve(process.cwd(), defConf.filename), 
                        defConf.getTemplate({
                            url: ans.url,
                            filepath: outputPath
                        }),
                        err => {
                            if(err) throw err;
                            console.log(`\n[${defConf.filename}] has been created! now, you can edit it and then run 'DPS start'\n`)
                        }
                    )
                }
            })
        });
    });

    program
    .command('start')
    .description('start create a skeleton screen')
    .action(function() {
        const dpsConfFile = path.resolve(process.cwd(), defConf.filename)
        if(!fs.existsSync(dpsConfFile)) {
            utils.log.error(`please run 'dps init' to initial a config file`, 1)
        }
        new DrawPageStructure(require(dpsConfFile)).start()
    });

    program.parse(process.argv);

function askForConfig() {
    const questions = [
        {
            type: 'text',
            name: 'url',
            message: "What's your page url ?",
            validate: function(value) {
                const urlReg = /^https?:\/\/.+/ig;
                if (urlReg.test(value)) {
                  return true;
                }
          
                return 'Please enter a valid url';
            }
        },
        {
            type: 'text',
            name: 'filepath',
            message: "Enter a relative output filepath ?",
            validate: function(value) {
                if(!value) {
                    return 'Please enter a filepath'
                }else{
                    return true;
                }
            }
        }
    ];
    return prompts(questions);
}

