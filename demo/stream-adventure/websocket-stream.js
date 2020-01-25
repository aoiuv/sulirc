const ws = require('websocket-stream');
const stream = ws('ws://localhost:8099');

// process.stdin.pipe(stream);
// stream.pipe(process.stdout);
stream.write('hello websocket stream~\n');


