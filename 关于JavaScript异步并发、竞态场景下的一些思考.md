## 前言

> 时间是程序里最复杂的因素

为什么写这篇文章，笔者最近遭遇了一些异步问题（稍后会阐述），总觉得自己在野蛮解决这类问题。写着写着总觉得不妥~于是决定研究学习一下相关解决方案~

一般来说，我们大多时候处理的都是同步的、线性的。但是正如开篇所说的“时间是程序里最复杂的因素”，如果代码中牵扯到异步的时候，这时候就需要慎重考虑了，我们需要的意识到的是：

1. 到底我们的异步是可维护的么？
2. 是不是高效的解决方式？
3. 覆盖到所有异常情况了么？
4. 多个异步发生时，如何处理依赖关系？
5. 能不能更加优雅的解决这个问题？
6. 关于异步与竞态的场景有哪些？
7. 有哪些方案以及工具可以帮助我们？

## 背景

先抛出一个问题，请看以下代码（该代码模拟了一个 ajax 请求函数，对于每一个请求有一个随机延时。）

```js
function ajax(url, cb) {
  let fake_responses = {
    file1: "The first text",
    file2: "The middle text",
    file3: "The last text"
  };
  let wait = (Math.round(Math.random() * 1e4) % 8000) + 1000;

  console.log("Requesting: " + url + `, time cost: ${wait} ms`);

  setTimeout(() => {
    cb(fake_responses[url]);
  }, wait);
}

function output(text) {
  console.log(text);
}
```

那么如何实现一个 getFile 函数，使得可以并行请求，然后依照请求顺序打印响应的值，最终异步完成后打印完成。

```js
getFile("file1");
getFile("file2");
getFile("file3");
```

期望结果：

```bash
Requesting: file1, time cost: 8233 ms
Requesting: file2, time cost: 2581 ms
Requesting: file3, time cost: 7334 ms
The first text
The middle text
The last text
Complete!
get files total time: 8247.093ms
```

## 解决方案：Thunks

### 什么是 Thunk

Thunk 这个词是起源于“思考”的幽默过去式。它

A thunk is a function that wraps an expression to delay its evaluation.

```js
// 对于下述 1 + 2 计算是即时的
// x === 3
let x = 1 + 2;

// 1 + 2 的计算是延迟的
// 函数 foo 可以稍后调用进行值的计算
// 所以函数 foo 就是一个 thunk
let foo = () => 1 + 2;
```

```js
function getFile(file) {
  let resp;

  ajax(file, text => {
    if (resp) resp(text);
    else resp = text;
  });

  return function thunk(cb) {
    if (resp) cb(resp);
    else resp = cb;
  };
}
```

### 中间件

```js
function compose(...funcs) {
  if (funcs.length === 0) {
    return arg => arg;
  }

  if (funcs.length === 1) {
    return funcs[0];
  }

  return funcs.reduce((a, b) => (...args) => a(b(...args)));
}
```

结合中间件来搞事情？

```js
function getFile1(next) {
  return getFile("file1");
}
const getFiles = [getFile1, getFile2, getFile3];
compose(...getFiles);
```

## 解决方案：Promises

```js
function getFile(file) {
  return new Promise(function(resolve) {
    ajax(file, resolve);
  });
}
```

### 避免 Promise 地狱

```js
const p1 = getFile("file1");
const p2 = getFile("file2");
const p3 = getFile("file3");

p1.then(output)
  .then(() => p2)
  .then(output)
  .then(() => p3)
  .then(output)
  .then(() => {
    output("Complete!");
  });
```

### 更加函数式

```js
const urls = ["file1", "file2", "file3"];
const getFilePromises = urls.map(getFile);

getFilePromises
  .concat(Promise.resolve("Complete!"), Promise.resolve())
  .reduce((chain, filePromise) => {
    return chain.then(output).then(() => filePromise);
  });
```

## 解决方案：Generators

Generator 是状态机的一种语法形式

```js
const co = require("co");

function getFile(file) {
  return new Promise(function(resolve) {
    ajax(file, resolve);
  });
}

function* loadFiles() {
  console.time(label);
  const p1 = getFile("file1");
  const p2 = getFile("file2");
  const p3 = getFile("file3");

  output(yield p1);
  output(yield p2);
  output(yield p3);

  console.timeEnd(label);
  output("Complete!");
}

co(loadFiles);
```

## 解决方案：async/await

<!-- @TODO -->

## 关于请求

### 为什么需要取消请求

### 取消一个 GET 请求？

### 取消一个 POST 请求？

## 关于响应式界面

响应式界面 = 乐观更新 + 副本 + 操作队列

实现目标

- 保证最终状态正确
- 防止数据丢失
- 更响应式的界面

## 关于工具

### redux-saga

### RxJS

## 小结

以上。对大家如有助益，不胜荣幸。

## 参考资料

- [what-is-a-thunk](https://daveceddia.com/what-is-a-thunk/)
- [Stack Overflow: Dispatching Redux Actions with a Timeout](https://stackoverflow.com/questions/35411423/how-to-dispatch-a-redux-action-with-a-timeout/35415559#35415559)
- [Stack Overflow: Why do we need middleware for async flow in Redux?](https://stackoverflow.com/questions/34570758/why-do-we-need-middleware-for-async-flow-in-redux/34599594#34599594)
- [co](https://github.com/tj/co)
- [ES6 Generators: Complete Series](https://davidwalsh.name/es6-generators)
- [3 cases where JavaScript generators rock (+ understanding them)](https://goshakkk.name/javascript-generators-understanding-sample-use-cases/)
- [the-definitive-guide-to-the-javascript-generators](https://github.com/gajus/gajus.com-blog/blob/master/posts/the-definitive-guide-to-the-javascript-generators/index.md)
- [ES6 generators in depth](https://2ality.com/2015/03/es6-generators.html)
- [Race Conditions in JavaScript Apps by Thai Pangsakulyanont | JSConf.Asia 2019](https://www.youtube.com/watch?v=DWZj56qUNfs&feature=push-sd&attr_tag=_-nKBHAQrlEqNBVw%3A6)
- [redux-thunk](https://github.com/reduxjs/redux-thunk)
