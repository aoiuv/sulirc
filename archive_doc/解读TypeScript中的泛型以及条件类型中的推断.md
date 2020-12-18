## 前言

说一下为什么要写这篇文章，笔者近三个月内开始接触并使用 TypeScript 开发项目，一开始总觉得多余又耗费时间，好在笔者有一个优点就是算是愿意爱折腾爱学习，不管有用没用~

近来发现 TypeScript 已成一种趋势，基本已成大型项目的标配。TypeScript 弥补了弱类型的 JavaScript 所带来的一些缺点，可以帮助我们构建更稳健的代码，同时也增强可阅读性和可维护性。可以使得许多运行时才能出现的错误，在编译时就暴露出来，让潜在的问题更容易发现。

笔者在学习 TypeScript 的过程中，觉得 TypeScript 比较难以理解和需要花费时间的点，就是泛型以及相关特性了，比如条件推断 infer 等（当然，也是很有意思的一部分）。这篇文章就总结并和大家分享一下一些相关知识~

## 泛型

TypeScript 中泛型设计的目的是使在成员之间提供有意义的约束，为代码增加抽象层和提升可重用性。泛型可以应用于 Typescript 中的函数（函数参数、函数返回值）、接口和类（类的实例成员、类的方法）。

### 简单示例

先来看这个如果平常我们写函数的参数和返回值类型可能会这么写~约束了函数参数和返回值必须为数字类型。

```ts
function identity(arg: number): number {
  return arg;
}
```

那么问题来了。如果我要参数和返回值类型限定为字符串类型的话，又改成这么写。

```ts
function identity(arg: string): string {
  return arg;
}
```

不科学呀！当函数想支持多类型参数或返回值的时候，上述写法将变得十分不灵活。于是泛型就粉墨登场了！

考虑以下写法：

```ts
function identity<T>(arg: T): T {
  return arg;
}
```

```ts
function identities<T, U>(arg1: T, arg2: U): [T, U] {
  return [arg1, arg2];
}
```

使用泛型后，可以接受任意类型，但是又完成了函数参数和返回值的约束关系。十分灵活~可复用性大大增强了！

## 泛型约束

有时候我们定义的泛型不想过于灵活，可以通过 extends 给泛型加上约束。

```ts
interface ILengthwise {
  length: number;
}

function loggingIdentity<T extends ILengthwise>(arg: T): T {
  console.log(arg.length);
  return arg;
}
```

其实泛型我们在 React 组件里也很常见（说不定大家觉得很眼熟了）,用泛型确保了 React 组件的 Props 和 State 是类型安全的~

```ts
interface ICustomToolProps {
  // @TODO
}

interface ICustomToolState {
  // @TODO
}

class CustomTool extends React.Component<ICustomToolProps, ICustomToolState> {
  // @TODO
}
```

所以大家看上面的 ICustomToolProps、ICustomToolState 其实也是泛型。应用在类上面的泛型语法简化如下示例：

```ts
class Directive<T> {
  private name: T;
  public getName(): T {
    return this.name;
  }
  // @TODO
}
```

当使用泛型时，一般情况下常用 T、U、V 表示，如果比较复杂，应使用更优语义化的描述，比如上述 React 组件示例。

## 实践一下

比如说设计一个指令管理者对象~用来管理指令

```ts
enum EDirective {
  Walk = 1,
  Jump = 2,
  Smile = 3
}
class DirectiveManager<T> {
  private directives: Array<T> = [];
  add = (directive: T): Array<T> => {
    this.directives = this.directives.concat(directive);
    return this.directives;
  };
  get = (index: number): T => {
    return this.directives[index];
  };
  shift = (): Array<T> => {
    this.directives = this.directives.slice(1);
    return this.directives;
  };
  // @TODO
}
```

