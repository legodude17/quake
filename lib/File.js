"use strict";
var EventEmitter = require('events').EventEmitter;
var fs = require('fs');
class File extends EventEmitter{
  constructor(path) {
    super();
    this.path = path;
    this.task = function (cb) {
      this.once('load', cb);
      this.once('error', cb)
    }.bind(this);
    this._loaded = false;
    this._lines = null;
    this._error = false;
    this.startLoading();
  }

  startLoading() {
    if (this._loaded) {
      return;
    }
    fs.readFile(this.path, 'utf-8', (err, contents) => {
      if (err) {
        if (!this.error) {
          return setTimeout(this.startLoading.bind(this), 100);
        }
        this._error = true;
        this.emit('error', err);
      }
      this._loaded = true;
      this.contents = contents.split('\n');
      this.emit('load', null, contents);
    });
  }

  write(cb) {
    fs.writeFile(this.path, this.contents.join('\n'), cb);
  }

  get() {
    return this.contents;
  }

  set(v) {
    this.contents = v;
  }

  getLine(i) {
    return this.contents[i];
  }

  setLine(i, v) {
    this.contents[i] = v;
  }
}

module.exports = File;
