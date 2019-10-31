const { ajax, IO, sulisuli } = require("./base");

function getFile(file) {
  return new Promise(function(resolve) {
    ajax(file, resolve);
  });
}

class ActionQueueManager {
  _queue = [];
  _flag = true;

  add(f) {
    this._queue.push(f);
    this._flag && this.run();
  }

  async run() {
    this._flag = false;
    while (this._queue.length > 0) {
      const item = this._queue.shift();
      try {
        IO(await item());
      } catch (e) {
        console.error(e);
      }
    }
    this._flag = true;
  }
}

const fileQueue = new ActionQueueManager();
["file1", "file2", "file3"].forEach(filename => {
  fileQueue.add(() => getFile(filename));
});
