const React = require('react');
const ReactDOM = require('react-dom');
const ExceptionDishApplication = require('./container/exception-dish/application.jsx');
const injectTapEventPlugin = require('react-tap-event-plugin'); injectTapEventPlugin();
ReactDOM.render(
  <ExceptionDishApplication />,
  document.getElementById('app-placeholder')
);
