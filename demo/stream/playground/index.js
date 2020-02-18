const stream = require("stream");
const http = require("http");
const fs = require("fs");

// const server = http.createServer((req, res) => {
//   let body = "";
//   req.setEncoding("utf8");
//   req.on("data", chunk => {
//     body += chunk;
//   });
//   req.on("end", () => {
//     try {
//       const data = JSON.parse(body);
//       res.write(typeof data);
//       res.end();
//     } catch (err) {
//       res.statusCode = 400;
//       return res.end(`err: ${er.message}`);
//     }
//   });
// });

// server.listen(1337);

// 向可写流中写入数据一百万次。
// 留意背压（back-pressure）。
// function writeOneMillionTimes(writer, data, encoding, callback) {
//   let i = 10;
//   write();
//   function write() {
//     let ok = true;
//     // writer.write('%', encoding, callback);
//     do {
//       i--;
//       if (i === 0) {
//         // 最后一次写入。
//         writer.write(data, encoding, callback);
//         writer.end("\n///");
//       } else {
//         // 检查是否可以继续写入。
//         // 不要传入回调，因为写入还没有结束。
//         ok = writer.write(data, encoding);
//       }
//     } while (i > 0 && ok);
//     if (i > 0) {
//       // 被提前中止。
//       // 当触发 'drain' 事件时继续写入。
//       console.log("drain");
//       writer.once("drain", write);
//     }
//   }
// }

// let count = 0;
// const ws = fs.createWriteStream("./a.txt");
// writeOneMillionTimes(ws, "#", "utf8", () => {
//   console.log("writing", count++);
// });
// ws.on("finish", () => {
//   console.log("write finish");
// });

// const ws = fs.createWriteStream('./a.txt');
// ws.write('hello, ');
// ws.end('world!');
// ws.write('again~');

// const rs = fs.createReadStream('./a.txt');
// const ws = fs.createWriteStream('./b.txt');
// const assert = require('assert');

// ws.on('pipe', src => {
//   console.log('有数据正通过管道流入写入器');
//   assert.equal(src, rs);
// });

// ws.on('unpipe', src => {
//   console.log('已移除可写流管道');
//   assert.equal(src, rs);
// });

// rs.pipe(ws);
// rs.unpipe(ws);

// const rs = fs.createReadStream('./a.txt');
// const ws = fs.createWriteStream('./b.txt');

// ws.cork();
// ws.write('一些 ');
// ws.write('数据 ');
// process.nextTick(() => ws.uncork());

// ws.cork();
// ws.write('一些 ');
// ws.cork();
// ws.write('数据 ');
// process.nextTick(() => {
//   ws.uncork();
//   // 数据不会被输出，直到第二次调用 uncork()。
//   ws.uncork();
// });

// const ws = fs.createWriteStream('./b.txt', {
//   highWaterMark: 1
// });
// const ret = ws.write('hello ');
// console.log('first write', ret);
// const ret2 = ws.write('wrold!');
// console.log('second write', ret2);
// ws.on('drain', () => {
//   console.log('完成写入，可以进行更多的写入')
// });

// const rs = fs.createReadStream("./essay.txt");
// console.log('readable.readableFlowing', rs.readableFlowing);
// rs.on("data", chunk => {
//   console.log('流动模式', chunk.toString());
// });
// console.log('readable.readableFlowing', rs.readableFlowing)
// rs.pause();
// console.log('readable.readableFlowing', rs.readableFlowing)

// const { PassThrough, Writable } = require("stream");
// const pass = new PassThrough();
// const writable = new Writable();

// pass.pipe(writable);
// console.log('readable.readableFlowing', pass.readableFlowing);
// pass.unpipe(writable);
// // readableFlowing 现在为 false。
// console.log('readable.readableFlowing', pass.readableFlowing);

// pass.on("data", chunk => {
//   console.log(chunk.toString());
// });
// pass.write("ok"); // 不会触发 'data' 事件。
// console.log('readable.readableFlowing', pass.readableFlowing);
// pass.resume(); // 必须调用它才会触发 'data' 事件。
// console.log('readable.readableFlowing', pass.readableFlowing);

/**
 * 流动与暂停模式
 */
// const rs = fs.createReadStream("./essay.txt", { highWaterMark: 3 });
// rs.on("data", chunk => {
//   console.log("流动模式", chunk.toString());
// });
// // rs.pipe(process.stdout);
// rs.on("readable", function() {
//   // 有数据可读取。
//   let data;

//   while ((data = this.read())) {
//     console.log("暂停模式", data.toString());
//   }
// });
// rs.on('end', () => {
//   console.log('结束')
// })
// process.nextTick(() => {
//   rs.destroy();
// });
// setTimeout(() => {
//   rs.destroy();
//   console.log('readable.destroyed', rs.destroyed);
// }, 3);

/**
 * Async Iterator
 */
// async function run() {
//   const rs = fs.createReadStream("./essay.txt", { highWaterMark: 3 });
//   for await (let chunk of rs) {
//     console.log('chunk', chunk.toString());
//   }
//   console.log('end');
// }
// run();

/**
 * Pipeline
 */
// function* generate() {
//   yield "hello";
//   yield " stream";
// }
// const _stream = stream.Readable.from(generate());
// stream.pipeline(_stream, process.stdout, error => {
//   if(error) console.error(error);
// });

/**
 * Transfrom.by
 */
 const { Transform, pipeline } = require('stream');
 const { createReadStream, createWriteStream } = require('fs');

 async function* transform (source) {
    for await(let chunk of source) {
      yield chunk.toString().toUpperCase();
    }
 }

 pipeline(
   createReadStream('./essay.txt'),
   transform,
   process.stdout,
   (error) => {
      if(error) console.error(error);
   }
 )