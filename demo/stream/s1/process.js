const stream = require("stream");
const events = require("events");

// console.log(process.stdout instanceof stream.Writable);
// console.log(process.stdout instanceof events.EventEmitter);

// process.stdout.write('Hi!');
// process.stdout.write('\n');

console.log(process.stdout instanceof stream.Duplex);