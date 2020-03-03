export const undef = (v: any) => v === null || v === undefined;
export const notUndef = (v: any) => v !== null && v !== undefined;
export const func = (f: any) => typeof f === 'function';
export const number = (n: any) => typeof n === 'number';
export const string = (s: any) => typeof s === 'string';
export const array = Array.isArray;
export const object = (obj: any) => obj && !array(obj) && typeof obj === 'object';
export const promise = (p: any) => p && func(p.then);
export const symbol = (sym: any) =>
  Boolean(sym) && typeof Symbol === 'function' && sym.constructor === Symbol && sym !== Symbol.prototype;
