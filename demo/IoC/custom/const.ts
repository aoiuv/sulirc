// used to access design time types
export const DESIGN_PARAM_TYPES = "design:paramtypes";
// used to store types to be injected
export const PARAM_TYPES = "custom:paramtypes";
// The type of the binding at design time
export const INJECT_TAG = "inject";
// types
export const TYPES = {
  Warrior: Symbol.for('Warrior'),
  Weapon: Symbol.for('Weapon'),
  ThrowableWeapon: Symbol.for('ThrowableWeapon')
};