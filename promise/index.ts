/**
 * Promise
 * 1. 回调函数的延时绑定
 * 2. 返回值穿透到最外层
 * 3. 错误冒泡
 */

import SimplePromise from './simple-promise';

// --------------------------------------

const p1 = new SimplePromise(executor);

function executor(resolve: Function, reject: Function) {
  resolve(1);
  reject('promise error');
}

function onResolve(value: any) {
  console.log('onResolve', value);
  return new SimplePromise((r) => r(value + 1));
}

function onReject(error: any) {
  console.log('onReject', error);
}

// const ret = p1.then(onResolve).catch(onReject);
// console.log('ret', ret);

// ret.then(v => console.log('ret value', v));

// ----------

// console.log('\\\\\\\\/////////')
const constant = v => v;
const a1 = new Promise((resolve, reject) => {
  // throw new TypeError('This is a TypeError');
  setTimeout(() => {
    resolve('This is normal');
    reject('This is unusual');
  });
});

const a2 = a1
  .then(
    (value) => {
      console.log('a1 onResolve', value);
      return Promise.resolve(value + ' :)');
    },
    (reason) => {
      // throw new TypeError('This is a TypeError2');
      console.log('a1 onReject', reason);
    }
  )
  // .catch((err) => {
  //   console.log('a1 onCatch', err);
  // })
  .then(constant);

a2.then((value) => {
  console.log('a2 onResolve', value);
});
