"use strict";
var display = require('./TaskDisplay');
class TaskDisplayManager {
  constructor(tasks, ignore) {
    this.tasks = tasks;
    this.obj = {};
    tasks.forEach((v) => this.obj[v] = display.STATE_PENDING);
    this.display = display(process.stdout, this.obj, ignore);
  }

  run(name) {
    this.obj[name] = display.STATE_RUNNING;
    this.update();
    var self = this;
    return {
      fail(duration) {
        self.fail(name, duration);
      },
      succeed(duration) {
        self.succeed(name, duration);
      }
    }
  }

  add(name) {
    this.obj[name] = display.STATE_PENDING;
    this.update();
  }

  fail(name, duration) {
    this.obj[name] = display.createError(duration);
    this.update();
  }

  succeed(name, duration) {
    this.obj[name] = display.createSuccess(duration);
    this.update();
  }

  update() {
    this.display.updateTo(this.obj);
  }
}
module.exports = TaskDisplayManager;
