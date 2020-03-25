import { log, report, fetch } from './util';
import PluginSystem from './Plugin';
import TapablePluginSystem, { IPluginHooks } from './TapablePlugin';

type Hook = 'onInit' | 'onAction';

function createLoggerPlugin(appId: string) {
  return {
    onAction(action: { type: string; params: any }) {
      log(`Log from appId: ${appId}`, action.type, action.params);
    }
  };
}

function createAppInitPlugin() {
  return {
    onInit() {
      log(`App init, do something`);
    }
  };
}

/**
 * 基于原生插件构建的 App 示例
 */
(async function App() {
  /**
   * 初始化插件机制 - 钩子声明
   */
  const system = new PluginSystem<Hook>(['onInit', 'onAction']);
  const APP_ID = 'a57e41';

  const appInitPlugin = createAppInitPlugin();
  const loggerPlugin = createLoggerPlugin(APP_ID);
  /**
   * 插件声明、注册
   */
  system.use(appInitPlugin);
  system.use(loggerPlugin);

  /**
   * 插件钩子任意时机调用
   */
  system.apply('onInit')();
  system.apply('onAction')({
    type: 'SET_AUTHOR_INFO',
    params: { name: 'sulirc', email: 'ygj2awww@gmail.com' }
  });
})();

log('================================');

class LoggerPlugin {
  private appId: string;

  constructor(appId: string) {
    this.appId = appId;
  }

  apply(hooks: IPluginHooks) {
    const PluginType = 'LoggerPlugin';
    hooks.onInit.tapPromise(PluginType, () => {
      return fetch('LOGGER_INIT');
    });
    hooks.onAction.tapAsync(PluginType, (action, callback) => {
      report(`Log action from appId: ${this.appId}`, action.type, action.params);
      fetch('APP_INFO')
        .then(() => callback())
        .catch(err => callback(err));
    });
  }
}

class ReportPlugin {
  private appId: string;

  constructor(appId: string) {
    this.appId = appId;
  }

  apply(hooks: IPluginHooks) {
    const PluginType = 'ReportPlugin';
    hooks.onError.tap(PluginType, errMsg => {
      report(`Report error from appId: ${this.appId}:`, errMsg);
    });
    hooks.onAction.tapAsync(PluginType, (action, callback) => {
      report(`Report action from appId: ${this.appId}:`, action.type, action.params);
      fetch('APP_INFO')
        .then(() => callback())
        .catch(err => callback(err));
    });
  }
}

/**
 * 基于 Tapable 插件构建的 App 示例
 */
(async function TapableApp() {
  const APP_ID = 'a57e41';

  /**
   * 插件声明、注册
   */
  const plugins = [new LoggerPlugin(APP_ID), new ReportPlugin(APP_ID)];
  const system = new TapablePluginSystem(plugins);

  /**
   * 插件钩子任意时机调用
   */
  system.hooks.onInit.promise().then(() => {
    log('onInit hooks complete');
  });
  system.hooks.onAction.callAsync(
    {
      type: 'SET_AUTHOR_INFO',
      params: { name: 'sulirc', email: 'ygj2awww@gmail.com' }
    },
    (err: any) => {
      if (err) {
        console.error(err);
        return;
      }
      log('onAction hooks complete');
    }
  );
  // ...
  system.hooks.onError.call('Fake Error');
  log('onError hooks complete');
})();
