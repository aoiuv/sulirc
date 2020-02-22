# 深入学习 Node.js stream 系列（一）

<a name="E4bct"></a>
## 前言
本来想写一篇 Node.js stream 完整的深入学习的文章。却发现，一篇文章难以透彻讲解完整个 stream，然后分享的概念太多，怕是一篇下去，可能长达十几万字，不仅自己一两个月都没写完博客，估计也鲜有读者会愿意仔细读完。

因此最好还是写成一个系列，不仅可以有点章法，而且还可以慢慢地，细细地雕琢每一个微小却值得分享的点。于写的人，于看的人，都是件好事。

**因此，系列的第一篇诞生了。**

<a name="BZRmK"></a>
## 世间的“流”
古人向来崇尚和喜爱流水，在道家学说里，也有“上善若水”的说法。水善利万物而不争，也是为人处世的最高境界。

嗯，流水潺潺。

无论是古代的先贤哲人，抑或是近现代的创造者们，都善于从现实生活中学习，抽象，攫取创意或精炼原理。比如，从猫咪的伸懒腰姿势中，人们抽象出了拱桥、瑜伽姿势；从十个手指的计数，衍生出来十进制；以及模仿鱼类的形体造船，以木桨仿鳍；研究鸟的内部构造和飞翔姿势，从而造出飞机等等。

自然界，孕育的不仅仅是充满智慧的人类，也给予了这群聪明的猴子们 -- 人类，一大堆科学发明、工程技术实现原理的思想源泉。

当然说到这里，我们的主角“流”应该也不例外。同样衍生出了许多概念。

<a name="wWp0j"></a>
### RxJS 的异步事件流


很久以前。笔者听过流的概念，那是来自 RxJS 社区里的名言：“一切皆是流”。那时候想，我的天，还真 tm 酷，从某个角度理解，仿佛蕴含着哲学意味。

在 RxJS 的世界里，流是一个基本的概念，各种异步事件行成了一个又一个的流。通过操作符对这些流进行处理，组合、运算，以此满足应用程序的交互逻辑。这种编程方式相当抽象，也被称为响应式编程（或反应式编程）。

