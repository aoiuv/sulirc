## 前言

说一下为什么要写这篇文章，笔者近三个月内开始接触并使用 TypeScript 开发项目，一开始总觉得多余又耗费时间，好在笔者有一个优点就是算是愿意爱折腾爱学习，不管有用没用~

近来发现 TypeScript 已成一种趋势，基本已成大型项目的标配。TypeScript 弥补了弱类型的 JavaScript 所带来的一些缺点，可以帮助我们构建更稳健的代码，同时也增强可阅读性和可维护性。可以使得许多运行时才能出现的错误，在编译时就暴露出来，让潜在的问题更容易发现。

笔者在学习 TypeScript 的过程中，觉得 TypeScript 比较难以理解和需要花费时间的点，就是泛型以及相关特性了，比如条件推断 infer 等（当然，也是很有意思的一部分）。这篇文章就总结并和大家分享一下一些相关知识~

## 泛型

TypeScript 中泛型设计的目的是使在成员之间提供有意义的约束，为代码增加抽象层和提升可重用性。泛型可以应用于 Typescript 中的函数（函数参数、函数返回值）、接口和类（类的实例成员、类的方法）。

### 简单示例

先来看这个

```ts
function identity(arg: number): number {
  return arg;
}
```

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

## 泛型约束

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
interface IBreadcrumbProps {
  // @TODO
}

interface IBreadcrumbState {
  // @TODO
}

class CustomTools extends React.Component<IBreadcrumbProps, IBreadcrumbState> {
  // @TODO
}
```

## 实践一下

比如说设计一个指令对象~

```ts
class DirectiveManager<T> {
  private directives = [];
  add = (directive: T): Array<T> => {
    this.directives = this.directives.concat(directive);
    return this.directives;
  };
  get = (index: number): T => {
    return this.directives[index];
  };
  next = (): Array<T> => {
    this.directives = this.directives.slice(1);
    return this.directives;
  };
}
```

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

相信大家对数组方法都十分熟悉了，看完它们的泛型后，是不是觉得又加深了理解呢？尤其 splice、concat、reduce、reduceRight 这些方法基本都重载了两次，也就明显告诉我们这个方法是有两种调用方式的。

### push/unshift 与 shift/pop

平时大家可能会混淆几个方法。但是看了它们的函数签名后，是否觉得一目了然。push/unshift `unshift(...items: T[]): number;` 方法调用后返回时数字类型，也就是其数组长度。而 shift/pop `shift(): T;` 方法调用后返回了弹出的元素，

### map

### concat

比如`concat<U extends T[]>(...items: U[]): T[];`这里使用到了上述和大家介绍的泛型约束，意思为可以传递多个数组元素。下面紧跟着的`concat(...items: T[]): T[];`则告诉我们也可以传递多个元素。两个函数签名都告诉我们函数返回一个数组，它由被调用的对象中的元素组成，每个参数的顺序依次是该参数的元素（如果参数是数组）或参数本身（如果参数不是数组）。它不会递归到嵌套数组参数中。

当使用泛型时，一般情况下常用 T、U、V 表示，如果比较复杂，应使用更优语义化的描述，比如上述 React 组件示例。

## 映射类型

```ts
type Readonly<T> = { readonly [P in keyof T]: T[P] };
type Partial<T> = { [P in keyof T]?: T[P] };
type Nullable<T> = { [P in keyof T]: T[P] | null };
```

```ts
enum EDirective {
  Walk = 1,
  Jump = 2,
  Smile = 3
}
type DirectiveKeys = keyof typeof EDirective;
type Flags = { [K in DirectiveKeys]: boolean };
```

```ts
type Pick<T, K extends keyof T> = { [P in K]: T[P] };
type Record<K extends string, T> = { [P in K]: T };
```

## 推断

infer 表示在 extends 条件语句中待推断的类型变量。

### 提取函数参数

```ts
type ParamType<T> = T extends (param: infer P) => any ? P : T;
```

### 提取函数类型的返回值类型

```ts
type ReturnType<T> = T extends (...args: any[]) => infer P ? P : any;
```

### 提取参数类型

```ts
type ConstructorParameters<T extends new (...args: any[]) => any> = T extends new (
  ...args: infer P
) => any
  ? P
  : never;
```

### 提取实例类型

```ts
type InstanceType<T extends new (...args: any[]) => any> = T extends new (...args: any[]) => infer R
  ? R
  : any;
```

### 提取数组子元素

```ts
type Flatten<T> = T extends (infer U)[] ? U : T;
```

### 提取 Promise 值

```ts
type Unpromisify<T> = T extends Promise<infer R> ? R : T;
```

### Tuple -> Union

```ts
type ElementOf<T> = T extends Array<infer E> ? E : never;
```

### Union -> Intersection

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

## 参考资料

- [Typescript Advanced Types](https://www.typescriptlang.org/docs/handbook/advanced-types.html)
- [TypeScript tests/lib/lib.d.ts](https://github.com/microsoft/TypeScript/blob/master/tests/lib/lib.d.ts)
- [Distributive conditional types](https://www.typescriptlang.org/docs/handbook/release-notes/typescript-2-8.html#distributive-conditional-types)
- [Type inference in conditional types](https://github.com/Microsoft/TypeScript/pull/21496)
- [Typescript Generics Explained](https://medium.com/@rossbulat/typescript-generics-explained-15c6493b510f)
