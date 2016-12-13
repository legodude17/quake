"use strict";
const Quake = require('../lib/Quake');

const quake = new Quake();

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

quake.start("Task 5", err => {
  if (err) {
    console.error(err);
    process.exit(1);
  } else {
    console.log("All Done!");
    process.exit(0);
  }
});