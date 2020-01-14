import * as fs from "fs";

let readable = fs.createReadStream("./fs/original.txt");
let writeable = fs.createWriteStream("./fs/copy.txt");

readable.pipe(writeable);
