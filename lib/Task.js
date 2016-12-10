'use strict';
const Subject = require('rxjs/Subject').Subject;

class Task extends Subject {

	constructor(title) {
		super();
		this._subtasks = [];
		this._output = undefined;

		this.title = title;
	}

	get output() {
		return this._output;
	}

  set output(data) {
    this._output = data+'';
    this.next({
      type: 'DATA',
      data:data+''
    })
  }

	get subtasks() {
		return this._subtasks;
	}

	set state(state) {
		this._state = state;

		this.next({
			type: 'STATE'
		});
	}

	get state() {
		return state.toString(this._state);
	}

	hasSubtasks() {
		return this._subtasks.length > 0;
	}

	isPending() {
		return this._state === 'PENDING';
	}

	isSkipped() {
		return this._state === 'SKIPPED';
	}

	isCompleted() {
		return this._state === 'COMPLETED';
	}

	hasFailed() {
		return this._state === 'FAILED';
	}

  start() {
    this.state = 'PENDING';
  }

  stop(err) {
    if (err) {
      this.state = 'FAILED';
      this.error(err);
      return;
    }
    this.state = 'COMPLETED';
    this.complete();
  }

  skip(str) {
    this._output = str;
    this.state = 'SKIPPED';
  }

  addSubTask(task) {
    this._subtasks.push(task);
    this.next({
      type: 'SUBTASKS'
    });
  }
}

module.exports = Task;