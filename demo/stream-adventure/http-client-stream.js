const request = require('request');

// request('http://localhost:3001/get').pipe(process.stdout);
// console.log('\n');

const r = request.post('http://localhost:3001/post/10086');
process.stdin.pipe(r).pipe(process.stdout);
