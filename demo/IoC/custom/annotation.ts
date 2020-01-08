import * as CONST from "./const";
import interfaces from "./interfaces";

export function injectable() {
  return function(target: any) {
    if (Reflect.getOwnMetadata(CONST.PARAM_TYPES, target)) {
      throw new Error("duplicated injectable decorator");
    }

    const types = Reflect.getMetadata(CONST.DESIGN_PARAM_TYPES, target) || [];
    console.log('[injectable]', target, types);
    Reflect.defineMetadata(CONST.PARAM_TYPES, types, target);

    return target;
  };
}

// export function inject(serviceIdentifier: interfaces.ServiceIdentifier<any>) {
//   return function(target: any, propertyKey: string, parameterIndex: number) {
//     const metadata = {
//       key: CONST.INJECT_TAG,
//       value: serviceIdentifier
//     };
  
//     Reflect.defineMetadata(CONST.PARAM_TYPES + `#${parameterIndex}`, metadata, target);
//   };
// }

export function inject(serviceIdentifier: string | symbol) {
  return function(target: any, propertyKey: string, parameterIndex: number) {
    console.log(target, propertyKey, parameterIndex);
    const metadata = {
      key: CONST.INJECT_TAG,
      value: serviceIdentifier
    };
  
    Reflect.defineMetadata(CONST.PARAM_TYPES + `#${parameterIndex}`, metadata, target);
  };
}
