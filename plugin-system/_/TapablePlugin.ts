import invariant from 'invariant';
import {
  SyncHook,
  SyncBailHook,
  SyncWaterfallHook,
  SyncLoopHook,
  AsyncParallelHook,
  AsyncParallelBailHook,
  AsyncSeriesHook,
  AsyncSeriesBailHook,
  AsyncSeriesWaterfallHook,
  HookMap
} from 'tapable';

export interface IPluginHooks {
  onError: SyncHook;
  onAction: AsyncSeriesWaterfallHook;
  onInit: AsyncSeriesHook;
}

interface IPlugin {
  apply: (hooks: IPluginHooks) => void;
}

class TapablePluginSystem {
  hooks: IPluginHooks;

  constructor(plugins: IPlugin[] = []) {
    this.hooks = {
      onError: new SyncHook(['errMsg']),
      onAction: new AsyncSeriesWaterfallHook(['action']),
      onInit: new AsyncSeriesHook()
    };

    if (~plugins.length) {
      plugins.forEach(plugin => this.use(plugin));
    }
  }

  use(plugin: IPlugin) {
    invariant(plugin.apply, 'plugin.apply cannot be undefined');

    plugin.apply(this.hooks);
  }
}

export default TapablePluginSystem;
