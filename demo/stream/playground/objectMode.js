const Writable = require("stream").Writable;
const stream = new Writable({
  objectMode: true,
  write(chunk, encoding, next) {
    process.stdout.write(JSON.stringify(chunk));
    // process.stdout.write(chunk.toString());
    process.stdout.write('\n');
    next();
  }
});

stream.write({ x: 1 });
stream.write({ y: 2 });
stream.end();

// stream.write('x => 1');
// stream.write('y => 2');
// stream.end();

// stream.write(Buffer.from('x => 1'));
// stream.end();