const http = require("http");
const fs = require("fs");
const through = require("through2");

// const server = http.createServer((req, res) => {
// 	fs.createReadStream('file.txt').pipe(res);
// });

// http POST :3001 x=1 y=2 -v
// echo hack the planet | curl -d@- http://localhost:8000
// http POST :8000 <<< 'wave ur hand!'
const server = http.createServer((req, res) => {
  if (req.method === "POST") {
    // req.pipe(fs.createWriteStream("post.txt"));
    req.pipe(through(upperWriteStream, end)).pipe(fs.createWriteStream("post.txt"));
  }
  res.end("beep boop!\n");
});

function upperWriteStream(chunk, enc, next) {
  this.push(chunk.toString().toUpperCase());
  next();
}

function end(done) {
  done();
}

server.listen(process.argv[2] || 5000);
