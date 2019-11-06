首先，这是一篇很轻松的技术随笔，想用haskell和javascript来双向练习递归的基本思想（基准 + 递归条件）

其次，本篇文章不代表具有任何实用性，但肯定有一定的学习参考价值。

所以，请看代码！

## elem

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