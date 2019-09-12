## 前言

本篇文章是笔者精读 [the-super-tiny-compiler](https://the-super-tiny-compiler.glitch.me/) 的源代码后的一些总结（推荐大家去读）。

正文开始！

首先，建立对 ast 抽象语法树的初步了解，大家可以在 [astexplorer](https://astexplorer.net/) 这个网站上输入一段 javascript 代码，在右侧面板中查看生成的 ast 语法树。

比如输入 `add(3, div(8, 2))` （解析器默认挑选了 [acorn](https://github.com/acornjs/acorn))）解析出来的抽象语法树 ast 如下右侧：
![](https://user-gold-cdn.xitu.io/2019/9/4/16cfcefe26e77bbd?w=1772&h=1160&f=png&s=174997)

这可能是 ast 目前给大家最直观的印象。那么此文，将介绍如何从一句简单的源代码（haskell），通过编译、生成、分析 ast，转换成新的语言（javascript）。

## 背景

首先，作为一个前端工程师，笔者觉得了解编译原理，有以下几个好处：

1. 编译原理的确是一个很有趣而且很有难度的知识（听说也是程序员的三大浪漫之一）。
2. 多了解相关的编译知识，有助于加深对编程语言的理解。
3. 扩展开来，对 javascript 转译、代码压缩、eslint、css 预处理器、prettier 等工具的理解和使用都会有帮助。

## 目标

本文的目标，将一段 haskell 语法的代码通过自制的小型编译器编译后解析为 javascript 语法的代码。如下：

```js
const input = 'add 3 (div 8 2)';
const output = 'add(3, div(8, 2))';
```

使得以下验证 `compiler(input) === output` 通过：

```js
const compiler = require('./compiler');
const assert = require('assert');
assert.deepStrictEqual(
  compiler(input), output, 'Compiler should turn `input` into `output`'
);
```

那么我们一般对程序编译会走经过几个过程呢？一般来说，简单可分为词法分析，语法分析和代码生成三步。以下将会补充描述。

## 词法分析 - Tokenizer

词法分析，目标将一段代码分割成一个个的单词和标点符号。

当然也叫做扫描 scanner。扫描器读取代码后，依据预定的规则合并生成成一个个的标识 tokens（移除空白符，注释）。生成 tokens 列表。以下代码描述：

```js
```

## 语法分析 - Parser

语法分析，主要目的在于通过分析词法分析生成的词法单元流，构建出一个代表当前程序的抽象语法树 ast。

```js
```

## 代码转换 - Transformer

这里主要的工作，通过语法映射，将 haskell 的抽象语法树转成 javascript 的抽象语法树。这里有一个很重要的概念就是 traverser。这是一个可以访问 ast 某个节点的工具函数。

```js
```

## 代码生成 - Generator

代码生成器将转换后的 ast 通过特定规则组合为新的代码。

```js
```

## 小结

以上，对大家如有助益，不胜荣幸。

## 参考资料

- [astexplorer](https://astexplorer.net/)
- [the-super-tiny-compiler](https://the-super-tiny-compiler.glitch.me/)
