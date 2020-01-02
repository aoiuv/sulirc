import { createHeaderSep } from "../utils";

createHeaderSep('reflect');

@Reflect.metadata('inClass', 'A')
class Test {
  @Reflect.metadata('inMethod', 'B')
  public hello(): string {
    return 'hello world';
  }
}

console.log(Reflect.getMetadata('inClass', Test)); // 'A'
console.log(Reflect.getMetadata('inMethod', new Test(), 'hello')); // 'B'

console.log('//////////////////////////');
function logger() {
  console.log('logger fn');
}
Reflect.defineMetadata('logger-meta0', 'Cool!', logger)
Reflect.metadata('logger-meta', 'yo!')(logger);
Reflect.metadata('logger-meta2', 'Hi!')(logger);
console.log(Reflect.getMetadata('logger-meta', logger));
console.log(Reflect.getMetadataKeys(logger));
console.log(Reflect.hasMetadata('logger-meta2', logger));
console.log(Reflect.hasMetadata('logger-meta3', logger));