require("babel-polyfill");

const { create, saga } = require("dva-core");
const dvaImmer = require("dva-immer");
const createLoading = require("dva-loading");
const { log, green, red } = require('../../utils/log')

// const delay = timeout => new Promise(resolve => setTimeout(resolve, timeout));
const createOnEffectLogger = () => ({
  onEffect(effect, _, model, key) {
    return function*(...args) {
      red("effect logger");
      log(...args)
      yield effect(...args);
    };
  }
});
const app = create({
  onStateChange(state) {
    green("state change");
    log(state);
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
      yield put({ type: "setChar", payload });
    }
  }
});
app.start();

// app._store.dispatch({ type: "count/repeat" });
app._store.dispatch({ type: "count/fetchChar", payload: "{ugly}" });
