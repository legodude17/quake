"use strict";
const Quake = require('./Quake');
function create(opts) {
  return new Quake(opts);
}
module.exports = create;
