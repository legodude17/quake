"use strict";
var display = require('./TaskDisplay');
class TaskDisplayManager {
  constructor(tasks) {
    this.tasks = tasks;
    this.obj = {};
    tasks.forEach((v) => this.obj[v] = display.STATE_PENDING);
    this.display = display(process.stdout, this.obj);
  }

  run(name) {
    this.obj[name] = display.STATE_RUNNING;
    this.update();
    var self = this;
    return {
      fail() {
        self.fail(name);
      },
      succeed() {
        self.succeed(name);
      }
    }
  }

  add(name) {
    this.obj[name] = display.STATE_PENDING;
    this.update();
  }

  fail(name) {
    this.obj[name] = display.STATE_ERROR;
    this.update();
  }

  succeed(name) {
    this.obj[name] = display.STATE_SUCCESS;
    this.update();
  }

  update() {
    this.display.updateTo(this.obj);
  }
}
module.exports = TaskDisplayManager;
