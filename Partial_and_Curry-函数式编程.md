## 什么是函数式编程

在文章之前，先和大家讲一下对于函数式编程（*Functional Programming, aka. FP*）的理解（下文我会用FP指代函数式编程）：

1. FP需要保证函数都是纯净的，既不依赖外部的状态变量，也不产生副作用。基于此前提下，那么纯函数的组合与调用，在时间顺序上就不会产生依赖，改变多个函数的调用顺序也不必担心产生问题，因此也会消灭许多潜在的bug。
2. 函数必须有输入输出。如果一个函数缺乏输入或输出，那么它其实是一段处理程序*procedure*而已。
3. 函数尽可能的保持功能的单一，如果一个函数做了多件事情，那么它理论上应当被拆分为多个函数。
4. FP的意义之一就是，在适当的时机使用声明式编程，抽象了程序流的控制与表现，从理解和维护的角度上会胜于命令式编程。
5. FP是一种范式，但并不意味这和OOP（面向对象编程）冲突，两者当然是可以和谐共存的。个人认为 **React** 其实就是一个很好的栗子~
6. Javascript的函数一等公民以及闭包的特性，决定了Javascript的确是适合施展FP的舞台

## 理解闭包

闭包对于 **Javascript** 来说，当然十分重要。然而对于函数式编程来说，这更加是必不可少的，必须掌握的概念，闭包的定义如下：

> Closure is when a function remembers and accesses variables from outside of its own scope, even when that function is executed in a different scope.

相信大部分同学都对闭包有不错的理解，但是由于对FP的学习十分重要。接下来我还是会啰嗦的带大家过一遍。**闭包就是能够读取其他函数内部变量的函数**

简单示例如下
```js
// Closure demo
function cube(x) {
  let z = 1;
  return function larger(y) {
    return x * y * z++;
  };
}

const makeCube = cube(10);
console.log(makeCube(5)); // 50
console.log(makeCube(5)); // 100
```

那么有没有想过在函数makeCube，或者也可以说是函数larger是怎么记住原本不属于自己作用域的变量x和z的呢？在控制台查看`makeCube.prototype`，点开会发现原来是有个`[[Scopes]]`这个内置属性里的`Closure(cube)`记住了函数larger返回时记住的变量x和z。如果多嵌套几层函数，也会发现多几个Closure(name)在`[[Scopes]]`的`Scopes[]`数组里，按序查找变量。

