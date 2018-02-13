const globby = require('globby');
const pify = require('pify');
const fs = pify(require('fs'));
const access = require('fs').access;

function a(file) {
  return new Promise((res, rej) => {
    access(file, err => res([file, !!err]));
  });
}

module.exports.readAll = function readAll(glob, enc) {
  return globby(glob).then(matches => matches.map(v => fs.readFile(v, enc))).then(proms=>Promise.all(proms));
};

module.exports.writeAll = function writeAll(glob, contents) {
  return globby(glob).then(matches => matches.map((v, i) => fs.writeFile(v, Array.isArray(contents) ? contents[i] : contents))).then(proms=>Promise.all(proms));
};

module.exports.createAll = function createAll(glob, override) {
  return globby(glob).then(matches => Promise.all(matches.map(a))).then(stuff => Promise.all(stuff.map(v => v[0] && !override ? fs.writeFile(v[1], "") : false)));
};
