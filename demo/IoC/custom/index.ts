import { TYPES } from './const';
import { Katana, Shuriken, Ninja } from './entities';

type Constructor<T = any> = new (...args: any[]) => T;

class Container {
  bindTags = {};

  bind(tag: string | symbol, to: Constructor) {
    this.bindTags[tag] = to;
  }

  get<T>(tag: string | symbol): T {
    const target = this.bindTags[tag];
    const providers = [];
    for (let i = 0; i < target.length; i++) {
      const paramtypes = Reflect.getMetadata('custom:paramtypes#' + i, target);
      const provider = this.bindTags[paramtypes.value];

      providers.push(provider);
    }

    return new target(...providers.map(provider => new provider()));
  }
}

const container = new Container();

container.bind(TYPES.Weapon, Katana);
container.bind(TYPES.ThrowableWeapon, Shuriken);
container.bind(TYPES.Warrior, Ninja);

const ninja = container.get<Ninja>(TYPES.Warrior);

console.log(ninja.fight());
console.log(ninja.sneak());
