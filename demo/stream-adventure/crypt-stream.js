const crypto = require("crypto");
const ALGO = "aes-256-gcm";
const iv = Buffer.from(crypto.randomBytes(16), "utf8");
const KEY = Buffer.from(crypto.randomBytes(32), "utf8");
const cipher = crypto.createCipheriv(ALGO, KEY, iv);
const through = require("through2");

process.stdin
  .pipe(cipher)
  // .pipe(
  //   through(
  //     function write(chunk, enc, next) {
  //       // this.push('#' + new Date + '\n');
  //       this.push(chunk);
  //       next();
  //     },
  //     function end(done) {
  //       done();
  //     }
  //   )
  // )
  .pipe(process.stdout);
