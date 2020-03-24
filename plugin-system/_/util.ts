export function log(...args: any) {
  return console.log(...args);
}

export function fetch(type: string = 'DEFAULT') {
  const fetchTime = Math.ceil(Math.random() * 1000);
  return new Promise(r => {
    setTimeout(() => {
      const resp = {
        msg: `fetch ${type}, pending ${fetchTime}ms`,
        status: 'ok'
      }
      log(resp.msg);
      r(resp);
    }, fetchTime);
  });
}
