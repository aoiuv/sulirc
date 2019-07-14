## 前言

The term originated as a humorous past-tense version of "think".
这个词起源于“思考”的幽默过去式。

Time is the most complex factor of state in your program

## 什么是 Thunk

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

## Thunk 结合中间件？

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

## redux-thunk

```js
function createThunkMiddleware(extraArgument) {
  return ({ dispatch, getState }) => next => action => {
    if (typeof action === "function") {
      return action(dispatch, getState, extraArgument);
    }

    return next(action);
  };
}

const thunk = createThunkMiddleware();
thunk.withExtraArgument = createThunkMiddleware;

export default thunk;
```

## Thunk 与 Closure

## Thunk 与 Promise

## 小结

## 参考资料
