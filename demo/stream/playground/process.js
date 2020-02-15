const stream = require('stream');
const fs = require('fs');
const request = require('request');
const axios = require('axios');

const resp = request.get('http://baidu.com');

// console.log(resp)
resp.pipe(process.stdout);

// process.stdin.pipe(process.stdout);

// fs.createReadStream(process.argv[2]).pipe(process.stdout);

