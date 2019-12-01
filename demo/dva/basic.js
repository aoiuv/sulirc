const { create } = require("dva-core");
// const invariant = require("invariant");

// function enhancer(reducer) {
//   return (state, action) => {
//     if (action.type === "square") {
//       return state * state;
//     }

//     return reducer(state, action);
//   };
// }

const app = create({
  // onStateChange(state) {
  //   console.log('on state change', state);
  // }
});

app.model({
  namespace: "char2",
  state: "sulirc",
  reducers: [
    {
      timestamp(state, { payload }) {
        return state + (payload || Date.now());
      }
    },
    function enhancer(reducer) {
      return (state, action) => {
        if (action.type === "char/timestamp") {
          return reducer(`[${state.toUpperCase()}]@`, action);
        }
        return reducer(state, action);
      };
    }
  ]
});
app.start();

app.model({
  namespace: "char",
  state: "sulirc",
  reducers: [
    {
      timestamp(state, { payload }) {
        return state + (payload || Date.now());
      }
    },
    function enhancer(reducer) {
      return (state, action) => {
        if (action.type === "char/timestamp") {
          return reducer(`[${state.toUpperCase()}]@`, action);
        }
        return reducer(state, action);
      };
    }
  ]
});

// app._store.dispatch({ type: "square" });
// app._store.dispatch({ type: "count/add" });

app._store.dispatch({ type: "char/timestamp" });
// console.log(app._store.getState());

console.log(app._store);

function reduceReducers(...reducers) {
  return (previous, current) => reducers.reduce((p, r) => r(p, current), previous);
}
const reducers = [
  function add(state, action) {
    if (action.type !== "add") return state;
    return state + action.payload;
  },
  function sub(state, action) {
    if (action.type !== "sub") return state;
    return state - action.payload;
  }
];

// console.log("reduceReducers", reduceReducers(...reducers)(3, { type: "add", payload: 5 }));

// const container = undefined;
// invariant(
//   container,
//   `[app.start] container ${container} not found`,
// );
