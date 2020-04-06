## 前言

> 时间是程序里最复杂的因素

编写 Web 应用的时候，一般来说，我们大多时候处理的都是同步的、线性的业务逻辑。但是正如开篇所说的“时间是程序里最复杂的因素”，应用一旦复杂，往往会遭遇很多异步问题，如果代码中涉及到到多个异步的时候，这时候就需要慎重考虑了，我们需要的意识到的是：

到底我们的异步逻辑是易读的么？可维护的么？哪些是并发场景，哪些是竞态场景，我们有什么对策么？以下我将抛出我发现的几种方案，注意提提神！以下全程需要集中精神思考 🤔

## 解决问题之前

在抛出具体的解决问题的技术方案之前。首先探讨一下我们常见的请求会遇到的问题。

### 每一个请求，都是一个野兽！

一般而言，在前端而言我们经常遇到的异步场景，是请求问题。（当然对应到后端，有可能是各种 IO 操作，比如读写文件、操作数据库等）。

那笔者为何谈到请求，因为大多人都会忽略此类问题。我们往往有时候会发出多个同类型的请求（不一定符合我们意愿），但是每每觉得自己的应用十分健壮，实际上如果没有当心控制“野兽”的话，实际上应用也会相当脆弱！

如下图，应用依照 A1 -> A2 -> A3 顺序发起请求，我们也期望的是 A1 -> A2 -> A3 的顺序返回响应给应用。

