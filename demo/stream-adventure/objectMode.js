const Writable = require("stream").Writable;
const stream = new Writable({ objectMode: true });

stream._write = function(chunk, enc, next) {
  console.dir(chunk);
  next();
};

// stream.pipe(process.stdout);

stream.write({ x: 1 });
stream.write({ y: 2 });
// stream.write('x => 1');
// stream.write('y => 2');
stream.end();
