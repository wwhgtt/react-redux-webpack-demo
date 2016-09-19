const React = require('react');
const ReactDOM = require('react-dom');
const ExceptionLinkApplication = require('./container/exception-link/application.jsx');
const injectTapEventPlugin = require('react-tap-event-plugin'); injectTapEventPlugin();

ReactDOM.render(
  <ExceptionLinkApplication />,
  document.getElementById('app-placeholder')
);
