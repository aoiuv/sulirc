## 前言
什么是Pointfree风格？中译过来是**无参数风格**或者**无值风格**，意即为在编写程序时不关注具体数据以及对象，而只关注的是运算过程。

下文将用简单的例子带大家了解Pointfree风格~

## 命令式编程的问题？
> "告诉计算机该怎么做，详细的执行步骤"

考虑以下需求：小A去水果店去买水果，他想知道水果店里有存货并且最贵的水果名称是什么？

```js
const fruits = [
  { name: 'Apple', price: 4, stock: true },
  { name: 'Peach', price: 14, stock: true },
  { name: 'Grape', price: 30, stock: false },
  { name: 'Pear', price: 6, stock: true },
];
```

我们常见的实现方式一般如下：
```js
// Ex 1
const fruitsHaveStock = fruits.filter(fruit => fruit.stock);
const sortedDescFruits = fruitsHaveStock.sort((a, b) => b.price - a.price);
const mostExpensiveFruitName = sortedDescFruits[0].name;
console.log(mostExpensiveFruitName); // Peach
```

这个是很明显的命令式编程，因为大脑会习惯线性的去理解事物，所以我们自然而然的罗列了这个需求的实现步骤，从而实现了上述的需求。但是这样的代码缺点如下：
1. 代码难以复用。
2. 代码自上而下，并没有组织，从阅读上需要完整的从上至下阅读，才能了解发生了什么事。
3. 可以观察到`fruits.filter(fruit => fruit.stock);`中的`fruit`参数、`fruitsHaveStock`、`sortedDescFruits`这些都是Point，换句话说，我们的程序关注了被操作的数据！

## 运用声明式编程和无值风格优化代码
> "告诉计算机做什么，我们想要什么"

### 声明式编程风格
上述代码用声明式的风格重写一下~
```js
// Ex 2
const filter = predicate => list => list.filter(predicate);
const propEq = (key, value) => target => target[key] === value;
const compose = (...funcs) => result => [...funcs]
  .reverse()
  .reduce((result, fn) => fn(result), result);
const sort = func => list => list.sort(func);
const prop = key => target => target[key];
const head = list => list.slice(0, 1).pop();

function getHaveStock(list) {
  return filter(propEq('stock', true))(list);
}

function sortByPriceDesc(list) {
  return sort((a, b) => b.price - a.price)(list);
}

function getName(target) {
  return prop('name')(target);
}

function getMostExpensiveFruitName(list) {
  return compose(
    getName, head, sortByPriceDesc, getHaveStock
  )(list);
}

console.log(getMostExpensiveFruitName(fruits)); // Peach
```
同学们对比Ex 1和Ex 2代码，可以发现两点：
1. 我写了一些通用工具方法`filter`、`propEq`、`compose`等等
2. 最后compose的时候，可以明确知道数据流从 **getHaveStock -> sortByPriceDesc -> head -> getName**。而我们不需要了解这些函数的细节实现，从这些函数名称上来看，可以清晰的知道我们要对接收的数据进行的操作！

（备注，关于`compose`方法如果不懂的话，可以阅读我之前写的一篇文章参考哦：[Compose & Pipe - 函数式编程](https://juejin.im/post/5cbde76df265da0354030c31)）(●´∀｀●)ﾉ

### Pointfree风格，不关注数据！
但是问题来了，细心的同学应该发现了一个问题，虽然说我们改成了声明式编程的风格，但是我们还是关注了要处理的数据本身（也就是值），什么意思？

比如这个函数：
```js
function getHaveStock(list) {
  return filter(propEq('stock', true))(list);
}
```
因为我们只想关心怎么运算操作！list参数对于函数本身实现来说，完全属于多余，且也不需要关注的。

于是我们可以改写如下：
```js
const getHaveStock = filter(propEq('stock', true));
```
其余`sortByPriceDesc`, `getName`, `getMostExpensiveFruitName`同理优化。于是就达到了我们说的 **Pointfree** 啦！（因为我们干掉了point -> list参数）

当然，说不定有些同学发发牢骚了：“代码好像变得更长了...而且还写了一大堆莫名其妙的工具方法，我才不想这么干呢！”

这位同学说的有道理！请继续往下看~

### Ramda
> 一款实用的，专门为函数式编程风格而设计的JavaScript函数式编程库

如果决心了解JavaScript函数式编程，并且想要用Pointfree风格优化一下代码，那么ramda是值得学习的！它帮我们省掉了上述Ex 2写的大量工具函数。
官网贴上：[ramda](https://ramdajs.com/)

所以，我们使用**ramda**改写一下~
```js
// Ex 3
const { filter, propEq, sort, prop, compose, head } = require('ramda');
const haveStock = propEq('stock', true);
const getHaveStock = filter(haveStock);
const sortByPriceDesc = sort((a, b) => b.price - a.price);
const getName = prop('name');

const getMostExpensiveFruitName = compose(
  getName, head, sortByPriceDesc, getHaveStock
);

console.log(getMostExpensiveFruitName(fruits)); // Peach
```

上述代码的优点体现在以下三方面：
1. 代码从可读性上来说提升了
2. 代码可复用性增强了，haveStock、getHaveStock、sortByPriceDesc、getName这些函数并没有关注被处理的数据，而是关注处理本身。
3. 纯函数利于写单元测试

备注：ramda其实可以大致理解为函数式风格的lodash工具库，它和lodash的区别主要在于两点：
1. Ramda函数本身都是自动柯里化的。
2. Ramda函数参数的排列顺序更便于柯里化。要操作的数据通常在最后面。（也意味着通常第一个传入的参数是函数方法）。

## 小结
Pointfree风格的确需要一定的时间才能习惯，但是也不能一概而论把所有函数的参数都移除掉，具体情况还是需要具体分析。Pointfree风格虽然有时候也会造成一些困惑，但的确让代码更加简洁和易于理解了。

当然，如果愿意花点时间去练习和习惯Pointfree风格，相信还是会很值得的。

