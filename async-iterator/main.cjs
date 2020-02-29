// var asyncIterable = {
//   [Symbol.asyncIterator]() {
//     return {
//       i: 0,
//       next() {
//         if (this.i < 3) {
//           return Promise.resolve({ value: this.i++, done: false });
//         }

//         return Promise.resolve({ done: true });
//       }
//     };
//   }
// };

// (async function() {
//   for await (num of asyncIterable) {
//     console.log(num);
//   }
// })();


//////////

// function connect() {
//   return new Promise(r => {
//     setTimeout(() => {
//       console.log('Hi~');
//       r(3);
//     }, 300);
//   });
// }

// async function render() {
//   throw new Error('Error render');
// }

// Promise.resolve(5)
//   .then(async v => {
//     const v2 = await connect();
//     await render();
//     console.log(v, v2);
//     // throw new Error('Error main');
//   })
//   .catch(err => {
//     console.error('Catch error', err);
//   })
//   .finally(() => {
//     console.log('Finally');
//   });


