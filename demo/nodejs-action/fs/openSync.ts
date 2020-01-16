import * as fs from "fs";
import * as assert from "assert";

let fd = fs.openSync("./fs/file.txt", "w+");
let writeBuf = Buffer.from("{data}");

fs.writeSync(fd, writeBuf, 0, writeBuf.length, 0);

let readBuf = Buffer.allocUnsafe(writeBuf.length);

fs.readSync(fd, readBuf, 0, writeBuf.length, 0);

assert.equal(writeBuf.toString(), readBuf.toString());

fs.closeSync(fd);
