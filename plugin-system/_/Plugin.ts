import invariant from 'invariant';

type Hook = (...args: any) => void;
type IPluginHooks<T extends string | symbol> = Record<T, Hook[]>;

class Plugin<K extends string> {
  hooks: IPluginHooks<K>;

  constructor(hooks: K[] = []) {
    invariant(hooks.length, `Plugin hooks empty`);

    this.hooks = hooks.reduce((memo, key) => {
      memo[key] = [];
      return memo;
    }, {} as IPluginHooks<K>);
  }

  use(plugin: Partial<IPluginHooks<K>>) {
    const { hooks } = this;
    for (let key in plugin) {
      if (Object.prototype.hasOwnProperty.call(plugin, key)) {
        invariant(hooks[key], `plugin.use: unknown plugin property: ${key}`);
        hooks[key] = hooks[key].concat(plugin[key]);
      }
    }
  }

  apply(key: K, defaultHandler: Hook = () => {}) {
    const { hooks } = this;
    const fns = hooks[key];

    return (...args: any) => {
      if (fns.length) {
        for (const fn of fns) {
          fn(...args);
        }
      } else {
        defaultHandler(...args);
      }
    };
  }
}

export default Plugin;
