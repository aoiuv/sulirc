require('babel-polyfill');

const { create, saga } = require('dva-core');

const app = create({
  onStateChange(state) {
    console.log(`state change`, state);
  },
});

app.use({
  onReducer: reducer => {
    return (state, action) => {
      console.log(`onReducer`, state, action);
      return reducer(state, action);
    };
  },
});

app.model({
  namespace: 'users',
  state: [],
  reducers: {
    setter(state, { payload }) {
      return [...state, payload];
    },
  },
  effects: {
    *add({ payload }, { put }) {
      yield saga.delay(1000);
      yield put({
        type: 'setter',
        payload,
      });
    },
    *prefix({ payload }, { put }) {
      yield saga.delay(1000);
      yield put({
        type: 'add',
        payload: `#${payload}`,
      });
    },
  },
});

app.start();

// app._store.dispatch({ type: 'users/add', payload: 'sulirc' });
app._store.dispatch({ type: 'users/prefix', payload: 'sulirc' });

// app._store.dispatch({ type: 'users/setter', payload: 'sulirc' });


// console.log('sagas: ', Object.keys(saga));
// console.log('saga effects: ', Object.keys(saga.effects));
