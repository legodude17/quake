const globby = require('globby');
const pify = require('pify');
const fs = pify(require('fs'));

module.exports.readAll = function readAll(glob, enc) {
  return globby(glob).then(matches => matches.map(v => fs.readFile(v, enc))).then(proms=>Promise.all(proms));
};

module.exports.writeAll = function writeAll(glob, contents) {
  return globby(glob).then(matches => matches.map((v, i) => fs.writeFile(v, Array.isArray(contents) ? contents[i] : contents))).then(proms=>Promise.all(proms));
}
