'use strict';

// Barrowed from gulpjs/async-done

var domain = require('domain');

var eos = require('end-of-stream');
var tick = require('next-tick');
var once = require('once');
var exhaust = require('stream-exhaust');
var Subject = require('rxjs/Subject').Subject;

var eosConfig = {
  error: false,
};

function asyncDone(fn, cb) {
  var sub = new Subject();

  cb = once(cb);

  var d = domain.create();
  d.once('error', onError);
  var domainBoundFn = d.bind(fn);

  function done(_, res) {
    d.removeListener('error', onError);
    d.exit();
    sub.next(res);
    sub.complete();
    return cb.apply(null, arguments);
  }

  function onSuccess(result) {
    return done(null, result);
  }

  function onError(error) {
    return done(error);
  }

  function asyncRunner() {
    var result = domainBoundFn(done);

    function onNext(state) {
      onNext.state = state;
      sub.next(state);
    }

    function onCompleted() {
      return onSuccess(onNext.state);
    }

    if (result && typeof result.on === 'function') {
      // Assume node stream
      d.add(result);
      eos(exhaust(result), eosConfig, done);
      return;
    }

    if (result && typeof result.subscribe === 'function') {
      // Assume RxJS observable
      result.subscribe(onNext, onError, onCompleted);
      return;
    }

    if (result && typeof result.then === 'function') {
      // Assume promise
      result.then(onSuccess, onError);
      return;
    }
  }

  tick(asyncRunner);
  return sub;
}

module.exports = asyncDone;
