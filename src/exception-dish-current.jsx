const React = require('react');
const ReactDOM = require('react-dom');
const ExceptionDishCurrentApplication = require('./container/exception-dish-current/application.jsx');
const injectTapEventPlugin = require('react-tap-event-plugin'); injectTapEventPlugin();

ReactDOM.render(
  <ExceptionDishCurrentApplication />,
  document.getElementById('app-placeholder')
);
