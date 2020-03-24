import Plugin, { IPlugin } from './Plugin';
import TapablePlugin from './TapablePlugin';

type Hook = 'onInit' | 'onAction';

function createLoggerPlugin(appId: string): IPlugin<Hook> {
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
  }
}

(async function App() {
  const plugin = new Plugin<Hook>(['onInit', 'onAction']);
  const APP_ID = 'e1a3b56';

  const appInitPlugin = createAppInitPlugin();
  const loggerPlugin = createLoggerPlugin(APP_ID);
  plugin.use(appInitPlugin);
  plugin.use(loggerPlugin);

  plugin.apply('onInit')();
  plugin.apply('onAction')('FETCH_AUTHOR_INFO', { name: 'sulirc', email: 'ygj2awww@gmail.com' });
})();

// const tapablePlugin = new TapablePlugin();

function log(...args: any) {
  return console.log(...args);
}
