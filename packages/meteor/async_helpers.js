
Meteor._noYieldsAllowed = function (f) {
  return f();
};

Meteor._DoubleEndedQueue = Npm.require('double-ended-queue');

// Meteor._SynchronousQueue is a queue which runs task functions serially.
// Tasks are assumed to be synchronous: ie, it's assumed that they are
// done when they return.
//
// It has two methods:
//   - queueTask queues a task to be run, and returns immediately.
//   - runTask queues a task to be run, and then yields. It returns
//     when the task finishes running.
//
// It's safe to call queueTask from within a task, but not runTask (unless
// you're calling runTask from a nested Fiber).
//
// Somewhat inspired by async.queue, but specific to blocking tasks.
// XXX break this out into an NPM module?
// XXX could maybe use the npm 'schlock' module instead, which would
//     also support multiple concurrent "read" tasks
//
class AsynchronousQueue {
  constructor() {
    this._taskHandles = new Meteor._DoubleEndedQueue();
    this._runningOrRunScheduled = false;
    // This is true if we're currently draining.  While we're draining, a further
    // drain is a noop, to prevent infinite loops.  "drain" is a heuristic type
    // operation, that has a meaning like unto "what a naive person would expect
    // when modifying a table from an observe"
    this._draining = false;
  }

  async queueTask(task) {
    this._taskHandles.push({
      task: task,
      name: task.name
    });
    await this._scheduleRun();
  }

  async _scheduleRun() {
    // Already running or scheduled? Do nothing.
    if (this._runningOrRunScheduled)
      return;

    this._runningOrRunScheduled = true;

    await this._run();
  }

  async _run() {
    if (!this._runningOrRunScheduled)
      throw new Error("expected to be _runningOrRunScheduled");

    if (this._taskHandles.isEmpty()) {
      // Done running tasks! Don't immediately schedule another run, but
      // allow future tasks to do so.
      this._runningOrRunScheduled = false;
      return;
    }
    const taskHandle = this._taskHandles.shift();

    // Run the task.
    try {
      await taskHandle.task();
    } catch (err) {
        Meteor._debug("Exception in queued task", err);
    }

    // Soon, run the next task, if there is any.
    this._runningOrRunScheduled = false;
    await this._scheduleRun();
  }

  async runTask(task) {
    const handle = {
      task: Meteor.bindEnvironment(task, function(e) {
        Meteor._debug('Exception from task', e);
        throw e;
      }),
      name: task.name
    };
    this._taskHandles.push(handle);
    await this._scheduleRun();
  }

  flush() {
    return this.runTask(() => {});
  }

  async drain() {
    if (this._draining)
      return;

    this._draining = true;
    while (!this._taskHandles.isEmpty()) {
      await this.flush();
    }
    this._draining = false;
  }
}

Meteor._AsynchronousQueue = AsynchronousQueue;
Meteor._SynchronousQueue = AsynchronousQueue;


// Sleep. Mostly used for debugging (eg, inserting latency into server
// methods).
//
const _sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));
Meteor._sleepForMs = function (ms) {
  return _sleep(ms);
};