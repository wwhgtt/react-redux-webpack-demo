const React = require('react');
const ReactDOM = require('react-dom');
const PosLoginSuccessApplication = require('./container/pos-login-success/application.jsx');
const injectTapEventPlugin = require('react-tap-event-plugin'); injectTapEventPlugin();

ReactDOM.render(
  <PosLoginSuccessApplication />,
  document.getElementById('app-placeholder')
);
