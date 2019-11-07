（同事建议我用“自从用了递归，我头发又长回来了”作为标题，哈哈哈哈哈）

## 前言

首先，这是一篇用 haskell 和 javascript 两种语言来练习递归的基本实践（基准 + 递归条件）的分享文章。

一般解决一个问题，命令式语言期望我们给出求解步骤，而 haskell 则倾向于让你提供问题的描述，所以在 haskell 中，没有 while 和 for 循环，只有递归作为求解工具，所以递归之于 haskell 的重要性，可想而知。

在 javascript 里则比较灵活，这种灵活性给予了我们许多范式可以选择，即可使用 while 和 for 命令式的解决问题，也可以使用递归求解。

当然，声明两点：

1. haskell 语法不是本文的重点，但会适当讲解一下。
2. 本篇文章不代表具有任何实用性，但肯定有一定的学习参考价值。

## 递归的用处？

递归善于处理树、图等数据结构，比如抽象语法树、DOM 处理。同时可以优雅解决一些循环语句不能解决的问题等。

但是也会有使用不恰当，导致堆栈溢出、内存泄漏的情况，有可能也比较晦涩难懂，把代码转交给同事的时候，可能人家一脸懵逼。

但是！值得学习值得学习值得学习，重要的事情说三遍。

## 文章规约

本文每个函数都会贴两种语言的同一种实现， haskell 和 javascript。大家如果和我一样略懂 haskell，也可以品尝一下 haskell 代码。不过作为一名前端工程师，本文主要看 javascript 代码即可。

## elem

判断元素是否存在元素列表中

```haskell
elem' :: (Eq a) => a -> [a] -> Bool
elem' a [] = False
elem' a (x:xs)
    | a == x    = True
    | otherwise = a `elem'` xs
```

```js
function elem(a, list) {
  if (list.length === 0) {
    return false;
  }
  if (a === list[0]) {
    return true;
  }
  return elem(a, list.slice(1));
}
```

首先我们先看第一段 haskell 的实现：

`elem' :: (Eq a) => a -> [a] -> Bool` 这一句实际上是 elem' 函数的类型签名（使用过 ramda.js 的同学应该也比较眼熟）,意思可大概理解为，elem' 函数接收 任意类型 a 和 任意类型 a[], 最终返回一个布尔值类型。

（补充一下，haskell 的函数都是自动柯里化的，所以函数签名才会 `a -> [a] -> Bool`。因为如果只传一个参数，则签名可以理解为：`a -> ([a] -> Bool)`）

接下来以 elem' 两句表达式在 haskell 里被称为模式匹配，当然也可以理解为函数重载。对于 javascript 来说没有函数重载的语法机制，但是我们可以通过 arguments 的类型和数量人工模拟重载。

因此，以上两句，也就意味着：

第一句 `elem' a [] = False` 如果第二个数组参数匹配为空数组，则默认返回 False，很明显，空数组不可能包含任意元素~

第二句 `elem' a (x:xs) | a == x = True | otherwise = a`elem'`xs`，有 | 的地方被 Haskell 称为 Guards，暂时也可以简单理解为 if else 或者 switch case。而`(x:xs)`这个很像 ES6 中的解构赋值，将传入匹配的数组列表参数切成了第一个元素 x 和剩下的所有元素 xs。因此在满足此前提下，如果 a==x 则 返回了 True，否则递归判断 a 是否在剩余的 xs 数组里。

注意以上，在 elem'函数里，递归的基准，也称边界条件，就是 a [] = False 或者 a == x = True。
而递归条件就是 x:xs 和 a `elem'` xs（这里使用了中缀表达式）

以上，就是 haskell 里的 elem'递归实现原理。

那么如果以上关于 haskell 的部分没有理解，可以直接看上述的 javascript 编写的递归。

同样，递归的基准是两个 if 判断，分别返回不存在和存在的两种结果。
而递归条件则是 `elem(a, list.slice(1))`。如果以上两个边界条件均为触发，则我们将元素列表缩小范围，递归再次判断。

正常解法：include， indexOf，lastIndexOf

## sum

数字列表求和

```haskell
sum' :: Num a => [a] -> a
sum' []  = 0
sum' (x:xs) = x + sum' xs
```

```js
function sum(list) {
  if (list.length === 0) {
    return 0;
  }
  return list[0] + sum(list.slice(1));
}
```

同理如上，一样用递归的基准 + 递归条件来理解。

甚至我们得到了一个问题的定义：**一个数字列表的和**，必然等于**第一个数**和**剩余列表数字和**的**和**。

正常解法：list.reduce

## maximum

求数字列表的最大值

```haskell
maximum' :: (Ord a) => [a] -> a
maximum' [] = error "maximum of empty list"
maximum' [x] = x
maximum' (x:xs) = max x (maximum' xs)
```

