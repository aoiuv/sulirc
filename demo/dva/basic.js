const { create } = require("dva-core");

function enhancer(reducer) {
  return (state, action) => {
    if (action.type === "square") {
      return state * state;
    }

    return reducer(state, action);
  };
}

const app = create({
  // onStateChange(state) {
  //   console.log('on state change', state);
  // }
});

// app.model({
//   namespace: "count",
//   state: 3,
//   reducers: [
//     {
//       add(state, { payload }) {
//         return state + (payload || 1);
//       }
//     },
//     enhancer
//   ]
// });
app.start();

// app._store.dispatch({ type: "square" });
// app._store.dispatch({ type: "count/add" });

// console.log(app._store.getState())
console.log(app);