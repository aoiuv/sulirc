## 前言

关于 Dva 源码解析，官网已有相关指南 [Dva 源码解析](https://dvajs.com/guide/source-code-explore.html)。本文虽然也是精读源码，但不同之处在于：

1. 着重介绍 dva-core 源码实现（dva 底层依赖 dva-core）
2. 探讨对于 dva-core 的更多场景下的用法

好了言归正传，笔者在半年以前，提起 redux 这些框架总会不自觉的与 react 相关联，事实上真的这些框架脱离了 react 难道就无法使用了么？以及如何扩展使用这些框架达成我们的应用需求呢？

而后来笔者因项目原因不进行 web 应用开发，第一次尝试开发业务底层相关 SDK 的时候，意识到虽然在使用 redux 上 react 是主要场景。但是 redux 作为状态管理库，作用域理应更大。那么基于 redux 衍生的 redux-saga、甚至于 dva（也就是今日的主题），那也可以脱离 web 应用开发场景进行理解与使用。

因此，本篇文章主要目的是：**精读 dva-core 源码的同时，也探讨一下 dva-core 的其他使用场景**，比如构建具有状态管理需求的 SDK 等等。

由于 dva-core 依赖了 redux 和 redux-saga。在介绍 dva-core 之前，还是先简单熟悉一下两者的基本概念。

依赖方向：

```
dva <- dva-core <- redux-saga | redux
```

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

dva-immer 依赖 [immer](https://immerjs.github.io/immer/docs/introduction) 来优雅处理不可变状态。（备注：如果想在项目中轻量引入不可变状态管理的话，可以考虑 immer.js）

dva-loading 实现了自动处理 loading 状态。

dva-immer 和 dva-loading 其实都是作为 dva-core 的插件存在的。

```js
const { create, saga } = require('dva-core');
const createImmerPlugin = require('dva-immer');
const createLoadingPlugin = require('dva-loading');

const app = create();
app.use(createImmerPlugin());
app.use(createLoadingPlugin());
```

当然， dva 核心依赖了 dva-core。本文的重点也在于此。

## dva-core

dva-core 由于集成了 redux 和 redux-saga。那么在对于应用的状态管理和副作用管理这两种场景应该具备强大的能力。

dva-core 包只导出了三个主要的 API: create、saga、utils。我们大体上可以忽略后面二者。将注意力集中在 create 上。

首先，使用 create 创建一个最简单的 app 对象。

```js
const { create } = require('dva-core');
const app = create();
app.start();
```

打印 app 对象如下：

```js
{
  // private
  _models: [ { namespace: '@@dva', state: 0, reducers: [Object] } ],
  _store:
   { dispatch: [Function],
     subscribe: [Function: subscribe],
     getState: [Function: getState],
     replaceReducer: [Function: replaceReducer],
     runSaga: [Function: bound runSaga],
     asyncReducers: {},
     [Symbol(observable)]: [Function: observable] },
  _plugin:
   Plugin {
     _handleActions: null,
     hooks:
      { onError: [],
        onStateChange: [],
        onAction: [],
        onHmr: [],
        onReducer: [],
        onEffect: [],
        extraReducers: [],
        extraEnhancers: [],
        _handleActions: [] } },
  _getSaga: [Function: bound getSaga],
  // public
  start: [Function: start],
  use: [Function: bound use],
  model: [Function: bound injectModel],
  unmodel: [Function: bound unmodel],
  replaceModel: [Function: bound replaceModel]
};
```

我们忽略以下划线开头对象，因为语义上一般我们认为是私有属性。于是我们关注其他属性可以发现，存在以下几个 api：**start、use、model、unmodel、replaceModel**。

精简 `dva/packages/dva-core/src/index.js` 中的代码发现，的确如此。

```js
// ...
export function create(hooksAndOpts = {}, createOpts = {}) {
  // ...
  const plugin = new Plugin();
  // 挂载了use、model、start方法
  const app = {
    use: plugin.use.bind(plugin),
    model,
    start,
  };
  return app;

  function model(m) {
    // ...
    const prefixedModel = prefixNamespace({ ...m });
    app._models.push(prefixedModel);
    return prefixedModel;
  }
  function injectModel(createReducer, onError, unlisteners, m) {}
  function unmodel(createReducer, reducers, unlisteners, namespace) {}
  function replaceModel(createReducer, reducers, unlisteners, onError, m) {}
  function start() {
    // ...
    // 更新挂载 model、unmodel、replaceModel
    app.model = injectModel.bind(app, createReducer, onError, unlisteners);
    app.unmodel = unmodel.bind(app, createReducer, reducers, unlisteners);
    app.replaceModel = replaceModel.bind(app, createReducer, reducers, unlisteners, onError);
    // ...
  }
}
```

这里我们注意到 app.model 方法实际上在 start()里通过 `injectModel.bind(app, createReducer, onError, unlisteners)`柯里化后更新了。

因为在一开始设置的 model 方法，只是简单更新了 app.\_models 列表。而 injectModel 才处理 model 相关的逻辑。

而 unmodel、replaceModel 方法在 app.start()之前都不存在。

由此大概整理了 create 之后的几个 api 的来源。

### 模型注册：model

顾名思义，就是注册 dva 模型，以及相反操作取消注册。

model 函数，本质上就是将重新定义命名空间的模型推入内部的模型列表。

```js
function model(m) {
  const prefixedModel = prefixNamespace({ ...m });
  app._models.push(prefixedModel);
  return prefixedModel;
}
```

prefixNamespace 函数实际上将模型上用户定义的 reducers 和 effects 的 key 映射在此模型的命名空间下。比如以下 model：

```js
app.model({
  namespace: 'users',
  state: ['foo'],
  reducers: {
    add(state, { payload }) {
      return [...state, payload];
    },
  },
  effects: {
    *fetch(_, { put }) {
      yield delay(200);
      yield put({ type: 'add', payload: '{data}' });
    },
  },
});
```

里面的 model 在经过 prefixNamespace 之后：

```js
{
  namespace: 'users',
  state: [ 'foo' ],
  reducers: { 'users/add': [Function: add] },
  effects: { 'users/fetch': [GeneratorFunction: fetch] }
}
```

因此，经过 prefixNamespace 的所有的 model 的 reducers 和 effects 在最后汇总成一个对象的时候，也可以错落有致的归类。

当然，这只是新增模型和重新映射 key 而已。我们前面提到，model 函数实际上是 injectModel 柯里化后的产生的函数。因此我们有必要在 injectModel 函数里看到底干了什么事情、

```js
function injectModel(createReducer, onError, unlisteners, m) {
  m = model(m);

  const store = app._store;
  store.asyncReducers[m.namespace] = getReducer(m.reducers, m.state, plugin._handleActions);
  store.replaceReducer(createReducer());
  if (m.effects) {
    store.runSaga(app._getSaga(m.effects, m, onError, plugin.get('onEffect'), hooksAndOpts));
  }
  if (m.subscriptions) {
    unlisteners[m.namespace] = runSubscription(m.subscriptions, m, app, onError);
  }
}
```

### 移除模型：unmodel

接下来，我们看 unmodel 干了什么事情

```js
function unmodel(createReducer, reducers, unlisteners, namespace) {
  const store = app._store;

  // 删除reducers
  delete store.asyncReducers[namespace];
  delete reducers[namespace];
  store.replaceReducer(createReducer());
  store.dispatch({ type: '@@dva/UPDATE' });

  // 通过分发一个内部事件，取消副作用
  store.dispatch({ type: `${namespace}/@@CANCEL_EFFECTS` });

  // 取消监听这个命名空间的所有订阅
  unlistenSubscription(unlisteners, namespace);

  // 在app的内部models列表里删除此模型
  app._models = app._models.filter(model => model.namespace !== namespace);
}
```

### 更新模型：replaceModel

可以在 app.start()之后替换或新增已有模型。

```js
function replaceModel(createReducer, reducers, unlisteners, onError, m) {
  const store = app._store;
  const { namespace } = m;
  const oldModelIdx = findIndex(app._models, model => model.namespace === namespace);

  if (~oldModelIdx) {
    // 通过分发一个内部事件，取消副作用
    store.dispatch({ type: `${namespace}/@@CANCEL_EFFECTS` });

    // 删除reducers
    delete store.asyncReducers[namespace];
    delete reducers[namespace];

    // 取消监听这个命名空间之前的所有订阅
    unlistenSubscription(unlisteners, namespace);

    // 在app的内部models列表里删除此模型
    app._models.splice(oldModelIdx, 1);
  }

  // 直接更新此模型
  app.model(m);

  store.dispatch({ type: '@@dva/UPDATE' });
}
```

### 同步操作处理：reducers

> 用于处理同步操作，唯一可以修改 state 的地方。由 action 触发。

格式为 (state, action) => newState 或 [(state, action) => newState, enhancer]

### 副作用处理：effects

> 用于处理异步操作和业务逻辑，不直接修改 state。由 action 触发，可以触发 action。

格式为 _(action, effects) => void 或 [_(action, effects) => void, { type }]。

### 订阅：subscriptions

格式为 ({ dispatch, history }, done) => unlistenFunction。

### 配置钩子：create(opts)

### 注册插件：app.use(hooks)

## 小结

以上。
