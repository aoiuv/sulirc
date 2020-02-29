// function reject() {
//   const a = new Promise((resolve, reject) => {
//     setTimeout(() => {
//       reject('Fake Error');
//     }, 200);
//   });

//   a.then(() => {}).catch(err => console.error('inside reject', err));
//   return a;
// }

// reject().catch(err => console.error('outside reject', err));

// Promise.resolve('Hi').then(value => {
//   console.log(value);
// });