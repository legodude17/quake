"use strict";
const Quake = require('./lib/Quake');
var quake = new Quake();
quake.add('Buy ingredients', function (cb) {
  setTimeout(function () {
    quake.add('Profit', ['Eat cake'], function (cb) {
      setTimeout(function () {
        cb(new Error('Nope'));
      }, 1000);
    });
    quake.start('Profit');
    cb();
  }, 1000);
});
quake.add('Make cake', ['Buy ingredients'], function (cb) {
  setTimeout(cb, 2000);
});
quake.add('Eat cake', ['Make cake'], function (cb) {
  setTimeout(cb, 3000);
});
quake.add('Make lemonade', ['Buy ingredients'], function (cb) {
  setTimeout(cb, 500);
});
quake.add('Drink lemonade', ['Make lemonade'], function (cb) {
  setTimeout(cb, 4000);
});
quake.add('Be happy', ['Eat cake', 'Drink lemonade'], function (cb) {
  setTimeout(cb, 1234);
});
quake.start('Be happy');
