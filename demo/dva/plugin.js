require("babel-polyfill");

const { create, saga } = require("dva-core");
const dvaImmer = require("dva-immer");
const createLoading = require("dva-loading");

// const delay = timeout => new Promise(resolve => setTimeout(resolve, timeout));
const createOnEffectLogger = () => ({
  onEffect(effect, _, model, key) {
    return function*(...args) {
      console.log("effect logger", ...args);
      yield effect(...args);
    };
  }
});
const app = create({
  onStateChange(state) {
    console.log("state change");
    console.log(state);
  }
});

// app.use(dvaImmer());
app.use(
  createLoading({
    namespace: "@@plugin/loading",
    only: ["count/fetchChar"]
    // except: ["repeat"]
  })
);

app.use(createOnEffectLogger());

app.model({
  namespace: "count",
  state: {
    char: "*"
  },
  reducers: {
    repeat(state, { payload }) {
      return {
        ...state,
        char: state.char.repeat(payload || 2)
      };
    },
    setChar(state, { payload }) {
      return {
        ...state,
        char: payload || "{any}"
      };
    }
  },
  effects: {
    *fetchChar({ payload }, { put, call }) {
      yield saga.delay(300);
      // yield call(delay, 100);
      yield put({ type: "setChar", payload });
    }
  }
});
app.start();

// app._store.dispatch({ type: "count/repeat" });
app._store.dispatch({ type: "count/fetchChar", payload: "{ugly}" });
