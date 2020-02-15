import { debug } from './main';
import stream from 'stream';

// debug(stream.Readable instanceof stream.Duplex);
// debug(stream.Duplex instanceof stream.Readable);

debug(process.stdout instanceof stream.Duplex); // true
// debug(process.stdout instanceof stream.Readable); // true
// debug(process.stdout instanceof stream.Writable); // true
// debug(process.stdout instanceof stream.Transform); // false

debug(process.stdin instanceof stream.Duplex); // true
// debug(process.stdin instanceof stream.Readable); // true
// debug(process.stdin instanceof stream.Writable); // true
// debug(process.stdin instanceof stream.Transform); // false

debug(process.stderr instanceof stream.Duplex); // true

process.stdin.pipe(process.stdout);