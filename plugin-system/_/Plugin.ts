import invariant from 'invariant';

type Hook = (...args: any) => void;
type IKernelPlugin<T extends string | symbol> = Record<T, Hook[]>;
type IPlugin<T extends string | symbol> = Partial<Record<T, Hook | Hook[]>>;

class PluginSystem<K extends string> {
  private hooks: IKernelPlugin<K>;

  constructor(hooks: K[] = []) {
    invariant(hooks.length, `plugin.hooks cannot be empty`);

    this.hooks = hooks.reduce((memo, key) => {
      memo[key] = [];
      return memo;
    }, {} as IKernelPlugin<K>);
  }

  use(plugin: IPlugin<K>) {
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

  get(key: K) {
    const { hooks } = this;
    invariant(key in hooks, `plugin.get: hook ${key} cannot be got`);

    return hooks[key];
  }
}

export default PluginSystem;
