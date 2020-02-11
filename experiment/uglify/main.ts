import * as sample from './sample';
import model from './model';
import * as util from './util';

const debug = require('debug')('uglify');
// debug('uglify', sample);

const stringify = (o: any) => JSON.stringify(o);
// debug('sample length', stringify(sample).length);
debug('model length', stringify(model).length);

const rawModelStr = stringify(model);
const minifyModelStr = util.compress(rawModelStr);

debug('raw model length', rawModelStr.length);
debug('minify model length', minifyModelStr.length);