```js
function maximum(list) {
  if (list.length === 0) {
    throw new Error("maximum of empty list");
  }
  if (list.length === 1) {
    return list[0];
  }
  return Math.max(list[0], maximum(list.slice(1)));
}
```

正常解法：当然直接用 `Math.max(1,2,30,4,5)`是直接可以的，

## repeat

重复一个值

```haskell
repeat' :: a -> [a]
repeat' x = x:repeat' x
```

```js
function repeat(x) {
  return [x].concat(repeat(x));
}
```

这里比较有趣的是，haskell 本身是惰性计算，因此同样的实现，在 javascript 里会堆栈溢出，而在 haskell 里可以妥妥的，如下，take 5 告诉 haskell 只需要 5 个 repeat 的值就可以啦，于是人家就及时停止了。

```bash
Prelude> take 5 (repeat "*")
["*","*","*","*","*"]
```

## replicate

固定次数重复一个值

```haskell
replicate' :: (Num i, Ord i) => i -> a -> [a]
replicate' n x
    | n <= 0    = []
    | otherwise = x:replicate' (n-1) x
```

```js
function replicate(n, x) {
  if (n <= 0) {
    return [];
  }
  return [x].concat(replicate(n - 1, x));
}
```

还是一样，不多说。

不过一般人正常解法，还是 `"?".repeat(n).split('')`

## reverse

数组倒序

```haskell
reverse' :: [a] -> [a]
reverse' [] = []
reverse' (x:xs) = reverse' xs ++ [x]
```

```js
function reverse(list) {
  if (list.length === 0) {
    return [];
  }
  return reverse(list.slice(1)).concat(list[0]);
}
```

倒序的递归还是挺有意思的，感觉可以归纳为一句话：一个数组的倒序结果，等于第一个元素推入剩余元素数组的倒序结果。

## take

取数组元素的前 n 项

```haskell
take' :: (Num i, Ord i) => i -> [a] -> [a]
take' n _
    | n <= 0   = []
take' _ []     = []
take' n (x:xs) = x : take' (n-1) xs
```

```js
function take(n, list) {
  if (n <= 0) {
    return [];
  }
  if (list.length === 0) {
    return [];
  }
  return [list[0]].concat(take(n - 1, list.slice(1)));
}
```

到这里，基本感觉是一种递归思想写一百个不同的函数了。

正常解法：当然是直接 slice 呀哈哈哈哈

## zip

将两个数组的元素打成一对对 pair

（我们可以理解为，尽可能的组 cp 哈哈哈）

```haskell
zip' :: [a] -> [b] -> [(a,b)]
zip' _ [] = []
zip' [] _ = []
zip' (x:xs) (y:ys) = (x,y):zip' xs ys
```

```js
function zip(list1, list2) {
  if (list1.length === 0) {
    return [];
  }
  if (list2.length === 0) {
    return [];
  }
  return [[list1[0], list2[0]]].concat(zip(list1.slice(1), list2.slice(1)));
}
```

haskell 里的 zip，把两个数组打包成了一对对的元祖。

```bash
Prelude> zip ["a","b","c"] [1,2,3]
[("a",1),("b",2),("c",3)]
```

由于 javascript 里没有元祖，只能用数组模拟。

```bash
> zip(["a","b","c"], [1,2,3])
[ [ 'a', 1 ], [ 'b', 2 ], [ 'c', 3 ] ]
```

虽然 zip 函数看上去稍微复杂了点，但是细细一看，其实也不过如此，对吧。

## quicksort

快速排序

```haskell
quicksort :: (Ord a) => [a] -> [a]
quicksort [] = []
quicksort (x:xs) =
    let smallerSorted = quicksort [a | a <- xs, a <= x]
        biggerSorted = quicksort [a | a <- xs, a > x]
    in smallerSorted ++ [x] ++ biggerSorted
```

```js
function quicksort(list) {
  if (list.length === 0) {
    return [];
  }
  let x = list[0];
  let rest = list.slice(1);

  let smallerSorted = quicksort(rest.filter(i => i <= x));
  let biggerSorted = quicksort(rest.filter(i => i > x));

  return [smallerSorted, x, biggerSorted].flat();
}
```

这里的 quicksort'方法 [a | a <- xs, a <= x] 用到了一个 haskell 里很有趣的 List Comprehension，这种写法有点像数学里的集合。

在 javascript 里，可以通过写两个 filter 分别替代 [a | a <- xs, a <= x] 和 [a | a <- xs, a > x]。


当然，算法的定义：排过序的数组，就是令所有小于等于头部的元素在先(它们已经排序完成), 后跟大于头部的元素(它们同样已经排序完成)。
这里与众不同的是，因为定义中有两次排序，所以就递归两次！~

这个函数实现的确证明了递归之美，对吧~

## 写在最后

本文兴趣所致，希望同学们看完后，有一点点收获即可~