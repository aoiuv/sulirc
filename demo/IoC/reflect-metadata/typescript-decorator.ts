import { isFunction } from 'lodash';

const METHOD_METADATA = 'method';
const PATH_METADATA = 'path';

const Controller = (path: string): ClassDecorator => {
  return target => {
    Reflect.defineMetadata(PATH_METADATA, path, target);
  };
};

const createMappingDecorator = (method: string) => (path: string): MethodDecorator => {
  return (target, key, descriptor) => {
    Reflect.defineMetadata(PATH_METADATA, path, descriptor.value);
    Reflect.defineMetadata(METHOD_METADATA, method, descriptor.value);
  };
};

const Get = createMappingDecorator('GET');
const Post = createMappingDecorator('POST');

@Controller('/test')
class SomeTestClass {
  @Get('/a')
  someGetMethod() {
    return 'hello world';
  }

  @Post('/b')
  somePostMethod() {}
}

function isConstructor(f: any) {
  try {
    new f();
  } catch (err) {
    // verify err is the expected error and then
    return false;
  }
  return true;
}

function mapRoute(instance: Object) {
  const prototype = Object.getPrototypeOf(instance);

  // 筛选出类的 methodName
  const methodsNames = Object.getOwnPropertyNames(prototype).filter(item => !isConstructor(item) && isFunction(prototype[item]));

  return methodsNames.map(methodName => {
    const fn = prototype[methodName];

    // 取出定义的 metadata
    const route = Reflect.getMetadata(PATH_METADATA, fn);
    const method = Reflect.getMetadata(METHOD_METADATA, fn);
    return {
      route,
      method,
      fn,
      methodName
    };
  });
}

Reflect.getMetadata(PATH_METADATA, SomeTestClass); // '/test'

const routes = mapRoute(new SomeTestClass());
console.log(routes);
