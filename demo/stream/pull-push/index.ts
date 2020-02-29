import fs from "fs";
import path from "path";
import util from "util";

const debug = require("debug")("stream");

// const readFile = util.promisify(fs.readFile);

// readFile(path.join(__dirname, "./stream.doc"), { encoding: "utf8" })
//   .then(content => {
//     console.log(content);
//   })
//   .catch(error => console.log(error));

const bigText = path.join(__dirname, "./stream.doc");
const text = path.join(__dirname, "./what-is-a-stream.txt");
const textStat = fs.statSync(text); // 150
const bigTextStat = fs.statSync(bigText); // 81078

debug(textStat.size, bigTextStat.size);
const files = {
  "what-is-a-stream": path.join(__dirname, "./what-is-a-stream.txt")
};

// const stream = fs.createReadStream(files["what-is-a-stream"], {
//   highWaterMark: 5
// });

// stream.on("data", chunk => {
//   console.log("stream emit data");
//   console.log("Received:", chunk);
// });

// stream.pipe(process.stdout);
// const stream = fs.createReadStream(files["what-is-a-stream"], {
//   // highWaterMark: 1024
//   highWaterMark: 50
//   // encoding: "utf8"
// });

// console.log(stream);
// stream.on("data", chunk => {
//   console.log("New chunk of data:", chunk);
// });

// let i = 0;

// stream.on("readable", () => {
//   console.log('stream is readable!');
//   // let data = stream.read()
//   let data;
//   setTimeout(() => {
//     while (null !== (data = stream.read())) {
//       console.log(i++);
//       console.log("Received:", data);
//     }
//   }, 2000);
// });

// stream.on('end', () => {
//   console.log('stream is end!');
// });

// setInterval(() => {
//   let data;
//   while (null !== (data = stream.read())) {
//     console.log("Received:", data.toString());
//   }
// }, 30);

// stream.end();

// stream.resume();
const stream = fs.createReadStream(files["what-is-a-stream"], {
  highWaterMark: 20
});
// readable.readableFlowing === null
// readable.readableFlowing === false
// readable.readableFlowing === true

// console.log('\nReadableFlowing [before pipe]:', stream.readableFlowing);
// stream.pipe(process.stdout);
// console.log('\nReadableFlowing [after pipe]:', stream.readableFlowing);
// setTimeout(() => {
//   stream.unpipe();
//   console.log('\nReadableFlowing [after unpipe]:', stream.readableFlowing);
//   stream.on("readable", () => {
//     let data;
//     while (null !== (data = stream.read())) {
//       console.log("From paused mode:", data.toString());
//     }
//   });
//   console.log('\nReadableFlowing [after readable]:', stream.readableFlowing);
// }, 3);

// stream.on("data", chunk => {
//   // console.log("stream emit data");
//   console.log(`Received at ${(new Date).getSeconds()}s: `,  chunk.toString());
// });
// setTimeout(() => {
//   stream.pause();
//   setInterval(() => {
//     const data = stream.read();
//     if (data) {
//       console.log("Rest:", data.toString());
//     }
//   }, 10);
//   // console.log('Rest:\n');
//   // stream.pipe(process.stdout);
//   // stream.on("readable", () => {
//   //   let data;
//   //   while (null !== (data = stream.read())) {
//   //     console.log("Rest: ", data.toString());
//   //   }
//   // });
// }, 3);

// setTimeout(() => {
//   stream.resume();
// }, 2000);



// setTimeout(() => {
//   stream.on("data", chunk => {
//     console.log("stream emit data");
//     console.log("Received:", chunk.toString());
//   });
//   stream.on("end", () => {
//     console.log("stream emit end");
//   });
// }, 0);

// import { Readable } from 'stream';

// const stream = new Readable();

// stream.push('Hello');
// stream.push('World!');
// stream.push(null);

// stream.on('data', (chunk) => {
//   console.log(chunk.toString());
// });

// import { Readable } from 'stream';
// const stream = new Readable();
// console.log(stream);
// const read = stream.read.bind(stream);
// stream.read = function() {
//   console.log('read() called');
//   return read();
// }

// stream.push('Hello');
// stream.push('World!');
// stream.push(null);
// // console.log(stream.readableHighWaterMark)
// stream.on('data', (chunk) => {
//   console.log(chunk);
// });
