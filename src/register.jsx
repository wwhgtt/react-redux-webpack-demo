const React = require('react');
const ReactDOM = require('react-dom');
const createStore = require('redux').createStore;
const applyMiddleware = require('redux').applyMiddleware;
const compose = require('redux').compose;
const Provider = require('react-redux').Provider;
const thunkMiddleware = require('redux-thunk').default;
const reducer = require('./reducer/register/index.js');
const RegisterApplication = require('./container/mine-register/application.jsx');
const injectTapEventPlugin = require('react-tap-event-plugin'); injectTapEventPlugin();
const logger = require('./helper/logger.js');
let storeCreator;
if (process.env.NODE_ENV === 'production') {
  storeCreator = compose(applyMiddleware(thunkMiddleware))(createStore);
} else {
  storeCreator = compose(applyMiddleware(thunkMiddleware, logger))(createStore);
}
const store = storeCreator(reducer);
ReactDOM.render(
  <Provider store={store}>
      <RegisterApplication />
  </Provider>,
  document.getElementById('app-holder')
);
