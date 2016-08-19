"use strict";
const O = require('orchestrator');
const TaskDisplayManager = require('./TaskDisplayManager');
const chalk = require('chalk');
const logSymbols = require('log-symbols');
const File = require('./File');
function genRan() {
  var str = '';
  for (var i = 0; i < 64; i ++) {
    str += String.fromCharCode(Math.floor(Math.random() * 100));
  }
  return str;
}
var ignore = genRan();
function getUniq() {
  return ignore + genRan();
}
class Quake {
  constructor() {
    this.o = new O();
    this.display = new TaskDisplayManager([], function (v) {
      return v.indexOf(ignore) === 0;
    });
    this.files = [];
    this.fileTasks = [];
    this._initEvents();
    this._createPasser();
  }

  add(name, deps, fn) {
    if (typeof fn !== 'function' && typeof deps === 'function') {
      fn = deps;
      deps = null;
    }
    deps = deps || [];
    deps = deps.concat(this.fileTasks);
    this.o.add(name, deps, fn);
    this.display.add(name);
  }

  addFiles(files) {
    files = files.map((v) => new File(v));
    this.files = this.files.concat(files);
    files.forEach((v) => {
      var rand = getUniq();
      this.fileTasks.push(rand);
      this.o.add(rand, v.task);
    });
  }

  getFile(i) {
    return this.files[i];
  }

  _start(...names) {
    var start = Date.now();
    var _cb = null;
    if (typeof names[names.length - 1] == 'function') {
      _cb = names.pop();
    }
    function cb(err) {
      var msg;
      if (err) {
        msg = err.message || err;
      } else {
        var total = Date.now() - start;
        msg = logSymbols.success + '   Done in a total of about ' + colorDur((total / 1000).toFixed(2)) + '.';
      }
      if (_cb) {
        return _cb(err, msg);
      }
      if (err) {
        console.error(msg);
        return process.ext(1);
      }
      console.log(msg);
      process.exit(0);
    }
    names.push(cb);
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
  if (num < 5) {
    return chalk.green(num + 's');
  }
  if (num < 10) {
    return chalk.yellow(num + 's');
  }
  return chalk.red(num + 's');
}
Quake.keysToPass = ['add', 'addFiles', 'getFile'];
module.exports = Quake;
