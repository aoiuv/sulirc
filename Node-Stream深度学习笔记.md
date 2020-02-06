# 前言

很久以前。笔者听过流的概念，那是来自 RxJS 社区里的名言：“一切皆是流”。从某个角度理解，还挺有哲学意味的。比如在 RxJS 有 map、filter、repeat、first、debounce 等许多操作符，就可以操作流。

比如 map 操作符：

![](https://user-gold-cdn.xitu.io/2020/2/6/1701b0aba8a100f3?w=1630&h=540&f=png&s=41871)

再比如 filter 操作符：

![](https://user-gold-cdn.xitu.io/2020/2/6/1701b0c918f41ae7?w=1632&h=538&f=png&s=45008)

是不是很像我们代码里直接写 Array.prototype.map()、Array.prototype.filter()。但是我们可以理解为“值”的投射，如果这些值一直在不断生产，那么就变成了流。概念很相似，但是 RxJS 在上面附加了推、拉模型等概念，使得处理异步事件的序列组合等逻辑更加友好。

后来了解到 bash，在 unix 系统中可以用 | 符号来实现流，比如笔者想要计数自己的博客《浅谈 TypeScript 下的 IoC 容器原理》里出现了几次的 IoC 这个缩写。

```bash
$ cat 浅谈TypeScript下的IoC容器原理.md | grep -o "IoC" | wc -w

15
```

笔者用 cat 程序序列化读取整个文件（cat -- concatenate and print files），然后以标准输出流（standard output）发送到 grep 程序，grep 通过 | 接收标准输入流（standard input），匹配过滤出 IoC，然后将标准输出流发送给 wc 程序，wc 同理通过 | 接收标准输入流，-w 参数计数单词数量。

基本上每个程序如果运行成功，都会返回 0，如果错误一般会返回大于 0。

通过 |，组合了 cat、grep、wc 程序，当你想想 unix 系统里存在多少命令，每个命令又有大量的参数，当你使用流的概念组合使用这些命令时，只能说，这时候只有想象力才会限制你的能力。

后来，又发现，在函数式编程里的 compose，pipe 来组合单一职责的函数，在 koa、redux 里组合中间件，也是有异曲同工之妙。

说了这么多，也只是笔者写本文的一些发散思维。本文重点虽然是 Node 的 stream，但是笔者却觉得学习 stream 上，可以从更广泛的概念去学。

## process.stdin / process.stdout

```
0 stdin The standard input.
1 stdout The standard output.
2 stderr The errors output.

  >    Redirecting output
&>    Redirecting output and error output
&>>   Appending redirected output and error output
  <    Redirecting input
<<    [Here documents](http://tldp.org/LDP/abs/html/here-docs.html) syntax
<<<   [Here strings](http://www.tldp.org/LDP/abs/html/x17837.html)

```

## fs.createReadStream / fs.createWriteStream

## http.createServer

## crypto

## split

## concat-stream

## through2

## duplexer2

## Object Mode

## 参考资料

- [stream-handbook](https://github.com/substack/stream-handbook)
- [[译] 你所需要知道的关于 Node.js Streams 的一切](https://www.yuque.com/afx/blog/node-js-streams-everything-you-need-to-know)
- [stream adventure](https://github.com/workshopper/stream-adventure)
