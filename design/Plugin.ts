import * as is from './is';

const hooks = [
  'onError',
  'beforeConnect',
  'beforeRender',
  'onDestroy'
];

interface IPlugin {
  onError?: (...args: any) => any;
  beforeConnect?: (...args: any) => any;
  beforeRender?: (...args: any) => any;
  onDestroy?: (...args: any) => any;
}

export class Plugin {
  private hooks = {};

  constructor() {
    this.hooks = hooks.reduce((memo, key) => {
      memo[key] = [];
      return memo;
    }, {});
  }

  apply(key: keyof IPlugin, defaultHandler: (...args: any) => any = () => {}) {
    const { hooks } = this;
    const fns = hooks[key];

    return async (...args: any) => {
      let ret: any;
      if (fns.length) {
        for (const fn of fns) {
          if (is.promise(ret)) {
            await ret;
          }
          if (is.promise(fn)) {
            ret = await fn(...args);
          } else {
            ret = fn(...args);
          }
        }
      } else if (defaultHandler) {
        if (is.promise(defaultHandler)) {
          ret = await defaultHandler(...args);
        } else {
          ret = defaultHandler(...args);
        }
      }
      return ret;
    };
  }

  use(plugin: IPlugin) {
    const { hooks } = this;
    for (const key in plugin) {
      if (Object.prototype.hasOwnProperty.call(plugin, key)) {
        hooks[key].push(plugin[key]);
      }
    }
  }
}

const plugin = new Plugin();

export default plugin;
