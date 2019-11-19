const _ = require("lodash");
const { create } = require("dva-core");

class CoreModelManager {
  constructor(hooksAndOpts = {}) {
    this.creator = create(hooksAndOpts);
  }

  registerModel(modelOpts = {}) {
    this.creator.model(modelOpts);
  }

  dispatch(action) {
    this.store.dispatch(action);
  }

  getState(namespace, key) {
    const state = this.store.getState()[namespace];
    return _.get(state, key);
  }

  run() {
    this.creator.start();
    this.store = this.creator._store;
  }
}

module.exports = CoreModelManager;