var quake = require('../index');
var assert = require('assert');

function r() {
  return [
    quake.name(quake.sync(str => str.split('')), "Split"),
    quake.name(quake.sync(arr => arr.reverse()), "Reverse"),
    quake.name(quake.sync(arr => arr.join('')), "Join"),
  ]
}

quake.add("Copy Palindrome", [
  quake.src("test/src/palindrome.txt"),
  ...r(),
  quake.dest("test/dist/palindrome.txt")
]);

quake.add("Ensure Palindrome", ["Copy Palindrome"], [
  quake.src("test/src/palindrome.txt"),
  ...r(),
  quake.name(quake.sync(arg => [arg]), "Create Array"),
  quake.src("test/dist/palindrome.txt"),
  quake.name(quake.sync(args => assert.equal(args[0], args[1])), "Ensure Equal")
]);

quake.start("Ensure Palindrome");