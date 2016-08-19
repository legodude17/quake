"use strict";
module.exports = function (quake) {
  quake.addFiles(['test/src/palindrome.txt', 'test/dist/palindrome.txt']);

  quake.add('reverse', function () {
    var src = quake.getFile(0);
    var dest = quake.getFile(1);
    var text = src.getLine(0);
    text = text.split('');
    text.reverse();
    text = text.join('');
    dest.setLine(0, text);
  });

  quake.add('default', ['reverse'])
}
