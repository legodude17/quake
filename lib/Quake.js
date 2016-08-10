"use strict";
const O = require('orchestrator');
var TaskDisplayManager = require('./TaskDisplayManager');
class Quake {
  constructor() {
    this.o = new O();
    this.display = new TaskDisplayManager([]);
    this._initEvents();
  }

  add(name, deps, fn) {
    this.o.add(name, deps, fn);
    this.display.add(name);
  }

  start(...names) {
    names.push(function (err) {
      if (err) {
        console.error(err.message || err);
        process.exit(1);
      }
    });
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
}
module.exports = Quake;
