const { compose } = require('ramda');
const { tokenizer, parser, transformer, generator } = require("./index");

const input = "(add 3 (div 8 2))";
const output = "add(3, div(8, 2))";
const printJSON = o => console.log(Array.isArray(o) ? o : JSON.stringify(o, null, 2));

printJSON(tokenizer(input));
printJSON(compose(parser, tokenizer)(input));
printJSON(compose(transformer, parser, tokenizer)(input));
printJSON(compose(generator, transformer, parser, tokenizer)(input));
