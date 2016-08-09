"use strict";
var quake = require('.');
var TaskDisplayManager = require('./lib/TaskDisplayManager');
var manager = new TaskDisplayManager(['Buy ingredients', 'Make cake', 'Eat cake']);
function wait(fn) {
  setTimeout(fn, 1000);
}
var current = manager.run('Buy ingredients')
wait(function () {
  current.succeed();
  current = manager.run('Make cake');
  manager.add('Profit');
  wait(function () {
    current.succeed();
    current = manager.run('Eat cake')
    wait(function () {
      current.succeed();
      current = manager.run('Profit')
      wait(function () {
        current.fail();
        wait(process.exit);
      });
    });
  });
});
