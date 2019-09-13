/**
 * @author suli
 * 
 * 备注：仅作学习用，不具有任何实用价值
 */

const tokenizer = require('./tokenizer');
const parser = require('./parser');
const transformer = require('./transformer');
const generator = require('./generator');

const compiler = input => {
  return [tokenizer, parser, transformer, generator].reduce((a, b) => b(a), input);
};

module.exports = {
  tokenizer,
  parser,
  transformer,
  generator,
  compiler
};
