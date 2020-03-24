import { log } from './util';
import Plugin from './Plugin';
import TapablePlugin from './TapablePlugin';

type Hook = 'onInit' | 'onAction';

/**
 * 基于原生插件构建的 App 示例
 */
(async function App() {
  const plugin = new Plugin<Hook>(['onInit', 'onAction']);
  const APP_ID = 'e1a3b56';

  const appInitPlugin = createAppInitPlugin();
  const loggerPlugin = createLoggerPlugin(APP_ID);
  /**
   * 插件注册
   */
  plugin.use(appInitPlugin);
  plugin.use(loggerPlugin);

  /**
   * 插件任意时机调用
   */
  plugin.apply('onInit')();
  plugin.apply('onAction')('FETCH_AUTHOR_INFO', { name: 'sulirc', email: 'ygj2awww@gmail.com' });
})();

/**
 * 基于 Tapable 插件构建的 App 示例
 */
(async function TapableApp() {
  const plugin = new TapablePlugin();
})();

function createLoggerPlugin(appId: string) {
  return {
    onAction(type: string, params: any) {
      log(`Log from appId: ${appId}`, type, params);
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
