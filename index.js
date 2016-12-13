var Quake = require('./lib/Quake');
var quake = new Quake();

quake.create = r => new Quake(r);
quake.Quake = Quake;

module.exports = quake;