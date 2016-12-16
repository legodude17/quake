"use strict";
const Quake = require('../lib/Quake');
var rx = require('rxjs');

const quake = new Quake('');

function wait(time, message, name) {
  var fn = (_, done) => {
    setTimeout(() => {
        done(null, message);
    }, time);
  };
  fn.displayName = name;
  return fn;
}

quake.add("Task 1", wait(100, "Done!"));
quake.add("Task 2", ["Task 1"], [wait(400, "Done!", "Step 1"), wait(400, "Done!", "Step 2"), wait(400, "Done!", "Step 3")]);
quake.add("Task 3", ["Task 2"], wait(500, "Done!"));
quake.add("Task 4", ["Task 3"], [wait(400, "Done!", "Step 1"), wait(400, "Done!", "Step 2"), wait(400, "Done!", "Step 3")]);
quake.add("Task 5", ["Task 4"], wait(500, "Done!"));
quake.add("Task 6", ["Task 5"], [quake.name(() => {
  return new rx.Observable(function (subber) {
    var fn = quake.createTaskBar();
    var i = 0, id = setInterval(function () {
      if (i > 101) {
        clearInterval(id);
        subber.complete();
        return;
      }
      subber.next(fn(i++/100));
      i++;
    }, 100);
  });
}, "Download File")]);

quake.start("Task 6", err => {
  if (err) {
    console.error(err);
    process.exit(1);
  } else {
    console.log("All Done!");
    process.exit(0);
  }
});