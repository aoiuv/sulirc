const crypto = require("crypto");
const tar = require("tar");
const zlib = require("zlib");
const concat = require("concat-stream");
const fs = require('fs');

const parser = new tar.Parse();
parser.on("entry", function(e) {
  if (e.type !== "File") return e.resume();

  const h = crypto.createHash("md5", { encoding: "hex" });
  e.pipe(h).pipe(
    concat(function(hash) {
      console.log(hash + " " + e.path);
    })
  );
});

// const cipher = process.argv[2];
// const pw = process.argv[3];
const cipher = "RC4";
const pw = "0000";

console.log("cipher", cipher);
console.log("pw", pw);
// process.stdin
//   .pipe(crypto.createDecipher(cipher, pw))
//   .pipe(zlib.createGunzip())
//   .pipe(parser);

const secretzTarStream = fs.createReadStream("./secretz.tar.gz");

secretzTarStream
  // .pipe(crypto.createDecipher(cipher, pw))
  .pipe(zlib.createGunzip())
  .pipe(parser);
