## 前言

首先。本篇文章是我精读 [the-super-tiny-compiler](https://the-super-tiny-compiler.glitch.me/) 这个 repo 的源代码后的一丢丢感悟（推荐大家去读）。纯属个人兴趣。本人对编译原理基本没有涉猎。但笔者尽量描述严谨，但不保证以下的相关描述十分专业。因此欢迎各位同学指正。

正文开始！

首先，大家可以在 [astexplorer](https://astexplorer.net/) 这个网站上输入一段 javascript 代码。比如我输入了 `add(3, div(8, 2))` 这么一句。解析器默认挑选了 [acorn](https://github.com/acornjs/acorn)。解析出来的抽象语法树 ast 如下右侧：
![](https://user-gold-cdn.xitu.io/2019/9/4/16cfcefe26e77bbd?w=1772&h=1160&f=png&s=174997)

这可能是目前给大家最直观的印象。

## 背景

那么为什么要了解一下编译原理。笔者觉得有以下几个好处：

1. 编译原理的确是一个很有趣而且很有难度的知识（听说也是程序员的三大浪漫之一）。
2. 多了解相关的编译知识，有助于加深对编程语言的理解。
4. 扩展开来，对 javascript转译、代码压缩、eslint、css预处理器、prettier等工具的理解和使用都会有帮助。

## 目标

本文的目标，将一段 haskell 语法的代码通过自制的小型编译器编译后解析为 javascript 语法的代码。如下：

```js
const input = "add 3 (div 8 2)";
const output = "add(3, div(8, 2))";
```

使得以下验证 `compiler(input) === output` 通过：

```js
const assert = require("assert");
assert.deepStrictEqual(compiler(input), output, "Compiler should turn `input` into `output`");
```

那么我们一般对程序编译会走经过几个过程呢？一般来说，简单可分为词法分析，语法分析和代码生成三步。以下将会补充描述。

## 词法分析 - Tokenizer

词法分析，简单来理解，将一段代码分割成一个个的单词和标点符号。

## 语法分析 - Parser

语法分析，主要目的在于通过分析词法分析生成的词法单元流，构建出一个代表当前程序的抽象语法树 ast。

## 代码转换 - Transformer

这里主要的工作，通过语法映射，将 haskell 的抽象语法树转成 javascript 的抽象语法树。这里有一个很重要的概念就是 traverser。这是一个可以访问

## 代码生成 - Generator

## 小结

## 参考资料

- [astexplorer](https://astexplorer.net/)
- [the-super-tiny-compiler](https://the-super-tiny-compiler.glitch.me/)
