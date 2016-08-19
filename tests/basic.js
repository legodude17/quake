"use strict";
function wait(ms) {
  return function (cb) {
    setTimeout(cb, ms);
  };
}
function fail(msg, ms) {
  return function (cb) {
    setTimeout(function () {
      cb(new Error(msg));
    }, ms);
  }
}
module.exports = function (quake) {
  quake.add('Make cake', ['Get ingredients'], wait(1000));
  quake.add('Eat cake', ['Make cake'], wait(1000));
  quake.add('Make lemonade', ['Get ingredients'], wait(1000));
  quake.add('Drink lemonade', ['Make lemonade'], wait(1000));
  quake.add('Get ingredients', wait(1000));
  quake.add('Be happy', ['Drink lemonade', 'Eat cake'], wait(1000));
  quake.add('Profit', ['Make lemonade'], fail('No profit for me', 2500));
  quake.add('default', ['Profit', 'Be happy'])
}
