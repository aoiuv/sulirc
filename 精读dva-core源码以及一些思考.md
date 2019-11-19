## 前言

关于 Dva 源码解析，官网已有相关指南 [Dva 源码解析](https://dvajs.com/guide/source-code-explore.html)。本文虽然也是称作精度源码，但不同之处在于：

1. 着重介绍 dva-core 源码实现
2. 探讨对于 dva-core 的更多场景下的用法

好了言归正传，笔者在半年以前，提起 redux 这些框架总会不自觉的与 react 相关联，事实上真的这些框架脱离了 react 难道就无法使用了么？以及如何扩展使用这些框架达成我们的应用需求呢？

而后来笔者因项目原因不进行 web 应用开发，第一次尝试开发业务底层相关 SDK 的时候，意识到虽然在使用 redux 上 react 是主要场景。但是 redux 作为状态管理库，作用域理应更大。那么基于 redux 衍生的 redux-saga、甚至于 dva（也就是今日的主题），那也可以脱离 web 应用开发场景进行理解与使用。

因此，本篇文章主要目的是：**精读 dva-core 源码的同时，也探讨一下 dva-core 的其他使用场景**，比如构建具有状态管理需求的 SDK 等等。

由于 dva-core 依赖了 redux 和 redux-saga。在介绍 dva-core 之前，还是先简单熟悉一下两者的基本概念。

## 关于 redux

[redux](https://github.com/reduxjs/redux)的介绍，官网已经很详尽。

首先，redux 是一个很轻量的可预测的状态管理库。API 也只有 createStore、store.subscribe、 store.dispatch、 store.getState。简单易于理解。

createStore(reducer)创建单一状态树，同时配置一个函数签名为 (state, action) => state 的纯函数 reducer，用于描述不同的 action 应如何操作更新 state。
reducer 需要保持两个原则，第一是保持纯函数特性，第二是保持不可变数据，不修改上一次的 state，每次计算后返回新的 state。

那么 store.subscribe 和 store.dispatch 分别为状态树的订阅和事件分发。而 store.getState 可以获取当前的状态树快照。

因此使用的基本概念上可以理解为，将所有应用的状态 state 保存在单一的状态树 store 里，通过纯净的 reducer 控制如何更新状态，分发拥有具体描述和动作参数的 action 事件以应用对应的 reducer。然后经过 redux 处理后最终得以更新状态树，同时通知所有订阅者。

## 关于 redux-saga

如果说 redux 是可以处理纯函数情况的话，那么 [redux-saga](https://github.com/redux-saga/redux-saga) 则是对应用副作用的一种增强管理工具。redux-saga 是 redux 的中间件。

从示例使用上即可明朗：

```js
import { createStore, applyMiddleware } from 'redux';
import createSagaMiddleware from 'redux-saga';

// create the saga middleware
const sagaMiddleware = createSagaMiddleware();
// mount it on the Store
const store = createStore(reducer, applyMiddleware(sagaMiddleware));

// then run the saga
sagaMiddleware.run(mySaga);
```

## dva 的基本分离架构

大概翻一下 dva 的项目文件目录，可以知道 dva 是使用 lerna 进行多包管理的项目。主要分为以下四个包，如下所示：

```bash
~/Desktop/dva $ tree ./packages/ -L 1
./packages/
├── dva
├── dva-core
├── dva-immer
└── dva-loading

4 directories, 0 files
```

dva 使用 react-redux 实现了 view 层。

dva-core 基于 redux 和 redux-saga **处理 model 层**，比如包括了 state 管理、数据的异步加载、订阅-发布模式。

dva-immer 依赖 [immer](https://immerjs.github.io/immer/docs/introduction) 来优雅处理不可变状态。

dva-loading 解决模型加载的问题。

当然， dva 核心依赖了 dva-core。本文的重点也在于此。

## dva-core

dva-core 由于集成了 redux 和 redux-saga。那么在对于应用的状态管理和副作用管理这两种场景应该具备强大的能力。

## 小结
