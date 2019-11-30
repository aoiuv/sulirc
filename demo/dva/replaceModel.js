require('babel-polyfill');

const expect = require('../../utils/expect');
const { saga, create } = require('dva-core');
const app = create();

const { delay } = saga;

app.model({
  namespace: 'users',
  state: ['foo'],
  reducers: {
    add(state, { payload }) {
      return [...state, payload];
    },
  },
  effects: {
    *fetch(_, { put }) {
      yield delay(200);
      yield put({ type: 'add', payload: '{data}' });
    },
  },
});
app.start();
console.log(app._models[1]);
console.log(app._models[1].reducers);
console.log(app._models[1].effects);

const oldCount = app._models.length;
app._store.dispatch({ type: 'users/fetch' })
console.log('state', app._store.getState());

setTimeout(() => {
  console.log('state', app._store.getState());
}, 300);

// app.replaceModel({
//   namespace: 'users',
//   state: ['bar', 'baz'],
//   reducers: {
//     add(state, { payload }) {
//       console.log('state', state);
//       return [...state, 'world', payload];
//     },
//     clear() {
//       return [];
//     },
//   },
// });

// expect(app._models.length).toEqual(oldCount);
// let state = app._store.getState();
// expect(state.users).toEqual(['foo']);

// app._store.dispatch({ type: 'users/add', payload: 'jack' });
// state = app._store.getState();
// expect(state.users).toEqual(['foo', 'world', 'jack']);

// // test new added action
// app._store.dispatch({ type: 'users/clear' });

// state = app._store.getState();
// expect(state.users).toEqual([]);

// app.model({
//   namespace: "users",
//   state: [],
//   reducers: {
//     setter(state, { payload }) {
//       return [...state, payload];
//     }
//   },
//   effects: {
//     *add({ payload }, { put }) {
//       yield put({
//         type: "setter",
//         payload
//       });
//     }
//   }
// });

// app.start();
// app.replaceModel({
//   namespace: "users",
//   state: [],
//   reducers: {
//     setter(state, { payload }) {
//       return [...state, payload];
//     }
//   },
//   effects: {
//     *add(_, { put }) {
//       yield put({
//         type: "setter",
//         payload: "mock"
//       });
//     }
//   }
// });

// app._store.dispatch({ type: "users/add", payload: "jack" });

// const state = app._store.getState();
// console.log(state);
