import 'reflect-metadata';
import { Weapon, ThrowableWeapon, Warrior } from './interfaces';

class Katana implements Weapon {
  public hit() {
    return 'cut!';
  }
}

class Shuriken implements ThrowableWeapon {
  public throw() {
    return 'hit!';
  }
}

class Ninja implements Warrior {
  private _katana: Weapon;
  private _shuriken: ThrowableWeapon;

  public constructor(katana: Weapon, shuriken: ThrowableWeapon) {
    this._katana = katana;
    this._shuriken = shuriken;
  }

  public fight() {
    return this._katana.hit();
  }
  public sneak() {
    return this._shuriken.throw();
  }
  // public parameterDecoratorTestFunc(@parameter('#tag') a: boolean) {
  //   return a;
  // }
}


