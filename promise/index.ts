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
  return new SimplePromise(r => r(value + 1));
}

function onReject(error: any) {
  console.log('onReject', error);
}

const ret = p1.then(onResolve);
console.log('ret', ret);

