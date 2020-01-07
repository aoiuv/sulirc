import { TYPES } from './const';
import { Katana, Shuriken, Ninja } from './entities';

type Constructor<T = any> = new (...args: any[]) => T;
const Container = <T>(target: Constructor<T>) => {
  const DYNAMIC_INJECT_MAP = {
    [TYPES.Weapon]: Katana,
    [TYPES.ThrowableWeapon]: Shuriken,
    [TYPES.Warrior]: Ninja
  };

  const providers = [];
  for (let i = 0; i < target.length; i++) {
    const paramtypes = Reflect.getMetadata("custom:paramtypes#" + i, target);
    const provider = DYNAMIC_INJECT_MAP[paramtypes.value];

    providers.push(provider);
  }

  return new target(...providers.map(provider => new provider()));
};

const container = Container(Ninja);

console.log(container.fight());
console.log(container.sneak());
