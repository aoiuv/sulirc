import { TYPES } from './const';
import { Katana, Shuriken, Ninja } from './entities';
import { Warrior, Weapon, ThrowableWeapon } from './interfaces';

type Constructor<T = any> = new (...args: any[]) => T;

class Container {
  bindTags = {};

  bind<T>(tag: string | symbol) {
    return {
      to: (bindTarget: Constructor<T>) => {
        this.bindTags[tag] = bindTarget;
      }
    }
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

container.bind<Weapon>(TYPES.Weapon).to(Katana);
container.bind<ThrowableWeapon>(TYPES.ThrowableWeapon).to(Shuriken);
container.bind<Warrior>(TYPES.Warrior).to(Ninja);

const ninja = container.get<Ninja>(TYPES.Warrior);

console.log(ninja.fight());
console.log(ninja.sneak());
