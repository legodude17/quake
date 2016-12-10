var asyncDone = require('async-done');

class Completable {
  constructor(starter, emiter) {
    this._chain = [];
    this._catchers = [];
    this._result = null;
    this._emiter = emiter || {emit(){}};
    this.then(starter);
  }

  then(fn) {
    this._chain.push(fn);
    this._emiter.emit("added", fn.displayName || fn.name);
    if (!this._executing) {
      this._exec();
    }
  }

  catch(fn) {
    this._catchers.push(fn);
  }

  _exec() {
    var fn = this._chain.shift();
    this._executing = true;
    this.emit("started", fn.displayName || fn.name);
    asyncDone(fn.bind(this, this._result), (err, result) => {
      if (err) {
        this._emiter.emit("error", fn.displayName || fn.name, err);
        return this._error(err);
      }
      this._executing = false;
      this._result = result;
      this._emiter.emit("finished", fn.displayName || fn.name);
      this._exec();
    });
  }

  _error(err) {
    this._catchers.forEach(fn => fn(err));
  }
}

module.exports = Completable;