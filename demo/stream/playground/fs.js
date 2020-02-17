const stream = require("stream");
const TALKLIST = {
  Hello: "Hi~",
  "What's ur name?": "suri. Nice to meet u!"
};

const ts = new stream.Transform({
  transform(chunk, encoding, next) {
    const key = chunk.toString().trim();
    const ret = TALKLIST[key];
    this.push('< ' + ret + '\n');
    next();
  }
});

process.stdin.pipe(ts).pipe(process.stdout);

// const ws = new stream.Writable({
//   write(chunk, encoding, next) {
//     const key = chunk.toString().trim();
//     process.stdout.write('< ' + TALKLIST[key]);
//     process.stdout.write('\n');
//     next();
//   }
// });

// process.stdin.pipe(ws);
