const stream = require("stream");
const TALKLIST = {
  Hello: "Hi~",
  "What's ur name?": "suri. Nice to meet u!"
};

const duplex = new stream.Duplex({
  write(chunk, encoding, next) {
    const key = chunk.toString().trim();
    const w = TALKLIST[key];
    next();
  },
  read() {
    this.push();
  }
});

// ws._write = function(chunk, enc, next) {
//   const key = chunk.toString().trim();
//   // console.log(TALKLIST[key]);
//   next(TALKLIST[key]);
// };

// ws._read = function() {};
process.stdin.pipe(duplex).pipe(process.stdout);

const ws = new stream.Writable({
  write(chunk, encoding, next) {
    const key = chunk.toString().trim();
    process.stdout.write('< ' + TALKLIST[key]);
    process.stdout.write('\n');
    next();
  }
});

process.stdin.pipe(ws);
