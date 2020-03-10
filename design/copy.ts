/**
 * 深拷贝与浅拷贝
 */

import { isPlainObject, isArray } from "lodash";

export function extend(target: any, source: any, deep: boolean) {
  for (let key in source)
    if (deep && (isPlainObject(source[key]) || isArray(source[key]))) {
      if (isPlainObject(source[key]) && !isPlainObject(target[key])) target[key] = {};
      if (isArray(source[key]) && !isArray(target[key])) target[key] = [];
      extend(target[key], source[key], deep);
    } else if (source[key] !== undefined) {
      target[key] = source[key];
    }
}
