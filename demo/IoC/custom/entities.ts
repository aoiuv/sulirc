import "reflect-metadata";
import { inject, injectable } from "./annotation";
import { Weapon, ThrowableWeapon, Warrior } from "./interfaces";
import { TYPES } from "./const";

// @injectable()
export class Katana implements Weapon {
  public hit() {
    return "cut!";
  }
}

// @injectable()
export class Shuriken implements ThrowableWeapon {
  public throw() {
    return "hit!";
  }
}

// @injectable()
export class Ninja implements Warrior {
  private _katana: Weapon;
  private _shuriken: ThrowableWeapon;

  public constructor(
    @inject(TYPES.Weapon) katana: Weapon,
    @inject(TYPES.ThrowableWeapon) shuriken: ThrowableWeapon
  ) {
    this._katana = katana;
    this._shuriken = shuriken;
  }

  public fight() {
    return this._katana.hit();
  }

  public sneak() {
    return this._shuriken.throw();
  }
}
