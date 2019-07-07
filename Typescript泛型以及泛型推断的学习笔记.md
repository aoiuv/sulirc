## 前言

## 类型保护

## 映射类型

```ts
type Readonly<T> = { readonly [P in keyof T]: T[P] };
type Partial<T> = { [P in keyof T]?: T[P] };
type Nullable<T> = { [P in keyof T]: T[P] | null }
```

```ts
enum EDirective {
    drawStart = 1,
    drawMove = 2,
    drawEnd = 3
}
type DirectiveKeys = keyof typeof EDirective;
type Flags = { [K in DirectiveKeys]: boolean };
```

```ts
type Pick<T, K extends keyof T> = {
    [P in K]: T[P];
}
type Record<K extends string, T> = {
    [P in K]: T;
}
```
## 泛型

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

## 泛型推断

```ts
type Flatten<T> = T extends (infer U)[] ? U : T;
```

```ts
type Unpromisify<T> = T extends Promise<infer R> ? R : T;
```

## 小结

[TypeScript tests/lib/lib.d.ts](https://github.com/microsoft/TypeScript/blob/master/tests/lib/lib.d.ts)