var Writable = require('stream').Writable;
var ws = new Writable();
ws._write = function (chunk, enc, next) {
    console.dir(chunk);
	console.log('enc', enc);
    next();
};

process.stdin.pipe(ws);
