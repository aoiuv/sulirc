const chalk = require('chalk');

const logger = ['red', 'blue', 'green'].reduce((memo, key) => {
  memo[key] = (...args) => {
    console.log(chalk[key](...args));
  };
  memo['_' + key] = (...args) => {
    console.log(chalk.underline[key](...args));
  };
  return memo;
}, {});

module.exports = {
  log: console.log,
  ...logger
};