比如连续的点击事件 click 是一个流：<br />![image.png](https://cdn.nlark.com/yuque/0/2020/png/578119/1582379010862-d7dc0c5b-7cfb-4f0f-8da1-88cab902615c.png#align=left&display=inline&height=124&name=image.png&originHeight=248&originWidth=1122&size=15783&status=done&style=none&width=561)

在表单输入框里敲字符“Hello!”也是一个流：<br />![image.png](https://cdn.nlark.com/yuque/0/2020/png/578119/1582379118664-577e1c4b-7589-4de7-981f-e73dafdd741f.png#align=left&display=inline&height=135&name=image.png&originHeight=270&originWidth=1134&size=18472&status=done&style=none&width=567)

还有，一个 XHR 请求发送也是一个流：<br />![image.png](https://cdn.nlark.com/yuque/0/2020/png/578119/1582379356601-d761acfa-fd2c-47ba-860c-6ff44b23a4ff.png#align=left&display=inline&height=146&name=image.png&originHeight=292&originWidth=1118&size=16918&status=done&style=none&width=559)

诸如此类，不胜枚举。

然后 map、filter、repeat、first、debounce、takeLast 等许多操作符，就可以操作流。

比如 map 操作符来将 input 事件的数据流大写：<br />![image.png](https://cdn.nlark.com/yuque/0/2020/png/578119/1582379983866-505fad68-4316-4c4a-83c4-e5939867ef6b.png#align=left&display=inline&height=215&name=image.png&originHeight=430&originWidth=1122&size=30551&status=done&style=none&width=561)


是不是很像我们代码里直接写 Array.prototype.map()。但是我们可以理解为“值”的投射，如果这些值一直在不断生产，那么就变成了流。概念很相似，但是 RxJS 在上面附加了推、拉模型等概念，使得处理异步事件的序列组合等逻辑更加友好。

<a name="9sH6D"></a>
### Unix 系统中的流
后来了解到 bash，在 unix 系统中可以用 | 符号来实现流，比如笔者想要计数自己的博客《浅谈 TypeScript 下的 IoC 容器原理》里出现了几次的 IoC 这个缩写。

```bash
$ cat 浅谈TypeScript下的IoC容器原理.md | grep -o "IoC" | wc -w
15
```

用 cat 程序序列化读取整个文件（cat -- concatenate and print files），然后以标准输出流（standard output）发送到 grep 程序，grep 通过 | 接收标准输入流（standard input），匹配过滤出 IoC，然后将标准输出流发送给 wc 程序，wc 同理通过 | 接收标准输入流，-w 参数计数单词数量。

（基本上在 Unix 系统中，每个程序如果运行成功，都会返回 0，如果错误一般会返回大于 0）

Unix 中的管道符，可以将第一个进程的标准输出文件描述符连接到第二个进程的标准输入。什么意思呢，请看示意图如下：<br />![image.png](https://cdn.nlark.com/yuque/0/2020/png/578119/1582382369222-f1487254-5d71-4109-be81-62ed306f4fbe.png#align=left&display=inline&height=449&name=image.png&originHeight=898&originWidth=1118&size=72679&status=done&style=none&width=559)

通过管道符 “|” 组合了 cat、grep、wc 程序，unix 系统里存在大量命令，每个命令又有大量的参数，当使用流的概念组合使用这些命令时，不需要图形化界面、软件的协助，却可以完成很多事情。

如果换成 node.js 的 stream 方式来理解的话，有点像：
```javascript
cat.pipe(grep).pipe(wc)
```

或者等效于：
```javascript
cat.pipe(grep)
grep.pipe(wc)
```

<a name="J5Jjy"></a>
### 函数组合的流

在函数式编程里的 compose，pipe 来组合单一职责的函数，也隐隐约约像一个流。

如我们组合 a b c 三个函数：
```javascript
compose(a, b, c)
```

示意图如下：<br />![image.png](https://cdn.nlark.com/yuque/0/2020/png/578119/1582384331290-4f78feb3-cde0-4ebb-87ce-68aa8b501bbf.png#align=left&display=inline&height=454&name=image.png&originHeight=908&originWidth=1094&size=55978&status=done&style=none&width=547)

上面调用顺序 a(b(c()))，也即是 c -> b -> a，它像不像一个流？假如值的生产过程，是一个流，此时函数相当于在对流在不断的修改、映射。

以及在 koa、redux 里组合中间件，也是和流有异曲同工之妙。关于中间件，这里不详细介绍，如有不了解的同学，大家可以看笔者之前写的博客[《深入理解洋葱模型中间件机制》](https://www.yuque.com/sulirc/desk/ezh006)了解学习。

所以你们看，这个世界到处都是流。

当然 Node.js 里流也举足轻重。上面都是笔者的遐想。想阐述的是，许多技术概念有时候是来源于生活的，将现实抽象后，功能分化后，才分叉产生了不同领域。我们可以寻找一个心智模型（mental model），进行学习这些或许晦涩难懂的概念，有时候说不定能达到举一反三，融会贯通的效果。

好了，正式介绍 Node.js 流！

<a name="F737m"></a>
## 浅谈 Node.js 流
> 流（stream）是 Node.js 中处理流式数据的抽象接口。stream 模块用于构建实现了流接口的对象。


流是可读的，也是可写的，或者可读又可写的。<br />或者可读可写的。 所有的流都是 EventEmitter 的实例。<br />在 Node.js 中有许多流，可读流（Writable）、可写流（Readable）、双工流（Duplex），还有转换流（Transform）。

双工流是可读又可写的流，而转换流是可以在读写过程中修改数据的双工流。

秉承着饭一口一口吃，路一步一步走的精神，本系列一，我们可以先简单了解一下可写流和可读流。

<a name="UjJCj"></a>
### 可写流
可写流是对数据要被写入的目的地的一种抽象，比如可写流，在 Node.js 中就有客户端的 HTTP 请求、服务器的 HTTP 响应、fs 写入流、process.stdout 等等。

<a name="jLBxk"></a>
#### fs.createWritableStream
我们先来看 fs 写入流，fs.createWritableStream 示例（fs.js）：
```javascript
const fs = require("fs");
const ws = fs.createWriteStream("./dest.txt");

"Hi!".split("").forEach(char => {
  console.log("write char", char);
  ws.write(`The char: ${char} char code is ${char.charCodeAt()}`);
  ws.write("\n");
});

ws.end(":)");
```


我们将 “Hi!"的每个字符的 charCode 打印在 dest.txt 文件中，文件内容如下：
```
The char: H char code is 72
The char: i char code is 105
The char: ! char code is 33
:)
```

我们调用 fs.createWritableStream 传入目标写入路径后，Node.js 给我们返回了可写流的实例，这个实例不仅继承可写流，也继承 EventEmitter。

不相信？我们看：
```javascript
const stream = require('stream');
const events = require('events');

console.log(ws instanceof stream.Writable); // true
console.log(ws instanceof events.EventEmitter); // true
```


因此，Writable 和 EventEmitter 拥有的方法，它也有，一个也不少。我们调用 writable.write 写入数据，调用 writable.end 通知流对象，我们已经没有任何其他写入数据。

<a name="wGDF6"></a>
#### process.stdout
进程 I/O 同样也是 Writable 和 EventEmitter 的实例，耳听为虚眼见为实，请同学们可以打印：

```javascript
const stream = require("stream");
const events = require("events");

console.log(process.stdout instanceof stream.Writable); // true
console.log(process.stdout instanceof events.EventEmitter); // true
```


简单使用，通过 write 方法写入数据即可。代码示例如下（process.js）:
```javascript
process.stdout.write('Hi!');
```


运行后，控制台就会输出友好的问候~
```bash
$ node process.js
Hi!
```

在 node.js 中 console.log 内部就是由 process.stdout 实现的。对应 console.error 内部就是由 process.stderr 实现的。（没错 process.stderr 也是可写流）。

<a name="Lm53h"></a>
### 可读流
而与之对应的可读流，比如客户端的 HTTP 响应，服务器的 HTTP 请求，fs 的读取流，process.stdin。我们清楚的看到，与可写流刚好形成镜像对照。

<a name="rnJIq"></a>
#### fs.createReadStream
运行代码示例如下（fs.js）：
```javascript
const fs = require("fs");
const rs = fs.createReadStream("./src.txt");

let sentence = "";

rs.on("data", chunk => {
  sentence += chunk;
});

rs.on("end", () => {
  console.log(sentence);
});
```

控制台成功打印了一句《楚门的世界》的台词：
```bash
$ node fs.js 
Good morning, and in case I don't see ya, good afternoon, good evening, a
nd good night!
```

很简单是不是？

<a name="wcsAL"></a>
#### process.stdin
我们在可写流中了解了 process.stdout。而 process.stdin 是可读流，因此我们可以结合两者。代码示例如下（process.js）：
```javascript
 process.stdin.pipe(process.stdout);
```

运行此行代码，我们的好朋友控制台，就变成了一台复读机。

<a name="HmLIe"></a>
#### http
上文提到了，客户端的 HTTP 响应，服务器的 HTTP 请求是**可读流**。然后客户端的 HTTP 请求、服务器的 HTTP 响应是**可写流**。

同学们千万不要被绕晕。其实我们细细思考琢磨，刚好很自然。不信？请看以下代码！**（请务必留意代码注释）**

以下是客户端（client.js）：
```javascript
const http = require("http");
const options = {
  hostname: "127.0.0.1",
  port: 8000,
  path: "/upload",
  method: "POST"
};
const req = http.request(options, res => {
  process.stdout.write("Client get response: ");
  // res 客户端的 HTTP 响应（可读流）
  res.pipe(process.stdout);
});

// req 客户端的 HTTP 请求（可写流）
req.write("Hi!");
req.end();
```

以下是服务端（server.js）：
```javascript
const http = require("http");

const server = http.createServer((req, res) => {
  if (req.method === "POST" && req.url.includes("/upload")) {
    process.stdout.write("Server get request: ");
    // req 服务器的 HTTP 请求（可读流）
    req.pipe(process.stdout);
    // res 服务器的 HTTP 响应（可写流）
    res.write("Hey!");
    res.end();
  } else {
    res.writeHead(404);
    res.end("Not Found!");
  }
});

server.listen(8000);
```

我们先运行 server.js 代码，再运行 client.js 代码。Node.js 分别在控制台会输出：
```bash
$ node server.js 
Server get request: Hi!
```

```bash
$ node client.js 
Client get response: Hey!
```

总结：可写流有 write、end 方法用来写入数据。可读流有 pipe 方法用来消费数据。

我们可以记住以下这个简单公式：
```javascript
readableStreamSrc.pipe(writableStreamDest);
```

当然，Node.js 中还有很多这里没有提到的其他可读流、可写流（不过，不用担心，以后的系列会慢慢分享到。）

但到此，至少，怎么使用常见的流，我们成功掌握了。

<a name="g069C"></a>
## 为什么使用流
但同学们肯定会问，为什么使用流？流的优势又在哪里？

首先，我们要知道，在 Node.js 中，I/O都是异步的，所以在和硬盘以及网络的交互过程中会涉及到传递回调函数的过程。比如我们在服务器端，响应请求并读取返回文件，我们很有可能使用 fs.readFile(path, callback) 方式。但是在大量高并发请求到来时，尤其是读完的文件目标体积很大时，此时将会消耗大量的内存，从而造成用户连接缓慢的问题。

既然如上文所介绍，req、res 都是流对象，我们就可以使用 fs.createReadStream(path) 得到一个文件可读流对象，然后 rs.pipe(res) 即可。

这样，文件数据就可以一小块一小块的传输过去，客户端连接也会更快，服务器压力也会更小。当然使用 pipe，还有很多很多优势，比如流的背压自动控制，组合其他流模块等等。

本系列，第一篇，到此为止。以上只是稍微窥探了 Node.js 流的一点踪影。**但我们必须知道，在 Node.js 中流的意义与价值，重视它，而且真正掌握它。**

<a name="Qhy4H"></a>
## 系列计划

这个系列，计划会深入讲解以下这些方向：

1. 每个流 API 的原理、实践方式
1. 流的对象模式（Object Mode）
1. 流动模式（flowing）与暂停模式（paused）
1. 流的背压的原理，以及具体实践
1. 社区里流的实践（比如与流相关的 npm 包）
1. 流造成内存泄漏问题
1. Node.js 流的未来趋势

除此之外，以及一些笔者突然想写的，与流相关的话题、技术探讨，都会划分在这个系列里。

在 Node.js 里，流扮演了十分重要的角色，如果你和笔者一样，都对流的哲学、技术实践都很感兴趣，可以对此系列保持关注。谢谢~

备注：如有笔者表述不妥当，或者理解错误的地方，极其欢迎大家指正，互相学习。