![](https://user-gold-cdn.xitu.io/2019/7/28/16c3798343115b98?w=570&h=296&f=png&s=11302)

但实际上呢。但是每个请求都是十分野性的。我们根本无法把控它哪时候回来！请求的响应顺序极大程度依赖用户的网络环境。比如上图的响应顺序实际上就是 A3 -> A1 -> A2，此时应用将有概率会变得一团糟！

不过也不用担心，实际上，一旦当你注意问题的时候，其实就离解决问题不远了。

那么我们常见的做法会有什么呢？

### 结束标记

通过应用中的标记状态，在需求请求完成后，标记成功，忽略多余请求，可以巧妙避开请求竞态的陷阱。由于此写法比较常见，不再赘述。

### 队列化

将请求串行！某些特殊场景下可以使用。在时间线上将多个异步拍平成一条线。野兽请求们依序进入队列（相当于我们给请求们拉起了缰绳，划好了奔跑的道路），如下图：

![](https://user-gold-cdn.xitu.io/2019/7/28/16c3799b0ac74faa?w=1140&h=296&f=png&s=15306)

只有当 A1 请求响应时，才进行 A2 请求，A2 响应成功时，进行 A3 请求。同理以此类推。（注意虽然请求的顺序强行被修改为串行，但并不意味这发起请求的动作也是串行）。因此在从时间维度上大大简化了场景，极大的减少了 bug 的发生概率。

缺点也很明显，请求串行后阻塞了，某些场景下也许做了很多无用功。

### 取消请求 + 最新

有同学们就会觉得，效率是否略显低下，既然我们前面的请求虽然依序生效了，但是最终很快都会被最新的请求结果所替换，那么还做那么多无用功干嘛？是的，的确不应当这么做！如图：

![](https://user-gold-cdn.xitu.io/2019/7/28/16c379b0aedb68f2?w=564&h=298&f=png&s=14516)

凡是有新的请求产生，取消上一个还在路上的请求（原生的 XMLHttpRequest.abort()、axios 的 cancelToken），然后只取最新的一个请求，静静等待它的响应。比如 redux-saga 中 takeLatest。

（但是请同学们注意，如果需要每一个请求都对服务器产生效果，比如 POST 请求等，有时候队列也不失为一个好的解决方式）

## 问题以及背景

上文其实算是一个引子，接下来我将并发竞态的问题抽象简化为以下代码，请看：

```js
// 模拟了一个 ajax 请求函数，对于每一个请求有一个随机延时
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

那么如何实现一个 getFile 函数，使得可以并行请求，然后依照请求顺序打印响应的值，最终异步完成后打印完成。（注意，此处考虑并发场景）

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

下文将和大家介绍从编写实现上如何解决并发竞态的问题的几种方案！

## 解决方案：Thunks

### 什么是 Thunk

Thunk 这个词是起源于“思考”的幽默过去式的意思。它本质上就是一个延迟执行计算的函数。比如下述：

```js
// 对于下述 1 + 2 计算是即时的
// x === 3
let x = 1 + 2;

// 1 + 2 的计算是延迟的
// 函数 foo 可以稍后调用进行值的计算
// 所以函数 foo 就是一个 thunk
let foo = () => 1 + 2;
```

那么我们来实现一个 getFile 函数如下：

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

注意我们如上有一个很有趣的实现，实际上在调用 getFile 函数的时候，内部就已经发生了 ajax 请求（因此请求并没有被阻塞），但是真正返回响应的逻辑放在了 thunk 中。

因此，业务逻辑如下：

```js
let thunk1 = getFile("file1");
let thunk2 = getFile("file2");
let thunk3 = getFile("file3");

thunk1(text => {
  output(text);
  thunk2(text => {
    output(text);
    thunk3(text => {
      output(text);
      output("Complete!");
    });
  });
});
```

调用后，很好实现了我们的需求！但是！但是同学们也发现了，还是难免陷入了回调地狱，写法还是不好维护，换而言之，还是不够优雅~

嗯...有什么办法呢？

### 中间件

近几年，中间件的思想和使用十分流行，或者我们可以尝试使用中间件方式实现一下？

首先我们写一个简单的 compose 函数如下（当然此场景下我们并不关注中间件的上下文，因此简化其实现）：

```js
function compose(...mdws) {
  return () => {
    function next() {
      const mdw = mdws.shift();
      mdw && mdw(next);
    }
    mdws.shift()(next);
  };
}
```

那我们的 getFile 函数实现也得稍微改一下，让返回的 thunk 函数可以交由中间件的 next 控制：

```js
function getFileMiddleware(file, cb) {
  let resp;

  ajax(file, function(text) {
    if (!resp) resp = text;
    else resp(text);
  });

  return next => {
    _next = args => {
      cb && cb(args);
      next(args);
    };
    if (resp) {
      _next(resp);
    } else {
      resp = _next;
    }
  };
}
```

基于上述两个实现。我们最终的写法可以修改为以下形式：

```js
const middlewares = [
  getFileMiddleware("file1", output),
  getFileMiddleware("file2", output),
  getFileMiddleware("file3", resp => {
    output(resp);
    output("Complete!");
  })
];

compose(...middlewares)();
```

最终输出结果仍然满足我们对并发控制的需求！但是写法上优雅了不少！篇幅有限，就不贴上结果了，同学们可验证一下~

## 解决方案：Promises

到目前为止。我们都没有好好利用 JavaScript 送给我们的礼物“Promise”。Promise 是一个对未来的值的容器。利用 Promise 也能很好的完成我们的需求。

如下，实现 getFile 函数：

```js
function getFile(file) {
  return new Promise(function(resolve) {
    ajax(file, resolve);
  });
}
```

来来来，调用一下

```js
const p1 = getFile("file1");
const p2 = getFile("file2");
const p3 = getFile("file3");

p1.then(t1 => {
  output(t1);
  p2.then(t2 => {
    output(t2);
    p3.then(t3 => {
      output(t3);
      output("Complete!");
    });
  });
});
```

一样满足，但是？我们又陷入了 Promise 地狱...

### 对 Promise 地狱 Say NO

如果写出了上述的 Promise 地狱，证明对 Promise 的了解还不够，事实上也背离了 Promise 的设计初衷。我们可以改为下述写法：

```js
const p1 = getFile("file1");
const p2 = getFile("file2");
const p3 = getFile("file3");
const constant = v => () => v;

p1.then(output)
  .then(constant(p2))
  .then(output)
  .then(constant(p3))
  .then(output)
  .then(() => {
    output("Complete!");
  });
```

嗯哼~又更加优雅了点。Promise 地狱不见啦~

### 更加函数式的 Promise 方式

首先我要承认。我现在是，未来也是函数式编程的忠实拥护者。因此上述写法虽然减少了嵌套，但是还是觉得略显无聊，如果有一百个文件等待请求，难道我们还有手写一百个 getFile，还有数不清的 then 么？

问题来了，如何再一步改进呢？我们好好思考一下。

首先他们是一个重复的事情，既然重复那就可以抽象，在加上我们函数式工具 reduce 方法，改进如下：

```js
const urls = ["file1", "file2", "file3"];
const getFilePromises = urls.map(getFile);
const constant = v => () => v;

getFilePromises
  .concat(Promise.resolve("Complete!"), Promise.resolve())
  .reduce((chain, filePromise) => {
    return chain.then(output).then(constant(filePromise));
  });
```

问题解决，并且优雅~（同学们可能留意到我 concat 了一个 Promise.resolve，是因为此处 reduce 中总需要下个 Promise 承接上一个的值进行执行，细节实现问题，无需介意）。

## 解决方案：Generators

> Generator 是状态机的一种语法形式。

ES6 中还有一个解决异步问题的新朋友 generator。同理我们来用 generator 来实现需求。这里我们使用 co 来简化 generator 的调用。

```js
const co = require("co");

function getFile(file) {
  return new Promise(function(resolve) {
    ajax(file, resolve);
  });
}

function* loadFiles() {
  const p1 = getFile("file1");
  const p2 = getFile("file2");
  const p3 = getFile("file3");

  output(yield p1);
  output(yield p2);
  output(yield p3);

  output("Complete!");
}

co(loadFiles);
```

一样的完成了需求，我们又多了一种解决问题的思路对吧~ generator 其实在解决异步问题上的能量超乎想象。值得我们花费多点时间学习！

等等，貌似我们在硬编码，再改进一下吧~

```js
function loadFiles(urls) {
  const getFilePromises = urls.map(getFile);
  return function* gen() {
    do {
      output(yield getFilePromises.shift());
    } while (getFilePromises.length > 0);

    output("Complete!");
  };
}

co(loadFiles(["file1", "file2", "file3"]));
```

好啦！Perfect~

## 解决方案：async/await

既然写到了这里，我们也用 ES7 中出现的 async/await 写一下实现方案吧！

```js
async function loadFiles(urls) {
  const getFilePromises = urls.map(getFile);
  do {
    const res = await getFilePromises.shift();
    output(res);
  } while (getFilePromises.length > 0);

  output("Complete!");
}

loadFiles(["file1", "file2", "file3"]);
```

当然，其实和 generator 的实现写法上大致无什么差异，但是在写法上提升了可读性~

## 小结

关于异步请求，是明显的副作用，可谓名副其实的“野兽”。除了上述提到的一些方法外，我们应该永不停止寻找更好更优雅的范式去处理这类情况，比如响应式编程、亦或者函数式编程中的 IO functor 等。

对异步的掌控也许还需要我们了解 JavaScript 事件循环、任务队列、RxJS 等相关知识、还是要去学习更多范式和思维方式，与时间交朋友，而不是与之为敌。

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
- [What the heck is the event loop anyway? - Philip Roberts - JSConf EU 2014](https://www.youtube.com/watch?v=8aGhZQkoFbQ)
- [Further Adventures of the Event Loop - Erin Zimmer - JSConf EU 2018](https://www.youtube.com/watch?v=u1kqx6AenYw)
