require("babel-polyfill");

const { create, saga } = require("dva-core");

const app = create({
  onStateChange(state) {
    // console.log(`state change`, state);
  }
});

let count = 1;

app.use({
  onReducer: reducer => {
    return (state, action) => {
      console.log(`onReducer`, state, action);
      return reducer(state, action);
    };
  },
  onEffect(effect, { put, takeEvery }, model, key) {
    console.log(`onEffect`, model.state, model.namespace, key);
    return function*(...args) {
      count++;
      console.log("effect", ...args);
      yield effect(...args);
    };
  }
});

app.model({
  namespace: "users",
  state: [],
  reducers: {
    setter(state, { payload }) {
      return [...state, payload];
    }
  },
  effects: {
    *add({ payload }, { put, select }) {
      yield saga.delay(1000);
      yield put({
        type: "setter",
        payload
      });
      return yield select(state => state);
    },
    *prefix({ payload }, { put, select }) {
      yield saga.delay(1000);
      yield put({
        type: "add",
        payload: `#${payload}`
      });
      return yield select(state => state);
    }
  }
});

app.start();

const ret = app._store.dispatch({ type: "users/setter", payload: "christina" });
console.log("RET", ret);

app._store.dispatch({ type: "users/add", payload: "sulirc" }).then(res => {
  console.log("PROMISE", res);
});
// app._store.dispatch({ type: 'users/prefix', payload: 'sulirc' });

// app._store.dispatch({ type: 'users/setter', payload: 'sulirc' });

// console.log('sagas: ', Object.keys(saga));
// console.log('saga effects: ', Object.keys(saga.effects));
console.log("count", count);
