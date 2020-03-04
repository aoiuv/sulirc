class ActionQueue {
  _queue: any[] = [];
  _isActivate: boolean = false;
  push(action: () => Promise<any>) {
    this._queue.push(action);
    this.check();
  }
  async check() {
    if (this._isActivate) {
      return;
    }
    this._isActivate = true;
    while (this._queue.length > 0) {
      const action = this._queue.shift();
      await action();
    }
    this._isActivate = false;
  }
}

export default new ActionQueue();