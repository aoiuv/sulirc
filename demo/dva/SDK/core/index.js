
require('babel-polyfill');

const Emitter = require("events");
const CoreModelManager = require('./coreModelManager');
const PluginManager = require('./pluginManager');
const { SDKEvent } = require('./const');

class CoreSDK extends Emitter {
  static event = SDKEvent;
  
  constructor(options) {
    this.options = options;
    this.emit(SDKEvent.onBeforeConfig, options);
    this.coreModelManager = new CoreModelManager();
    this.pluginManager = new PluginManager();
  }

  registerPlugin(plugin) {
    this.emit(SDKEvent.onRegisterPlugin, plugin);
    this.pluginManager.register(plugin);
  }

  unregisterPlugin(plugin) {
    this.emit(SDKEvent.onUnregisterPlugin, plugin);
    this.pluginManager.unregister(plugin);
  }
}

// console.log(CoreSDK.event);

module.exports = CoreSDK;