初始化一个指令管理者的实例。给定泛型为 number 类型。
![](https://user-gold-cdn.xitu.io/2019/7/11/16bdf6f683f5f2c6?w=1410&h=266&f=png&s=53073)

可以发现指令管理者对象成功被限定类型，如果传参类型错误，会被 TypeScript 及时提醒。

## 了解数组方法的泛型

经过上面的介绍，相信大家都对泛型有一定了解了！那么接下来通过带大家看 JavaScript 数组方法的泛型来加深理解~

我们来阅读以下数组对象的属性以及方法的泛型（我抽取了一部分，希望大家不要觉得代码过长，就略过不读，我觉得也是换一种方式熟悉 JavaScript 语法的一种方式~）

```ts
interface Array<T> {
  length: number;
  [n: number]: T;

  reverse(): T[];

  shift(): T;
  pop(): T;

  unshift(...items: T[]): number;
  push(...items: T[]): number;

  slice(start?: number, end?: number): T[];
  sort(compareFn?: (a: T, b: T) => number): T[];
  indexOf(searchElement: T, fromIndex?: number): number;
  lastIndexOf(searchElement: T, fromIndex?: number): number;
  every(callbackfn: (value: T, index: number, array: T[]) => boolean, thisArg?: any): boolean;
  some(callbackfn: (value: T, index: number, array: T[]) => boolean, thisArg?: any): boolean;
  forEach(callbackfn: (value: T, index: number, array: T[]) => void, thisArg?: any): void;
  map<U>(callbackfn: (value: T, index: number, array: T[]) => U, thisArg?: any): U[];
  filter(callbackfn: (value: T, index: number, array: T[]) => boolean, thisArg?: any): T[];

  splice(start: number): T[];
  splice(start: number, deleteCount: number, ...items: T[]): T[];

  concat<U extends T[]>(...items: U[]): T[];
  concat(...items: T[]): T[];

  reduce(
    callbackfn: (previousValue: T, currentValue: T, currentIndex: number, array: T[]) => T,
    initialValue?: T
  ): T;
  reduce<U>(
    callbackfn: (previousValue: U, currentValue: T, currentIndex: number, array: T[]) => U,
    initialValue: U
  ): U;

  reduceRight(
    callbackfn: (previousValue: T, currentValue: T, currentIndex: number, array: T[]) => T,
    initialValue?: T
  ): T;
  reduceRight<U>(
    callbackfn: (previousValue: U, currentValue: T, currentIndex: number, array: T[]) => U,
    initialValue: U
  ): U;
}
```

相信大家对数组方法都十分熟悉了~下面将带大家稍微看一下部分方法

### shift/pop & push/unshift

```ts
shift(): T;
pop(): T;

unshift(...items: T[]): number;
push(...items: T[]): number;
```

平时大家可能会混淆几个方法。但是看了它们的函数签名后，是否觉得一目了然。push/unshift 方法调用后返回时数字类型，也就是其数组长度。而 shift/pop 方法调用后返回了弹出的元素，

### forEach & map

```ts
forEach(callbackfn: (value: T, index: number, array: T[]) => void, thisArg?: any): void;
map<U>(callbackfn: (value: T, index: number, array: T[]) => U, thisArg?: any): U[];
```

这两个方法很值得一说，因为两者都具备遍历的特征，所以常见很多同学们混用这两个方法，其实大有讲究。看到 forEach 的方法其实是返回 void 的，而在 map 方法里，最终是将 T[] 映射成了 U[]。所以呢，一言以蔽之，forEach 一般用来执行副作用的，比如持久的修改一下元素、数组、状态等，以及打印日志等，本质上是不纯的。而 map 方法用来作为值的映射，本质上是纯净的，在函数式编程里十分重要。

### concat

splice、concat、reduce、reduceRight 这些方法基本都重载了两次，也就明显告诉我们这些方法是有多种传参调用方式的。

比如`concat<U extends T[]>(...items: U[]): T[];`这里使用到了上述和大家介绍的泛型约束，意思为可以传递多个数组元素。下面紧跟着的`concat(...items: T[]): T[];`则告诉我们也可以传递多个元素。两个函数签名都告诉我们函数返回一个数组，它由被调用的对象中的元素组成，每个参数的顺序依次是该参数的元素（如果参数是数组）或参数本身（如果参数不是数组）。它不会递归到嵌套数组参数中。

## 映射类型

有时候我们有从旧类型中创建新类型的一个需求场景，TypeScript 提供了映射类型这种方式。 在映射类型里，新类型以相同的形式去转换旧类型里每个属性

比如我们将每个属性成为 readonly 类型，如图

```ts
type Readonly<T> = { readonly [P in keyof T]: T[P] };
```

![](https://user-gold-cdn.xitu.io/2019/7/11/16bdce2170bf4a3f?w=740&h=318&f=png&s=46993)

同理如下，见图可理解~

```ts
type Partial<T> = { [P in keyof T]?: T[P] };
```

![](https://user-gold-cdn.xitu.io/2019/7/11/16bdce2e2cf76783?w=582&h=334&f=png&s=36789)

那么大家应该也 get 到下述代码的意图了~

```ts
type Nullable<T> = { [P in keyof T]: T[P] | null };
```

扩展一下可以写任意的映射类型来满足自己的需求场景~

```ts
enum EDirective {
  Walk = 1,
  Jump = 2,
  Smile = 3
}
type DirectiveKeys = keyof typeof EDirective;
type Flags = { [K in DirectiveKeys]: boolean };
```

![](https://user-gold-cdn.xitu.io/2019/7/11/16bdce5d34de7e3c?w=784&h=420&f=png&s=54462)

```ts
type Pick<T, K extends keyof T> = { [P in K]: T[P] };
type Record<K extends string, T> = { [P in K]: T };
```

## 条件类型中的推断

infer 表示在 extends 条件语句中待推断的类型变量。

在条件类型的 extends 语句中，我们可以用 infer 声明一个类型变量，然后在其分支语句中使用该类型变量。如果不懂，没有关系，请继续看下面的例子~

### 提取函数参数 & 提取函数返回值

该语句中的`(param: infer P)`，为函数首个参数推断声明了一个类型变量 P，如果泛型 T 是一个函数，则根据之前的类型变量 P，提取其推断的函数参数并返回，否则返回原有类型。

```ts
type ParamType<T> = T extends (param: infer P) => any ? P : T;
```

![](https://user-gold-cdn.xitu.io/2019/7/11/16bdf80880bf34c1?w=1126&h=250&f=png&s=41753)

如图所以，成功提取了 IPrint 的参数类型。

同理如下，提取返回值同样理解~

```ts
type ReturnType<T> = T extends (...args: any[]) => infer P ? P : any;
```

### 提取构造函数参数类型 & 提取实例类型

下述代码可以提取构造函数参数类型~

```ts
type ConstructorParameters<T extends new (...args: any[]) => any> = T extends new (
  ...args: infer P
) => any
  ? P
  : never;
```

![](https://user-gold-cdn.xitu.io/2019/7/11/16bdf8879b5a397e?w=1230&h=394&f=png&s=64872)

`T extends new (...args: any[]) => any`这里用到了泛型约束，`new (...args: infer P)`这一句将参数推断声明为类型变量 P。剩余的还是一样的理解~

下述提取实例类型~（和提取构造函数参数类型小有不同~同学们自己发现一下）

```ts
type InstanceType<T extends new (...args: any[]) => any> = T extends new (...args: any[]) => infer R
  ? R
  : any;
```

## 其他常用的条件推断

剩余的列举一些比较实用的，参照上述方式理解，同学们如若感兴趣，可自行谷歌~

### 提取数组子元素

```ts
type Flatten<T> = T extends (infer U)[] ? U : T;
```

### 提取 Promise 值

```ts
type Unpromisify<T> = T extends Promise<infer R> ? R : T;
```

### Tuple 转 Union

```ts
type ElementOf<T> = T extends Array<infer E> ? E : never;
```

### Union 转 Intersection

```ts
type UnionToIntersection<U> = (U extends any ? (k: U) => void : never) extends ((
  k: infer I
) => void)
  ? I
  : never;
```

## 提示

泛型在编译期间被删除，因此不要在泛型函数中写 typeof T、new T、instanceof T。

## 什么时候使用泛型？

1. 当函数、接口、类是接受多类型参数的时候，可以用泛型提高可重用性。
2. 当函数、接口、类需要在多个地方用到某个类型的时候。

## 小结

总的来说，在一个中大型项目里采用 TypeScript 目前看来还是十分有价值的，可以在开发过程中给到更多约束，从而大大减少运行时的错误。笔者建议大家可以多多学习 TypeScript，从而写出更加工整，健壮的代码。

而此篇文章介绍的泛型和条件推断可以让大家写出更加灵活，具有可扩展性的 TypeScript 类型哈哈哈哈~

以上~谢谢大家的阅读，如对大家有所助益，不胜荣幸~

## 参考资料

- [Typescript Advanced Types](https://www.typescriptlang.org/docs/handbook/advanced-types.html)
- [TypeScript tests/lib/lib.d.ts](https://github.com/microsoft/TypeScript/blob/master/tests/lib/lib.d.ts)
- [Distributive conditional types](https://www.typescriptlang.org/docs/handbook/release-notes/typescript-2-8.html#distributive-conditional-types)
- [Type inference in conditional types](https://github.com/Microsoft/TypeScript/pull/21496)
- [Typescript Generics Explained](https://medium.com/@rossbulat/typescript-generics-explained-15c6493b510f)
