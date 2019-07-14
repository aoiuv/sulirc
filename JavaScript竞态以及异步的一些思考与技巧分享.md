## 前言

说一下为什么写这篇分享，近来笔者接触了一些异步处理的业务需求，发现自己对于异步、竞态、并发的逻辑处理比较脆弱，无论怎么写总感觉无法覆盖所有异常情况，特别也是感觉不够优雅，总是让自己辗转难眠。

因此！开始搜集资料学习 JavaScript 异步相关以及对应的技巧~

以下，正式开始！

## 背景

无所不在的异步

## 关于异步

### Callback

### Thunks

A thunk is a function that wraps an expression to delay its evaluation.

```js
// calculation of 1 + 2 is immediate
// x === 3
let x = 1 + 2;

// calculation of 1 + 2 is delayed
// foo can be called later to perform the calculation
// foo is a thunk!
let foo = () => 1 + 2;
```

The term originated as a humorous past-tense version of "think".
这个词起源于“思考”的幽默过去式。

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

结合中间件来搞事情？
```js
function getFile1(next) {
  return getFile('file1');
}
const getFiles = [getFile1, getFile2, getFile3];
compose(...getFiles);
```

### Promises

Promise is a time independent wrapper around a value

### Generators

## 关于请求

### 为什么需要取消请求

### 怎样真正的取消请求

抵抗对服务器的影响，也抵抗对客户端的影响

#### get 请求的取消？

#### post 请求如何取消？

### 关于响应式界面的思考

响应式界面 = 乐观更新 + 副本 + 操作队列

实现目标

- 保证最终状态正确
- 防止数据丢失
- 更响应式的界面

### 函数式的方案？

## 工具库

- redux-saga
- rxjs

## 小结

## 参考资料

- [Race Conditions in JavaScript Apps by Thai Pangsakulyanont | JSConf.Asia 2019](https://www.youtube.com/watch?v=DWZj56qUNfs&feature=push-sd&attr_tag=_-nKBHAQrlEqNBVw%3A6)
- [redux-thunk](https://github.com/reduxjs/redux-thunk)
