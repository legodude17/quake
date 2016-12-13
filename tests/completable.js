var Completable = require('../lib/Completable');
var EE = require('events').EventEmitter;

var e = new EE();


var c = new Completable();
var events = ["added", "started", "error", "finished", "done"];
events.forEach(e => {
  c.on(e, (name, arg) => {
    if (e === "done") {
      console.log("All done!");
    } else {
      console.log("Task", name, "was", e, "with arg", arg);
    }
  });
});
c.then(function Task1(result, done) {
  setTimeout(() => {done(null, (result || 0) + 1); }, 100);
})
c.then(function Task2(result, done) {
  setTimeout(() => {done(null, (result || 0) + 1); }, 100);
});
c.then(function Task3(result, done) {
  setTimeout(() => {done(null, (result || 0) + 1); }, 100);
});
c.then(function Task4(result, done) {
  setTimeout(() => {done(null, (result || 0) + 1); }, 100);
});
