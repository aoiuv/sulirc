function SLEEP(time = 1e3) {
  return new Promise(resolve => {
    setTimeout(() => resolve(time), time);
  });
}

const IO = console.log.bind(console);

SLEEP(500)
  .then(IO)
  .then(SLEEP)
  .then(IO);
