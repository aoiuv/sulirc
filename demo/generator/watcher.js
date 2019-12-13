const Event = require('events');
const SDK = new Event();

function SLEEP(t = 1000) {
  return new Promise(r => setTimeout(r, t));
}

function *sigWatcher(s) {
  console.log('[sig] [pending]', s);
  const ret = yield;
  console.log('[sig] [ok]', ret);
  return true;
}

let sig;

SDK.on('[action]', async () => {
  sig = sigWatcher('[hi]');
  sig.next('[sig 1]');
  await SLEEP();
  sig.next('[sig 2]');
});

SDK.emit('[action]');