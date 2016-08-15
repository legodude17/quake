"use strict";
const O = require('orchestrator');
const TaskDisplayManager = require('./TaskDisplayManager');
const chalk = require('chalk');
const logSymbols = require('log-symbols');
class Quake {
  constructor() {
    this.o = new O();
    this.display = new TaskDisplayManager([]);
    this._initEvents();
    this._createPasser();
  }

  add(name, deps, fn) {
    this.o.add(name, deps, fn);
    this.display.add(name);
  }

  _start(...names) {
    var start = Date.now();
    function defaultCb(err) {
      if (err) {
        console.error(logSymbols.error + '  ' + err.message || err);
        process.exit(1);
      } else {
        var total = Date.now() - start;
        console.log(logSymbols.success, '  Done in a total of about', colorDur((total / 1000).toFixed(2)) + '.');
        process.exit(0);
      }
    }
    if (typeof names[names.length - 1] != 'function') {
      names.push(defaultCb);
    }
    this.o.start(...names);
  }

  _initEvents() {
    this.o.on('task_start', (e) => {
      this.display.run(e.task);
    });
    this.o.on('task_stop', (e) => {
      this.display.succeed(e.task, e.duration);
    });
    this.o.on('task_err', (e) => {
      this.display.fail(e.task, e.duration);
    });
  }

  _createPasser() {
    this.passer = {};
    this.constructor.keysToPass.forEach((v) => {this.passer[v] = this[v].bind(this)});
  }

}
function colorDur(num) {
  if (num < 1) {
    return chalk.green(num + 's');
  }
  if (num < 5) {
    return chalk.yellow(num + 's');
  }
  return chalk.red(num + 's');
}
Quake.keysToPass = ['add'];
module.exports = Quake;
