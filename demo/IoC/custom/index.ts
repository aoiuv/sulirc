import { TYPES } from './const';
import { Katana, Shuriken, Ninja } from './entities';

type Constructor<T = any> = new (...args: any[]) => T;

class Container<T> {
  target: Constructor<T>;
  bindTags = {};
  constructor(target: Constructor<T>) {
    this.target = target;
  }

  bind(tag: string | symbol, to: Constructor) {
    this.bindTags[tag] = to;
  }

  get(): T {
    const providers = [];
    const target = this.target;
    for (let i = 0; i < target.length; i++) {
      const paramtypes = Reflect.getMetadata('custom:paramtypes#' + i, target);
      const provider = this.bindTags[paramtypes.value];

      providers.push(provider);
    }

    return new target(...providers.map(provider => new provider()));
  }
}

const container = new Container(Ninja);

container.bind(TYPES.Weapon, Katana);
container.bind(TYPES.ThrowableWeapon, Shuriken);

const ninja = container.get();

console.log(ninja.fight());
console.log(ninja.sneak());
