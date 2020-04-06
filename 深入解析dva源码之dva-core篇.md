## 前言

关于 Dva 源码解析，官网已有相关指南 [Dva 源码解析](https://dvajs.com/guide/source-code-explore.html)。

而本篇文章与其不同的是：**深入解析 dva-core 源码，和探讨 dva-core 的相关技术及应用场景**。

好了正文开始！

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

dva-immer 和 dva-loading 其实都是作为 dva 的核心插件存在的。如下图方式注册插件即可：

```js
const { create, saga } = require("dva-core");
const createImmerPlugin = require("dva-immer");
const createLoadingPlugin = require("dva-loading");

const app = create();
app.use(createImmerPlugin());
app.use(createLoadingPlugin());
```

个人还是很喜欢 immer 的，可以用可变操作的方式生产不可变的值。dva-immer 的确值得推荐。

不过，实际上两个插件都是寥寥几行代码，而我们应该学习的是 dva 的插件注册机制。

当然，**dva 核心依赖了 dva-core**。本文的重点也在于此。

## dva-core

dva-core 由于集成了 redux 和 redux-saga。那么在对于应用的状态管理和副作用管理这两种场景应该具备强大的能力。

dva-core 包只导出了三个主要的 API: create、saga、utils。我们大体上可以忽略后面二者。将注意力集中在 create 上。

首先，使用 create 创建一个最简单的 app 对象。

```js
const { create } = require("dva-core");
const app = create();
app.start();
```

打印 app 对象如下：

```js
{
  // 可以认为私有属性
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
  // 可以认为公有属性，即真正暴露给第三方的 api
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
// dva/packages/dva-core/src/index.js
// ...
export function create(hooksAndOpts = {}, createOpts = {}) {
  // ...
  const plugin = new Plugin();
  // 挂载了use、model、start方法
  const app = {
    use: plugin.use.bind(plugin),
    model,
    start
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

而 unmodel、replaceModel 方法在 app.start()之前都不存在。而是在 start() 里对内部 unmodel、replaceModel 方法进行柯里化返回到的新方法。

由此大概整理了 create 之后的几个 api 的来源。

### model 注册：model

顾名思义，就是注册 dva model，以及相反操作取消注册。

model 函数，本质上就是将重新定义命名空间的 model 推入内部的 model 列表。

```js
// dva/packages/dva-core/src/index.js
function model(m) {
  const prefixedModel = prefixNamespace({ ...m });
  app._models.push(prefixedModel);
  return prefixedModel;
}
```

prefixNamespace 函数实际上将 model 上用户定义的 reducers 和 effects 的 key 映射在此 model 的命名空间下。比如以下 model：

```js
app.model({
  namespace: "users",
  state: ["foo"],
  reducers: {
    add(state, { payload }) {
      return [...state, payload];
    }
  },
  effects: {
    *fetch(_, { put }) {
      yield delay(200);
      yield put({ type: "add", payload: "{data}" });
    }
  }
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

可以看到，_users/add_ 和 _users/fetch_ 都是修改后的新 key。

因此，经过 prefixNamespace 的所有的 model 的 reducers 和 effects 在最后汇总成一个对象的时候，也可以错落有致地根据 namespace 进行归类。

当然，这只是新增 model 和重新映射 key 而已。我们前面提到，model 函数实际上是 injectModel 柯里化后的产生的函数。因此我们有必要在 injectModel 函数里看到底干了什么事情、

```js
// dva/packages/dva-core/src/index.js
function injectModel(createReducer, onError, unlisteners, m) {
  // 推入model到内部model列表
  m = model(m);

  const store = app._store;
  // 将namespace下的model所有reducers函数compose成为一个reducer
  store.asyncReducers[m.namespace] = getReducer(m.reducers, m.state, plugin._handleActions);
  store.replaceReducer(createReducer());
  if (m.effects) {
    store.runSaga(app._getSaga(m.effects, m, onError, plugin.get("onEffect"), hooksAndOpts));
  }
  if (m.subscriptions) {
    unlisteners[m.namespace] = runSubscription(m.subscriptions, m, app, onError);
  }
}
```

我们首先来看`store.asyncReducers[m.namespace] = getReducer(m.reducers, m.state, plugin._handleActions);`这一句，里面的的确确干了很多事情。来，我们深入分析。

```js
// dva/packages/dva-core/src/getReducer.js
import defaultHandleActions from "./handleActions";

export default function getReducer(reducers, state, handleActions) {
  // Support reducer enhancer
  // e.g. reducers: [realReducers, enhancer]
  if (Array.isArray(reducers)) {
    return reducers[1]((handleActions || defaultHandleActions)(reducers[0], state));
  } else {
    return (handleActions || defaultHandleActions)(reducers || {}, state);
  }
}
```

这里的 isArray 分支判断条件是因为 dva 中的 reducer 支持数组形式传入 enhancer。什么意思呢？请看以下示例代码：

```js
app.model({
  namespace: "char",
  state: "sulirc",
  reducers: [
    {
      timestamp(state, { payload }) {
        return state + (payload || Date.now());
      }
    },
    function enhancer(reducer) {
      return (state, action) => {
        if (action.type === "char/timestamp") {
          return reducer(`[${state.toUpperCase()}]@`, action);
        }
        return reducer(state, action);
      };
    }
  ]
});
```

留意我们的 reducers 变成了数组。所以当我们 dispatch 任意一个 action 的时候，都会经过 enhancer 先处理。

```js
app._store.dispatch({ type: "char/timestamp" });
console.log(app._store.getState());
// => { '@@dva': 0, char: '[SULIRC]@1575169473563' }
```

如果想搞懂以上 reducer 的 compose、enhancer 的实现，我们先来看这一句：

```js
(handleActions || defaultHandleActions)(reducers || {}, state);
```

handlerActions 其实就是入口 getReducer 中传入 plugin.\_handleActions。本质上依赖外界传入。比如 dva-immer 这个 plugin 就是实现了\_handleActions 这个钩子。

而我们来看 defaultHandleActions，也即是以下代码的 handleActions。

```js
// dva/packages/dva-core/src/handleActions.js
// 可以想象为一个大型的 switch case 语句，type匹配的时候才使用对应的reducer
function handleAction(actionType, reducer = identify) {
  return (state, action) => {
    const { type } = action;
    // 将闭包中的 actionType 和动态传入的 type 进行匹配判断
    if (actionType === type) {
      return reducer(state, action);
    }
    return state;
  };
}

// 比如 [reducer1, reducer2] 经过 reduceReducers 处理后变成：
// (state, action) => reducer2(reducer1(state, action), action)
function reduceReducers(...reducers) {
  return (previous, current) => reducers.reduce((p, r) => r(p, current), previous);
}

function handleActions(handlers, defaultState) {
  // 将所有reducer重新映射为有type类型判断的reducer。
  const reducers = Object.keys(handlers).map(type => handleAction(type, handlers[type]));
  // compose成为一个大的reducer
  const reducer = reduceReducers(...reducers);
  // 这里只是通过返回一个高阶函数做了 state = defaultState 默认操作
  return (state = defaultState, action) => reducer(state, action);
}

export default handleActions;
```

想要理解上面这一段代码，还是需要熟悉闭包和高阶函数，以及函数组合等概念的。因为作者利用了闭包和高阶函数所要达成的目的，就是让使用 dva 的人写 reducer 时可以更加便利，不用写一个巨大的 switch case 语句。

于是我们可以知道`store.asyncReducers[m.namespace]`即获得了一个将 model 命名空间下的所有 reducers 进行 compose（组合）后的巨大 reducer。

然后 `store.replaceReducer(createReducer());` store.replaceReducer 其实是 redux 提供的 api。

官方代码注释中写到：

> Replaces the reducer currently used by the store to calculate the state.
> You might need this if your app implements code splitting and you want to load some of the reducers dynamically. You might also need this if you implement a hot reloading mechanism for Redux.

同学们，上述文字的意思很明显，如果开发者有 code splitting 或者 动态加载 reducers 的需求，那需要这个 api 来进行热重载。

结合 dva-core 的代码来看，asyncReducers 就是动态加载 reducers。具体理解就是说在 app.start()之后的 app.model()中的 reducers 就会被划分在 asyncReducers 里面。因此也就需要热重载。因为在 redux 里，reducers 其实是文件里的一个对象，在初始化的 createStore 的时候就确定了。而在 dva-core 中，app.start()时即进行了 createStore 操作，所以需要 replaceReducer 来指示 redux，替换更新 reducers 对象。

那么我们看 createReducer 函数，其实就是将以下四者的一个有机整合：

1. app.start 之前确定的静态 reducers
2. plugin.get('extraReducers')中获取的附加 reducers
3. app.start 之后新增的动态 asyncReducers
4. 以及通过 plugin.get('onReducer')获取的，将以上三者进行增强的 enhancer

代码如下：

```js
// dva/packages/dva-core/src/index.js
function createReducer() {
  // reducerEnhancer => plugin.get('onReducer')
  return reducerEnhancer(
    combineReducers({
      ...reducers,
      // extraReducers => plugin.get('extraReducers');
      ...extraReducers,
      ...(app._store ? app._store.asyncReducers : {})
    })
  );
}
```

在 injectModel 里最后两句判断语句，其实就是在注册 effects 和 subscriptions。

```js
if (m.effects) {
  // 注册 effects
  store.runSaga(app._getSaga(m.effects, m, onError, plugin.get("onEffect"), hooksAndOpts));
}
if (m.subscriptions) {
  // 注册 subscriptions。
  unlisteners[m.namespace] = runSubscription(m.subscriptions, m, app, onError);
}
```

runSaga 其实就是 sagaMiddleware.run。通过 app.\_getSaga 同样封装返回了一个巨大的 saga。具体逻辑下文会深入描述。

runSubscription 将所有写在 model 的里的 subscriptions 运行，并将每个 subscription 返回的取消订阅事件的函数，收集后返回出去。具体逻辑下文同样会深入描述。

### 移除 model：unmodel

接下来，我们看 unmodel 干了什么事情。如果大家理解了上面的 model 函数。下面的 unmodel 函数自然不难理解。

```js
// dva/packages/dva-core/src/index.js
function unmodel(createReducer, reducers, unlisteners, namespace) {
  const store = app._store;

  // 删除reducers
  delete store.asyncReducers[namespace];
  delete reducers[namespace];
  store.replaceReducer(createReducer());
  store.dispatch({ type: "@@dva/UPDATE" });

  // 通过分发一个内部事件，取消副作用
  store.dispatch({ type: `${namespace}/@@CANCEL_EFFECTS` });

  // 取消监听这个命名空间的所有订阅
  unlistenSubscription(unlisteners, namespace);

  // 在app的内部models列表里删除此model
  app._models = app._models.filter(model => model.namespace !== namespace);
}
```

从语义上来看，unmodel 是取消注册一个 model，如何做到干净的移除这个 model 呢？分以下几步：

1. 删除所有该 model 命名空间的静态、动态 reducers。并通知 redux、dva。
2. 通过分发一个内部事件 `${namespace}/@@CANCEL_EFFECTS` 来通知取消 effects 副作用。
3. 执行该 model 所有订阅函数返回的取消订阅函数。
4. 从内部的 model 列表中过滤删除此 model。

### 更新 model：replaceModel

可以在 app.start()之后替换或新增已有 model。逻辑大致与 model、unmodel 类似。同学们可以参照上述二者理解。

```js
// dva/packages/dva-core/src/index.js
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

    // 在app的内部models列表里删除此model
    app._models.splice(oldModelIdx, 1);
  }

  // 直接更新此model
  app.model(m);

  store.dispatch({ type: "@@dva/UPDATE" });
}
```

### 订阅：subscriptions

执行订阅函数如下：

```js
// dva/packages/dva-core/src/subscription.js
export function run(subs, model, app, onError) {
  const funcs = [];
  const nonFuncs = [];
  for (const key in subs) {
    // 只执行用户编写的订阅函数
    if (Object.prototype.hasOwnProperty.call(subs, key)) {
      const sub = subs[key];
      const unlistener = sub(
        {
          dispatch: prefixedDispatch(app._store.dispatch, model),
          history: app._history
        },
        onError
      );
      // 期望返回的是取消订阅函数
      if (isFunction(unlistener)) {
        funcs.push(unlistener);
      } else {
        nonFuncs.push(key);
      }
    }
  }
  return { funcs, nonFuncs };
}
```

从 sub 的调用来看，传参格式为 ({ dispatch, history }, onError) => unlistenFunction。

dva 倡导大家写订阅函数的时候一定要返回取消订阅函数，就比如存在 addEventListener 就一定得存在 removeEventListener。这才是良好的开发习惯。同样在 React 的 useEffect 钩子里，也是如此。

如果开发者不返回取消订阅函数，在会被归类到 nonFuncs 里。在 unmodel、replaceModel 的时候则会喜提 dva 送你的大大的 warning。

```js
// dva/packages/dva-core/src/subscription.js
export function unlisten(unlisteners, namespace) {
  if (!unlisteners[namespace]) return;

  const { funcs, nonFuncs } = unlisteners[namespace];
  // dva不想看到你不写取消订阅函数，并毫不客气地向你丢了一个警告。
  warning(
    nonFuncs.length === 0,
    `[app.unmodel] subscription should return unlistener function, check these subscriptions ${nonFuncs.join(
      ", "
    )}`
  );
  // 遍历执行取消订阅的函数
  for (const unlistener of funcs) {
    unlistener();
  }
  delete unlisteners[namespace];
}
```

### 浅谈 reducers

reducers 是唯一可以修改 state 的地方。由 action 触发。

dva-core 所处理的部分上文有解释过，大体上来说就是将 reducers 的重新映射到对应命名空间。同时收集动态、静态、附加 reducers、以及通过 enhancer 增强处理。剩余的就是 redux 的工作了。

enhancer 的来源有 `enhancers = [applyMiddleware(...middlewares), ...extraEnhancers]`。其中 extraEnhancers 通过 plugin.get('extraEnhancers') 获取。applyMiddleware(...middlewares)则是将里面所有中间件在 redux 中注入{ getState, dispatch }的 api 后，再组合（compose）所有中间件之后返回出去。

redux 中间件的约定格式：

```js
const reduxMiddleware = store => next => action => {
  // ...
  next(action);
  // => dispatch(action)
};
```

其中 next 就是注入的 dispatch。

本质上 **applyMiddleware 所做的工作是将 store.dispatch 通过注入的中间件不断增强**，一层套一层（可以一定程度上参考 koa 中的中间件），最终返回的就是基本上是`{ getState, dispatch }`，但是里面的 dispatch 却是一个 compose 了所有中间件的 dispatch 了。

这一整套逻辑里面运用了大量的高阶函数、函数组合的技巧，的确让人头晕，建议大家可以自行整理一下。

帮助理解方式，结合**函数堆栈的压栈和弹栈**，这套中间件感觉就像是在打乒乓球一样，来回来回，的确十分有趣。

```js
// dva/packages/dva-core/src/createStore.js
// ...
// applyMiddleware这套逻辑得去redux里看。上文有描述。
const enhancers = [applyMiddleware(...middlewares), ...extraEnhancers];
// 再一次的compose enhancers，然后createStore也是去redux里看。
return createStore(reducers, initialState, composeEnhancers(...enhancers));
```

可以看到，无论是 redux 还是 dva。compose，也即是 reduce 都用到飞起。这里面涉及到了函数式编程里的函数组合概念，的确是高级、简洁又有用。

经过了这么多弯弯绕绕，带来的效果就是，dispatch 操作在走到 reducers 之前，必然得先经过层层中间件，最后才是最初的那个 dispatch 发挥它的作用。

## 关于 effects

effects 用于处理异步操作和业务逻辑，不直接修改 state。由 action 触发，可以触发 action。

关于 effects，其实是 dva 依赖 redux-saga 实现对异步操作、业务逻辑的一种管理，对其在内部进行了一次封装，暴露更加便利的 api。

在 start 初始化，以及在 model、repaceModel 的时候都有 runSaga（即是 sagaMiddleware.run）方法对指定 model 下所有 effects 进行一次。

```js
// dva/packages/dva-core/src/index.js
function injectModel() {
  // ...
  if (m.effects) {
    // 对该 model 的 effects 注册 saga 并运行
    store.runSaga(app._getSaga(m.effects, m, onError, plugin.get("onEffect"), hooksAndOpts));
  }
  // ...
}

function start() {
  const sagas = [];
  const reducers = { ...initialReducer };
  for (const m of app._models) {
    reducers[m.namespace] = getReducer(m.reducers, m.state, plugin._handleActions);
    if (m.effects) {
      // 对所有 model 通过 effects 注册saga
      sagas.push(app._getSaga(m.effects, m, onError, plugin.get("onEffect"), hooksAndOpts));
    }
  }
  // 运行所有 sagas
  sagas.forEach(sagaMiddleware.run);
}
```

而 app.\_getSaga 又是什么？本质上是将指定 model 下的所有 effect 集合生成一个大型的 saga，内部为一个根据 type 类型判断返回不同 saga 处理函数的 switch case 语句。比如有 watcher、takeEvery、takeLatest、throttle、poll 等 type 类型。

type 类型由 create(hooksAndOpts, createOpts)中的 hooksAndOpts 传入，不同的 type 类型返回不同的 saga 处理逻辑。type 默认为 takeEvery。

那么作为 dva 处理 effects 的入口，实现逻辑如下，贴上 getSaga 代码和注释：

```js
// dva/packages/dva-core/src/getSaga.js
export default function getSaga(effects, model, onError, onEffect, opts = {}) {
  // 返回了一个集合 saga
  return function*() {
    for (const key in effects) {
      if (Object.prototype.hasOwnProperty.call(effects, key)) {
        const watcher = getWatcher(key, effects[key], model, onError, onEffect, opts);
        // fork 是非阻塞调用
        const task = yield sagaEffects.fork(watcher);
        // 提供了一种取消副作用的方式
        yield sagaEffects.fork(function*() {
          // 等待取消该effect的信号
          yield sagaEffects.take(`${model.namespace}/@@CANCEL_EFFECTS`);
          // 执行取消
          yield sagaEffects.cancel(task);
        });
      }
    }
  };
}
```

基本上不同 type，都会走以下这一套 getWatcher 函数里的 sagaWithCatch 这个逻辑。

```js
// dva/packages/dva-core/src/getSaga.js
function* sagaWithCatch(...args) {
  // createPromiseMiddleware中会用到的 __dva_resolve 和 __dva_reject
  const { __dva_resolve: resolve = noop, __dva_reject: reject = noop } =
    args.length > 0 ? args[0] : {};
  try {
    // 发起saga的开始信号
    yield sagaEffects.put({ type: `${key}${NAMESPACE_SEP}@@start` });
    // 执行 effect这个 generator
    const ret = yield effect(...args.concat(createEffects(model, opts)));
    // 发起saga的结束信号
    yield sagaEffects.put({ type: `${key}${NAMESPACE_SEP}@@end` });
    resolve(ret);
  } catch (e) {
    // onError钩子触发
    onError(e, {
      key,
      effectArgs: args
    });
    if (!e._dontReject) {
      reject(e);
    }
  }
}
```

可以看到 \_\_dva_resolve 和 \_\_dva_reject 其实是在 createPromiseMiddleware 这个中间件里抛出的。但是决定 resolve 和 reject 的权力在 saga 里。

```js
// dva/packages/dva-core/src/createPromiseMiddleware.js
export default function createPromiseMiddleware(app) {
  return () => next => action => {
    const { type } = action;
    if (isEffect(type)) {
      return new Promise((resolve, reject) => {
        next({
          __dva_resolve: resolve,
          __dva_reject: reject,
          ...action
        });
      });
    } else {
      return next(action);
    }
  };
  // ...
}
```

因此我们可以手动实验， app.\_store.dispatch 一个 reducer 的时候，返回的是一个 action。但是 app.\_store.dispatch 一个 effect 的时候，却返回了一个 Promise，就是因为 createPromiseMiddleware 这个中间件的作用。

同时也会每个 effect 初始化的时候也会触发 `plugin.get('onEffect')` 钩子。

具体 effect 的处理逻辑其实还可深挖，但笔者对 redux-saga 并不是很熟，因此关于 saga 的介绍到此为止。

## 浅谈插件

关于 dva 中的钩子是由 Plugin 进行触发的。有如下这么多钩子：

```js
// dva/packages/dva-core/src/Plugin.js
const hooks = [
  "onError",
  "onStateChange",
  "onAction",
  "onHmr",
  "onReducer",
  "onEffect",
  "extraReducers",
  "extraEnhancers",
  "_handleActions"
];
```

dva-core 特意实现了一个 Plugin 类进行钩子的管理。

在 constructor 里通过 reduce 方式将上述钩子数组初始化为以下的形式：

```js
{
  "onError": [],
  "onStateChange": [],
  "onAction": [],
  "onHmr": [],
  "onReducer": [],
  "onEffect": [],
  "extraReducers": [],
  "extraEnhancers": [],
  "_handleActions": []
}
```

通过 plugin.use 方式往对应钩子 key 里更新数组，通过 plugin.apply、plugin.get 获取并调用。本质上并不复杂。

不过，这里提一句，关于插件 Plugin 的使用，在前端的各种库里的确是层出不穷。比如 Webpack、Rollup 等都大量使用。笔者也偏爱这种方式，它将内在的核心代码与外在注入的代码共同运行，但又从设计上，隔离了稳定与不稳定。同时甚至可以动态注册、插拔。

plugin 思想值得学习和实践。

## 关于 redux 和 redux-saga

由于 dva-core 依赖了 redux 和 redux-saga。在介绍 dva-core 之前，还是先简单熟悉一下两者的基本概念。（redux 是 dva-core 的 peerDependencies）

依赖方向：

```
dva <- dva-core <- redux-saga & redux
```

[redux](https://github.com/reduxjs/redux)的介绍，官网已经很详尽。

首先，redux 是一个很轻量的可预测的状态管理库。API 也只有 createStore、store.subscribe、 store.dispatch、 store.getState。简单易于理解。

createStore(reducer)创建单一状态树，同时配置一个函数签名为 (state, action) => state 的纯函数 reducer，用于描述不同的 action 应如何操作更新 state。
reducer 需要保持两个原则，第一是保持纯函数特性，第二是保持不可变数据，不修改上一次的 state，每次计算后返回新的 state。

那么 store.subscribe 和 store.dispatch 分别为状态树的订阅和事件分发。而 store.getState 可以获取当前的状态树快照。

因此使用的基本概念上可以理解为，将所有应用的状态 state 保存在单一的状态树 store 里，通过纯净的 reducer 控制如何更新状态，分发拥有具体描述和动作参数的 action 事件以应用对应的 reducer。然后经过 redux 处理后最终得以更新状态树，同时通知所有订阅者。

如果说 redux 是可以处理纯函数情况的话，那么 [redux-saga](https://github.com/redux-saga/redux-saga) 则是对应用副作用的一种增强管理工具。redux-saga 是 redux 的中间件。

## 浅谈 dva-core 的场景

笔者在半年以前，提起 redux 这些框架总会不自觉的与 react 相关联，事实上真的这些框架脱离了 react 难道就无法使用了么？以及如何扩展使用这些框架达成我们的应用需求呢？

而后来笔者因项目原因不进行 web 应用开发，第一次尝试开发业务底层相关 SDK 的时候，意识到虽然在使用 redux 上 react 是主要场景。但是 redux 作为状态管理库，作用域理应更大。那么基于 redux 衍生的 redux-saga、甚至于 dva（也就是今日的主题），那也可以脱离 web 应用开发场景进行理解与使用。

dva-core 其实是脱离了视图限制的一个类库（dva 依赖于 dva-core 实现了 model 层的管理）

那么请同学们细想一下，dva-core 其实相比 dva 扩展性更强，同时使用场景更广。比如，如果是构建一个 SDK，纯粹利用 dva-core 管理状态和副作用，也未尝不可。

同时 dva-core 封装了对于 redux 和 redux-saga 的一种更友好的使用方式。基于理解了 dva-core 的情况下，可以通过钩子增强、或者甚至自己 fork 下来进行增强。

因此，可以基于 dva-core 封装出适用于各种框架的状态管理方案。

作为一个底层类库，dva-core 是比上层类库 dva 更具有通用价值的。

同学们可以尽情发挥想象~

## 小结

文章最后还是啰嗦的提了一下 redux 和 redux-saga。虽然本文的确在解析 dva 中的 dva-core 的代码，但是如果想要真正熟悉 dva-core，前二者还是要稍微熟悉一下的。

关于 dva-core 的代码，笔者也是在业余时间断断续续研读了一两周，源代码解析类文章也是第一次尝试，不一定讲的清楚，但是之后肯定会越来越好。

另外关于读 dva-core 源代码的一点点建议：

1. redux 的源代码一定要读（早于 dva-core）
2. 读单元测试可以帮助你理解 dva 的 api： dva/packages/dva-core/test
3. 多写点 demo，反复验证想法
4. 学点函数式编程的知识和思想

这次的文章超乎想象的长，如果我发现有错别字或者不妥当的地方，会持续修改。

谢谢大家。
