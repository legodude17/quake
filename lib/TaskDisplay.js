"use strict";
var log = require('log-update');
var cliSpinners = require('cli-spinners');
var cliSymbols = require('log-symbols');
var chalk = require('chalk');
chalk.none = function(v){return v; }
class TaskDisplay {
  constructor(stream, obj) {
    this._tasks = [];
    this._obj = {};
    this._stream = stream;
    this._logger = log.create(stream);
    if (obj) {
      this.updateTo(obj);
    }
  }

  hasTask(name) {
    return this._tasks.some(function (task) {
      return task.name === name;
    });
  }

  updateTo(obj) {
    var keys = Object.keys(obj).filter((v) => this._obj[v] !== obj[v]);
    keys.forEach((v) => {
      if (this.hasTask(v)) {
        this._updateTask(v, obj[v]);
      } else {
        this._loadTask(v, obj[v]);
      }
    });
    this.render();
    return this;
  }

  _loadTask(name, state) {
    this._tasks.push(new Task(name, state, this));
    return this;
  }

  _updateTask(name, state) {
    var idx;
    this._tasks.forEach(function (task, i) {
      if (task.name === name) {
        idx = i;
      }
    });
    if (idx == null) {
      throw new Error("TaskDisplay#_updateTask: Task", key, "does not exist. To add a new task, use _loadTask");
    }
    this._tasks[idx].updateState(state);
    return this;
  }

  render() {
    this._logger(this._tasks.map(function (task) {
      return task.render();
    }).join('\n\n'));
  }
}

class Task {
  constructor(name, state, parent) {
    this.name = name;
    this.state = null;
    this._spinner = null;
    this._parent = parent;
    if (state) {
      this.updateState(state);
    }
  }

  updateState(state) {
    this.state = state;
    if (typeof state == 'string') {
      state = display.states[state];
    }
    this._spinner = new Spinner(state, this._parent);
  }

  render() {
    var output = ' '.repeat(4) +
            this.name +
            ' '.repeat(36 - this.name.length) +
            (this._spinner ? this._spinner.render() : '');
    return output;
  }
}

class State {
  constructor(spinner, text, opts) {
    opts = opts || {};
    this.text = text;
    this['static'] = !!opts['static'];
    this.color = opts.color || 'none';
    this.after = !!opts.after;
    this.space = (opts.space ? (opts.space === true ? ' ' : opts.space) : (opts.space === undefined ? ' ' : ''));
    if (typeof spinner == 'string') {
      if (_static) {
        this.spinner = spinner;
        return;
      }
      spinner = cliSpinners[spinner];
    }
    this.spinner = spinner;
  }
}
class Spinner {
  constructor(state, parent) {
    this._static = state['static'];
    if (this._static) {
      this._symbol = state.spinner;
    } else {
      this._interval = state.spinner.interval;
      this._frames = state.spinner.frames;
      this._index = 0;
      this._frame = this._frames[this._index];
    }
    this._space = state.space;
    this._after = state.after;
    this._color = state.color;
    this._text = state.text;
    this._parent = parent;
    this._id = null;
    if (!this._static) {
      this.start();
    }
  }

  start() {
    if (this._static) {
      return;
    }
    this._id = setInterval(() => {
      this._parent.render();
      this._frame = this._frames[++this._index % this._frames.length];
    }, this._interval);
  }

  stop() {
    clearInterval(this._id);
  }

  render() {
    var sym = (this._static ? chalk[this._color](this._symbol) : chalk[this._color](this._frame));
    if (this._after) {
      return this.text + this._space + sym;
    }
    return sym + this._space + this.text;
  }
}

function display(stream, obj) {
  return new TaskDisplay(stream, obj);
}

display.STATE_PENDING = 'pending';
display.STATE_RUNNING = 'running';
display.STATE_ERROR = 'error';
display.STATE_SUCCESS = 'success';
display.TaskDisplay = TaskDisplay;
display.Task = Task;
display.Spinner = Spinner;
display.State = State;
display.states = {
  pending: new State('simpleDots', 'Waiting', {after: true}),
  running: new State('dots', 'Running...', {color: 'blue'}),
  error: new State(cliSymbols.error, 'Error!', {'static': true}),
  success: new State(cliSymbols.success, 'Done!', {'static': true})
}

module.exports = display;
