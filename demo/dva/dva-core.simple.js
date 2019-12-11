export function create(hooksAndOpts = {}, createOpts = {}) {
  // ...
  const plugin = new Plugin();
  const app = {
    use: plugin.use.bind(plugin),
    model,
    start
  }
  return app;

  function model(m) {}
  function injectModel(createReducer, onError, unlisteners, m) {}
  function unmodel(createReducer, reducers, unlisteners, namespace) {}
  function replaceModel(createReducer, reducers, unlisteners, onError, m) {}
  function start() {
    // ...
    app.model = injectModel.bind(app, createReducer, onError, unlisteners);
    app.unmodel = unmodel.bind(app, createReducer, reducers, unlisteners);
    app.replaceModel = replaceModel.bind(app, createReducer, reducers, unlisteners, onError);
    // ...
  }
}

// const app = {
//   _models: [ { namespace: '@@dva', state: 0, reducers: [Object] } ],
//   _store:
//    { dispatch: [Function],
//      subscribe: [Function: subscribe],
//      getState: [Function: getState],
//      replaceReducer: [Function: replaceReducer],
//      runSaga: [Function: bound runSaga],
//      asyncReducers: {},
//      [Symbol(observable)]: [Function: observable] },
//   _plugin:
//    Plugin {
//      _handleActions: null,
//      hooks:
//       { onError: [],
//         onStateChange: [],
//         onAction: [],
//         onHmr: [],
//         onReducer: [],
//         onEffect: [],
//         extraReducers: [],
//         extraEnhancers: [],
//         _handleActions: [] } },
//   _getSaga: [Function: bound getSaga],

//   use: [Function: bound use],
//   model: [Function: bound injectModel],
//   start: [Function: start],
//   unmodel: [Function: bound unmodel],
//   replaceModel: [Function: bound replaceModel]
// };