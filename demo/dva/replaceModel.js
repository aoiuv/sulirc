require('babel-polyfill');

const expect = require('../../utils/expect');
const { create } = require('dva-core');
const app = create();


app.model({
  namespace: 'users',
  state: ['foo'],
  reducers: {
    add(state, { payload }) {
      return [...state, payload];
    },
  },
});
app.start();

const oldCount = app._models.length;

app.replaceModel({
  namespace: 'users',
  state: ['bar', 'baz'],
  reducers: {
    add(state, { payload }) {
      return [...state, 'world', payload];
    },
    clear() {
      return [];
    },
  },
});

expect(app._models.length).toEqual(oldCount);
let state = app._store.getState();
expect(state.users).toEqual(['foo']);

app._store.dispatch({ type: 'users/add', payload: 'jack' });
state = app._store.getState();
expect(state.users).toEqual(['foo', 'world', 'jack']);

// test new added action
app._store.dispatch({ type: 'users/clear' });

state = app._store.getState();
expect(state.users).toEqual([]);

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
