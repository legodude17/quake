#! /usr/bin/node
"use strict";
const create = require('.');
const program = require('commander');
const chalk = require('chalk');
const path = require('path');
const logSymbols = require('log-symbols');
const fs = require('fs');
const filesToLookFor = ['Quakefile.js', 'quakefile.js', 'Taskfile.js', 'taskfile.js']
program
  .version(require('./package.json').version)
  .usage('[task] [options]')
  .option('--file <file>', 'Use <file> for task running.')
  .option('-f, --force', 'Force continuation after error.');
program.parse(process.argv);
function findFile() {
  if (program.file) {
    var file = path.join(process.cwd(), program.file);
    if (fs.existsSync(file)) {
      return {result: file, func: require(file)};
    }
    exit('Could not find file ' + chalk.red(file));
  } else {
    var res = filesToLookFor.map(function (v) {
      return path.join(process.cwd(), v);
    }).map(fs.existsSync).reduce(function (res, v, i) {
      if (res) {
        return res;
      }
      if (v) {
        return filesToLookFor[i];
      }
      return false;
    }, false);
    if (res) {
      return {result: res, func: require(res)};
    }
    exit('Could not find task file. Specify with ' + chalk.yellow('--file') + ' or name it one of ' + chalk.yellow(filesToLookFor.slice(0, filesToLookFor.length - 1).concat('or ' + filesToLookFor[filesToLookFor.length - 1]).join(', ')));
  }
}
var {func, result} = findFile();
if (typeof func !== 'function') {
  exit('Export of task file ' + chalk.yellow(result) + ' is not a function.');
}
var quake = create();
func(quake.passer);
quake._start(program.args[0] || 'default');
function exit(message) {
  if (message) {
    console.error(logSymbols.error + '  ' + message);
    process.exit(1);
    return;
  }
  process.exit(0);
}
