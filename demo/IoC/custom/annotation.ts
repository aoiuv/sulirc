import * as CONST from './const';
import interfaces from './interfaces';

export function injectable() {
  return function(target: any) {
    if (Reflect.getOwnMetadata(CONST.PARAM_TYPES, target)) {
      throw new Error('duplicated injectable decorator');
    }

    const types = Reflect.getMetadata(CONST.DESIGN_PARAM_TYPES, target) || [];
    Reflect.defineMetadata(CONST.PARAM_TYPES, types, target);

    return target;
  };
}


export function inject(serviceIdentifier: interfaces.ServiceIdentifier<any>) {
  return function(target: any, propertyKey: string | Symbol, parameterIndex: string) {

  }
}