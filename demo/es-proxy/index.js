const historyModels = new Proxy([], {
  set: (target, key, value, receiver) => {
    if (key === 'length') {
      try {
        console.log(target, key, value, receiver);
      } catch (err) {
        console.error(err);
      }
    }
    return Reflect.set(target, key, value, receiver);
  }
});

historyModels.push('a');
console.log(historyModels[0]);
