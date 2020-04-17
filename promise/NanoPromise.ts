type IExecutor = (resolve: Function, reject: Function) => void;

enum STATE {
  fulfilled = 'RESOLVED',
  rejected = 'REJECTED',
  pending = 'PENDING'
}

export default class SimplePromise {
  private onResolve_ = [];
  private onReject_ = [];
  private state = STATE.pending;
  static all: () => void;
  static race: () => void;

  constructor(executor: IExecutor) {
    executor(this.handleOnResolve.bind(this), this.handleOnReject.bind(this));
  }

  handleOnResolve(value: any) {
    process.nextTick(() => {
      if (this.state !== STATE.pending) return;
      this.state = STATE.fulfilled;
      this.onResolve_.forEach(r => r(value));
    });
  }

  handleOnReject(error: any) {
    process.nextTick(() => {
      if (this.state !== STATE.pending) return;
      this.state = STATE.rejected;
      this.onReject_.forEach(r => r(error));
    });
  }

  then(onResolve: Function) {
    this.onResolve_.push(onResolve);
    return this;
  }

  catch(onReject: Function) {
    this.onReject_.push(onReject);
    return this;
  }
}

SimplePromise.all = () => {};
SimplePromise.race = () => {};
