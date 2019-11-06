首先，这是一篇很轻松的技术随笔，想用 haskell 和 javascript 来双向练习递归的基本思想（基准 + 递归条件）。

在 haskell 中，递归十分重要，一般解决一个问题，命令式语言期望我们给出求解步骤，而 haskell 则倾向于让你提供问题的描述，所以在 haskell 中，没有 while 和 for 循环，只有递归作为求解工具。

而 javascript 则比较灵活，即可使用 while 和 for 命令式的解决问题，也可以使用递归求解。

当笔者以 haskell 部分实现的函数为参考，编写对应的递归 javascript 函数时，发现实现思路十分简洁，又起到了一定的练习作用，故而分享。

当然，声明两点：

1. haskell 语法不是本文的重点，但会适当讲解一下。
2. 本篇文章不代表具有任何实用性，但肯定有一定的学习参考价值。

所以，请看代码！

## elem

函数 elem：判断元素在不在数组列表

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

`elem' :: (Eq a) => a -> [a] -> Bool` 这一句实际上是 elem' 函数的类型签名（使用过 ramda.js 的同学应该也比较眼熟）,意思可大概理解为，elem' 函数接收 任意类型 a 和 任意类型 a[], 最终返回一个布尔值类型。（haskell 的函数都是自动柯里化的，但本文不与之相关）。

接下来以 elem' 两句表达式在 haskell 里被称为模式匹配，当然也可以理解为函数重载，java 同学应该比较好理解，对于 javascript 来说，没有函数重载的语法机制，但是可以通过 arguments 的类型和数量人工模拟重载。

因此，以上两句，也就意味着：

第一句 `elem' a [] = False` 如果第二个数组参数匹配为空数组，则默认返回 False，废话，空数组不可能包含任意元素~
第二句 `elem' a (x:xs) | a == x = True | otherwise = a`elem'`xs`，有 | 的地方被 Haskell 称为 Guards，暂时也可以简单理解为 if else 或者 switch case。而`(x:xs)`这个很像 ES6 中的解构赋值，将传入匹配的数组列表参数切成了 第一个元素 x 和剩下的所有元素 xs。因此在满足此前提下，如果 a==x 则 返回了 True，否则递归判断 a 是否在剩余的 xs 数组里。

注意以上，在 elem'函数里，递归的基准，也称边界条件，就是 a [] = False 或者 a == x = True。
而递归条件就是 x:xs 和 a `elem'` xs（这里使用了中缀表达式）

以上，就是 haskell 里的 elem'递归实现原理。

那么如果没有消化明白，可以直接看上述的 javascript 编写的递归。

（对了，同学们不要问为什么不直接使用 include， indexOf，lastIndexOf 这些方法里实现。敲黑板！！本文函数纯做学习讨论！

## sum

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

## maximum

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

## repeat

```haskell
repeat' :: a -> [a]
repeat' x = x:repeat' x
```

```js
function repeat(x) {
  return [x].concat(repeat(x));
}
```

## replicate

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

## reverse

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

## take

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

## zip

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

## quicksort

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

  let smallerSorted = quicksort(LE(x, rest));
  let biggerSorted = quicksort(GT(x, rest));

  return [smallerSorted, x, biggerSorted].flat();
}

function LE(x, list) {
  let result = [];
  for (let i = 0; i < list.length; i++) {
    list[i] <= x && result.push(list[i]);
  }
  return result;
}

function GT(x, list) {
  let result = [];
  for (let i = 0; i < list.length; i++) {
    list[i] > x && result.push(list[i]);
  }
  return result;
}
```

这里的 quicksort'方法 [a | a <- xs, a <= x] 用到了一个 haskell 里很有趣的 List Comprehension，这种写法有点像数学里的集合。

表示方便，我用 javascript 写个个 LE 和 GT 分别替代 [a | a <- xs, a <= x] 和 [a | a <- xs, a > x]。
