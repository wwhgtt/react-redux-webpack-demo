require('core-js/shim');
const React = require('react');
const ReactDOM = require('react-dom');
const createStore = require('redux').createStore;
const applyMiddleware = require('redux').applyMiddleware;
const compose = require('redux').compose;
const Provider = require('react-redux').Provider;
const thunkMiddleware = require('redux-thunk').default;
const reducer = require('./reducer/dish-menu/index.js');

const DevTools = require('./container/dev/devtools.jsx').default;
const DishMenuApplication = require('./container/dish-menu/application.jsx');

const injectTapEventPlugin = require('react-tap-event-plugin'); injectTapEventPlugin();

const storeCreator = compose(applyMiddleware(thunkMiddleware), DevTools.instrument())(createStore);
const store = storeCreator(reducer);
ReactDOM.render(
  <Provider store={store}>
    <div>
      <DishMenuApplication />
      {/* <DevTools />*/}
    </div>
  </Provider>,
  document.getElementById('app-placeholder')
);
