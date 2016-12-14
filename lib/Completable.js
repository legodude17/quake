var asyncDone = require('async-done');
var EventEmitter = require('events').EventEmitter;

class Completable extends EventEmitter{
  constructor(starter) {
    super();
    this._chain = [];
    this._catchers = [];
    this._result = null;
    if (starter) {
      this.then(starter);
    }
  }

  then(fn, catcher) {
    if (typeof fn !== "function") {
      throw new TypeError("fn must be a function");
    }
    this._chain.push(fn);
    this.emit("added", fn.displayName || fn.name);
    if (!this._executing) {
      this._exec();
    }
    if (catcher) {
      this.catch(catcher);
    }
  }

  catch(fn) {
    if (typeof fn !== "function") {
      throw new TypeError("fn must be a function");
    }
    this._catchers.push(fn);
  }

  _exec() {
    var fn = this._chain.shift();
    if (typeof fn !== "function") {
      this.emit("done");
      return;
    }
    this._executing = true;
    this.emit("started", fn.displayName || fn.name);
    asyncDone(fn.bind(this, this._result), (err, result) => {
    // fn(this._result, (err, result) => {
      if (err) {
        this.emit("error", fn.displayName || fn.name, err);
        return this._error(err);
      }
      this._executing = false;
      this._result = result;
      this.emit("finished", fn.displayName || fn.name, result);
      this._exec();
    });
  }

  _error(err) {
    this._catchers.forEach(fn => fn(err));
  }
}

module.exports = Completable;