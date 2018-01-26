var Completable = require('../lib/Completable');
var rx = require('rxjs');

var c = new Completable();
var events = ["added", "started", "error", "finished", "done", 'data'];
events.forEach(e => {
  c.on(e, (name, arg) => {
    if (e === "done") {
      console.log("All done!");
    } else if (e === 'data') {
      console.log('Recived data from', name + ':', arg);
    } else {
      console.log("Task", name, "was", e, "with arg", arg);
    }
  });
});
c.then(function Task1(result, done) {
  setTimeout(() => {done(null, (result || 0) + 1); }, 100);
});
c.then(function Task2(result, done) {
  setTimeout(() => {done(null, (result || 0) + 1); }, 100);
});
c.then(function Task3(result, done) {
  setTimeout(() => {done(null, (result || 0) + 1); }, 100);
});
c.then(function Task4(result, done) {
  setTimeout(() => {done(null, (result || 0) + 1); }, 100);
});
c.then(function Task5(result) {
  return new rx.Observable(function (subber) {
    subber.next(result++);
    var i = 0, id = setInterval(function () {
      subber.next(result++);
      i++;
      if (i > 10) {
        clearInterval(id);
        subber.complete();
      }
    }, 200);
  });
});
