require("babel-polyfill");

const { create } = require("dva-core");
const app = create();

app.model({
  namespace: "users",
  state: [],
  reducers: {
    setter(state, { payload }) {
      return [...state, payload];
    }
  },
  effects: {
    *add({ payload }, { put }) {
      yield put({
        type: "setter",
        payload
      });
    }
  }
});

app.start();
app.replaceModel({
  namespace: "users",
  state: [],
  reducers: {
    setter(state, { payload }) {
      return [...state, payload];
    }
  },
  effects: {
    *add(_, { put }) {
      yield put({
        type: "setter",
        payload: "mock"
      });
    }
  }
});

app._store.dispatch({ type: "users/add", payload: "jack" });

const state = app._store.getState();
console.log(state);

