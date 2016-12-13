"use strict";
const Quake = require('../lib/Quake');

const quake = new Quake("update");

function wait(time, message) {
  return done => {
    setTimeout(() => {
      done(null, message);
    }, time);
  }
}

quake.add("Task 1", wait(100, "Done!"));
quake.add("Task 2", ["Task 1"], wait(500, "Done!"));
quake.add("Task 3", ["Task 2"], wait(500, "Done!"));
quake.add("Task 4", ["Task 3"], wait(500, "Done!"));
quake.add("Task 5", ["Task 4"], wait(500, "Done!"));
quake.add("Task 6", ["Task 1"], wait(500, "Done!"));
quake.add("Task 7", ["Task 6"], wait(500, "Done!"));
quake.add("Task 8", ["Task 7"], wait(500, "Done!"));
quake.add("Task 9", ["Task 8"], wait(500, "Done!"));
quake.add("Task 10", ["Task 9"], wait(500, "Done!"));
quake.add("Task 11", ["Task 10"], wait(500, "Done!"));

quake.start("Task 5", "Task 11", err => {
  if (err) {
    console.error(err);
    process.exit(1);
  } else {
    console.log("All Done!");
    process.exit(0);
  }
});