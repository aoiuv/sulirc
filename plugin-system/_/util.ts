export function log(...args: any) {
  return console.log(...args);
}

export function report(...args: any) {
  return console.log(...args);
}

export function fetch(type: string = 'DEFAULT') {
  const fetchTime = Math.ceil(Math.random() * 1000) + 1000;
  log(`fetch ${type}...`);

  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const resp = {
        msg: `fetch ${type} ok, pending ${fetchTime}ms`,
        code: 200
      }
      resolve(resp);
      // reject(`fetch ${type} failed, pending ${fetchTime}ms`);
    }, fetchTime);
  });
}
