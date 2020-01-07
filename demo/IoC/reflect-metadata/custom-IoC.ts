import { createHeaderSep } from "../utils";;

createHeaderSep('custom-IoC');

function injectable() {
  return function (target: any) {
    const types = Reflect.getMetadata('design:paramtypes', target) || [];
    Reflect.defineMetadata('design:paramtypes', types, target);

    return target;
  }
}

function inject(serviceIdentifier: ServiceIdentifier<any>) {
  return function (target: any, targetKey: string, index?: number): void {
    
  }
}

@injectable()
class Katana implements Weapon {
  public hit() {
    return 'cut!';
  }
}

@injectable()
class Shuriken implements ThrowableWeapon {
  public throw() {
    return 'hit';
  }  
}

@injectable()
class Ninja implements Warrior {
  public fight() {
    return '';
  }

  public sneak() {
    return '';
  }
}

// interface
interface Warrior {
  fight(): string;
  sneak(): string;
}

interface Weapon {
  hit(): string;
}

interface ThrowableWeapon {
  throw(): string;
}

type Newable<T> = new (...args: any[]) => T;

interface Abstract<T> {
    prototype: T;
}

type ServiceIdentifier<T> = (string | symbol | Newable<T> | Abstract<T>);
