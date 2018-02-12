const q = require('..');
const quake = q.create("update");

quake.add('"Compile"', [
  quake.create("test/dist/test1.js"),
  quake.create("test/dist/test2.js"),
  quake.src("test/src/*.js"),
  function compile(strings) {
    return new Promise(r => r([strings[0] + strings[1], strings[1] + strings[0]]));
  },
  quake.dest("test/dist/*.js")
]);

quake.start('"Compile"');
