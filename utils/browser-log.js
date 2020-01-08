function logHOF(prefix, consoleName = 'error', argsNum) {
  return (...args) => {
    const pickArgs = argsNum ? args.slice(0, argsNum) : args;
    console[consoleName](prefix, pickArgs);
  }
}