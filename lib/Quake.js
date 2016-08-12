"use strict";
const O = require('orchestrator');
const TaskDisplayManager = require('./TaskDisplayManager');
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
    function defaultCb(err) {
      if (err) {
        console.error(err.message || err);
        process.exit(1);
      }
    }
    if (typeof names[names.length - 1] != 'function') {
      names.push(defaultCb);
    }
    console.log(...names);
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
Quake.keysToPass = ['add'];
module.exports = Quake;