![](https://user-gold-cdn.xitu.io/2019/4/18/16a30d856665c6dd?w=1138&h=488&f=png&s=77927)

再看下图测试代码：
```js
function cube(x) {
  return function wrapper(y) {
    let z = 1;
    return function larger() {
      return x * y * z++;
    };
  }
}

const makeCubeY = cube(10);
const makeCube = makeCubeY(5);
const $__VAR1__ = '1. This var is just for test.';
let $__VAR2__ = '2. This var is just for test.';
var $__VAR3__ = '3. This var is just for test.';
console.log(makeCubeY.prototype, makeCube.prototype);
console.log(makeCube()); // 50
console.log(makeCube()); // 100
```

打印`makeCubeY.prototype`：
![](https://user-gold-cdn.xitu.io/2019/4/19/16a35b3bdf4c2ee6?w=976&h=746&f=png&s=132185)

打印`makeCube.prototype`：
![](https://user-gold-cdn.xitu.io/2019/4/19/16a35b5369778785?w=1076&h=668&f=png&s=125125)

通过这几个实验可以从另一个角度去理解Javascript中闭包，一个闭包是怎么去查找不是自己作用域的变量呢？makeCube函数分别从`[[Scopes]]`中的Closure(wrapper)里找到变量y、z，Closure(cube)里找到变量x。至于全局let、const声明的变量放在了`Script`里，全局var声明的变量放在了`Global`里。

在学习FP前，理解闭包是尤为重要的~ 因为事实上大量的FP工具函数都使用了闭包这个特性。

## 工具函数

### `unary`

```js
const unary = fn => arg => fn(arg);
```
一元函数，应用于当只想在**某个函数上传递一个参数**情况下使用。尝试考虑以下场景：
```js
console.log(['1', '2', '3'].map(parseInt)); // [1, NaN, NaN]
console.log(['1', '2', '3'].map(unary(parseInt))); // [1, 2, 3]
```
`parseInt(string, radix)`接收两个参数，而map函数中接收的回调函数`callback(currentValue[, index[, array]])`，第二个参数是index，此时如果parseInt的使用就是错误的。当然除了`Array.prototype.map`，大量内置的数组方法中的回调函数中都不止传递一个参数，如果存在适用的只需要第一个参数的场景，unary函数就发挥了它的价值，无需修改函数，优雅简洁地就接入了。（对于unary函数，fn就是闭包记忆的变量数据）

### `identity`

```js
const identity = v => v;
```
有同学会看到identity函数会觉得莫名其妙？是干嘛的？我第一眼看到也很迷惑？但是考虑以下场景：
```js
console.log([false, 1, 2, 0, '5', true].filter( identity )); // [1, 2, "5", true]
console.log([false, 0].some( identity )); // false
console.log([-2, 1, '3'].every( identity )); // true
```
怎么样？眼前一亮吧，没想到`identity`函数原来深藏不露，事实上虽然identity返回了原值，但是在这些函数中Javascript会对返回的值进行类型装换，变成了布尔值。比如filter函数。我们可以看MDN定义filter描述如下（看标粗的那一句）。
> filter() calls a provided callback function once for each element in an array, and constructs a new array of all the values for **which callback returns a value that coerces to true.** 

### `constant`

```js
const constant = v => () => v;
```
同样，这个函数...乍一看，也不知道具体有什么用。但是考虑场景如下：
```js
const p1 = new Promise((resolve, reject) => {
  setTimeout(() => {
    resolve('Hello!');
  }, 200);
});
p1.then(() => 'Hi').then(console.log); // Hi!
p1.then(constant('Hi')).then(console.log); // Hi!
p1.then('Hi').then(console.log); // Hello!
```
由于`Promise.prototype.then`只接受函数，如果我仅仅只需要传递一个值时，那么`constant`便会提供这种便利。当然这个并没有什么功能上的提升，但是的确提高了可阅读性，也是函数式编程的一个优点。

### `spreadArgs` & `gatherArgs`
```js
const spreadArgs = fn => argsArr => fn( ...argsArr );
const gatherArgs = fn => (...argsArr) => fn( argsArr );
```
嗯这两个函数见名知义。分别用于展开一个函数的所有参数和收集一个函数所有参数，这两个函数明显对立，那么它们的应用场景又是什么呢？

spreadArgs函数示例如下：
```js
function cube(x, y, z) {
  return x * y * z;
}

function make(fn, points) {
  return fn(points);
}

console.log(make(cube, [3, 4, 5])); // NaN
console.log(make(spreadArgs(cube), [3, 4, 5])); // 60
```

gatherArgs函数示例如下：
```js
function combineFirstTwo([v1, v2]) {
  return v1 + v2;
}

console.log([1, 2, 3, 4, 5].reduce(combineFirstTwo)); // Uncaught TypeError
console.log([1, 2, 3, 4, 5].reduce(gatherArgs(combineFirstTwo))); // 15
```
看完以上代码，简单的两个工具函数，轻易的做到了对一个函数的转换，从而使其适用于另一个场景。如果从此应该可以瞥见函数式编程的一点点魅力，那么下面的两个函数将给大家带来更多的惊喜。

### `partial` & `curry`

```js
const partial = (fn, ...presetArgs) => (...laterArgs) =>
  fn(...presetArgs, ...laterArgs);
  
const curry = (fn, arity = fn.length, nextCurried) =>
  (nextCurried = prevArgs => nextArg => {
    const args = [...prevArgs, nextArg];

    if (args.length >= arity) {
      return fn(...args);
    } else {
      return nextCurried(args);
    }
  })([]);
```
相信大家对函数柯里化应该或多或少有点了解。维基百科定义：
> 在计算机科学中，柯里化（英语：Currying），又译为卡瑞化或加里化，是把接受多个参数的函数变换成接受一个单一参数（最初函数的第一个参数）的函数，并且返回接受余下的参数而且返回结果的新函数的技术。

当然得益于闭包的强大威力，柯里化这个武器得以诞生于Javascript世界。请大家先精读以上关于partiel、curry函数的代码。

喝一杯咖啡~

先模拟一个ajax函数如下：
```js
function ajax(url, params, callback) {
  setTimeout(() => {
    callback(
      `GET ${url} \nparams: ${params} \ndata: Hello! ${params} `
    );
  });
}
```

考虑partial使用场景如下：
```js
const fetchPerson = partial( ajax, "http://some.api/person" );

fetchPerson('Teddy Bear', console.log);
/*
GET http://some.api/person 
params: Teddy Bear 
data: Hello! Teddy Bear 
*/
```

考虑curry使用场景如下：
```js
const fetchPerson = curry(ajax)('http://some.api/person');
const fetchUncleBarney = fetchPerson('Uncle Barney');

fetchUncleBarney(console.log);
/*
GET http://some.api/person 
params: Uncle Barney 
data: Hello! Uncle Barney 
*/
```

partial和curry函数功能相似，但又有具体的不同应用场景，但总体来说curry会比partial更自动化一点。

但是！相信看完示例的同学又会有一连串问号？为什么好好地参数不一次性传入，而非要分开多次传入这么麻烦？原因如下：

1. 最首要的原因是partial和curry函数都允许我们通过参数控制将一个函数的调用在时间和空间上分开了。传统函数需要一次性将参数凑齐才能调用，但是有时候我们可以提前预置部分参数，在最终需要触发此函数时，才将剩余参数传入。这时候partial和curry就会变得十分有用。
2. partial和curry的存在让函数组合（*compose*）会更加便利。（函数组合也计划之后和大家分享，这里就不详细说了）。
3. 当然最重要是也提升了可阅读性！一开始可能不这么以为，但是如果你实践操作感受之后，也许会改观。

P.S. 关于函数式编程的实践，大家可以使用`lodash/fp`模块进行入门实践。

## 一些思考

因为我也是函数式编程的初学者，如有不正确的地方，欢迎大家纠正~

接下来还是会继续整理FP的学习资料，学习实践，连载一些我对于函数式编程的学习与思考，希望和大家一起进步~

谢谢大家(●´∀｀●)~