const Orchestrator = require('orchestrator');
const Completable = require('./Completable');
const Task = require('./Task');
const renderers = require('./renderers');
const fs = require('fs');
const path = require('path');
const symbols = require('log-symbols');
const time = require('pretty-time');
const Subject = require("rxjs/Subject").Subject;

class Quake extends Orchestrator {
  constructor(renderer) {
    super();
    this._currentTasks = new Set();
    this._completables = {}; //Object mapping task names to their Completables
    this._displayableTasks = [];
    this._rendererClass = null;
    this._subtasks = {};
    if (!renderer) {
      this._rendererClass = renderers.update;
    } else if (typeof renderer === "string") {
      this._rendererClass = renderers[renderer];
    } else {
      this._rendererClass = renderer;
    }
    if (typeof this._rendererClass !== "function") {
      throw new Error("Needs a renderer that is a function")
    }
    // Add event listeners
    this.on("start", () => {
      Object.keys(this.tasks).forEach(task => {
        var displableTask = new Task(task);
        if (this._subtasks[task]) {
          Object.keys(this._subtasks[task]).forEach(subtask => displableTask.addSubTask(this._subtasks[task][subtask]));
        }
        this._displayableTasks.push(displableTask);
      });
      this._renderer = new this._rendererClass(this._displayableTasks);
      this._renderer.render();
      this.startTime = process.hrtime();
    });
    this.on("stop", () => {
      this._renderer.end();
      console.log(" " + symbols.success + " BUILD FINISHED after ~" + time(process.hrtime(this.startTime), 'ms'));
    });
    this.on("err", err => {
      console.error(" " + symbols.error + " ERROR: " + err.err.message);
      this._renderer.end();
      this.emit("error", err.err);
    });
    this.on("task_start", args => {
      this._currentTasks.add(args.task);
      this._displayableTasks.forEach(task => {
        if (task.title === args.task) {
          task.start();
        }
      });
    });
    this.on("task_stop", args => {
      this._currentTasks.delete(args.task);
      this._displayableTasks.forEach(task => {
        if (task.title === args.task) {
          task.stop();
        }
      });
    });
    this.on("task_err", args => {
      this._currentTasks.delete(args.task);
      this._displayableTasks.forEach(task => {
        if (task.title === args.task) {
          task.stop(args.err);
        }
      });
    })
  }

  get currentTasks() {
    return [...this._currentTasks.values()];
  }

  add(name, dep, fn) {
    if (!fn && (typeof dep === 'function' || (Array.isArray(dep) && typeof dep[0] === "function"))) {
      fn = dep;
      dep = undefined;
    }
    var func;
    if (Array.isArray(fn)) {
      var c = this._completables[name] = new Completable();
      this._subtasks[name] = {};
      var arr = [];
      fn.forEach(fn => {
        arr.push(fn);
        this._subtasks[name][fn.displayName || fn.name] = new Task(fn.displayName || fn.name);
      });
      this._hookCompletable(name, c);
      func = function (done) {
        arr.forEach(fn => {
          c.then(fn);
        });
        c.then(res => done(null, res), err => done(err));
      };
    } else if (typeof fn === "function") {
      var c = this._completables[name] = new Completable();
      this._subtasks[name] = {[fn.displayName || fn.name]: new Task(fn.displayName || fn.name)};
      this._hookCompletable(name, c);
      func = function(done) {
        c.then(fn);
        c.then(res => done(null, res), err => done(err));
      };
    } else {
      func = (done) => done(null, true);
    }
    super.add(name, dep, func);
  }

  _hookCompletable(name, c) {
    c.context = this;
    var subtasks = this._subtasks[name];
    c.on('started', name => subtasks[name] ? subtasks[name].start() : null);
    c.on('error', (name, err) => subtasks[name] ? subtasks[name].stop(err) : null);
    c.on('finished', (name, result) => {
      if (!subtasks[name]) {
        return;
      }
      subtasks[name].output = result;
      subtasks[name].stop();
    });
    c.on('data', (name, data) => {
      if (!subtasks[name]) {
        return;
      }
      subtasks[name].output = data;
    });
  }

  src(file, enc) {
    return this.name((res, cb) => fs.readFile(this.resolve(file), enc || 'utf-8', (err, c) => {
      Array.isArray(res) ? res.push(c) : res = c;
      cb(err, res)
    }), "Load file " + file);
  }

  dest(file) {
    return this.name((contents, cb) => {
      contents = Array.isArray(contents) ? contents.shift() : contents;
      fs.writeFile(this.resolve(file), contents, cb);
    }, "Save file " + file);
  }

  name(fn, name) {
    fn.displayName = name;
    return fn;
  }

  sync(fn) {
    return (arg, cb) => cb(null, fn(arg));
    // return (arg, cb) => setTimeout(() => {
    // var err = null, res;
    // try {res=fn(arg)}catch(e){err=e}
    // cb(err, res);
    // }, 1000);
  }

  resolve(file) {
    return path.resolve(process.cwd(), file);
  }

  log(messages, time) {
    return function Log() {
      var sub = new Subject();
      var done = false;
      sub.next(messages.pop());
      var id = setInterval(() => {
        if (done) {
          clearInterval(id);
          sub.complete();
        }
        sub.next(messages.pop());
        if (messages.length === 0) done = true;
      }, time);
      return sub;
    };
  }

  createTaskBar(length = 100, {
    open = '[',
    close = ']',
    done = '=',
    notdone = ' '
  } = {}) {
    return (frac) => {
      var numDone = Math.floor(length * frac);
      var numNotDone = length - numDone;
      var doneString = (numDone === 0) ? '' : done.repeat(numDone);
      return open + doneString + notdone.repeat(numNotDone) + close + '   ' + Math.floor(frac * 100) + '%';
    };
  }
}

module.exports = Quake;
