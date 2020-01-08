在此篇文章开始之前，先向大家简单介绍 IoC。什么是 IoC？以及为什么我们需要 IoC？以及本文核心，在 TypeScript 中实现一个简单的 IoC 容器？

## IoC 定义

我们看维基百科定义：

> 控制反转（Inversion of Control，缩写为 IoC），是面向对象编程中的一种设计原则，可以用来减低计算机代码之间的耦合度。其中最常见的方式叫做依赖注入（Dependency Injection，简称 DI），还有一种方式叫“依赖查找”（Dependency Lookup）。通过控制反转，对象在被创建的时候，由一个调控系统内所有对象的外界实体，将其所依赖的对象的引用传递(注入)给它。 ———— 维基百科

简单来说，IoC 本质上是一种设计思想，可以将对象控制的所有权交给容器。由容器注入依赖到指定对象中。由此实现对象依赖解耦。

## 初识 Container

假设我们有三个接口： Warrior 战士、Weapon 武器、ThrowableWeapon 投掷武器。

```ts
export interface Warrior {
  fight(): string;
  sneak(): string;
}

export interface Weapon {
  hit(): string;
}

export interface ThrowableWeapon {
  throw(): string;
}
```

对应分别有实现这三个接口的类：Katana 武士刀、Shuriken 手里剑、以及 Ninja 忍者。

```ts
export class Katana implements Weapon {
  public hit() {
    return "cut!";
  }
}

export class Shuriken implements ThrowableWeapon {
  public throw() {
    return "hit!";
  }
}

export class Ninja implements Warrior {
  private _katana: Weapon;
  private _shuriken: ThrowableWeapon;

  public constructor() {
    this._katana = new Katana();
    this._shuriken = new Shuriken();
  }

  public fight() {
    return this._katana.hit();
  }

  public sneak() {
    return this._shuriken.throw();
  }
}
```

由上面的示例，很明显我们可以得知，Ninja 类依赖了 Katana 类和 Shuriken 类。这种依赖关系对于我们来说很常见，但是随着应用的日益迭代，越来越复杂的情况下，类与类之间的耦合度也会越来越高，应用会变得越来越难以维护。

对于上述 Ninja 类来说，如若日后需要不断新增其他武器对象，甚至忍术对象，这个 Ninja 类文件会引入越来越多的对象，Ninja 类也会越来越臃肿。如果一个应用内部每一个类都对彼此产生依赖，可能代码写到后面就是沉重的技术债了。

因此 IoC 的思想的出现，就是为了实现对象依赖解耦。

那么先带大家简单认识 IoC 容器的使用。

```ts
const container = new Container();

const TYPES = {
  Warrior: Symbol.for("Warrior"),
  Weapon: Symbol.for("Weapon"),
  ThrowableWeapon: Symbol.for("ThrowableWeapon")
};

container.bind<Weapon>(TYPES.Weapon).to(Katana);
container.bind<ThrowableWeapon>(TYPES.ThrowableWeapon).to(Shuriken);
container.bind<Warrior>(TYPES.Warrior).to(Ninja);

const ninja = container.get<Ninja>(TYPES.Warrior);

ninja.fight(); // "cut!"
ninja.sneak(); // "hit!"
```

上面的 Container 实际上接手了对象依赖的管理，使得 Ninja 类脱离了对 Katana 类和 Shuriken 类的依赖！

使得 Ninja 类只依赖抽象的接口（Weapon、ThrowableWeapon）而不是依赖具体的类（Katana、Shuriken）。

## 原理揭秘

那么 Container 怎样做到的呢？它的实现原理又是怎样的呢？是不是很好奇？其实没有什么黑魔法，接下来就会为大家揭开 Container 实现 IoC 原理的神秘面纱。

首先我们先将 Ninja 类改写如下：

```ts
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
```

### @inject

可以发现。我们在 Ninja 类的构造函数里对每个参数进行了 @inject 装饰器声明。那么这个@inject 又干了什么事情？。@inject 也不过是我们实现的一个装饰器函数而已，代码如下：

```ts
export function inject(serviceIdentifier: string | symbol) {
  return function(target: any, propertyKey: string, parameterIndex: number) {
    const metadata = {
      key: "inject.tag",
      value: serviceIdentifier
    };

    Reflect.defineMetadata(`custom:paramtypes#${parameterIndex}`, metadata, target);
  };
}
```

这里出现了 Reflect.defineMetadata，大家可能比较陌生。Reflect Metadata 是 ES7 的一个提案，它主要用来在声明的时候添加和读取元数据。

提案文档： [Metadata Proposal - ECMAScript](https://rbuckton.github.io/reflect-metadata/)。

想要使用此特性，需要安装 reflect-metadata 这个包，同时配置 tsconfig 如下：

```json
{
  "compilerOptions": {
    "target": "es5",
    "lib": ["es6", "DOM"],
    "types": ["reflect-metadata"],
    "module": "commonjs",
    "moduleResolution": "node",
    "experimentalDecorators": true,
    "emitDecoratorMetadata": true
  }
}
```

在这个场景下，我为 @inject 对象里每个传入的参数自定义了 metadataKey。比如在上述@inject(TYPES.Weapon)中，target 就是 Ninja 类，parameterIndex 就是 0。@inject(TYPES.ThrowableWeapon)同样道理。

因此在 Ninja 类里，根据@inject 装饰器的声明，在运行时给 Ninja 类添加了两个元数据。

```
custom:paramtypes#0 -> { key: "inject.tag", value: TYPES.Weapon }
custom:paramtypes#1 -> { key: "inject.tag", value: TYPES.ThrowableWeapon }
```

### Container

IoC 容器的主要功能是什么呢？

- 类的实例化
- 查找对象的依赖关系

以下是一个十分简单的 Container 容器。

```ts
type Constructor<T = any> = new (...args: any[]) => T;

class Container {
  bindTags = {};

  bind<T>(tag: string | symbol) {
    return {
      to: (bindTarget: Constructor<T>) => {
        this.bindTags[tag] = bindTarget;
      }
    };
  }

  get<T>(tag: string | symbol): T {
    const target = this.bindTags[tag];
    const providers = [];
    for (let i = 0; i < target.length; i++) {
      const paramtypes = Reflect.getMetadata("custom:paramtypes#" + i, target);
      const provider = this.bindTags[paramtypes.value];

      providers.push(provider);
    }

    return new target(...providers.map(provider => new provider()));
  }
}
```
