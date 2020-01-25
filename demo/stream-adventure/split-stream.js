var split = require("split");
var through2 = require("through2");

const totalStreamCallback = through2(function(text, enc, next) {
  console.log("text", text.toString().trim());
  this.push(text);
  next();
});

const lineStreamCallback = through2(function(line, enc, next) {
  i++;
  const string = line.toString();

  console.dir(i % 2 === 0 ? string.toUpperCase() : string.toLowerCase());
  next();
});

let i = 0;
process.stdin
  .pipe(totalStreamCallback)
  .pipe(split())
  .pipe(lineStreamCallback);

// echo -e 'one\ntwo\nthree\nfour' | node split-stream.js
