## 前言

今天主要想和大家分享一下函数组合`Function Composition`的概念以及一些实践。函数组合应该是函数式编程中最重要的几个概念之一了~ 所以以下的学习内容十分重要~

## 工具函数

备注：如果对接下来使用的`partial` & `curry`的概念不熟悉，可以回去看我的第一篇有介绍哦~[函数式编程入门实践 —— Partial/Curry](https://juejin.im/post/5cb841f7e51d456e5e035f23)。（因为接下来就会用到）

#### `compose`

如果我们想，对一个值执行一系列操作，并打印出来，考虑以下代码：
```js
import { partial, partialRight } from 'lodash';

function add(x, y) {
  return x + y;
}

function pow(x, y) {
  return Math.pow(x, y);
}

function double(x) {
  return x * 2;
}

const add10 = partial(add, 10);
const pow3 = partialRight(pow, 3);

console.log(add10(pow3(double(2)))); // 74
```

备注：`partialRight`和`partial`见名知意，相当于是彼此的镜像函数。
> _.partialRight: This method is like _.partial except that partially applied arguments are appended to the arguments it receives.

无需否认，这段示例代码的确毫无意义。但是为了达成这一系列操作，我最终执行了这一长串嵌套了四层的函数调用：`console.log(add10(pow3(double(2))))`。（说实话，我的确觉得有点难以阅读了...），如果更长了，怎么办？可能有的同学会给出以下答案:

```js
function mixed(x) {
  return add10(pow3(double(2)))
}
console.log(mixed(2)); // 74
```

的确，看似好了点，但是也只是将这个冗长的调用封装了一下而已。会不会有更好的做法？

```js
function compose(...args) {
  return result => {
    const funcs = [...args];
    while(funcs.length > 0) {
      result = funcs.pop()(result);
    }
    return result;
  };
}

compose(console.log, add10, pow3, double)(2) // 74
```

欧耶！我们通过实现了一个简单的`compose`函数，然后发现调用的过程`compose(console.log, add10, pow3, double)(2)`竟然变得如此优雅！多个函数的调用从代码阅读上，多层嵌套被拍平变成了线性！（当然实际上本质上还是嵌套的函数调用的）。

当然，关于`compose`的更加函数式的实现如下：

```js
function compose(...funcs) {
  return result => [...funcs]
    .reverse()
    .reduce((result, fn) => fn(result), result);
}
```

那么有同学可能也发现了，上述`compose`之后的函数是只可以传递一个参数的。这无疑显得有点蠢？难道不可以优化实现支持多个参数么？

考虑以下代码：

```js
function compose(...funcs) {
  return funcs
    .reverse()
    .reduce((fn1, fn2) => (...args) => fn2(fn1(...args)));
}
```

细心观察，通过将参数传递进行懒执行，从而巧妙的完成了这个任务！示例如下：

```js
function multiply(x, y) {
  return x * y;
}

compose(
  console.log, add10, pow3, multiply
)(2, 5); // 1010
```

当然上述代码最终也可以这么写：

```js
compose(
  console.log, 
  partial(add, 10),
  partialRight(pow, 3),
  partial(multiply, 5)
)(2); // 1010
```

#### `pipe`

那么学习完了`compose`，`pipe`又是什么呢？首先在刚刚学习`compose`函数时，可能有同学会觉得有点小别扭，因为`compose`从左到右传递参数的顺序刚好和调用顺序相反的！

（当然如果说帮助理解记忆的话，compose传参的顺序就是我们书写函数嵌套的顺序，在脑海里把`console.log(add10(pow3(double(2))))`这一长串里的括号去了，是不是就是参数的顺序了~）

回到话题，`pipe`是什么？同学们有没有使用过命令行，比如我常用的一个命令，将当前工作路径拷贝到剪切板，随时ctrl + v就可以使用了~

```bash
pwd | pbcopy
```

当然我木有走题！注意以上的管道符 `|`，这个其实就是`pipe`，可以将数据流从左到右传递。

考虑示例代码如下：

```js
function pipe(...args) {
  return result => {
    const funcs = [...args];
    while(funcs.length > 0) {
      result = funcs.shift()(result);
    }
    return result;
  };
}

pipe(
  partial(multiply, 5),
  partialRight(pow, 3),
  partial(add, 10),
  console.log
)(2); // 1010
```
等等，从左到右？好像和compose刚好相反诶！而且这段代码好眼熟啊！将pop方法换成了shift方法而已！

那么实际上等价于：

```js
const reverseArgs = func => (...args) => func(...args.reverse());
const pipe = reverseArgs(compose);
```

哈我们避免了重复无意义的代码！当然无论是`compose`还是`pipe`，本质上我们都将命令式的代码转换成了声明式的代码，对一个值的操作可以理解为值在函数之间流动

`2 --> multiply --> pow --> add --> console.log`

多么优雅呀~

## 使用递归来实现compose！

递归版本的`compose`本质上更接近概念，但是可能也会让人难以理解。了解一下也不错~ 

代码如下：

```js
function compose(...funcs) {
  const [fn1, fn2, ...rest] = funcs.reverse();
  
  function composed(...args) {
    return fn2(fn1(...args));
  };

  if (rest.length === 0) return composed;

  return compose(
    ...rest.reverse(),
    composed
  );
}
```

## redux & koa-compose

redux以及koa其实都是有中间件的思想，组合中间件的compose原理和上述代码也相差不远。大家可以稍微阅读以下两个链接的源码，代码都很简短，但都验证了compose的概念只要在实际开发中运用得当的话，可以发挥强大的魔力！
- [redux/src/compose.js](https://github.com/reduxjs/redux/blob/master/src/compose.js)
- [koa-compose](https://github.com/koajs/compose/blob/master/index.js)

## 小结

所以，学习函数式编程并不是让自己看起来有多么聪明，也不是为了迷惑队友（哈哈），也不是单纯为了学习而学习。它的实际意义在于，给函数调用穿上语义化的衣服，让实际的应用代码最终更可读友好，利于维护~ 当然与此同时，也会训练自己写出声明式的代码。

（话说React Hooks和FP很搭配啊~ 过段时间也想在这个话题上分享一下）

谢谢大家(●´∀｀●)~