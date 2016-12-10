var asyncDone = require('async-done');

class Completable {
  constructor(starter, emmiter) {
    this._chain = [];
    this._result = null;
    this.then(starter);
  }

  then(fn) {
    
  }

  chain() {

  }
}

module.exports = Completable;