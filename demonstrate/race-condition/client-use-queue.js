const { ajax, IO, sulisuli } = require("./base");

function getFile(file) {
  return new Promise(function(resolve) {
    ajax(file, resolve);
  });
}

class QueueManager {
  queue = [];
  isRunningQueue = false;

  add(f) {
    this.queue.push(f);
    this.run();
  }

  async run() {
    if (this.isRunningQueue) {
      return;
    } else {
      this.isRunningQueue = true;
    }

    while (this.queue.length > 0) {
      const item = this.queue.shift();
      try {
        const res = await item();
        IO(res);
      } catch (e) {
        console.error(e);
      }
    }

    this.isRunningQueue = false;
  }
}

const fileQueue = new QueueManager();
["file1", "file2", "file3"].forEach(filename => {
  fileQueue.add(() => getFile(filename));
});
