import { createHeaderSep } from "../utils";

createHeaderSep('IoC');

type Constructor<T = any> = new (...args: any[]) => T;

const Injectable = (): ClassDecorator => target => {
  console.log('Injectable decorator', target);
};

class OtherService {
  a = 1;
}

class OtherService2 {
  b = 'yey!'
}

@Injectable()
class TestService {
  constructor(
    public readonly otherService: OtherService,
    public readonly otherService2: OtherService2
  ) {}

  testMethod() {
    console.log(this.otherService.a);
    console.log(this.otherService2.b);
  }
}

const Factory = <T>(target: Constructor<T>): T => {
  // 获取所有注入的服务
  const providers = Reflect.getMetadata('design:paramtypes', target); // [OtherService, OtherService2]

  console.log('providers', providers);

  const args = providers.map((provider: Constructor) => new provider());
  return new target(...args);
};

Factory(TestService).testMethod(); // 1
