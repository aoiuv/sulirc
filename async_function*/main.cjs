async function* Observable() {
  const ret = await (yield 2);
  console.log('Hi! ret', ret);
  yield 3;
  return 4;
}

(async () => {
  const ob = Observable();
  const ret = await ob.next();
  console.log('GET ret', ret);

  await ob.next(
    new Promise(resolve => {
      setTimeout(() => {
        resolve(Math.random());
      }, 200);
    })
  );
})();

// console.log(ob);
// ob.next().then(ret => {
//   console.log(ret);
// });
// ob.next('')
// for(let k of ob) {
//   console.log('Ah..', k);
// }
// console.log('say hello')
