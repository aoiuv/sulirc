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

用 cat 程序序列化读取整个文件（cat -- concatenate and print files），然后以标准输出流（standard output）发送到 grep 程序，grep 通过 | 接收标准输入流（standard input），匹配过滤出 IoC，然后将标准输出流发送给 wc 程序，wc 同理通过 | 接收标准输入流，-w 参数计数单词数量。

（基本上每个程序如果运行成功，都会返回 0，如果错误一般会返回大于 0。）

通过 |，组合了 cat、grep、wc 程序，unix 系统里存在大量命令，每个命令又有大量的参数，当使用流的概念组合使用这些命令时，不需要图形化界面、软件的协助，却可以完成很多事情。

当然后来又发现，在函数式编程里的 compose，pipe 来组合单一职责的函数，以及在 koa、redux 里组合中间件，也是有异曲同工之妙。

说了这么多，也只是笔者写本文的一些发散思维。本文重点虽然是 Node 的 stream，但是笔者却觉得学习 stream 上，可以从更广泛的概念去学。

OK。正文开始。

# 流

> 流（stream）是 Node.js 中处理流式数据的抽象接口。stream 模块用于构建实现了流接口的对象。

流可以是可读的、可写的、或者可读可写的。 所有的流都是 EventEmitter 的实例。

当然，Node 中提供了很多流对象。比如以下的几个主要流对象。

## 可写流与可读流

> 可写流是对数据要被写入的目的地的一种抽象。

可写流有以下这些例子：

- 客户端的 HTTP 请求
- 服务器的 HTTP 响应
- fs 的写入流
- zlib 流
- crypto 流
- TCP socket
- 子进程 stdin
- process.stdout、process.stderr

> 可读流是对提供数据的来源的一种抽象。

可读流有以下这些例子：

- 客户端的 HTTP 响应
- 服务器的 HTTP 请求
- fs 的读取流
- zlib 流
- crypto 流
- TCP socket
- 子进程 stdout 与 stderr
- process.stdin

## 进程与子进程的 stdin、stdout、stderr

process.stdin、process.stdout、process.stderr 都是双工流。

```js
import stream from "stream";

console.log(process.stdout instanceof stream.Duplex); // true
console.log(process.stdin instanceof stream.Duplex); // true
console.log(process.stderr instanceof stream.Duplex); // true
```

其中 process.stdin、process.stdout、process.stderr 对应的 code 如下:

| code | 描述符 | 描述       |
| ---- | ------ | ---------- |
| 0    | stdin  | 标准输入流 |
| 1    | stdout | 标准输出流 |
| 2    | stderr | 错误流.    |

所以我们可以这样写，将标准输入流直接写入标准输出流。

```js
process.stdin.pipe(process.stdout);
```

我们也可以实现一个命令行的简单对话。

```js
const Writable = require("stream").Writable;
const ws = new Writable();
const TALKLIST = {
  Hello: "Hi~",
  "What's ur name?": "suri. Nice to meet u!"
};

const ws = new stream.Writable({
  write(chunk, encoding, next) {
    const key = chunk.toString().trim();
    process.stdout.write("< " + TALKLIST[key]);
    process.stdout.write("\n");
    next();
  }
});

process.stdin.pipe(ws);
```

运行效果如下：

```bash
$ node fs.js

Hello
< Hi~
What's ur name?
< suri. Nice to meet u!
```

这个例子从 stdin 获取标准输入流，从 TALKLIST 中获取回答列表，写入 stdout 标准输出流。

当然我们可以用 transform 流完成上述的工作：

```js
const stream = require("stream");
const TALKLIST = {
  Hello: "Hi~",
  "What's ur name?": "suri. Nice to meet u!"
};

const ts = new stream.Transform({
  transform(chunk, encoding, next) {
    const key = chunk.toString().trim();
    const ret = TALKLIST[key];
    this.push("< " + ret + "\n");
    next();
  }
});

process.stdin.pipe(ts).pipe(process.stdout);
```

## 文件读取流与写入流

直接读取指定的文件参数，将文件流输出到标准输出流。

```js
fs.createReadStream(process.argv[2]).pipe(process.stdout);
```

```bash
$ node process.js ./essay.txt

Good morning, and in case I don't see ya, good afternoon, good evening, and good night!
```

## 流对象模式（ObjectMode）

Node.js 中的流是默认接受字符串类型和 Buffer 类型的，如果需要使其接受对象，我们需要配置参数 objectMode。

```js
const Writable = require("stream").Writable;
const stream = new Writable({
  objectMode: true,
  write(chunk, encoding, next) {
    process.stdout.write(JSON.stringify(chunk));
    process.stdout.write("\n");
    next();
  }
});

stream.write({ x: 1 });
stream.write({ y: 2 });
stream.end();
```

```bash
$ node objectMode.js
{"x":1}
{"y":2}
```

## 流动模式（flowing）与暂停模式（paused)

> 开发者通常应该选择其中一种方法来消费数据，不要在单个流使用多种方法来消费数据。 混合使用 on('data')、 on('readable')、 pipe() 或异步迭代器，会导致不明确的行为。

流动模式（flowing）是推模型（push model）

暂停模式（paused) 是拉模型（pull model）

# 关于流的 npm 包

## split

## concat-stream

## through2

## duplexer2

## trumpet

# 内存泄漏

# 参考资料

- [stream-handbook](https://github.com/substack/stream-handbook)
- [[译] 你所需要知道的关于 Node.js Streams 的一切](https://www.yuque.com/afx/blog/node-js-streams-everything-you-need-to-know)
- [stream adventure](https://github.com/workshopper/stream-adventure)
- [stream | Node.js API 文档](http://nodejs.cn/api/stream.html#stream_api_for_stream_implementers)
