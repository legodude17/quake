var Quake = require('./lib/Quake');
var quake = new Quake();

quake.make = r => new Quake(r);
quake.Quake = Quake;

module.exports = quake;
