"use strict";
module.exports = function (quake) {
  quake.add('Buy ingredients', function (cb) {
    setTimeout(cb, 1000);
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
  quake.add('Profit', ['Eat cake'], function (cb) {
    setTimeout(function () {
      cb(new Error('Error!'));
    }, 4000);
  });
  quake.add('default', ['Be happy', 'Profit']);
}
